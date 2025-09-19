import { NextResponse } from 'next/server';import { NextResponse } from 'next/server';

import connectDB from '@/lib/db/connection';

import OTP from '@/lib/models/OTP';// POST /api/otp/email/verify - Verify email OTP

import { otpVerificationSchema, normalizeEmail } from '@/lib/validation/authSchemas';export async function POST(request) {

import { RateLimiterMemory } from 'rate-limiter-flexible';  try {

    const { value, code } = await request.json();

// Rate limiter: 5 verification attempts per 15 minutes per email

const rateLimiter = new RateLimiterMemory({    if (!value || !code) {

  keyGenerator: (req, email) => `${req.ip || 'unknown'}-${email}`,      return NextResponse.json(

  points: 5,        { success: false, error: 'Email and OTP code are required' },

  duration: 15 * 60, // 15 minutes        { status: 400 }

});      );

    }

export async function POST(request) {

  try {    // In production:

    const body = await request.json();    // 1. Check if OTP exists and is not expired

    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';    // 2. Verify OTP matches

        // 3. Mark email as verified

    // Validate input    // 4. Delete used OTP

    const validationData = {

      identifier: body.email || body.value,    // For demo, accept 123456 as valid OTP

      code: body.code || body.otp,    if (code === "123456") {

      type: 'email'      return NextResponse.json({

    };        success: true,

            message: 'Email verified successfully'

    const validationResult = otpVerificationSchema.safeParse(validationData);      });

    if (!validationResult.success) {    } else {

      return NextResponse.json(      return NextResponse.json(

        {        { success: false, error: 'Invalid OTP code' },

          error: 'Validation failed',        { status: 400 }

          details: validationResult.error.errors      );

        },    }

        { status: 400 }  } catch (error) {

      );    return NextResponse.json(

    }      { success: false, error: 'Verification failed' },

      { status: 500 }

    const { identifier, code } = validationResult.data;    );

    const email = normalizeEmail(identifier);  }

    }

    // Check rate limit
    try {
      await rateLimiter.consume(clientIP, email);
    } catch (rateLimiterRes) {
      return NextResponse.json(
        {
          error: 'Too many attempts',
          message: `Please wait ${Math.round(rateLimiterRes.msBeforeNext / 1000)} seconds before trying again`,
          retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000)
        },
        { status: 429 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the most recent valid OTP
    const otp = await OTP.findOne({
      identifier: email,
      type: 'email',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!otp) {
      return NextResponse.json(
        {
          error: 'Invalid or expired OTP',
          message: 'The OTP is invalid or has expired. Please request a new one.'
        },
        { status: 400 }
      );
    }

    // Verify the OTP
    try {
      await otp.verify(code);

      return NextResponse.json({
        success: true,
        message: 'Email verified successfully'
      });

    } catch (error) {
      return NextResponse.json(
        {
          error: 'Verification failed',
          message: error.message
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Email OTP verification error:', error);
    return NextResponse.json(
      {
        error: 'Verification failed',
        message: 'Unable to verify OTP. Please try again later.'
      },
      { status: 500 }
    );
  }
}