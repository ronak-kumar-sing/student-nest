import mongoose from 'mongoose';

// OTP Schema for email and phone verification
const otpSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    index: true // email or phone number
  },
  type: {
    type: String,
    enum: ['email', 'phone'],
    required: true
  },
  code: {
    type: String,
    required: true,
    length: 6
  },
  purpose: {
    type: String,
    enum: ['signup', 'login', 'password-reset', 'verification'],
    default: 'verification'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL index
  }
}, {
  timestamps: true
});

// Index for better performance
otpSchema.index({ identifier: 1, type: 1, isUsed: 1 });
otpSchema.index({ userId: 1 });

// Method to verify OTP
otpSchema.methods.verify = async function(inputCode) {
  if (this.isUsed) {
    throw new Error('OTP has already been used');
  }

  if (this.expiresAt < new Date()) {
    throw new Error('OTP has expired');
  }

  if (this.attempts >= 3) {
    throw new Error('Maximum verification attempts exceeded');
  }

  this.attempts += 1;

  if (this.code !== inputCode) {
    await this.save();
    throw new Error('Invalid OTP code');
  }

  this.isUsed = true;
  await this.save();
  return true;
};

// Static method to generate OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Static method to create and send OTP
otpSchema.statics.createOTP = async function(identifier, type, purpose = 'verification', userId = null) {
  // Invalidate any existing OTPs for this identifier and type
  await this.updateMany(
    { identifier, type, isUsed: false },
    { isUsed: true }
  );

  const code = this.generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const otp = new this({
    identifier,
    type,
    code,
    purpose,
    userId,
    expiresAt
  });

  await otp.save();
  return otp;
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function(identifier, type, code, purpose = 'verification') {
  try {
    // Find valid OTP
    const otp = await this.findOne({
      identifier,
      type,
      code,
      purpose,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otp) {
      return {
        success: false,
        message: 'Invalid or expired OTP'
      };
    }

    // Check attempts
    if (otp.attempts >= 3) {
      return {
        success: false,
        message: 'Maximum verification attempts exceeded'
      };
    }

    // Verify OTP using the instance method
    await otp.verify(code);

    return {
      success: true,
      message: 'OTP verified successfully'
    };
  } catch (error) {
    console.error('OTP verification error:', error);
    return {
      success: false,
      message: 'Verification failed'
    };
  }
};

export default mongoose.models.OTP || mongoose.model('OTP', otpSchema);