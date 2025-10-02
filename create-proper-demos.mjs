import connectDB from '../src/lib/db/connection.js';
import Student from '../src/lib/models/Student.js';
import Owner from '../src/lib/models/Owner.js';

// Create demo accounts using proper discriminator models
const createProperDemoAccounts = async () => {
  try {
    await connectDB();

    console.log('=== CREATING PROPER DEMO ACCOUNTS ===\n');

    // Create Demo Student
    console.log('🎓 Creating Demo Student Account:');

    // Check if demo student exists
    const existingStudent = await Student.findOne({ email: 'demo@student.test' });
    if (existingStudent) {
      console.log('✅ Demo student already exists');
    } else {
      const demoStudent = new Student({
        email: 'demo@student.test',
        phone: '+918888888888',
        password: 'DemoStudent123!',
        fullName: 'Demo Student',
        role: 'student',
        collegeId: 'DEMO_COLLEGE_001',
        collegeName: 'Demo University',
        course: 'Computer Science Engineering',
        yearOfStudy: 2,
        isEmailVerified: true,
        isPhoneVerified: true,
        isIdentityVerified: false,
        identityVerificationRequired: false,
        isActive: true
      });

      await demoStudent.save();
      console.log('✅ Demo student created successfully');
    }

    // Create Demo Owner
    console.log('\n🏠 Creating Demo Owner Account:');

    // Check if demo owner exists
    const existingOwner = await Owner.findOne({ email: 'demo@owner.test' });
    if (existingOwner) {
      console.log('✅ Demo owner already exists');
    } else {
      const demoOwner = new Owner({
        email: 'demo@owner.test',
        phone: '+919999999999',
        password: 'DemoOwner123!',
        fullName: 'Demo Owner',
        role: 'owner',
        businessName: 'Demo Properties',
        businessType: 'individual',
        isEmailVerified: true,
        isPhoneVerified: true,
        isIdentityVerified: false,
        identityVerificationRequired: true,
        isActive: true
      });

      await demoOwner.save();
      console.log('✅ Demo owner created successfully');
    }

    console.log('\n📋 Demo Account Credentials:');
    console.log('');
    console.log('🎓 STUDENT:');
    console.log('  Email: demo@student.test');
    console.log('  Password: DemoStudent123!');
    console.log('  Login URL: http://localhost:3000/student/login');
    console.log('');
    console.log('🏠 OWNER:');
    console.log('  Email: demo@owner.test');
    console.log('  Password: DemoOwner123!');
    console.log('  Login URL: http://localhost:3000/owner/login');

    process.exit(0);
  } catch (error) {
    console.error('Error creating demo accounts:', error);
    process.exit(1);
  }
};

createProperDemoAccounts();