import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Booking from '@/lib/models/Booking';
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

// POST: Process payment for a booking
export async function POST(request) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const body = await request.json();
    const { bookingId, paymentAmount, paymentMethod = 'card' } = body;

    if (!bookingId || !paymentAmount) {
      return NextResponse.json({
        success: false,
        error: 'Booking ID and payment amount are required'
      }, { status: 400 });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId)
      .populate('student', '_id fullName email')
      .populate('room', '_id title price');

    if (!booking) {
      return NextResponse.json({
        success: false,
        error: 'Booking not found'
      }, { status: 404 });
    }

    // Verify the booking belongs to the authenticated user
    const bookingStudentId = booking.student?._id?.toString() || booking.student?.toString();
    const authUserId = (decoded.userId || decoded.id).toString();
    
    if (bookingStudentId !== authUserId) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - This booking does not belong to you'
      }, { status: 403 });
    }

    // Check if payment is already completed
    if (booking.paymentStatus === 'paid') {
      return NextResponse.json({
        success: false,
        error: 'Payment has already been completed for this booking'
      }, { status: 409 });
    }

    // Verify payment amount matches expected amount
    const expectedAmount = booking.totalAmount;
    if (Math.abs(paymentAmount - expectedAmount) > 0.01) {
      return NextResponse.json({
        success: false,
        error: `Payment amount mismatch. Expected ₹${expectedAmount}, received ₹${paymentAmount}`
      }, { status: 400 });
    }

    // Simulate payment processing (in real app, this would integrate with payment gateway)
    const paymentSuccess = true; // In real app, call actual payment API

    if (!paymentSuccess) {
      return NextResponse.json({
        success: false,
        error: 'Payment processing failed. Please try again.'
      }, { status: 402 });
    }

    // Update booking with payment information
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: 'confirmed',
        paymentStatus: 'paid',
        'paymentDetails.totalPaid': paymentAmount,
        'paymentDetails.paymentDate': new Date(),
        'paymentDetails.paymentMethod': paymentMethod,
        confirmedAt: new Date()
      },
      { new: true }
    ).populate([
      { path: 'room', select: 'title location images price' },
      { path: 'student', select: 'fullName email phone' }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully! Your booking is now confirmed.',
      data: {
        bookingId: updatedBooking._id,
        status: updatedBooking.status,
        paymentStatus: updatedBooking.paymentStatus,
        paidAmount: updatedBooking.paymentDetails?.totalPaid || paymentAmount,
        paidAt: updatedBooking.paymentDetails?.paymentDate,
        booking: {
          room: {
            title: updatedBooking.room.title,
            location: updatedBooking.room.location
          },
          schedule: {
            moveInDate: updatedBooking.moveInDate,
            duration: updatedBooking.duration
          }
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Payment processing error:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Payment processing failed'
    }, { status: 500 });
  }
}