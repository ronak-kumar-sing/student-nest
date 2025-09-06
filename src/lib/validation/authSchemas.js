import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "Include an uppercase letter")
  .regex(/\d/, "Include a number")
  .regex(/[^A-Za-z0-9]/, "Include a special character")

export const emailSchema = z.string().email("Enter a valid email")

export const phoneSchema = z
  .string()
  .regex(/^\+?\d{10,15}$/, "Enter a valid phone number")

export const otpSchema = z.string().regex(/^\d{6}$/, "Enter 6-digit OTP")

export const studentSignupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  collegeId: z.string().min(2, "College ID is required"),
  collegeName: z.string().min(2, "College name is required"),
})

export const ownerSignupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
})

export const loginSchema = z.object({
  identifier: z.string().min(2, "Username or email is required"), // username or email
  password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const aadhaarVerificationSchema = z.object({
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Aadhaar number must be 12 digits"),
})
