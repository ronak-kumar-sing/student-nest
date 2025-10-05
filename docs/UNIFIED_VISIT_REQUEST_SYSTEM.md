

 # Unified Visit Request System

**The Best Bi-Directional Property Visit Scheduling System**

---

## 🎯 Overview

A complete, unified visit request system that allows **both students AND owners** to initiate, respond to, and manage property visit requests. No more separate student/owner endpoints - one intelligent system handles everything!

### Key Innovation
- ✅ **Bi-directional**: Either student OR owner can initiate requests
- ✅ **Unified API**: Same endpoints for both roles
- ✅ **Smart Negotiation**: Unlimited back-and-forth proposals
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **Real-time Status**: Always know who's waiting for whom
- ✅ **Version Tracking**: Track negotiation rounds

---

## 📋 Table of Contents

1. [System Architecture](#system-architecture)
2. [Data Model](#data-model)
3. [API Endpoints](#api-endpoints)
4. [User Flows](#user-flows)
5. [Status Workflow](#status-workflow)
6. [Code Examples](#code-examples)
7. [Best Practices](#best-practices)

---

## 🏗️ System Architecture

### Core Principles

1. **Role Agnostic**: System doesn't care who initiates - logic adapts
2. **Proposal-Response Pattern**: All interactions are tracked as proposals + responses
3. **Smart Status Management**: Status automatically reflects who needs to act
4. **Version Control**: Each negotiation round increments version number

### Components

```
VisitRequest Model (MongoDB)
├── Participant Info (Student + Owner)
├── Proposals[] (Time slot suggestions)
├── Responses[] (Accept/Decline/Counter)
├── Visit Details (Confirmed slot, type, requirements)
└── Status Management (Who's waiting?)
```

---

## 📊 Data Model

### Main Document Structure

```typescript
{
  _id: ObjectId,

  // References
  property: ObjectId (ref: Room),
  student: {
    userId: ObjectId,
    name: string,
    email: string,
    phone: string,
    profilePhoto: string,
    notes: string,
    rating: number (1-5),
    hasAttended: boolean
  },
  owner: {
    userId: ObjectId,
    name: string,
    email: string,
    phone: string,
    profilePhoto: string,
    notes: string,
    rating: number (1-5),
    hasAttended: boolean
  },

  // Metadata
  initiatedBy: 'student' | 'owner',
  requestType: 'property_viewing' | 'discussion' | 'inspection' | 'key_handover' | 'document_verification',
  priority: 'normal' | 'urgent' | 'flexible',

  // Status
  status: 'pending' | 'awaiting_student' | 'awaiting_owner' | 'confirmed' | 'completed' | 'cancelled' | 'no_show',

  // Communication
  proposals: [{
    proposedBy: 'student' | 'owner',
    timeSlots: [{
      date: Date,
      startTime: string, // "14:00"
      endTime: string,   // "15:30"
      isAvailable: boolean
    }],
    message: string,
    createdAt: Date
  }],

  responses: [{
    respondedBy: 'student' | 'owner',
    action: 'accept' | 'decline' | 'counter' | 'reschedule' | 'cancel',
    selectedSlot: TimeSlot,
    counterProposal: [TimeSlot],
    message: string,
    createdAt: Date
  }],

  // Visit Details
  visitDetails: {
    confirmedSlot: TimeSlot,
    visitType: 'physical' | 'virtual' | 'hybrid',
    virtualDetails: {
      platform: 'google_meet' | 'zoom' | 'whatsapp' | 'phone',
      meetingLink: string,
      meetingId: string,
      passcode: string
    },
    requirements: ['bring_documents', 'bring_guardian', ...],
    specialInstructions: string
  },

  // Timeline
  requestedAt: Date,
  lastActivityAt: Date,
  confirmedAt: Date,
  completedAt: Date,
  cancelledAt: Date,

  // Tracking
  version: number,  // Negotiation round
  isActive: boolean
}
```

### Virtual Properties

```typescript
visitRequest.currentResponder  // 'student' | 'owner' | null
visitRequest.negotiationRounds  // number
visitRequest.latestProposal     // Latest proposal object
visitRequest.latestResponse     // Latest response object
visitRequest.isConfirmed        // boolean
visitRequest.isPending          // boolean
```

---

## 🔌 API Endpoints

### 1. Create Visit Request

**POST** `/api/visit-requests`

**Who can use**: Students OR Owners

**Request Body**:
```json
{
  "propertyId": "room_id_here",
  "recipientId": "other_user_id",
  "timeSlots": [
    {
      "date": "2025-10-15T00:00:00.000Z",
      "startTime": "14:00",
      "endTime": "15:00"
    },
    {
      "date": "2025-10-16T00:00:00.000Z",
      "startTime": "10:00",
      "endTime": "11:00"
    }
  ],
  "requestType": "property_viewing",
  "visitType": "physical",
  "message": "I'd like to visit this property",
  "priority": "normal",
  "requirements": ["bring_id_proof"],
  "specialInstructions": "Please bring college ID"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Visit request created successfully",
  "data": {
    "visitRequest": {
      "_id": "visit_request_id",
      "property": { /* property details */ },
      "student": { /* student info */ },
      "owner": { /* owner info */ },
      "status": "awaiting_owner",  // or "awaiting_student"
      "initiatedBy": "student",
      "proposals": [{ /* initial proposal */ }],
      "version": 1
    }
  }
}
```

**Logic**:
- If **student** creates → status = `awaiting_owner`
- If **owner** creates → status = `awaiting_student`
- System validates property ownership
- Checks for duplicate active requests
- Max 5 time slots per proposal

---

### 2. Fetch Visit Requests

**GET** `/api/visit-requests?type={sent|received|all}&status={status}&filter={pending|upcoming|past}`

**Query Parameters**:
- `type`: `sent` (initiated by you), `received` (initiated by others), `all` (default)
- `status`: Filter by specific status
- `filter`: Smart filters
  - `pending`: awaiting action
  - `upcoming`: confirmed future visits
  - `past`: completed/cancelled
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `propertyId`: Filter by property
- `requestType`: Filter by request type

**Response** (200):
```json
{
  "success": true,
  "data": {
    "visitRequests": [
      {
        "_id": "request_id",
        "property": { /* property */ },
        "student": { /* student */ },
        "owner": { /* owner */ },
        "status": "awaiting_owner",
        "initiatedBy": "student",
        "proposals": [ /* proposals */ ],
        "responses": [ /* responses */ ],
        "visitDetails": { /* details */ },
        "version": 2
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "statistics": {
      "total": 25,
      "pending": 5,
      "awaiting_response": 3,
      "confirmed": 10,
      "completed": 7,
      "cancelled": 0,
      "no_show": 0,
      "pendingAction": 3,      // Requests waiting for YOUR action
      "upcomingVisits": 2       // Confirmed future visits
    }
  }
}
```

---

### 3. Get Visit Request Details

**GET** `/api/visit-requests/:id`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "visitRequest": { /* full request details */ },
    "userContext": {
      "role": "student",
      "canRespond": true,
      "availableActions": ["accept", "decline", "counter"],
      "isInitiator": true,
      "currentResponder": "owner"
    }
  }
}
```

**User Context** helps frontend show correct UI:
- `canRespond`: Can this user take action now?
- `availableActions`: What actions are valid?
- `currentResponder`: Who should act next?

---

### 4. Respond to Visit Request

**PUT** `/api/visit-requests/:id`

**Actions**: `accept`, `decline`, `counter`, `reschedule`, `cancel`

#### Accept

```json
{
  "action": "accept",
  "selectedSlot": {
    "date": "2025-10-15T00:00:00.000Z",
    "startTime": "14:00",
    "endTime": "15:00"
  },
  "message": "See you then!"
}
```

**Result**:
- Status → `confirmed`
- `confirmedSlot` set
- `confirmedAt` timestamp added

#### Decline

```json
{
  "action": "decline",
  "message": "Not available at these times, sorry"
}
```

**Result**:
- Status → `cancelled`
- Request becomes inactive

#### Counter Proposal

```json
{
  "action": "counter",
  "counterProposal": [
    {
      "date": "2025-10-17T00:00:00.000Z",
      "startTime": "16:00",
      "endTime": "17:00"
    },
    {
      "date": "2025-10-18T00:00:00.000Z",
      "startTime": "11:00",
      "endTime": "12:00"
    }
  ],
  "message": "How about these times instead?"
}
```

**Result**:
- New proposal added
- Status switches (awaiting_owner ↔ awaiting_student)
- Version increments
- Ball in other person's court

#### Reschedule (Confirmed Visit)

```json
{
  "action": "reschedule",
  "counterProposal": [
    {
      "date": "2025-10-20T00:00:00.000Z",
      "startTime": "14:00",
      "endTime": "15:00"
    }
  ],
  "message": "Emergency came up, can we reschedule?"
}
```

**Result**:
- Status → `rescheduled`
- New proposal added
- Other party needs to accept new time

#### Cancel

```json
{
  "action": "cancel",
  "message": "Found another property, sorry"
}
```

**Result**:
- Status → `cancelled`
- Request becomes inactive

---

### 5. Mark Visit as Completed

**PATCH** `/api/visit-requests/:id`

**Who**: Either student or owner after visit date

**Request**:
```json
{
  "attended": true,
  "rating": 5,
  "feedback": "Great property and helpful owner!"
}
```

**Logic**:
- Student marks → updates `student.hasAttended` and rates owner
- Owner marks → updates `owner.hasAttended` and rates student
- When **both** mark attendance:
  - If both attended → `status = completed`
  - If either didn't → `status = no_show`

**Response** (200):
```json
{
  "success": true,
  "message": "Visit status updated successfully",
  "data": {
    "visitRequest": {
      "_id": "request_id",
      "status": "completed",
      "student": {
        "hasAttended": true,
        "rating": 5
      },
      "owner": {
        "hasAttended": true,
        "rating": 5
      },
      "completedAt": "2025-10-15T15:30:00.000Z"
    }
  }
}
```

---

## 🔄 Status Workflow

```
Initial Creation
├── Student creates → status: "awaiting_owner"
└── Owner creates → status: "awaiting_student"

Pending States (Negotiation)
├── "awaiting_owner" → Owner can respond
├── "awaiting_student" → Student can respond
└── "pending" → Initial state

Accept Action
└── "confirmed" → Visit scheduled

Decline Action
└── "cancelled" → Request closed

Counter Action
├── "awaiting_owner" ↔ "awaiting_student"
└── Version increments

After Visit
├── "completed" → Both attended
├── "no_show" → Someone didn't attend
└── "cancelled" → Someone cancelled
```

---

## 👥 User Flows

### Flow 1: Student Initiates Visit

1. **Student**: Creates request with 3 time slot options
   - Status: `awaiting_owner`
   - Version: 1

2. **Owner**: Accepts slot #2
   - Status: `confirmed`
   - `confirmedSlot` set

3. **Visit happens**

4. **Both**: Mark attendance + rate each other
   - Status: `completed`

---

### Flow 2: Owner Proactive Outreach

1. **Owner**: Creates request offering 5 time slots
   - Status: `awaiting_student`
   - Message: "I have availability this week"

2. **Student**: Counters with different times
   - Status: `awaiting_owner`
   - Version: 2

3. **Owner**: Accepts student's proposal
   - Status: `confirmed`

4. **Student**: Emergency - requests reschedule
   - Status: `rescheduled`
   - Version: 3

5. **Owner**: Accepts new time
   - Status: `confirmed`

6. **Visit completed**

---

### Flow 3: Multiple Negotiations

1. **Student**: Proposes times → v1, awaiting_owner
2. **Owner**: Counters → v2, awaiting_student
3. **Student**: Counters again → v3, awaiting_owner
4. **Owner**: Counters → v4, awaiting_student
5. **Student**: Accepts → confirmed

**Result**: 4 rounds of negotiation tracked!

---

## 💻 Code Examples

### Frontend: Create Request (React)

```typescript
import { createVisitRequest } from '@/lib/api';

async function handleCreateRequest() {
  try {
    const response = await createVisitRequest({
      propertyId: property._id,
      recipientId: property.owner._id,
      timeSlots: [
        {
          date: new Date('2025-10-15'),
          startTime: '14:00',
          endTime: '15:00'
        },
        {
          date: new Date('2025-10-16'),
          startTime: '10:00',
          endTime: '11:00'
        }
      ],
      requestType: 'property_viewing',
      visitType: 'physical',
      message: 'Interested in viewing this property',
      requirements: ['bring_id_proof']
    });

    if (response.success) {
      toast.success('Visit request sent!');
      router.push('/dashboard/visits');
    }
  } catch (error) {
    toast.error('Failed to send request');
  }
}
```

---

### Frontend: Respond to Request (React)

```typescript
import { respondToVisitRequest } from '@/lib/api';

// Accept a time slot
async function handleAccept(requestId: string, slot: TimeSlot) {
  const response = await respondToVisitRequest(requestId, {
    action: 'accept',
    selectedSlot: slot,
    message: 'Looking forward to meeting you!'
  });

  if (response.success) {
    toast.success('Visit confirmed!');
  }
}

// Counter with new times
async function handleCounter(requestId: string, newSlots: TimeSlot[]) {
  const response = await respondToVisitRequest(requestId, {
    action: 'counter',
    counterProposal: newSlots,
    message: 'How about these times instead?'
  });

  if (response.success) {
    toast.success('Counter proposal sent!');
  }
}

// Decline
async function handleDecline(requestId: string, reason: string) {
  const response = await respondToVisitRequest(requestId, {
    action: 'decline',
    message: reason
  });

  if (response.success) {
    toast.success('Request declined');
  }
}
```

---

### Frontend: Display Request Card

```tsx
function VisitRequestCard({ request, userRole }: Props) {
  const isWaitingForMe = request.status === `awaiting_${userRole}`;
  const canIRespond = request.userContext?.canRespond;

  return (
    <Card className={isWaitingForMe ? 'border-blue-500' : ''}>
      <CardHeader>
        <div className="flex justify-between">
          <h3>{request.property.title}</h3>
          <Badge variant={getStatusVariant(request.status)}>
            {request.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Version {request.version} •
          {isWaitingForMe ? ' Awaiting your response' : ` Awaiting ${request.currentResponder} response`}
        </p>
      </CardHeader>

      <CardContent>
        {/* Show latest proposal */}
        <div className="space-y-2">
          <h4>Proposed Times:</h4>
          {request.latestProposal.timeSlots.map(slot => (
            <div key={slot.date} className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(slot.date)}</span>
              <Clock className="h-4 w-4" />
              <span>{slot.startTime} - {slot.endTime}</span>

              {canIRespond && (
                <Button
                  size="sm"
                  onClick={() => handleAccept(request._id, slot)}
                >
                  Accept This Time
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Show negotiation history */}
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            {request.negotiationRounds} negotiation rounds
          </p>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        {canIRespond && (
          <>
            <Button onClick={() => openCounterModal(request)}>
              Counter Proposal
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDecline(request._id)}
            >
              Decline
            </Button>
          </>
        )}

        {request.status === 'confirmed' && (
          <Button onClick={() => openRescheduleModal(request)}>
            Reschedule
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
```

---

### Backend: Model Methods

```typescript
// Check if user can respond
const canRespond = visitRequest.canRespond(userId, 'student');
// → true/false

// Get available actions
const actions = visitRequest.getAvailableActions(userId, 'student');
// → ['accept', 'decline', 'counter']

// Add proposal
await visitRequest.addProposal('student', [
  { date: new Date('2025-10-15'), startTime: '14:00', endTime: '15:00' }
], 'How about this time?');

// Add response
await visitRequest.addResponse('owner', 'accept', {
  selectedSlot: { date: new Date('2025-10-15'), startTime: '14:00', endTime: '15:00' }
});

// Mark completed
await visitRequest.markCompleted(
  true,  // student attended
  true,  // owner attended
  5,     // student rates owner
  5      // owner rates student
);

// Cancel
await visitRequest.cancel('student', 'Found another property');
```

---

## 🎨 Best Practices

### For Students

1. **Provide Multiple Options**: Offer 3-5 time slots to increase acceptance
2. **Be Specific**: Include message about what you want to see
3. **Respond Promptly**: Check for owner responses daily
4. **Be Flexible**: Open to counter-proposals
5. **Rate Honestly**: Help other students with honest feedback

### For Owners

1. **Quick Response**: Respond within 24 hours
2. **Clear Instructions**: Use `specialInstructions` field
3. **Set Requirements**: Specify what student should bring
4. **Virtual Option**: Offer virtual tours for distant students
5. **Proactive Outreach**: Create requests for interested students

### For Both

1. **Use Messages**: Communicate clearly in each proposal
2. **Track Versions**: Higher version = more back-and-forth
3. **Confirm Attendance**: Always mark if you attended
4. **Cancel Early**: If plans change, cancel ASAP
5. **Rate Fairly**: Ratings help build trust

---

## 🔍 Advanced Queries

### Find Pending Actions

```typescript
// Get requests where I need to respond
const pendingRequests = await VisitRequest.findPendingForUser(
  userId,
  'student'
);
```

### Find Upcoming Visits

```typescript
// Get confirmed visits in the future
const upcomingVisits = await VisitRequest.findUpcomingVisits(
  userId,
  'owner'
);
```

### Get Statistics

```typescript
// Get visit stats for user
const stats = await VisitRequest.getStatistics(userId, 'student');
/*
{
  total: 25,
  pending: 5,
  awaiting_response: 3,
  confirmed: 10,
  completed: 7,
  cancelled: 0,
  no_show: 0
}
*/
```

---

## 🚀 Key Features

### Smart Status Management
- Always know who needs to act
- Status automatically switches on counter-proposals
- Clear distinction between pending/confirmed/completed

### Unlimited Negotiation
- No limit on back-and-forth
- Version tracking shows negotiation rounds
- Full history of proposals and responses

### Flexible Scheduling
- Multiple time slots per proposal
- Support for physical, virtual, hybrid visits
- Reschedule confirmed visits

### Complete Audit Trail
- Every proposal saved
- Every response tracked
- Timestamps for all activities

### Bi-Directional Ratings
- Students rate owners
- Owners rate students
- Builds trust in platform

---

## 📈 Statistics Dashboard

Track these metrics:

```typescript
// For Students
- Total requests sent
- Requests pending owner response
- Confirmed upcoming visits
- Completed visits
- Average rating received from owners

// For Owners
- Total requests received
- Requests pending your response
- Upcoming scheduled visits
- Properties with most requests
- Average rating from students
```

---

## 🔐 Security Features

1. **Authentication Required**: JWT token for all endpoints
2. **Role Verification**: Checks user role matches participant role
3. **Ownership Validation**: Ensures property ownership
4. **Duplicate Prevention**: No duplicate active requests
5. **Date Validation**: Future dates only
6. **Time Format Validation**: HH:MM format enforced
7. **Slot Limit**: Max 5 slots per proposal

---

## 🎯 Success Metrics

This system improves:

- ✅ **Response Rate**: Clear "awaiting_you" status
- ✅ **Booking Success**: Multiple time slots = higher matches
- ✅ **User Satisfaction**: Flexible negotiation
- ✅ **Trust**: Ratings from both sides
- ✅ **Engagement**: Owners can proactively reach out
- ✅ **Transparency**: Full communication history

---

## 🆚 Comparison: Old vs New

| Feature | Old System | New System |
|---------|-----------|-----------|
| **Initiation** | Student only | Student OR Owner |
| **API Endpoints** | Separate for each role | Unified |
| **Negotiation** | Limited rounds | Unlimited |
| **Status** | Generic | Role-specific |
| **Proposals** | Single | Multiple tracked |
| **Responses** | Basic | Full history |
| **Ratings** | One-way | Bi-directional |
| **Flexibility** | Low | High |

---

## 🎉 Summary

This unified visit request system is the **best implementation** because:

1. **Simplicity**: One model, one set of APIs
2. **Flexibility**: Works for any initiation pattern
3. **Intelligence**: Smart status management
4. **Completeness**: Full audit trail
5. **Scalability**: Easy to extend
6. **Type Safety**: Full TypeScript support
7. **Real-time**: Always current status
8. **User-Friendly**: Clear who needs to act

**Result**: A professional, production-ready system that handles all visit request scenarios elegantly! 🚀

