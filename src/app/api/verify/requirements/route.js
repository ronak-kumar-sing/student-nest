import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import Verification from '@/lib/models/Verification';
import { verifyAccessToken } from '@/lib/utils/jwt';

// Helper function to get authenticated user
async function getAuthenticatedUser(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No valid authorization header found' };
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    if (!decoded.userId) {
      return { error: 'Invalid token payload' };
    }

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return { error: 'User not found' };
    }

    return { user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Invalid or expired token' };
  }
}

export async function GET(request) {
  try {
    console.log('=== VERIFY REQUIREMENTS: Processing request ===');
    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      console.log('❌ Authentication failed:', error);
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    console.log('✅ User authenticated:', {
      id: user._id,
      email: user.email,
      role: user.role,
      isIdentityVerified: user.isIdentityVerified
    });

    // Get verification record if exists
    const verification = await Verification.findOne({ userId: user._id });
    console.log('Verification record:', verification ? 'Found' : 'Not found');

    // Determine verification requirements and status
    const isOwner = user.role.toLowerCase() === 'owner';
    const verificationRequired = isOwner || user.identityVerificationRequired;
    const canSkip = !isOwner && !user.identityVerificationRequired;

    const response = {
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          isIdentityVerified: user.isIdentityVerified,
          identityVerificationRequired: verificationRequired,
          identityVerificationSkipped: user.identityVerificationSkipped
        },
        verification: verification ? {
          status: verification.status,
          completedSteps: (verification.steps || []).filter(step => step.status === 'completed').map(step => step.type),
          pendingSteps: (verification.steps || []).filter(step => step.status === 'pending').map(step => step.type),
          lastUpdated: verification.updatedAt,
          // Add simple step tracking based on document and selfie presence
          simpleSteps: {
            document: (verification.documents && verification.documents.length > 0) ? 'completed' : 'pending',
            selfie: (verification.selfie && verification.selfie.fileUrl) ? 'completed' : 'pending',
            review: verification.status === 'verified' ? 'completed' : 'pending'
          }
        } : null,
        requirements: {
          isOwner,
          verificationRequired,
          canSkip,
          mustVerify: verificationRequired && !user.identityVerificationSkipped,
          message: isOwner
            ? 'Identity verification is required for all property owners'
            : canSkip
              ? 'Identity verification is optional for students but recommended for better security'
              : 'Identity verification is required'
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Verification status check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check verification status'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body; // 'skip' or 'require'

    const isOwner = user.role.toLowerCase() === 'owner';

    // Owners cannot skip verification
    if (isOwner && action === 'skip') {
      return NextResponse.json({
        success: false,
        error: 'Property owners must complete identity verification'
      }, { status: 400 });
    }

    // Update user verification preferences
    const updates = {};

    if (action === 'skip') {
      updates.identityVerificationSkipped = true;
      updates.identityVerificationRequired = false;
    } else if (action === 'require') {
      updates.identityVerificationRequired = true;
      updates.identityVerificationSkipped = false;
    }

    await User.findByIdAndUpdate(user._id, updates);

    return NextResponse.json({
      success: true,
      message: action === 'skip'
        ? 'Identity verification skipped. You can enable it later from your profile.'
        : 'Identity verification requirement updated.',
      data: {
        identityVerificationRequired: updates.identityVerificationRequired || false,
        identityVerificationSkipped: updates.identityVerificationSkipped || false
      }
    });

  } catch (error) {
    console.error('Verification requirement update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update verification requirements'
    }, { status: 500 });
  }
}