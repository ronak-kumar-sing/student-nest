import mongoose from 'mongoose';
import User from './User.js';

// Owner-specific schema extending User
const ownerSchema = new mongoose.Schema({
  businessName: {
    type: String,
    trim: true
  },
  businessType: {
    type: String,
    enum: ['individual', 'company', 'partnership'],
    default: 'individual'
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
  totalProperties: {
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

export default User.discriminator('Owner', ownerSchema);