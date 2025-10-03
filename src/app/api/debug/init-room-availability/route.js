import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Room from '@/lib/models/Room';

// Initialize room availability fields for existing rooms
export async function POST(request) {
  try {
    await connectDB();

    // Update all rooms to have totalRooms and availableRooms fields if they don't exist
    const result = await Room.updateMany(
      { 
        $or: [
          { 'availability.totalRooms': { $exists: false } },
          { 'availability.availableRooms': { $exists: false } }
        ]
      },
      { 
        $set: { 
          'availability.totalRooms': 1,
          'availability.availableRooms': 1
        } 
      }
    );

    console.log(`Updated ${result.modifiedCount} rooms with availability fields`);

    // Verify the update
    const roomCount = await Room.countDocuments({ 
      'availability.totalRooms': { $exists: true },
      'availability.availableRooms': { $exists: true }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully initialized availability fields for ${result.modifiedCount} rooms`,
      data: {
        modifiedCount: result.modifiedCount,
        totalRoomsWithAvailability: roomCount
      }
    });

  } catch (error) {
    console.error('Error initializing room availability:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to initialize room availability'
    }, { status: 500 });
  }
}