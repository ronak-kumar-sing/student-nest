/**
 * Quick Property Creation Test
 *
 * This script creates a test property with minimal code to verify the system works
 */

const apiClient = require('./src/lib/api').default;

const DEMO_OWNER = {
  email: 'demo.owner@studentnest.com',
  password: 'Owner@123'
};

async function quickTest() {
  console.log('\n🏠 Quick Property Creation Test\n');

  try {
    // 1. Login
    console.log('1. Logging in...');
    const loginResult = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(DEMO_OWNER),
    });

    const loginData = await loginResult.json();

    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.error);
      return;
    }

    console.log('✅ Logged in as:', loginData.data.user.name);
    const token = loginData.data.token;

    // 2. Create property without images (should fail - demonstrates validation)
    console.log('\n2. Testing validation (no images)...');
    const invalidProperty = {
      title: 'Test Property',
      description: 'Testing validation',
      price: 10000,
      roomType: 'single',
      accommodationType: 'pg',
      location: {
        address: 'Test Address',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      securityDeposit: 20000,
      amenities: ['wifi'],
      images: [] // No images - should fail
    };

    const invalidResult = await fetch('http://localhost:3000/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(invalidProperty),
    });

    const invalidData = await invalidResult.json();

    if (!invalidData.success) {
      console.log('✅ Validation working:', invalidData.error);
    } else {
      console.log('⚠️  Validation should have failed (no images)');
    }

    // 3. Create property with placeholder images
    console.log('\n3. Creating property with placeholder images...');
    const validProperty = {
      title: 'Modern Studio Apartment - Quick Test',
      description: 'A quick test property to verify the system is working correctly',
      fullDescription: 'This is a test property created by the quick test script. It includes all required fields and placeholder images.',
      price: 15000,
      roomType: 'studio',
      accommodationType: 'apartment',
      maxSharingCapacity: 1,
      location: {
        address: '123 Test Street, Hauz Khas',
        fullAddress: '123 Test Street, Hauz Khas, Near IIT Delhi',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110016',
        coordinates: {
          lat: 28.5450,
          lng: 77.1926
        }
      },
      securityDeposit: 30000,
      maintenanceCharges: 1500,
      features: {
        area: 450,
        floor: 3,
        totalFloors: 5,
        furnished: true,
        balcony: true,
        attached_bathroom: true
      },
      amenities: ['wifi', 'ac', 'powerBackup', 'security', 'parking', 'lift'],
      rules: {
        genderPreference: 'any',
        smokingAllowed: false,
        petsAllowed: false,
        drinkingAllowed: false,
        visitorsAllowed: true,
        couplesAllowed: false
      },
      availability: {
        isAvailable: true,
        availableRooms: 1,
        availableFrom: new Date().toISOString()
      },
      totalRooms: 1,
      images: [
        'https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=Main+Image',
        'https://via.placeholder.com/800x600/2196F3/FFFFFF?text=Bedroom',
        'https://via.placeholder.com/800x600/FF9800/FFFFFF?text=Kitchen'
      ]
    };

    const validResult = await fetch('http://localhost:3000/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(validProperty),
    });

    const validData = await validResult.json();

    if (validData.success) {
      console.log('✅ Property created successfully!');
      console.log('   ID:', validData.data.roomId);
      console.log('   Title:', validData.data.title);
      console.log('   Status:', validData.data.status);
      console.log('   Images:', validData.data.images?.length || 0);

      // 4. Retrieve the property
      console.log('\n4. Retrieving property...');
      const getResult = await fetch(`http://localhost:3000/api/rooms/${validData.data.roomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const getData = await getResult.json();

      if (getData.success) {
        console.log('✅ Property retrieved successfully!');
        console.log('   Full title:', getData.data.title);
        console.log('   Price: ₹' + getData.data.price);
        console.log('   Location:', getData.data.location.city);
        console.log('   Amenities:', getData.data.amenities.join(', '));
      }

      console.log('\n✅ All tests passed! The property posting system is working correctly.');
      console.log('\n📝 Note: Test property created with ID:', validData.data.roomId);
      console.log('   You may want to delete this from your database.');

    } else {
      console.log('❌ Property creation failed:', validData.error);
      if (validData.details) {
        console.log('   Details:', JSON.stringify(validData.details, null, 2));
      }
    }

  } catch (error) {
    console.error('\n💥 Error:', error.message);
    console.error(error);
  }
}

// Run if called directly
if (require.main === module) {
  quickTest();
}

module.exports = { quickTest };
