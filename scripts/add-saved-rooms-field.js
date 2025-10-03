// Add savedRooms field to existing users
const mongoose = require('mongoose');

async function addSavedRoomsField() {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://ronakkumarsingh926:S3P3bFWqhj0mWT2k@cluster0.lu34w.mongodb.net/student-nest?retryWrites=true&w=majority&appName=Cluster0";

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all users to have savedRooms field if they don't have it
    const result = await mongoose.connection.db.collection('users').updateMany(
      { savedRooms: { $exists: false } },
      { $set: { savedRooms: [] } }
    );

    console.log(`Updated ${result.modifiedCount} users with savedRooms field`);

    // Verify the update
    const userCount = await mongoose.connection.db.collection('users').countDocuments({ savedRooms: { $exists: true } });
    console.log(`Total users with savedRooms field: ${userCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

addSavedRoomsField();