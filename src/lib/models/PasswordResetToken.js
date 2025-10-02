import mongoose from 'mongoose';

const passwordResetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  hashedToken: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // TTL index for automatic cleanup
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  usedAt: {
    type: Date
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better performance
passwordResetTokenSchema.index({ userId: 1, expiresAt: 1 });
passwordResetTokenSchema.index({ hashedToken: 1, isUsed: 1 });

// Method to mark token as used
passwordResetTokenSchema.methods.markAsUsed = async function() {
  this.isUsed = true;
  this.usedAt = new Date();
  return this.save();
};

// Static method to cleanup expired tokens
passwordResetTokenSchema.statics.cleanupExpiredTokens = async function() {
  const now = new Date();
  const result = await this.deleteMany({
    $or: [
      { expiresAt: { $lt: now } },
      { isUsed: true }
    ]
  });

  if (result.deletedCount > 0) {
    console.log(`🧹 Cleaned up ${result.deletedCount} expired/used password reset tokens`);
  }

  return result;
};

// Static method to find valid token
passwordResetTokenSchema.statics.findValidToken = async function(hashedToken) {
  return this.findOne({
    hashedToken,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  }).populate('userId', 'email fullName role');
};

export default mongoose.models.PasswordResetToken || mongoose.model('PasswordResetToken', passwordResetTokenSchema);