#!/usr/bin/env node

// Test profile API after fixing localStorage key mismatch
const API_BASE = 'http://localhost:3000';

async function testProfileAPI() {
  console.log('🧪 Testing Profile API with Authentication\n');

  try {
    // Test 1: Login to get a fresh token
    console.log('1. Logging in as student...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'priya.sharma@gmail.com',
        password: 'Student123!',
        role: 'student'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginData);
      return;
    }

    console.log('✅ Login successful');
    const token = loginData.accessToken;
    console.log('🔑 Token obtained:', token.substring(0, 50) + '...');

    // Test 2: Call student profile API
    console.log('\n2. Testing student profile API...');
    const profileResponse = await fetch(`${API_BASE}/api/profile/student`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const profileData = await profileResponse.json();
    console.log('📊 Profile Response Status:', profileResponse.status);
    
    if (profileResponse.ok) {
      console.log('✅ Profile API Success');
      console.log('📋 Response structure:');
      console.log('  - success:', profileData.success);
      console.log('  - data.profile:', profileData.data?.profile ? 'Present' : 'Missing');
      console.log('  - data.verificationStatus:', profileData.data?.verificationStatus ? 'Present' : 'Missing');
      console.log('  - data.activityStats:', profileData.data?.activityStats ? 'Present' : 'Missing');
      
      if (profileData.data?.profile) {
        console.log('👤 Profile Info:');
        console.log('  - Name:', profileData.data.profile.fullName);
        console.log('  - Email:', profileData.data.profile.email);
        console.log('  - College:', profileData.data.profile.collegeName);
        console.log('  - Completeness:', profileData.data.profile.profileCompleteness + '%');
      }
    } else {
      console.log('❌ Profile API Failed:', profileData);
    }

    // Test 3: Test owner profile
    console.log('\n3. Logging in as owner...');
    const ownerLoginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'vikram.patel@gmail.com',
        password: 'Owner123!',
        role: 'owner'
      })
    });

    const ownerLoginData = await ownerLoginResponse.json();
    if (ownerLoginResponse.ok) {
      const ownerToken = ownerLoginData.accessToken;
      
      console.log('✅ Owner login successful');
      console.log('\n4. Testing owner profile API...');
      
      const ownerProfileResponse = await fetch(`${API_BASE}/api/profile/owner`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ownerToken}`,
          'Content-Type': 'application/json'
        }
      });

      const ownerProfileData = await ownerProfileResponse.json();
      console.log('📊 Owner Profile Status:', ownerProfileResponse.status);
      
      if (ownerProfileResponse.ok) {
        console.log('✅ Owner Profile API Success');
        console.log('👤 Owner Info:');
        console.log('  - Name:', ownerProfileData.data?.fullName);
        console.log('  - Business:', ownerProfileData.data?.businessName);
        console.log('  - Verified:', ownerProfileData.data?.isVerified);
        console.log('  - Properties:', ownerProfileData.data?.totalProperties);
      } else {
        console.log('❌ Owner Profile API Failed:', ownerProfileData);
      }
    }

  } catch (error) {
    console.log('❌ Test Error:', error.message);
  }

  console.log('\n🏁 Profile API Test Complete');
}

testProfileAPI();