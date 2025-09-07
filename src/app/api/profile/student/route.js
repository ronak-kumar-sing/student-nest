import { NextResponse } from 'next/server';
import { studentProfileSchema } from '@/lib/validation/profileSchemas';

// Mock database - in production, replace with actual database calls
let studentProfiles = [
  {
    id: 1,
    userId: 1,
    firstName: "John",
    lastName: "Doe",
    bio: "Computer Science student passionate about technology and innovation.",
    avatar: "/api/placeholder/150/150",
    dateOfBirth: "2002-03-15",
    gender: "male",
    collegeId: "CS2021001",
    collegeName: "Indian Institute of Technology Delhi",
    yearOfStudy: "3rd",
    course: "Computer Science and Engineering",
    emailVerified: true,
    phoneVerified: true,
    collegeIdVerified: "verified",
    collegeIdDocument: "/uploads/documents/college-id-1.pdf",
    roomTypePreference: ["single", "shared"],
    budgetMin: 8000,
    budgetMax: 15000,
    locationPreferences: ["Near Metro", "Close to College"],
    amenityPreferences: ["WiFi", "AC", "Laundry"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function GET(request) {
  try {
    // Get user ID from auth token (simplified for demo)
    const userId = 1; // Mock user ID

    const profile = studentProfiles.find(p => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Calculate verification status
    const verificationStatus = {
      email: profile.emailVerified,
      phone: profile.phoneVerified,
      collegeId: profile.collegeIdVerified
    };

    // Calculate activity stats (mock data)
    const activityStats = {
      savedProperties: 12,
      meetingRequests: 5,
      profileViews: 45,
      profileCompleteness: calculateProfileCompleteness(profile)
    };

    return NextResponse.json({
      success: true,
      data: {
        profile,
        verificationStatus,
        activityStats
      }
    });

  } catch (error) {
    console.error('Error fetching student profile:', error);
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
    const validatedData = studentProfileSchema.parse(body);

    // Find and update profile
    const profileIndex = studentProfiles.findIndex(p => p.userId === userId);

    if (profileIndex === -1) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Update profile
    studentProfiles[profileIndex] = {
      ...studentProfiles[profileIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: studentProfiles[profileIndex],
      message: 'Profile updated successfully'
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating student profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateProfileCompleteness(profile) {
  const requiredFields = [
    'firstName', 'lastName', 'bio', 'avatar', 'dateOfBirth',
    'collegeId', 'collegeName', 'yearOfStudy', 'course'
  ];

  const completedFields = requiredFields.filter(field =>
    profile[field] && profile[field] !== ''
  ).length;

  return Math.round((completedFields / requiredFields.length) * 100);
}
