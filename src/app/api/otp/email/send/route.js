import { NextResponse } from 'next/server';

// POST /api/otp/email/send - Send OTP to email
export async function POST(request) {
  try {
    const { value } = await request.json();

    if (!value || !value.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // In production:
    // 1. Generate random 6-digit OTP
    // 2. Store OTP with expiration time (5 minutes)
    // 3. Send email using email service (SendGrid, AWS SES, etc.)
    // 4. Return success without exposing OTP

    // For demo, we'll use fixed OTP: 123456
    console.log(`Demo: Sending OTP 123456 to email: ${value}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
