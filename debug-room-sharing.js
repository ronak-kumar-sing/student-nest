// Debug room sharing creation

const TEST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGRmNjYyZjc3YTdiZDIxYjdlN2U3MjQiLCJlbWFpbCI6InN0dWRlbnQxQHRlc3QuY29tIiwicm9sZSI6IlN0dWRlbnQiLCJpc0VtYWlsVmVyaWZpZWQiOnRydWUsImlzUGhvbmVWZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzU5NDcyMDI2LCJleHAiOjE3NjAwNzY4MjYsImF1ZCI6InN0dWRlbnQtbmVzdC11c2VycyIsImlzcyI6InN0dWRlbnQtbmVzdCJ9.WLkV8a_dDE0iOI470DoxCu-VBXDzaQveo_Dsrz5qTgE";

const testData = {
  propertyId: "68df663077a7bd21b7e7e72c", // Shared Room in Student Paradise Hostel
  maxParticipants: 2,
  description: "Looking for a roommate to share this amazing room!",
  costSharing: {
    monthlyRent: 15000,
    securityDeposit: 20000,
    maintenanceCharges: 2000
  },
  requirements: {
    gender: "any",
    ageRange: { min: 18, max: 25 },
    preferences: ["non-smoker", "student"]
  },
  roomConfiguration: {
    totalBeds: 2,
    bedsAvailable: 1,
    hasPrivateBathroom: true,
    hasSharedKitchen: true
  },
  availableFrom: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Tomorrow
};

async function testRoomSharing() {
  try {
    const response = await fetch('http://localhost:3000/api/room-sharing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TEST_TOKEN}`
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (!result.success) {
      console.log('\n🔍 Error Details:', result.error);
      if (result.details) {
        console.log('🔍 Additional Details:', JSON.stringify(result.details, null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Request failed:', error);
  }
}

testRoomSharing();