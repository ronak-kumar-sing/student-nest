import { NextResponse } from 'next/server';

// POST /api/otp/email/verify - Verify email OTP
export async function POST(request) {
  try {
    const { value, code } = await request.json();

    if (!value || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP code are required' },
        { status: 400 }
      );
    }

    // In production:
    // 1. Check if OTP exists and is not expired
    // 2. Verify OTP matches
    // 3. Mark email as verified
    // 4. Delete used OTP

    // For demo, accept 123456 as valid OTP
    if (code === "123456") {
      return NextResponse.json({
        success: true,
        message: 'Email verified successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP code' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
