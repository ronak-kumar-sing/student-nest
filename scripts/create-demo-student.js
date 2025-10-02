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

// Student Schema (simplified for seeding)
const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  collegeId: { type: String, required: true },
  collegeName: { type: String, required: true },
  course: { type: String },
  yearOfStudy: { type: Number },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  isIdentityVerified: { type: Boolean, default: false },
  identityVerificationRequired: { type: Boolean, default: false }, // Optional for students
  identityVerificationSkipped: { type: Boolean, default: false },
  profilePhoto: { type: String },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

// Create demo student account
const createDemoStudent = async () => {
  try {
    await connectDB();

    // Check if demo student already exists
    const existingDemo = await Student.findOne({ email: 'demo@student.test' });
    if (existingDemo) {
      console.log('Demo student account already exists!');
      console.log('Email: demo@student.test');
      console.log('Password: DemoStudent123!');
      console.log('Phone: +918888888888');
      return;
    }

    // Create demo student
    const demoStudent = new Student({
      firstName: 'Demo',
      lastName: 'Student',
      email: 'demo@student.test',
      phone: '+918888888888',
      password: 'DemoStudent123!',
      role: 'student',
      collegeId: 'DEMO_COLLEGE_001',
      collegeName: 'Demo University',
      course: 'Computer Science Engineering',
      yearOfStudy: 2,
      isEmailVerified: true,
      isPhoneVerified: true,
      isIdentityVerified: false,
      identityVerificationRequired: false, // Optional for students
      identityVerificationSkipped: false,
      profilePhoto: null,
      isActive: true
    });

    await demoStudent.save();

    console.log('✅ Demo Student Account Created Successfully!');
    console.log('');
    console.log('📧 Email: demo@student.test');
    console.log('🔑 Password: DemoStudent123!');
    console.log('📱 Phone: +918888888888');
    console.log('🎓 College: Demo University');
    console.log('📚 Course: Computer Science Engineering (2nd Year)');
    console.log('');
    console.log('🔐 Features:');
    console.log('  • Email & Phone Verified: ✅');
    console.log('  • Identity Verification: ❌ (Optional for students)');
    console.log('  • Role: Student');
    console.log('  • Status: Active');
    console.log('');
    console.log('🎯 Use this account to test:');
    console.log('  • Student login flow');
    console.log('  • Optional verification system');
    console.log('  • Room search and applications');
    console.log('  • Student dashboard features');
    console.log('');
    console.log('🌐 Login URLs:');
    console.log('  • Student Login: http://localhost:3000/student/login');
    console.log('  • Owner Login: http://localhost:3000/owner/login');

    process.exit(0);
  } catch (error) {
    console.error('Error creating demo student:', error);
    process.exit(1);
  }
};

// Run the script
createDemoStudent();
