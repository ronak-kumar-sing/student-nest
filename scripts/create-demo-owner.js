const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// Owner Schema (simplified for seeding)
const ownerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'owner' },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  isIdentityVerified: { type: Boolean, default: false },
  identityVerificationRequired: { type: Boolean, default: true },
  identityVerificationSkipped: { type: Boolean, default: false },
  profilePhoto: { type: String },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
ownerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
ownerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Owner = mongoose.models.Owner || mongoose.model('Owner', ownerSchema);

// Create demo owner account
const createDemoOwner = async () => {
  try {
    await connectDB();

    // Check if demo owner already exists
    const existingDemo = await Owner.findOne({ email: 'demo@owner.test' });
    if (existingDemo) {
      console.log('Demo owner account already exists!');
      console.log('Email: demo@owner.test');
      console.log('Password: DemoOwner123!');
      console.log('Phone: +919999999999');
      return;
    }

    // Create demo owner
    const demoOwner = new Owner({
      firstName: 'Demo',
      lastName: 'Owner',
      email: 'demo@owner.test',
      phone: '+919999999999',
      password: 'DemoOwner123!',
      role: 'owner',
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdentityVerified: false,
      identityVerificationRequired: true,
      identityVerificationSkipped: false,
      profilePhoto: null,
      isActive: true
    });

    await demoOwner.save();

    console.log('✅ Demo Owner Account Created Successfully!');
    console.log('');
    console.log('📧 Email: demo@owner.test');
    console.log('🔑 Password: DemoOwner123!');
    console.log('📱 Phone: +919999999999');
    console.log('');
    console.log('🔐 Features:');
    console.log('  • Email & Phone Verified: ✅');
    console.log('  • Identity Verification: ❌ (Required for testing)');
    console.log('  • Role: Owner');
    console.log('  • Status: Active');
    console.log('');
    console.log('🎯 Use this account to test:');
    console.log('  • Owner login flow');
    console.log('  • Identity verification system');
    console.log('  • Property management features');
    console.log('  • Dark theme on verification pages');

  } catch (error) {
    console.error('❌ Error creating demo owner:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
createDemoOwner();