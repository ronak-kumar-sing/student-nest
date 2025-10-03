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

// Force update savedProperties field
export async function POST(request) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const userId = decoded.userId || decoded.id;

    const body = await request.json();
    const { roomId } = body;

    console.log('Attempting to save room:', { userId, roomId });

    // Try using raw MongoDB update first
    const result = await User.collection.updateOne(
      { _id: userId },
      {
        $addToSet: { savedProperties: roomId },
        $setOnInsert: { savedProperties: [] }
      },
      { upsert: false }
    );

    console.log('MongoDB update result:', result);

    // Now get the updated user
    const user = await User.findById(userId).select('savedProperties savedRooms');
    console.log('User after update:', {
      userId: user._id,
      savedProperties: user.savedProperties,
      savedRooms: user.savedRooms
    });

    return NextResponse.json({
      success: true,
      message: 'Force update completed',
      data: {
        updateResult: result,
        userAfter: {
          savedProperties: user.savedProperties,
          savedRooms: user.savedRooms
        }
      }
    });

  } catch (error) {
    console.error('Force update error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to force update'
    }, { status: 500 });
  }
}