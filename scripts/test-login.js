const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://ronakkumar20062006:WcQd5ZksggAwO1oT@cluster0.969t4yr.mongodb.net/student-nest?retryWrites=true&w=majority&appName=Cluster0');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Test login function
const testLogin = async (email, password) => {
  try {
    await connectDB();

    console.log(`\n🔍 Testing login for: ${email}`);

    const db = mongoose.connection.db;

    // Check users collection
    const usersCollection = db.collection('users');
    const userInUsers = await usersCollection.findOne({ email });

    console.log('Users collection result:', userInUsers ? {
      id: userInUsers._id,
      email: userInUsers.email,
      role: userInUsers.role,
      hasPassword: !!userInUsers.password
    } : 'Not found');

    // Check owners collection
    const ownersCollection = db.collection('owners');
    const userInOwners = await ownersCollection.findOne({ email });

    console.log('Owners collection result:', userInOwners ? {
      id: userInOwners._id,
      email: userInOwners.email,
      role: userInOwners.role,
      hasPassword: !!userInOwners.password
    } : 'Not found');

    // Test password if user found
    if (userInUsers && userInUsers.password) {
      const isValidUsers = await bcrypt.compare(password, userInUsers.password);
      console.log('Password valid in users collection:', isValidUsers);
    }

    if (userInOwners && userInOwners.password) {
      const isValidOwners = await bcrypt.compare(password, userInOwners.password);
      console.log('Password valid in owners collection:', isValidOwners);
    }

  } catch (error) {
    console.error('❌ Test login error:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Test all accounts
const testAllAccounts = async () => {
  console.log('🧪 Testing login for all known accounts...\n');

  await testLogin('demo@owner.test', 'DemoOwner123!');

  // Reconnect for next test
  await new Promise(resolve => setTimeout(resolve, 1000));
  await testLogin('admin@studentnest.com', 'Admin@123');
};

testAllAccounts();