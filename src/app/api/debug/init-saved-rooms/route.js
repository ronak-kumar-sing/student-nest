import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';

// Initialize savedRooms field for all existing users
export async function POST(request) {
  try {
    await connectDB();

    // Update all users to have savedRooms field if they don't have it
    const result = await User.updateMany(
      { savedRooms: { $exists: false } },
      { $set: { savedRooms: [] } }
    );

    console.log(`Updated ${result.modifiedCount} users with savedRooms field`);

    // Verify the update
    const userCount = await User.countDocuments({ savedRooms: { $exists: true } });
    console.log(`Total users with savedRooms field: ${userCount}`);

    return NextResponse.json({
      success: true,
      message: `Successfully initialized savedRooms field for ${result.modifiedCount} users`,
      data: {
        modifiedCount: result.modifiedCount,
        totalUsersWithField: userCount
      }
    });

  } catch (error) {
    console.error('Error initializing savedRooms field:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to initialize savedRooms field'
    }, { status: 500 });
  }
}