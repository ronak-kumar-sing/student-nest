import { NextResponse } from 'next/server';
import { studentPreferencesSchema } from '@/lib/validation/profileSchemas';

// Mock database
let studentProfiles = [
  {
    id: 1,
    userId: 1,
    roomTypePreference: ["single", "shared"],
    budgetMin: 8000,
    budgetMax: 15000,
    locationPreferences: ["Near Metro", "Close to College"],
    amenityPreferences: ["WiFi", "AC", "Laundry"],
    updatedAt: new Date().toISOString(),
  }
];

export async function GET(request) {
  try {
    const userId = 1; // Mock user ID

    const profile = studentProfiles.find(p => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile preferences not found' },
        { status: 404 }
      );
    }

    const preferences = {
      roomTypePreference: profile.roomTypePreference,
      budgetMin: profile.budgetMin,
      budgetMax: profile.budgetMax,
      locationPreferences: profile.locationPreferences,
      amenityPreferences: profile.amenityPreferences,
    };

    return NextResponse.json({
      success: true,
      data: preferences
    });

  } catch (error) {
    console.error('Error fetching student preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const userId = 1; // Mock user ID

    // Validate input
    const validatedData = studentPreferencesSchema.parse(body);

    // Find and update profile
    const profileIndex = studentProfiles.findIndex(p => p.userId === userId);

    if (profileIndex === -1) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Update preferences
    studentProfiles[profileIndex] = {
      ...studentProfiles[profileIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: validatedData,
      message: 'Preferences updated successfully'
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating student preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
