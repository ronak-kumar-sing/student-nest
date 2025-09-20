import mongoose from 'mongoose';
import User from './User.js';

// Student-specific schema extending User
const studentSchema = new mongoose.Schema({
  collegeId: {
    type: String,
    required: true,
    trim: true
  },
  collegeName: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    trim: true
  },
  yearOfStudy: {
    type: Number,
    min: 1,
    max: 6
  },
  // Profile fields
  avatar: {
    type: String, // URL to avatar image
    default: null
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: 500,
    trim: true
  },
  // Enhanced preferences
  preferences: {
    roomTypePreference: [{
      type: String,
      enum: ['single', 'shared', 'studio', 'pg']
    }],
    budgetMin: {
      type: Number,
      min: 2000,
      max: 50000
    },
    budgetMax: {
      type: Number,
      min: 2000,
      max: 50000
    },
    locationPreferences: [{
      type: String
    }],
    amenityPreferences: [{
      type: String
    }]
  },
  // Verification fields
  verification: {
    status: {
      type: String,
      enum: ['pending', 'in-review', 'verified', 'rejected'],
      default: 'pending'
    },
    collegeIdCard: {
      type: String // URL to uploaded document
    },
    aadhaarCard: {
      type: String // URL to uploaded document
    },
    verifiedAt: Date,
    rejectionReason: String
  },
  // Activity tracking
  lastActive: {
    type: Date,
    default: Date.now
  },
  viewCount: {
    type: Number,
    default: 0
  },
  savedProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  profileCompleteness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
});

// Calculate profile completeness on save
studentSchema.pre('save', function(next) {
  let completeness = 0;
  const totalFields = 12;

  // Basic fields
  if (this.fullName) completeness++;
  if (this.email) completeness++;
  if (this.phone) completeness++;
  if (this.avatar) completeness++;

  // Academic fields
  if (this.collegeId) completeness++;
  if (this.collegeName) completeness++;
  if (this.course) completeness++;
  if (this.yearOfStudy) completeness++;

  // Location fields
  if (this.city) completeness++;
  if (this.state) completeness++;

  // Preferences
  if (this.preferences?.roomTypePreference?.length > 0) completeness++;
  if (this.preferences?.budgetMin && this.preferences?.budgetMax) completeness++;

  this.profileCompleteness = Math.round((completeness / totalFields) * 100);
  next();
});

// Use existing model if it exists, otherwise create new discriminator
const Student = mongoose.models.Student || User.discriminator('Student', studentSchema);

export default Student;