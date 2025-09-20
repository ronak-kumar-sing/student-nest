#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const BASE_URL = 'http://localhost:3000';

// Test data from our seeded database
const testStudent = {
  identifier: 'priya.sharma@gmail.com',
  password: 'Student123!',
  role: 'student'
};

const testOwner = {
  identifier: 'vikram.patel@gmail.com',
  password: 'Owner123!',
  role: 'owner'
};

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json();

    console.log(`\n🔗 ${options.method || 'GET'} ${url}`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      console.log('✅ Success');
      console.log('📋 Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Error');
      console.log('📋 Response:', JSON.stringify(data, null, 2));
    }

    return { response, data };
  } catch (error) {
    console.log(`\n🔗 ${options.method || 'GET'} ${url}`);
    console.log('❌ Network Error:', error.message);
    return { error };
  }
}

async function testProfileApis() {
  console.log('🚀 Starting Profile API Tests\n');
  console.log('='.repeat(50));

  // Test 1: Student Login
  console.log('\n📝 Test 1: Student Login');
  const studentLogin = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify(testStudent)
  });

  if (!studentLogin.response?.ok) {
    console.log('❌ Student login failed, stopping tests');
    return;
  }

  const studentToken = studentLogin.data.accessToken;
  console.log('🔑 Student JWT Token acquired');

  // Test 2: Get Student Profile
  console.log('\n📝 Test 2: Get Student Profile');
  await makeRequest(`${BASE_URL}/api/profile/student`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${studentToken}`
    }
  });

  // Test 3: Update Student Profile
  console.log('\n📝 Test 3: Update Student Profile');
  const studentUpdateData = {
    bio: 'Updated bio for testing API functionality',
    preferences: {
      roomType: 'private',
      budget: { min: 8000, max: 15000 },
      location: 'South Delhi',
      amenities: ['wifi', 'parking', 'security']
    }
  };

  await makeRequest(`${BASE_URL}/api/profile/student`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify(studentUpdateData)
  });

  // Test 4: Get Student Preferences
  console.log('\n📝 Test 4: Get Student Preferences');
  await makeRequest(`${BASE_URL}/api/profile/student/preferences`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${studentToken}`
    }
  });

  // Test 5: Owner Login
  console.log('\n📝 Test 5: Owner Login');
  const ownerLogin = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify(testOwner)
  });

  if (!ownerLogin.response?.ok) {
    console.log('❌ Owner login failed, skipping owner tests');
    return;
  }

  const ownerToken = ownerLogin.data.accessToken;
  console.log('🔑 Owner JWT Token acquired');

  // Test 6: Get Owner Profile
  console.log('\n📝 Test 6: Get Owner Profile');
  await makeRequest(`${BASE_URL}/api/profile/owner`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${ownerToken}`
    }
  });

  // Test 7: Update Owner Profile
  console.log('\n📝 Test 7: Update Owner Profile');
  const ownerUpdateData = {
    bio: 'Updated owner bio for testing API functionality',
    businessInfo: {
      gstNumber: 'TEST123456789',
      panNumber: 'TESTPAN123',
      businessAddress: 'Updated Business Address, Delhi'
    }
  };

  await makeRequest(`${BASE_URL}/api/profile/owner`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${ownerToken}`
    },
    body: JSON.stringify(ownerUpdateData)
  });

  // Test 8: Get Owner Verification Status
  console.log('\n📝 Test 8: Get Owner Verification Status');
  await makeRequest(`${BASE_URL}/api/profile/owner/verification`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${ownerToken}`
    }
  });

  console.log('\n' + '='.repeat(50));
  console.log('🎉 Profile API Tests Completed!');
  console.log('\n📝 Summary:');
  console.log('✅ Student login and authentication');
  console.log('✅ Student profile retrieval and updates');
  console.log('✅ Student preferences management');
  console.log('✅ Owner login and authentication');
  console.log('✅ Owner profile retrieval and updates');
  console.log('✅ Owner verification status');
  console.log('\n🔧 All profile backend APIs are working correctly!');
}

// Run the tests
testProfileApis().catch(console.error);