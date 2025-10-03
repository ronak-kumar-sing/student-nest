# StudentNest API Specification

## 🏠 Room Details API - Priority Implementation

Based on the frontend room details page analysis (`/dashboard/rooms/[id]`), here are the critical API endpoints needed:

### 1. GET `/api/rooms/:id` - Room Details

**Response Structure (matches frontend expectations):**

```json
{
  "success": true,
  "data": {
    "id": "room-001",
    "title": "Luxurious Private Room in Modern PG",
    "description": "A beautiful and spacious room perfect for students",
    "fullDescription": "Experience comfort and convenience in this beautifully furnished private room...",
    "price": 15000,
    "images": [
      "https://cloudinary.com/image1.jpg",
      "https://cloudinary.com/image2.jpg"
    ],
    "roomType": "Single",
    "accommodationType": "pg",
    "maxSharingCapacity": 2,
    "rating": 4.8,
    "totalReviews": 124,
    "amenities": ["wifi", "ac", "powerBackup", "security"],
    "detailedAmenities": ["wifi", "ac", "powerBackup", "security", "housekeeping"],
    "features": {
      "area": 120,
      "floor": 3,
      "totalFloors": 5,
      "furnished": true,
      "balcony": true,
      "attached_bathroom": true
    },
    "location": {
      "address": "Sector 15, Noida",
      "fullAddress": "Block C, Sector 15, Noida, Uttar Pradesh 201301",
      "city": "Noida",
      "coordinates": { "lat": 28.5355, "lng": 77.3910 },
      "nearbyUniversities": [
        {
          "name": "Amity University",
          "distance": "2.5",
          "commute": "15"
        }
      ],
      "nearbyFacilities": [
        {
          "name": "Metro Station",
          "distance": "500"
        }
      ]
    },
    "availability": {
      "isAvailable": true,
      "availableFrom": "2024-01-15"
    },
    "owner": {
      "id": "owner_001",
      "name": "Rajesh Kumar",
      "rating": 4.9,
      "verified": true,
      "responseRate": 95,
      "responseTime": "within 2 hours",
      "joinedDate": "Joined in Jan 2020",
      "phone": "+91 98765 43210",
      "email": "rajesh@example.com"
    },
    "reviews": [
      {
        "id": 1,
        "userName": "Priya Sharma",
        "rating": 5,
        "comment": "Excellent room with all modern amenities...",
        "date": "Dec 2023",
        "verified": true,
        "helpfulCount": 12,
        "stayDuration": "8 months",
        "categories": {
          "cleanliness": 5,
          "location": 5,
          "facilities": 4,
          "owner": 5,
          "value": 4
        }
      }
    ]
  }
}
```

### 2. GET `/api/rooms` - Room Listing with Filters

**Query Parameters:**
```typescript
interface RoomFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  roomType?: 'single' | 'shared' | 'studio';
  accommodationType?: 'pg' | 'hostel' | 'apartment' | 'room';
  amenities?: string[]; // comma-separated
  availability?: 'now' | 'next-month';
  rating?: number; // minimum rating
  area?: { min: number; max: number };
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'distance';
  page?: number;
  limit?: number;
}
```

### 3. POST `/api/meetings/schedule` - Schedule Property Visit

**Request:**
```json
{
  "propertyId": "room-001",
  "studentId": "student_123",
  "ownerId": "owner_001",
  "preferredDates": ["2024-01-20T10:00:00Z", "2024-01-21T14:00:00Z"],
  "notes": "Looking for immediate move-in",
  "meetingType": "physical"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "meetingId": "meeting_456",
    "status": "pending",
    "message": "Visit request sent to owner"
  }
}
```

### 4. POST `/api/reviews` - Submit Review

**Request:**
```json
{
  "propertyId": "room-001",
  "studentId": "student_123",
  "overallRating": 5,
  "categories": {
    "cleanliness": 5,
    "location": 5,
    "facilities": 4,
    "owner": 5,
    "value": 4
  },
  "comment": "Excellent room with all modern amenities...",
  "stayDuration": "8 months"
}
```

### 5. POST `/api/room-sharing/post` - Create Room Sharing Request

**Request:**
```json
{
  "roomId": "room-001",
  "studentId": "student_123",
  "maxParticipants": 2,
  "requirements": {
    "gender": "any",
    "ageRange": { "min": 18, "max": 25 },
    "preferences": ["non-smoker", "student"]
  },
  "description": "Looking for a roommate to share this amazing PG"
}
```

### 6. POST `/api/bookings` - Create Booking

**Request:**
```json
{
  "propertyId": "room-001",
  "studentId": "student_123",
  "moveInDate": "2024-02-01",
  "duration": 12,
  "agreementType": "monthly"
}
```

### 7. POST `/api/price-negotiation` - Submit Price Negotiation

**Request:**
```json
{
  "propertyId": "room-001",
  "studentId": "student_123",
  "currentPrice": 15000,
  "offerPrice": 13500,
  "message": "I'm a long-term tenant looking for a slight discount"
}
```

## 📱 Dashboard APIs

### Student Dashboard - GET `/api/dashboard/student`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "student_123",
      "fullName": "John Doe",
      "email": "john@example.com",
      "college": "Delhi University",
      "isVerified": false
    },
    "stats": {
      "savedRooms": 5,
      "scheduledVisits": 2,
      "activeBookings": 1,
      "reviewsGiven": 3
    },
    "recentActivity": [
      {
        "type": "room_saved",
        "message": "Saved 'Modern PG near IIT'",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ],
    "recommendations": [
      {
        "id": "room-002",
        "title": "Cozy Single Room",
        "price": 12000,
        "image": "image.jpg",
        "rating": 4.5,
        "reason": "Based on your preferences"
      }
    ]
  }
}
```

### Owner Dashboard - GET `/api/dashboard/owner`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "owner_001",
      "fullName": "Rajesh Kumar",
      "businessName": "Kumar Properties",
      "isVerified": true
    },
    "stats": {
      "activeListings": 5,
      "fullyBooked": 2,
      "monthlyRevenue": 45000,
      "revenueChange": 12,
      "pendingVisits": 7,
      "totalMessages": 12,
      "unreadMessages": 5,
      "totalBookings": 23,
      "occupancyRate": 85,
      "pendingBookings": 3
    },
    "recentActivity": [
      {
        "id": 1,
        "type": "booking",
        "title": "New booking request received",
        "description": "Rajesh Kumar requested to book Single Room at Green Valley PG",
        "time": "2 hours ago",
        "urgent": false
      }
    ],
    "analytics": {
      "monthlyRevenue": 45000,
      "revenueChange": 12,
      "totalBookings": 23,
      "bookingChange": 8,
      "averageOccupancy": 85,
      "occupancyChange": -3,
      "conversionRate": 68
    }
  }
}
```

## 🗃️ Database Models Implementation

### 1. Room Model (MongoDB Schema)

```javascript
const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }],
  roomType: { type: String, enum: ['single', 'shared', 'studio'] },
  accommodationType: { type: String, enum: ['pg', 'hostel', 'apartment', 'room'] },
  maxSharingCapacity: { type: Number, default: 1 },

  features: {
    area: Number,
    floor: Number,
    totalFloors: Number,
    furnished: Boolean,
    balcony: Boolean,
    attached_bathroom: Boolean
  },

  location: {
    address: String,
    fullAddress: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    nearbyUniversities: [{
      name: String,
      distance: String,
      commute: String
    }],
    nearbyFacilities: [{
      name: String,
      distance: String
    }]
  },

  amenities: [String],
  detailedAmenities: [String],

  availability: {
    isAvailable: { type: Boolean, default: true },
    availableFrom: Date
  },

  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient querying
roomSchema.index({ 'location.city': 1, 'price': 1 });
roomSchema.index({ 'location.coordinates': '2dsphere' });
roomSchema.index({ 'owner': 1 });
roomSchema.index({ 'amenities': 1 });
```

### 2. Review Model

```javascript
const reviewSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },

  overallRating: { type: Number, min: 1, max: 5, required: true },
  categories: {
    cleanliness: { type: Number, min: 1, max: 5 },
    location: { type: Number, min: 1, max: 5 },
    facilities: { type: Number, min: 1, max: 5 },
    owner: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 }
  },

  comment: { type: String, maxlength: 1000 },
  stayDuration: String,

  isVerified: { type: Boolean, default: false },
  helpfulCount: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});
```

### 3. Meeting Model

```javascript
const meetingSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  preferredDates: [Date],
  confirmedDate: Date,

  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },

  studentNotes: String,
  ownerNotes: String,

  meetingType: { type: String, enum: ['physical', 'virtual'], default: 'physical' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

## 🔄 API Implementation Priority Order

### Phase 1: Critical APIs (Week 1)
1. `GET /api/rooms/:id` - Room details page
2. `GET /api/rooms` - Room listing with filters
3. `GET /api/dashboard/student` - Student dashboard
4. `GET /api/dashboard/owner` - Owner dashboard

### Phase 2: Booking & Meetings (Week 2)
1. `POST /api/meetings/schedule` - Schedule visits
2. `POST /api/bookings` - Create bookings
3. `GET /api/meetings/student/:id` - Student meetings
4. `GET /api/meetings/owner/:id` - Owner meetings

### Phase 3: Reviews & Social (Week 3)
1. `POST /api/reviews` - Submit reviews
2. `GET /api/reviews/property/:id` - Property reviews
3. `POST /api/room-sharing/post` - Room sharing
4. `GET /api/room-sharing/list` - Sharing opportunities

### Phase 4: Advanced Features (Week 4)
1. `POST /api/price-negotiation` - Price negotiation
2. `GET /api/recommendations/:userId` - Recommendations
3. `POST /api/messages` - Messaging system
4. `GET /api/analytics/owner/:id` - Owner analytics

This specification ensures that the backend development aligns perfectly with the existing frontend components and user expectations.