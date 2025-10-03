import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Meeting from '@/lib/models/Meeting';
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

// POST: Schedule a new meeting
export async function POST(request) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['propertyId', 'ownerId', 'preferredDates'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Verify property exists
    const property = await Room.findById(body.propertyId);
    if (!property) {
      return NextResponse.json({
        success: false,
        error: 'Property not found'
      }, { status: 404 });
    }

    // Verify owner exists
    const owner = await User.findById(body.ownerId);
    if (!owner || (owner.role !== 'owner' && owner.role !== 'Owner')) {
      return NextResponse.json({
        success: false,
        error: 'Owner not found'
      }, { status: 404 });
    }

    // Verify student exists
    const student = await User.findById(decoded.userId || decoded.id);
    if (!student || (student.role !== 'student' && student.role !== 'Student')) {
      return NextResponse.json({
        success: false,
        error: 'Student not found'
      }, { status: 404 });
    }

    // Check if there's already a pending/confirmed meeting
    const existingMeeting = await Meeting.findOne({
      property: body.propertyId,
      student: decoded.userId || decoded.id,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingMeeting) {
      return NextResponse.json({
        success: false,
        error: 'You already have a pending or confirmed meeting for this property'
      }, { status: 409 });
    }

    // Validate preferred dates
    const preferredDates = body.preferredDates.map(date => new Date(date));
    const now = new Date();
    // Add 30 minutes buffer to account for processing time
    const minDate = new Date(now.getTime() + (30 * 60 * 1000));
    const validDates = preferredDates.filter(date => date > minDate);

    if (validDates.length === 0) {
      console.log('Date validation failed:', {
        preferredDates: preferredDates.map(d => d.toISOString()),
        now: now.toISOString(),
        minDate: minDate.toISOString()
      });
      return NextResponse.json({
        success: false,
        error: 'All preferred dates must be at least 30 minutes in the future'
      }, { status: 400 });
    }

    // Create meeting data
    const meetingData = {
      property: body.propertyId,
      student: decoded.userId || decoded.id,
      owner: body.ownerId,
      preferredDates: validDates,
      meetingType: body.meetingType || 'physical',
      studentNotes: body.notes || '',
      purpose: body.purpose || 'property_viewing',
      requirements: body.requirements || [],
      priority: body.isUrgent ? 'high' : 'medium',
      isUrgent: body.isUrgent || false
    };

    // Create the meeting
    const meeting = new Meeting(meetingData);
    await meeting.save();

    // Populate the meeting with related data for response
    await meeting.populate([
      { path: 'property', select: 'title location images' },
      { path: 'student', select: 'fullName phone email' },
      { path: 'owner', select: 'fullName phone email' }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Meeting request sent successfully',
      data: {
        meetingId: meeting._id,
        status: meeting.status,
        property: {
          title: meeting.property.title,
          location: meeting.property.location
        },
        preferredDates: meeting.preferredDates,
        studentContact: {
          name: meeting.student.fullName,
          phone: meeting.student.phone,
          email: meeting.student.email
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error scheduling meeting:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to schedule meeting'
    }, { status: 500 });
  }
}

// GET: Fetch meetings for user
export async function GET(request) {
  try {
    await connectDB();

    // Verify authentication
    const decoded = await verifyToken(request);
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const type = searchParams.get('type'); // 'sent' or 'received'
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Get user to determine role
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    // Build query based on user role and type
    let query = {};

    if (user.role === 'student' || user.role === 'Student') {
      if (type === 'sent' || !type) {
        query.student = decoded.userId || decoded.id;
      }
    } else if (user.role === 'owner' || user.role === 'Owner') {
      if (type === 'received' || !type) {
        query.owner = decoded.userId || decoded.id;
      }
    }

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Execute query
    const [meetings, totalCount] = await Promise.all([
      Meeting.find(query)
        .populate('property', 'title location images price')
        .populate('student', 'fullName phone email profilePhoto')
        .populate('owner', 'fullName phone email profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Meeting.countDocuments(query)
    ]);

    // Format meetings
    const formattedMeetings = meetings.map(meeting => ({
      id: meeting._id,
      status: meeting.status,
      meetingType: meeting.meetingType,
      purpose: meeting.purpose,

      property: {
        id: meeting.property._id,
        title: meeting.property.title,
        location: meeting.property.location,
        images: meeting.property.images,
        price: meeting.property.price
      },

      student: {
        id: meeting.student._id,
        name: meeting.student.fullName,
        phone: meeting.student.phone,
        email: meeting.student.email,
        profilePhoto: meeting.student.profilePhoto
      },

      owner: {
        id: meeting.owner._id,
        name: meeting.owner.fullName,
        phone: meeting.owner.phone,
        email: meeting.owner.email,
        profilePhoto: meeting.owner.profilePhoto
      },

      schedule: {
        preferredDates: meeting.preferredDates,
        confirmedDate: meeting.confirmedDate,
        confirmedTime: meeting.confirmedTime
      },

      notes: {
        student: meeting.studentNotes,
        owner: meeting.ownerNotes
      },

      virtualMeetingDetails: meeting.virtualMeetingDetails,
      outcome: meeting.outcome,

      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,

      // Helper fields
      isUpcoming: meeting.isUpcoming,
      estimatedDuration: meeting.estimatedDuration
    }));

    // Pagination info
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        meetings: formattedMeetings,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Error fetching meetings:', error);

    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch meetings'
    }, { status: 500 });
  }
}