import { NextResponse } from 'next/server';
import { forgotPasswordSchema } from '@/lib/validation/authSchemas';

// POST /api/auth/forgot-password - Send password reset email
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate email
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.errors.map(e => e.message)
        },
        { status: 400 }
      );
    }

    const { email, userType } = body;

    // In production:
    // 1. Check if user exists in database
    // 2. Generate secure reset token with expiration
    // 3. Store token in database
    // 4. Send email with reset link
    // 5. Don't reveal if email exists or not (security)

    console.log(`Demo: Sending password reset email to: ${email} (${userType || 'any'} user)`);

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, you will receive password reset instructions.'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}
