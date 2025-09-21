import { NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';

/**
 * Shared utilities for OTP services
 * Centralizes common functionality across all OTP endpoints
 */

// Configuration for rate limiting
const RATE_LIMITING_ENABLED = false; // Set to true to enable rate limiting

// Rate limiters
export const sendRateLimiter = new RateLimiterMemory({
  keyGenerator: (req, identifier) => identifier,
  points: 3, // 3 OTP sends
  duration: 30, // per 30 seconds
});

export const verifyRateLimiter = new RateLimiterMemory({
  keyGenerator: (req, identifier) => `${req.ip || 'unknown'}-${identifier}`,
  points: 15, // 15 verification attempts
  duration: 2 * 60, // per 2 minutes
});

/**
 * Extract client IP from request headers
 */
export const getClientIP = (request) => {
  return request.headers.get('x-forwarded-for') ||
         request.headers.get('x-real-ip') ||
         'unknown';
};

/**
 * Handle validation errors with consistent formatting
 */
export const handleValidationError = (error) => {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      message: error.errors?.[0]?.message || 'Invalid input data'
    },
    { status: 400 }
  );
};

/**
 * Handle rate limiting with consistent messaging
 */
export const handleRateLimit = async (rateLimiter, key, errorMessage) => {
  if (!RATE_LIMITING_ENABLED) {
    return null; // Rate limiting disabled
  }

  try {
    await rateLimiter.consume(key);
    return null; // No rate limit hit
  } catch (rateLimiterRes) {
    const waitTime = Math.round(rateLimiterRes.msBeforeNext / 1000);
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests',
        message: `${errorMessage} ${waitTime} seconds before requesting another OTP`,
        retryAfter: waitTime
      },
      { status: 429 }
    );
  }
};

/**
 * Handle generic errors with consistent formatting
 */
export const handleError = (error, operation) => {
  console.error(`${operation} error:`, error);
  return NextResponse.json(
    {
      success: false,
      error: `${operation} failed`,
      message: `Unable to ${operation.toLowerCase()}. Please try again later.`
    },
    { status: 500 }
  );
};

/**
 * Create success response for OTP send operations
 */
export const createSendSuccessResponse = (type, identifier, provider) => {
  const responseType = type === 'phone' ? 'phone' : 'email';
  return NextResponse.json({
    success: true,
    message: `OTP sent to your ${responseType} successfully`,
    data: {
      [responseType]: identifier,
      expiresIn: 5 * 60, // 5 minutes in seconds
      provider
    }
  });
};

/**
 * Create success response for OTP verification operations
 */
export const createVerifySuccessResponse = (type) => {
  const responseType = type === 'phone' ? 'Phone' : 'Email';
  return NextResponse.json({
    success: true,
    message: `${responseType} verified successfully`
  });
};

/**
 * Create error response for invalid OTP verification
 */
export const createVerifyErrorResponse = (verification) => {
  return NextResponse.json(
    {
      success: false,
      error: 'Invalid OTP',
      message: verification.message
    },
    { status: 400 }
  );
};