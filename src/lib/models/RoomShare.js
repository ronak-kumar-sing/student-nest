import mongoose from 'mongoose';

const roomShareSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Sharing configuration
  maxParticipants: {
    type: Number,
    required: true,
    min: 2,
    max: 6,
    default: 2
  },
  currentParticipants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined', 'left'],
      default: 'confirmed'
    },
    sharedAmount: {
      type: Number,
      required: true
    }
  }],

  // Sharing requirements and preferences
  requirements: {
    gender: {
      type: String,
      enum: ['male', 'female', 'any'],
      default: 'any'
    },
    ageRange: {
      min: {
        type: Number,
        min: 16,
        max: 50,
        default: 18
      },
      max: {
        type: Number,
        min: 18,
        max: 60,
        default: 30
      }
    },
    preferences: [{
      type: String,
      enum: [
        'non-smoker',
        'vegetarian',
        'student',
        'working_professional',
        'quiet_person',
        'social_person',
        'early_riser',
        'night_owl',
        'clean_and_organized',
        'pet_friendly',
        'no_alcohol',
        'fitness_enthusiast'
      ]
    }],
    lifestyle: [{
      type: String,
      enum: [
        'study_focused',
        'party_friendly',
        'home_cooking',
        'eating_out',
        'guest_friendly',
        'privacy_focused',
        'shared_activities',
        'minimalist'
      ]
    }]
  },

  // Financial sharing
  costSharing: {
    monthlyRent: {
      type: Number,
      required: true
    },
    rentPerPerson: {
      type: Number,
      required: true
    },
    securityDeposit: {
      type: Number,
      required: true
    },
    depositPerPerson: {
      type: Number,
      required: true
    },
    maintenanceCharges: {
      type: Number,
      default: 0
    },
    maintenancePerPerson: {
      type: Number,
      default: 0
    },
    utilitiesIncluded: {
      type: Boolean,
      default: true
    },
    utilitiesPerPerson: {
      type: Number,
      default: 0
    }
  },

  // Room sharing details
  description: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true
  },
  roomConfiguration: {
    totalBeds: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    bedsAvailable: {
      type: Number,
      required: true,
      min: 1
    },
    hasPrivateBathroom: {
      type: Boolean,
      default: false
    },
    hasSharedKitchen: {
      type: Boolean,
      default: true
    },
    hasStudyArea: {
      type: Boolean,
      default: true
    },
    hasStorage: {
      type: Boolean,
      default: true
    }
  },

  // Sharing status
  status: {
    type: String,
    enum: ['active', 'full', 'cancelled', 'inactive', 'completed'],
    default: 'active'
  },

  // Availability dates
  availableFrom: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date >= new Date();
      },
      message: 'Available from date must be today or in the future'
    }
  },
  availableTill: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date > this.availableFrom;
      },
      message: 'Available till date must be after available from date'
    }
  },

  // Communication and applications
  applications: [{
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending'
    },
    message: {
      type: String,
      maxlength: 500
    },
    compatibility: {
      score: {
        type: Number,
        min: 0,
        max: 100
      },
      details: {
        lifestyle: Number,
        preferences: Number,
        schedule: Number,
        cleanliness: Number
      }
    },
    initiatorResponse: {
      message: String,
      respondedAt: Date
    }
  }],

  // Matching and compatibility
  compatibilityQuestions: [{
    question: String,
    answer: String
  }],

  // House rules and agreements
  houseRules: [{
    rule: {
      type: String,
      maxlength: 200
    },
    mandatory: {
      type: Boolean,
      default: false
    }
  }],

  // Social features
  isOpenToMeetup: {
    type: Boolean,
    default: true
  },
  meetupPreferences: [{
    type: String,
    enum: ['coffee_chat', 'video_call', 'property_visit', 'public_place']
  }],

  // Success metrics
  views: {
    type: Number,
    default: 0
  },
  interested: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    interestedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Completion details
  completedAt: Date,
  completionReason: {
    type: String,
    enum: ['all_slots_filled', 'cancelled_by_initiator', 'property_unavailable', 'expired'],
  },

  // Tags for search
  tags: [{
    type: String,
    lowercase: true
  }],

  // Priority and featured
  isPriority: {
    type: Boolean,
    default: false
  },
  featuredTill: Date
}, {
  timestamps: true
});

// Indexes for efficient querying
roomShareSchema.index({ 'status': 1, 'availableFrom': 1 });
roomShareSchema.index({ 'initiator': 1, 'status': 1 });
roomShareSchema.index({ 'property': 1, 'status': 1 });
roomShareSchema.index({ 'requirements.gender': 1 });
roomShareSchema.index({ 'costSharing.rentPerPerson': 1 });
roomShareSchema.index({ 'createdAt': -1 });
roomShareSchema.index({ 'views': -1 });
roomShareSchema.index({ 'tags': 1 });

// Compound indexes for complex queries
roomShareSchema.index({
  'status': 1,
  'requirements.gender': 1,
  'costSharing.rentPerPerson': 1
});

// Virtual for available slots
roomShareSchema.virtual('availableSlots').get(function() {
  const confirmedParticipants = this.currentParticipants.filter(p => p.status === 'confirmed').length;
  return this.maxParticipants - confirmedParticipants;
});

// Virtual for is full
roomShareSchema.virtual('isFull').get(function() {
  return this.availableSlots <= 0;
});

// Virtual for total applications
roomShareSchema.virtual('totalApplications').get(function() {
  return this.applications.length;
});

// Virtual for pending applications
roomShareSchema.virtual('pendingApplications').get(function() {
  return this.applications.filter(app => app.status === 'pending').length;
});

// Pre-save middleware to update status based on capacity
roomShareSchema.pre('save', function(next) {
  if (this.isFull && this.status === 'active') {
    this.status = 'full';
  } else if (!this.isFull && this.status === 'full') {
    this.status = 'active';
  }

  // Calculate per-person amounts
  this.costSharing.rentPerPerson = Math.ceil(this.costSharing.monthlyRent / this.maxParticipants);
  this.costSharing.depositPerPerson = Math.ceil(this.costSharing.securityDeposit / this.maxParticipants);
  this.costSharing.maintenancePerPerson = Math.ceil(this.costSharing.maintenanceCharges / this.maxParticipants);
  this.costSharing.utilitiesPerPerson = Math.ceil(this.costSharing.utilitiesPerPerson / this.maxParticipants);

  next();
});

// Method to add participant
roomShareSchema.methods.addParticipant = async function(userId, sharedAmount) {
  try {
    if (this.isFull) {
      throw new Error('Room sharing is already full');
    }

    this.currentParticipants.push({
      user: userId,
      sharedAmount: sharedAmount,
      status: 'confirmed'
    });

    await this.save();
    return this;
  } catch (error) {
    throw new Error('Error adding participant: ' + error.message);
  }
};

// Method to remove participant
roomShareSchema.methods.removeParticipant = async function(userId) {
  try {
    const participantIndex = this.currentParticipants.findIndex(
      p => p.user.toString() === userId.toString()
    );

    if (participantIndex > -1) {
      this.currentParticipants[participantIndex].status = 'left';
      await this.save();
    }

    return this;
  } catch (error) {
    throw new Error('Error removing participant: ' + error.message);
  }
};

// Method to apply for room sharing
roomShareSchema.methods.addApplication = async function(applicantId, message) {
  try {
    // Check if user already applied
    const existingApplication = this.applications.find(
      app => app.applicant.toString() === applicantId.toString()
    );

    if (existingApplication) {
      throw new Error('Already applied for this room sharing');
    }

    this.applications.push({
      applicant: applicantId,
      message: message
    });

    await this.save();
    return this;
  } catch (error) {
    throw new Error('Error adding application: ' + error.message);
  }
};

// Method to respond to application
roomShareSchema.methods.respondToApplication = async function(applicationId, status, responseMessage) {
  try {
    const application = this.applications.id(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }

    application.status = status;
    application.initiatorResponse = {
      message: responseMessage,
      respondedAt: new Date()
    };

    // If accepted, add to participants
    if (status === 'accepted' && !this.isFull) {
      await this.addParticipant(application.applicant, this.costSharing.rentPerPerson);
    }

    await this.save();
    return this;
  } catch (error) {
    throw new Error('Error responding to application: ' + error.message);
  }
};

// Method to calculate compatibility score
roomShareSchema.methods.calculateCompatibility = function(userPreferences) {
  let score = 0;
  let totalCriteria = 0;

  // Gender compatibility
  if (this.requirements.gender === 'any' || this.requirements.gender === userPreferences.gender) {
    score += 20;
  }
  totalCriteria += 20;

  // Age compatibility
  if (userPreferences.age >= this.requirements.ageRange.min &&
      userPreferences.age <= this.requirements.ageRange.max) {
    score += 15;
  }
  totalCriteria += 15;

  // Preferences match
  const commonPreferences = this.requirements.preferences.filter(
    pref => userPreferences.preferences.includes(pref)
  );
  score += (commonPreferences.length / Math.max(this.requirements.preferences.length, 1)) * 30;
  totalCriteria += 30;

  // Lifestyle compatibility
  const commonLifestyle = this.requirements.lifestyle.filter(
    lifestyle => userPreferences.lifestyle.includes(lifestyle)
  );
  score += (commonLifestyle.length / Math.max(this.requirements.lifestyle.length, 1)) * 25;
  totalCriteria += 25;

  // Budget compatibility
  if (Math.abs(userPreferences.budget - this.costSharing.rentPerPerson) <= 1000) {
    score += 10;
  }
  totalCriteria += 10;

  return Math.round((score / totalCriteria) * 100);
};

// Static method to find matches for a user
roomShareSchema.statics.findMatches = function(userPreferences, limit = 10) {
  const query = {
    status: 'active',
    availableFrom: { $lte: new Date(userPreferences.moveInDate || Date.now()) }
  };

  // Gender filter
  if (userPreferences.gender !== 'any') {
    query['requirements.gender'] = { $in: ['any', userPreferences.gender] };
  }

  // Budget filter
  if (userPreferences.maxBudget) {
    query['costSharing.rentPerPerson'] = { $lte: userPreferences.maxBudget };
  }

  return this.find(query)
    .populate('property', 'title location images')
    .populate('initiator', 'fullName profilePhoto')
    .sort({ createdAt: -1 })
    .limit(limit);
};

const RoomShare = mongoose.models.RoomShare || mongoose.model('RoomShare', roomShareSchema);

export default RoomShare;