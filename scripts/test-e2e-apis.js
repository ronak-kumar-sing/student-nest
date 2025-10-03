#!/usr/bin/env node

/**
 * StudentNest End-to-End API Testing
 *
 * This script tests the complete API workflow with authentication
 * Run with: node scripts/test-e2e-apis.js
 */

const baseUrl = 'http://localhost:3000';

// Test accounts (matching our seeded data)
const testAccounts = {
  student: {
    email: 'student1@test.com',
    password: 'Test123@',
    name: 'Rahul Sharma'
  },
  owner: {
    email: 'owner1@test.com',
    password: 'Test123@',
    name: 'Rajesh Kumar'
  }
};

let tokens = {
  student: null,
  owner: null
};

let testData = {
  roomId: null,
  bookingId: null,
  meetingId: null,
  reviewId: null
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

// Test authentication
async function testAuthentication() {
  console.log('\n🔐 Testing Authentication...');

  // Login as student
  const studentLogin = await makeRequest('POST', '/api/auth/login', {
    identifier: 'student1@test.com',
    password: 'Test123@',
    role: 'student'
  });

  if (studentLogin.success && (studentLogin.data.token || studentLogin.data.accessToken)) {
    tokens.student = studentLogin.data.token || studentLogin.data.accessToken;
    console.log(`✅ Student login successful: ${testAccounts.student.name}`);
  } else {
    console.log(`❌ Student login failed:`, studentLogin.data?.error || 'Unknown error');
    console.log('   Response:', JSON.stringify(studentLogin.data, null, 2));
    return false;
  }

  // Test owner login
  const ownerLogin = await makeRequest('POST', '/api/auth/login', {
    identifier: testAccounts.owner.email,
    password: testAccounts.owner.password,
    role: 'owner'
  });

  if (ownerLogin.success && (ownerLogin.data.token || ownerLogin.data.accessToken)) {
    tokens.owner = ownerLogin.data.token || ownerLogin.data.accessToken;
    console.log(`✅ Owner login successful: ${testAccounts.owner.name}`);
  } else {
    console.log(`❌ Owner login failed:`, ownerLogin.data?.error || 'Unknown error');
    console.log('   Response:', JSON.stringify(ownerLogin.data, null, 2));
    return false;
  }

  return true;
}

// Test room listing
async function testRoomListing() {
  console.log('\n🏠 Testing Room Listing...');

  const roomList = await makeRequest('GET', '/api/rooms?limit=10');

  if (roomList.success) {
    const rooms = roomList.data.data?.rooms || [];
    console.log(`✅ Room listing successful: Found ${rooms.length} rooms`);

    if (rooms.length > 0) {
      testData.roomId = rooms[0].id;
      console.log(`   📝 Using room for testing: ${rooms[0].title}`);
    }

    return rooms.length > 0;
  } else {
    console.log(`❌ Room listing failed:`, roomList.data?.error || 'Unknown error');
    return false;
  }
}

// Test room details
async function testRoomDetails() {
  console.log('\n🏨 Testing Room Details...');

  if (!testData.roomId) {
    console.log('❌ No room ID available for testing');
    return false;
  }

  const roomDetails = await makeRequest('GET', `/api/rooms/${testData.roomId}`);

  if (roomDetails.success) {
    const room = roomDetails.data.data;
    console.log(`✅ Room details successful: ${room?.title || 'Room found'}`);
    return true;
  } else {
    console.log(`❌ Room details failed:`, roomDetails.data?.error || 'Unknown error');
    return false;
  }
}

// Test dashboard
async function testDashboard() {
  console.log('\n📊 Testing Dashboards...');

  // Test student dashboard
  const studentDashboard = await makeRequest('GET', '/api/dashboard', null, tokens.student);

  if (studentDashboard.success) {
    console.log('✅ Student dashboard successful');
  } else {
    console.log('❌ Student dashboard failed:', studentDashboard.data?.error);
  }

  // Test owner dashboard
  const ownerDashboard = await makeRequest('GET', '/api/dashboard', null, tokens.owner);

  if (ownerDashboard.success) {
    console.log('✅ Owner dashboard successful');
  } else {
    console.log('❌ Owner dashboard failed:', ownerDashboard.data?.error);
  }

  return studentDashboard.success && ownerDashboard.success;
}

// Test booking creation
async function testBookingCreation() {
  console.log('\n📅 Testing Booking Creation...');

  if (!testData.roomId) {
    console.log('❌ No room ID available for booking test');
    return false;
  }

  // Calculate future date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const moveInDate = tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD

  const bookingData = {
    roomId: testData.roomId,
    moveInDate: moveInDate,
    duration: 6,
    agreementType: 'monthly',
    notes: 'Test booking from API test'
  };

  const booking = await makeRequest('POST', '/api/bookings', bookingData, tokens.student);

  if (booking.success) {
    testData.bookingId = booking.data.data?.bookingId;
    console.log('✅ Booking creation successful');
    return true;
  } else {
    console.log('❌ Booking creation failed:', booking.data?.error);
    return false;
  }
}

// Test meeting scheduling
async function testMeetingScheduling() {
  console.log('\n🤝 Testing Meeting Scheduling...');

  if (!testData.roomId) {
    console.log('❌ No room ID available for meeting test');
    return false;
  }

  // First get room details to get owner ID
  const roomDetails = await makeRequest('GET', `/api/rooms/${testData.roomId}`);
  if (!roomDetails.success) {
    console.log('❌ Could not get room details for meeting');
    return false;
  }

  const ownerId = roomDetails.data.data?.owner?.id;
  if (!ownerId) {
    console.log('❌ No owner ID found for meeting');
    return false;
  }

  // Calculate future dates
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  dayAfter.setHours(14, 0, 0, 0);

  const meetingData = {
    propertyId: testData.roomId,
    ownerId: ownerId,
    preferredDates: [
      tomorrow.toISOString(),
      dayAfter.toISOString()
    ],
    meetingType: 'physical',
    notes: 'Test meeting from API test'
  };

  const meeting = await makeRequest('POST', '/api/meetings', meetingData, tokens.student);

  if (meeting.success) {
    testData.meetingId = meeting.data.data?.meetingId;
    console.log('✅ Meeting scheduling successful');
    return true;
  } else {
    console.log('❌ Meeting scheduling failed:', meeting.data?.error);
    return false;
  }
}

// Test review submission
async function testReviewSubmission() {
  console.log('\n⭐ Testing Review Submission...');

  if (!testData.roomId) {
    console.log('❌ No room ID available for review test');
    return false;
  }

  const reviewData = {
    propertyId: testData.roomId,
    overallRating: 4,
    categories: {
      cleanliness: 4,
      location: 5,
      facilities: 4,
      owner: 5,
      value: 4
    },
    comment: 'Great place to stay! The owner is very cooperative and the location is excellent.',
    stayDuration: '3 months'
  };

  const review = await makeRequest('POST', '/api/reviews', reviewData, tokens.student);

  if (review.success) {
    testData.reviewId = review.data.data?.reviewId;
    console.log('✅ Review submission successful');
    return true;
  } else {
    console.log('❌ Review submission failed:', review.data?.error);
    // Don't fail the test if review already exists
    if (review.data?.error?.includes('already reviewed')) {
      console.log('   ℹ️  Review already exists - this is expected');
      return true;
    }
    return false;
  }
}

// Test room sharing
async function testRoomSharing() {
  console.log('\n🏠 Testing Room Sharing...');

  if (!testData.roomId) {
    console.log('❌ No room ID available for room sharing test');
    return false;
  }

  const sharingData = {
    propertyId: testData.roomId,
    maxParticipants: 2,
    description: 'Looking for a roommate to share this amazing room!',
    costSharing: {
      monthlyRent: 15000,
      securityDeposit: 20000,
      maintenanceCharges: 2000
    },
    requirements: {
      gender: 'any',
      ageRange: { min: 18, max: 25 },
      preferences: ['non-smoker', 'student']
    },
    roomConfiguration: {
      totalBeds: 2,
      bedsAvailable: 1,
      hasPrivateBathroom: true,
      hasSharedKitchen: true
    },
    availableFrom: '2025-10-04' // Tomorrow
  };

  const sharing = await makeRequest('POST', '/api/room-sharing', sharingData, tokens.student);

  if (sharing.success) {
    console.log('✅ Room sharing creation successful');
    return true;
  } else {
    console.log('❌ Room sharing creation failed:', sharing.data?.error);
    // Don't fail if already exists
    if (sharing.data?.error?.includes('already have')) {
      console.log('   ℹ️  Room sharing already exists - this is expected');
      return true;
    }
    return false;
  }
}

// Test error handling
async function testErrorHandling() {
  console.log('\n🚫 Testing Error Handling...');

  let passedTests = 0;
  const totalTests = 4;

  // Test invalid endpoint
  const invalidEndpoint = await makeRequest('GET', '/api/invalid-endpoint');
  console.log(`   Debug - Invalid endpoint status: ${invalidEndpoint.status}`);
  if (invalidEndpoint.status === 404) {
    console.log('✅ Invalid endpoint returns 404');
    passedTests++;
  } else {
    console.log('❌ Invalid endpoint handling failed');
  }

  // Test unauthorized access
  const unauthorizedAccess = await makeRequest('GET', '/api/dashboard');
  if (unauthorizedAccess.status === 401) {
    console.log('✅ Unauthorized access returns 401');
    passedTests++;
  } else {
    console.log('❌ Unauthorized access handling failed');
  }

  // Test invalid room ID
  const invalidRoom = await makeRequest('GET', '/api/rooms/invalid-id');
  if (invalidRoom.status === 404 || invalidRoom.status === 400) {
    console.log('✅ Invalid room ID handled properly');
    passedTests++;
  } else {
    console.log('❌ Invalid room ID handling failed');
  }

  // Test invalid login
  const invalidLogin = await makeRequest('POST', '/api/auth/login', {
    identifier: 'invalid@test.com',
    password: 'wrongpassword'
  });
  if (!invalidLogin.success) {
    console.log('✅ Invalid login handled properly');
    passedTests++;
  } else {
    console.log('❌ Invalid login handling failed');
  }

  return passedTests === totalTests;
}

// Run all tests
async function runEndToEndTests() {
  console.log('🚀 StudentNest End-to-End API Testing');
  console.log('=====================================');
  console.log('⚠️  Make sure the server is running: npm run dev');
  console.log('⚠️  Make sure demo data is seeded: node scripts/seed-demo-data.js');

  const tests = [
    { name: 'Authentication', fn: testAuthentication, critical: true },
    { name: 'Room Listing', fn: testRoomListing, critical: true },
    { name: 'Room Details', fn: testRoomDetails, critical: false },
    { name: 'Dashboard', fn: testDashboard, critical: true },
    { name: 'Booking Creation', fn: testBookingCreation, critical: false },
    { name: 'Meeting Scheduling', fn: testMeetingScheduling, critical: false },
    { name: 'Review Submission', fn: testReviewSubmission, critical: false },
    { name: 'Room Sharing', fn: testRoomSharing, critical: false },
    { name: 'Error Handling', fn: testErrorHandling, critical: true }
  ];

  let passed = 0;
  let critical_passed = 0;
  let critical_total = tests.filter(t => t.critical).length;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
        if (test.critical) critical_passed++;
      } else if (test.critical) {
        console.log(`💥 Critical test failed: ${test.name}`);
        break; // Stop if critical test fails
      }
    } catch (error) {
      console.log(`💥 Test error in ${test.name}:`, error.message);
      if (test.critical) break;
    }
  }

  console.log('\n📊 TEST RESULTS');
  console.log('===============');
  console.log(`✅ Passed: ${passed}/${tests.length}`);
  console.log(`🔥 Critical: ${critical_passed}/${critical_total}`);

  if (critical_passed === critical_total) {
    console.log('🎉 All critical tests passed! Your API is working properly.');

    if (passed === tests.length) {
      console.log('🏆 PERFECT! All tests passed. Your backend is production ready.');
    } else {
      console.log(`⚠️  ${tests.length - passed} non-critical tests failed. Check implementation.`);
    }
  } else {
    console.log('❌ Some critical tests failed. Check your server and database.');
  }

  console.log('\n💡 NEXT STEPS:');
  console.log('1. Fix any failed tests');
  console.log('2. Test with frontend integration');
  console.log('3. Deploy to production');
  console.log('\n🔗 API ENDPOINTS TESTED:');
  console.log('• POST /api/auth/login - Authentication');
  console.log('• GET /api/rooms - Room listing');
  console.log('• GET /api/rooms/[id] - Room details');
  console.log('• GET /api/dashboard - User dashboard');
  console.log('• POST /api/bookings - Create booking');
  console.log('• POST /api/meetings - Schedule meeting');
  console.log('• POST /api/reviews - Submit review');
  console.log('• POST /api/room-sharing - Create sharing');
}

// Check if we're running this script directly
if (require.main === module) {
  runEndToEndTests().catch(console.error);
}

module.exports = runEndToEndTests;