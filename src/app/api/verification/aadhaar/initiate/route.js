import { NextResponse } from 'next/server';import { NextResponse } from 'next/server';

import connectDB from '@/lib/db/connection';import { aadhaarVerificationSchema } from '@/lib/validation/authSchemas';

import Owner from '@/lib/models/Owner';

import { aadhaarVerificationSchema } from '@/lib/validation/authSchemas';// POST /api/verification/aadhaar/initiate - Initiate Aadhaar verification

import { verifyAccessToken } from '@/lib/utils/jwt';export async function POST(request) {

  try {

export async function POST(request) {    const body = await request.json();

  try {

    // Get and verify JWT token    // Validate Aadhaar data

    const authHeader = request.headers.get('authorization');    const validation = aadhaarVerificationSchema.safeParse(body);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {    if (!validation.success) {

      return NextResponse.json(      return NextResponse.json(

        { error: 'Unauthorized', message: 'Access token required' },        {

        { status: 401 }          success: false,

      );          errors: validation.error.errors.map(e => e.message)

    }        },

        { status: 400 }

    const token = authHeader.split(' ')[1];      );

    let payload;    }



    try {    const { aadhaarNumber } = validation.data;

      payload = verifyAccessToken(token);

    } catch (error) {    // In production:

      return NextResponse.json(    // 1. Mask Aadhaar number for storage (only last 4 digits visible)

        { error: 'Unauthorized', message: 'Invalid or expired token' },    // 2. Store verification request in database

        { status: 401 }    // 3. Integrate with Aadhaar verification service

      );    // 4. Set status to 'in-review'

    }    // 5. Notify admin team for manual review



    const body = await request.json();    console.log(`Demo: Initiating Aadhaar verification for: ${aadhaarNumber.replace(/\d(?=\d{4})/g, '*')}`);



    // Validate input    return NextResponse.json({

    const validationResult = aadhaarVerificationSchema.safeParse(body);      success: true,

    if (!validationResult.success) {      data: {

      return NextResponse.json(        verificationId: `ver_${Math.random().toString(36).substr(2, 9)}`,

        {        status: 'in-review',

          error: 'Validation failed',        aadhaarNumber: aadhaarNumber.replace(/\d(?=\d{4})/g, '*'),

          details: validationResult.error.errors        submittedAt: new Date().toISOString()

        },      },

        { status: 400 }      message: 'Aadhaar verification initiated. We will review your details within 1-2 business days.'

      );    }, { status: 202 });

    }  } catch (error) {

    return NextResponse.json(

    const { aadhaarNumber, documents } = validationResult.data;      { success: false, error: 'Verification initiation failed' },

          { status: 500 }

    // Connect to database    );

    await connectDB();  }

    }

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

    // Mock verification process
    const mockDelay = Math.random() * 2000 + 1000; // 1-3 seconds delay
    await new Promise(resolve => setTimeout(resolve, mockDelay));

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
      verificationDocuments: documents || [],
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