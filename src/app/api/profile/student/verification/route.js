import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/connect';
import Student from '@/lib/models/Student';

// Helper function to verify JWT token and get user
async function getAuthenticatedUser(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No valid authorization header found' };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId || decoded.role?.toLowerCase() !== 'student') {
      return { error: 'Invalid token or unauthorized access' };
    }

    await connectDB();
    const user = await Student.findById(decoded.userId);

    if (!user) {
      return { error: 'User not found' };
    }

    return { user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Invalid or expired token' };
  }
}

// GET /api/profile/student/verification - Get verification status
export async function GET(request) {
  try {
    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    const verificationData = {
      status: user.verification?.status || 'pending',
      collegeIdCard: user.verification?.collegeIdCard || null,
      aadhaarCard: user.verification?.aadhaarCard || null,
      verifiedAt: user.verification?.verifiedAt || null,
      rejectionReason: user.verification?.rejectionReason || null
    };

    return NextResponse.json({
      success: true,
      data: verificationData
    });

  } catch (error) {
    console.error('Error fetching verification status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch verification status'
    }, { status: 500 });
  }
}

// POST /api/profile/student/verification - Upload verification documents
export async function POST(request) {
  try {
    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    const formData = await request.formData();
    const collegeIdCard = formData.get('collegeIdCard');

    if (!collegeIdCard) {
      return NextResponse.json({
        success: false,
        error: 'College ID card is required'
      }, { status: 400 });
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    const maxSize = 5000000; // 5MB

    if (!allowedTypes.includes(collegeIdCard.type)) {
      return NextResponse.json({
        success: false,
        error: 'College ID card must be JPEG, PNG, or PDF format'
      }, { status: 400 });
    }

    if (collegeIdCard.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File size should be less than 5MB'
      }, { status: 400 });
    }

    // For now, we'll just simulate document upload
    // In production, you would upload to cloud storage
    const timestamp = Date.now();
    const fileExtension = collegeIdCard.type.split('/')[1];
    const documentUrl = `/uploads/verification/student/college-id-${user._id}-${timestamp}.${fileExtension}`;

    // Update user verification status
    user.verification = {
      ...user.verification,
      collegeIdCard: documentUrl,
      status: 'in-review'
    };

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Verification document uploaded successfully',
      data: user.verification
    });

  } catch (error) {
    console.error('Error uploading verification documents:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to upload verification documents'
    }, { status: 500 });
  }
}