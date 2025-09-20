import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import OTP from '@/lib/models/OTP';
import { z } from 'zod';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter: 5 verification attempts per 15 minutes per identifier
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req, identifier) => `${req.ip || 'unknown'}-${identifier}`,
  points: 5,
  duration: 15 * 60, // 15 minutes
});

// Validation schema
const verifyOTPSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  purpose: z.enum(['verification', 'password_reset']).default('verification')
});

// POST /api/otp/verify - Verify OTP
export async function POST(request) {
  try {
    const body = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Validate input
    const validationResult = verifyOTPSchema.safeParse(body);
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

    const { identifier, otp, purpose } = validationResult.data;

    // Check rate limit
    try {
      await rateLimiter.consume(clientIP, identifier);
    } catch (rateLimiterRes) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many attempts',
          message: `Please wait ${Math.round(rateLimiterRes.msBeforeNext / 1000)} seconds before trying again`,
          retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000)
        },
        { status: 429 }
      );
    }

    // Connect to database
    await connectDB();

    // Verify OTP
    const isValid = await OTP.verifyOTP(identifier, otp, purpose);

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid OTP',
          message: 'The OTP code is invalid or has expired. Please request a new one.'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Verification failed',
        message: 'Unable to verify OTP. Please try again later.'
      },
      { status: 500 }
    );
  }
}