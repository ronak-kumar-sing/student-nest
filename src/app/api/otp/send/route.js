import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import OTP from '@/lib/models/OTP';
import { z } from 'zod';
import { sendOTPEmail } from '@/lib/utils/email';
import { sendOTPSMS } from '@/lib/utils/sms';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter: 3 OTP sends per 15 minutes per identifier
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req, identifier) => `${req.ip || 'unknown'}-${identifier}`,
  points: 3,
  duration: 15 * 60, // 15 minutes
});

// Validation schema
const sendOTPSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  type: z.enum(['email', 'sms'], {
    errorMap: () => ({ message: 'Type must be either "email" or "sms"' })
  }),
  purpose: z.enum(['verification', 'password_reset']).default('verification')
});

// POST /api/otp/send - Send OTP to email or phone
export async function POST(request) {
  try {
    const body = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Validate input
    const validationResult = sendOTPSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: validationResult.error.errors[0].message
        },
        { status: 400 }
      );
    }

    const { identifier, type, purpose } = validationResult.data;

    // Additional validation for email/phone format
    if (type === 'email' && !identifier.includes('@')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
          message: 'Please provide a valid email address'
        },
        { status: 400 }
      );
    }

    if (type === 'sms' && !identifier.startsWith('+')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid phone format',
          message: 'Please provide a valid phone number with country code (e.g., +919876543210)'
        },
        { status: 400 }
      );
    }

    // Check rate limit
    try {
      await rateLimiter.consume(clientIP, identifier);
    } catch (rateLimiterRes) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests',
          message: `Please wait ${Math.round(rateLimiterRes.msBeforeNext / 1000)} seconds before requesting another OTP`,
          retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000)
        },
        { status: 429 }
      );
    }

    // Connect to database
    await connectDB();

    // Create OTP
    const otp = await OTP.createOTP(identifier, type, purpose);

    // Send OTP based on type
    if (type === 'email') {
      await sendOTPEmail(identifier, otp.code, purpose);
    } else if (type === 'sms') {
      await sendOTPSMS(identifier, otp.code, purpose);
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to your ${type === 'email' ? 'email' : 'phone'} successfully`,
      expiresIn: 5 * 60 // 5 minutes in seconds
    });

  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send OTP',
        message: 'Unable to send OTP. Please try again later.'
      },
      { status: 500 }
    );
  }
}