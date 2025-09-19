import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import { verifyRefreshToken, generateTokens } from '@/lib/utils/jwt';

export async function POST(request) {
  try {
    // Get refresh token from cookie or body
    const refreshToken = request.cookies.get('refreshToken')?.value ||
                        (await request.json()).refreshToken;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token required', message: 'No refresh token provided' },
        { status: 401 }
      );
    }

    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid refresh token', message: 'Refresh token is invalid or expired' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user and check if refresh token exists
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', message: 'User account not found' },
        { status: 404 }
      );
    }

    // Check if refresh token exists in user's refresh tokens
    const tokenExists = user.refreshTokens.some(token => token.token === refreshToken);
    if (!tokenExists) {
      return NextResponse.json(
        { error: 'Invalid refresh token', message: 'Refresh token not found in user records' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account inactive', message: 'User account has been deactivated' },
        { status: 403 }
      );
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter(token => token.token !== refreshToken);
    user.refreshTokens.push({
      token: newRefreshToken,
      createdAt: new Date()
    });

    // Keep only last 5 refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }

    await user.save();

    // Prepare user data for response
    const userData = user.toPublicProfile();

    // Set new refresh token as httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Tokens refreshed successfully',
      user: userData,
      accessToken
    });

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.'
      },
      { status: 500 }
    );
  }
}