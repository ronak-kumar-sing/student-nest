# Meeting Scheduling System - README

A flexible meeting scheduling module for the student room & PG booking platform, enabling seamless coordination between students and property owners for property visits.

## Overview

This module handles the core meeting scheduling functionality where students can request property visits (online or offline) and owners have full control to accept, decline, or modify meeting times. The system is designed to be flexible and accommodating to both parties.

## Core Meeting Flow

### Student Initiates Meeting Request
1. **From Room/PG Page**: Student clicks "Schedule Visit" button
2. **Meeting Type Selection**: Choose between:
   - **Online Meeting**: Virtual property tour/discussion
   - **Offline Meeting**: In-person property visit
3. **Time Preference**: Select preferred date and time slot
4. **Request Submission**: Send proposal to property owner

### Owner Manages Meeting Requests
1. **Receive Notification**: New meeting request appears in owner dashboard
2. **Review Request Details**:
   - Student information and profile
   - Requested meeting type (online/offline)
   - Proposed date and time
   - Additional notes from student
3. **Decision Making** - Three options available:
   - **Accept**: Confirm meeting as requested
   - **Decline**: Reject with optional reason
   - **Modify**: Suggest alternative time slots

### Time Modification Process
- Owner can propose multiple alternative time slots
- Student receives notification with new time options
- Student can accept one of the proposed times or request further changes
- System continues negotiation until both parties agree

## Database Schema

### MeetingRequests Table
```sql
{
  id: Primary Key
  studentId: Foreign Key to Users
  ownerId: Foreign Key to Users  
  propertyId: Foreign Key to Properties
  meetingType: ENUM('online', 'offline')
  requestedDate: DateTime
  requestedTime: Time
  status: ENUM('pending', 'accepted', 'declined', 'modified', 'confirmed')
  studentNotes: Text
  ownerResponse: Text
  createdAt: DateTime
  updatedAt: DateTime
}
```

### MeetingTimeSlots Table (for modifications)
```sql
{
  id: Primary Key
  meetingRequestId: Foreign Key to MeetingRequests
  proposedDate: DateTime
  proposedTime: Time
  proposedBy: ENUM('student', 'owner')
  isSelected: Boolean
  createdAt: DateTime
}
```

## API Endpoints

### Student Endpoints
```javascript
// Create new meeting request
POST /api/meetings/schedule
Body: {
  propertyId: number,
  meetingType: 'online' | 'offline',
  requestedDate: string,
  requestedTime: string,
  notes?: string
}

// Get student's meeting requests
GET /api/meetings/student/:studentId

// Accept modified time slot
PUT /api/meetings/:meetingId/accept-time
Body: { timeSlotId: number }

// Request further time changes
POST /api/meetings/:meetingId/counter-modify
Body: { 
  proposedDates: Array<{date: string, time: string}>,
  notes?: string 
}
```

### Owner Endpoints
```javascript
// Get owner's meeting requests
GET /api/meetings/owner/:ownerId

// Respond to meeting request
PUT /api/meetings/:meetingId/respond
Body: {
  action: 'accept' | 'decline' | 'modify',
  response?: string,
  proposedTimeSlots?: Array<{date: string, time: string}>
}

// Confirm final meeting time
PUT /api/meetings/:meetingId/confirm
Body: { finalDateTime: string }
```

## React Components Structure

### Student Components

#### MeetingScheduler Component
```javascript
// Location: components/student/MeetingScheduler.jsx
// Purpose: Form to schedule new meeting from property page
Props: {
  propertyId: number,
  ownerId: number,
  onScheduleSuccess: function
}

State: {
  meetingType: 'online' | 'offline',
  selectedDate: Date,
  selectedTime: string,
  notes: string,
  isSubmitting: boolean
}
```

#### StudentVisitingPage Component
```javascript
// Location: pages/student/visits.jsx
// Purpose: Dashboard showing all meeting requests and their status

Features:
- List of all meeting requests (pending, confirmed, declined)
- Status indicators with color coding
- Quick action buttons for responding to owner modifications
- Meeting history with past visits
- Filter options (upcoming, past, by status)
```

#### MeetingStatusCard Component
```javascript
// Location: components/student/MeetingStatusCard.jsx
// Purpose: Display individual meeting request with current status

Props: {
  meeting: MeetingRequest object,
  onAcceptTime: function,
  onModifyTime: function
}

Displays:
- Property details and owner info
- Meeting type and requested time
- Current status with appropriate actions
- Owner's response/modifications if any
```

### Owner Components

#### OwnerVisitingPage Component
```javascript
// Location: pages/owner/visits.jsx
// Purpose: Dashboard for managing all incoming meeting requests

Features:
- Queue of pending meeting requests
- Calendar view of confirmed meetings
- Quick decision buttons (Accept/Decline/Modify)
- Property-wise filtering
- Response time analytics
```

#### MeetingRequestCard Component
```javascript
// Location: components/owner/MeetingRequestCard.jsx
// Purpose: Display meeting request with action buttons

Props: {
  request: MeetingRequest object,
  onAccept: function,
  onDecline: function,
  onModify: function
}

Features:
- Student profile summary
- Meeting details and preferences
- Three-button action interface
- Quick time modification modal
```

#### TimeModificationModal Component
```javascript
// Location: components/owner/TimeModificationModal.jsx
// Purpose: Interface for proposing alternative meeting times

Props: {
  isOpen: boolean,
  meetingRequest: object,
  onSubmit: function,
  onClose: function
}

Features:
- Multiple time slot selector
- Calendar integration
- Availability checking
- Bulk time proposal submission
```

## State Management

### Meeting Status Flow
```
pending → accepted → confirmed
pending → declined (end)
pending → modified → counter-modified → ... → confirmed
```

### Real-time Updates
- Use WebSocket or Server-Sent Events for live notifications
- Update meeting status across all relevant components
- Push notifications for mobile users

## Integration Points

### Existing App Integration
```javascript
// Add to existing property page
import MeetingScheduler from '@/components/student/MeetingScheduler';

// In property details page
<MeetingScheduler 
  propertyId={property.id}
  ownerId={property.ownerId}
  onScheduleSuccess={() => router.push('/student/visits')}
/>
```

### Navigation Updates
```javascript
// Add to student navigation
{ path: '/student/visits', label: 'My Visits' }

// Add to owner navigation  
{ path: '/owner/visits', label: 'Visit Requests' }
```

## Notification System

### Email Templates
- New meeting request (to owner)
- Meeting accepted/declined (to student)
- Time modification proposed (to both parties)
- Meeting confirmed (to both parties)
- Meeting reminder (24 hours before)

### In-App Notifications
```javascript
// Notification component integration
{
  type: 'meeting_request',
  title: 'New Visit Request',
  message: 'Student wants to visit your property',
  actionUrl: '/owner/visits',
  timestamp: Date
}
```

## Testing Scenarios

### Unit Tests
- Meeting request creation validation
- Status transition logic
- Time modification workflows
- Notification triggering

### Integration Tests
- Complete meeting flow (request → response → confirmation)
- Real-time notification delivery
- Database transaction consistency
- API endpoint functionality

### User Acceptance Tests
- Student can successfully schedule meetings
- Owner can manage requests efficiently
- Time modification process works smoothly
- Both parties receive proper notifications

## Performance Considerations

### Database Optimization
- Index on studentId, ownerId, propertyId for fast queries
- Soft delete for meeting history retention
- Pagination for large meeting lists

### Caching Strategy
- Cache meeting counts for dashboard metrics
- Redis for real-time notification queues
- CDN for static meeting-related assets

## Security & Validation

### Input Validation
- Meeting time must be in future
- Student can only schedule for available properties
- Owner can only respond to their property requests
- Rate limiting on meeting request creation

### Authorization Checks
- Students can only view their own meetings
- Owners can only manage their property meetings
- Proper role-based access control

## Future Enhancements

### Advanced Features
- Recurring meeting availability
- Group property tours
- AI-powered optimal time suggestions
- Integration with external calendar apps (Google Calendar, Outlook)
- Video call integration for online meetings
- Meeting recording and notes
- Automated follow-up sequences

### Analytics & Insights
- Meeting conversion rates
- Popular time slots analysis
- Owner response time metrics
- Student booking patterns

This meeting scheduling system provides a robust foundation for coordinating property visits while maintaining flexibility for both students and owners through the three-option decision framework.