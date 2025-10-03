#!/usr/bin/env node

/**
 * StudentNest Demo Data Seeder - Direct MongoDB
 *
 * This script creates demo users, properties, bookings, and reviews
 * Run with: node scripts/seed-demo-direct.js
 */

import { config } from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Load environment variables
config({ path: '.env.local' });

// Direct MongoDB connection
async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.log('❌ MONGODB_URI not found in environment variables');
    console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('MONGO')));
    throw new Error('MONGODB_URI is required');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB:', MONGODB_URI.split('@')[1]?.split('/')[0] || 'localhost');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

// Simple User Schema for seeding
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  phone: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, required: true },
  profilePhoto: String,
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  isIdentityVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },

  // Student fields
  collegeId: String,
  collegeName: String,
  course: String,
  yearOfStudy: Number,

  // Owner fields
  businessName: String,
  businessType: String,
  experience: Number,
  totalProperties: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },

  lastLogin: Date,
  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now }
  }],
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date
}, { timestamps: true });

// Simple Room Schema for seeding
const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: String,
  price: { type: Number, required: true },
  images: [String],
  roomType: { type: String, enum: ['single', 'shared', 'studio'], required: true },
  accommodationType: { type: String, enum: ['pg', 'hostel', 'apartment', 'room'], required: true },
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
    nearbyUniversities: [],
    nearbyFacilities: []
  },

  amenities: [String],
  detailedAmenities: [String],

  availability: {
    isAvailable: { type: Boolean, default: true },
    availableFrom: Date
  },

  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  securityDeposit: { type: Number, required: true },
  maintenanceCharges: { type: Number, default: 0 },
  electricityCharges: { type: String, enum: ['included', 'extra', 'shared'], default: 'included' },

  rules: {
    guestsAllowed: Boolean,
    smokingAllowed: Boolean,
    alcoholAllowed: Boolean,
    petsAllowed: Boolean,
    genderPreference: String,
    curfewTime: String
  },

  totalRooms: { type: Number, default: 1 },
  occupiedRooms: { type: Number, default: 0 },

  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  tags: [String]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Room = mongoose.model('Room', roomSchema);

// Demo data
const demoUsers = [
  {
    email: 'student1@test.com',
    password: 'Test123@',
    fullName: 'Rahul Sharma',
    phone: '+919876543210',
    role: 'Student',
    isEmailVerified: true,
    isPhoneVerified: true,
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    collegeId: 'DU001',
    collegeName: 'Delhi University',
    course: 'Computer Science',
    yearOfStudy: 2
  },
  {
    email: 'student2@test.com',
    password: 'Test123@',
    fullName: 'Priya Singh',
    phone: '+919876543211',
    role: 'Student',
    isEmailVerified: true,
    isPhoneVerified: true,
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150',
    collegeId: 'JNU001',
    collegeName: 'Jawaharlal Nehru University',
    course: 'Economics',
    yearOfStudy: 3
  },
  {
    email: 'owner1@test.com',
    password: 'Test123@',
    fullName: 'Rajesh Kumar',
    phone: '+919876543220',
    role: 'Owner',
    isEmailVerified: true,
    isPhoneVerified: true,
    isIdentityVerified: true,
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    businessName: 'Kumar Properties',
    businessType: 'individual',
    experience: 5,
    averageRating: 4.8
  }
];

const demoRooms = [
  {
    title: 'Modern Single Room in Green Valley PG',
    description: 'A beautifully furnished single room with all modern amenities in a safe and secure PG.',
    fullDescription: 'Experience comfort and convenience in this beautifully furnished single room. Located in the heart of South Delhi, this PG offers excellent connectivity to major colleges and IT hubs.',
    price: 18000,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e9b7013d?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    ],
    roomType: 'single',
    accommodationType: 'pg',
    features: {
      area: 120,
      floor: 2,
      totalFloors: 4,
      furnished: true,
      balcony: true,
      attached_bathroom: true
    },
    location: {
      address: 'Block A, Green Valley Society',
      fullAddress: 'Block A, Green Valley Society, Malviya Nagar, New Delhi, Delhi 110017',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110017',
      coordinates: { lat: 28.5355, lng: 77.2066 },
      nearbyUniversities: [
        { name: 'Delhi University', distance: '5.2', commute: '25' }
      ],
      nearbyFacilities: [
        { name: 'Malviya Nagar Metro Station', distance: '800', type: 'metro' }
      ]
    },
    amenities: ['wifi', 'ac', 'powerBackup', 'security', 'housekeeping'],
    detailedAmenities: ['wifi', 'ac', 'powerBackup', 'security', 'housekeeping'],
    availability: {
      isAvailable: true,
      availableFrom: new Date('2024-12-01')
    },
    securityDeposit: 20000,
    maintenanceCharges: 2000,
    rules: {
      guestsAllowed: true,
      smokingAllowed: false,
      alcoholAllowed: false,
      petsAllowed: false,
      genderPreference: 'any',
      curfewTime: '11:00 PM'
    },
    totalRooms: 5,
    occupiedRooms: 2,
    tags: ['modern', 'furnished', 'safe']
  },
  {
    title: 'Shared Room in Student Paradise Hostel',
    description: 'Affordable shared accommodation perfect for students with excellent facilities.',
    price: 12000,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e9b7013d?w=800'
    ],
    roomType: 'shared',
    accommodationType: 'hostel',
    maxSharingCapacity: 3,
    features: {
      area: 180,
      floor: 1,
      totalFloors: 3,
      furnished: true,
      balcony: false,
      attached_bathroom: false
    },
    location: {
      address: 'Student Paradise Hostel, Laxmi Nagar',
      fullAddress: 'Student Paradise Hostel, Laxmi Nagar, New Delhi, Delhi 110092',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110092',
      coordinates: { lat: 28.6345, lng: 77.2777 },
      nearbyUniversities: [
        { name: 'Delhi University', distance: '12.5', commute: '45' }
      ],
      nearbyFacilities: [
        { name: 'Laxmi Nagar Metro Station', distance: '500', type: 'metro' }
      ]
    },
    amenities: ['wifi', 'powerBackup', 'security', 'cafeteria'],
    detailedAmenities: ['wifi', 'powerBackup', 'security', 'cafeteria'],
    availability: {
      isAvailable: true,
      availableFrom: new Date('2024-11-15')
    },
    securityDeposit: 15000,
    maintenanceCharges: 1500,
    rules: {
      guestsAllowed: false,
      smokingAllowed: false,
      alcoholAllowed: false,
      petsAllowed: false,
      genderPreference: 'male',
      curfewTime: '10:30 PM'
    },
    totalRooms: 8,
    occupiedRooms: 5,
    tags: ['affordable', 'student-friendly']
  }
];

async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

async function seedData() {
  console.log('🌱 StudentNest Demo Data Seeder (Direct)');
  console.log('========================================');

  try {
    await connectDB();

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Room.deleteMany({});

    // Create users
    console.log('👥 Creating demo users...');
    const createdUsers = [];

    for (const userData of demoUsers) {
      const hashedPassword = await hashPassword(userData.password);
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`  ✅ Created: ${user.fullName} (${user.role})`);
    }

    // Create rooms
    console.log('🏠 Creating demo rooms...');
    const owner = createdUsers.find(u => u.role === 'Owner');

    for (const roomData of demoRooms) {
      const room = new Room({
        ...roomData,
        owner: owner._id
      });

      await room.save();
      console.log(`  ✅ Created: ${room.title}`);
    }

    console.log('');
    console.log('🎉 Demo data created successfully!');
    console.log('');
    console.log('📧 Test Accounts:');
    createdUsers.forEach(user => {
      console.log(`  • ${user.fullName} (${user.role}): ${user.email} / Test123@`);
    });

    console.log('');
    console.log('💡 Next Steps:');
    console.log('1. Start server: npm run dev');
    console.log('2. Test APIs: node scripts/test-e2e-apis.js');
    console.log('3. Login at: http://localhost:3000/auth/login');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Run if called directly
seedData();