# Room Sharing Network Implementation

## Overview
Complete implementation of the room sharing network feature that allows verified students to share rooms and find partners. This system includes database models, API endpoints, and verification requirements.

## ✅ Completed Features

### 1. Database Model (`/src/lib/models/RoomSharing.ts`)

Created comprehensive MongoDB model with the following features:

#### Schema Fields:
- **property**: Reference to Room document
- **initiator**: Reference to verified Student who created the share
- **maxParticipants**: Maximum number of people (2-6)
- **currentParticipants**: Array of confirmed participants
  - Each participant has: user ref, joinedAt date, status, sharedAmount
- **requirements**: Matching criteria
  - gender (male/female/any)
  - ageRange (min/max)
  - preferences (array of strings)
  - lifestyle (array of strings)
  - studyHabits (string)
- **costSharing**: Financial details
  - monthlyRent, rentPerPerson (auto-calculated)
  - securityDeposit, depositPerPerson (auto-calculated)
  - utilitiesIncluded (boolean)
  - utilitiesPerPerson (number)
- **roomConfiguration**: Room details
  - totalBeds, bedsAvailable
  - hasPrivateBathroom, hasSharedKitchen, hasStudyArea
- **applications**: Array of applications from interested students
  - Each application has: applicant ref, appliedAt, status, message, compatibility score, initiator response
- **status**: active | full | cancelled | inactive | completed
- **description**: Text description
- **availableFrom/availableTill**: Date range
- **houseRules**: Array of rules
- **views**: Number of views
- **interested**: Array of user refs who showed interest

#### Virtual Properties:
- **availableSlots**: Calculated as maxParticipants - confirmed participants
- **isFull**: Boolean indicating if all slots are filled

#### Pre-save Middleware:
- Auto-updates status (active ↔ full) based on participant count
- Auto-calculates rentPerPerson and depositPerPerson

#### Instance Methods:
- **addParticipant(userId, sharedAmount)**: Add confirmed participant
- **removeParticipant(userId)**: Mark participant as 'left'
- **addApplication(applicantId, message)**: Submit new application with compatibility score
- **respondToApplication(appId, status, message)**: Accept/reject applications (auto-adds if accepted)
- **calculateCompatibility(userPreferences)**: Returns 0-100 compatibility score based on:
  - Gender preference match
  - Age range compatibility
  - Shared preferences count
  - Lifestyle alignment
  - Budget compatibility

#### Static Methods:
- **findMatches(userPreferences, limit)**: Find compatible room shares using filters

#### Indexes:
- status + availableFrom (compound)
- initiator + status (compound)
- property + status (compound)
- requirements.gender
- costSharing.rentPerPerson
- createdAt (descending)

### 2. API Endpoints

#### **GET `/api/room-sharing`** ✅
Fetch room sharing listings with filters

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `gender` (filter by gender requirement)
- `maxBudget` (filter by rent per person)
- `city` (filter by location)

**Response:**
```json
{
  "success": true,
  "data": {
    "shares": [...],
    "requests": [...], // Same as shares (backward compatibility)
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

**Features:**
- ✅ Authentication required (verified students only)
- ✅ Populates property, initiator, and participants
- ✅ Filters by status (active/full only)
- ✅ Supports gender, budget, and location filters
- ✅ Pagination support
- ✅ Returns formatted data with sharing and cost summaries

#### **POST `/api/room-sharing`** ✅
Create a new room share

**Request Body:**
```json
{
  "propertyId": "room_id",
  "maxParticipants": 3,
  "requirements": {
    "gender": "any",
    "ageRange": { "min": 18, "max": 30 },
    "preferences": ["Non-smoker", "Student"],
    "lifestyle": ["Quiet", "Organized"],
    "studyHabits": "Focused"
  },
  "costSharing": {
    "monthlyRent": 1500,
    "securityDeposit": 1500,
    "utilitiesIncluded": true,
    "utilitiesPerPerson": 0
  },
  "roomConfiguration": {
    "totalBeds": 3,
    "bedsAvailable": 2,
    "hasPrivateBathroom": false,
    "hasSharedKitchen": true,
    "hasStudyArea": true
  },
  "description": "Looking for responsible students...",
  "availableFrom": "2025-10-05",
  "houseRules": ["No smoking", "Quiet hours after 10 PM"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Room sharing listing created successfully",
  "data": { /* populated room share */ }
}
```

**Features:**
- ✅ Authentication required (verified students only)
- ✅ Validates required fields
- ✅ Prevents duplicate active shares for same property
- ✅ Auto-adds initiator as first confirmed participant
- ✅ Auto-calculates rentPerPerson and depositPerPerson
- ✅ Sets initial status to 'active'
- ✅ Returns populated data

#### **POST `/api/room-sharing/[id]/apply`** ✅
Apply to join a room share

**Request Body:**
```json
{
  "message": "I'm a quiet student looking for a peaceful place..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": { /* updated room share with applications */ }
}
```

**Features:**
- ✅ Authentication required (verified students only)
- ✅ Prevents initiator from applying to own share
- ✅ Prevents duplicate applications
- ✅ Prevents existing participants from re-applying
- ✅ Only allows applications to 'active' shares
- ✅ Calculates compatibility score automatically
- ✅ Returns updated share with populated applications

#### **DELETE `/api/room-sharing/[id]/apply`** ✅
Withdraw application

**Response:**
```json
{
  "success": true,
  "message": "Application withdrawn successfully"
}
```

**Features:**
- ✅ Authentication required
- ✅ Only removes pending applications
- ✅ Validates application exists

#### **PUT `/api/room-sharing/[id]/respond`** ✅
Accept or reject an application (initiator only)

**Request Body:**
```json
{
  "applicationId": "app_id",
  "status": "accepted", // or "rejected"
  "message": "Welcome to the room!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application accepted successfully",
  "data": { /* updated room share */ }
}
```

**Features:**
- ✅ Authentication required
- ✅ Only initiator can respond
- ✅ Validates application ID and status
- ✅ Auto-adds participant if accepted
- ✅ Auto-updates share status to 'full' if max reached
- ✅ Returns fully populated data

### 3. Security & Verification

#### Verification Requirements ✅
All room sharing endpoints require users to be:
- **Authenticated** (valid JWT token)
- **Email verified** (isEmailVerified = true)
- **Phone verified** (isPhoneVerified = true)

If verification fails:
```json
{
  "success": false,
  "error": "Only verified students can access room sharing"
}
```

#### Authorization Checks ✅
- Users cannot apply to their own shares
- Only initiators can respond to applications
- Users cannot apply if already a participant
- Only active shares accept applications

### 4. Bug Fixes

#### **Fixed: Save Room ObjectId Error** ✅
**File:** `/src/app/api/saved-rooms/route.ts`

**Problem:** Sample rooms use string IDs ("1", "2", "3") but MongoDB expects ObjectIds, causing CastError

**Solution:** Added sample room IDs to whitelist
```typescript
const sampleRoomIds = [
  '1', '2', '3', // String IDs used in sample data
  '507f1f77bcf86cd799439011',
  '507f1f77bcf86cd799439012',
  '507f1f77bcf86cd799439013',
];
```

Sample rooms bypass ObjectId validation and Room.findById() check.

## 📋 Next Steps (Pending Implementation)

### 1. Frontend UI Integration
- [ ] Add "Share Room" button to room detail page
- [ ] Create room sharing form modal
- [ ] Display existing shares for a room
- [ ] Show "Apply to Join" button for other users' shares
- [ ] Create room sharing dashboard/listing page
- [ ] Add compatibility score display
- [ ] Implement application management UI (for initiators)

### 2. Additional API Endpoints
- [ ] GET `/api/room-sharing/[id]` - Get single room share details
- [ ] PUT `/api/room-sharing/[id]` - Update room share (initiator only)
- [ ] DELETE `/api/room-sharing/[id]` - Cancel room share (initiator only)
- [ ] GET `/api/room-sharing/my-shares` - Get user's own shares
- [ ] GET `/api/room-sharing/my-applications` - Get user's applications
- [ ] POST `/api/room-sharing/[id]/leave` - Leave as participant

### 3. Notifications
- [ ] Notify initiator when new application received
- [ ] Notify applicant when application accepted/rejected
- [ ] Notify participants when someone leaves
- [ ] Email notifications for important events

### 4. Search & Filters
- [ ] Advanced search with multiple filters
- [ ] Sort by: newest, price, compatibility
- [ ] Map view for location-based search
- [ ] Saved searches

### 5. Analytics & Metrics
- [ ] Track views count
- [ ] Track application conversion rate
- [ ] Show popular shares
- [ ] User engagement metrics

## 🔧 Technical Notes

### TypeScript Support
All models and API endpoints are fully typed with TypeScript for better type safety.

### Error Handling
Comprehensive error handling with meaningful error messages:
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Validation errors (400)
- Server errors (500)

### Database Performance
- Indexes on frequently queried fields
- Lean queries for better performance
- Selective population of related documents

### Code Organization
```
/src/app/api/room-sharing/
  ├── route.ts                 # GET (list), POST (create)
  ├── [id]/
  │   ├── apply/route.ts      # POST (apply), DELETE (withdraw)
  │   └── respond/route.ts    # PUT (accept/reject)
/src/lib/models/
  └── RoomSharing.ts          # Complete model with methods
```

## 🎯 Usage Examples

### Creating a Room Share
```typescript
const response = await fetch('/api/room-sharing', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    propertyId: roomId,
    maxParticipants: 3,
    requirements: { gender: 'any', ageRange: { min: 18, max: 30 } },
    costSharing: { monthlyRent: 1500, securityDeposit: 1500 },
    // ... other fields
  })
});
```

### Applying to a Share
```typescript
const response = await fetch(`/api/room-sharing/${shareId}/apply`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'I would like to join...'
  })
});
```

### Responding to Application
```typescript
const response = await fetch(`/api/room-sharing/${shareId}/respond`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    applicationId: appId,
    status: 'accepted',
    message: 'Welcome!'
  })
});
```

## Summary

The room sharing network is now fully functional with:
- ✅ Complete database model with virtuals, methods, and middleware
- ✅ 5 API endpoints (list, create, apply, withdraw, respond)
- ✅ Strict verification requirements (email + phone verified)
- ✅ Compatibility scoring algorithm
- ✅ Auto-calculations (cost per person, available slots, status)
- ✅ Full TypeScript support
- ✅ Comprehensive error handling
- ✅ ObjectId error fix for sample rooms

**Status:** Backend implementation complete. Ready for frontend integration.
