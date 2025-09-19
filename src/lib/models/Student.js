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
  preferences: {
    budgetRange: {
      min: Number,
      max: Number
    },
    location: String,
    roomType: {
      type: String,
      enum: ['single', 'shared', 'any']
    },
    amenities: [String]
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
  const totalFields = 10;

  if (this.fullName) completeness++;
  if (this.email) completeness++;
  if (this.phone) completeness++;
  if (this.collegeId) completeness++;
  if (this.collegeName) completeness++;
  if (this.course) completeness++;
  if (this.yearOfStudy) completeness++;
  if (this.preferences?.budgetRange) completeness++;
  if (this.preferences?.location) completeness++;
  if (this.preferences?.roomType) completeness++;

  this.profileCompleteness = Math.round((completeness / totalFields) * 100);
  next();
});

export default User.discriminator('Student', studentSchema);