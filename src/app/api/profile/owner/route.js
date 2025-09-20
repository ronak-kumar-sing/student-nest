import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/connect';
import Owner from '@/lib/models/Owner';
import { z } from 'zod';

// Validation schema for owner profile updates
const ownerProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+?\d{10,15}$/).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  businessName: z.string().optional(),
  businessType: z.enum(['individual', 'company', 'partnership']).optional(),
  businessDescription: z.string().max(1000).optional(),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).optional(),
  experience: z.number().min(0).optional(),
  licenseNumber: z.string().optional()
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

    if (!decoded.userId || decoded.role?.toLowerCase() !== 'owner') {
      return { error: 'Invalid token or unauthorized access' };
    }

    await connectDB();
    const user = await Owner.findById(decoded.userId);

    if (!user) {
      return { error: 'User not found' };
    }

    return { user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Invalid or expired token' };
  }
}

// GET /api/profile/owner - Get owner profile
export async function GET(request) {
  try {
    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    // Calculate business statistics
    const profileData = {
      ...user.toPublicProfile(),
      profileCompletion: user.profileCompletion,
      // Business statistics that the frontend expects
      totalProperties: user.totalProperties,
      activeListings: user.activeListings,
      totalTenants: user.totalTenants,
      totalBookings: user.totalBookings,
      averageRating: user.averageRating,
      // Verification status
      isVerified: user.verification?.status === 'verified',
      verificationStatus: user.verification?.status,
      // Member info
      memberSince: user.createdAt
    };

    return NextResponse.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Error fetching owner profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch profile'
    }, { status: 500 });
  }
}

// PUT /api/profile/owner - Update owner profile
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
    const validationResult = ownerProfileSchema.safeParse(body);
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
      const existingUser = await Owner.findOne({
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
      const existingUser = await Owner.findOne({
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

    // Update the user
    Object.assign(user, updateData);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toPublicProfile()
    });

  } catch (error) {
    console.error('Error updating owner profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update profile'
    }, { status: 500 });
  }
}

// DELETE /api/profile/owner - Delete owner profile
export async function DELETE(request) {
  try {
    const { user, error } = await getAuthenticatedUser(request);
    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    // Optional: Add confirmation check
    const url = new URL(request.url);
    const confirmDelete = url.searchParams.get('confirm');

    if (confirmDelete !== 'true') {
      return NextResponse.json({
        success: false,
        error: 'Please confirm account deletion by adding ?confirm=true to the request'
      }, { status: 400 });
    }

    // Log the deletion attempt
    console.log(`Deleting owner account: ${user.email} (${user._id})`);

    // Delete the user account
    await Owner.findByIdAndDelete(user._id);

    return NextResponse.json({
      success: true,
      message: 'Owner profile deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting owner profile:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete profile'
    }, { status: 500 });
  }
}