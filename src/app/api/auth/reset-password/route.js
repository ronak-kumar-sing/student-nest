import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import OTP from '@/lib/models/OTP';
import { z } from 'zod';
import { passwordSchema, normalizeEmail, sanitizePhone } from '@/lib/validation/authSchemas';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter: 5 attempts per 15 minutes per identifier
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req, identifier) => `${req.ip || 'unknown'}-${identifier}`,
  points: 5,
  duration: 15 * 60, // 15 minutes
});

// Validation schema
const resetPasswordSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: passwordSchema
});

// POST /api/auth/reset-password - Reset password with OTP verification
export async function POST(request) {
  try {
    console.log('🔄 Reset password request started');

    const body = await request.json();
    console.log('📥 Request body:', { identifier: body.identifier, otp: body.otp, hasNewPassword: !!body.newPassword });

    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Validate input
    const validationResult = resetPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      console.log('❌ Validation failed:', validationResult.error.errors);
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: validationResult.error.errors?.[0]?.message || 'Invalid request data'
        },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed');
    const { identifier, otp, newPassword } = validationResult.data;

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
    console.log('🔗 Connected to database');

    // Verify OTP first
    console.log('🔍 Verifying OTP...');
    const type = identifier.includes('@') ? 'email' : 'phone';
    const otpResult = await OTP.verifyOTP(identifier, type, otp, 'password-reset');
    console.log('🔍 OTP verification result:', otpResult);

    if (!otpResult.success) {
      console.log('❌ OTP verification failed');
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid OTP',
          message: otpResult.message || 'The OTP code is invalid or has expired. Please request a new one.'
        },
        { status: 400 }
      );
    }

    console.log('✅ OTP verified successfully');

    // Determine if identifier is email or phone
    let query = {};
    if (identifier.includes('@')) {
      query.email = normalizeEmail(identifier);
    } else {
      query.phone = sanitizePhone(identifier);
    }

    // Find user
    const user = await User.findOne(query);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
          message: 'No account found with this email or phone number.'
        },
        { status: 404 }
      );
    }

    // Update password
    user.password = newPassword; // Will be hashed by pre-save middleware

    // Reset login attempts if any
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    await user.save();

    // Remove all refresh tokens to force re-login
    user.refreshTokens = [];
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. Please log in with your new password.'
    });

  } catch (error) {
    console.error('💥 Reset password error:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to reset password',
        message: 'Unable to reset password. Please try again later.'
      },
      { status: 500 }
    );
  }
}