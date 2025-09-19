import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/utils/jwt';

export async function GET(request) {
  try {
    // Get and verify JWT token
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

    if (payload.role !== 'owner') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only owners can initiate DigiLocker verification' },
        { status: 403 }
      );
    }

    // Mock DigiLocker OAuth flow
    const state = Buffer.from(JSON.stringify({
      userId: payload.userId,
      timestamp: Date.now()
    })).toString('base64');

    const digilockerAuthUrl = process.env.MOCK_VERIFICATION === 'true'
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/verification/digilocker/callback?code=mock_auth_code&state=${state}`
      : `https://api.digitallocker.gov.in/public/oauth2/1/authorize?response_type=code&client_id=${process.env.DIGILOCKER_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.DIGILOCKER_REDIRECT_URI)}&state=${state}&scope=basic`;

    if (process.env.MOCK_VERIFICATION === 'true') {
      // In mock mode, simulate immediate redirect
      return NextResponse.redirect(digilockerAuthUrl);
    }

    return NextResponse.json({
      success: true,
      authUrl: digilockerAuthUrl,
      message: 'Please complete the DigiLocker authentication process'
    });

  } catch (error) {
    console.error('DigiLocker initiate error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.'
      },
      { status: 500 }
    );
  }
}