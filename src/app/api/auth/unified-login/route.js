import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// MongoDB connection (direct connection for this API)
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect('mongodb+srv://ronakkumar20062006:WcQd5ZksggAwO1oT@cluster0.969t4yr.mongodb.net/student-nest?retryWrites=true&w=majority&appName=Cluster0');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }
};

// Simple validation functions
const normalizeEmail = (email) => email.toLowerCase().trim();
const sanitizePhone = (phone) => {
  let cleanPhone = phone.trim().replace(/[\s\-\(\)]/g, '');
  if (/^\d{10}$/.test(cleanPhone)) {
    cleanPhone = '+91' + cleanPhone;
  }
  if (/^91\d{10}$/.test(cleanPhone)) {
    cleanPhone = '+' + cleanPhone;
  }
  return cleanPhone;
};

// Simple JWT token generation
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

export async function POST(request) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    const body = await request.json();
    const { identifier, password, role } = body;

    // Basic validation
    if (!identifier || !password) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Email/phone and password are required'
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Determine if identifier is email or phone
    let query = {};
    if (identifier.includes('@')) {
      query.email = normalizeEmail(identifier);
    } else {
      query.phone = sanitizePhone(identifier);
    }

    console.log('🔍 Login attempt:', { identifier, role, query });

    let user = null;
    let userCollection = null;

    // Search in both users and owners collections
    const db = mongoose.connection.db;

    // First try users collection
    const usersCollection = db.collection('users');
    user = await usersCollection.findOne(query);
    if (user) {
      userCollection = 'users';
      console.log('✅ Found user in users collection:', {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      });
    }

    // If not found and role is owner, try owners collection
    if (!user && (!role || role.toLowerCase() === 'owner')) {
      const ownersCollection = db.collection('owners');
      user = await ownersCollection.findOne(query);
      if (user) {
        userCollection = 'owners';
        console.log('✅ Found user in owners collection:', {
          id: user._id,
          email: user.email,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`
        });
      }
    }

    if (!user) {
      console.log('❌ User not found in any collection');
      return NextResponse.json(
        {
          error: 'Invalid credentials',
          message: 'Email/phone or password is incorrect'
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        {
          error: 'Invalid credentials',
          message: 'Email/phone or password is incorrect'
        },
        { status: 401 }
      );
    }

    // Update last login
    const now = new Date();
    if (userCollection === 'users') {
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { lastLogin: now } }
      );
    } else {
      await ownersCollection.updateOne(
        { _id: user._id },
        { $set: { lastLoginAt: now } }
      );
    }

    // Normalize user data
    const userData = {
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      role: user.role,
      fullName: user.fullName || `${user.firstName} ${user.lastName}`,
      isEmailVerified: user.isEmailVerified || false,
      isPhoneVerified: user.isPhoneVerified || false,
      isIdentityVerified: user.isIdentityVerified || false,
      profilePhoto: user.profilePhoto || null,
      adminLevel: user.adminLevel || null,
      permissions: user.permissions || []
    };

    // Generate token
    const token = generateToken({
      userId: userData.id,
      email: userData.email,
      role: userData.role,
      adminLevel: userData.adminLevel,
      permissions: userData.permissions
    });

    console.log('✅ Login successful:', {
      userId: userData.id,
      email: userData.email,
      role: userData.role,
      collection: userCollection
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token: token
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}