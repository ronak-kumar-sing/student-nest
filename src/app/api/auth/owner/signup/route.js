import { NextResponse } from 'next/server';
import { ownerSignupSchema } from '@/lib/validation/authSchemas';

// POST /api/auth/owner/signup - Owner registration
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate owner data
    const validation = ownerSignupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.errors.map(e => e.message)
        },
        { status: 400 }
      );
    }

    const { fullName, email, phone, password } = validation.data;

    // Check if user already exists (in production, check database)
    // For demo purposes, we'll just return success

    // In production:
    // 1. Hash the password
    // 2. Save to database with verificationStatus: 'pending'
    // 3. Send welcome email with verification instructions

    return NextResponse.json({
      success: true,
      data: {
        id: Math.floor(Math.random() * 1000),
        fullName,
        email,
        phone,
        userType: 'owner',
        verificationStatus: 'pending',
        createdAt: new Date().toISOString()
      },
      nextStep: 'verification',
      message: 'Owner account created successfully. Please complete verification.'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
