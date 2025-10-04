import mongoose, { Schema } from 'mongoose';
import User, { IUserDocument } from './User';

// Interface for Student document
interface IStudentDocument extends IUserDocument {
  collegeId: string;
  collegeName: string;
  course?: string;
  yearOfStudy?: number;
  city?: string;
  state?: string;
  bio?: string;
  preferences: {
    roomTypePreference: string[];
    budgetMin: number;
    budgetMax: number;
    locationPreferences: string[];
    amenityPreferences: string[];
  };
  verification: {
    status: string;
    collegeIdCard?: string;
    aadhaarCard?: string;
    verifiedAt?: Date;
    rejectionReason?: string;
  };
  lastActive: Date;
  viewCount: number;
  savedProperties: mongoose.Types.ObjectId[];
  profileCompleteness: number;
}

// Student-specific schema extending User
const studentSchema = new Schema<IStudentDocument>({
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
  preferences: {
    roomTypePreference: [{
      type: String,
      enum: ['single', 'shared', 'studio', 'pg']
    }],
    budgetMin: {
      type: Number,
      min: 2000,
      max: 50000,
      default: 5000
    },
    budgetMax: {
      type: Number,
      min: 2000,
      max: 50000,
      default: 15000
    },
    locationPreferences: [{
      type: String
    }],
    amenityPreferences: [{
      type: String
    }]
  },
  verification: {
    status: {
      type: String,
      enum: ['pending', 'in-review', 'verified', 'rejected'],
      default: 'pending'
    },
    collegeIdCard: {
      type: String
    },
    aadhaarCard: {
      type: String
    },
    verifiedAt: Date,
    rejectionReason: String
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  viewCount: {
    type: Number,
    default: 0
  },
  savedProperties: [{
    type: Schema.Types.ObjectId,
    ref: 'Property'
  }],
  profileCompleteness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
});

// Calculate profile completeness before saving
studentSchema.pre('save', function(next) {
  const requiredFields = ['fullName', 'email', 'phone', 'collegeId', 'collegeName'];
  const optionalFields = ['course', 'yearOfStudy', 'city', 'state', 'bio', 'profilePhoto'];

  let completeness = 0;
  const requiredWeight = 60;
  const optionalWeight = 40;

  // Check required fields
  const requiredComplete = requiredFields.filter(field => {
    const value = (this as any)[field];
    return value && value.toString().trim() !== '';
  }).length;
  completeness += (requiredComplete / requiredFields.length) * requiredWeight;

  // Check optional fields
  const optionalComplete = optionalFields.filter(field => {
    const value = (this as any)[field];
    return value && value.toString().trim() !== '';
  }).length;
  completeness += (optionalComplete / optionalFields.length) * optionalWeight;

  this.profileCompleteness = Math.round(completeness);
  next();
});

// Create discriminator model
const Student = (User.discriminators?.Student || User.discriminator<IStudentDocument>('Student', studentSchema)) as mongoose.Model<IStudentDocument>;

export default Student;
export type { IStudentDocument };
