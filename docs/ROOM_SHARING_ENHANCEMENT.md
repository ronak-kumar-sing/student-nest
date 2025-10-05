# Room Sharing System - Complete Enhancement Guide

## Overview
The Room Sharing system has been comprehensively enhanced with advanced features for roommate compatibility matching, user dashboard, platform analytics, and interest/bookmark functionality.

---

## System Architecture

### Core Features
1. **Room Share Creation & Management** - Create, update, and manage room sharing opportunities
2. **Application System** - Apply, withdraw, accept/reject applications
3. **Compatibility Assessment** - Match compatible roommates based on lifestyle preferences
4. **User Dashboard** - Track created, joined, and applied room shares
5. **Platform Statistics** - Analytics for platform-wide and user-specific data
6. **Interest/Bookmark** - Save interesting room shares for later

---

## API Endpoints

### 1. Room Sharing Management

#### GET /api/room-sharing
**Description:** Get all room sharing listings with advanced filters

**Query Parameters:**
```typescript
{
  gender?: 'male' | 'female' | 'any';
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  page?: number;        // Default: 1
  limit?: number;       // Default: 10
}
```

**Response:**
```typescript
{
  success: true,
  data: RoomShare[],
  pagination: {
    total: number,
    pages: number,
    currentPage: number,
    hasMore: boolean
  }
}
```

#### POST /api/room-sharing
**Description:** Create a new room sharing request

**Authentication:** Required (verified students only)

**Request Body:**
```typescript
{
  property: ObjectId,           // Room/property ID
  maxParticipants: number,      // 2-6
  description: string,
  houseRules?: string[],
  requirements?: {
    gender?: string,
    ageRange?: { min: number, max: number },
    occupation?: string[],
    preferences?: string[]
  },
  costSharing: {
    totalRent: number,
    rentPerPerson: number,
    securityDeposit?: number,
    advanceMonths?: number,
    utilitiesIncluded?: boolean,
    otherCharges?: string
  },
  availableTill?: Date,
  isOpenToMeetup?: boolean,
  meetupPreferences?: string[]
}
```

**Response:**
```typescript
{
  success: true,
  message: 'Room sharing request created successfully',
  data: RoomShare
}
```

---

### 2. Room Share Details

#### GET /api/room-sharing/[id]
**Description:** Get detailed information about a specific room share

**Authentication:** Optional (additional info if authenticated)

**Response:**
```typescript
{
  success: true,
  data: {
    ...RoomShare,
    availableSlots: number,
    isFull: boolean,
    userContext?: {
      hasApplied: boolean,
      applicationStatus: string | null,
      isParticipant: boolean,
      isInitiator: boolean,
      hasInterest: boolean,
      compatibilityScore: number | null  // 0-100 if both have assessments
    }
  }
}
```

**Compatibility Score Calculation:**
- Weighted matching across 10 lifestyle factors
- Perfect match: 100%, Partial match: 50%, No match: 0%
- Deal breakers reduce score by 50%

#### PUT /api/room-sharing/[id]
**Description:** Update room share details (initiator only)

**Authentication:** Required (initiator only)

**Allowed Updates:**
```typescript
{
  description?: string,
  houseRules?: string[],
  requirements?: object,
  availableTill?: Date,
  isOpenToMeetup?: boolean,
  meetupPreferences?: string[]
}
```

#### DELETE /api/room-sharing/[id]
**Description:** Cancel room share (initiator only)

**Authentication:** Required (initiator only)

**Response:**
```typescript
{
  success: true,
  message: 'Room share cancelled successfully'
}
```

---

### 3. Application Management

#### POST /api/room-sharing/[id]/apply
**Description:** Apply to join a room share

**Authentication:** Required

**Request Body:**
```typescript
{
  message?: string  // Optional application message
}
```

**Validations:**
- Cannot apply to own room share
- Cannot apply if already a participant
- Cannot apply if already applied (pending/accepted)
- Cannot apply if room share is full

#### DELETE /api/room-sharing/[id]/apply
**Description:** Withdraw application

**Authentication:** Required

#### POST /api/room-sharing/[id]/respond
**Description:** Respond to an application (initiator only)

**Authentication:** Required (initiator only)

**Request Body:**
```typescript
{
  applicantId: ObjectId,
  status: 'accepted' | 'rejected',
  message?: string
}
```

---

### 4. Compatibility Assessment

#### GET /api/room-sharing/assessment
**Description:** Get user's compatibility assessment

**Authentication:** Required

**Response:**
```typescript
{
  success: true,
  data: {
    sleepSchedule: 'early_bird' | 'night_owl' | 'flexible',
    cleanliness: 'very_clean' | 'moderately_clean' | 'relaxed',
    studyHabits: 'silent' | 'quiet' | 'moderate_noise' | 'flexible',
    socialLevel: 'very_social' | 'moderately_social' | 'quiet' | 'prefer_alone',
    cookingFrequency: 'daily' | 'often' | 'sometimes' | 'rarely',
    musicPreference: 'silent' | 'low_volume' | 'moderate' | 'loud',
    guestPolicy: 'no_guests' | 'rare_guests' | 'occasional_guests' | 'frequent_guests',
    smokingTolerance: 'no_smoking' | 'outdoor_only' | 'tolerant',
    petFriendly: 'love_pets' | 'okay_with_pets' | 'no_pets',
    workSchedule: 'regular_hours' | 'flexible' | 'night_shift' | 'student_only',
    sharingPreferences: string[],
    dealBreakers: string[],
    updatedAt: Date
  }
}
```

#### POST /api/room-sharing/assessment
**Description:** Submit or update complete compatibility assessment

**Authentication:** Required

**Request Body:** Same as response above (all fields required)

#### PUT /api/room-sharing/assessment
**Description:** Update specific assessment fields

**Authentication:** Required

**Request Body:** Partial assessment object

---

### 5. User Dashboard

#### GET /api/room-sharing/my-shares
**Description:** Get user's room shares categorized by type

**Authentication:** Required

**Query Parameters:**
```typescript
{
  type?: 'created' | 'joined' | 'applied'
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    created?: RoomShare[],      // If type=created or no type
    joined?: RoomShare[],       // If type=joined or no type
    applied?: RoomShare[],      // If type=applied or no type
    stats: {
      created: number,
      joined: number,
      applied: number,
      pendingApplications: number,
      activeShares: number
    }
  }
}
```

**Categories:**
- **Created:** Room shares initiated by user
- **Joined:** Room shares where user is confirmed participant (not initiator)
- **Applied:** Room shares where user has pending/accepted applications

---

### 6. Platform Statistics

#### GET /api/room-sharing/statistics
**Description:** Get comprehensive platform and user statistics

**Authentication:** Optional (user-specific stats if authenticated)

**Response:**
```typescript
{
  success: true,
  data: {
    platform: {
      totalShares: number,
      activeShares: number,
      fullShares: number,
      completedShares: number,
      totalParticipants: number,
      uniqueParticipants: number,
      totalPendingApplications: number,
      averageParticipants: number,
      priceRange: {
        min: number,
        max: number,
        average: number
      },
      genderDistribution: {
        male: number,
        female: number,
        any: number
      },
      topCities: [
        { name: string, count: number }
      ]
    },
    myStats?: {
      created: number,
      joined: number,
      applied: number,
      pendingApplications: number
    },
    recentActivity: {
      last30Days: {
        newShares: number,
        newApplications: number
      }
    }
  }
}
```

**Uses MongoDB Aggregation:**
- $unwind for participant counting
- $lookup for property/city data
- $group for statistics calculation
- $sort and $limit for top cities

---

### 7. Interest/Bookmark System

#### GET /api/room-sharing/interest
**Description:** Get all bookmarked room shares

**Authentication:** Required

**Response:**
```typescript
{
  success: true,
  data: RoomShare[],  // Sorted by interest date (newest first)
  count: number
}
```

#### POST /api/room-sharing/interest
**Description:** Mark interest in a room share

**Authentication:** Required

**Request Body:**
```typescript
{
  shareId: ObjectId
}
```

**Side Effects:**
- Adds user to `interested` array
- Increments `views` counter

#### DELETE /api/room-sharing/interest
**Description:** Remove interest from a room share

**Authentication:** Required

**Request Body:**
```typescript
{
  shareId: ObjectId
}
```

---

## Frontend Integration

### API Client Methods

All methods are available in `/src/lib/api.ts`:

```typescript
import {
  // Basic CRUD
  createRoomSharingRequest,
  getRoomSharingRequests,
  getRoomShareDetails,
  updateRoomShare,
  cancelRoomShare,

  // Applications
  applyToRoomShare,
  withdrawRoomShareApplication,
  respondToRoomSharingApplication,

  // Compatibility
  getCompatibilityAssessment,
  createCompatibilityAssessment,
  updateCompatibilityAssessment,

  // Dashboard
  getMyRoomShares,

  // Statistics
  getRoomSharingStatistics,

  // Interest
  markRoomShareInterest,
  removeRoomShareInterest,
  getInterestedRoomShares
} from '@/lib/api';
```

### Usage Examples

#### 1. Browse Room Shares
```typescript
const { data, pagination } = await getRoomSharingRequests({
  city: 'Bangalore',
  minPrice: 5000,
  maxPrice: 15000,
  gender: 'any',
  page: 1,
  limit: 20
});
```

#### 2. View Share Details
```typescript
const { data } = await getRoomShareDetails(shareId);

console.log(data.compatibilityScore); // 0-100 if both have assessments
console.log(data.userContext.hasApplied); // true/false
console.log(data.availableSlots); // Remaining slots
```

#### 3. Submit Compatibility Assessment
```typescript
await createCompatibilityAssessment({
  sleepSchedule: 'early_bird',
  cleanliness: 'very_clean',
  studyHabits: 'quiet',
  socialLevel: 'moderately_social',
  cookingFrequency: 'often',
  musicPreference: 'low_volume',
  guestPolicy: 'occasional_guests',
  smokingTolerance: 'no_smoking',
  petFriendly: 'okay_with_pets',
  workSchedule: 'student_only',
  sharingPreferences: ['cooking', 'cleaning together'],
  dealBreakers: ['smoking', 'loud music']
});
```

#### 4. User Dashboard
```typescript
// Get all categories
const { data } = await getMyRoomShares();
console.log(data.stats); // Overview statistics

// Get specific category
const { data: created } = await getMyRoomShares('created');
const { data: joined } = await getMyRoomShares('joined');
const { data: applied } = await getMyRoomShares('applied');
```

#### 5. Platform Statistics
```typescript
const { data } = await getRoomSharingStatistics();

console.log(data.platform.totalShares);
console.log(data.platform.topCities);
console.log(data.platform.genderDistribution);
console.log(data.myStats); // If authenticated
```

#### 6. Bookmark System
```typescript
// Add bookmark
await markRoomShareInterest(shareId);

// Get all bookmarks
const { data, count } = await getInterestedRoomShares();

// Remove bookmark
await removeRoomShareInterest(shareId);
```

---

## Database Schema

### Student Model Enhancement

```typescript
interface ICompatibilityAssessment {
  sleepSchedule: 'early_bird' | 'night_owl' | 'flexible';
  cleanliness: 'very_clean' | 'moderately_clean' | 'relaxed';
  studyHabits: 'silent' | 'quiet' | 'moderate_noise' | 'flexible';
  socialLevel: 'very_social' | 'moderately_social' | 'quiet' | 'prefer_alone';
  cookingFrequency: 'daily' | 'often' | 'sometimes' | 'rarely';
  musicPreference: 'silent' | 'low_volume' | 'moderate' | 'loud';
  guestPolicy: 'no_guests' | 'rare_guests' | 'occasional_guests' | 'frequent_guests';
  smokingTolerance: 'no_smoking' | 'outdoor_only' | 'tolerant';
  petFriendly: 'love_pets' | 'okay_with_pets' | 'no_pets';
  workSchedule: 'regular_hours' | 'flexible' | 'night_shift' | 'student_only';
  sharingPreferences?: string[];
  dealBreakers?: string[];
  updatedAt?: Date;
}

interface IStudentDocument extends IUserDocument {
  // ... existing fields
  compatibilityAssessment?: ICompatibilityAssessment;
}
```

### RoomSharing Model

```typescript
interface IRoomSharing {
  property: ObjectId;
  initiator: ObjectId;
  maxParticipants: number;
  currentParticipants: IParticipant[];
  applications: IApplication[];
  interested: [{ user: ObjectId, interestedAt: Date }];
  views: number;
  status: 'active' | 'full' | 'completed' | 'cancelled';
  // ... other fields
}
```

---

## Compatibility Matching Algorithm

### Scoring System

**Total Possible Score:** 100

**Weighted Factors:**
- Cleanliness: 20 points
- Sleep Schedule: 15 points
- Study Habits: 15 points
- Social Level: 10 points
- Cooking Frequency: 10 points
- Music Preference: 10 points
- Guest Policy: 10 points
- Smoking Tolerance: 5 points
- Pet Friendly: 5 points

**Matching Rules:**
- **Perfect Match:** 100% of factor weight
- **Partial Match:** 50% of factor weight
- **No Match:** 0% of factor weight

**Deal Breakers:**
- If any deal breaker conflicts with sharing preferences: **Score × 0.5**

### Compatibility Rules

```typescript
const compatibilityRules = {
  sleepSchedule: {
    early_bird: ['flexible'],
    night_owl: ['flexible'],
    flexible: ['early_bird', 'night_owl', 'flexible']
  },
  cleanliness: {
    very_clean: ['moderately_clean'],
    moderately_clean: ['very_clean', 'relaxed'],
    relaxed: ['moderately_clean']
  },
  studyHabits: {
    silent: ['quiet'],
    quiet: ['silent', 'moderate_noise', 'flexible'],
    moderate_noise: ['quiet', 'flexible'],
    flexible: ['quiet', 'moderate_noise']
  },
  socialLevel: {
    very_social: ['moderately_social'],
    moderately_social: ['very_social', 'quiet'],
    quiet: ['moderately_social', 'prefer_alone'],
    prefer_alone: ['quiet']
  }
};
```

---

## Security & Validation

### Authentication Requirements

| Endpoint | Auth Required | Verification Required |
|----------|---------------|----------------------|
| GET /room-sharing | No | No |
| POST /room-sharing | Yes | Email + Phone |
| GET /room-sharing/[id] | No* | No |
| PUT /room-sharing/[id] | Yes (initiator) | No |
| DELETE /room-sharing/[id] | Yes (initiator) | No |
| POST /room-sharing/[id]/apply | Yes | Email + Phone |
| POST /room-sharing/assessment | Yes | No |
| GET /room-sharing/my-shares | Yes | No |
| GET /room-sharing/statistics | No* | No |
| POST /room-sharing/interest | Yes | No |

*Optional auth provides additional context

### Validation Rules

1. **Room Share Creation:**
   - maxParticipants: 2-6
   - User must be verified (email + phone)
   - User cannot have duplicate active shares for same property

2. **Applications:**
   - Cannot apply to own share
   - Cannot apply if already participant
   - Cannot apply twice (unless previous rejected)
   - Share must be active and not full

3. **Compatibility Assessment:**
   - All 10 factors required for POST
   - PUT allows partial updates
   - Automatically sets updatedAt timestamp

---

## Performance Optimizations

### Database Indexing
```javascript
// Recommended indexes for RoomSharing collection
{
  property: 1,
  initiator: 1,
  status: 1,
  createdAt: -1
}

{
  'requirements.gender': 1,
  'costSharing.rentPerPerson': 1,
  status: 1
}

{
  'interested.user': 1
}
```

### Query Optimizations
- Use `.lean()` for read-only operations
- Populate only required fields
- Implement pagination for all list endpoints
- Cache statistics with 5-minute TTL (recommended)

---

## Error Handling

### Common Error Codes

```typescript
400: {
  INVALID_REQUEST: 'Invalid request parameters',
  MISSING_FIELDS: 'Required fields missing',
  DUPLICATE_APPLICATION: 'Already applied to this share',
  SHARE_FULL: 'Room share is full',
  CANNOT_APPLY_OWN: 'Cannot apply to own room share'
}

401: {
  UNAUTHORIZED: 'Authentication required',
  TOKEN_EXPIRED: 'Access token expired'
}

403: {
  NOT_VERIFIED: 'Email and phone verification required',
  NOT_INITIATOR: 'Only initiator can perform this action',
  FORBIDDEN: 'You don't have permission'
}

404: {
  NOT_FOUND: 'Room share not found',
  APPLICATION_NOT_FOUND: 'Application not found'
}

500: {
  SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed'
}
```

---

## Testing Guide

### Postman Collection

**Base URL:** `http://localhost:3000/api`

**Headers:**
```
Authorization: Bearer <your-token>
Content-Type: application/json
```

### Test Scenarios

1. **Create Room Share:**
```bash
POST /room-sharing
{
  "property": "property_id",
  "maxParticipants": 3,
  "description": "Looking for 2 clean and quiet roommates",
  "requirements": {
    "gender": "any",
    "ageRange": { "min": 18, "max": 30 }
  },
  "costSharing": {
    "totalRent": 30000,
    "rentPerPerson": 10000,
    "securityDeposit": 20000,
    "advanceMonths": 2
  }
}
```

2. **Submit Assessment:**
```bash
POST /room-sharing/assessment
{
  "sleepSchedule": "early_bird",
  "cleanliness": "very_clean",
  "studyHabits": "quiet",
  "socialLevel": "moderately_social",
  "cookingFrequency": "often",
  "musicPreference": "low_volume",
  "guestPolicy": "occasional_guests",
  "smokingTolerance": "no_smoking",
  "petFriendly": "okay_with_pets",
  "workSchedule": "student_only"
}
```

3. **Apply to Share:**
```bash
POST /room-sharing/share_id/apply
{
  "message": "Hi, I'm interested in joining. I'm a clean and quiet person."
}
```

4. **Get Statistics:**
```bash
GET /room-sharing/statistics
```

---

## Future Enhancements

### Planned Features
1. **AI Matching:** Machine learning-based roommate recommendations
2. **Chat System:** In-app messaging between interested users
3. **Video Tours:** Integration with video calls for room tours
4. **Review System:** Rate and review past roommates
5. **Automated Notifications:** Email/SMS for applications and responses
6. **Smart Filters:** Save filter preferences
7. **Group Formation:** Auto-match compatible groups
8. **Lease Management:** Digital agreement signing

---

## Support & Troubleshooting

### Common Issues

**Issue:** "Only verified students can access room sharing"
- **Solution:** Complete email and phone verification first

**Issue:** "Room share not found"
- **Solution:** Check if share_id is valid and share still exists

**Issue:** Compatibility score shows null
- **Solution:** Both users need to submit compatibility assessments

**Issue:** Cannot apply to room share
- **Solution:** Check if you're the initiator, already applied, or share is full

---

## Changelog

### Version 1.0 (Current)
- ✅ Basic CRUD operations for room sharing
- ✅ Application system with accept/reject
- ✅ Compatibility assessment (10 factors)
- ✅ User dashboard with statistics
- ✅ Platform-wide analytics
- ✅ Interest/bookmark system
- ✅ Automated compatibility scoring
- ✅ Advanced filtering and pagination
- ✅ View counting
- ✅ Complete API client methods
- ✅ TypeScript support

---

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow existing error handling patterns
- Add JSDoc comments for complex functions
- Write descriptive commit messages

### Pull Request Guidelines
1. Test all endpoints with Postman
2. Update documentation for API changes
3. Add migration scripts for schema changes
4. Include before/after screenshots for UI changes

---

## License
MIT License - StudentNest Room Sharing System

**Last Updated:** December 2024
**Maintainer:** StudentNest Development Team
