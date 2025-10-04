/**
 * Google Token API
 * Provides access to Google OAuth tokens for authenticated users
 */

import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/utils/jwt';
import { cookies } from 'next/headers';

// Helper function to verify JWT token
async function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET: Get Google access token
export async function GET(request) {
  try {
    // Verify user authentication
    const decoded = await verifyToken(request);

    const cookieStore = cookies();
    const googleAccessToken = cookieStore.get('google_access_token')?.value;
    const googleRefreshToken = cookieStore.get('google_refresh_token')?.value;

    if (!googleAccessToken && !googleRefreshToken) {
      return NextResponse.json({
        success: false,
        error: 'No Google tokens found. Please authenticate with Google.',
        requiresAuth: true
      }, { status: 401 });
    }

    // Check if access token is expired and refresh if needed
    if (!googleAccessToken && googleRefreshToken) {
      try {
        const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: googleRefreshToken,
            grant_type: 'refresh_token',
          }),
        });

        const newTokens = await refreshResponse.json();

        if (refreshResponse.ok) {
          // Set new access token in response
          const response = NextResponse.json({
            success: true,
            accessToken: newTokens.access_token,
            expiresIn: newTokens.expires_in
          });

          response.cookies.set('google_access_token', newTokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: newTokens.expires_in || 3600
          });

          return response;
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
    }

    return NextResponse.json({
      success: true,
      accessToken: googleAccessToken,
      hasRefreshToken: !!googleRefreshToken
    });

  } catch (error) {
    console.error('Error getting Google token:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to get Google token'
    }, { status: 500 });
  }
}

// DELETE: Revoke Google tokens
export async function DELETE(request) {
  try {
    // Verify user authentication
    const decoded = await verifyToken(request);

    const cookieStore = cookies();
    const googleAccessToken = cookieStore.get('google_access_token')?.value;

    // Revoke the token with Google
    if (googleAccessToken) {
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${googleAccessToken}`, {
          method: 'POST'
        });
      } catch (revokeError) {
        console.error('Failed to revoke Google token:', revokeError);
      }
    }

    // Clear cookies
    const response = NextResponse.json({
      success: true,
      message: 'Google tokens revoked successfully'
    });

    response.cookies.delete('google_access_token');
    response.cookies.delete('google_refresh_token');

    return response;

  } catch (error) {
    console.error('Error revoking Google tokens:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to revoke Google tokens'
    }, { status: 500 });
  }
}