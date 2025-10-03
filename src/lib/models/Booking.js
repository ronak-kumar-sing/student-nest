import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  room: {
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

  // Booking dates
  moveInDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date >= new Date();
      },
      message: 'Move-in date must be in the future'
    }
  },
  moveOutDate: {
    type: Date
  },

  // Booking duration in months
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 60 // 5 years max
  },

  // Financial details
  monthlyRent: {
    type: Number,
    required: true,
    min: 0
  },
  securityDeposit: {
    type: Number,
    required: true,
    min: 0
  },
  maintenanceCharges: {
    type: Number,
    default: 0,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },

  // Booking status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected'],
    default: 'pending'
  },

  // Payment information
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentDetails: {
    securityDepositPaid: {
      type: Number,
      default: 0
    },
    firstMonthRentPaid: {
      type: Number,
      default: 0
    },
    maintenancePaid: {
      type: Number,
      default: 0
    },
    totalPaid: {
      type: Number,
      default: 0
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'cash', 'bank_transfer', 'upi']
    },
    transactionId: String,
    paymentDate: Date
  },

  // Agreement details
  agreementType: {
    type: String,
    enum: ['monthly', 'quarterly', 'half_yearly', 'yearly'],
    default: 'monthly'
  },
  agreementDocument: {
    url: String,
    uploadedAt: Date
  },

  // Communication and notes
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
  adminNotes: {
    type: String,
    maxlength: 1000,
    trim: true
  },

  // Dates for tracking
  confirmedAt: Date,
  rejectedAt: Date,
  cancelledAt: Date,
  completedAt: Date,

  // Cancellation details
  cancellationReason: {
    type: String,
    maxlength: 500
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundStatus: {
    type: String,
    enum: ['not_applicable', 'pending', 'processed', 'failed'],
    default: 'not_applicable'
  },

  // Reviews
  studentReviewSubmitted: {
    type: Boolean,
    default: false
  },
  ownerReviewSubmitted: {
    type: Boolean,
    default: false
  },

  // Extension requests
  extensionRequests: [{
    requestedDuration: Number, // in months
    requestedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    ownerResponse: String,
    responseAt: Date
  }],

  // Check-in/Check-out
  checkInDetails: {
    checkInDate: Date,
    checkInTime: String,
    checkInPhotos: [String],
    checkInNotes: String,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  checkOutDetails: {
    checkOutDate: Date,
    checkOutTime: String,
    checkOutPhotos: [String],
    checkOutNotes: String,
    damageAssessment: [{
      description: String,
      photos: [String],
      estimatedCost: Number
    }],
    finalRefundAmount: Number,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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
bookingSchema.index({ 'student': 1, 'status': 1 });
bookingSchema.index({ 'owner': 1, 'status': 1 });
bookingSchema.index({ 'room': 1, 'status': 1 });
bookingSchema.index({ 'moveInDate': 1, 'status': 1 });
bookingSchema.index({ 'paymentStatus': 1 });
bookingSchema.index({ 'createdAt': -1 });
bookingSchema.index({ 'status': 1, 'createdAt': -1 });

// Virtual for booking duration in days
bookingSchema.virtual('durationInDays').get(function() {
  if (this.moveOutDate && this.moveInDate) {
    const timeDiff = this.moveOutDate.getTime() - this.moveInDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  return null;
});

// Virtual for total contract value
bookingSchema.virtual('totalContractValue').get(function() {
  return this.monthlyRent * this.duration + this.securityDeposit + (this.maintenanceCharges * this.duration);
});

// Pre-save middleware to calculate move-out date and total amount
bookingSchema.pre('save', function(next) {
  // Calculate move-out date based on duration
  if (this.moveInDate && this.duration && !this.moveOutDate) {
    const moveOutDate = new Date(this.moveInDate);
    moveOutDate.setMonth(moveOutDate.getMonth() + this.duration);
    this.moveOutDate = moveOutDate;
  }

  // Calculate total amount (first month + security deposit + maintenance)
  if (!this.totalAmount) {
    this.totalAmount = this.monthlyRent + this.securityDeposit + this.maintenanceCharges;
  }

  next();
});

// Method to confirm booking
bookingSchema.methods.confirmBooking = async function() {
  try {
    this.status = 'confirmed';
    this.confirmedAt = new Date();

    // Update room occupancy
    const Room = mongoose.model('Room');
    const room = await Room.findById(this.room);
    if (room) {
      room.occupiedRooms += 1;
      room.totalBookings += 1;
      await room.save();
    }

    await this.save();
    return this;
  } catch (error) {
    throw new Error('Error confirming booking: ' + error.message);
  }
};

// Method to cancel booking
bookingSchema.methods.cancelBooking = async function(reason, cancelledBy) {
  try {
    this.status = 'cancelled';
    this.cancelledAt = new Date();
    this.cancellationReason = reason;
    this.cancelledBy = cancelledBy;

    // If booking was confirmed, update room occupancy
    if (this.confirmedAt) {
      const Room = mongoose.model('Room');
      const room = await Room.findById(this.room);
      if (room && room.occupiedRooms > 0) {
        room.occupiedRooms -= 1;
        await room.save();
      }
    }

    await this.save();
    return this;
  } catch (error) {
    throw new Error('Error cancelling booking: ' + error.message);
  }
};

// Method to complete booking
bookingSchema.methods.completeBooking = async function() {
  try {
    this.status = 'completed';
    this.completedAt = new Date();

    // Update room occupancy
    const Room = mongoose.model('Room');
    const room = await Room.findById(this.room);
    if (room && room.occupiedRooms > 0) {
      room.occupiedRooms -= 1;
      room.monthlyRevenue += this.monthlyRent * this.duration;
      await room.save();
    }

    await this.save();
    return this;
  } catch (error) {
    throw new Error('Error completing booking: ' + error.message);
  }
};

// Method to check if booking is active
bookingSchema.methods.isActive = function() {
  const now = new Date();
  return this.status === 'active' &&
         this.moveInDate <= now &&
         (!this.moveOutDate || this.moveOutDate >= now);
};

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;