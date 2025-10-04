import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Booking from '@/lib/models/Booking';
import Room from '@/lib/models/Room';
import User from '@/lib/models/User';
import { verifyAccessToken } from '@/lib/utils/jwt';

// Helper function to verify JWT token
async function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// POST: Create a new booking
export async function POST(request) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['roomId', 'moveInDate', 'duration'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Verify student exists
    const student = await User.findById(decoded.userId || decoded.id);
    if (!student || (student.role !== 'student' && student.role !== 'Student')) {
      return NextResponse.json({
        success: false,
        error: 'Only students can create bookings'
      }, { status: 403 });
    }

    // Verify room exists and is available
    const room = await Room.findById(body.roomId).populate('owner');
    if (!room) {
      return NextResponse.json({
        success: false,
        error: 'Room not found'
      }, { status: 404 });
    }

    if (!room.availability.isAvailable || room.availability.availableRooms <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Room is not available for booking'
      }, { status: 409 });
    }

    // Check if student already has a booking for this room
    const existingBooking = await Booking.findOne({
      room: body.roomId,
      student: decoded.userId || decoded.id,
      status: { $in: ['pending', 'confirmed', 'active'] }
    });

    if (existingBooking) {
      return NextResponse.json({
        success: false,
        error: 'You already have an active booking for this room'
      }, { status: 409 });
    }

    // Validate move-in date
    const moveInDate = new Date(body.moveInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (moveInDate < today) {
      return NextResponse.json({
        success: false,
        error: 'Move-in date cannot be in the past'
      }, { status: 400 });
    }

    // Calculate financial details
    const monthlyRent = room.price;
    const securityDeposit = body.securityDeposit || room.securityDeposit || monthlyRent;
    const maintenanceCharges = body.maintenanceCharges || room.maintenanceCharges || 0;
    const totalAmount = monthlyRent + securityDeposit + maintenanceCharges;

    // Create booking data
    const bookingData = {
      room: body.roomId,
      student: decoded.userId || decoded.id,
      owner: room.owner._id,
      moveInDate: moveInDate,
      duration: body.duration,
      monthlyRent: monthlyRent,
      securityDeposit: securityDeposit,
      maintenanceCharges: maintenanceCharges,
      totalAmount: totalAmount,
      agreementType: body.agreementType || 'monthly',
      studentNotes: body.notes || '',
      isUrgent: body.isUrgent || false,
      priority: body.isUrgent ? 'high' : 'medium'
    };

    // Create the booking
    const booking = new Booking(bookingData);
    await booking.save();

    // Update room availability - reduce available rooms by 1
    await Room.findByIdAndUpdate(
      body.roomId,
      {
        $inc: { 'availability.availableRooms': -1 },
        $set: {
          'availability.isAvailable': room.availability.availableRooms > 1
        }
      }
    );

    console.log(`Room ${body.roomId} availability reduced by 1 due to new booking`);

    // Populate booking for response
    await booking.populate([
      {
        path: 'room',
        select: 'title location images price amenities features'
      },
      {
        path: 'student',
        select: 'fullName phone email profilePhoto'
      },
      {
        path: 'owner',
        select: 'fullName phone email profilePhoto'
      }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      data: {
        bookingId: booking._id,
        status: booking.status,
        room: {
          title: booking.room.title,
          location: booking.room.location,
          images: booking.room.images
        },
        financial: {
          monthlyRent: booking.monthlyRent,
          securityDeposit: booking.securityDeposit,
          maintenanceCharges: booking.maintenanceCharges,
          totalAmount: booking.totalAmount
        },
        schedule: {
          moveInDate: booking.moveInDate,
          moveOutDate: booking.moveOutDate,
          duration: booking.duration
        },
        paymentRequired: {
          immediatePayment: booking.totalAmount,
          paymentStatus: booking.paymentStatus
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating booking:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to create booking'
    }, { status: 500 });
  }
}

// GET: Fetch bookings for user
export async function GET(request) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const type = searchParams.get('type'); // 'student' or 'owner'
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Get user to determine role
    const user = await User.findById(decoded.userId || decoded.id);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Build query based on user role and type
    let query = {};

    if (user.role === 'student' || user.role === 'Student') {
      query.student = decoded.userId || decoded.id;
    } else if (user.role === 'owner' || user.role === 'Owner') {
      query.owner = decoded.userId || decoded.id;
    }

    // Add status filter if provided
    if (status) {
      if (status === 'active') {
        query.status = { $in: ['confirmed', 'active'] };
      } else {
        query.status = status;
      }
    }

    // Execute query
    const [bookings, totalCount] = await Promise.all([
      Booking.find(query)
        .populate('room', 'title location images price amenities features')
        .populate('student', 'fullName phone email profilePhoto')
        .populate('owner', 'fullName phone email profilePhoto businessName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(query)
    ]);

    // Format bookings
    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      status: booking.status,

      room: {
        id: booking.room._id,
        title: booking.room.title,
        location: booking.room.location,
        images: booking.room.images,
        price: booking.room.price,
        amenities: booking.room.amenities,
        features: booking.room.features
      },

      student: {
        id: booking.student._id,
        name: booking.student.fullName,
        phone: booking.student.phone,
        email: booking.student.email,
        profilePhoto: booking.student.profilePhoto
      },

      owner: {
        id: booking.owner._id,
        name: booking.owner.fullName,
        businessName: booking.owner.businessName,
        phone: booking.owner.phone,
        email: booking.owner.email,
        profilePhoto: booking.owner.profilePhoto
      },

      schedule: {
        moveInDate: booking.moveInDate,
        moveOutDate: booking.moveOutDate,
        duration: booking.duration,
        agreementType: booking.agreementType
      },

      financial: {
        monthlyRent: booking.monthlyRent,
        securityDeposit: booking.securityDeposit,
        maintenanceCharges: booking.maintenanceCharges,
        totalAmount: booking.totalAmount,
        totalPaid: booking.paymentDetails.totalPaid,
        paymentStatus: booking.paymentStatus
      },

      notes: {
        student: booking.studentNotes,
        owner: booking.ownerNotes
      },

      checkIn: booking.checkInDetails,
      checkOut: booking.checkOutDetails,

      timeline: {
        createdAt: booking.createdAt,
        confirmedAt: booking.confirmedAt,
        rejectedAt: booking.rejectedAt,
        cancelledAt: booking.cancelledAt,
        completedAt: booking.completedAt
      },

      reviews: {
        studentSubmitted: booking.studentReviewSubmitted,
        ownerSubmitted: booking.ownerReviewSubmitted
      },

      // Helper fields
      isActive: booking.isActive(),
      durationInDays: booking.durationInDays,
      totalContractValue: booking.totalContractValue,
      priority: booking.priority,
      isUrgent: booking.isUrgent
    }));

    // Pagination info
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        bookings: formattedBookings,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit
        },
        summary: {
          totalBookings: totalCount,
          statusBreakdown: await getBookingStatusBreakdown(query, decoded.userId || decoded.id)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch bookings'
    }, { status: 500 });
  }
}

// Helper function to get booking status breakdown
async function getBookingStatusBreakdown(baseQuery, userId) {
  try {
    const statusBreakdown = await Booking.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const breakdown = {
      pending: 0,
      confirmed: 0,
      active: 0,
      completed: 0,
      cancelled: 0,
      rejected: 0,
      totalRevenue: 0
    };

    statusBreakdown.forEach(item => {
      breakdown[item._id] = item.count;
      if (['confirmed', 'active', 'completed'].includes(item._id)) {
        breakdown.totalRevenue += item.totalAmount;
      }
    });

    return breakdown;
  } catch (error) {
    console.error('Error calculating booking breakdown:', error);
    return {};
  }
}