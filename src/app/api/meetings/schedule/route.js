import { NextResponse } from 'next/server';

// Simulate database - in production, replace with actual database calls
let meetingRequests = [];
let nextId = 1;

export async function POST(request) {
  try {
    const body = await request.json();
    const { propertyId, meetingType, requestedDate, requestedTime, notes } = body;

    // Get user info from auth token (simplified for demo)
    // In production, decode JWT token to get user info
    const studentId = 1; // Mock student ID

    // Validation
    if (!propertyId || !meetingType || !requestedDate || !requestedTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['online', 'offline'].includes(meetingType)) {
      return NextResponse.json(
        { error: 'Invalid meeting type. Must be online or offline' },
        { status: 400 }
      );
    }

    // Check if meeting time is in the future
    const meetingDateTime = new Date(`${requestedDate}T${requestedTime}`);
    if (meetingDateTime <= new Date()) {
      return NextResponse.json(
        { error: 'Meeting time must be in the future' },
        { status: 400 }
      );
    }

    // Create new meeting request
    const newMeetingRequest = {
      id: nextId++,
      studentId,
      ownerId: 2, // Mock owner ID - in production, get from property
      propertyId: parseInt(propertyId),
      meetingType,
      requestedDate,
      requestedTime,
      status: 'pending',
      studentNotes: notes || '',
      ownerResponse: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    meetingRequests.push(newMeetingRequest);

    return NextResponse.json({
      success: true,
      data: newMeetingRequest,
      message: 'Meeting request created successfully'
    });

  } catch (error) {
    console.error('Error creating meeting request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const ownerId = searchParams.get('ownerId');

    let filteredRequests = meetingRequests;

    if (studentId) {
      filteredRequests = meetingRequests.filter(
        req => req.studentId === parseInt(studentId)
      );
    } else if (ownerId) {
      filteredRequests = meetingRequests.filter(
        req => req.ownerId === parseInt(ownerId)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredRequests
    });

  } catch (error) {
    console.error('Error fetching meeting requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
