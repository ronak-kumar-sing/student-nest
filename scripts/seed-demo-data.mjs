#!/usr/bin/env node

/**
 * Seed Demo Data Script
 * Creates comprehensive demo data for testing the StudentNest application
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../src/lib/db/connection.js';
import User from '../src/lib/models/User.js';
import Student from '../src/lib/models/Student.js';
import Owner from '../src/lib/models/Owner.js';
import Room from '../src/lib/models/Room.js';
import Booking from '../src/lib/models/Booking.js';
import Review from '../src/lib/models/Review.js';

const DEMO_PASSWORD = 'Demo@123';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
};

// Demo student data
const demoStudents = [
  {
    email: 'priya.sharma@demo.com',
    name: 'Priya Sharma',
    phone: '+91-9876543210',
    university: 'Amity University',
    yearOfStudy: 2,
    preferredLocation: 'Noida',
  },
  {
    email: 'rahul.kumar@demo.com',
    name: 'Rahul Kumar',
    phone: '+91-9876543211',
    university: 'Sharda University',
    yearOfStudy: 3,
    preferredLocation: 'Greater Noida',
  },
  {
    email: 'ananya.patel@demo.com',
    name: 'Ananya Patel',
    phone: '+91-9876543212',
    university: 'Delhi University',
    yearOfStudy: 1,
    preferredLocation: 'Delhi',
  },
  {
    email: 'arjun.singh@demo.com',
    name: 'Arjun Singh',
    phone: '+91-9876543213',
    university: 'IIT Delhi',
    yearOfStudy: 4,
    preferredLocation: 'South Delhi',
  },
  {
    email: 'sneha.gupta@demo.com',
    name: 'Sneha Gupta',
    phone: '+91-9876543214',
    university: 'Jamia Millia Islamia',
    yearOfStudy: 2,
    preferredLocation: 'Central Delhi',
  },
];

// Demo owner data
const demoOwners = [
  {
    email: 'rajesh.kumar@demo.com',
    name: 'Rajesh Kumar',
    phone: '+91-9123456789',
    properties: 3,
  },
  {
    email: 'sunita.verma@demo.com',
    name: 'Sunita Verma',
    phone: '+91-9123456790',
    properties: 2,
  },
  {
    email: 'vikram.mehta@demo.com',
    name: 'Vikram Mehta',
    phone: '+91-9123456791',
    properties: 4,
  },
];

// Demo rooms data
const demoRooms = [
  {
    title: 'Cozy Single Room near Amity University',
    description: 'A beautiful and spacious room perfect for students.',
    fullDescription:
      'Experience comfort and convenience in this beautifully furnished private room. Perfect for students seeking a balance of study and relaxation. The room features modern amenities, high-speed internet, and is situated in a secure, well-maintained property.',
    price: 12000,
    location: {
      address: 'Sector 15',
      city: 'Noida',
      state: 'Uttar Pradesh',
      nearbyUniversities: ['Amity University (2.5 km)', 'Sharda University (8.2 km)'],
    },
    roomType: 'Single',
    accommodationType: 'pg',
    amenities: ['wifi', 'ac', 'security', 'parking'],
    features: {
      area: 120,
      floor: 3,
      totalFloors: 5,
      furnished: true,
      balcony: true,
      attached_bathroom: true,
    },
    availability: {
      isAvailable: true,
      availableFrom: new Date(),
    },
  },
  {
    title: 'Spacious Shared Room in Greater Noida',
    description: 'Perfect for students who want to share with roommates.',
    fullDescription:
      'Affordable shared accommodation with all modern amenities. Great location close to universities and shopping centers. Includes study area, comfortable beds, and storage space.',
    price: 7000,
    location: {
      address: 'Gamma 1',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      nearbyUniversities: ['Sharda University (1.5 km)', 'GNIOT (3 km)'],
    },
    roomType: 'Shared',
    accommodationType: 'pg',
    amenities: ['wifi', 'security', 'kitchen', 'laundry'],
    features: {
      area: 150,
      floor: 2,
      totalFloors: 4,
      furnished: true,
      balcony: false,
      attached_bathroom: false,
    },
    availability: {
      isAvailable: true,
      availableFrom: new Date(),
    },
  },
  {
    title: 'Premium Studio Apartment - South Delhi',
    description: 'Luxury studio apartment with all modern facilities.',
    fullDescription:
      'Live in style in this premium studio apartment. Features include a fully equipped kitchen, modern bathroom, high-speed internet, and 24/7 security. Located in the heart of South Delhi with easy access to metro and shopping complexes.',
    price: 25000,
    location: {
      address: 'Lajpat Nagar',
      city: 'Delhi',
      state: 'Delhi',
      nearbyUniversities: ['Delhi University (4 km)', 'IIT Delhi (6 km)'],
    },
    roomType: 'Studio',
    accommodationType: 'apartment',
    amenities: ['wifi', 'ac', 'parking', 'gym', 'security', 'kitchen'],
    features: {
      area: 350,
      floor: 5,
      totalFloors: 8,
      furnished: true,
      balcony: true,
      attached_bathroom: true,
    },
    availability: {
      isAvailable: true,
      availableFrom: new Date(),
    },
  },
  {
    title: 'Affordable PG for Girls - Noida Sector 62',
    description: 'Safe and secure PG exclusively for female students.',
    fullDescription:
      'A comfortable and secure PG facility designed specifically for female students. Features include CCTV surveillance, biometric access, common lounge area, and nutritious meals. Located near IT companies and educational institutions.',
    price: 8500,
    location: {
      address: 'Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      nearbyUniversities: ['Amity University (5 km)'],
    },
    roomType: 'Shared',
    accommodationType: 'pg',
    amenities: ['wifi', 'security', 'kitchen', 'laundry', 'ac'],
    features: {
      area: 100,
      floor: 1,
      totalFloors: 3,
      furnished: true,
      balcony: false,
      attached_bathroom: false,
    },
    availability: {
      isAvailable: true,
      availableFrom: new Date(),
    },
  },
  {
    title: 'Modern Single Room - Central Delhi',
    description: 'Well-connected single room in the heart of Delhi.',
    fullDescription:
      'Centrally located single room with excellent connectivity to universities and metro stations. Perfect for students who value convenience and accessibility. Includes all basic amenities and 24/7 power backup.',
    price: 15000,
    location: {
      address: 'Karol Bagh',
      city: 'Delhi',
      state: 'Delhi',
      nearbyUniversities: ['Delhi University (3 km)', 'Jamia Millia Islamia (7 km)'],
    },
    roomType: 'Single',
    accommodationType: 'pg',
    amenities: ['wifi', 'ac', 'parking', 'security'],
    features: {
      area: 110,
      floor: 2,
      totalFloors: 4,
      furnished: true,
      balcony: true,
      attached_bathroom: true,
    },
    availability: {
      isAvailable: true,
      availableFrom: new Date(),
    },
  },
  {
    title: 'Budget-Friendly Hostel Room',
    description: 'Economical hostel accommodation for students.',
    fullDescription:
      'Affordable hostel accommodation with basic amenities. Great for students on a tight budget. Includes shared common areas, study rooms, and recreational facilities. Friendly community atmosphere.',
    price: 5000,
    location: {
      address: 'Mukherjee Nagar',
      city: 'Delhi',
      state: 'Delhi',
      nearbyUniversities: ['Delhi University (2 km)'],
    },
    roomType: 'Shared',
    accommodationType: 'hostel',
    amenities: ['wifi', 'security', 'kitchen', 'laundry'],
    features: {
      area: 80,
      floor: 1,
      totalFloors: 3,
      furnished: true,
      balcony: false,
      attached_bathroom: false,
    },
    availability: {
      isAvailable: true,
      availableFrom: new Date(),
    },
  },
];

async function clearExistingData() {
  log.section('🗑️  Clearing Existing Demo Data...');

  const demoEmails = [
    ...demoStudents.map((s) => s.email),
    ...demoOwners.map((o) => o.email),
  ];

  try {
    const deletedUsers = await User.deleteMany({ email: { $in: demoEmails } });
    log.info(`Deleted ${deletedUsers.deletedCount} demo users`);

    const deletedStudents = await Student.deleteMany({ email: { $in: demoEmails } });
    log.info(`Deleted ${deletedStudents.deletedCount} demo students`);

    const deletedOwners = await Owner.deleteMany({ email: { $in: demoEmails } });
    log.info(`Deleted ${deletedOwners.deletedCount} demo owners`);

    // Delete rooms owned by demo owners
    const demoOwnerIds = await Owner.find({ email: { $in: demoOwners.map((o) => o.email) } }).distinct('_id');
    const deletedRooms = await Room.deleteMany({ owner: { $in: demoOwnerIds } });
    log.info(`Deleted ${deletedRooms.deletedCount} demo rooms`);

    log.success('Existing demo data cleared');
  } catch (error) {
    log.error(`Error clearing data: ${error.message}`);
  }
}

async function createDemoStudents() {
  log.section('👨‍🎓 Creating Demo Students...');

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  const createdStudents = [];

  for (const studentData of demoStudents) {
    try {
      // Create user account
      const user = await User.create({
        email: studentData.email,
        password: hashedPassword,
        role: 'student',
        isVerified: true,
      });

      // Create student profile
      const student = await Student.create({
        userId: user._id,
        email: studentData.email,
        name: studentData.name,
        phone: studentData.phone,
        university: studentData.university,
        yearOfStudy: studentData.yearOfStudy,
        preferredLocation: studentData.preferredLocation,
        verified: true,
        savedRooms: [],
      });

      createdStudents.push(student);
      log.success(`Created student: ${studentData.name} (${studentData.email})`);
    } catch (error) {
      log.error(`Error creating student ${studentData.name}: ${error.message}`);
    }
  }

  return createdStudents;
}

async function createDemoOwners() {
  log.section('🏠 Creating Demo Owners...');

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  const createdOwners = [];

  for (const ownerData of demoOwners) {
    try {
      // Create user account
      const user = await User.create({
        email: ownerData.email,
        password: hashedPassword,
        role: 'owner',
        isVerified: true,
      });

      // Create owner profile
      const owner = await Owner.create({
        userId: user._id,
        email: ownerData.email,
        name: ownerData.name,
        phone: ownerData.phone,
        verified: true,
        properties: [],
        rating: 4.5 + Math.random() * 0.5,
        totalReviews: Math.floor(Math.random() * 20) + 5,
      });

      createdOwners.push(owner);
      log.success(`Created owner: ${ownerData.name} (${ownerData.email})`);
    } catch (error) {
      log.error(`Error creating owner ${ownerData.name}: ${error.message}`);
    }
  }

  return createdOwners;
}

async function createDemoRooms(owners) {
  log.section('🏘️  Creating Demo Rooms...');

  const createdRooms = [];

  for (let i = 0; i < demoRooms.length; i++) {
    const roomData = demoRooms[i];
    const owner = owners[i % owners.length]; // Distribute rooms among owners

    try {
      const room = await Room.create({
        ...roomData,
        owner: owner._id,
        rating: 3.5 + Math.random() * 1.5,
        totalReviews: Math.floor(Math.random() * 30) + 5,
        images: [
          '/api/placeholder/800/600',
          '/api/placeholder/800/600',
          '/api/placeholder/800/600',
        ],
        verified: true,
      });

      // Update owner's properties
      await Owner.findByIdAndUpdate(owner._id, {
        $push: { properties: room._id },
      });

      createdRooms.push(room);
      log.success(`Created room: ${roomData.title}`);
    } catch (error) {
      log.error(`Error creating room ${roomData.title}: ${error.message}`);
    }
  }

  return createdRooms;
}

async function createDemoBookings(students, rooms) {
  log.section('📝 Creating Demo Bookings...');

  const statuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];
  const bookingsToCreate = Math.min(10, students.length * 2);

  for (let i = 0; i < bookingsToCreate; i++) {
    const student = students[i % students.length];
    const room = rooms[i % rooms.length];
    const status = statuses[i % statuses.length];

    try {
      await Booking.create({
        student: student._id,
        room: room._id,
        owner: room.owner,
        status,
        checkIn: new Date(Date.now() + i * 7 * 24 * 60 * 60 * 1000),
        checkOut: new Date(Date.now() + (i + 6) * 30 * 24 * 60 * 60 * 1000),
        monthlyRent: room.price,
        totalAmount: room.price * 6,
        securityDeposit: room.price * 2,
      });

      log.success(`Created ${status} booking for ${student.name} → ${room.title}`);
    } catch (error) {
      log.error(`Error creating booking: ${error.message}`);
    }
  }
}

async function createDemoReviews(students, rooms) {
  log.section('⭐ Creating Demo Reviews...');

  const comments = [
    'Excellent room with all modern amenities. Highly recommended!',
    'Great location and very responsive owner. Worth the price.',
    'Clean and well-maintained property. Good for students.',
    'Decent accommodation but could be better maintained.',
    'Perfect for students! Close to university and very affordable.',
    'Owner is very helpful and the room is exactly as described.',
  ];

  for (let i = 0; i < Math.min(15, rooms.length); i++) {
    const student = students[i % students.length];
    const room = rooms[i];
    const rating = 3.5 + Math.random() * 1.5;

    try {
      await Review.create({
        room: room._id,
        student: student._id,
        owner: room.owner,
        rating: Math.round(rating * 10) / 10,
        comment: comments[i % comments.length],
        verified: true,
      });

      log.success(`Created review for ${room.title} by ${student.name}`);
    } catch (error) {
      log.error(`Error creating review: ${error.message}`);
    }
  }
}

async function printSummary(students, owners, rooms) {
  log.section('📊 Seed Data Summary');

  console.log(`
${colors.cyan}╔══════════════════════════════════════════════╗
║          Demo Data Created Successfully       ║
╚══════════════════════════════════════════════╝${colors.reset}

${colors.green}Students:${colors.reset} ${students.length}
${colors.green}Owners:${colors.reset} ${owners.length}
${colors.green}Rooms:${colors.reset} ${rooms.length}
${colors.green}Bookings:${colors.reset} ~10
${colors.green}Reviews:${colors.reset} ~15

${colors.yellow}Demo Login Credentials:${colors.reset}
${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.blue}Students:${colors.reset}
${students.map((s) => `  • ${s.email} / ${DEMO_PASSWORD}`).join('\n')}

${colors.blue}Owners:${colors.reset}
${owners.map((o) => `  • ${o.email} / ${DEMO_PASSWORD}`).join('\n')}

${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
  `);
}

async function main() {
  try {
    console.log(`
${colors.cyan}╔══════════════════════════════════════════════╗
║     StudentNest Demo Data Seeder v1.0        ║
╚══════════════════════════════════════════════╝${colors.reset}
    `);

    // Connect to database
    log.info('Connecting to database...');
    await connectDB();
    log.success('Connected to database');

    // Clear existing demo data
    await clearExistingData();

    // Create demo data
    const students = await createDemoStudents();
    const owners = await createDemoOwners();
    const rooms = await createDemoRooms(owners);
    await createDemoBookings(students, rooms);
    await createDemoReviews(students, rooms);

    // Print summary
    await printSummary(students, owners, rooms);

    log.success('Demo data seeding completed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();
