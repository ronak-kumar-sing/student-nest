import { NextResponse } from 'next/server';import { NextResponse } from 'next/server';

import connectDB from '@/lib/db/connection';

import OTP from '@/lib/models/OTP';// POST /api/otp/phone/send - Send OTP to phone

import { phoneSchema, sanitizePhone } from '@/lib/validation/authSchemas';export async function POST(request) {

import { sendOTPSMS } from '@/lib/utils/sms';  try {

import { RateLimiterMemory } from 'rate-limiter-flexible';    const { value } = await request.json();



// Rate limiter: 3 OTP sends per 15 minutes per phone    if (!value) {

const rateLimiter = new RateLimiterMemory({      return NextResponse.json(

  keyGenerator: (req, phone) => `${req.ip || 'unknown'}-${phone}`,        { success: false, error: 'Phone number is required' },

  points: 3,        { status: 400 }

  duration: 15 * 60, // 15 minutes      );

});    }



export async function POST(request) {    // In production:

  try {    // 1. Validate phone number format

    const body = await request.json();    // 2. Generate random 6-digit OTP

    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';    // 3. Store OTP with expiration time (5 minutes)

        // 4. Send SMS using SMS service (Twilio, AWS SNS, etc.)

    // Validate phone    // 5. Return success without exposing OTP

    const validationResult = phoneSchema.safeParse(body.phone || body.value);

    if (!validationResult.success) {    // For demo, we'll use fixed OTP: 123456

      return NextResponse.json(    console.log(`Demo: Sending OTP 123456 to phone: ${value}`);

        {

          error: 'Invalid phone number',    return NextResponse.json({

          message: 'Please provide a valid phone number'      success: true,

        },      message: 'OTP sent to your phone'

        { status: 400 }    });

      );  } catch (error) {

    }    return NextResponse.json(

      { success: false, error: 'Failed to send OTP' },

    const phone = sanitizePhone(validationResult.data);      { status: 500 }

        );

    // Check rate limit  }

    try {}

      await rateLimiter.consume(clientIP, phone);
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
    const otp = await OTP.createOTP(phone, 'phone', purpose);

    // Send SMS
    await sendOTPSMS(phone, otp.code, purpose);

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your phone successfully',
      expiresIn: 5 * 60 // 5 minutes in seconds
    });

  } catch (error) {
    console.error('Phone OTP send error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send OTP',
        message: 'Unable to send OTP to your phone. Please try again later.'
      },
      { status: 500 }
    );
  }
}