import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/connect';
import Student from '@/lib/models/Student';
import { z } from 'zod';

// Validation schema for student profile updates
const studentProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+?\d{10,15}$/).optional(),
  collegeId: z.string().min(1).optional(),
  collegeName: z.string().min(1).optional(),
  course: z.string().optional(),
  yearOfStudy: z.number().min(1).max(6).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional()
});

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

// GET /api/profile/student - Get student profile
export async function GET(request) {
  try {
    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    // Calculate additional profile statistics
    const profileData = {
      ...user.toPublicProfile(),
      profileCompleteness: user.profileCompleteness,
      // Add calculated fields that frontend expects
      savedPropertiesCount: user.savedProperties?.length || 0,
      isVerified: user.verification?.status === 'verified',
      memberSince: user.createdAt,
      lastActive: user.lastActive,
      viewCount: user.viewCount || 0
    };

    // Structure response to match frontend expectations
    return NextResponse.json({
      success: true,
      data: {
        profile: profileData,
        verificationStatus: {
          status: user.verification?.status || 'pending',
          documents: user.verification?.documents || [],
          isVerified: user.verification?.status === 'verified'
        },
        activityStats: {
          viewCount: user.viewCount || 0,
          savedPropertiesCount: user.savedProperties?.length || 0,
          profileCompleteness: user.profileCompleteness,
          lastActive: user.lastActive
        }
      }
    });

  } catch (error) {
    console.error('Error fetching student profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch profile'
    }, { status: 500 });
  }
}

// PUT /api/profile/student - Update student profile
export async function PUT(request) {
  try {
    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    const body = await request.json();

    // Validate the request body
    const validationResult = studentProfileSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid data',
        details: validationResult.error.issues
      }, { status: 400 });
    }

    const updateData = validationResult.data;

    // Check if email is being updated and if it's unique
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await Student.findOne({
        email: updateData.email,
        _id: { $ne: user._id }
      });

      if (existingUser) {
        return NextResponse.json({
          success: false,
          error: 'Email already exists'
        }, { status: 400 });
      }
    }

    // Check if phone is being updated and if it's unique
    if (updateData.phone && updateData.phone !== user.phone) {
      const existingUser = await Student.findOne({
        phone: updateData.phone,
        _id: { $ne: user._id }
      });

      if (existingUser) {
        return NextResponse.json({
          success: false,
          error: 'Phone number already exists'
        }, { status: 400 });
      }
    }

    // Update last active timestamp
    updateData.lastActive = new Date();

    // Update the user
    Object.assign(user, updateData);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toPublicProfile()
    });

  } catch (error) {
    console.error('Error updating student profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update profile'
    }, { status: 500 });
  }
}
