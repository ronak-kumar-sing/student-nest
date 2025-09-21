import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import OTP from '@/lib/models/OTP';
import { sendOTPEmail } from '@/lib/utils/email';
import { sendOTPSMS } from '@/lib/utils/sms';
import { sendOTPSchema } from '@/lib/validation/otpSchemas';
import {
  sendRateLimiter,
  getClientIP,
  handleValidationError,
  handleRateLimit,
  handleError
} from '@/lib/utils/otpHelpers';

/**
 * POST /api/otp/send - Send OTP to email or phone
 */
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = sendOTPSchema.safeParse(body);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error);
    }

    const { identifier, type, purpose } = validationResult.data;

    // Additional format validation
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
    const rateLimitResponse = await handleRateLimit(
      sendRateLimiter,
      identifier,
      'Please wait'
    );
    if (rateLimitResponse) return rateLimitResponse;

    // Connect to database
    await connectDB();

    // Map API type to database type
    const dbType = type === 'sms' ? 'phone' : type;

    // Create and send OTP
    const otp = await OTP.createOTP(identifier, dbType, purpose);

    if (type === 'email') {
      await sendOTPEmail(identifier, otp.code, purpose);
    } else if (type === 'sms') {
      await sendOTPSMS(identifier, otp.code, purpose);
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to your ${type === 'email' ? 'email' : 'phone'} successfully`,
      data: {
        expiresIn: 5 * 60, // 5 minutes in seconds
        provider: type === 'email' ? 'sendgrid' : 'twilio'
      }
    });

  } catch (error) {
    return handleError(error, 'Send OTP');
  }
}