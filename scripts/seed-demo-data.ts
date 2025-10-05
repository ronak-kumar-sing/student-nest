#!/usr/bin/env tsx

/**
 * Seed Demo Data Script
 * Creates comprehensive demo data for testing the StudentNest application
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../src/lib/db/connection';
import User from '../src/lib/models/User';
import Student from '../src/lib/models/Student';
import Owner from '../src/lib/models/Owner';
import Room from '../src/lib/models/Room';
import Booking from '../src/lib/models/Booking';
import Review from '../src/lib/models/Review';

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
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  section: (msg: string) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
};

// Demo student data
const demoStudents = [
  {
    email: 'priya.sharma@demo.com',
    name: 'Priya Sharma',
    phone: '9876543210',
    university: 'Amity University',
    yearOfStudy: 2,
    preferredLocation: 'Noida',
  },
  {
    email: 'rahul.kumar@demo.com',
    name: 'Rahul Kumar',
    phone: '9876543211',
    university: 'Sharda University',
    yearOfStudy: 3,
    preferredLocation: 'Greater Noida',
  },
  {
    email: 'ananya.patel@demo.com',
    name: 'Ananya Patel',
    phone: '9876543212',
    university: 'Delhi University',
    yearOfStudy: 1,
    preferredLocation: 'Delhi',
  },
  {
    email: 'arjun.singh@demo.com',
    name: 'Arjun Singh',
    phone: '9876543213',
    university: 'IIT Delhi',
    yearOfStudy: 4,
    preferredLocation: 'South Delhi',
  },
  {
    email: 'sneha.gupta@demo.com',
    name: 'Sneha Gupta',
    phone: '9876543214',
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
    phone: '9123456789',
    properties: 3,
  },
  {
    email: 'sunita.verma@demo.com',
    name: 'Sunita Verma',
    phone: '9123456790',
    properties: 2,
  },
  {
    email: 'vikram.mehta@demo.com',
    name: 'Vikram Mehta',
    phone: '9123456791',
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
    securityDeposit: 24000,
    location: {
      address: 'Sector 15',
      fullAddress: 'Sector 15, Noida, Uttar Pradesh 201301',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      coordinates: {
        lat: 28.5355,
        lng: 77.3910
      },
      nearbyUniversities: [
        { name: 'Amity University', distance: '2.5 km', commute: '15 min' },
        { name: 'Sharda University', distance: '8.2 km', commute: '25 min' }
      ],
    },
    roomType: 'single',
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
      totalRooms: 1,
      availableRooms: 1,
    },
  },
  {
    title: 'Spacious Shared Room in Greater Noida',
    description: 'Perfect for students who want to share with roommates.',
    fullDescription:
      'Affordable shared accommodation with all modern amenities. Great location close to universities and shopping centers. Includes study area, comfortable beds, and storage space.',
    price: 7000,
    securityDeposit: 14000,
    location: {
      address: 'Gamma 1',
      fullAddress: 'Gamma 1, Greater Noida, Uttar Pradesh 201308',
      city: 'Greater Noida',
      state: 'Uttar Pradesh',
      pincode: '201308',
      coordinates: {
        lat: 28.4742,
        lng: 77.5040
      },
      nearbyUniversities: [
        { name: 'Sharda University', distance: '1.5 km', commute: '10 min' },
        { name: 'GNIOT', distance: '3 km', commute: '15 min' }
      ],
    },
    roomType: 'shared',
    accommodationType: 'pg',
    maxSharingCapacity: 2,
    amenities: ['wifi', 'security', 'laundry', 'parking'],
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
      totalRooms: 1,
      availableRooms: 1,
    },
  },
  {
    title: 'Premium Studio Apartment - South Delhi',
    description: 'Luxury studio apartment with all modern facilities.',
    fullDescription:
      'Live in style in this premium studio apartment. Features include a fully equipped kitchen, modern bathroom, high-speed internet, and 24/7 security. Located in the heart of South Delhi with easy access to metro and shopping complexes.',
    price: 25000,
    securityDeposit: 50000,
    location: {
      address: 'Lajpat Nagar',
      fullAddress: 'Lajpat Nagar, South Delhi, Delhi 110024',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110024',
      coordinates: {
        lat: 28.5677,
        lng: 77.2432
      },
      nearbyUniversities: [
        { name: 'Delhi University', distance: '4 km', commute: '20 min' },
        { name: 'IIT Delhi', distance: '6 km', commute: '25 min' }
      ],
    },
    roomType: 'studio',
    accommodationType: 'apartment',
    amenities: ['wifi', 'ac', 'parking', 'gym', 'security', 'laundry'],
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
      totalRooms: 1,
      availableRooms: 1,
    },
  },
  {
    title: 'Affordable PG for Girls - Noida Sector 62',
    description: 'Safe and secure PG exclusively for female students.',
    fullDescription:
      'A comfortable and secure PG facility designed specifically for female students. Features include CCTV surveillance, biometric access, common lounge area, and nutritious meals. Located near IT companies and educational institutions.',
    price: 8500,
    securityDeposit: 17000,
    location: {
      address: 'Sector 62',
      fullAddress: 'Sector 62, Noida, Uttar Pradesh 201309',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201309',
      coordinates: {
        lat: 28.6142,
        lng: 77.3660
      },
      nearbyUniversities: [
        { name: 'Amity University', distance: '5 km', commute: '20 min' }
      ],
    },
    roomType: 'shared',
    accommodationType: 'pg',
    maxSharingCapacity: 2,
    amenities: ['wifi', 'security', 'laundry', 'ac', 'cctv'],
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
      totalRooms: 1,
      availableRooms: 1,
    },
  },
  {
    title: 'Modern Single Room - Central Delhi',
    description: 'Well-connected single room in the heart of Delhi.',
    fullDescription:
      'Centrally located single room with excellent connectivity to universities and metro stations. Perfect for students who value convenience and accessibility. Includes all basic amenities and 24/7 power backup.',
    price: 15000,
    securityDeposit: 30000,
    location: {
      address: 'Karol Bagh',
      fullAddress: 'Karol Bagh, Central Delhi, Delhi 110005',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110005',
      coordinates: {
        lat: 28.6519,
        lng: 77.1903
      },
      nearbyUniversities: [
        { name: 'Delhi University', distance: '3 km', commute: '15 min' },
        { name: 'Jamia Millia Islamia', distance: '7 km', commute: '30 min' }
      ],
    },
    roomType: 'single',
    accommodationType: 'pg',
    amenities: ['wifi', 'ac', 'parking', 'security', 'powerBackup'],
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
      totalRooms: 1,
      availableRooms: 1,
    },
  },
  {
    title: 'Budget-Friendly Hostel Room',
    description: 'Economical hostel accommodation for students.',
    fullDescription:
      'Affordable hostel accommodation with basic amenities. Great for students on a tight budget. Includes shared common areas, study rooms, and recreational facilities. Friendly community atmosphere.',
    price: 5000,
    securityDeposit: 10000,
    location: {
      address: 'Mukherjee Nagar',
      fullAddress: 'Mukherjee Nagar, North Delhi, Delhi 110009',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110009',
      coordinates: {
        lat: 28.7041,
        lng: 77.2127
      },
      nearbyUniversities: [
        { name: 'Delhi University', distance: '2 km', commute: '10 min' }
      ],
    },
    roomType: 'shared',
    accommodationType: 'hostel',
    maxSharingCapacity: 3,
    amenities: ['wifi', 'security', 'laundry', 'library'],
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
      totalRooms: 1,
      availableRooms: 1,
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
  } catch (error: any) {
    log.error(`Error clearing data: ${error.message}`);
  }
}

async function createDemoStudents() {
  log.section('👨‍🎓 Creating Demo Students...');

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  const createdStudents: any[] = [];

  for (const studentData of demoStudents) {
    try {
      // Create student (which extends User via discriminator)
      const student = await Student.create({
        email: studentData.email,
        password: hashedPassword,
        fullName: studentData.name,
        phone: studentData.phone,
        role: 'Student',
        isEmailVerified: true,
        isPhoneVerified: true,
        isIdentityVerified: true,
        collegeId: `COLLEGE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        collegeName: studentData.university,
        yearOfStudy: studentData.yearOfStudy,
        city: studentData.preferredLocation,
        state: 'India',
        preferences: {
          roomTypePreference: ['single', 'shared'],
          budgetMin: 5000,
          budgetMax: 20000,
          locationPreferences: [studentData.preferredLocation],
          amenityPreferences: ['wifi', 'security'],
        },
        verification: {
          status: 'verified',
          verifiedAt: new Date(),
        },
        savedProperties: [],
      });

      createdStudents.push(student);
      log.success(`Created student: ${studentData.name} (${studentData.email})`);
    } catch (error: any) {
      log.error(`Error creating student ${studentData.name}: ${error.message}`);
    }
  }

  return createdStudents;
}

async function createDemoOwners() {
  log.section('🏠 Creating Demo Owners...');

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  const createdOwners: any[] = [];

  for (let i = 0; i < demoOwners.length; i++) {
    const ownerData = demoOwners[i];
    try {
      // Generate valid GST number format: 22AAAAA0000A1Z5
      const gstNumber = `07${ownerData.name.substring(0, 5).toUpperCase().padEnd(5, 'X')}${(1000 + i).toString().padStart(4, '0')}A1Z${i}`;

      // Create owner (which extends User via discriminator)
      const owner = await Owner.create({
        email: ownerData.email,
        password: hashedPassword,
        fullName: ownerData.name,
        phone: ownerData.phone,
        role: 'Owner',
        isEmailVerified: true,
        isPhoneVerified: true,
        isIdentityVerified: true,
        businessName: `${ownerData.name}'s Properties`,
        businessType: 'individual',
        gstNumber: gstNumber,
        city: 'Delhi',
        state: 'Delhi',
        address: {
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
        },
        verification: {
          status: 'verified',
          digilockerLinked: false,
          verificationDocuments: [],
          verifiedAt: new Date(),
        },
        properties: [],
        stats: {
          totalProperties: 0,
          activeListings: 0,
          totalBookings: 0,
          averageRating: 4.5 + Math.random() * 0.5,
          responseTime: 2,
        },
      });

      createdOwners.push(owner);
      log.success(`Created owner: ${ownerData.name} (${ownerData.email})`);
    } catch (error: any) {
      log.error(`Error creating owner ${ownerData.name}: ${error.message}`);
    }
  }

  return createdOwners;
}

async function createDemoRooms(owners: any[]) {
  log.section('🏘️  Creating Demo Rooms...');

  const createdRooms: any[] = [];

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
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
          'https://images.unsplash.com/photo-1540518614846-7eded433c457',
        ],
        verified: true,
      });

      // Update owner's properties
      await Owner.findByIdAndUpdate(owner._id, {
        $push: { properties: room._id },
      });

      createdRooms.push(room);
      log.success(`Created room: ${roomData.title}`);
    } catch (error: any) {
      log.error(`Error creating room ${roomData.title}: ${error.message}`);
    }
  }

  return createdRooms;
}

async function createDemoBookings(students: any[], rooms: any[]) {
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
    } catch (error: any) {
      log.error(`Error creating booking: ${error.message}`);
    }
  }
}

async function createDemoReviews(students: any[], rooms: any[]) {
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
    } catch (error: any) {
      log.error(`Error creating review: ${error.message}`);
    }
  }
}

async function printSummary(students: any[], owners: any[], rooms: any[]) {
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
${students.map((s: any) => `  • ${s.email} / ${DEMO_PASSWORD}`).join('\n')}

${colors.blue}Owners:${colors.reset}
${owners.map((o: any) => `  • ${o.email} / ${DEMO_PASSWORD}`).join('\n')}

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

    // Close connection
    await mongoose.connection.close();
    log.info('Database connection closed');

    process.exit(0);
  } catch (error: any) {
    log.error(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Run the script
main();
