import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Generate access token
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'student-nest',
    audience: 'student-nest-users'
  });
};

// Generate refresh token
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'student-nest',
    audience: 'student-nest-users'
  });
};

// Verify access token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'student-nest',
      audience: 'student-nest-users'
    });
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'student-nest',
      audience: 'student-nest-users'
    });
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// Generate tokens for user
export const generateTokens = (user) => {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ userId: user._id.toString() });

  return { accessToken, refreshToken };
};

// Generate secure random token for password reset
export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate secure random string
export const generateSecureRandom = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Hash token for storage (one-way)
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Verify hashed token
export const verifyHashedToken = (token, hashedToken) => {
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return hash === hashedToken;
};