import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "Include an uppercase letter")
  .regex(/\d/, "Include a number")
  .regex(/[^A-Za-z0-9]/, "Include a special character");

export const emailSchema = z.string().email("Enter a valid email");

export const phoneSchema = z
  .string()
  .regex(/^\+?\d{10,15}$/, "Enter a valid phone number");

export const otpSchema = z.string().regex(/^\d{6}$/, "Enter 6-digit OTP");

export const studentSignupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  collegeId: z.string().min(2, "College ID is required"),
  collegeName: z.string().min(2, "College name is required"),
  course: z.string().optional(),
  yearOfStudy: z.number().min(1).max(6).optional()
});

export const ownerSignupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  businessName: z.string().optional(),
  businessType: z.enum(['individual', 'company', 'partnership']).optional()
});

export const loginSchema = z.object({
  identifier: z.string().min(2, "Email or phone is required"), // username or email or phone
  password: z.string().min(1, "Password is required"),
  role: z.enum(['student', 'owner', 'Student', 'Owner']).optional().transform(val => val?.toLowerCase())
});

export const forgotPasswordSchema = z.object({
  identifier: emailSchema.or(phoneSchema)
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const otpVerificationSchema = z.object({
  identifier: emailSchema.or(phoneSchema),
  code: otpSchema,
  type: z.enum(['email', 'phone'])
});

export const aadhaarVerificationSchema = z.object({
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Aadhaar number must be 12 digits"),
  documents: z.array(z.object({
    type: z.string(),
    url: z.string().url()
  })).optional()
});

// Helper function to validate and sanitize phone numbers
export const sanitizePhone = (phone) => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Add +91 for Indian numbers if not present
  if (cleaned.length === 10 && !cleaned.startsWith('+')) {
    return '+91' + cleaned;
  }

  return cleaned;
};

// Helper function to normalize email
export const normalizeEmail = (email) => {
  return email.toLowerCase().trim();
};
