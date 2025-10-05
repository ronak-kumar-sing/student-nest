#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function createDemoUserAndGetToken() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!\n');

    // Define User schema
    const userSchema = new mongoose.Schema({
      fullName: String,
      email: String,
      phone: String,
      password: String,
      role: String,
      isVerified: { type: Boolean, default: false },
      emailVerified: { type: Boolean, default: false },
      phoneVerified: { type: Boolean, default: false }
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', userSchema);

    // Check if demo student exists
    let student = await User.findOne({ email: 'demo.student@test.com' });

    if (!student) {
      console.log('Creating demo student...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('Demo@123', 10);

      student = await User.create({
        fullName: 'Demo Student',
        email: 'demo.student@test.com',
        phone: '+919999999991',
        password: hashedPassword,
        role: 'student',
        isVerified: true,
        emailVerified: true,
        phoneVerified: true
      });
      console.log('✅ Demo student created');
    } else {
      console.log('✅ Demo student already exists');
    }

    // Check if demo owner exists
    let owner = await User.findOne({ email: 'demo.owner@test.com' });

    if (!owner) {
      console.log('Creating demo owner...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('Demo@123', 10);

      owner = await User.create({
        fullName: 'Demo Owner',
        email: 'demo.owner@test.com',
        phone: '+919999999992',
        password: hashedPassword,
        role: 'owner',
        isVerified: true,
        emailVerified: true,
        phoneVerified: true
      });
      console.log('✅ Demo owner created');
    } else {
      console.log('✅ Demo owner already exists');
    }

    console.log('\n📝 Demo Credentials:');
    console.log('━'.repeat(50));
    console.log('\nStudent:');
    console.log('  Email: demo.student@test.com');
    console.log('  Password: Demo@123');
    console.log('\nOwner:');
    console.log('  Email: demo.owner@test.com');
    console.log('  Password: Demo@123');
    console.log('\n' + '━'.repeat(50));

    // Now try to get tokens via API
    console.log('\n🔑 Getting authentication tokens...\n');

    const studentLogin = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'demo.student@test.com',
        password: 'Demo@123',
        role: 'student'
      })
    });
    const studentData = await studentLogin.json();

    const ownerLogin = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'demo.owner@test.com',
        password: 'Demo@123',
        role: 'owner'
      })
    });
    const ownerData = await ownerLogin.json();

    if (studentData.success) {
      const studentToken = studentData.data?.accessToken || studentData.accessToken;
      console.log('✅ Student Token:');
      console.log(`   ${studentToken}\n`);

      // Save to file
      require('fs').writeFileSync('.student-token', studentToken);
    } else {
      console.log('❌ Student login failed:', studentData.error);
    }

    if (ownerData.success) {
      const ownerToken = ownerData.data?.accessToken || ownerData.accessToken;
      console.log('✅ Owner Token:');
      console.log(`   ${ownerToken}\n`);

      // Save to file
      require('fs').writeFileSync('.owner-token', ownerToken);
    } else {
      console.log('❌ Owner login failed:', ownerData.error);
    }

    console.log('💾 Tokens saved to .student-token and .owner-token files\n');

    await mongoose.disconnect();
    console.log('✅ Done!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createDemoUserAndGetToken();
