import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import Verification from '@/lib/models/Verification';
import { verifyAccessToken } from '@/lib/utils/jwt';

// Helper function to verify JWT token and get user
async function getAuthenticatedUser(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No valid authorization header found' };
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    if (!decoded.userId) {
      return { error: 'Invalid token payload' };
    }

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return { error: 'User not found' };
    }

    if (!user.isActive) {
      return { error: 'User account is inactive' };
    }

    return { user };
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.message.includes('expired')) {
      return { error: 'Token expired' };
    }
    return { error: 'Invalid or expired token' };
  }
}

// Simulate DigiLocker authentication
export async function POST(request) {
  try {
    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    const body = await request.json();
    const { aadhaarNumber, otp } = body;

    // Validate input
    if (!aadhaarNumber || !otp) {
      return NextResponse.json({
        success: false,
        error: 'Aadhaar number and OTP are required'
      }, { status: 400 });
    }

    // Validate Aadhaar format
    if (!/^\d{12}$/.test(aadhaarNumber.replace(/\s/g, ''))) {
      return NextResponse.json({
        success: false,
        error: 'Invalid Aadhaar number format'
      }, { status: 400 });
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid OTP format'
      }, { status: 400 });
    }

    // Simulate DigiLocker authentication with delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Simulate authentication success (90% success rate for demo)
    const authSuccess = Math.random() > 0.1;

    if (!authSuccess) {
      return NextResponse.json({
        success: false,
        error: 'DigiLocker authentication failed. Please verify your Aadhaar number and OTP.'
      }, { status: 401 });
    }

    // Find or create verification record
    let verification = await Verification.findOne({ userId: user._id });

    if (!verification) {
      verification = new Verification({
        userId: user._id,
        status: 'pending'
      });
    }

    // Update DigiLocker authentication status
    verification.digilockerAuth = {
      authenticated: true,
      userConsent: true,
      documentsAvailable: ['aadhaar', 'pan'], // Simulate available documents
      authenticatedAt: new Date()
    };

    // Add history entry
    verification.addHistory('digilocker_auth', {
      aadhaarNumber: `****-****-${aadhaarNumber.slice(-4)}`,
      timestamp: new Date()
    }, 'system');

    await verification.save();

    // Mock user data from DigiLocker
    const mockUserData = {
      name: user.fullName || 'Verified User',
      aadhaarNumber: `****-****-${aadhaarNumber.slice(-4)}`,
      dateOfBirth: '15/06/1995', // Mock DOB
      gender: 'Male',
      address: 'Mock Address, City - 123456'
    };

    return NextResponse.json({
      success: true,
      message: 'DigiLocker authentication successful',
      data: {
        authenticated: true,
        userConsent: true,
        documentsAvailable: ['aadhaar', 'pan'],
        userData: mockUserData,
        verificationId: verification._id,
        nextStep: 'document_upload'
      }
    });

  } catch (error) {
    console.error('DigiLocker auth error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during DigiLocker authentication'
    }, { status: 500 });
  }
}

// Get DigiLocker status
export async function GET(request) {
  try {
    const { user, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    await connectDB();
    const verification = await Verification.findOne({ userId: user._id });

    if (!verification) {
      return NextResponse.json({
        success: true,
        data: {
          authenticated: false,
          status: 'not_started'
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        authenticated: verification.digilockerAuth.authenticated,
        userConsent: verification.digilockerAuth.userConsent,
        documentsAvailable: verification.digilockerAuth.documentsAvailable,
        authenticatedAt: verification.digilockerAuth.authenticatedAt,
        status: verification.status,
        verificationLevel: verification.verificationLevel,
        progress: verification.progress
      }
    });

  } catch (error) {
    console.error('DigiLocker status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error while fetching DigiLocker status'
    }, { status: 500 });
  }
}