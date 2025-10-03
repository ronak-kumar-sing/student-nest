import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Booking from '@/lib/models/Booking';
import Room from '@/lib/models/Room';

// API to clean up expired bookings (to be called by a cron job)
export async function POST(request) {
  try {
    await connectDB();

    // Find all pending bookings older than 2 days with unpaid status
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const expiredBookings = await Booking.find({
      status: 'pending',
      'financial.paymentStatus': { $ne: 'paid' },
      createdAt: { $lt: twoDaysAgo }
    }).populate('room', '_id title availability');

    console.log(`Found ${expiredBookings.length} expired bookings to clean up`);

    // Update expired bookings to cancelled
    const expiredBookingIds = expiredBookings.map(booking => booking._id);

    if (expiredBookingIds.length > 0) {
      await Booking.updateMany(
        { _id: { $in: expiredBookingIds } },
        {
          status: 'cancelled',
          'timeline.cancelledAt': new Date(),
          'timeline.cancellationReason': 'Expired due to non-payment within 48 hours'
        }
      );

      // Restore room availability for expired bookings
      for (const booking of expiredBookings) {
        if (booking.room) {
          await Room.findByIdAndUpdate(
            booking.room._id,
            {
              $inc: { 'availability.availableRooms': 1 },
              'availability.isAvailable': true
            }
          );
        }
      }

      console.log(`Cancelled ${expiredBookingIds.length} expired bookings and restored room availability`);
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${expiredBookingIds.length} expired bookings`,
      data: {
        expiredCount: expiredBookingIds.length,
        expiredBookingIds
      }
    });

  } catch (error) {
    console.error('Error cleaning up expired bookings:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to clean up expired bookings'
    }, { status: 500 });
  }
}

// Manual endpoint to check for expired bookings
export async function GET(request) {
  try {
    await connectDB();

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const expiredBookings = await Booking.find({
      status: 'pending',
      'financial.paymentStatus': { $ne: 'paid' },
      createdAt: { $lt: twoDaysAgo }
    }).populate('student', 'fullName email')
      .populate('room', 'title')
      .select('_id status createdAt financial student room');

    return NextResponse.json({
      success: true,
      data: {
        expiredBookings,
        count: expiredBookings.length,
        cutoffDate: twoDaysAgo
      }
    });

  } catch (error) {
    console.error('Error checking expired bookings:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to check expired bookings'
    }, { status: 500 });
  }
}