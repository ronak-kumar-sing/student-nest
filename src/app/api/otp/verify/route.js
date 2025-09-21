import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import OTP from '@/lib/models/OTP';
import { verifyOTPSchema } from '@/lib/validation/otpSchemas';
import {
  verifyRateLimiter,
  getClientIP,
  handleValidationError,
  handleRateLimit,
  handleError
} from '@/lib/utils/otpHelpers';

/**
 * POST /api/otp/verify - Verify OTP for email or phone
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const clientIP = getClientIP(request);

    // Validate input
    const validationResult = verifyOTPSchema.safeParse(body);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error);
    }

    const { identifier, otp, purpose } = validationResult.data;

    // Check rate limit
    const rateLimitResponse = await handleRateLimit(
      verifyRateLimiter,
      `${clientIP}-${identifier}`,
      'Please wait'
    );
    if (rateLimitResponse) return rateLimitResponse;

    // Connect to database
    await connectDB();

    // Determine type based on identifier format
    const type = identifier.includes('@') ? 'email' : 'phone';

    // Verify OTP
    const verification = await OTP.verifyOTP(identifier, type, otp);

    if (!verification.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid OTP',
          message: verification.message || 'The OTP code is invalid or has expired. Please request a new one.'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    return handleError(error, 'Verify OTP');
  }
}