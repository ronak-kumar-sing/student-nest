import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },

  // Overall rating (1-5 stars)
  overallRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  // Category-specific ratings
  categories: {
    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    location: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    facilities: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    owner: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    value: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  },

  comment: {
    type: String,
    maxlength: 1000,
    trim: true
  },

  stayDuration: {
    type: String,
    enum: ['1 month', '2 months', '3 months', '4 months', '5 months', '6 months', '7 months', '8 months', '9 months', '10 months', '11 months', '12+ months'],
    required: true
  },

  // Review verification and moderation
  isVerified: {
    type: Boolean,
    default: false
  },

  // Interaction metrics
  helpfulCount: {
    type: Number,
    default: 0,
    min: 0
  },
  helpfulUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Review images (optional)
  images: [{
    type: String,
    validate: {
      validator: function(url) {
        return /^https?:\/\/.+/.test(url);
      },
      message: 'Image must be a valid URL'
    }
  }],

  // Moderation fields
  isApproved: {
    type: Boolean,
    default: true
  },
  moderationNotes: String,
  flaggedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['inappropriate', 'fake', 'spam', 'offensive', 'other']
    },
    flaggedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Owner response
  ownerResponse: {
    message: {
      type: String,
      maxlength: 500,
      trim: true
    },
    respondedAt: Date
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
reviewSchema.index({ 'property': 1, 'createdAt': -1 });
reviewSchema.index({ 'student': 1 });
reviewSchema.index({ 'overallRating': -1 });
reviewSchema.index({ 'isApproved': 1, 'isVerified': 1 });
reviewSchema.index({ 'createdAt': -1 });

// Compound index for property reviews with ratings
reviewSchema.index({ 'property': 1, 'overallRating': -1, 'createdAt': -1 });

// Ensure one review per student per property per booking
reviewSchema.index({ 'property': 1, 'student': 1, 'booking': 1 }, { unique: true });

// Virtual for formatted date
reviewSchema.virtual('formattedDate').get(function() {
  return new Date(this.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
});

// Method to mark review as helpful
reviewSchema.methods.markHelpful = async function(userId) {
  try {
    if (!this.helpfulUsers.includes(userId)) {
      this.helpfulUsers.push(userId);
      this.helpfulCount += 1;
      await this.save();
    }
    return this;
  } catch (error) {
    throw new Error('Error marking review as helpful: ' + error.message);
  }
};

// Method to remove helpful mark
reviewSchema.methods.removeHelpful = async function(userId) {
  try {
    const index = this.helpfulUsers.indexOf(userId);
    if (index > -1) {
      this.helpfulUsers.splice(index, 1);
      this.helpfulCount = Math.max(0, this.helpfulCount - 1);
      await this.save();
    }
    return this;
  } catch (error) {
    throw new Error('Error removing helpful mark: ' + error.message);
  }
};

// Post-save middleware to update room rating
reviewSchema.post('save', async function(doc) {
  try {
    const Room = mongoose.model('Room');
    const room = await Room.findById(doc.property);
    if (room) {
      await room.updateRating();
    }
  } catch (error) {
    console.error('Error updating room rating after review save:', error);
  }
});

// Post-remove middleware to update room rating
reviewSchema.post('remove', async function(doc) {
  try {
    const Room = mongoose.model('Room');
    const room = await Room.findById(doc.property);
    if (room) {
      await room.updateRating();
    }
  } catch (error) {
    console.error('Error updating room rating after review removal:', error);
  }
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;