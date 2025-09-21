import crypto from 'crypto';

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate secure OTP using crypto
export const generateSecureOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }

  return otp;
};

// In-memory OTP storage (use Redis in production)
const otpStore = new Map();

// Rate limiting storage
const rateLimitStore = new Map();

// Store OTP with metadata
export const storeOTP = (identifier, otp, expiryMinutes = 5, purpose = 'verification') => {
  const expiryTime = Date.now() + (expiryMinutes * 60 * 1000);

  otpStore.set(identifier, {
    otp,
    expiryTime,
    attempts: 0,
    purpose,
    createdAt: Date.now()
  });

  // Auto-cleanup expired OTPs after expiry + 5 minutes
  setTimeout(() => {
    if (otpStore.has(identifier)) {
      const stored = otpStore.get(identifier);
      if (Date.now() > stored.expiryTime) {
        otpStore.delete(identifier);
      }
    }
  }, (expiryMinutes + 5) * 60 * 1000);
};

// Verify OTP with enhanced security
export const verifyOTP = (identifier, inputOtp, purpose = 'verification') => {
  const stored = otpStore.get(identifier);

  if (!stored) {
    return { valid: false, error: 'OTP not found or expired' };
  }

  // Check if OTP is expired
  if (Date.now() > stored.expiryTime) {
    otpStore.delete(identifier);
    return { valid: false, error: 'OTP expired' };
  }

  // Check purpose match
  if (stored.purpose !== purpose) {
    return { valid: false, error: 'Invalid OTP purpose' };
  }

  // Increment attempts
  stored.attempts += 1;

  // Check max attempts
  if (stored.attempts > 3) {
    otpStore.delete(identifier);
    return { valid: false, error: 'Too many attempts. Please request a new OTP.' };
  }

  // Verify OTP
  if (stored.otp === inputOtp) {
    otpStore.delete(identifier);
    return { valid: true };
  }

  return { valid: false, error: 'Invalid OTP code' };
};

// Rate limiting for OTP requests
export const checkRateLimit = (identifier, windowMs = 15 * 60 * 1000, maxAttempts = 5) => {
  const now = Date.now();
  const key = `rate_${identifier}`;

  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, {
      attempts: 1,
      resetTime: now + windowMs
    });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  const rateData = rateLimitStore.get(key);

  // Reset if window expired
  if (now > rateData.resetTime) {
    rateLimitStore.set(key, {
      attempts: 1,
      resetTime: now + windowMs
    });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  // Check if limit exceeded
  if (rateData.attempts >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: rateData.resetTime,
      error: 'Rate limit exceeded. Please try again later.'
    };
  }

  // Increment attempts
  rateData.attempts += 1;
  rateLimitStore.set(key, rateData);

  return {
    allowed: true,
    remaining: maxAttempts - rateData.attempts
  };
};

// Clean up expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

// Get OTP status for debugging
export const getOTPStatus = (identifier) => {
  const stored = otpStore.get(identifier);
  if (!stored) return null;

  return {
    exists: true,
    expired: Date.now() > stored.expiryTime,
    attempts: stored.attempts,
    purpose: stored.purpose,
    timeRemaining: Math.max(0, stored.expiryTime - Date.now())
  };
};

// Clear OTP (for testing or manual cleanup)
export const clearOTP = (identifier) => {
  return otpStore.delete(identifier);
};

// Clear rate limit (for testing)
export const clearRateLimit = (identifier) => {
  return rateLimitStore.delete(`rate_${identifier}`);
};