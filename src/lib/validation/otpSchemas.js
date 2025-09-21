import { z } from 'zod';

/**
 * Shared validation schemas for OTP services
 * Centralizes validation logic to reduce code duplication
 */

// Phone number validation and transformation
export const phoneTransform = (phone) => {
  let cleanPhone = phone.trim();

  // Remove any spaces, dashes, or parentheses
  cleanPhone = cleanPhone.replace(/[\s\-\(\)]/g, '');

  // If it's a 10-digit number without country code, add +91
  if (/^\d{10}$/.test(cleanPhone)) {
    cleanPhone = '+91' + cleanPhone;
  }

  // If it starts with 91 but no +, add the +
  if (/^91\d{10}$/.test(cleanPhone)) {
    cleanPhone = '+' + cleanPhone;
  }

  // Validate final format
  if (!/^\+91\d{10}$/.test(cleanPhone)) {
    throw new Error('Please provide a valid 10-digit Indian mobile number');
  }

  return cleanPhone;
};

// Base schemas
export const emailSchema = z.string()
  .email('Please provide a valid email address')
  .min(1, 'Email is required');

export const phoneSchema = z.string()
  .min(1, 'Phone number is required')
  .transform(phoneTransform);

export const otpCodeSchema = z.string()
  .length(6, 'OTP must be 6 digits')
  .regex(/^\d{6}$/, 'OTP must be 6 digits');

export const purposeSchema = z.enum(['verification', 'password_reset'])
  .default('verification');

// Email OTP schemas
export const sendEmailOTPSchema = z.object({
  value: emailSchema,
  purpose: purposeSchema
});

export const verifyEmailOTPSchema = z.object({
  value: emailSchema,
  code: otpCodeSchema
});

// Phone OTP schemas
export const sendPhoneOTPSchema = z.object({
  value: phoneSchema,
  purpose: purposeSchema
});

export const verifyPhoneOTPSchema = z.object({
  value: phoneSchema,
  code: otpCodeSchema
});

// Unified OTP schemas
export const sendOTPSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  type: z.enum(['email', 'sms'], {
    errorMap: () => ({ message: 'Type must be either "email" or "sms"' })
  }),
  purpose: purposeSchema
});

export const verifyOTPSchema = z.object({
  identifier: z.string().min(1, 'Email or phone is required'),
  otp: otpCodeSchema,
  purpose: purposeSchema
});