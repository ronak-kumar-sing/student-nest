#!/usr/bin/env node

// Generate a student token for testing the visiting schedule page

const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key'; // Default from jwt.js
const studentPayload = {
  userId: '68df662f77a7bd21b7e7e724', // Rahul Sharma's ID from the meeting data
  email: 'student1@test.com',
  role: 'Student',
  isEmailVerified: true,
  isPhoneVerified: true
};

const token = jwt.sign(studentPayload, JWT_SECRET, {
  expiresIn: '24h', // Valid for 24 hours
  issuer: 'student-nest',
  audience: 'student-nest-users'
});

console.log('Generated Student Token:');
console.log(token);
console.log('\nTo test the visiting schedule API:');
console.log(`curl -X GET "http://localhost:3000/api/meetings?type=sent" \\`);
console.log(`  -H "Authorization: Bearer ${token}"`);