// Create demo room sharing data for testing
const mongoose = require('mongoose');


async function createDemoData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Get collections
    const usersCollection = db.collection('users');
    const roomsCollection = db.collection('rooms');
    const roomSharingsCollection = db.collection('roomsharings');

    // Get verified student
    const student = await usersCollection.findOne({
      role: 'student',
      isEmailVerified: true,
      isPhoneVerified: true
    });

    if (!student) {
      console.log('❌ No verified student found');
      process.exit(1);
    }

    console.log(`✅ Found student: ${student.fullName} (${student.email})`);

    // Get available rooms
    const rooms = await roomsCollection.find().limit(5).toArray();
    console.log(`✅ Found ${rooms.length} rooms\n`);

    // Check existing room shares
    const existingCount = await roomSharingsCollection.countDocuments();
    console.log(`Current room shares: ${existingCount}`);

    // Create demo room shares
    console.log('\nCreating demo room shares...\n');

    const demoShares = [];

    for (let i = 0; i < Math.min(3, rooms.length); i++) {
      const room = rooms[i];

      const share = {
        property: room._id,
        initiator: student._id,
        maxParticipants: 3,
        currentParticipants: [
          {
            user: student._id,
            sharedAmount: 10000,
            status: 'confirmed',
            joinedAt: new Date()
          }
        ],
        requirements: {
          gender: i === 0 ? 'any' : i === 1 ? 'male' : 'female',
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
        description: `Looking for ${3 - 1} clean and quiet roommates to share this place in ${room.location?.city || 'the city'}. Great location with good amenities!`,
        availableFrom: new Date(),
        availableTill: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        houseRules: [
          'No smoking inside',
          'No loud music after 10 PM',
          'Keep common areas clean',
          'Respect each other\'s privacy'
        ],
        status: 'active',
        views: Math.floor(Math.random() * 50),
        applications: [],
        interested: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await roomSharingsCollection.insertOne(share);
      demoShares.push(result.insertedId);

      console.log(`✅ Created share ${i + 1}:`);
      console.log(`   ID: ${result.insertedId}`);
      console.log(`   Property: ${room.title}`);
      console.log(`   Location: ${room.location?.city || 'Unknown'}`);
      console.log(`   Gender: ${share.requirements.gender}`);
      console.log(`   Rent: ₹${share.costSharing.rentPerPerson}/person`);
      console.log('');
    }

    // Update student with compatibility assessment
    console.log('Adding compatibility assessment to student...');
    await usersCollection.updateOne(
      { _id: student._id },
      {
        $set: {
          compatibilityAssessment: {
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
            dealBreakers: ['smoking', 'loud music'],
            updatedAt: new Date()
          }
        }
      }
    );
    console.log('✅ Compatibility assessment added\n');

    // Final count
    const finalCount = await roomSharingsCollection.countDocuments();
    console.log('========================================');
    console.log(`✅ Demo data created successfully!`);
    console.log(`   Total room shares: ${finalCount}`);
    console.log(`   New shares created: ${demoShares.length}`);
    console.log('========================================\n');

    console.log('You can now test the APIs:');
    console.log('1. Browse: GET /api/room-sharing');
    console.log('2. Statistics: GET /api/room-sharing/statistics');
    console.log('3. Details: GET /api/room-sharing/' + demoShares[0]);
    console.log('');

    await mongoose.connection.close();
    console.log('✅ Connection closed');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createDemoData();
