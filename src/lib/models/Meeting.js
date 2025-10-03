import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
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
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Meeting scheduling
  preferredDates: [{
    type: Date,
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'Preferred dates must be in the future'
    }
  }],
  confirmedDate: {
    type: Date,
    validate: {
      validator: function(date) {
        return !date || date > new Date();
      },
      message: 'Confirmed date must be in the future'
    }
  },
  confirmedTime: {
    type: String, // Format: "HH:MM"
    validate: {
      validator: function(time) {
        return !time || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
      },
      message: 'Time must be in HH:MM format'
    }
  },

  // Meeting status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rescheduled', 'cancelled', 'completed', 'no_show'],
    default: 'pending'
  },

  // Meeting type
  meetingType: {
    type: String,
    enum: ['physical', 'virtual', 'phone'],
    default: 'physical'
  },

  // Virtual meeting details (if applicable)
  virtualMeetingDetails: {
    platform: {
      type: String,
      enum: ['zoom', 'google_meet', 'whatsapp', 'phone']
    },
    meetingLink: String,
    meetingId: String,
    passcode: String
  },

  // Communication
  studentNotes: {
    type: String,
    maxlength: 500,
    trim: true
  },
  ownerNotes: {
    type: String,
    maxlength: 500,
    trim: true
  },

  // Meeting purpose and requirements
  purpose: {
    type: String,
    enum: ['property_viewing', 'discussion', 'document_verification', 'key_handover', 'inspection'],
    default: 'property_viewing'
  },
  requirements: [{
    type: String,
    enum: ['bring_documents', 'bring_guardian', 'advance_payment', 'id_proof', 'college_id']
  }],

  // Response tracking
  ownerResponseDate: Date,
  studentConfirmationDate: Date,

  // Meeting outcome
  outcome: {
    attended: {
      student: {
        type: Boolean,
        default: false
      },
      owner: {
        type: Boolean,
        default: false
      }
    },
    studentInterested: {
      type: Boolean
    },
    ownerApproved: {
      type: Boolean
    },
    followUpRequired: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      maxlength: 1000
    },
    nextSteps: [{
      type: String,
      enum: ['schedule_another_meeting', 'proceed_with_booking', 'submit_documents', 'payment_discussion', 'no_action']
    }]
  },

  // Rescheduling history
  rescheduleHistory: [{
    previousDate: Date,
    newPreferredDates: [Date],
    reason: {
      type: String,
      maxlength: 200
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    requestedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Cancellation details
  cancellationReason: {
    type: String,
    maxlength: 300
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: Date,

  // Reminders and notifications
  remindersSent: {
    student: {
      oneDayBefore: {
        type: Boolean,
        default: false
      },
      oneHourBefore: {
        type: Boolean,
        default: false
      }
    },
    owner: {
      oneDayBefore: {
        type: Boolean,
        default: false
      },
      oneHourBefore: {
        type: Boolean,
        default: false
      }
    }
  },

  // Meeting feedback
  feedback: {
    student: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        maxlength: 300
      },
      submittedAt: Date
    },
    owner: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        maxlength: 300
      },
      submittedAt: Date
    }
  },

  // Priority and urgency
  isUrgent: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
meetingSchema.index({ 'student': 1, 'status': 1 });
meetingSchema.index({ 'owner': 1, 'status': 1 });
meetingSchema.index({ 'property': 1, 'status': 1 });
meetingSchema.index({ 'confirmedDate': 1, 'status': 1 });
meetingSchema.index({ 'createdAt': -1 });
meetingSchema.index({ 'status': 1, 'confirmedDate': 1 });

// Compound index for upcoming meetings
meetingSchema.index({ 'status': 1, 'confirmedDate': 1, 'meetingType': 1 });

// Virtual for meeting duration estimation
meetingSchema.virtual('estimatedDuration').get(function() {
  switch (this.purpose) {
    case 'property_viewing':
      return 30; // minutes
    case 'discussion':
      return 15;
    case 'document_verification':
      return 20;
    case 'key_handover':
      return 10;
    case 'inspection':
      return 45;
    default:
      return 30;
  }
});

// Virtual to check if meeting is upcoming
meetingSchema.virtual('isUpcoming').get(function() {
  return this.status === 'confirmed' && this.confirmedDate && this.confirmedDate > new Date();
});

// Method to confirm meeting
meetingSchema.methods.confirmMeeting = async function(date, time) {
  try {
    this.status = 'confirmed';
    this.confirmedDate = date;
    this.confirmedTime = time;
    this.ownerResponseDate = new Date();
    await this.save();
    return this;
  } catch (error) {
    throw new Error('Error confirming meeting: ' + error.message);
  }
};

// Method to reschedule meeting
meetingSchema.methods.rescheduleMeeting = async function(newDates, reason, requestedBy) {
  try {
    // Add to reschedule history
    this.rescheduleHistory.push({
      previousDate: this.confirmedDate,
      newPreferredDates: newDates,
      reason: reason,
      requestedBy: requestedBy
    });

    // Update meeting details
    this.status = 'rescheduled';
    this.preferredDates = newDates;
    this.confirmedDate = null;
    this.confirmedTime = null;

    await this.save();
    return this;
  } catch (error) {
    throw new Error('Error rescheduling meeting: ' + error.message);
  }
};

// Method to cancel meeting
meetingSchema.methods.cancelMeeting = async function(reason, cancelledBy) {
  try {
    this.status = 'cancelled';
    this.cancellationReason = reason;
    this.cancelledBy = cancelledBy;
    this.cancelledAt = new Date();
    await this.save();
    return this;
  } catch (error) {
    throw new Error('Error cancelling meeting: ' + error.message);
  }
};

// Method to complete meeting
meetingSchema.methods.completeMeeting = async function(outcomeData) {
  try {
    this.status = 'completed';
    this.outcome = { ...this.outcome, ...outcomeData };
    await this.save();
    return this;
  } catch (error) {
    throw new Error('Error completing meeting: ' + error.message);
  }
};

// Method to mark as no show
meetingSchema.methods.markNoShow = async function(whoDidNotShow) {
  try {
    this.status = 'no_show';
    if (whoDidNotShow === 'student') {
      this.outcome.attended.owner = true;
      this.outcome.attended.student = false;
    } else if (whoDidNotShow === 'owner') {
      this.outcome.attended.student = true;
      this.outcome.attended.owner = false;
    }
    await this.save();
    return this;
  } catch (error) {
    throw new Error('Error marking as no show: ' + error.message);
  }
};

// Static method to find upcoming meetings for reminders
meetingSchema.statics.findUpcomingForReminders = function() {
  const now = new Date();
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  return this.find({
    status: 'confirmed',
    confirmedDate: {
      $gte: now,
      $lte: oneDayLater
    },
    $or: [
      { 'remindersSent.student.oneDayBefore': false },
      { 'remindersSent.owner.oneDayBefore': false },
      {
        confirmedDate: { $lte: oneHourLater },
        $or: [
          { 'remindersSent.student.oneHourBefore': false },
          { 'remindersSent.owner.oneHourBefore': false }
        ]
      }
    ]
  });
};

const Meeting = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);

export default Meeting;