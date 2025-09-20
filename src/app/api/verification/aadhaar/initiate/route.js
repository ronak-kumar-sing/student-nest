import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import { aadhaarVerificationSchema } from '@/lib/validation/authSchemas';
import Owner from '@/lib/models/Owner';
import { verifyAccessToken } from '@/lib/utils/jwt';

// POST /api/verification/aadhaar/initiate - Initiate Aadhaar verification
export async function POST(request) {
  try {
    // Get and verify JWT token first
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Access token required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = aadhaarVerificationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.errors.map(e => e.message)
        },
        { status: 400 }
      );
    }

    const { aadhaarNumber } = validation.data;

    // Connect to database
    await connectDB();

    // Find the owner
    const owner = await Owner.findById(payload.userId);
    if (!owner) {
      return NextResponse.json(
        { error: 'User not found', message: 'Owner account not found' },
        { status: 404 }
      );
    }

    if (owner.role !== 'owner') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only owners can initiate Aadhaar verification' },
        { status: 403 }
      );
    }

    // Mock Aadhaar validation
    const isValidAadhaar = /^\d{12}$/.test(aadhaarNumber);
    if (!isValidAadhaar) {
      return NextResponse.json(
        {
          error: 'Invalid Aadhaar',
          message: 'Please provide a valid 12-digit Aadhaar number'
        },
        { status: 400 }
      );
    }

    // In production, integrate with actual Aadhaar verification service
    // For now, using mock verification process
    console.log(`Demo: Initiating Aadhaar verification for: ${aadhaarNumber.replace(/\d(?=\d{4})/g, '*')}`);

    // Mock verification data (in real implementation, this would come from DigiLocker API)
    const mockDigiLockerData = {
      name: owner.fullName,
      dob: '1990-01-01',
      gender: 'M',
      address: 'Mock Address, City, State - 123456'
    };

    // Update owner verification status
    await owner.initiateVerification({
      aadhaarNumber,
      digilockerLinked: true,
      digilockerData: mockDigiLockerData,
      verificationDocuments: [],
      status: 'in-review'
    });

    // In mock mode, auto-approve after a delay (simulating manual review)
    if (process.env.MOCK_VERIFICATION === 'true') {
      setTimeout(async () => {
        try {
          const ownerToUpdate = await Owner.findById(payload.userId);
          if (ownerToUpdate && ownerToUpdate.verification.status === 'in-review') {
            await ownerToUpdate.approveVerification();
            console.log(`✅ Mock verification approved for owner: ${ownerToUpdate.fullName}`);
          }
        } catch (error) {
          console.error('Error in mock auto-approval:', error);
        }
      }, 5000); // Auto-approve after 5 seconds
    }

    return NextResponse.json({
      success: true,
      message: 'Aadhaar verification initiated successfully',
      verification: {
        status: owner.verification.status,
        aadhaarNumber: aadhaarNumber.replace(/\d(?=\d{4})/g, 'X'), // Mask Aadhaar number
        digilockerLinked: true,
        message: process.env.MOCK_VERIFICATION === 'true'
          ? 'Verification will be completed automatically in mock mode'
          : 'Verification is under review and will be completed within 24-48 hours'
      }
    });

  } catch (error) {
    console.error('Aadhaar verification initiate error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.'
      },
      { status: 500 }
    );
  }
}