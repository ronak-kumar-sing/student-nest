import { NextResponse } from 'next/server';

// Simulate database - in production, replace with actual database calls
let meetingRequests = [];
let timeSlots = [];
let nextTimeSlotId = 1;

export async function PUT(request, { params }) {
  try {
    const meetingId = parseInt(params.id);
    const body = await request.json();
    const { action, response, proposedTimeSlots } = body;

    // Find the meeting request
    const meetingIndex = meetingRequests.findIndex(req => req.id === meetingId);
    if (meetingIndex === -1) {
      return NextResponse.json(
        { error: 'Meeting request not found' },
        { status: 404 }
      );
    }

    const meeting = meetingRequests[meetingIndex];

    // Validate action
    if (!['accept', 'decline', 'modify'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be accept, decline, or modify' },
        { status: 400 }
      );
    }

    // Update meeting based on action
    let updatedMeeting = { ...meeting };

    switch (action) {
      case 'accept':
        updatedMeeting.status = 'accepted';
        updatedMeeting.ownerResponse = response || 'Meeting accepted';
        break;

      case 'decline':
        updatedMeeting.status = 'declined';
        updatedMeeting.ownerResponse = response || 'Meeting declined';
        break;

      case 'modify':
        if (!proposedTimeSlots || proposedTimeSlots.length === 0) {
          return NextResponse.json(
            { error: 'Proposed time slots are required for modification' },
            { status: 400 }
          );
        }

        updatedMeeting.status = 'modified';
        updatedMeeting.ownerResponse = response || 'Alternative times proposed';

        // Create time slot entries
        const newTimeSlots = proposedTimeSlots.map(slot => ({
          id: nextTimeSlotId++,
          meetingRequestId: meetingId,
          proposedDate: slot.date,
          proposedTime: slot.time,
          proposedBy: 'owner',
          isSelected: false,
          createdAt: new Date().toISOString()
        }));

        timeSlots.push(...newTimeSlots);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    updatedMeeting.updatedAt = new Date().toISOString();
    meetingRequests[meetingIndex] = updatedMeeting;

    return NextResponse.json({
      success: true,
      data: updatedMeeting,
      message: `Meeting ${action}ed successfully`
    });

  } catch (error) {
    console.error('Error responding to meeting request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get specific meeting request details
export async function GET(request, { params }) {
  try {
    const meetingId = parseInt(params.id);

    const meeting = meetingRequests.find(req => req.id === meetingId);
    if (!meeting) {
      return NextResponse.json(
        { error: 'Meeting request not found' },
        { status: 404 }
      );
    }

    // Get associated time slots if any
    const associatedTimeSlots = timeSlots.filter(
      slot => slot.meetingRequestId === meetingId
    );

    return NextResponse.json({
      success: true,
      data: {
        ...meeting,
        proposedTimeSlots: associatedTimeSlots
      }
    });

  } catch (error) {
    console.error('Error fetching meeting request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
