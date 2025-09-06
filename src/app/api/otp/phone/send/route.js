import { NextResponse } from 'next/server';

// POST /api/otp/phone/send - Send OTP to phone
export async function POST(request) {
  try {
    const { value } = await request.json();

    if (!value) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // In production:
    // 1. Validate phone number format
    // 2. Generate random 6-digit OTP
    // 3. Store OTP with expiration time (5 minutes)
    // 4. Send SMS using SMS service (Twilio, AWS SNS, etc.)
    // 5. Return success without exposing OTP

    // For demo, we'll use fixed OTP: 123456
    console.log(`Demo: Sending OTP 123456 to phone: ${value}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your phone'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
