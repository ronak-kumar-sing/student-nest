import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import { verifyAccessToken } from '@/lib/utils/jwt';

export async function POST(request) {
  try {
    // Get access token from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Access token required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', message: 'User account not found' },
        { status: 404 }
      );
    }

    // Get refresh token to revoke (optional - can logout specific session)
    const body = await request.json().catch(() => ({}));
    const refreshTokenToRevoke = body.refreshToken || request.cookies.get('refreshToken')?.value;

    if (refreshTokenToRevoke) {
      // Remove specific refresh token
      user.refreshTokens = user.refreshTokens.filter(
        token => token.token !== refreshTokenToRevoke
      );
    } else {
      // Remove all refresh tokens (logout from all devices)
      user.refreshTokens = [];
    }

    await user.save();

    // Create logout response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear both authentication cookies
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.'
      },
      { status: 500 }
    );
  }
}