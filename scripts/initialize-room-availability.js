// Initialize room availability fields for existing rooms
const mongoose = require('mongoose');

async function initializeRoomAvailability() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ronakkumarsingh926:S3P3bFWqhj0mWT2k@cluster0.lu34w.mongodb.net/student-nest?retryWrites=true&w=majority&appName=Cluster0";
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Update all rooms to have totalRooms and availableRooms fields
    const result = await mongoose.connection.db.collection('rooms').updateMany(
      { 
        $or: [
          { 'availability.totalRooms': { $exists: false } },
          { 'availability.availableRooms': { $exists: false } }
        ]
      },
      { 
        $set: { 
          'availability.totalRooms': 1,
          'availability.availableRooms': 1
        } 
      }
    );
    
    console.log(`Updated ${result.modifiedCount} rooms with availability fields`);
    
    // Verify the update
    const roomCount = await mongoose.connection.db.collection('rooms').countDocuments({ 
      'availability.totalRooms': { $exists: true },
      'availability.availableRooms': { $exists: true }
    });
    console.log(`Total rooms with availability fields: ${roomCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

initializeRoomAvailability();