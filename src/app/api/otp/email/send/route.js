import { NextResponse } from 'next/server';import { NextResponse } from 'next/server';

import connectDB from '@/lib/db/connection';

import OTP from '@/lib/models/OTP';// POST /api/otp/email/send - Send OTP to email

import { emailSchema, normalizeEmail } from '@/lib/validation/authSchemas';export async function POST(request) {

import { sendOTPEmail } from '@/lib/utils/email';  try {

import { RateLimiterMemory } from 'rate-limiter-flexible';    const { value } = await request.json();



// Rate limiter: 3 OTP sends per 15 minutes per email    if (!value || !value.includes('@')) {

const rateLimiter = new RateLimiterMemory({      return NextResponse.json(

  keyGenerator: (req, email) => `${req.ip || 'unknown'}-${email}`,        { success: false, error: 'Valid email is required' },

  points: 3,        { status: 400 }

  duration: 15 * 60, // 15 minutes      );

});    }



export async function POST(request) {    // In production:

  try {    // 1. Generate random 6-digit OTP

    const body = await request.json();    // 2. Store OTP with expiration time (5 minutes)

    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';    // 3. Send email using email service (SendGrid, AWS SES, etc.)

        // 4. Return success without exposing OTP

    // Validate email

    const validationResult = emailSchema.safeParse(body.email || body.value);    // For demo, we'll use fixed OTP: 123456

    if (!validationResult.success) {    console.log(`Demo: Sending OTP 123456 to email: ${value}`);

      return NextResponse.json(

        {    return NextResponse.json({

          error: 'Invalid email',      success: true,

          message: 'Please provide a valid email address'      message: 'OTP sent to your email'

        },    });

        { status: 400 }  } catch (error) {

      );    return NextResponse.json(

    }      { success: false, error: 'Failed to send OTP' },

      { status: 500 }

    const email = normalizeEmail(validationResult.data);    );

      }

    // Check rate limit}

    try {
      await rateLimiter.consume(clientIP, email);
    } catch (rateLimiterRes) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `Please wait ${Math.round(rateLimiterRes.msBeforeNext / 1000)} seconds before requesting another OTP`,
          retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000)
        },
        { status: 429 }
      );
    }

    // Connect to database
    await connectDB();

    // Create and send OTP
    const purpose = body.purpose || 'verification';
    const otp = await OTP.createOTP(email, 'email', purpose);

    // Send email
    await sendOTPEmail(email, otp.code, purpose);

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email successfully',
      expiresIn: 5 * 60 // 5 minutes in seconds
    });

  } catch (error) {
    console.error('Email OTP send error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send OTP',
        message: 'Unable to send OTP to your email. Please try again later.'
      },
      { status: 500 }
    );
  }
}