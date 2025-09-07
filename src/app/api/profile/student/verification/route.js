import { NextResponse } from 'next/server';

// Mock database
let studentProfiles = [
  {
    id: 1,
    userId: 1,
    emailVerified: true,
    phoneVerified: true,
    collegeIdVerified: "verified",
    collegeIdDocument: "/uploads/documents/college-id-1.pdf",
    verificationSubmittedAt: "2024-08-15T10:30:00Z",
    verificationUpdatedAt: "2024-08-20T14:45:00Z",
  }
];

export async function GET(request) {
  try {
    const userId = 1; // Mock user ID

    const profile = studentProfiles.find(p => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const verificationStatus = {
      email: {
        verified: profile.emailVerified,
        verifiedAt: profile.emailVerifiedAt || null
      },
      phone: {
        verified: profile.phoneVerified,
        verifiedAt: profile.phoneVerifiedAt || null
      },
      collegeId: {
        status: profile.collegeIdVerified,
        document: profile.collegeIdDocument,
        submittedAt: profile.verificationSubmittedAt,
        updatedAt: profile.verificationUpdatedAt,
        rejectionReason: profile.rejectionReason || null
      }
    };

    return NextResponse.json({
      success: true,
      data: verificationStatus
    });

  } catch (error) {
    console.error('Error fetching student verification status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const userId = 1; // Mock user ID
    const file = formData.get('collegeIdDocument');

    if (!file) {
      return NextResponse.json(
        { error: 'College ID document is required' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, and PDF files are allowed' },
        { status: 400 }
      );
    }

    if (file.size > 5000000) { // 5MB
      return NextResponse.json(
        { error: 'File size should be less than 5MB' },
        { status: 400 }
      );
    }

    // In production, upload file to cloud storage
    const fileName = `college-id-${userId}-${Date.now()}.${file.type.split('/')[1]}`;
    const documentUrl = `/uploads/documents/${fileName}`;

    // Update profile
    const profileIndex = studentProfiles.findIndex(p => p.userId === userId);
    if (profileIndex !== -1) {
      studentProfiles[profileIndex] = {
        ...studentProfiles[profileIndex],
        collegeIdDocument: documentUrl,
        collegeIdVerified: "pending",
        verificationSubmittedAt: new Date().toISOString(),
        verificationUpdatedAt: new Date().toISOString(),
        rejectionReason: null
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        documentUrl,
        status: "pending",
        message: "College ID document uploaded successfully. Verification is in progress."
      }
    });

  } catch (error) {
    console.error('Error uploading college ID document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
