import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import connectDB from '@/lib/db/connection';
import Room from '@/lib/models/Room';
import Booking from '@/lib/models/Booking';
import Meeting from '@/lib/models/Meeting';
import Review from '@/lib/models/Review';
import { verifyAccessToken } from '@/lib/utils/jwt';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Authentication check
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = await verifyAccessToken(token);

    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const ownerId = decoded.userId;

    // Fetch all necessary data in parallel
    const [properties, bookings, meetings, reviews] = await Promise.all([
      Room.find({ owner: ownerId }).lean(),
      Booking.find({ owner: ownerId })
        .populate('room', 'title images')
        .populate('student', 'fullName email')
        .sort({ createdAt: -1 })
        .lean(),
      Meeting.find({ owner: ownerId })
        .populate('property', 'title')
        .populate('student', 'fullName')
        .sort({ createdAt: -1 })
        .lean(),
      // Reviews would be fetched based on property ownership
      Promise.resolve([]) // Placeholder
    ]);

    // Calculate statistics
    const activeListings = properties.filter(p => p.status === 'active').length;
    const totalRooms = properties.reduce((sum, p) => sum + (p.totalRooms || 1), 0);
    const availableRooms = properties.reduce((sum, p) => sum + ((p as any).availableRooms || 1), 0);
    const occupiedRooms = totalRooms - availableRooms;

    const fullyBooked = properties.filter(p =>
      (p as any).availableRooms === 0
    ).length;

    // Calculate monthly revenue from active bookings
    const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'confirmed');
    const monthlyRevenue = activeBookings.reduce((sum, b) => sum + (b.monthlyRent || 0), 0);

    // Calculate previous month revenue (simplified)
    const lastMonthRevenue = monthlyRevenue * 0.9; // Placeholder
    const revenueChange = lastMonthRevenue > 0
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

    // Pending visits
    const pendingVisits = meetings.filter(m => m.status === 'pending').length;

    // Messages (placeholder)
    const totalMessages = 0;
    const unreadMessages = 0;

    // Total bookings
    const totalBookings = bookings.length;

    // Occupancy rate
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    // Reviews
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : 4.5; // Default
    const totalReviews = reviews.length;

    // Response metrics
    const respondedMeetings = meetings.filter(m =>
      m.status !== 'pending'
    ).length;
    const responseRate = meetings.length > 0
      ? (respondedMeetings / meetings.length) * 100
      : 0;

    const responseTime = "2 hours"; // Simplified

    // Recent activity
    const recentActivity = [
      ...bookings.slice(0, 3).map((b: any) => ({
        id: b._id.toString(),
        type: 'booking',
        title: 'New Booking',
        description: `${b.student?.fullName || 'Student'} booked ${b.room?.title || 'a room'}`,
        time: new Date(b.createdAt).toISOString(),
        icon: 'calendar',
        color: 'blue'
      })),
      ...meetings.slice(0, 3).map((m: any) => ({
        id: m._id.toString(),
        type: 'meeting',
        title: 'Visit Request',
        description: `${m.student?.fullName || 'Student'} requested visit to ${m.property?.title || 'property'}`,
        time: new Date(m.createdAt).toISOString(),
        icon: 'calendar',
        color: 'green'
      }))
    ].slice(0, 10);

    // Analytics
    const analytics = {
      totalBookings: bookings.length,
      bookingsChange: 10, // Placeholder - would need historical data
      occupancyRate: Math.round(occupancyRate),
      occupancyChange: 5, // Placeholder
      avgResponseTime: responseTime,
      responseTimeChange: -15, // Placeholder (negative is good)
      overallRating: Math.round(averageRating * 10) / 10,
      ratingChange: 0.2 // Placeholder
    };

    const stats = {
      activeListings,
      fullyBooked,
      monthlyRevenue: Math.round(monthlyRevenue),
      revenueChange: Math.round(revenueChange * 10) / 10,
      pendingVisits,
      totalMessages,
      unreadMessages,
      totalBookings,
      occupancyRate: Math.round(occupancyRate * 10) / 10,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      responseTime,
      responseRate: Math.round(responseRate * 10) / 10,
      recentActivity,
      analytics
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching owner stats:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch owner stats'
    }, { status: 500 });
  }
}
