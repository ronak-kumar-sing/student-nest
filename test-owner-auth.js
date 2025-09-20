#!/usr/bin/env node

import jwt from 'jsonwebtoken';

// Test owner JWT token verification
async function testOwnerAuth() {
  console.log('🔐 Testing Owner Authentication\n');

  // Get fresh owner token
  const ownerLoginResponse = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: 'vikram.patel@gmail.com',
      password: 'Owner123!',
      role: 'owner'
    })
  });

  const ownerData = await ownerLoginResponse.json();
  console.log('Owner Login Status:', ownerLoginResponse.status);

  if (!ownerData.accessToken) {
    console.log('❌ No access token received');
    return;
  }

  const token = ownerData.accessToken;
  console.log('🔑 Token received:', token.substring(0, 50) + '...');

  // Decode token to see contents
  const decoded = jwt.decode(token);
  console.log('📋 Token payload:', decoded);
  console.log('Role in token:', decoded.role);
  console.log('Role check (lowercase):', decoded.role?.toLowerCase());
  console.log('Should match "owner":', decoded.role?.toLowerCase() === 'owner');

  // Test profile endpoint
  console.log('\n🧪 Testing Owner Profile Endpoint...');
  const profileResponse = await fetch('http://localhost:3000/api/profile/owner', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  console.log('Profile Response Status:', profileResponse.status);
  const profileData = await profileResponse.json();
  console.log('Profile Response:', profileData);
}

testOwnerAuth().catch(console.error);