import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import Verification from '@/lib/models/Verification';
import { verifyAccessToken } from '@/lib/utils/jwt';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No auth header' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    await connectDB();
    const user = await User.findById(decoded.userId);
    const verification = await Verification.findOne({ userId: user._id });

    if (!verification) {
      return NextResponse.json({
        success: false,
        error: 'No verification record found'
      });
    }

    // Check if user should be marked as verified based on completed documents and selfie
    const hasDocument = verification.documents && verification.documents.length > 0;
    const hasSelfie = verification.selfie && verification.selfie.fileUrl;

    let shouldBeVerified = false;
    let updates = {};

    if (hasDocument && hasSelfie && verification.status !== 'verified') {
      // Mark verification as complete
      verification.status = 'verified';
      verification.completedAt = new Date();
      verification.verificationLevel = 'full';
      verification.progress = 100;

      // Update user verification status
      updates = {
        isIdentityVerified: true,
        identityVerificationRequired: false
      };
      shouldBeVerified = true;

      await verification.save();
      await User.findByIdAndUpdate(user._id, updates);
    }

    // Get updated status
    const updatedUser = await User.findById(decoded.userId);
    const updatedVerification = await Verification.findOne({ userId: user._id });

    return NextResponse.json({
      success: true,
      updated: shouldBeVerified,
      message: shouldBeVerified ? 'User marked as verified' : 'No updates needed',
      data: {
        user: {
          isIdentityVerified: updatedUser.isIdentityVerified,
          identityVerificationRequired: updatedUser.identityVerificationRequired
        },
        verification: {
          status: updatedVerification.status,
          hasDocument,
          hasSelfie,
          completedAt: updatedVerification.completedAt
        }
      }
    });

  } catch (error) {
    console.error('Fix verification error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}