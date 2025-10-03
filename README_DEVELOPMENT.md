# StudentNest - Development Guide

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Frontend Structure Analysis](#frontend-structure-analysis)
3. [Backend Requirements](#backend-requirements)
4. [API Development Plan](#api-development-plan)
5. [Database Schema](#database-schema)
6. [Step-by-Step Development Guide](#step-by-step-development-guide)
7. [Feature Implementation Checklist](#feature-implementation-checklist)

## 🏗️ Project Overview

StudentNest is a comprehensive platform for student accommodation management with two main user types:
- **Students**: Browse, search, and book accommodation
- **Owners**: Manage properties, bookings, and tenant interactions

## 📱 Frontend Structure Analysis

### Student Dashboard (`/dashboard`)
**Main Features:**
- Room browser with advanced filtering
- Verification status widget
- Personalized welcome section
- Room details page with comprehensive information

### Owner Dashboard (`/owner/dashboard`)
**Main Features:**
- Stats cards (active listings, revenue, bookings)
- Activity feed
- Quick actions
- Analytics overview
- Verification widget

### Room Details Page (`/dashboard/rooms/[id]`)
**Comprehensive Features:**
- Image gallery with fullscreen view
- Detailed room information
- Price negotiation modal
- Meeting scheduler
- Room sharing functionality
- Reviews system
- Owner contact information
- Location and nearby facilities
- Amenities display
- Booking interface

## 🔧 Backend Requirements

Based on the frontend analysis, the backend must support:

### 1. Room Management System
```typescript
interface Room {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  price: number;
  images: string[];
  roomType: 'single' | 'shared' | 'studio';
  accommodationType: 'pg' | 'hostel' | 'apartment' | 'room';
  maxSharingCapacity: number;
  rating: number;
  totalReviews: number;
  amenities: string[];
  detailedAmenities: string[];
  features: {
    area: number;
    floor: number;
    totalFloors: number;
    furnished: boolean;
    balcony: boolean;
    attached_bathroom: boolean;
  };
  location: {
    address: string;
    fullAddress: string;
    city: string;
    coordinates: { lat: number; lng: number };
    nearbyUniversities: Array<{
      name: string;
      distance: string;
      commute: string;
    }>;
    nearbyFacilities: Array<{
      name: string;
      distance: string;
    }>;
  };
  availability: {
    isAvailable: boolean;
    availableFrom: string;
  };
  owner: {
    id: string;
    name: string;
    rating: number;
    verified: boolean;
    responseRate: number;
    responseTime: string;
    joinedDate: string;
  };
  reviews: Review[];
}
```

### 2. User Management
```typescript
interface Student {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  yearOfStudy: number;
  preferences: {
    budget: { min: number; max: number };
    roomType: string[];
    amenities: string[];
    location: string;
  };
  isVerified: boolean;
  verificationStatus: string;
}

interface Owner {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  businessName?: string;
  businessType: string;
  isVerified: boolean;
  verificationStatus: string;
  properties: string[];
  stats: {
    activeListings: number;
    fullyBooked: number;
    monthlyRevenue: number;
    totalBookings: number;
    occupancyRate: number;
  };
}
```

### 3. Booking & Meeting System
```typescript
interface Meeting {
  id: string;
  propertyId: string;
  studentId: string;
  ownerId: string;
  preferredDates: string[];
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  confirmedDate?: string;
  notes?: string;
  createdAt: string;
}

interface Booking {
  id: string;
  roomId: string;
  studentId: string;
  ownerId: string;
  moveInDate: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  amount: number;
  paymentStatus: string;
}
```

### 4. Reviews System
```typescript
interface Review {
  id: string;
  roomId: string;
  studentId: string;
  rating: number;
  comment: string;
  categories: {
    cleanliness: number;
    location: number;
    facilities: number;
    owner: number;
    value: number;
  };
  verified: boolean;
  helpfulCount: number;
  stayDuration: string;
  date: string;
}
```

### 5. Room Sharing System
```typescript
interface RoomShare {
  id: string;
  roomId: string;
  initiatorId: string;
  maxParticipants: number;
  currentParticipants: string[];
  status: 'active' | 'full' | 'cancelled';
  requirements: {
    gender?: 'male' | 'female' | 'any';
    ageRange?: { min: number; max: number };
    preferences: string[];
  };
}
```

## 🗄️ Database Schema

### Core Tables

#### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('student', 'owner', 'admin') NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_email_verified BOOLEAN DEFAULT false,
  is_phone_verified BOOLEAN DEFAULT false,
  is_identity_verified BOOLEAN DEFAULT false,
  profile_photo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. Students Table
```sql
CREATE TABLE students (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  college_id VARCHAR(100),
  college_name VARCHAR(255),
  course VARCHAR(255),
  year_of_study INT,
  city VARCHAR(100),
  state VARCHAR(100),
  bio TEXT,
  preferences JSON,
  profile_completion INT DEFAULT 0
);
```

#### 3. Owners Table
```sql
CREATE TABLE owners (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  business_name VARCHAR(255),
  business_type ENUM('individual', 'company', 'partnership'),
  business_description TEXT,
  gst_number VARCHAR(15),
  experience INT,
  license_number VARCHAR(100),
  city VARCHAR(100),
  state VARCHAR(100),
  bio TEXT,
  total_properties INT DEFAULT 0,
  active_listings INT DEFAULT 0,
  monthly_revenue DECIMAL(10,2) DEFAULT 0,
  average_rating DECIMAL(2,1) DEFAULT 0
);
```

#### 4. Properties Table
```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  full_description TEXT,
  property_type ENUM('pg', 'hostel', 'apartment', 'house', 'room'),
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  pincode VARCHAR(10),
  coordinates POINT,
  total_rooms INT DEFAULT 1,
  available_rooms INT DEFAULT 1,
  monthly_rent DECIMAL(10,2) NOT NULL,
  security_deposit DECIMAL(10,2) NOT NULL,
  maintenance_charges DECIMAL(10,2) DEFAULT 0,
  amenities JSON,
  rules JSON,
  images JSON,
  status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
  average_rating DECIMAL(2,1) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 5. Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  student_id UUID REFERENCES users(id),
  owner_id UUID REFERENCES users(id),
  move_in_date DATE NOT NULL,
  move_out_date DATE,
  monthly_rent DECIMAL(10,2) NOT NULL,
  security_deposit DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'partial', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 6. Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  student_id UUID REFERENCES users(id),
  booking_id UUID REFERENCES bookings(id),
  overall_rating INT CHECK (overall_rating >= 1 AND overall_rating <= 5),
  cleanliness_rating INT CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  location_rating INT CHECK (location_rating >= 1 AND location_rating <= 5),
  facilities_rating INT CHECK (facilities_rating >= 1 AND facilities_rating <= 5),
  owner_rating INT CHECK (owner_rating >= 1 AND owner_rating <= 5),
  value_rating INT CHECK (value_rating >= 1 AND value_rating <= 5),
  comment TEXT,
  stay_duration VARCHAR(50),
  is_verified BOOLEAN DEFAULT false,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. Meetings Table
```sql
CREATE TABLE meetings (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  student_id UUID REFERENCES users(id),
  owner_id UUID REFERENCES users(id),
  preferred_dates JSON,
  confirmed_date DATETIME,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  student_notes TEXT,
  owner_notes TEXT,
  meeting_type ENUM('physical', 'virtual') DEFAULT 'physical',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 8. Room Sharing Table
```sql
CREATE TABLE room_sharing (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  initiator_id UUID REFERENCES users(id),
  max_participants INT DEFAULT 2,
  current_participants JSON,
  requirements JSON,
  status ENUM('active', 'full', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 📋 Step-by-Step Development Guide

### Phase 1: Core Backend Setup (Week 1-2)

#### Step 1.1: Database Setup
- [ ] Set up MongoDB/PostgreSQL database
- [ ] Create database connection utilities
- [ ] Implement user models (Student, Owner)
- [ ] Set up authentication middleware
- [ ] Create JWT utilities

#### Step 1.2: Authentication APIs
- [ ] POST `/api/auth/student/signup`
- [ ] POST `/api/auth/owner/signup`
- [ ] POST `/api/auth/login`
- [ ] POST `/api/auth/logout`
- [ ] POST `/api/auth/refresh-token`
- [ ] GET `/api/auth/verify-email/:token`
- [ ] POST `/api/auth/forgot-password`
- [ ] POST `/api/auth/reset-password`

#### Step 1.3: Profile Management APIs
- [ ] GET `/api/profile/student`
- [ ] PUT `/api/profile/student`
- [ ] GET `/api/profile/owner`
- [ ] PUT `/api/profile/owner`

### Phase 2: Property Management (Week 3-4)

#### Step 2.1: Property CRUD APIs
- [ ] POST `/api/properties` (Create property)
- [ ] GET `/api/properties` (List properties with filters)
- [ ] GET `/api/properties/:id` (Get single property)
- [ ] PUT `/api/properties/:id` (Update property)
- [ ] DELETE `/api/properties/:id` (Delete property)
- [ ] GET `/api/properties/owner/:ownerId` (Owner's properties)

#### Step 2.2: Property Search & Filter
- [ ] Implement advanced search functionality
- [ ] Add geolocation-based search
- [ ] Price range filtering
- [ ] Amenity-based filtering
- [ ] Room type filtering
- [ ] Availability filtering

#### Step 2.3: Image Management
- [ ] Set up Cloudinary integration
- [ ] POST `/api/upload/images` (Multiple image upload)
- [ ] DELETE `/api/upload/images/:id` (Delete image)

### Phase 3: Booking System (Week 5-6)

#### Step 3.1: Booking APIs
- [ ] POST `/api/bookings` (Create booking)
- [ ] GET `/api/bookings/student/:studentId` (Student bookings)
- [ ] GET `/api/bookings/owner/:ownerId` (Owner bookings)
- [ ] PUT `/api/bookings/:id/confirm` (Confirm booking)
- [ ] PUT `/api/bookings/:id/cancel` (Cancel booking)

#### Step 3.2: Payment Integration
- [ ] POST `/api/payments/initiate` (Initiate payment)
- [ ] POST `/api/payments/verify` (Verify payment)
- [ ] GET `/api/payments/history/:userId` (Payment history)

### Phase 4: Meeting System (Week 7)

#### Step 4.1: Meeting Management
- [ ] POST `/api/meetings/schedule` (Schedule meeting)
- [ ] GET `/api/meetings/student/:studentId` (Student meetings)
- [ ] GET `/api/meetings/owner/:ownerId` (Owner meetings)
- [ ] PUT `/api/meetings/:id/respond` (Accept/Reject meeting)
- [ ] PUT `/api/meetings/:id/reschedule` (Reschedule meeting)

### Phase 5: Reviews System (Week 8)

#### Step 5.1: Review APIs
- [ ] POST `/api/reviews` (Submit review)
- [ ] GET `/api/reviews/property/:propertyId` (Property reviews)
- [ ] GET `/api/reviews/student/:studentId` (Student reviews)
- [ ] PUT `/api/reviews/:id/helpful` (Mark helpful)
- [ ] DELETE `/api/reviews/:id` (Delete review)

### Phase 6: Room Sharing (Week 9)

#### Step 6.1: Room Sharing APIs
- [ ] POST `/api/room-sharing/post` (Post sharing request)
- [ ] GET `/api/room-sharing/list` (List sharing opportunities)
- [ ] POST `/api/room-sharing/join` (Join sharing)
- [ ] POST `/api/room-sharing/assessment` (Compatibility assessment)

### Phase 7: Advanced Features (Week 10-11)

#### Step 7.1: Search & Recommendations
- [ ] GET `/api/recommendations/:userId` (Personalized recommendations)
- [ ] POST `/api/search/advanced` (Advanced search)
- [ ] GET `/api/search/suggestions` (Search suggestions)

#### Step 7.2: Analytics & Dashboard
- [ ] GET `/api/analytics/owner/:ownerId` (Owner analytics)
- [ ] GET `/api/dashboard/student/:studentId` (Student dashboard data)
- [ ] GET `/api/dashboard/owner/:ownerId` (Owner dashboard data)

#### Step 7.3: Messaging System
- [ ] POST `/api/messages` (Send message)
- [ ] GET `/api/messages/conversations/:userId` (User conversations)
- [ ] GET `/api/messages/conversation/:conversationId` (Conversation messages)

### Phase 8: Verification System (Week 12)

#### Step 8.1: Identity Verification
- [ ] POST `/api/verification/document` (Upload document)
- [ ] POST `/api/verification/selfie` (Upload selfie)
- [ ] GET `/api/verification/status/:userId` (Verification status)
- [ ] PUT `/api/verification/approve/:userId` (Admin approval)

## ✅ Feature Implementation Checklist

### Student Features
- [ ] Browse properties with advanced filters
- [ ] View detailed property information
- [ ] Schedule property visits
- [ ] Book properties online
- [ ] Rate and review properties
- [ ] Manage booking history
- [ ] Profile management
- [ ] Identity verification
- [ ] Room sharing requests
- [ ] Saved properties
- [ ] Message owners

### Owner Features
- [ ] Property listing management
- [ ] Dashboard with analytics
- [ ] Booking management
- [ ] Meeting scheduling
- [ ] Revenue tracking
- [ ] Tenant communication
- [ ] Profile management
- [ ] Identity verification (mandatory)
- [ ] Property performance analytics
- [ ] Payment management

### Admin Features
- [ ] User management
- [ ] Property approval system
- [ ] Verification management
- [ ] Analytics dashboard
- [ ] Content moderation
- [ ] Support ticket system

## 🔧 Technical Stack

### Backend
- **Framework**: Node.js with Express/Fastify
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary for images
- **Payment**: Razorpay/Stripe integration
- **Email**: SendGrid/NodeMailer
- **SMS**: Twilio/TextLocal

### Frontend (Already Implemented)
- **Framework**: Next.js 15 with React 18
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context/Zustand
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion

## 🚀 Deployment Strategy

### Development Environment
1. Set up local MongoDB instance
2. Configure environment variables
3. Set up Cloudinary account
4. Configure payment gateway sandbox

### Production Environment
1. Deploy to Vercel (Frontend) / Railway (Backend)
2. Set up MongoDB Atlas
3. Configure production environment variables
4. Set up monitoring and logging

## 📞 API Testing Strategy

1. **Unit Tests**: Jest for individual functions
2. **Integration Tests**: Supertest for API endpoints
3. **Load Testing**: Artillery for performance testing
4. **Documentation**: Swagger/OpenAPI documentation

This comprehensive guide provides a structured approach to developing the StudentNest backend that perfectly aligns with the existing frontend requirements. Each phase builds upon the previous one, ensuring a systematic and maintainable development process.