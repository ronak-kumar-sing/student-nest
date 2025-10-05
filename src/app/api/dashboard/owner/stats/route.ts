import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock data for owner dashboard stats
// TODO: Replace with real database queries
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const authHeader = request.headers.get('authorization');

    // Mock owner stats data
    const stats = {
      activeListings: 5,
      fullyBooked: 2,
      monthlyRevenue: 45000,
      revenueChange: 12, // percentage
      pendingVisits: 7,
      totalMessages: 12,
      unreadMessages: 5,
      totalBookings: 23,
      occupancyRate: 85,

      // Additional stats
      averageRating: 4.6,
      totalReviews: 47,
      responseTime: '2 hours',
      responseRate: 95,

      // Recent activity
      recentActivity: [
        {
          id: '1',
          type: 'booking',
          title: 'New booking request received',
          description: 'Student booked Cozy Apartment',
          time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          icon: 'calendar',
          color: 'blue'
        },
        {
          id: '2',
          type: 'payment',
          title: 'Payment received - ₹15,000',
          description: 'Monthly rent for Modern Studio',
          time: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
          icon: 'dollar',
          color: 'green'
        },
        {
          id: '3',
          type: 'review',
          title: 'New review received',
          description: '5 stars for Luxury PG',
          time: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
          icon: 'star',
          color: 'yellow'
        },
        {
          id: '4',
          type: 'property',
          title: 'Property listing approved',
          description: 'Green Valley PG is now live',
          time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          icon: 'check',
          color: 'green'
        },
        {
          id: '5',
          type: 'visit',
          title: 'Visit request pending',
          description: 'Student wants to visit tomorrow',
          time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          icon: 'calendar',
          color: 'orange'
        }
      ],

      // Analytics overview
      analytics: {
        totalBookings: 24,
        bookingsChange: 8, // percentage
        occupancyRate: 78,
        occupancyChange: -3,
        avgResponseTime: '4.2 hours',
        responseTimeChange: -15,
        overallRating: 4.6,
        ratingChange: 5
      }
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
