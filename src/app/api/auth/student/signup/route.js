import { NextResponse } from 'next/server';import { NextResponse } from 'next/server';

import connectDB from '@/lib/db/connection';import { studentSignupSchema } from '@/lib/validation/authSchemas';

import Student from '@/lib/models/Student';

import OTP from '@/lib/models/OTP';// POST /api/auth/student/signup - Student registration

import { studentSignupSchema, normalizeEmail, sanitizePhone } from '@/lib/validation/authSchemas';export async function POST(request) {

import { generateTokens } from '@/lib/utils/jwt';  try {

import { sendWelcomeEmail } from '@/lib/utils/email';    const body = await request.json();

import { sendWelcomeSMS } from '@/lib/utils/sms';

import { RateLimiterMemory } from 'rate-limiter-flexible';    // Validate student data

    const validation = studentSignupSchema.safeParse(body);

// Rate limiter: 3 signups per hour per IP    if (!validation.success) {

const rateLimiter = new RateLimiterMemory({      return NextResponse.json(

  keyGenerator: (req) => req.ip || 'unknown',        {

  points: 3,          success: false,

  duration: 60 * 60, // 1 hour          errors: validation.error.errors.map(e => e.message)

});        },

        { status: 400 }

export async function POST(request) {      );

  try {    }

    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

        const { fullName, email, phone, password, collegeId, collegeName } = validation.data;

    // Check rate limit

    try {    // Check if user already exists (in production, check database)

      await rateLimiter.consume(clientIP);    // For demo purposes, we'll just return success

    } catch (rateLimiterRes) {

      return NextResponse.json(    // In production:

        {    // 1. Hash the password

          error: 'Too many signup attempts',    // 2. Save to database

          message: `Try again in ${Math.round(rateLimiterRes.msBeforeNext / 1000 / 60)} minutes`,    // 3. Send welcome email

          retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000)

        },    return NextResponse.json({

        { status: 429 }      success: true,

      );      data: {

    }        id: Math.floor(Math.random() * 1000),

        fullName,

    const body = await request.json();        email,

            phone,

    // Validate input        collegeId,

    const validationResult = studentSignupSchema.safeParse(body);        collegeName,

    if (!validationResult.success) {        userType: 'student',

      return NextResponse.json(        createdAt: new Date().toISOString()

        {      },

          error: 'Validation failed',      message: 'Student account created successfully'

          details: validationResult.error.errors    }, { status: 201 });

        },  } catch (error) {

        { status: 400 }    return NextResponse.json(

      );      { success: false, error: 'Registration failed' },

    }      { status: 500 }

    );

    const userData = validationResult.data;  }

    userData.email = normalizeEmail(userData.email);}

    userData.phone = sanitizePhone(userData.phone);

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await Student.findOne({
      $or: [
        { email: userData.email },
        { phone: userData.phone }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === userData.email ? 'email' : 'phone';
      return NextResponse.json(
        {
          error: 'User already exists',
          message: `An account with this ${field} already exists`
        },
        { status: 409 }
      );
    }

    // Verify email OTP
    const emailOTP = await OTP.findOne({
      identifier: userData.email,
      type: 'email',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!emailOTP) {
      return NextResponse.json(
        {
          error: 'Email not verified',
          message: 'Please verify your email first'
        },
        { status: 400 }
      );
    }

    // Verify phone OTP
    const phoneOTP = await OTP.findOne({
      identifier: userData.phone,
      type: 'phone',
      isUsed: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!phoneOTP) {
      return NextResponse.json(
        {
          error: 'Phone not verified',
          message: 'Please verify your phone number first'
        },
        { status: 400 }
      );
    }

    // Create new student
    const student = new Student({
      ...userData,
      role: 'student',
      isEmailVerified: true,
      isPhoneVerified: true
    });

    await student.save();

    // Mark OTPs as used
    await OTP.updateMany(
      {
        $or: [
          { identifier: userData.email, type: 'email' },
          { identifier: userData.phone, type: 'phone' }
        ],
        isUsed: false
      },
      { isUsed: true }
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(student);

    // Store refresh token
    student.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date()
    });

    await student.save();

    // Send welcome emails/SMS (don't wait for them)
    try {
      sendWelcomeEmail(student.email, student.fullName, 'student');
      sendWelcomeSMS(student.phone, student.fullName, 'student');
    } catch (error) {
      console.error('Error sending welcome messages:', error);
      // Don't fail the signup for this
    }

    // Prepare user data for response
    const userData_response = student.toPublicProfile();

    // Set refresh token as httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Student account created successfully',
      user: userData_response,
      accessToken
    }, { status: 201 });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Student signup error:', error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          error: 'Duplicate field',
          message: `An account with this ${field} already exists`
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.'
      },
      { status: 500 }
    );
  }
}