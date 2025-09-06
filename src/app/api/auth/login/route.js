import { NextResponse } from 'next/server';

// In-memory user storage (replace with real database)
const users = [
  {
    id: 1,
    email: "admin@studentnest.com",
    username: "admin",
    password: "admin123", // In production, use bcrypt hash
    role: "admin",
    userType: "admin",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: "student@test.com",
    username: "student",
    password: "password123",
    role: "user",
    userType: "student",
    fullName: "Test Student",
    collegeId: "CS001",
    collegeName: "Test College",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    email: "owner@test.com",
    username: "owner",
    password: "password123",
    role: "owner",
    userType: "owner",
    fullName: "Test Owner",
    verificationStatus: "verified", // pending, in-review, verified, rejected
    createdAt: new Date().toISOString()
  }
];

// POST /api/auth/login - User login
export async function POST(request) {
  try {
    const { identifier, password, userType } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    // Find user by email or username
    const user = users.find(u =>
      (u.email === identifier || u.username === identifier) &&
      (userType ? u.userType === userType : true)
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In production, use bcrypt to compare passwords
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In production, generate and return JWT token
    const token = `fake-jwt-token-${user.id}`;

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token: token
      },
      message: 'Login successful'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
