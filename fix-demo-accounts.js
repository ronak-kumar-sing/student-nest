const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://ronakkumar20062006:WcQd5ZksggAwO1oT@cluster0.969t4yr.mongodb.net/student-nest?retryWrites=true&w=majority&appName=Cluster0');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Simple fix: Delete and recreate demo accounts in the users collection
const fixDemoAccounts = async () => {
  try {
    await connectDB();

    console.log('=== FIXING DEMO ACCOUNTS ===\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Delete any existing demo users in users collection
    await usersCollection.deleteMany({ email: { $in: ['demo@student.test', 'demo@owner.test'] } });

    // Also clean up by phone numbers to avoid conflicts
    await usersCollection.deleteMany({ phone: { $in: ['+918888888888', '+917777777777'] } });

    // Create demo student in users collection
    const studentPasswordHash = await bcrypt.hash('DemoStudent123!', 12);
    const demoStudent = {
      email: 'demo@student.test',
      phone: '+918888888888',
      password: studentPasswordHash,
      fullName: 'Demo Student',
      role: 'student',
      __t: 'Student', // Discriminator key
      collegeId: 'DEMO_COLLEGE_001',
      collegeName: 'Demo University',
      course: 'Computer Science Engineering',
      yearOfStudy: 2,
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdentityVerified: false,
      identityVerificationRequired: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create demo owner in users collection
    const ownerPasswordHash = await bcrypt.hash('DemoOwner123!', 12);
    const demoOwner = {
      email: 'demo@owner.test',
      phone: '+917777777777',
      password: ownerPasswordHash,
      fullName: 'Demo Owner',
      role: 'owner',
      __t: 'Owner', // Discriminator key
      businessName: 'Demo Properties',
      businessType: 'individual',
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdentityVerified: false,
      identityVerificationRequired: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert both accounts
    await usersCollection.insertOne(demoStudent);
    await usersCollection.insertOne(demoOwner);

    console.log('✅ Demo accounts created in users collection!');
    console.log('');
    console.log('🎓 STUDENT DEMO:');
    console.log('  Email: demo@student.test');
    console.log('  Password: DemoStudent123!');
    console.log('  Login: http://localhost:3000/student/login');
    console.log('');
    console.log('🏠 OWNER DEMO:');
    console.log('  Email: demo@owner.test');
    console.log('  Phone: +917777777777');
    console.log('  Password: DemoOwner123!');
    console.log('  Login: http://localhost:3000/owner/login');

    // Test the passwords
    console.log('\n🔐 Testing passwords...');
    const studentTest = await bcrypt.compare('DemoStudent123!', studentPasswordHash);
    const ownerTest = await bcrypt.compare('DemoOwner123!', ownerPasswordHash);

    console.log('Student password test:', studentTest ? '✅' : '❌');
    console.log('Owner password test:', ownerTest ? '✅' : '❌');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixDemoAccounts();