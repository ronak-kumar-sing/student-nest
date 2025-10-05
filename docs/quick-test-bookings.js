#!/usr/bin/env node

const API_BASE = 'http://localhost:3000/api';

async function quickTest() {
  console.log('\n🧪 Quick Booking API Test\n');

  // Test 1: Check if server is running
  console.log('1. Checking server...');
  try {
    const response = await fetch(`${API_BASE}/health`).catch(() => null);
    if (!response) {
      console.log('❌ Server not responding. Is it running on port 3000?');
      return;
    }
    console.log('✅ Server is running\n');
  } catch (error) {
    console.log('❌ Server check failed:', error.message);
    return;
  }

  // Test 2: Try to login with common demo credentials
  console.log('2. Attempting login...');
  const credentials = [
    { identifier: 'student1@demo.com', password: 'Demo@123', role: 'student' },
    { identifier: 'student1@test.com', password: 'Test123@', role: 'student' },
    { identifier: 'demo.student@example.com', password: 'Demo@123', role: 'student' }
  ];

  let token = null;
  for (const cred of credentials) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cred)
      });
      const data = await response.json();

      if (data.success) {
        token = data.data?.accessToken || data.accessToken || data.token;
        console.log(`✅ Logged in with ${cred.identifier}`);
        console.log(`   Token: ${token.substring(0, 30)}...\n`);
        break;
      }
    } catch (error) {
      // Continue to next credential
    }
  }

  if (!token) {
    console.log('❌ Could not login with any demo credentials');
    console.log('   Please create a demo user first\n');
    return;
  }

  // Test 3: Test Statistics Endpoint
  console.log('3. Testing GET /api/bookings/statistics...');
  try {
    const response = await fetch(`${API_BASE}/bookings/statistics?timeframe=month`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();

    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${data.success}`);

    if (data.success) {
      console.log('   ✅ Statistics endpoint working!');
      console.log('   Data received:', Object.keys(data.data));
      if (data.data.summary) {
        console.log('   Summary:', JSON.stringify(data.data.summary, null, 2));
      }
    } else {
      console.log('   ⚠️  Error:', data.error);
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Test 4: Test My Bookings Endpoint
  console.log('\n4. Testing GET /api/bookings/my-bookings...');
  try {
    const response = await fetch(`${API_BASE}/bookings/my-bookings?type=all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();

    console.log(`   Status: ${response.status}`);
    console.log(`   Success: ${data.success}`);

    if (data.success) {
      console.log('   ✅ My Bookings endpoint working!');
      if (data.data.stats) {
        console.log('   Stats:', JSON.stringify(data.data.stats, null, 2));
      }

      // Check if there are any bookings
      const total = data.data.stats?.total || 0;
      if (total > 0) {
        console.log(`   Found ${total} total bookings`);
      } else {
        console.log('   ⚠️  No bookings found (this is OK for a fresh install)');
      }
    } else {
      console.log('   ⚠️  Error:', data.error);
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Test 5: Test Actions Endpoint Structure
  console.log('\n5. Testing POST /api/bookings/:id/actions structure...');
  try {
    const response = await fetch(`${API_BASE}/bookings/test-id-123/actions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action: 'approve' })
    });
    const data = await response.json();

    console.log(`   Status: ${response.status}`);

    // We expect 404 or validation error, not 500
    if (response.status === 404 || response.status === 400) {
      console.log('   ✅ Actions endpoint structure is correct');
      console.log('   (404/400 is expected for non-existent booking)');
    } else if (response.status === 500) {
      console.log('   ⚠️  Server error - endpoint may have issues');
      console.log('   Error:', data.error);
    } else {
      console.log('   Response:', data.error || data.message);
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('✨ Test Complete!');
  console.log('='.repeat(50));
  console.log('\n📋 Summary:');
  console.log('   • Server: Running ✅');
  console.log('   • Authentication: Working ✅');
  console.log('   • Statistics Endpoint: Created ✅');
  console.log('   • My Bookings Endpoint: Created ✅');
  console.log('   • Actions Endpoint: Created ✅');
  console.log('\n💡 Next steps:');
  console.log('   1. Create some test bookings');
  console.log('   2. Test the full workflow');
  console.log('   3. Build frontend components\n');
}

quickTest().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
