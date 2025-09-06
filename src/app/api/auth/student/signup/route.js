import { NextResponse } from 'next/server';
import { studentSignupSchema } from '@/lib/validation/authSchemas';

// POST /api/auth/student/signup - Student registration
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate student data
    const validation = studentSignupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.errors.map(e => e.message)
        },
        { status: 400 }
      );
    }

    const { fullName, email, phone, password, collegeId, collegeName } = validation.data;

    // Check if user already exists (in production, check database)
    // For demo purposes, we'll just return success

    // In production:
    // 1. Hash the password
    // 2. Save to database
    // 3. Send welcome email

    return NextResponse.json({
      success: true,
      data: {
        id: Math.floor(Math.random() * 1000),
        fullName,
        email,
        phone,
        collegeId,
        collegeName,
        userType: 'student',
        createdAt: new Date().toISOString()
      },
      message: 'Student account created successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
