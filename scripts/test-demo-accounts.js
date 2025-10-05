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

// Test demo accounts
const testDemoAccounts = async () => {
  try {
    await connectDB();

    console.log('=== TESTING DEMO ACCOUNTS ===\n');

    // Get collections
    const db = mongoose.connection.db;

    // Test Student
    console.log('🎓 STUDENT DEMO ACCOUNT:');
    const studentsCollection = db.collection('students');
    const demoStudent = await studentsCollection.findOne({ email: 'demo@student.test' });

    if (demoStudent) {
      console.log('✅ Demo student found in students collection');
      console.log('Email:', demoStudent.email);
      console.log('Role:', demoStudent.role);
      console.log('Password hash exists:', !!demoStudent.password);
      console.log('Active:', demoStudent.isActive);

      // Test password
      const testPassword = 'DemoStudent123!';
      const isValidPassword = await bcrypt.compare(testPassword, demoStudent.password);
      console.log('Password test (DemoStudent123!):', isValidPassword ? '✅ Valid' : '❌ Invalid');
    } else {
      console.log('❌ Demo student not found in students collection');
    }

    // Test Owner
    console.log('\n🏠 OWNER DEMO ACCOUNT:');
    const ownersCollection = db.collection('owners');
    const demoOwner = await ownersCollection.findOne({ email: 'demo@owner.test' });

    if (demoOwner) {
      console.log('✅ Demo owner found in owners collection');
      console.log('Email:', demoOwner.email);
      console.log('Role:', demoOwner.role);
      console.log('Password hash exists:', !!demoOwner.password);
      console.log('Active:', demoOwner.isActive);

      // Test password
      const testPassword = 'DemoOwner123!';
      const isValidPassword = await bcrypt.compare(testPassword, demoOwner.password);
      console.log('Password test (DemoOwner123!):', isValidPassword ? '✅ Valid' : '❌ Invalid');
    } else {
      console.log('❌ Demo owner not found in owners collection');
    }

    // Also check Users collection
    console.log('\n👥 USERS COLLECTION:');
    const usersCollection = db.collection('users');

    const demoUserStudent = await usersCollection.findOne({ email: 'demo@student.test' });
    const demoUserOwner = await usersCollection.findOne({ email: 'demo@owner.test' });

    console.log('Demo student in users collection:', demoUserStudent ? '✅ Found' : '❌ Not found');
    console.log('Demo owner in users collection:', demoUserOwner ? '✅ Found' : '❌ Not found');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testDemoAccounts();