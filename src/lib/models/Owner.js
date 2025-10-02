import mongoose from 'mongoose';
import User from './User.js';

// Owner-specific schema extending User
const ownerSchema = new mongoose.Schema({
  // Profile fields
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
  // Business information
  businessName: {
    type: String,
    trim: true
  },
  businessType: {
    type: String,
    enum: ['individual', 'company', 'partnership'],
    default: 'individual'
  },
  businessDescription: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  gstNumber: {
    type: String,
    trim: true,
    validate: {
      validator: function(gst) {
        return !gst || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
      },
      message: 'Please enter a valid GST number'
    }
  },
  experience: {
    type: Number, // years of experience
    min: 0
  },
  licenseNumber: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  verification: {
    status: {
      type: String,
      enum: ['pending', 'in-review', 'verified', 'rejected'],
      default: 'pending'
    },
    aadhaarNumber: {
      type: String,
      validate: {
        validator: function(aadhaar) {
          return !aadhaar || /^\d{12}$/.test(aadhaar);
        },
        message: 'Aadhaar number must be 12 digits'
      }
    },
    aadhaarDocument: String, // File path or URL
    digilockerLinked: {
      type: Boolean,
      default: false
    },
    digilockerData: {
      name: String,
      dob: Date,
      gender: String,
      address: String
    },
    verificationDocuments: [{
      type: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    verifiedAt: Date,
    rejectionReason: String
  },
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  // Business statistics
  totalProperties: {
    type: Number,
    default: 0
  },
  activeListings: {
    type: Number,
    default: 0
  },
  totalTenants: {
    type: Number,
    default: 0
  },
  totalBookings: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  profileCompletion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  responseTime: {
    type: Number, // in hours
    default: 24
  },
  subscriptionPlan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  subscriptionExpiry: Date
});

// Calculate profile completion before save
ownerSchema.pre('save', function(next) {
  let completeness = 0;
  const totalFields = 13;

  // Basic fields
  if (this.fullName) completeness++;
  if (this.email) completeness++;
  if (this.phone) completeness++;
  if (this.city) completeness++;
  if (this.state) completeness++;

  // Business fields
  if (this.businessName) completeness++;
  if (this.businessType) completeness++;
  if (this.businessDescription) completeness++;
  if (this.experience !== undefined) completeness++;

  // Address
  if (this.address?.street) completeness++;
  if (this.address?.city) completeness++;
  if (this.address?.state) completeness++;
  if (this.address?.pincode) completeness++;

  this.profileCompletion = Math.round((completeness / totalFields) * 100);
  next();
});

// Override isActive for owners - they must be verified to be active
ownerSchema.virtual('isActiveAndVerified').get(function() {
  return this.isActive && this.verification.status === 'verified';
});

// Method to initiate verification
ownerSchema.methods.initiateVerification = async function(verificationData) {
  this.verification = {
    ...this.verification,
    ...verificationData,
    status: 'in-review'
  };
  return this.save();
};

// Method to approve verification
ownerSchema.methods.approveVerification = async function() {
  this.verification.status = 'verified';
  this.verification.verifiedAt = new Date();
  return this.save();
};

// Method to reject verification
ownerSchema.methods.rejectVerification = async function(reason) {
  this.verification.status = 'rejected';
  this.verification.rejectionReason = reason;
  return this.save();
};

// Use existing model if it exists, otherwise create new discriminator
const Owner = mongoose.models.Owner || User.discriminator('Owner', ownerSchema);

export default Owner;