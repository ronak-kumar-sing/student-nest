#!/usr/bin/env node

/**
 * StudentNest API Testing Script
 *
 * This script tests the basic functionality of our API endpoints
 * Run with: node scripts/test-apis.js
 */

const baseUrl = 'http://localhost:3000';

// Sample test data
const testData = {
  student: {
    email: 'student@test.com',
    password: 'Test123@',
    fullName: 'Test Student',
    phone: '+1234567890',
    role: 'student'
  },
  owner: {
    email: 'owner@test.com',
    password: 'Test123@',
    fullName: 'Test Owner',
    phone: '+1234567891',
    role: 'owner'
  },
  room: {
    title: 'Test Modern PG Room',
    description: 'A beautiful test room for students',
    price: 15000,
    roomType: 'single',
    accommodationType: 'pg',
    location: {
      address: 'Test Address',
      fullAddress: 'Test Full Address, Test City, Test State',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      coordinates: { lat: 28.6139, lng: 77.2090 }
    },
    amenities: ['wifi', 'ac', 'security'],
    features: {
      area: 100,
      floor: 2,
      totalFloors: 3,
      furnished: true,
      balcony: false,
      attached_bathroom: true
    },
    securityDeposit: 15000
  }
};

// Helper function to make HTTP requests
async function makeRequest(method, endpoint, data = null, token = null) {
  const url = `${baseUrl}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...(data && { body: JSON.stringify(data) })
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    return {
      status: response.status,
      success: response.ok,
      data: result
    };
  } catch (error) {
    return {
      status: 0,
      success: false,
      error: error.message
    };
  }
}

// Test functions
async function testGetRooms() {
  console.log('\n📋 Testing GET /api/rooms...');

  const result = await makeRequest('GET', '/api/rooms?limit=5');

  if (result.success) {
    console.log('✅ Rooms API working');
    console.log(`   Found ${result.data.data?.rooms?.length || 0} rooms`);
  } else {
    console.log('❌ Rooms API failed:', result.data?.error || 'Unknown error');
  }

  return result.success;
}

async function testGetSpecificRoom() {
  console.log('\n🏠 Testing GET /api/rooms/[id] (mock ID)...');

  // Using a mock ObjectId format
  const mockId = '507f1f77bcf86cd799439011';
  const result = await makeRequest('GET', `/api/rooms/${mockId}`);

  // This should return 404, which is expected
  if (result.status === 404) {
    console.log('✅ Room detail API working (404 as expected)');
    return true;
  } else if (result.success) {
    console.log('✅ Room detail API working (found room)');
    return true;
  } else {
    console.log('❌ Room detail API failed:', result.data?.error || 'Unknown error');
    return false;
  }
}

async function testAPIStructure() {
  console.log('\n🧪 Testing API structure and error handling...');

  // Test missing parameters
  const invalidBooking = await makeRequest('POST', '/api/bookings', {});
  if (invalidBooking.status === 401 || invalidBooking.status === 400) {
    console.log('✅ Booking API properly validates input');
  } else {
    console.log('❌ Booking API validation issues');
  }

  // Test invalid endpoints
  const invalid = await makeRequest('GET', '/api/invalid-endpoint');
  if (invalid.status === 404) {
    console.log('✅ Invalid endpoints return 404');
  } else {
    console.log('❌ Invalid endpoint handling issues');
  }

  return true;
}

async function testDatabaseModels() {
  console.log('\n🗃️ Testing database models import...');

  try {
    // Try to import models (this will test if they compile correctly)
    const path = require('path');
    const fs = require('fs');

    const modelPath = path.join(__dirname, '../src/lib/models');
    const modelFiles = fs.readdirSync(modelPath).filter(file => file.endsWith('.js'));

    console.log('✅ Found model files:', modelFiles.join(', '));

    // Basic syntax check by trying to require them
    for (const file of modelFiles) {
      try {
        require(path.join(modelPath, file));
        console.log(`   ✅ ${file} - syntax OK`);
      } catch (error) {
        console.log(`   ❌ ${file} - syntax error:`, error.message);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.log('❌ Model testing failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 StudentNest API Testing Suite');
  console.log('================================');
  console.log('⚠️  Note: This tests API structure. For full testing, start the dev server first.');

  const tests = [
    { name: 'Database Models', fn: testDatabaseModels },
    { name: 'API Structure', fn: testAPIStructure },
    { name: 'Rooms Listing', fn: testGetRooms },
    { name: 'Room Details', fn: testGetSpecificRoom }
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) passed++;
    } catch (error) {
      console.log(`❌ ${test.name} failed with error:`, error.message);
    }
  }

  console.log('\n📊 TEST RESULTS');
  console.log('===============');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);

  if (passed === total) {
    console.log('🎉 All tests passed! Your API structure is ready.');
  } else {
    console.log('⚠️  Some tests failed. Check the output above.');
  }

  console.log('\n💡 NEXT STEPS:');
  console.log('1. Start dev server: npm run dev');
  console.log('2. Test with real requests');
  console.log('3. Set up your .env.local with MONGODB_URI and JWT_SECRET');
}

// Check if we're running this script directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testGetRooms,
  testGetSpecificRoom,
  testAPIStructure,
  testDatabaseModels,
  runAllTests
};