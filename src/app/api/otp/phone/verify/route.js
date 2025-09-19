import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import OTP from '@/lib/models/OTP';
import { otpVerificationSchema, sanitizePhone } from '@/lib/validation/authSchemas';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter: 5 verification attempts per 15 minutes per phone
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req, phone) => `${req.ip || 'unknown'}-${phone}`,
  points: 5,
  duration: 15 * 60, // 15 minutes
});

export async function POST(request) {
  try {
    const body = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Validate input
    const validationData = {
      identifier: body.phone || body.value,
      code: body.code || body.otp,
      type: 'phone'
    };

    const validationResult = otpVerificationSchema.safeParse(validationData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { identifier, code } = validationResult.data;
    const phone = sanitizePhone(identifier);

    // Check rate limit
    try {
      await rateLimiter.consume(clientIP, phone);
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
      identifier: phone,
      type: 'phone',
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
        message: 'Phone number verified successfully'
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
    console.error('Phone OTP verification error:', error);
    return NextResponse.json(
      {
        error: 'Verification failed',
        message: 'Unable to verify OTP. Please try again later.'
      },
      { status: 500 }
    );
  }
}