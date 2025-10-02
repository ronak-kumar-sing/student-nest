import { connectDB } from '@/lib/db/connection';
import User from '@/lib/models/User';
import Verification from '@/lib/models/Verification';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

// Middleware to verify admin access
async function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    if (decoded.role !== 'admin' || !decoded.permissions?.includes('review_verifications')) {
      return { error: 'Admin verification review access required', status: 403 };
    }
    return { admin: decoded };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
}

// GET - Get verification details for review
export async function GET(request) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (adminCheck.error) {
      return NextResponse.json({
        success: false,
        message: adminCheck.error
      }, { status: adminCheck.status });
    }

    const { searchParams } = new URL(request.url);
    const verificationId = searchParams.get('id');
    const userId = searchParams.get('userId');

    await connectDB();

    let verification;
    if (verificationId) {
      verification = await Verification.findById(verificationId)
        .populate('userId', 'fullName email phone role createdAt');
    } else if (userId) {
      verification = await Verification.findOne({ userId })
        .populate('userId', 'fullName email phone role createdAt');
    } else {
      // Get all pending verifications
      const pendingVerifications = await Verification.find({
        $or: [
          { status: 'pending' },
          { status: 'submitted' },
          { 'simpleSteps.review': 'pending' }
        ]
      })
      .populate('userId', 'fullName email phone role createdAt')
      .sort({ updatedAt: -1 });

      return NextResponse.json({
        success: true,
        data: { verifications: pendingVerifications }
      });
    }

    if (!verification) {
      return NextResponse.json({
        success: false,
        message: 'Verification not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { verification }
    });

  } catch (error) {
    console.error('Admin verification review error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

// POST - Approve or reject verification
export async function POST(request) {
  try {
    const adminCheck = await verifyAdmin(request);
    if (adminCheck.error) {
      return NextResponse.json({
        success: false,
        message: adminCheck.error
      }, { status: adminCheck.status });
    }

    const { verificationId, action, notes } = await request.json();

    if (!verificationId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request data'
      }, { status: 400 });
    }

    await connectDB();

    const verification = await Verification.findById(verificationId);
    if (!verification) {
      return NextResponse.json({
        success: false,
        message: 'Verification not found'
      }, { status: 404 });
    }

    const user = await User.findById(verification.userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 });
    }

    if (action === 'approve') {
      // Approve verification
      verification.status = 'completed';
      verification.simpleSteps.review = 'completed';
      verification.adminReview = {
        reviewedBy: adminCheck.admin.userId,
        reviewedAt: new Date(),
        decision: 'approved',
        notes: notes || 'Verification approved by admin'
      };

      // Mark user as verified
      user.isIdentityVerified = true;

    } else {
      // Reject verification
      verification.status = 'rejected';
      verification.simpleSteps.review = 'failed';
      verification.adminReview = {
        reviewedBy: adminCheck.admin.userId,
        reviewedAt: new Date(),
        decision: 'rejected',
        notes: notes || 'Verification rejected by admin'
      };

      // Reset verification status
      user.isIdentityVerified = false;
    }

    verification.updatedAt = new Date();
    await verification.save();
    await user.save();

    return NextResponse.json({
      success: true,
      message: `Verification ${action}d successfully`,
      data: { verification }
    });

  } catch (error) {
    console.error('Admin verification action error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}