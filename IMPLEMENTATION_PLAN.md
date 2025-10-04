# 🚀 Implementation Plan - Student Nest New

## 📋 Implementation Overview

This document outlines the step-by-step implementation plan after analyzing the complete student-nest codebase.

**Status**: Ready to implement
**Last Analysis**: October 4, 2025
**Start Date**: October 4, 2025

---

## 📊 Analysis Summary

### What Was Read & Analyzed:

1. ✅ **package.json** - All 70+ dependencies reviewed
2. ✅ **Database Connection** - MongoDB setup and caching strategy
3. ✅ **User Model** - Base user schema with auth & verification
4. ✅ **Student Model** - Student-specific fields and preferences
5. ✅ **Owner Model** - Owner verification and business info
6. ✅ **Login API** - Complex multi-model search strategy
7. ✅ **Student Signup API** - OTP verification flow
8. ✅ **API Structure** - 15+ API route groups identified

### Key Findings:

#### Database Architecture
- **Base Model**: User with discriminator pattern
- **Student Model**: Extends User with college info & preferences
- **Owner Model**: Extends User with business & verification
- **OTP Model**: Email/phone verification with expiry
- **Models Found**: User, Student, Owner, OTP, Property, Room, Booking, Review, Meeting, Verification

#### Authentication Flow
```
1. User enters email/phone + password
2. System searches multiple models (User → Student → Owner)
3. Role-based search with fallback strategy
4. Password verification with bcrypt
5. JWT token generation (access + refresh)
6. Rate limiting (5 attempts / 15 min)
```

#### Verification System
- **Email OTP**: Required before signup
- **Phone OTP**: Required before signup
- **Owner Verification**: Aadhaar/DigiLocker required
- **Student Verification**: Optional college ID verification

---

## 🎯 Implementation Strategy

### Phase Approach
We'll implement in **10 phases** as outlined in MIGRATION_GUIDE.md, but with actual code from student-nest.

### Priority Order:
1. **Core Infrastructure** (Phase 2-4)
2. **Database Layer** (Phase 5-6)
3. **Business Logic** (Phase 7-8)
4. **Components** (Phase 9)
5. **API Routes** (Phase 10)

---

## 📝 Detailed Implementation Plan

### PHASE 1: ✅ COMPLETED
- [x] Project initialized
- [x] Documentation created
- [x] Structure analyzed

### PHASE 2: Core Dependencies (Next)

#### Step 2.1: Install All Dependencies
```bash
# Run this command:
cd student-nest-new
npm install \
  @hookform/resolvers@^5.2.1 \
  @radix-ui/react-avatar@^1.1.10 \
  @radix-ui/react-checkbox@^1.3.3 \
  @radix-ui/react-dialog@^1.1.15 \
  @radix-ui/react-label@^2.1.7 \
  @radix-ui/react-progress@^1.1.7 \
  @radix-ui/react-radio-group@^1.3.8 \
  @radix-ui/react-scroll-area@^1.2.10 \
  @radix-ui/react-select@^2.2.6 \
  @radix-ui/react-separator@^1.1.7 \
  @radix-ui/react-slider@^1.3.6 \
  @radix-ui/react-slot@^1.2.3 \
  @radix-ui/react-switch@^1.2.6 \
  @radix-ui/react-tabs@^1.1.13 \
  @radix-ui/react-tooltip@^1.2.8 \
  @sendgrid/mail@^8.1.6 \
  axios@^1.12.2 \
  bcryptjs@^3.0.2 \
  class-variance-authority@^0.7.1 \
  cloudinary@^2.7.0 \
  clsx@^2.1.1 \
  framer-motion@^12.23.12 \
  google-auth-library@^10.4.0 \
  googleapis@^161.0.0 \
  input-otp@^1.4.2 \
  jsonwebtoken@^9.0.2 \
  lucide-react@^0.542.0 \
  mongoose@^8.18.1 \
  next-themes@^0.4.6 \
  nodemailer@^7.0.6 \
  rate-limiter-flexible@^7.3.1 \
  react-hook-form@^7.62.0 \
  sonner@^2.0.7 \
  tailwind-merge@^3.3.1 \
  twilio@^5.10.0 \
  zod@^4.1.5 \
  @types/bcryptjs@^2.4.6 \
  @types/jsonwebtoken@^9.0.10 \
  @types/nodemailer@^7.0.1
```

**Files to Create After Install**:
- None yet, just verify installation

**Verification**:
```bash
npm list --depth=0
```

---

### PHASE 3: Environment Configuration

#### Step 3.1: Create .env.local
Copy the exact configuration from student-nest:

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=Student Nest
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (CRITICAL - COPY FROM OLD PROJECT)
MONGODB_URI=mongodb+srv://ronakkumar20062006:WcQd5ZksggAwO1oT@cluster0.969t4yr.mongodb.net/student-nest?retryWrites=true&w=majority&appName=Cluster0

# JWT (CRITICAL - MUST MATCH OLD PROJECT)
JWT_SECRET=2b9ecfec7253b488efd94bc40594b63f
JWT_REFRESH_SECRET=2b9ecfec7253b488efd94bc40594b63f
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email - SendGrid Active
EMAIL_SERVICE=sendgrid
EMAIL_FROM=ronakkumarsingh23@lpu.in
SENDGRID_API_KEY=***REMOVED***
SENDGRID_FROM_EMAIL=ronakkumarsingh23@lpu.in

# SMS - Twilio Active
PHONE_SERVICE=twilio
TWILIO_ACCOUNT_SID=***REMOVED***
TWILIO_AUTH_TOKEN=806434567a8a820150b1a68e81c8d16b
TWILIO_PHONE_NUMBER=+15642161675
TWILIO_VERIFY_SID=VA75ff2923d12cff2725e510e5c2aceb10

# Cloudinary
CLOUDINARY_CLOUD_NAME=dyvv2furt
CLOUDINARY_API_KEY=155754953233623
CLOUDINARY_API_SECRET=HlVegbT4tFVdEn59DO8wJZmswRA
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dyvv2furt

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=***REMOVED***
GOOGLE_CLIENT_SECRET=***REMOVED***
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Security
BCRYPT_ROUNDS=12
OTP_EXPIRY_MINUTES=5
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME_HOURS=2

# Feature Flags
MOCK_VERIFICATION=true
ENABLE_EMAIL_VERIFICATION=true
ENABLE_SMS_VERIFICATION=true
```

**File to Create**:
- `.env.local` in root

---

### PHASE 4: TypeScript Configuration

#### Step 4.1: Update next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
```

**File to Update**:
- `next.config.ts`

---

### PHASE 5: Type Definitions

#### Step 5.1: Create Directory
```bash
mkdir -p src/types
```

#### Step 5.2: Create src/types/index.ts

Based on analyzed models, create complete type definitions:

```typescript
// src/types/index.ts

// ============ USER TYPES ============

export interface User {
  _id: string;
  email: string;
  phone: string;
  fullName: string;
  profilePhoto: string | null;
  role: 'student' | 'owner' | 'Student' | 'Owner';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
  identityVerificationRequired: boolean;
  identityVerificationSkipped: boolean;
  savedRooms: string[];
  isActive: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============ STUDENT TYPES ============

export interface StudentPreferences {
  roomTypePreference: ('single' | 'shared' | 'studio' | 'pg')[];
  budgetMin: number;
  budgetMax: number;
  locationPreferences: string[];
  amenityPreferences: string[];
}

export interface StudentVerification {
  status: 'pending' | 'in-review' | 'verified' | 'rejected';
  collegeIdCard?: string;
  aadhaarCard?: string;
  verifiedAt?: Date;
  rejectionReason?: string;
}

export interface Student extends User {
  role: 'student' | 'Student';
  collegeId: string;
  collegeName: string;
  course?: string;
  yearOfStudy?: number;
  city?: string;
  state?: string;
  bio?: string;
  preferences: StudentPreferences;
  verification: StudentVerification;
  lastActive: Date;
  viewCount: number;
  savedProperties: string[];
  profileCompleteness: number;
}

// ============ OWNER TYPES ============

export interface OwnerAddress {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country: string;
}

export interface DigitockerData {
  name?: string;
  dob?: Date;
  gender?: string;
  address?: string;
}

export interface VerificationDocument {
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface OwnerVerification {
  status: 'pending' | 'in-review' | 'verified' | 'rejected';
  aadhaarNumber?: string;
  aadhaarDocument?: string;
  digilockerLinked: boolean;
  digilockerData?: DigilockerData;
  verificationDocuments: VerificationDocument[];
  verifiedAt?: Date;
  rejectionReason?: string;
}

export interface Owner extends User {
  role: 'owner' | 'Owner';
  city?: string;
  state?: string;
  bio?: string;
  businessName?: string;
  businessType: 'individual' | 'company' | 'partnership';
  businessDescription?: string;
  gstNumber?: string;
  experience?: number;
  licenseNumber?: string;
  address: OwnerAddress;
  verification: OwnerVerification;
  properties: string[];
  stats: {
    totalProperties: number;
    activeListings: number;
    totalBookings: number;
    averageRating: number;
    responseTime: number;
  };
  profileCompleteness: number;
}

// ============ OTP TYPES ============

export interface OTP {
  _id: string;
  identifier: string; // email or phone
  type: 'email' | 'phone';
  code: string;
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  createdAt: Date;
}

// ============ AUTH TYPES ============

export interface LoginInput {
  identifier: string;
  password: string;
  role?: 'student' | 'owner';
}

export interface StudentSignupInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  collegeId: string;
  collegeName: string;
}

export interface OwnerSignupInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface OTPVerificationInput {
  identifier: string;
  code: string;
  type: 'email' | 'phone';
}

export interface TokenPayload {
  userId: string;
  role: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ============ API RESPONSE TYPES ============

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============ PROPERTY/ROOM TYPES ============

export interface Room {
  _id: string;
  propertyId: string;
  ownerId: string;
  roomNumber: string;
  type: 'single' | 'shared' | 'studio';
  rent: number;
  deposit: number;
  availability: 'available' | 'occupied' | 'maintenance';
  amenities: string[];
  images: string[];
  capacity: number;
  currentOccupancy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  _id: string;
  ownerId: string;
  name: string;
  description: string;
  type: 'pg' | 'hostel' | 'apartment' | 'villa';
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
  };
  totalRooms: number;
  availableRooms: number;
  amenities: string[];
  rules: string[];
  images: string[];
  videos: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============ BOOKING TYPES ============

export interface Booking {
  _id: string;
  studentId: string;
  roomId: string;
  propertyId: string;
  ownerId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  checkInDate: Date;
  checkOutDate: Date;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'pending' | 'partial' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// ============ REVIEW TYPES ============

export interface Review {
  _id: string;
  studentId: string;
  propertyId: string;
  roomId: string;
  rating: number;
  cleanliness: number;
  communication: number;
  location: number;
  value: number;
  comment: string;
  images: string[];
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============ MEETING TYPES ============

export interface Meeting {
  _id: string;
  studentId: string;
  ownerId: string;
  propertyId: string;
  scheduledAt: Date;
  duration: number;
  type: 'virtual' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  meetLink?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Files to Create**:
- `src/types/index.ts`

---

### PHASE 6: Database Layer

#### Step 6.1: Create Directory Structure
```bash
mkdir -p src/lib/db
mkdir -p src/lib/models
```

#### Step 6.2: Create Database Connection

**File**: `src/lib/db/connection.ts`

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

---

## 📋 Next Steps Checklist

### Immediate Actions (Today):
- [ ] Run Phase 2: Install dependencies
- [ ] Run Phase 3: Create .env.local
- [ ] Run Phase 4: Update next.config.ts
- [ ] Run Phase 5: Create types/index.ts
- [ ] Run Phase 6: Create database connection

### Tomorrow:
- [ ] Phase 6 continued: Create all Mongoose models
- [ ] Phase 7: Create validation schemas
- [ ] Phase 8: Create utility functions

### This Week:
- [ ] Phase 9: Migrate UI components
- [ ] Phase 10: Migrate API routes
- [ ] Testing and debugging

---

## 🎯 Success Criteria

After each phase:
1. ✅ No TypeScript errors
2. ✅ Files in correct locations
3. ✅ Imports working correctly
4. ✅ Dev server runs without errors

---

**Ready to Start**: Yes
**Next Command**: Install dependencies (Phase 2)
**Estimated Time for Phases 2-6**: 2 hours

---

**Let's begin! 🚀**
