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
  .min(1, "Phone number is required")
  .transform((phone) => {
    // Auto-add +91 for Indian numbers if not present
    let cleaned = phone.trim();

    // Remove any spaces, dashes, or parentheses
    cleaned = cleaned.replace(/[\s\-\(\)]/g, '');

    // If it's a 10-digit number without country code, add +91
    if (/^\d{10}$/.test(cleaned)) {
      cleaned = '+91' + cleaned;
    }

    // If it starts with 91 but no +, add the +
    if (/^91\d{10}$/.test(cleaned)) {
      cleaned = '+' + cleaned;
    }

    return cleaned;
  })
  .refine((phone) => /^\+91\d{10}$/.test(phone), {
    message: "Please provide a valid 10-digit Indian mobile number"
  });

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
  // Auto-add +91 for Indian numbers if not present
  let cleaned = phone.trim();

  // Remove any spaces, dashes, or parentheses
  cleaned = cleaned.replace(/[\s\-\(\)]/g, '');

  // If it's a 10-digit number without country code, add +91
  if (/^\d{10}$/.test(cleaned)) {
    cleaned = '+91' + cleaned;
  }

  // If it starts with 91 but no +, add the +
  if (/^91\d{10}$/.test(cleaned)) {
    cleaned = '+' + cleaned;
  }

  return cleaned;
};

// Helper function to normalize email
export const normalizeEmail = (email) => {
  return email.toLowerCase().trim();
};
