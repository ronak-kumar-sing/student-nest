import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// MongoDB connection
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

export async function POST(request) {
  try {
    const body = await request.json();
    const { identifier, password, role } = body;

    console.log('🔍 Login attempt:', { identifier, role });

    // Basic validation
    if (!identifier || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email/phone and password are required'
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Create query
    let query = {};
    if (identifier.includes('@')) {
      query.email = identifier.toLowerCase().trim();
    } else {
      query.phone = identifier;
    }

    let user = null;
    let userSource = null;

    // Check users collection first
    const usersCollection = mongoose.connection.db.collection('users');
    user = await usersCollection.findOne(query);
    if (user) {
      userSource = 'users';
      console.log('✅ Found in users collection');
    }

    // If not found, check owners collection
    if (!user) {
      const ownersCollection = mongoose.connection.db.collection('owners');
      user = await ownersCollection.findOne(query);
      if (user) {
        userSource = 'owners';
        console.log('✅ Found in owners collection');
      }
    }

    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials'
        },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials'
        },
        { status: 401 }
      );
    }

    // Create user data
    const userData = {
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      role: user.role,
      fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      isEmailVerified: user.isEmailVerified || false,
      isPhoneVerified: user.isPhoneVerified || false,
      isIdentityVerified: user.isIdentityVerified || false,
      adminLevel: user.adminLevel || null,
    };

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: userData.id,
        email: userData.email,
        role: userData.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful');

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
        success: false,
        message: 'Server error'
      },
      { status: 500 }
    );
  }
}