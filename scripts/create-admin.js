const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// User Schema (simplified for admin creation)
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  adminLevel: { type: String, default: 'super' },
  permissions: [{ type: String }],
  isEmailVerified: { type: Boolean, default: true },
  isPhoneVerified: { type: Boolean, default: true },
  isIdentityVerified: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await connectDB();

    // Admin credentials
    const adminData = {
      fullName: 'Admin User',
      email: 'admin@studentnest.com',
      phone: '+919999999999',
      password: 'Admin@123',
      role: 'admin',
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdentityVerified: true,
      profilePhoto: null,
      // Admin specific fields
      adminLevel: 'super',
      permissions: [
        'view_all_users',
        'edit_users',
        'delete_users',
        'review_verifications',
        'approve_verifications',
        'reject_verifications',
        'view_analytics',
        'system_settings'
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      $or: [
        { email: adminData.email },
        { phone: adminData.phone },
        { role: 'admin' }
      ]
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('📱 Phone:', existingAdmin.phone);
      console.log('🆔 ID:', existingAdmin._id);
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const admin = new User(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('📱 Phone:', adminData.phone);
    console.log('🔑 Password: Admin@123');
    console.log('🆔 ID:', admin._id);
    console.log('🔐 Admin Level:', adminData.adminLevel);
    console.log('⚡ Permissions:', adminData.permissions.join(', '));
    console.log('');
    console.log('🎯 Access admin dashboard at: /admin/login');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();