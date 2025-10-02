import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import Verification from '@/lib/models/Verification';
import { verifyAccessToken } from '@/lib/utils/jwt';

// Test endpoint to check user and verification data connection
export async function GET(request) {
  try {
    console.log('=== TEST ENDPOINT: Checking user verification data ===');

    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header');
      return NextResponse.json({
        success: false,
        error: 'No valid authorization header found',
        debug: { authHeader: !!authHeader }
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('Token extracted:', token ? 'Present' : 'Missing');

    let decoded;
    try {
      decoded = verifyAccessToken(token);
      console.log('Token decoded successfully:', { userId: decoded.userId, role: decoded.role });
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired token',
        debug: { tokenError: error.message }
      }, { status: 401 });
    }

    if (!decoded.userId) {
      console.log('❌ No userId in token');
      return NextResponse.json({
        success: false,
        error: 'Invalid token payload - no userId'
      }, { status: 401 });
    }

    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    console.log('✅ Database connected');

    // Find user
    console.log('Finding user with ID:', decoded.userId);
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.log('❌ User not found in database');
      return NextResponse.json({
        success: false,
        error: 'User not found',
        debug: { userId: decoded.userId }
      }, { status: 404 });
    }

    console.log('✅ User found:', {
      id: user._id,
      email: user.email,
      role: user.role,
      isIdentityVerified: user.isIdentityVerified,
      identityVerificationRequired: user.identityVerificationRequired,
      identityVerificationSkipped: user.identityVerificationSkipped
    });

    // Find verification record
    console.log('Finding verification record...');
    const verification = await Verification.findOne({ userId: user._id });
    console.log('Verification record:', verification ? 'Found' : 'Not found');

    if (verification) {
      console.log('Verification details:', {
        status: verification.status,
        stepsCompleted: verification.steps?.filter(s => s.status === 'completed').length || 0,
        documentsCount: verification.documents?.length || 0,
        selfieUploaded: !!verification.selfie?.fileUrl
      });
    }

    return NextResponse.json({
      success: true,
      message: 'User and verification data retrieved successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          isIdentityVerified: user.isIdentityVerified,
          identityVerificationRequired: user.identityVerificationRequired,
          identityVerificationSkipped: user.identityVerificationSkipped,
          createdAt: user.createdAt
        },
        verification: verification ? {
          id: verification._id,
          status: verification.status,
          stepsCompleted: verification.steps?.filter(s => s.status === 'completed').map(s => s.type) || [],
          documentsCount: verification.documents?.length || 0,
          selfieUploaded: !!verification.selfie?.fileUrl,
          createdAt: verification.createdAt
        } : null,
        debug: {
          tokenValid: true,
          databaseConnected: true,
          userFound: true,
          verificationExists: !!verification
        }
      }
    });

  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      debug: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}