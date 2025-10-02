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
    if (decoded.role !== 'admin') {
      return { error: 'Admin access required', status: 403 };
    }
    return { admin: decoded };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
}

export async function GET(request) {
  try {
    // Verify admin access
    const adminCheck = await verifyAdmin(request);
    if (adminCheck.error) {
      return NextResponse.json({
        success: false,
        message: adminCheck.error
      }, { status: adminCheck.status });
    }

    await connectDB();

    // Get all users with verification status
    const users = await User.find({
      role: { $in: ['student', 'owner', 'Student', 'Owner'] }
    })
    .select('-password -refreshTokens')
    .sort({ createdAt: -1 })
    .limit(100);

    // Get all verifications
    const verifications = await Verification.find({})
      .populate('userId', 'fullName email phone role')
      .sort({ createdAt: -1 })
      .limit(50);

    // Get statistics
    const stats = {
      totalUsers: await User.countDocuments({ role: { $in: ['student', 'owner', 'Student', 'Owner'] } }),
      totalStudents: await User.countDocuments({ role: { $in: ['student', 'Student'] } }),
      totalOwners: await User.countDocuments({ role: { $in: ['owner', 'Owner'] } }),
      verifiedUsers: await User.countDocuments({ isIdentityVerified: true }),
      pendingVerifications: await Verification.countDocuments({ status: 'pending' }),
      completedVerifications: await Verification.countDocuments({ status: 'completed' }),
      rejectedVerifications: await Verification.countDocuments({ status: 'rejected' })
    };

    // Get recent activities (last 10 users)
    const recentUsers = await User.find({
      role: { $in: ['student', 'owner', 'Student', 'Owner'] }
    })
    .select('fullName email role createdAt isIdentityVerified')
    .sort({ createdAt: -1 })
    .limit(10);

    // Get pending verification reviews
    const pendingReviews = await Verification.find({
      $or: [
        { status: 'pending' },
        { status: 'submitted' },
        { 'simpleSteps.review': 'pending' }
      ]
    })
    .populate('userId', 'fullName email phone role')
    .sort({ updatedAt: -1 });

    return NextResponse.json({
      success: true,
      data: {
        users,
        verifications,
        stats,
        recentUsers,
        pendingReviews
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}