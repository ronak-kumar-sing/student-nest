import { NextResponse } from 'next/server';
import db from '@/lib/db/connection';
import { User } from '@/lib/models/User';

// POST /api/auth/register - User registration
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate user data
    const validation = User.validate(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = db.getUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // In production, hash the password using bcrypt
    const newUser = db.createUser({
      email: body.email,
      password: body.password, // Should be hashed
      role: body.role || 'user'
    });

    return NextResponse.json({
      success: true,
      data: new User(newUser).toJSON(),
      message: 'User registered successfully'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
