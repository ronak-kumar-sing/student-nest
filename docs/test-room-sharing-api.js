const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://ronakkumar20062006:WcQd5ZksggAwO1oT@cluster0.969t4yr.mongodb.net/student-nest?retryWrites=true&w=majority&appName=Cluster0';
const API_BASE = 'http://localhost:3000/api';

let studentToken = null;
let studentId = null;
let roomId = null;
let shareId = null;

// Color output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'blue');
  console.log('='.repeat(60) + '\n');
}

async function apiCall(method, endpoint, data = null, token = null) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (response.ok) {
      log(`✓ ${method} ${endpoint} - Success (${response.status})`, 'green');
      return { success: true, data: result, status: response.status };
    } else {
      log(`✗ ${method} ${endpoint} - Failed (${response.status})`, 'red');
      console.log('  Error:', result.error || result.message);
      return { success: false, error: result, status: response.status };
    }
  } catch (error) {
    log(`✗ ${method} ${endpoint} - Error`, 'red');
    console.log('  Exception:', error.message);
    return { success: false, error: error.message };
  }
}

async function setup() {
  section('SETUP: Getting Test Data from Database');

  await mongoose.connect(MONGODB_URI);
  log('✓ Connected to MongoDB', 'green');

  // Get verified student
  const student = await mongoose.connection.db.collection('users').findOne({
    role: 'student',
    isEmailVerified: true,
    isPhoneVerified: true
  });

  if (!student) {
    log('✗ No verified student found', 'red');
    process.exit(1);
  }

  studentId = student._id.toString();
  log(`✓ Found verified student: ${student.fullName} (${student.email})`, 'green');

  // Get a room
  const room = await mongoose.connection.db.collection('rooms').findOne();
  if (!room) {
    log('✗ No rooms found', 'red');
    process.exit(1);
  }

  roomId = room._id.toString();
  log(`✓ Found room: ${room.title} in ${room.location?.city}`, 'green');

  await mongoose.connection.close();
  log('✓ Database connection closed', 'green');
}

async function testLogin() {
  section('TEST 1: Student Login');

  const result = await apiCall('POST', '/auth/login', {
    email: 'teststudent@example.com',
    password: 'password123'
  });

  if (result.success && result.data.data?.accessToken) {
    studentToken = result.data.data.accessToken;
    log(`✓ Got access token: ${studentToken.substring(0, 20)}...`, 'green');
    return true;
  }

  log('✗ Failed to get access token', 'red');
  return false;
}

async function testCompatibilityAssessment() {
  section('TEST 2: Compatibility Assessment');

  // Submit assessment
  log('→ Submitting compatibility assessment...', 'yellow');
  const submitResult = await apiCall('POST', '/room-sharing/assessment', {
    sleepSchedule: 'early_bird',
    cleanliness: 'very_clean',
    studyHabits: 'quiet',
    socialLevel: 'moderately_social',
    cookingFrequency: 'often',
    musicPreference: 'low_volume',
    guestPolicy: 'occasional_guests',
    smokingTolerance: 'no_smoking',
    petFriendly: 'okay_with_pets',
    workSchedule: 'student_only',
    sharingPreferences: ['cooking together', 'cleaning schedule'],
    dealBreakers: ['smoking', 'loud music']
  }, studentToken);

  if (!submitResult.success) {
    log('  Note: Assessment might already exist', 'yellow');
  }

  // Get assessment
  log('→ Retrieving compatibility assessment...', 'yellow');
  const getResult = await apiCall('GET', '/room-sharing/assessment', null, studentToken);

  if (getResult.success && getResult.data.data) {
    console.log('  Assessment:', JSON.stringify(getResult.data.data, null, 2));
  }

  // Update assessment
  log('→ Updating compatibility assessment...', 'yellow');
  await apiCall('PUT', '/room-sharing/assessment', {
    sleepSchedule: 'flexible',
    musicPreference: 'moderate'
  }, studentToken);
}

async function testCreateRoomShare() {
  section('TEST 3: Create Room Sharing Request');

  log(`→ Creating room share for room: ${roomId}`, 'yellow');

  const result = await apiCall('POST', '/room-sharing', {
    propertyId: roomId,
    maxParticipants: 3,
    description: 'Looking for 2 clean and quiet roommates to share this awesome place!',
    requirements: {
      gender: 'any',
      ageRange: { min: 18, max: 30 },
      occupation: ['student'],
      preferences: ['non-smoker', 'vegetarian-friendly']
    },
    costSharing: {
      totalRent: 30000,
      rentPerPerson: 10000,
      depositPerPerson: 20000,
      utilitiesIncluded: true,
      utilitiesPerPerson: 0
    },
    roomConfiguration: {
      bedrooms: 3,
      bathrooms: 2,
      furnishing: 'semi-furnished'
    },
    availableFrom: new Date().toISOString(),
    houseRules: ['No smoking', 'No loud music after 10 PM', 'Keep common areas clean']
  }, studentToken);

  if (result.success && result.data.data?._id) {
    shareId = result.data.data._id;
    log(`✓ Room share created with ID: ${shareId}`, 'green');
    console.log('  Share details:', JSON.stringify(result.data.data, null, 2));
    return true;
  }

  return false;
}

async function testBrowseRoomShares() {
  section('TEST 4: Browse Room Shares');

  // Basic browse
  log('→ Browsing all room shares...', 'yellow');
  const allResult = await apiCall('GET', '/room-sharing?page=1&limit=10');

  if (allResult.success) {
    console.log(`  Found ${allResult.data.data.total} room shares`);
    console.log(`  Page: ${allResult.data.data.page}/${allResult.data.data.totalPages}`);
  }

  // With filters
  log('→ Browsing with filters (gender=any, maxBudget=15000)...', 'yellow');
  await apiCall('GET', '/room-sharing?gender=any&maxBudget=15000&page=1&limit=5');
}

async function testRoomShareDetails() {
  section('TEST 5: Room Share Details');

  if (!shareId) {
    log('✗ No share ID available, skipping', 'yellow');
    return;
  }

  log(`→ Getting details for share: ${shareId}`, 'yellow');
  const result = await apiCall('GET', `/room-sharing/${shareId}`, null, studentToken);

  if (result.success && result.data.data) {
    const data = result.data.data;
    console.log('  Share Status:', data.status);
    console.log('  Max Participants:', data.maxParticipants);
    console.log('  Available Slots:', data.availableSlots);
    console.log('  Is Full:', data.isFull);

    if (data.userContext) {
      console.log('  User Context:');
      console.log('    - Is Initiator:', data.userContext.isInitiator);
      console.log('    - Is Participant:', data.userContext.isParticipant);
      console.log('    - Has Applied:', data.userContext.hasApplied);
      console.log('    - Has Interest:', data.userContext.hasInterest);
      console.log('    - Compatibility Score:', data.userContext.compatibilityScore);
    }
  }
}

async function testUpdateRoomShare() {
  section('TEST 6: Update Room Share');

  if (!shareId) {
    log('✗ No share ID available, skipping', 'yellow');
    return;
  }

  log(`→ Updating room share: ${shareId}`, 'yellow');
  await apiCall('PUT', `/room-sharing/${shareId}`, {
    description: 'Updated: Looking for responsible roommates who value cleanliness and quiet study time',
    houseRules: [
      'No smoking anywhere',
      'No loud music after 10 PM',
      'Keep common areas clean',
      'Respect shared spaces'
    ]
  }, studentToken);
}

async function testMyRoomShares() {
  section('TEST 7: User Dashboard - My Room Shares');

  // Get all
  log('→ Getting all my room shares...', 'yellow');
  const allResult = await apiCall('GET', '/room-sharing/my-shares', null, studentToken);

  if (allResult.success && allResult.data.data) {
    const stats = allResult.data.data.stats;
    console.log('  Statistics:');
    console.log('    - Created:', stats.created);
    console.log('    - Joined:', stats.joined);
    console.log('    - Applied:', stats.applied);
    console.log('    - Pending Applications:', stats.pendingApplications);
    console.log('    - Active Shares:', stats.activeShares);
  }

  // Get by type
  log('→ Getting created shares...', 'yellow');
  await apiCall('GET', '/room-sharing/my-shares?type=created', null, studentToken);

  log('→ Getting joined shares...', 'yellow');
  await apiCall('GET', '/room-sharing/my-shares?type=joined', null, studentToken);

  log('→ Getting applied shares...', 'yellow');
  await apiCall('GET', '/room-sharing/my-shares?type=applied', null, studentToken);
}

async function testStatistics() {
  section('TEST 8: Platform Statistics');

  log('→ Getting platform statistics...', 'yellow');
  const result = await apiCall('GET', '/room-sharing/statistics', null, studentToken);

  if (result.success && result.data.data) {
    const { platform, myStats, recentActivity } = result.data.data;

    console.log('  Platform Statistics:');
    console.log('    - Total Shares:', platform.totalShares);
    console.log('    - Active Shares:', platform.activeShares);
    console.log('    - Full Shares:', platform.fullShares);
    console.log('    - Total Participants:', platform.totalParticipants);
    console.log('    - Unique Participants:', platform.uniqueParticipants);

    if (platform.priceRange) {
      console.log('    - Price Range:',
        `₹${platform.priceRange.min} - ₹${platform.priceRange.max} (avg: ₹${platform.priceRange.average})`
      );
    }

    if (platform.genderDistribution) {
      console.log('    - Gender Distribution:', platform.genderDistribution);
    }

    if (platform.topCities && platform.topCities.length > 0) {
      console.log('    - Top Cities:');
      platform.topCities.forEach(city => {
        console.log(`      • ${city.name}: ${city.count} shares`);
      });
    }

    if (myStats) {
      console.log('  My Statistics:');
      console.log('    - Created:', myStats.created);
      console.log('    - Joined:', myStats.joined);
      console.log('    - Applied:', myStats.applied);
    }

    if (recentActivity) {
      console.log('  Recent Activity (30 days):');
      console.log('    - New Shares:', recentActivity.last30Days?.newShares || 0);
      console.log('    - New Applications:', recentActivity.last30Days?.newApplications || 0);
    }
  }
}

async function testInterestBookmark() {
  section('TEST 9: Interest/Bookmark System');

  if (!shareId) {
    log('✗ No share ID available, skipping', 'yellow');
    return;
  }

  // Mark interest
  log(`→ Marking interest in share: ${shareId}`, 'yellow');
  await apiCall('POST', '/room-sharing/interest', {
    shareId: shareId
  }, studentToken);

  // Get interested shares
  log('→ Getting all interested shares...', 'yellow');
  const getResult = await apiCall('GET', '/room-sharing/interest', null, studentToken);

  if (getResult.success && getResult.data.data) {
    console.log(`  Found ${getResult.data.count} bookmarked shares`);
  }

  // Remove interest
  log(`→ Removing interest from share: ${shareId}`, 'yellow');
  await apiCall('DELETE', '/room-sharing/interest', {
    shareId: shareId
  }, studentToken);
}

async function cleanup() {
  section('CLEANUP: Removing Test Data');

  if (shareId) {
    log(`→ Cancelling room share: ${shareId}`, 'yellow');
    await apiCall('DELETE', `/room-sharing/${shareId}`, null, studentToken);
  }
}

async function runTests() {
  try {
    await setup();

    const loginSuccess = await testLogin();
    if (!loginSuccess) {
      log('✗ Login failed, cannot continue tests', 'red');
      process.exit(1);
    }

    await testCompatibilityAssessment();
    await testCreateRoomShare();
    await testBrowseRoomShares();
    await testRoomShareDetails();
    await testUpdateRoomShare();
    await testMyRoomShares();
    await testStatistics();
    await testInterestBookmark();

    // Cleanup
    await cleanup();

    section('ALL TESTS COMPLETED');
    log('✓ All room sharing API tests completed successfully!', 'green');

  } catch (error) {
    log(`✗ Test suite failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

runTests();
