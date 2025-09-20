import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db/connect';
import Student from '@/lib/models/Student';
import { z } from 'zod';

// Validation schema for student preferences
const studentPreferencesSchema = z.object({
  roomTypePreference: z.array(z.enum(['single', 'shared', 'studio', 'pg'])).optional(),
  budgetMin: z.number().min(2000).max(50000).optional(),
  budgetMax: z.number().min(2000).max(50000).optional(),
  locationPreferences: z.array(z.string()).optional(),
  amenityPreferences: z.array(z.string()).optional()
}).refine((data) => {
  if (data.budgetMin && data.budgetMax) {
    return data.budgetMin <= data.budgetMax;
  }
  return true;
}, {
  message: "Budget minimum cannot be greater than budget maximum",
  path: ["budgetMin"]
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

// GET /api/profile/student/preferences - Get student preferences
export async function GET(request) {
  try {
    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    // Return current preferences or defaults
    const preferences = user.preferences || {
      roomTypePreference: [],
      budgetMin: 5000,
      budgetMax: 15000,
      locationPreferences: [],
      amenityPreferences: []
    };

    return NextResponse.json({
      success: true,
      data: preferences
    });

  } catch (error) {
    console.error('Error fetching student preferences:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch preferences'
    }, { status: 500 });
  }
}

// PUT /api/profile/student/preferences - Update student preferences
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
    const validationResult = studentPreferencesSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid preferences data',
        details: validationResult.error.issues
      }, { status: 400 });
    }

    const preferencesData = validationResult.data;

    // Update the user's preferences
    user.preferences = {
      ...user.preferences,
      ...preferencesData
    };

    // Update last active timestamp
    user.lastActive = new Date();

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    });

  } catch (error) {
    console.error('Error updating student preferences:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update preferences'
    }, { status: 500 });
  }
}
