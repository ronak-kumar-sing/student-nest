import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock data for development - replace with actual database calls
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // const authHeader = request.headers.get('authorization');
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || searchParams.get('period') || 'all';

    // Mock data structure matching the backend API
    const mockData: any = {};

    if (type === 'all' || type === 'activity') {
      mockData.recentActivity = [
        {
          id: '1',
          type: 'booking',
          title: 'New Booking',
          description: 'Demo Student booked Cozy Apartment',
          time: new Date().toISOString(),
          status: 'confirmed',
          urgent: false
        },
        {
          id: '2',
          type: 'meeting',
          title: 'Visit Request',
          description: 'Student requested to visit Modern Studio',
          time: new Date(Date.now() - 86400000).toISOString(),
          status: 'pending',
          urgent: true
        },
        {
          id: '3',
          type: 'review',
          title: 'New Review',
          description: 'Student reviewed Luxury Suite',
          time: new Date(Date.now() - 172800000).toISOString(),
          rating: 4.5,
          urgent: false
        }
      ];
    }

    if (type === 'all' || type === 'visits') {
      mockData.visitRequests = {
        total: 12,
        pending: 5,
        confirmed: 4,
        completed: 3,
        visits: [
          {
            id: '1',
            studentName: 'John Doe',
            studentPhone: '+1234567890',
            studentEmail: 'john@example.com',
            propertyTitle: 'Cozy Apartment',
            propertyLocation: 'New York',
            status: 'pending',
            requestDate: new Date().toISOString()
          }
        ]
      };
    }

    if (type === 'all' || type === 'revenue') {
      const currentMonth = 15000;
      const lastMonth = 12000;
      const changePercentage = Math.round(((currentMonth - lastMonth) / lastMonth) * 100);

      mockData.revenue = {
        currentMonth,
        lastMonth,
        changePercentage,
        allTime: 85000,
        activeBookings: [
          {
            id: '1',
            studentName: 'Jane Smith',
            propertyTitle: 'Modern Studio',
            monthlyRent: 1500,
            startDate: new Date().toISOString(),
            status: 'active'
          },
          {
            id: '2',
            studentName: 'John Doe',
            propertyTitle: 'Cozy Apartment',
            monthlyRent: 1200,
            startDate: new Date().toISOString(),
            status: 'active'
          }
        ],
        pendingPayments: [
          {
            id: '1',
            studentName: 'Bob Wilson',
            propertyTitle: 'Luxury Suite',
            amount: 2000,
            dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
            overdue: false
          }
        ]
      };
    }

    if (type === 'all') {
      mockData.propertyPerformance = [
        {
          propertyId: '1',
          name: 'Modern Studio',
          title: 'Modern Studio',
          revenue: 12000,
          occupancy: 95,
          bookings: 8,
          totalBookings: 8,
          rating: 4.5,
          averageRating: 4.5,
          totalReviews: 12
        },
        {
          propertyId: '2',
          name: 'Cozy Apartment',
          title: 'Cozy Apartment',
          revenue: 8500,
          occupancy: 80,
          bookings: 5,
          totalBookings: 5,
          rating: 4.2,
          averageRating: 4.2,
          totalReviews: 8
        },
        {
          propertyId: '3',
          name: 'Luxury Suite',
          title: 'Luxury Suite',
          revenue: 15000,
          occupancy: 100,
          bookings: 3,
          totalBookings: 3,
          rating: 4.8,
          averageRating: 4.8,
          totalReviews: 15
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: mockData
    });

  } catch (error) {
    console.error('Error fetching owner analytics:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics data'
    }, { status: 500 });
  }
}
