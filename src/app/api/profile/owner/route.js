import { NextResponse } from 'next/server';
import { ownerProfileSchema } from '@/lib/validation/profileSchemas';

// Mock database - in production, replace with actual database calls
let ownerProfiles = [
  {
    id: 1,
    userId: 2,
    firstName: "Rajesh",
    lastName: "Kumar",
    bio: "Experienced property owner with 8+ years in student accommodation. Committed to providing safe and comfortable living spaces.",
    avatar: "/api/placeholder/150/150",
    dateOfBirth: "1980-06-20",
    businessName: "Kumar Properties",
    businessType: "individual",
    experience: 8,
    totalProperties: 15,
    businessAddress: "123 Main Street, Sector 18, Noida, UP 201301",
    businessPhone: "+91-9876543210",
    businessEmail: "rajesh@kumarproperties.com",
    gstNumber: "07AABCU9603R1ZV",
    aadhaarNumber: "123456789012", // encrypted in production
    aadhaarVerified: "verified",
    aadhaarDocument: "/uploads/documents/aadhaar-1.pdf",
    digilockerVerified: true,
    panNumber: "ABCDE1234F", // encrypted in production
    panDocument: "/uploads/documents/pan-1.pdf",
    averageRating: 4.7,
    totalReviews: 127,
    responseTime: 2, // hours
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export async function GET(request) {
  try {
    // Get user ID from auth token (simplified for demo)
    const userId = 2; // Mock user ID

    const profile = ownerProfiles.find(p => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Calculate verification status
    const verificationStatus = {
      aadhaar: profile.aadhaarVerified,
      digilocker: profile.digilockerVerified,
      pan: profile.panDocument ? "verified" : "pending"
    };

    // Calculate business stats (mock data)
    const businessStats = {
      totalProperties: profile.totalProperties,
      activeListings: 12,
      totalBookings: 89,
      averageRating: profile.averageRating,
      totalReviews: profile.totalReviews,
      responseTime: profile.responseTime,
      profileCompleteness: calculateProfileCompleteness(profile)
    };

    return NextResponse.json({
      success: true,
      data: {
        profile,
        verificationStatus,
        businessStats
      }
    });

  } catch (error) {
    console.error('Error fetching owner profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const userId = 2; // Mock user ID

    // Validate input
    const validatedData = ownerProfileSchema.parse(body);

    // Find and update profile
    const profileIndex = ownerProfiles.findIndex(p => p.userId === userId);

    if (profileIndex === -1) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Update profile
    ownerProfiles[profileIndex] = {
      ...ownerProfiles[profileIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: ownerProfiles[profileIndex],
      message: 'Profile updated successfully'
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating owner profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function calculateProfileCompleteness(profile) {
  const requiredFields = [
    'firstName', 'lastName', 'bio', 'avatar', 'businessName',
    'businessType', 'experience', 'businessAddress', 'businessPhone',
    'businessEmail', 'aadhaarVerified', 'panDocument'
  ];

  const completedFields = requiredFields.filter(field => {
    const value = profile[field];
    if (field === 'aadhaarVerified') return value === 'verified';
    return value && value !== '';
  }).length;

  return Math.round((completedFields / requiredFields.length) * 100);
}
