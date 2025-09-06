import { NextResponse } from 'next/server';

// POST /api/otp/phone/verify - Verify phone OTP
export async function POST(request) {
  try {
    const { value, code } = await request.json();

    if (!value || !code) {
      return NextResponse.json(
        { success: false, error: 'Phone number and OTP code are required' },
        { status: 400 }
      );
    }

    // In production:
    // 1. Check if OTP exists and is not expired
    // 2. Verify OTP matches
    // 3. Mark phone as verified
    // 4. Delete used OTP

    // For demo, accept 123456 as valid OTP
    if (code === "123456") {
      return NextResponse.json({
        success: true,
        message: 'Phone verified successfully'
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
