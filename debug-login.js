const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function debugLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Use a simple schema to check what's in the database
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

    // Check total users
    const totalUsers = await User.countDocuments();
    console.log('Total users in database:', totalUsers);

    // Get first few users
    const users = await User.find({}, { email: 1, phone: 1, role: 1, password: 1 }).limit(5);
    console.log('\nFirst 5 users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. {
        id: ${user._id},
        email: "${user.email}",
        phone: "${user.phone}",
        role: "${user.role}",
        hasPassword: ${!!user.password},
        passwordLength: ${user.password ? user.password.length : 0}
      }`);
    });

    // Try to find specific user
    const testUser = await User.findOne({ email: 'alice.student@example.com' });
    console.log('\nSearching for alice.student@example.com:');
    console.log(testUser ? 'Found!' : 'NOT FOUND');

    if (testUser) {
      console.log('User details:', {
        email: testUser.email,
        role: testUser.role,
        hasPassword: !!testUser.password
      });
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugLogin();