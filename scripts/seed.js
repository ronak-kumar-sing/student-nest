import { config } from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env.local') });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../src/lib/db/connection.js';
import Student from '../src/lib/models/Student.js';
import Owner from '../src/lib/models/Owner.js';

// Test data
const testStudents = [
  {
    fullName: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+919876543210',
    password: 'Student123!',
    collegeId: 'CS2024001',
    collegeName: 'Indian Institute of Technology, Delhi',
    course: 'Computer Science Engineering',
    yearOfStudy: 3,
    isEmailVerified: true,
    isPhoneVerified: true,
    preferences: {
      budgetRange: { min: 8000, max: 15000 },
      location: 'New Delhi',
      roomType: 'single',
      amenities: ['wifi', 'ac', 'laundry', 'kitchen', 'security']
    }
  },
  {
    fullName: 'Rahul Kumar',
    email: 'rahul.kumar@gmail.com',
    phone: '+919876543211',
    password: 'Student123!',
    collegeId: 'CS2024002',
    collegeName: 'Jawaharlal Nehru University',
    course: 'Information Technology',
    yearOfStudy: 2,
    isEmailVerified: true,
    isPhoneVerified: true,
    preferences: {
      budgetRange: { min: 6000, max: 12000 },
      location: 'South Delhi',
      roomType: 'shared',
      amenities: ['wifi', 'kitchen', 'security']
    }
  },
  {
    fullName: 'Anita Singh',
    email: 'anita.singh@gmail.com',
    phone: '+919876543212',
    password: 'Student123!',
    collegeId: 'CS2024003',
    collegeName: 'Delhi University',
    course: 'Electronics Engineering',
    yearOfStudy: 4,
    isEmailVerified: true,
    isPhoneVerified: true,
    preferences: {
      budgetRange: { min: 10000, max: 18000 },
      location: 'North Delhi',
      roomType: 'single',
      amenities: ['wifi', 'ac', 'laundry', 'gym', 'security']
    }
  },
  {
    fullName: 'Amit Patel',
    email: 'amit.patel@gmail.com',
    phone: '+919876543213',
    password: 'Student123!',
    collegeId: 'CS2024004',
    collegeName: 'Netaji Subhas Institute of Technology',
    course: 'Mechanical Engineering',
    yearOfStudy: 1,
    isEmailVerified: true,
    isPhoneVerified: true,
    preferences: {
      budgetRange: { min: 5000, max: 10000 },
      location: 'West Delhi',
      roomType: 'shared',
      amenities: ['wifi', 'kitchen', 'security', 'laundry']
    }
  },
  {
    fullName: 'Neha Gupta',
    email: 'neha.gupta@gmail.com',
    phone: '+919876543214',
    password: 'Student123!',
    collegeId: 'CS2024005',
    collegeName: 'Indira Gandhi Delhi Technical University for Women',
    course: 'Software Engineering',
    yearOfStudy: 2,
    isEmailVerified: true,
    isPhoneVerified: true,
    preferences: {
      budgetRange: { min: 8000, max: 14000 },
      location: 'East Delhi',
      roomType: 'single',
      amenities: ['wifi', 'ac', 'security', 'study_room']
    }
  }
];

const testOwners = [
  {
    fullName: 'Vikram Patel',
    email: 'vikram.patel@gmail.com',
    phone: '+918765432109',
    password: 'Owner123!',
    businessName: 'Patel Properties & Accommodations',
    businessType: 'company',
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true,
    address: {
      street: 'Shop No. 15, Sector 18',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      country: 'India'
    },
    verification: {
      status: 'verified',
      aadhaarNumber: '123456789012',
      digilockerLinked: true,
      digilockerData: {
        name: 'Vikram Patel',
        dob: '1985-03-15',
        gender: 'M',
        address: 'Shop No. 15, Sector 18, Noida, Uttar Pradesh - 201301'
      },
      verifiedAt: new Date()
    },
    totalProperties: 12,
    totalBookings: 85,
    averageRating: 4.5,
    responseTime: 2
  },
  {
    fullName: 'Sunita Agarwal',
    email: 'sunita.agarwal@gmail.com',
    phone: '+918765432108',
    password: 'Owner123!',
    businessName: 'Agarwal Student Housing',
    businessType: 'individual',
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true,
    address: {
      street: 'B-45, Lajpat Nagar',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110024',
      country: 'India'
    },
    verification: {
      status: 'verified',
      aadhaarNumber: '123456789013',
      digilockerLinked: true,
      digilockerData: {
        name: 'Sunita Agarwal',
        dob: '1978-08-22',
        gender: 'F',
        address: 'B-45, Lajpat Nagar, New Delhi, Delhi - 110024'
      },
      verifiedAt: new Date()
    },
    totalProperties: 8,
    totalBookings: 56,
    averageRating: 4.2,
    responseTime: 4
  },
  {
    fullName: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    phone: '+918765432107',
    password: 'Owner123!',
    businessName: 'Kumar Residency',
    businessType: 'individual',
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: true,
    address: {
      street: 'C-23, Rohini Sector 15',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110085',
      country: 'India'
    },
    verification: {
      status: 'verified',
      aadhaarNumber: '123456789014',
      digilockerLinked: true,
      digilockerData: {
        name: 'Rajesh Kumar',
        dob: '1982-11-10',
        gender: 'M',
        address: 'C-23, Rohini Sector 15, New Delhi, Delhi - 110085'
      },
      verifiedAt: new Date()
    },
    totalProperties: 15,
    totalBookings: 120,
    averageRating: 4.7,
    responseTime: 1
  },
  {
    fullName: 'Meera Joshi',
    email: 'meera.joshi@gmail.com',
    phone: '+918765432106',
    password: 'Owner123!',
    businessName: 'Joshi Accommodations',
    businessType: 'individual',
    isEmailVerified: true,
    isPhoneVerified: true,
    isActive: false, // Pending verification
    address: {
      street: 'D-67, Vasant Kunj',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110070',
      country: 'India'
    },
    verification: {
      status: 'pending',
      aadhaarNumber: '123456789015',
      digilockerLinked: false
    },
    totalProperties: 0,
    totalBookings: 0,
    averageRating: 0,
    responseTime: 24
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Student.deleteMany({});
    await Owner.deleteMany({});

    // Hash passwords before inserting
    console.log('🔐 Hashing passwords...');
    for (let student of testStudents) {
      student.password = await bcrypt.hash(student.password, 12);
    }

    for (let owner of testOwners) {
      owner.password = await bcrypt.hash(owner.password, 12);
    }

    // Insert students
    console.log('👨‍🎓 Inserting students...');
    const insertedStudents = await Student.insertMany(testStudents);
    console.log(`✅ Inserted ${insertedStudents.length} students`);

    // Insert owners
    console.log('🏠 Inserting owners...');
    const insertedOwners = await Owner.insertMany(testOwners);
    console.log(`✅ Inserted ${insertedOwners.length} owners`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Test Accounts Summary:');
    console.log('\n👨‍🎓 STUDENTS:');
    testStudents.forEach((student, index) => {
      console.log(`${index + 1}. ${student.fullName}`);
      console.log(`   Email: ${student.email}`);
      console.log(`   Phone: ${student.phone}`);
      console.log(`   Password: Student123!`);
      console.log(`   College: ${student.collegeName}`);
      console.log();
    });

    console.log('🏠 OWNERS:');
    testOwners.forEach((owner, index) => {
      console.log(`${index + 1}. ${owner.fullName}`);
      console.log(`   Email: ${owner.email}`);
      console.log(`   Phone: ${owner.phone}`);
      console.log(`   Password: Owner123!`);
      console.log(`   Business: ${owner.businessName}`);
      console.log(`   Status: ${owner.verification.status}`);
      console.log();
    });

    console.log('🔑 All accounts use the same password format:');
    console.log('   Students: Student123!');
    console.log('   Owners: Owner123!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();