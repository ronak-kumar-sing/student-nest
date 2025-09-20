#!/usr/bin/env node

import jwt from 'jsonwebtoken';

// Test JWT token verification
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGNlYzIwOTRlZDM1OWNlZmVjNDIyNDciLCJlbWFpbCI6InByaXlhLnNoYXJtYUBnbWFpbC5jb20iLCJyb2xlIjoiU3R1ZGVudCIsImlzRW1haWxWZXJpZmllZCI6dHJ1ZSwiaXNQaG9uZVZlcmlmaWVkIjp0cnVlLCJpYXQiOjE3NTgzODU1OTUsImV4cCI6MTc1ODM4OTE5NSwiYXVkIjoic3R1ZGVudC1uZXN0LXVzZXJzIiwiaXNzIjoic3R1ZGVudC1uZXN0In0.avzYZVpTCWPBbCxLFJ0sAhEPC2IdnxcICSvnneJ8CoQ";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production";

console.log('🔐 JWT Token Analysis\n');
console.log('JWT_SECRET:', JWT_SECRET);
console.log('Token:', token.substring(0, 50) + '...\n');

try {
  // Decode without verification first
  const decoded = jwt.decode(token, { complete: true });
  console.log('✅ Token Decoded Successfully:');
  console.log('Header:', decoded.header);
  console.log('Payload:', decoded.payload);

  // Now verify with secret
  const verified = jwt.verify(token, JWT_SECRET);
  console.log('\n✅ Token Verified Successfully:');
  console.log('Verified Payload:', verified);

} catch (error) {
  console.log('❌ JWT Verification Failed:');
  console.log('Error:', error.message);
}