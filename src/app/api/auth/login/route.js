import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import { loginSchema, normalizeEmail, sanitizePhone } from '@/lib/validation/authSchemas';
import { generateTokens } from '@/lib/utils/jwt';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter: 5 attempts per 15 minutes
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip || 'unknown',
  points: 5,
  duration: 15 * 60, // 15 minutes
});

export async function POST(request) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Check rate limit
    try {
      await rateLimiter.consume(clientIP);
    } catch (rateLimiterRes) {
      return NextResponse.json(
        {
          error: 'Too many login attempts',
          message: `Try again in ${Math.round(rateLimiterRes.msBeforeNext / 1000)} seconds`,
          retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000)
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { identifier, password, role } = validationResult.data;

    // Connect to database
    await connectDB();

    // Determine if identifier is email or phone
    let query = {};
    if (identifier.includes('@')) {
      query.email = normalizeEmail(identifier);
    } else {
      query.phone = sanitizePhone(identifier);
    }

    // Add role filter if provided
    if (role) {
      // Search for both lowercase and capitalized versions
      const roleVariants = [role, role.charAt(0).toUpperCase() + role.slice(1)];
      query.role = { $in: roleVariants };
    }

    console.log('Login query:', JSON.stringify(query));
    console.log('Looking for user with role:', role);

    // Find user
    const user = await User.findOne(query);

    console.log('Found user:', user ? {
      id: user._id,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      hasPassword: !!user.password
    } : 'null');

    if (!user) {
      return NextResponse.json(
        {
          error: 'Invalid credentials',
          message: 'Email/phone or password is incorrect'
        },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.isLocked()) {
      const lockTime = Math.round((user.lockUntil - Date.now()) / 1000 / 60);
      return NextResponse.json(
        {
          error: 'Account locked',
          message: `Account is locked due to too many failed login attempts. Try again in ${lockTime} minutes.`
        },
        { status: 423 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          error: 'Account inactive',
          message: 'Your account has been deactivated. Please contact support.'
        },
        { status: 403 }
      );
    }

    // Verify password
    console.log('Comparing password...');
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();

      return NextResponse.json(
        {
          error: 'Invalid credentials',
          message: 'Email/phone or password is incorrect'
        },
        { status: 401 }
      );
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token in user document
    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date()
    });

    // Keep only last 5 refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }

    await user.save();

    // Prepare user data for response
    const userData = user.toPublicProfile();

    // Set refresh token as httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData,
      accessToken
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.'
      },
      { status: 500 }
    );
  }
}