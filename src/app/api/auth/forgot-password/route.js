import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import OTP from '@/lib/models/OTP';
import { z } from 'zod';
import { normalizeEmail, sanitizePhone } from '@/lib/validation/authSchemas';
import { sendOTPEmail } from '@/lib/utils/email';
import { sendOTPSMS } from '@/lib/utils/sms';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter: 3 attempts per 15 minutes per identifier
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req, identifier) => `${req.ip || 'unknown'}-${identifier}`,
  points: 3,
  duration: 15 * 60, // 15 minutes
});

// Validation schema
const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required')
});

// POST /api/auth/forgot-password - Send password reset OTP
export async function POST(request) {
  try {
    console.log('🔄 Forgot password request started');

    // Rate limiting
    const rateLimiterRes = await rateLimiter.consume(
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'default'
    );

    const body = await request.json();
    console.log('📥 Request body:', { identifier: body.identifier });

    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      console.log('❌ Validation failed:', validationResult.error.errors);
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { identifier } = validationResult.data;
    console.log('✅ Validation passed, identifier:', identifier);

    // Connect to database
    await connectDB();
    console.log('🔗 Connected to database');

    // Determine if identifier is email or phone
    let query = {};
    if (identifier.includes('@')) {
      query.email = normalizeEmail(identifier);
      console.log('📧 Looking for user by email:', query.email);
    } else {
      query.phone = sanitizePhone(identifier);
      console.log('📱 Looking for user by phone:', query.phone);
    }

    // Find user
    const user = await User.findOne(query);
    console.log('👤 User found:', user ? { id: user._id, email: user.email, phone: user.phone } : 'null');

    // Always return success to prevent user enumeration
    if (!user) {
      console.log('⚠️ User not found, returning success to prevent enumeration');
      return NextResponse.json({
        success: true,
        message: 'If an account with this email/phone exists, you will receive a password reset code.'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      console.log('❌ User account is inactive');
      return NextResponse.json({
        success: true,
        message: 'If an account with this email/phone exists, you will receive a password reset code.'
      });
    }

    console.log('🔢 Generating OTP...');
    // Generate and save OTP
  const otpDoc = await OTP.createOTP(identifier, identifier.includes('@') ? 'email' : 'phone', 'password-reset', user._id);
  const otp = otpDoc.code;
  console.log('✅ OTP generated:', { identifier, purpose: 'password-reset' });

    // Send OTP via email or SMS
    let sendResult;
    if (identifier.includes('@')) {
      console.log('📧 Sending OTP via email...');
      sendResult = await sendOTPEmail(identifier, otp, 'password_reset');
      console.log('📧 Email send result:', sendResult ? 'success' : 'failed');
    } else {
      console.log('📱 Sending OTP via SMS...');
      sendResult = await sendOTPSMS(identifier, otp, 'password_reset');
      console.log('📱 SMS send result:', sendResult ? 'success' : 'failed');
    }

    console.log('✅ Forgot password process completed successfully');
    return NextResponse.json({
      success: true,
      message: 'If an account with this email/phone exists, you will receive a password reset code.'
    });

  } catch (error) {
    console.error('💥 Forgot password error:', error);
    console.error('Stack trace:', error.stack);

    if (error.totalHits > error.maxHits) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests',
          message: `Too many password reset attempts. Try again in ${Math.round(error.msBeforeNext / 1000)} seconds.`,
          retryAfter: Math.round(error.msBeforeNext / 1000)
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        message: 'Unable to process password reset request. Please try again later.'
      },
      { status: 500 }
    );
  }
}
