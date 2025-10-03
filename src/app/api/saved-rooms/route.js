import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import Student from '@/lib/models/Student';
import Room from '@/lib/models/Room';
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

// GET - Get all saved rooms for the user
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

    // Get user and their saved rooms - use Student model for students
    const user = await User.findById(userId).select('role savedProperties savedRooms');
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    let savedRoomIds = [];

    // For students, use savedProperties field, for others use savedRooms
    if (user.role === 'Student' || user.role === 'student') {
      const student = await Student.findById(userId).select('savedProperties');
      savedRoomIds = student?.savedProperties || [];
    } else {
      savedRoomIds = user.savedRooms || [];
    }

    // Populate saved rooms with full room details
    const savedRooms = await Room.find({
      _id: { $in: savedRoomIds }
    }).populate('owner', 'fullName email phone profilePhoto isVerified');

    return NextResponse.json({
      success: true,
      data: {
        savedRooms: savedRooms.map(room => ({
          id: room._id,
          title: room.title,
          description: room.description,
          images: room.images,
          price: room.pricing?.rent || room.price,
          location: room.location,
          amenities: room.amenities,
          features: room.features,
          rating: room.rating,
          totalReviews: room.totalReviews || 0,
          availability: room.availability,
          owner: {
            id: room.owner._id,
            name: room.owner.fullName,
            email: room.owner.email,
            phone: room.owner.phone,
            profilePhoto: room.owner.profilePhoto,
            verified: room.owner.isVerified
          }
        })),
        total: savedRooms.length
      }
    });

  } catch (error) {
    console.error('Get saved rooms error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch saved rooms'
    }, { status: 500 });
  }
}

// POST - Add room to saved rooms
export async function POST(request) {
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

    const body = await request.json();
    const { roomId } = body;

    if (!roomId) {
      return NextResponse.json({
        success: false,
        error: 'Room ID is required'
      }, { status: 400 });
    }

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return NextResponse.json({
        success: false,
        error: 'Room not found'
      }, { status: 404 });
    }

    // Get user to determine the role
    const user = await User.findById(userId).select('role');
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    let updatedUser;
    let savedList = [];

    // Add room to appropriate saved list based on user role
    if (user.role === 'Student' || user.role === 'student') {
      // For students, use savedProperties in Student model
      updatedUser = await Student.findByIdAndUpdate(
        userId,
        { $addToSet: { savedProperties: roomId } },
        { new: true }
      ).select('savedProperties');
      savedList = updatedUser?.savedProperties || [];
    } else {
      // For other users, use savedRooms in User model
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { savedRooms: roomId } },
        { new: true }
      ).select('savedRooms');
      savedList = updatedUser?.savedRooms || [];
    }

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Room saved successfully',
      data: {
        savedRoomsCount: savedList.length,
        isSaved: true
      }
    });

  } catch (error) {
    console.error('Save room error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to save room'
    }, { status: 500 });
  }
}

// DELETE - Remove room from saved rooms
export async function DELETE(request) {
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

    const url = new URL(request.url);
    const roomId = url.searchParams.get('roomId');

    if (!roomId) {
      return NextResponse.json({
        success: false,
        error: 'Room ID is required'
      }, { status: 400 });
    }

    // Get user to determine the role
    const user = await User.findById(userId).select('role');
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    let updatedUser;
    let savedList = [];

    // Remove room from appropriate saved list based on user role
    if (user.role === 'Student' || user.role === 'student') {
      // For students, use savedProperties in Student model
      updatedUser = await Student.findByIdAndUpdate(
        userId,
        { $pull: { savedProperties: roomId } },
        { new: true }
      ).select('savedProperties');
      savedList = updatedUser?.savedProperties || [];
    } else {
      // For other users, use savedRooms in User model
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { savedRooms: roomId } },
        { new: true }
      ).select('savedRooms');
      savedList = updatedUser?.savedRooms || [];
    }

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Room removed from saved list',
      data: {
        savedRoomsCount: savedList.length,
        isSaved: false
      }
    });

  } catch (error) {
    console.error('Remove saved room error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to remove saved room'
    }, { status: 500 });
  }
}