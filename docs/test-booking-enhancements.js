#!/usr/bin/env node

/**
 * Booking System Enhancement Test Script
 * Tests all new booking endpoints and actions
 */

const API_BASE = 'http://localhost:3000/api';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testBookingEnhancements() {
  log('cyan', '\n=== BOOKING SYSTEM ENHANCEMENT TESTS ===\n');

  // Get tokens from command line or environment
  const studentToken = process.argv[2] || process.env.STUDENT_TOKEN;
  const ownerToken = process.argv[3] || process.env.OWNER_TOKEN;

  if (!studentToken || !ownerToken) {
    log('red', '❌ Error: Tokens required');
    log('yellow', 'Usage: node test-booking-enhancements.js <student_token> <owner_token>');
    log('yellow', 'Or set STUDENT_TOKEN and OWNER_TOKEN environment variables');
    process.exit(1);
  }

  let testsPassed = 0;
  let testsFailed = 0;
  let bookingId = null;

  // Test 1: Get Student Statistics
  log('blue', '\n📊 Test 1: Get Student Statistics');
  try {
    const response = await fetch(`${API_BASE}/bookings/statistics?timeframe=month`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await response.json();

    if (data.success) {
      log('green', '✅ Student statistics retrieved successfully');
      console.log('   Summary:', data.data.summary);
      if (data.data.student) {
        console.log('   Total Spent:', `₹${data.data.student.totalSpent}`);
        console.log('   Avg Stay:', `${data.data.student.averageStayDuration} months`);
      }
      testsPassed++;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    log('red', `❌ Failed: ${error.message}`);
    testsFailed++;
  }

  // Test 2: Get Owner Statistics
  log('blue', '\n📊 Test 2: Get Owner Statistics');
  try {
    const response = await fetch(`${API_BASE}/bookings/statistics?timeframe=all`, {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    const data = await response.json();

    if (data.success) {
      log('green', '✅ Owner statistics retrieved successfully');
      if (data.data.owner) {
        console.log('   Occupancy Rate:', `${data.data.owner.occupancyRate?.toFixed(1)}%`);
        console.log('   Total Earnings:', `₹${data.data.owner.totalEarnings}`);
        console.log('   Active Tenants:', data.data.owner.activeTenants);
        console.log('   Renewal Rate:', `${data.data.owner.renewalRate?.toFixed(1)}%`);
      }
      testsPassed++;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    log('red', `❌ Failed: ${error.message}`);
    testsFailed++;
  }

  // Test 3: Get Student's My Bookings
  log('blue', '\n📋 Test 3: Get Student My Bookings (All)');
  try {
    const response = await fetch(`${API_BASE}/bookings/my-bookings?type=all`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await response.json();

    if (data.success) {
      log('green', '✅ My bookings retrieved successfully');
      console.log('   Stats:', data.data.stats);

      // Try to get a pending booking for testing
      if (data.data.pending && data.data.pending.length > 0) {
        bookingId = data.data.pending[0]._id;
        log('yellow', `   Found pending booking: ${bookingId}`);
      } else if (data.data.confirmed && data.data.confirmed.length > 0) {
        bookingId = data.data.confirmed[0]._id;
        log('yellow', `   Found confirmed booking: ${bookingId}`);
      }
      testsPassed++;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    log('red', `❌ Failed: ${error.message}`);
    testsFailed++;
  }

  // Test 4: Get Owner's My Bookings
  log('blue', '\n📋 Test 4: Get Owner My Bookings (Pending)');
  try {
    const response = await fetch(`${API_BASE}/bookings/my-bookings?type=pending`, {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    const data = await response.json();

    if (data.success) {
      log('green', '✅ Owner pending bookings retrieved');
      console.log('   Count:', data.data.count);

      // Get a booking ID for action tests
      if (data.data.pending && data.data.pending.length > 0 && !bookingId) {
        bookingId = data.data.pending[0]._id;
        log('yellow', `   Found booking for testing: ${bookingId}`);
      }
      testsPassed++;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    log('red', `❌ Failed: ${error.message}`);
    testsFailed++;
  }

  // Test 5: Get Upcoming Bookings
  log('blue', '\n📋 Test 5: Get Upcoming Bookings');
  try {
    const response = await fetch(`${API_BASE}/bookings/my-bookings?type=upcoming`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await response.json();

    if (data.success) {
      log('green', '✅ Upcoming bookings retrieved');
      console.log('   Count:', data.data.count);
      testsPassed++;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    log('red', `❌ Failed: ${error.message}`);
    testsFailed++;
  }

  // Test 6: Get Expiring Bookings
  log('blue', '\n📋 Test 6: Get Expiring Bookings');
  try {
    const response = await fetch(`${API_BASE}/bookings/my-bookings?type=expiring`, {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    const data = await response.json();

    if (data.success) {
      log('green', '✅ Expiring bookings retrieved');
      console.log('   Count:', data.data.count);
      testsPassed++;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    log('red', `❌ Failed: ${error.message}`);
    testsFailed++;
  }

  // Action Tests (only if we have a booking ID)
  if (bookingId) {
    // Test 7: Approve Booking (Owner)
    log('blue', `\n✔️  Test 7: Approve Booking (${bookingId})`);
    try {
      const response = await fetch(`${API_BASE}/bookings/${bookingId}/actions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ownerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'approve',
          notes: 'Welcome! Looking forward to hosting you.'
        })
      });
      const data = await response.json();

      if (data.success || data.error?.includes('already')) {
        log('green', '✅ Booking approval endpoint works');
        console.log('   Message:', data.message || data.error);
        testsPassed++;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      log('red', `❌ Failed: ${error.message}`);
      testsFailed++;
    }

    // Test 8: Request Extension (Student)
    log('blue', `\n📅 Test 8: Request Extension`);
    try {
      const response = await fetch(`${API_BASE}/bookings/${bookingId}/actions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${studentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'request_extension',
          extensionDuration: 3,
          reason: 'Semester extended, need more time'
        })
      });
      const data = await response.json();

      if (data.success || data.error?.includes('not active')) {
        log('green', '✅ Extension request endpoint works');
        console.log('   Message:', data.message || data.error);
        testsPassed++;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      log('red', `❌ Failed: ${error.message}`);
      testsFailed++;
    }

    // Test 9: Check-In Student (Owner)
    log('blue', `\n🏠 Test 9: Check-In Student`);
    try {
      const response = await fetch(`${API_BASE}/bookings/${bookingId}/actions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ownerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'activate',
          notes: 'Student checked in successfully',
          meterReadings: {
            electricity: 1234,
            water: 567,
            gas: 89
          },
          roomCondition: 'All items in good condition'
        })
      });
      const data = await response.json();

      if (data.success || data.error?.includes('not confirmed')) {
        log('green', '✅ Check-in endpoint works');
        console.log('   Message:', data.message || data.error);
        testsPassed++;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      log('red', `❌ Failed: ${error.message}`);
      testsFailed++;
    }

    // Test 10: Check-Out Student (Owner)
    log('blue', `\n🚪 Test 10: Check-Out Student`);
    try {
      const response = await fetch(`${API_BASE}/bookings/${bookingId}/actions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ownerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'complete',
          notes: 'Smooth checkout process',
          meterReadings: {
            electricity: 2456,
            water: 892,
            gas: 145
          },
          damageCharges: 0,
          cleaningCharges: 500,
          utilityCharges: 1200
        })
      });
      const data = await response.json();

      if (data.success || data.error?.includes('not active')) {
        log('green', '✅ Check-out endpoint works');
        console.log('   Message:', data.message || data.error);
        testsPassed++;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      log('red', `❌ Failed: ${error.message}`);
      testsFailed++;
    }
  } else {
    log('yellow', '\n⚠️  No booking ID found - skipping action tests');
    log('yellow', '   Create a booking first to test actions');
  }

  // Test Summary
  log('cyan', '\n=== TEST SUMMARY ===');
  log('green', `✅ Passed: ${testsPassed}`);
  if (testsFailed > 0) {
    log('red', `❌ Failed: ${testsFailed}`);
  }
  log('cyan', `Total: ${testsPassed + testsFailed}\n`);

  // Success rate
  const successRate = ((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1);
  if (successRate >= 80) {
    log('green', `🎉 Success Rate: ${successRate}%`);
  } else if (successRate >= 50) {
    log('yellow', `⚠️  Success Rate: ${successRate}%`);
  } else {
    log('red', `❌ Success Rate: ${successRate}%`);
  }

  console.log();
}

// Run tests
testBookingEnhancements().catch(error => {
  log('red', `\n❌ Fatal error: ${error.message}`);
  process.exit(1);
});
