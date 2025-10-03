import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import User from '@/lib/models/User';
import Room from '@/lib/models/Room';
import Booking from '@/lib/models/Booking';
import Meeting from '@/lib/models/Meeting';
import Review from '@/lib/models/Review';
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

export async function GET(request, { params }) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const resolvedParams = await params;
    const userId = decoded.userId || decoded.id || resolvedParams?.userId;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    // Get user details
    const user = await User.findById(userId).select('-password -refreshTokens');
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    let dashboardData = {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        isIdentityVerified: user.isIdentityVerified,
        lastLogin: user.lastLogin
      }
    };

    if (user.role === 'student' || user.role === 'Student') {
      // Student Dashboard Data
      const [
        savedRoomsCount,
        activeBookings,
        scheduledVisits,
        reviewsGiven,
        recentActivity,
        recommendations
      ] = await Promise.all([
        // Saved rooms count (we'll need to create a SavedRoom model later)
        0, // Placeholder

        // Active bookings
        Booking.find({
          student: userId,
          status: { $in: ['pending', 'confirmed', 'active'] }
        }).populate('room', 'title images location price'),

        // Scheduled visits
        Meeting.find({
          student: userId,
          status: { $in: ['pending', 'confirmed'] }
        }).populate('property', 'title location images'),

        // Reviews given
        Review.countDocuments({ student: userId }),

        // Recent activity (simplified)
        [],

        // Recommendations (top 5 rooms based on preferences)
        Room.find({
          status: 'active',
          'availability.isAvailable': true
        })
        .populate('owner', 'fullName isVerified')
        .sort({ rating: -1, createdAt: -1 })
        .limit(5)
      ]);

      dashboardData.stats = {
        savedRooms: savedRoomsCount,
        scheduledVisits: scheduledVisits.length,
        activeBookings: activeBookings.length,
        reviewsGiven: reviewsGiven
      };

      dashboardData.recentActivity = [
        ...activeBookings.slice(0, 3).map(booking => ({
          type: 'booking',
          message: `Booking for ${booking.room?.title}`,
          timestamp: booking.createdAt,
          status: booking.status
        })),
        ...scheduledVisits.slice(0, 2).map(meeting => ({
          type: 'meeting',
          message: `Visit scheduled for ${meeting.property?.title}`,
          timestamp: meeting.confirmedDate || meeting.createdAt,
          status: meeting.status
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      dashboardData.recommendations = recommendations.map(room => ({
        id: room._id,
        title: room.title,
        price: room.price,
        image: room.images?.[0] || '/api/placeholder/300/200',
        rating: room.rating || 0,
        location: room.location?.city,
        reason: 'Based on your preferences'
      }));

      dashboardData.upcomingVisits = scheduledVisits
        .filter(visit => visit.status === 'confirmed')
        .map(visit => ({
          id: visit._id,
          propertyTitle: visit.property?.title,
          date: visit.confirmedDate,
          time: visit.confirmedTime,
          status: visit.status
        }));

    } else if (user.role === 'owner' || user.role === 'Owner') {
      // Owner Dashboard Data
      const [
        properties,
        totalBookings,
        pendingVisits,
        totalMessages,
        monthlyRevenue,
        recentActivity
      ] = await Promise.all([
        // Owner's properties
        Room.find({ owner: userId }),

        // Total bookings
        Booking.find({ owner: userId }),

        // Pending visits
        Meeting.find({
          owner: userId,
          status: { $in: ['pending', 'confirmed'] }
        }).populate('student', 'fullName').populate('property', 'title'),

        // Messages (placeholder - we'll implement messaging later)
        0,

        // Calculate monthly revenue
        Booking.aggregate([
          {
            $match: {
              owner: userId,
              status: 'active',
              createdAt: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$monthlyRent' }
            }
          }
        ]),

        // Recent activity
        []
      ]);

      const activeListings = properties.filter(p => p.status === 'active').length;
      const fullyBooked = properties.filter(p => p.occupiedRooms >= p.totalRooms).length;
      const pendingBookings = totalBookings.filter(b => b.status === 'pending').length;
      const totalReviews = await Review.countDocuments({
        property: { $in: properties.map(p => p._id) }
      });

      // Calculate occupancy rate
      const totalCapacity = properties.reduce((sum, p) => sum + p.totalRooms, 0);
      const totalOccupied = properties.reduce((sum, p) => sum + p.occupiedRooms, 0);
      const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

      dashboardData.stats = {
        activeListings,
        fullyBooked,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        revenueChange: 12, // Placeholder - calculate actual change
        pendingVisits: pendingVisits.length,
        totalMessages: totalMessages,
        unreadMessages: 5, // Placeholder
        totalBookings: totalBookings.length,
        occupancyRate,
        pendingBookings,
        totalReviews
      };

      dashboardData.recentActivity = [
        ...totalBookings.slice(0, 3).map(booking => ({
          id: booking._id,
          type: 'booking',
          title: 'New booking request received',
          description: `Booking request for ${booking.room?.title}`,
          time: getTimeAgo(booking.createdAt),
          urgent: booking.isUrgent || false
        })),
        ...pendingVisits.slice(0, 2).map(visit => ({
          id: visit._id,
          type: 'meeting',
          title: 'Property visit scheduled',
          description: `${visit.student?.fullName} wants to visit ${visit.property?.title}`,
          time: getTimeAgo(visit.createdAt),
          urgent: visit.isUrgent || false
        }))
      ].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      dashboardData.analytics = {
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        revenueChange: 12, // Calculate actual percentage change
        totalBookings: totalBookings.length,
        bookingChange: 8, // Calculate actual change
        averageOccupancy: occupancyRate,
        occupancyChange: -3, // Calculate actual change
        conversionRate: 68 // Calculate from visits to bookings
      };

      dashboardData.properties = properties.map(property => ({
        id: property._id,
        title: property.title,
        status: property.status,
        occupancy: `${property.occupiedRooms}/${property.totalRooms}`,
        monthlyRent: property.price,
        lastUpdated: property.updatedAt
      }));

      dashboardData.upcomingMeetings = pendingVisits
        .filter(visit => visit.status === 'confirmed')
        .map(visit => ({
          id: visit._id,
          studentName: visit.student?.fullName,
          propertyTitle: visit.property?.title,
          date: visit.confirmedDate,
          time: visit.confirmedTime,
          type: visit.meetingType
        }));
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch dashboard data'
    }, { status: 500 });
  }
}

// Helper function to format time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
}