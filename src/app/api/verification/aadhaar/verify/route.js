import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Owner from '@/lib/models/Owner';
import { verifyAccessToken } from '@/lib/utils/jwt';

export async function GET(request) {
  try {
    // Get and verify JWT token
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
        { error: 'Forbidden', message: 'Only owners can check verification status' },
        { status: 403 }
      );
    }

    // Return verification status
    const verification = owner.verification;

    return NextResponse.json({
      success: true,
      verification: {
        status: verification.status,
        aadhaarNumber: verification.aadhaarNumber ?
          verification.aadhaarNumber.replace(/\d(?=\d{4})/g, 'X') : null,
        digilockerLinked: verification.digilockerLinked,
        verifiedAt: verification.verifiedAt,
        rejectionReason: verification.rejectionReason,
        documents: verification.verificationDocuments?.map(doc => ({
          type: doc.type,
          uploadedAt: doc.uploadedAt
        }))
      }
    });

  } catch (error) {
    console.error('Verification status error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.'
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Mock verification for testing - just return "verified" status
    if (process.env.MOCK_VERIFICATION === 'true') {
      return NextResponse.json({
        success: true,
        status: 'verified',
        message: 'Mock verification completed successfully'
      });
    }

    return NextResponse.json(
      {
        error: 'Not implemented',
        message: 'Real verification system not implemented yet'
      },
      { status: 501 }
    );

  } catch (error) {
    console.error('Aadhaar verification error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.'
      },
      { status: 500 }
    );
  }
}