#!/usr/bin/env node

/**
 * StudentNest Demo Data Seeder
 *
 * This script creates demo users, properties, bookings, and reviews
 * Run with: node scripts/seed-demo-data.js
 */

// Load environment variables first
import { config } from 'dotenv';
config({ path: '.env.local' });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../src/lib/db/connection.js';
import User from '../src/lib/models/User.js';
import Room from '../src/lib/models/Room.js';
import Booking from '../src/lib/models/Booking.js';
import Review from '../src/lib/models/Review.js';
import Meeting from '../src/lib/models/Meeting.js';
import RoomShare from '../src/lib/models/RoomShare.js';

// Demo data
const demoUsers = {
  students: [
    {
      email: 'student1@test.com',
      password: 'Test123@',
      fullName: 'Rahul Sharma',
      phone: '+91 9876543210',
      role: 'Student',
      isEmailVerified: true,
      isPhoneVerified: true,
      profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      college: 'Delhi University',
      course: 'Computer Science',
      yearOfStudy: 2
    },
    {
      email: 'student2@test.com',
      password: 'Test123@',
      fullName: 'Priya Singh',
      phone: '+91 9876543211',
      role: 'Student',
      isEmailVerified: true,
      isPhoneVerified: true,
      profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150',
      college: 'Jawaharlal Nehru University',
      course: 'Economics',
      yearOfStudy: 3
    },
    {
      email: 'student3@test.com',
      password: 'Test123@',
      fullName: 'Arjun Patel',
      phone: '+91 9876543212',
      role: 'Student',
      isEmailVerified: true,
      isPhoneVerified: true,
      profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      college: 'IIT Delhi',
      course: 'Mechanical Engineering',
      yearOfStudy: 1
    }
  ],
  owners: [
    {
      email: 'owner1@test.com',
      password: 'Test123@',
      fullName: 'Rajesh Kumar',
      phone: '+91 9876543220',
      role: 'Owner',
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdentityVerified: true,
      profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      businessName: 'Kumar Properties',
      businessType: 'individual',
      experience: 5,
      totalProperties: 0,
      averageRating: 4.8
    },
    {
      email: 'owner2@test.com',
      password: 'Test123@',
      fullName: 'Sunita Agarwal',
      phone: '+91 9876543221',
      role: 'Owner',
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdentityVerified: true,
      profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      businessName: 'Agarwal Hostels',
      businessType: 'company',
      experience: 8,
      totalProperties: 0,
      averageRating: 4.6
    }
  ]
};

const demoRooms = [
  {
    title: 'Modern Single Room in Green Valley PG',
    description: 'A beautifully furnished single room with all modern amenities in a safe and secure PG.',
    fullDescription: 'Experience comfort and convenience in this beautifully furnished single room. Located in the heart of South Delhi, this PG offers excellent connectivity to major colleges and IT hubs. The room comes with a comfortable bed, study table, wardrobe, and high-speed WiFi.',
    price: 18000,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e9b7013d?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    ],
    roomType: 'single',
    accommodationType: 'pg',
    maxSharingCapacity: 1,
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
        { name: 'Delhi University', distance: '5.2', commute: '25' },
        { name: 'Jamia Millia Islamia', distance: '8.1', commute: '30' }
      ],
      nearbyFacilities: [
        { name: 'Malviya Nagar Metro Station', distance: '800', type: 'metro' },
        { name: 'Select City Walk Mall', distance: '1.2', type: 'mall' },
        { name: 'Max Hospital', distance: '2.1', type: 'hospital' }
      ]
    },
    amenities: ['wifi', 'ac', 'powerBackup', 'security', 'housekeeping', 'laundry', 'parking'],
    detailedAmenities: ['wifi', 'ac', 'powerBackup', 'security', 'housekeeping', 'laundry', 'parking', 'cctv', 'geyser'],
    availability: {
      isAvailable: true,
      availableFrom: new Date('2024-12-01')
    },
    securityDeposit: 20000,
    maintenanceCharges: 2000,
    electricityCharges: 'included',
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
    tags: ['modern', 'furnished', 'safe', 'metro-nearby'],
    status: 'active'
  },
  {
    title: 'Shared Room in Student Paradise Hostel',
    description: 'Affordable shared accommodation perfect for students with excellent facilities and great community.',
    fullDescription: 'Join a vibrant community of students in this well-maintained shared room. Perfect for those who love socializing while studying. The hostel provides excellent food, recreation facilities, and a supportive environment.',
    price: 12000,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e9b7013d?w=800',
      'https://images.unsplash.com/photo-1631631480669-53742dd47930?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
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
        { name: 'Delhi University', distance: '12.5', commute: '45' },
        { name: 'Guru Gobind Singh Indraprastha University', distance: '6.2', commute: '20' }
      ],
      nearbyFacilities: [
        { name: 'Laxmi Nagar Metro Station', distance: '500', type: 'metro' },
        { name: 'V3S East Center Mall', distance: '2.1', type: 'mall' }
      ]
    },
    amenities: ['wifi', 'powerBackup', 'security', 'housekeeping', 'cafeteria', 'library', 'gym'],
    detailedAmenities: ['wifi', 'powerBackup', 'security', 'housekeeping', 'cafeteria', 'library', 'gym', 'cctv'],
    availability: {
      isAvailable: true,
      availableFrom: new Date('2024-11-15')
    },
    securityDeposit: 15000,
    maintenanceCharges: 1500,
    electricityCharges: 'shared',
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
    tags: ['affordable', 'student-friendly', 'community', 'hostel'],
    status: 'active'
  },
  {
    title: 'Luxury Studio Apartment for Students',
    description: 'Premium studio apartment with modern amenities, perfect for serious students who value privacy and comfort.',
    fullDescription: 'Experience luxury living in this fully furnished studio apartment. Ideal for graduate students or working professionals who need a quiet, private space for focused study and work.',
    price: 25000,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ],
    roomType: 'studio',
    accommodationType: 'apartment',
    maxSharingCapacity: 1,
    features: {
      area: 350,
      floor: 5,
      totalFloors: 12,
      furnished: true,
      balcony: true,
      attached_bathroom: true
    },
    location: {
      address: 'Skyline Residences, Sector 62',
      fullAddress: 'Tower B, Skyline Residences, Sector 62, Noida, Uttar Pradesh 201309',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201309',
      coordinates: { lat: 28.6139, lng: 77.3910 },
      nearbyUniversities: [
        { name: 'Amity University', distance: '3.2', commute: '15' },
        { name: 'Galgotias University', distance: '8.5', commute: '25' }
      ],
      nearbyFacilities: [
        { name: 'Sector 62 Metro Station', distance: '800', type: 'metro' },
        { name: 'DLF Mall of India', distance: '2.5', type: 'mall' },
        { name: 'Fortis Hospital', distance: '1.8', type: 'hospital' }
      ]
    },
    amenities: ['wifi', 'ac', 'powerBackup', 'security', 'parking', 'gym', 'swimming', 'elevator'],
    detailedAmenities: ['wifi', 'ac', 'powerBackup', '24x7security', 'parking', 'gym', 'swimming', 'elevator', 'cctv', 'intercom'],
    availability: {
      isAvailable: true,
      availableFrom: new Date('2024-12-15')
    },
    securityDeposit: 50000,
    maintenanceCharges: 3000,
    electricityCharges: 'extra',
    rules: {
      guestsAllowed: true,
      smokingAllowed: false,
      alcoholAllowed: true,
      petsAllowed: true,
      genderPreference: 'any',
      curfewTime: 'No Curfew'
    },
    totalRooms: 1,
    occupiedRooms: 0,
    tags: ['luxury', 'studio', 'modern', 'privacy'],
    status: 'active'
  }
];

async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

async function seedUsers() {
  console.log('🔐 Creating demo users...');

  const createdUsers = {
    students: [],
    owners: []
  };

  // Create students
  for (const student of demoUsers.students) {
    const existingUser = await User.findOne({ email: student.email });
    if (!existingUser) {
      const hashedPassword = await hashPassword(student.password);
      const newStudent = new User({
        ...student,
        password: hashedPassword
      });
      const saved = await newStudent.save();
      createdUsers.students.push(saved);
      console.log(`  ✅ Created student: ${student.fullName} (${student.email})`);
    } else {
      createdUsers.students.push(existingUser);
      console.log(`  ⚠️  Student exists: ${student.fullName} (${student.email})`);
    }
  }

  // Create owners
  for (const owner of demoUsers.owners) {
    const existingUser = await User.findOne({ email: owner.email });
    if (!existingUser) {
      const hashedPassword = await hashPassword(owner.password);
      const newOwner = new User({
        ...owner,
        password: hashedPassword
      });
      const saved = await newOwner.save();
      createdUsers.owners.push(saved);
      console.log(`  ✅ Created owner: ${owner.fullName} (${owner.email})`);
    } else {
      createdUsers.owners.push(existingUser);
      console.log(`  ⚠️  Owner exists: ${owner.fullName} (${owner.email})`);
    }
  }

  return createdUsers;
}

async function seedRooms(createdUsers) {
  console.log('🏠 Creating demo rooms...');

  const createdRooms = [];

  for (let i = 0; i < demoRooms.length; i++) {
    const room = demoRooms[i];
    const owner = createdUsers.owners[i % createdUsers.owners.length];

    const existingRoom = await Room.findOne({ title: room.title });
    if (!existingRoom) {
      const newRoom = new Room({
        ...room,
        owner: owner._id
      });
      const saved = await newRoom.save();
      createdRooms.push(saved);

      // Update owner's property count
      await User.findByIdAndUpdate(owner._id, {
        $inc: { totalProperties: 1 }
      });

      console.log(`  ✅ Created room: ${room.title}`);
    } else {
      createdRooms.push(existingRoom);
      console.log(`  ⚠️  Room exists: ${room.title}`);
    }
  }

  return createdRooms;
}

async function seedBookings(createdUsers, createdRooms) {
  console.log('📅 Creating demo bookings...');

  const createdBookings = [];

  // Create a few bookings
  const bookingData = [
    {
      student: createdUsers.students[0],
      room: createdRooms[0],
      moveInDate: new Date('2024-12-01'),
      duration: 6,
      status: 'confirmed'
    },
    {
      student: createdUsers.students[1],
      room: createdRooms[1],
      moveInDate: new Date('2024-11-15'),
      duration: 12,
      status: 'active'
    },
    {
      student: createdUsers.students[2],
      room: createdRooms[2],
      moveInDate: new Date('2025-01-01'),
      duration: 3,
      status: 'pending'
    }
  ];

  for (const bookingInfo of bookingData) {
    const existingBooking = await Booking.findOne({
      student: bookingInfo.student._id,
      room: bookingInfo.room._id
    });

    if (!existingBooking) {
      const booking = new Booking({
        room: bookingInfo.room._id,
        student: bookingInfo.student._id,
        owner: bookingInfo.room.owner,
        moveInDate: bookingInfo.moveInDate,
        duration: bookingInfo.duration,
        monthlyRent: bookingInfo.room.price,
        securityDeposit: bookingInfo.room.securityDeposit,
        maintenanceCharges: bookingInfo.room.maintenanceCharges,
        totalAmount: bookingInfo.room.price + bookingInfo.room.securityDeposit + bookingInfo.room.maintenanceCharges,
        status: bookingInfo.status,
        paymentStatus: bookingInfo.status === 'active' ? 'paid' : 'pending'
      });

      const saved = await booking.save();
      createdBookings.push(saved);
      console.log(`  ✅ Created booking: ${bookingInfo.student.fullName} -> ${bookingInfo.room.title}`);
    } else {
      createdBookings.push(existingBooking);
      console.log(`  ⚠️  Booking exists: ${bookingInfo.student.fullName} -> ${bookingInfo.room.title}`);
    }
  }

  return createdBookings;
}

async function seedReviews(createdUsers, createdRooms, createdBookings) {
  console.log('⭐ Creating demo reviews...');

  const reviewsData = [
    {
      property: createdRooms[0],
      student: createdUsers.students[0],
      booking: createdBookings[0],
      overallRating: 5,
      categories: {
        cleanliness: 5,
        location: 5,
        facilities: 4,
        owner: 5,
        value: 4
      },
      comment: 'Excellent room with all modern amenities. The owner is very cooperative and the location is perfect for students. Highly recommended!',
      stayDuration: '6 months',
      isVerified: true
    },
    {
      property: createdRooms[1],
      student: createdUsers.students[1],
      booking: createdBookings[1],
      overallRating: 4,
      categories: {
        cleanliness: 4,
        location: 4,
        facilities: 4,
        owner: 4,
        value: 5
      },
      comment: 'Great value for money. The hostel has a nice community feeling and all basic amenities are provided.',
      stayDuration: '8 months',
      isVerified: true
    }
  ];

  for (const reviewData of reviewsData) {
    const existingReview = await Review.findOne({
      property: reviewData.property._id,
      student: reviewData.student._id
    });

    if (!existingReview) {
      const review = new Review(reviewData);
      await review.save();
      console.log(`  ✅ Created review: ${reviewData.student.fullName} -> ${reviewData.property.title}`);
    } else {
      console.log(`  ⚠️  Review exists: ${reviewData.student.fullName} -> ${reviewData.property.title}`);
    }
  }
}

async function seedMeetings(createdUsers, createdRooms) {
  console.log('🤝 Creating demo meetings...');

  const meetingsData = [
    {
      property: createdRooms[2],
      student: createdUsers.students[2],
      owner: createdRooms[2].owner,
      preferredDates: [
        new Date('2024-11-20T10:00:00Z'),
        new Date('2024-11-21T14:00:00Z')
      ],
      status: 'pending',
      meetingType: 'physical',
      studentNotes: 'Looking for immediate move-in. Would like to see the room and discuss terms.'
    }
  ];

  for (const meetingData of meetingsData) {
    const existingMeeting = await Meeting.findOne({
      property: meetingData.property._id,
      student: meetingData.student._id,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (!existingMeeting) {
      const meeting = new Meeting(meetingData);
      await meeting.save();
      console.log(`  ✅ Created meeting: ${meetingData.student.fullName} -> ${meetingData.property.title}`);
    } else {
      console.log(`  ⚠️  Meeting exists: ${meetingData.student.fullName} -> ${meetingData.property.title}`);
    }
  }
}

async function seedDemo() {
  console.log('🌱 StudentNest Demo Data Seeder');
  console.log('==============================');

  try {
    // Connect to database
    await connectDB();
    console.log('✅ Connected to database');

    // Seed data
    const createdUsers = await seedUsers();
    const createdRooms = await seedRooms(createdUsers);
    const createdBookings = await seedBookings(createdUsers, createdRooms);
    await seedReviews(createdUsers, createdRooms, createdBookings);
    await seedMeetings(createdUsers, createdRooms);

    console.log('');
    console.log('🎉 Demo data seeded successfully!');
    console.log('');
    console.log('📧 Test User Accounts:');
    console.log('Students:');
    createdUsers.students.forEach(student => {
      console.log(`  • ${student.fullName}: ${student.email} / Test123@`);
    });
    console.log('Owners:');
    createdUsers.owners.forEach(owner => {
      console.log(`  • ${owner.fullName}: ${owner.email} / Test123@`);
    });

    console.log('');
    console.log('🏠 Demo Properties Created:', createdRooms.length);
    console.log('📅 Demo Bookings Created:', createdBookings.length);
    console.log('');
    console.log('💡 Next Steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Test login with any of the above accounts');
    console.log('3. Browse rooms at: http://localhost:3000/api/rooms');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Run seeder if called directly
if (process.argv[1].includes('seed-demo-data.js')) {
  seedDemo();
}

export default seedDemo;