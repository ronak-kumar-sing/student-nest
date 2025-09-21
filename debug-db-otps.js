#!/usr/bin/env node

/**
 * Debug Database OTP Records
 * This script checks OTP records directly in the database
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const OTP_SCHEMA = new mongoose.Schema({
  identifier: { type: String, required: true, index: true },
  type: { type: String, enum: ['email', 'phone'], required: true },
  code: { type: String, required: true },
  purpose: { type: String, enum: ['verification', 'password-reset'], default: 'verification' },
  attempts: { type: Number, default: 0, max: 3 },
  isUsed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 5 * 60 * 1000) }
}, {
  timestamps: true
});

const OTP = mongoose.model('OTP', OTP_SCHEMA);

async function debugDatabaseOTPs() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check recent OTP records
    console.log('📋 Recent OTP Records:');
    const recentOTPs = await OTP.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    if (recentOTPs.length === 0) {
      console.log('❌ No OTP records found in database');
    } else {
      recentOTPs.forEach((otp, index) => {
        console.log(`\n${index + 1}. OTP Record:`);
        console.log(`   ID: ${otp._id}`);
        console.log(`   Identifier: ${otp.identifier}`);
        console.log(`   Type: ${otp.type}`);
        console.log(`   Code: ${otp.code}`);
        console.log(`   Purpose: ${otp.purpose}`);
        console.log(`   Attempts: ${otp.attempts}`);
        console.log(`   Used: ${otp.isUsed}`);
        console.log(`   Expires: ${otp.expiresAt}`);
        console.log(`   Created: ${otp.createdAt}`);
        console.log(`   Expired: ${otp.expiresAt < new Date() ? 'YES' : 'NO'}`);
      });
    }

    // Check specific phone number
    console.log('\n📱 Phone OTPs for +919876543210:');
    const phoneOTPs = await OTP.find({
      identifier: '+919876543210',
      type: 'phone'
    }).sort({ createdAt: -1 }).lean();

    if (phoneOTPs.length === 0) {
      console.log('❌ No phone OTPs found for +919876543210');
    } else {
      phoneOTPs.forEach((otp, index) => {
        console.log(`\n${index + 1}. Phone OTP:`);
        console.log(`   Code: ${otp.code}`);
        console.log(`   Purpose: ${otp.purpose}`);
        console.log(`   Used: ${otp.isUsed}`);
        console.log(`   Expired: ${otp.expiresAt < new Date() ? 'YES' : 'NO'}`);
        console.log(`   Created: ${otp.createdAt}`);
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }
}

// Run the debug
debugDatabaseOTPs();