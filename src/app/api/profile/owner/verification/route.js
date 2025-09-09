import { NextResponse } from 'next/server';

// Mock database
let ownerProfiles = [
  {
    id: 1,
    userId: 2,
    aadhaarNumber: "123456789012", // encrypted in production
    aadhaarVerified: "verified",
    aadhaarDocument: "/uploads/documents/aadhaar-1.pdf",
    digilockerVerified: true,
    panNumber: "ABCDE1234F", // encrypted in production
    panDocument: "/uploads/documents/pan-1.pdf",
    verificationSubmittedAt: "2024-07-10T09:15:00Z",
    verificationUpdatedAt: "2024-07-15T16:30:00Z",
  }
];

export async function GET(request) {
  try {
    const userId = 2; // Mock user ID

    const profile = ownerProfiles.find(p => p.userId === userId);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    const verificationStatus = {
      aadhaar: {
        status: profile.aadhaarVerified,
        document: profile.aadhaarDocument,
        submittedAt: profile.verificationSubmittedAt,
        updatedAt: profile.verificationUpdatedAt,
        rejectionReason: profile.aadhaarRejectionReason || null
      },
      digilocker: {
        verified: profile.digilockerVerified,
        connectedAt: profile.digilockerConnectedAt || null
      },
      pan: {
        status: profile.panDocument ? "verified" : "pending",
        document: profile.panDocument,
        submittedAt: profile.panSubmittedAt,
        updatedAt: profile.panUpdatedAt,
        rejectionReason: profile.panRejectionReason || null
      }
    };

    return NextResponse.json({
      success: true,
      data: verificationStatus
    });

  } catch (error) {
    console.error('Error fetching owner verification status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const userId = 2; // Mock user ID

    const aadhaarFile = formData.get('aadhaarDocument');
    const panFile = formData.get('panDocument');
    const aadhaarNumber = formData.get('aadhaarNumber');
    const panNumber = formData.get('panNumber');

    if (!aadhaarFile || !panFile || !aadhaarNumber || !panNumber) {
      return NextResponse.json(
        { error: 'All verification documents and numbers are required' },
        { status: 400 }
      );
    }

    // Validate file types and sizes
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    const maxSize = 5000000; // 5MB

    const validateFile = (file, name) => {
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`${name}: Only JPEG, PNG, and PDF files are allowed`);
      }
      if (file.size > maxSize) {
        throw new Error(`${name}: File size should be less than 5MB`);
      }
    };

    validateFile(aadhaarFile, 'Aadhaar document');
    validateFile(panFile, 'PAN document');

    // Validate Aadhaar number format
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      return NextResponse.json(
        { error: 'Aadhaar number must be 12 digits' },
        { status: 400 }
      );
    }

    // Validate PAN number format
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      return NextResponse.json(
        { error: 'Invalid PAN number format' },
        { status: 400 }
      );
    }

    // In production, upload files to cloud storage
    const aadhaarFileName = `aadhaar-${userId}-${Date.now()}.${aadhaarFile.type.split('/')[1]}`;
    const panFileName = `pan-${userId}-${Date.now()}.${panFile.type.split('/')[1]}`;

    const aadhaarUrl = `/uploads/documents/${aadhaarFileName}`;
    const panUrl = `/uploads/documents/${panFileName}`;

    // Update profile
    const profileIndex = ownerProfiles.findIndex(p => p.userId === userId);
    if (profileIndex !== -1) {
      ownerProfiles[profileIndex] = {
        ...ownerProfiles[profileIndex],
        aadhaarNumber: aadhaarNumber, // encrypt in production
        aadhaarDocument: aadhaarUrl,
        aadhaarVerified: "pending",
        panNumber: panNumber, // encrypt in production
        panDocument: panUrl,
        verificationSubmittedAt: new Date().toISOString(),
        verificationUpdatedAt: new Date().toISOString(),
        aadhaarRejectionReason: null,
        panRejectionReason: null
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        aadhaarDocument: aadhaarUrl,
        panDocument: panUrl,
        status: "pending",
        message: "Verification documents uploaded successfully. Review is in progress."
      }
    });

  } catch (error) {
    console.error('Error uploading verification documents:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
