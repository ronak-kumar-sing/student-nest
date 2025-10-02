const mongoose = require('mongoose');

// MongoDB connection (using same as demo owner script)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://ronakkumar20062006:WcQd5ZksggAwO1oT@cluster0.969t4yr.mongodb.net/student-nest?retryWrites=true&w=majority&appName=Cluster0');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Check what collections exist and their structure
const checkDatabase = async () => {
  try {
    await connectDB();

    console.log('🔍 Checking database structure...\n');

    // Get all collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log('📊 Available Collections:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    console.log();

    // Check users collection specifically
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`👥 Users Collection: ${userCount} documents`);

    if (userCount > 0) {
      const sampleUsers = await usersCollection.find({}).limit(5).toArray();
      console.log('\n📋 Sample Users:');
      sampleUsers.forEach((user, index) => {
        console.log(`\n${index + 1}. User ID: ${user._id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Phone: ${user.phone}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Full Name: ${user.fullName || user.firstName + ' ' + user.lastName}`);
        console.log(`   Password Hash: ${user.password ? 'Present' : 'Missing'}`);
        console.log(`   Admin Level: ${user.adminLevel || 'Not set'}`);
        console.log(`   Created: ${user.createdAt}`);
      });
    }

    // Check owners collection (from demo script)
    const ownersCollection = db.collection('owners');
    const ownerCount = await ownersCollection.countDocuments();
    console.log(`\n🏠 Owners Collection: ${ownerCount} documents`);

    if (ownerCount > 0) {
      const sampleOwners = await ownersCollection.find({}).limit(5).toArray();
      console.log('\n📋 Sample Owners:');
      sampleOwners.forEach((owner, index) => {
        console.log(`\n${index + 1}. Owner ID: ${owner._id}`);
        console.log(`   Email: ${owner.email}`);
        console.log(`   Phone: ${owner.phone}`);
        console.log(`   Role: ${owner.role}`);
        console.log(`   Name: ${owner.firstName} ${owner.lastName}`);
        console.log(`   Password Hash: ${owner.password ? 'Present' : 'Missing'}`);
        console.log(`   Created: ${owner.createdAt}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
checkDatabase();