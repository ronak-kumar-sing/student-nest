import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // DigiLocker simulation status
  digilockerAuth: {
    authenticated: {
      type: Boolean,
      default: false
    },
    userConsent: {
      type: Boolean,
      default: false
    },
    documentsAvailable: [{
      type: String,
      enum: ['aadhaar', 'pan', 'driving_license', 'passport']
    }],
    authenticatedAt: Date
  },

  // Document verification
  documents: [{
    type: {
      type: String,
      enum: ['aadhaar', 'pan', 'driving_license', 'passport', 'voter_id'],
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    publicId: String, // Cloudinary public ID
    extractedData: {
      name: String,
      documentNumber: String,
      dateOfBirth: String,
      address: String,
      confidence: Number
    },
    ocrText: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date
  }],

  // Selfie verification
  selfie: {
    fileUrl: String,
    publicId: String, // Cloudinary public ID
    uploadedAt: Date,
    faceMatching: {
      similarity: Number, // Percentage similarity
      threshold: {
        type: Number,
        default: 70
      },
      matched: Boolean,
      matchedWith: String, // Document type that matched
      processedAt: Date
    }
  },

  // Overall verification status
  status: {
    type: String,
    enum: ['pending', 'document_uploaded', 'selfie_uploaded', 'processing', 'verified', 'rejected'],
    default: 'pending'
  },

  verificationLevel: {
    type: String,
    enum: ['basic', 'standard', 'premium', 'full'],
    default: 'basic'
  },

  // Verification scores
  scores: {
    documentScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    faceMatchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },

  // Admin actions
  adminReview: {
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    action: {
      type: String,
      enum: ['approved', 'rejected', 'pending']
    },
    notes: String,
    reviewedAt: Date
  },

  // Audit trail
  history: [{
    action: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: mongoose.Schema.Types.Mixed,
    performedBy: {
      type: String,
      enum: ['user', 'system', 'admin'],
      default: 'user'
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
verificationSchema.index({ userId: 1 });
verificationSchema.index({ status: 1 });
verificationSchema.index({ verificationLevel: 1 });
verificationSchema.index({ createdAt: -1 });

// Virtual for verification progress percentage
verificationSchema.virtual('progress').get(function() {
  let progress = 0;

  if (this.digilockerAuth.authenticated) progress += 25;
  if (this.documents.length > 0) progress += 35;
  if (this.selfie.fileUrl) progress += 25;
  if (this.status === 'verified') progress += 15;

  return Math.min(progress, 100);
});

// Method to add history entry
verificationSchema.methods.addHistory = function(action, details, performedBy = 'user') {
  this.history.push({
    action,
    details,
    performedBy,
    timestamp: new Date()
  });
};

// Method to calculate overall score
verificationSchema.methods.calculateOverallScore = function() {
  const documentWeight = 0.6;
  const faceWeight = 0.4;

  this.scores.overallScore = Math.round(
    (this.scores.documentScore * documentWeight) +
    (this.scores.faceMatchScore * faceWeight)
  );

  return this.scores.overallScore;
};

// Method to update verification level based on completeness
verificationSchema.methods.updateVerificationLevel = function() {
  const user = this.populate('userId');

  if (user.isEmailVerified && user.isPhoneVerified) {
    this.verificationLevel = 'basic';
  }

  if (this.documents.length > 0 && this.documents.some(doc => doc.verified)) {
    this.verificationLevel = 'standard';
  }

  if (this.selfie.fileUrl && this.selfie.faceMatching.matched) {
    this.verificationLevel = 'premium';
  }

  if (this.digilockerAuth.authenticated && this.scores.overallScore >= 85) {
    this.verificationLevel = 'full';
  }
};

// Pre-save middleware
verificationSchema.pre('save', function(next) {
  // Calculate overall score
  this.calculateOverallScore();

  // Update verification level
  this.updateVerificationLevel();

  // Update status based on completeness
  if (this.documents.length > 0 && !this.selfie.fileUrl) {
    this.status = 'document_uploaded';
  } else if (this.selfie.fileUrl && this.documents.length > 0) {
    this.status = 'selfie_uploaded';
  } else if (this.scores.overallScore >= 70) {
    this.status = 'verified';
  }

  next();
});

const Verification = mongoose.models.Verification || mongoose.model('Verification', verificationSchema);

export default Verification;