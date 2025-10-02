import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import { verifyAccessToken } from '@/lib/utils/jwt';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'No authorization header found',
        debug: {
          authHeader: authHeader ? 'Present but invalid format' : 'Missing',
          expectedFormat: 'Bearer <token>'
        }
      }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // First try to decode without verification to see what's in the token
    let rawDecoded;
    try {
      const jwt = require('jsonwebtoken');
      rawDecoded = jwt.decode(token);
    } catch (err) {
      rawDecoded = 'Could not decode token';
    }

    // Now try proper verification
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Token verification failed',
        debug: {
          tokenPresent: !!token,
          tokenLength: token.length,
          rawDecoded,
          verificationError: error.message,
          env: {
            JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Missing',
            NODE_ENV: process.env.NODE_ENV
          }
        }
      }, { status: 401 });
    }

    // Try to find the user
    await connectDB();
    const user = await User.findById(decoded.userId);

    return NextResponse.json({
      success: true,
      debug: {
        tokenDecoded: {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          isEmailVerified: decoded.isEmailVerified,
          isPhoneVerified: decoded.isPhoneVerified,
          exp: decoded.exp,
          iat: decoded.iat
        },
        userFound: !!user,
        userDetails: user ? {
          id: user._id.toString(),
          email: user.email,
          phone: user.phone,
          fullName: user.fullName,
          role: user.role,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified
        } : null,
        database: {
          connected: true,
          userModel: 'Available'
        }
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Debug endpoint error',
      debug: {
        errorMessage: error.message,
        errorStack: error.stack
      }
    }, { status: 500 });
  }
}