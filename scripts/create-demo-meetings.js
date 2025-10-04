/**
 * Script to create demo meetings for testing the student visiting schedule
 */

const mongoose = require('mongoose');

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://ronakkumarsingh926:S3P3bFWqhj0mWT2k@cluster0.lu34w.mongodb.net/student-nest?retryWrites=true&w=majority&appName=Cluster0");
    console.log('MongoDB connected for demo data creation');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Meeting Schema
const meetingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'modified', 'declined', 'pending_student_response'],
    default: 'pending'
  },
  meetingType: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  purpose: {
    type: String,
    default: 'Property viewing'
  },
  preferredDates: [{
    type: Date,
    required: true
  }],
  confirmedDate: Date,
  confirmedTime: String,
  studentNotes: String,
  ownerNotes: String,
  virtualMeetingDetails: {
    platform: String,
    meetingLink: String,
    meetingId: String,
    password: String
  },
  outcome: String,
  estimatedDuration: {
    type: Number,
    default: 60
  }
}, {
  timestamps: true
});

const Meeting = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);

async function createDemoMeetings() {
  try {
    await connectDB();

    // Get test student and owner
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
      fullName: String,
      email: String,
      phone: String,
      role: String
    }));

    const Room = mongoose.models.Room || mongoose.model('Room', new mongoose.Schema({
      title: String,
      location: String,
      price: Number,
      images: [String]
    }));

    // Find test users
    let testStudent = await User.findOne({ email: 'teststudent@example.com' });
    let testOwner = await User.findOne({ role: 'Owner' });
    let testProperty = await Room.findOne({});

    // Create test student if not exists
    if (!testStudent) {
      testStudent = await User.create({
        fullName: 'Test Student',
        email: 'teststudent@example.com',
        phone: '1234567890',
        role: 'Student'
      });
      console.log('Created test student');
    }

    // Create test owner if not exists
    if (!testOwner) {
      testOwner = await User.create({
        fullName: 'Test Owner',
        email: 'testowner@example.com',
        phone: '0987654321',
        role: 'Owner'
      });
      console.log('Created test owner');
    }

    // Create test property if not exists
    if (!testProperty) {
      testProperty = await Room.create({
        title: 'Cozy Studio Apartment',
        location: 'Downtown, City Center',
        price: 15000,
        images: ['https://example.com/image1.jpg']
      });
      console.log('Created test property');
    }

    // Clear existing meetings for this student
    await Meeting.deleteMany({ student: testStudent._id });
    console.log('Cleared existing meetings');

    // Create demo meetings
    const demoMeetings = [
      {
        student: testStudent._id,
        owner: testOwner._id,
        property: testProperty._id,
        status: 'pending',
        meetingType: 'offline',
        purpose: 'Property viewing - interested in the studio apartment',
        preferredDates: [new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)], // 2 days from now
        studentNotes: 'I would like to view this property. Available in the afternoon.',
        estimatedDuration: 60
      },
      {
        student: testStudent._id,
        owner: testOwner._id,
        property: testProperty._id,
        status: 'confirmed',
        meetingType: 'online',
        purpose: 'Initial consultation about property',
        preferredDates: [new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)], // 1 day from now
        confirmedDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        confirmedTime: '14:30',
        studentNotes: 'Looking forward to the virtual tour.',
        ownerNotes: 'Meeting confirmed. Will provide virtual tour.',
        virtualMeetingDetails: {
          platform: 'Zoom',
          meetingLink: 'https://zoom.us/j/123456789',
          meetingId: '123 456 789',
          password: 'property123'
        }
      },
      {
        student: testStudent._id,
        owner: testOwner._id,
        property: testProperty._id,
        status: 'modified',
        meetingType: 'offline',
        purpose: 'Property viewing with questions about amenities',
        preferredDates: [new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)], // 3 days from now
        studentNotes: 'Interested in seeing the property and nearby facilities.',
        ownerNotes: 'Original time not available, proposing alternatives.'
      },
      {
        student: testStudent._id,
        owner: testOwner._id,
        property: testProperty._id,
        status: 'completed',
        meetingType: 'offline',
        purpose: 'Final property inspection before booking',
        preferredDates: [new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)], // 1 day ago
        confirmedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        confirmedTime: '10:00',
        studentNotes: 'Ready to make a decision after this visit.',
        ownerNotes: 'Great meeting! Student is very interested.',
        outcome: 'Student proceeded with booking application.'
      }
    ];

    // Insert demo meetings
    const createdMeetings = await Meeting.insertMany(demoMeetings);
    console.log(`Created ${createdMeetings.length} demo meetings:`);

    createdMeetings.forEach((meeting, index) => {
      console.log(`${index + 1}. ${meeting.purpose} - Status: ${meeting.status}`);
    });

    console.log('\nDemo meetings created successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error creating demo meetings:', error);
    process.exit(1);
  }
}

// Run the script
createDemoMeetings();