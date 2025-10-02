import { connectDB } from '@/lib/db/connection';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required'
      }, { status: 400 });
    }

    await connectDB();

    // Find admin user
    const admin = await User.findOne({
      email: email.toLowerCase(),
      role: 'admin'
    });

    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'Invalid admin credentials'
      }, { status: 401 });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        message: 'Invalid admin credentials'
      }, { status: 401 });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: admin._id,
        email: admin.email,
        role: admin.role,
        adminLevel: admin.adminLevel,
        permissions: admin.permissions
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const adminData = {
      id: admin._id,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
      adminLevel: admin.adminLevel,
      permissions: admin.permissions,
      lastLogin: admin.lastLogin
    };

    return NextResponse.json({
      success: true,
      message: 'Admin login successful',
      data: {
        admin: adminData,
        token
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}