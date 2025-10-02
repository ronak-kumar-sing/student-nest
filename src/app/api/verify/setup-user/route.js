import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import { verifyAccessToken } from '@/lib/utils/jwt';

// Setup endpoint to ensure user has proper verification fields
export async function POST(request) {
  try {
    console.log('=== SETUP USER VERIFICATION ===');

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'No valid authorization header found'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    if (!decoded.userId) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token payload'
      }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Check if user needs verification fields setup
    let needsUpdate = false;
    const updates = {};

    // Ensure isIdentityVerified field exists
    if (user.isIdentityVerified === undefined) {
      updates.isIdentityVerified = false;
      needsUpdate = true;
    }

    // Ensure identityVerificationRequired field exists
    if (user.identityVerificationRequired === undefined) {
      const isOwner = user.role?.toLowerCase() === 'owner';
      updates.identityVerificationRequired = isOwner;
      needsUpdate = true;
    }

    // Ensure identityVerificationSkipped field exists
    if (user.identityVerificationSkipped === undefined) {
      updates.identityVerificationSkipped = false;
      needsUpdate = true;
    }

    if (needsUpdate) {
      console.log('Updating user with verification fields:', updates);
      await User.findByIdAndUpdate(user._id, updates);
      console.log('✅ User updated with verification fields');
    } else {
      console.log('✅ User already has all verification fields');
    }

    // Get updated user
    const updatedUser = await User.findById(decoded.userId);

    return NextResponse.json({
      success: true,
      message: 'User verification setup completed',
      data: {
        userId: updatedUser._id,
        role: updatedUser.role,
        isIdentityVerified: updatedUser.isIdentityVerified,
        identityVerificationRequired: updatedUser.identityVerificationRequired,
        identityVerificationSkipped: updatedUser.identityVerificationSkipped,
        updated: needsUpdate,
        fieldsUpdated: Object.keys(updates)
      }
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      debug: { message: error.message }
    }, { status: 500 });
  }
}