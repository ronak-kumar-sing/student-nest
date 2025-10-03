import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Room from '@/lib/models/Room';
import Booking from '@/lib/models/Booking';
import Meeting from '@/lib/models/Meeting';
import Review from '@/lib/models/Review';
import { verifyAccessToken } from '@/lib/utils/jwt';

// Helper function to verify JWT token and get user
async function getAuthenticatedUser(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No valid authorization header found' };
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    if (!decoded.userId) {
      return { error: 'Invalid token payload' };
    }

    return { userId: decoded.userId, role: decoded.role };
  } catch (error) {
    console.error('Authentication error:', error);
    return { error: 'Invalid or expired token' };
  }
}

// GET /api/owner/analytics - Get owner analytics data
export async function GET(request) {
  try {
    const { userId, role, error } = await getAuthenticatedUser(request);

    if (error) {
      return NextResponse.json({
        success: false,
        error
      }, { status: 401 });
    }

    if (role?.toLowerCase() !== 'owner') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized: Owner access required'
      }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // all, activity, visits, revenue

    // Get owner's properties
    const properties = await Room.find({ owner: userId }).select('_id title');
    const propertyIds = properties.map(p => p._id);

    let responseData = {};

    if (type === 'all' || type === 'activity') {
      // Recent Activity
      const [recentBookings, recentMeetings, recentReviews] = await Promise.all([
        Booking.find({
          room: { $in: propertyIds }
        })
        .populate('room', 'title')
        .populate('student', 'fullName')
        .sort({ createdAt: -1 })
        .limit(10),

        Meeting.find({
          property: { $in: propertyIds }
        })
        .populate('property', 'title')
        .populate('student', 'fullName')
        .sort({ createdAt: -1 })
        .limit(10),

        Review.find({
          property: { $in: propertyIds }
        })
        .populate('property', 'title')
        .populate('student', 'fullName')
        .sort({ createdAt: -1 })
        .limit(5)
      ]);

      const recentActivity = [
        ...recentBookings.map(booking => ({
          id: booking._id,
          type: 'booking',
          title: 'New Booking',
          description: `${booking.student?.fullName} booked ${booking.room?.title}`,
          time: booking.createdAt,
          status: booking.status,
          urgent: booking.status === 'pending'
        })),
        ...recentMeetings.map(meeting => ({
          id: meeting._id,
          type: 'meeting',
          title: 'Visit Request',
          description: `${meeting.student?.fullName} requested to visit ${meeting.property?.title}`,
          time: meeting.createdAt,
          status: meeting.status,
          urgent: meeting.status === 'pending'
        })),
        ...recentReviews.map(review => ({
          id: review._id,
          type: 'review',
          title: 'New Review',
          description: `${review.student?.fullName} reviewed ${review.property?.title}`,
          time: review.createdAt,
          rating: review.rating?.overall || 0,
          urgent: false
        }))
      ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 15);

      responseData.recentActivity = recentActivity;
    }

    if (type === 'all' || type === 'visits') {
      // Visit Requests
      const visitRequests = await Meeting.find({
        property: { $in: propertyIds }
      })
      .populate('property', 'title location images')
      .populate('student', 'fullName phone email')
      .sort({ createdAt: -1 });

      const formattedVisits = visitRequests.map(visit => ({
        id: visit._id,
        studentName: visit.student?.fullName,
        studentPhone: visit.student?.phone,
        studentEmail: visit.student?.email,
        propertyTitle: visit.property?.title,
        propertyLocation: visit.property?.location?.city,
        proposedDates: visit.proposedTimes || [],
        confirmedDate: visit.confirmedDate,
        confirmedTime: visit.confirmedTime,
        status: visit.status,
        requestDate: visit.createdAt,
        notes: visit.notes,
        meetingType: visit.meetingType || 'physical'
      }));

      responseData.visitRequests = {
        total: formattedVisits.length,
        pending: formattedVisits.filter(v => v.status === 'pending').length,
        confirmed: formattedVisits.filter(v => v.status === 'confirmed').length,
        completed: formattedVisits.filter(v => v.status === 'completed').length,
        visits: formattedVisits
      };
    }

    if (type === 'all' || type === 'revenue') {
      // Revenue & Payments
      const currentMonth = new Date();
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const startOfLastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      const endOfLastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);

      const [
        currentMonthBookings,
        lastMonthBookings,
        totalActiveBookings,
        totalPendingPayments,
        totalRevenue
      ] = await Promise.all([
        // Current month bookings
        Booking.find({
          room: { $in: propertyIds },
          createdAt: { $gte: startOfMonth },
          status: { $in: ['confirmed', 'active'] }
        }),

        // Last month bookings for comparison
        Booking.find({
          room: { $in: propertyIds },
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          status: { $in: ['confirmed', 'active'] }
        }),

        // Total active bookings
        Booking.find({
          room: { $in: propertyIds },
          status: 'active'
        }).populate('room', 'title price').populate('student', 'fullName'),

        // Pending payments
        Booking.find({
          room: { $in: propertyIds },
          status: 'pending',
          paymentStatus: 'pending'
        }).populate('room', 'title price').populate('student', 'fullName'),

        // All time revenue
        Booking.find({
          room: { $in: propertyIds },
          status: { $in: ['confirmed', 'active', 'completed'] }
        })
      ]);

      const currentMonthRevenue = currentMonthBookings.reduce((sum, booking) => sum + (booking.monthlyRent || 0), 0);
      const lastMonthRevenue = lastMonthBookings.reduce((sum, booking) => sum + (booking.monthlyRent || 0), 0);
      const revenueChange = lastMonthRevenue > 0
        ? Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
        : 0;

      const allTimeRevenue = totalRevenue.reduce((sum, booking) => sum + (booking.monthlyRent || 0), 0);

      responseData.revenue = {
        currentMonth: currentMonthRevenue,
        lastMonth: lastMonthRevenue,
        changePercentage: revenueChange,
        allTime: allTimeRevenue,
        activeBookings: totalActiveBookings.map(booking => ({
          id: booking._id,
          studentName: booking.student?.fullName,
          propertyTitle: booking.room?.title,
          monthlyRent: booking.monthlyRent || booking.room?.price,
          startDate: booking.startDate,
          endDate: booking.endDate,
          status: booking.status
        })),
        pendingPayments: totalPendingPayments.map(booking => ({
          id: booking._id,
          studentName: booking.student?.fullName,
          propertyTitle: booking.room?.title,
          amount: booking.monthlyRent || booking.room?.price,
          dueDate: booking.paymentDueDate || booking.createdAt,
          overdue: new Date() > new Date(booking.paymentDueDate || booking.createdAt)
        }))
      };
    }

    // Property performance summary
    if (type === 'all') {
      const propertyPerformance = await Promise.all(
        properties.map(async (property) => {
          const [bookings, reviews, meetings] = await Promise.all([
            Booking.countDocuments({ room: property._id }),
            Review.find({ property: property._id }),
            Meeting.countDocuments({ property: property._id })
          ]);

          const avgRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + (review.rating?.overall || 0), 0) / reviews.length
            : 0;

          return {
            propertyId: property._id,
            title: property.title,
            totalBookings: bookings,
            totalMeetings: meetings,
            totalReviews: reviews.length,
            averageRating: Math.round(avgRating * 10) / 10
          };
        })
      );

      responseData.propertyPerformance = propertyPerformance;
    }

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Error fetching owner analytics:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics data'
    }, { status: 500 });
  }
}