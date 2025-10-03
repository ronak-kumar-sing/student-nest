import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
async function verifyToken(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Debug user document
export async function GET(request) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Get user document directly
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        savedRooms: user.savedRooms,
        hasSavedRoomsField: user.hasOwnProperty('savedRooms'),
        userKeys: Object.keys(user.toObject())
      }
    });

  } catch (error) {
    console.error('Debug user error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to debug user'
    }, { status: 500 });
  }
}