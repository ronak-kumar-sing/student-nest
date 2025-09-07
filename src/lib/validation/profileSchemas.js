import { z } from "zod";

// Base profile schemas
export const baseProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  avatar: z.string().url().optional(),
});

// Student profile schemas
export const studentProfileSchema = baseProfileSchema.extend({
  collegeId: z.string().min(3, "College ID must be at least 3 characters"),
  collegeName: z.string().min(2, "College name is required"),
  yearOfStudy: z.enum(['1st', '2nd', '3rd', '4th', 'graduate']),
  course: z.string().min(2, "Course name is required"),
});

export const studentPreferencesSchema = z.object({
  roomTypePreference: z.array(z.string()).min(1, "Select at least one room type"),
  budgetMin: z.number().min(0, "Minimum budget must be positive"),
  budgetMax: z.number().min(0, "Maximum budget must be positive"),
  locationPreferences: z.array(z.string()).optional(),
  amenityPreferences: z.array(z.string()).optional(),
}).refine((data) => data.budgetMax >= data.budgetMin, {
  message: "Maximum budget must be greater than or equal to minimum budget",
  path: ["budgetMax"],
});

// Owner profile schemas
export const ownerProfileSchema = baseProfileSchema.extend({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.enum(['individual', 'company', 'trust']),
  experience: z.number().min(0, "Experience must be positive").max(50, "Experience seems too high"),
  businessAddress: z.string().min(10, "Business address is required"),
  businessPhone: z.string().regex(/^\+?\d{10,15}$/, "Enter a valid business phone number"),
  businessEmail: z.string().email("Enter a valid business email"),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Enter a valid GST number").optional(),
});

// Verification schemas
export const studentVerificationSchema = z.object({
  collegeIdDocument: z.instanceof(File, { message: "College ID document is required" })
    .refine((file) => file.size <= 5000000, "File size should be less than 5MB")
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type),
      "Only JPEG, PNG, and PDF files are allowed"
    ),
});

export const ownerVerificationSchema = z.object({
  aadhaarDocument: z.instanceof(File, { message: "Aadhaar document is required" })
    .refine((file) => file.size <= 5000000, "File size should be less than 5MB")
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type),
      "Only JPEG, PNG, and PDF files are allowed"
    ),
  panDocument: z.instanceof(File, { message: "PAN document is required" })
    .refine((file) => file.size <= 5000000, "File size should be less than 5MB")
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type),
      "Only JPEG, PNG, and PDF files are allowed"
    ),
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Aadhaar number must be 12 digits"),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter a valid PAN number"),
});

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/\d/, "Password must include a number")
    .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

// Notification preferences schema
export const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  meetingReminders: z.boolean(),
  propertyUpdates: z.boolean(),
  messageNotifications: z.boolean(),
});

// Avatar upload schema
export const avatarUploadSchema = z.object({
  avatar: z.instanceof(File, { message: "Avatar image is required" })
    .refine((file) => file.size <= 2000000, "File size should be less than 2MB")
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type),
      "Only JPEG, PNG, WebP files are allowed"
    ),
});

// Privacy settings schema
export const privacySettingsSchema = z.object({
  showProfileToUsers: z.boolean(),
  showContactInformation: z.boolean(),
  showActivityStatus: z.boolean(),
  allowDirectMessages: z.boolean(),
  showOnlineStatus: z.boolean(),
});

// Student settings schema
export const studentSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  roomRecommendations: z.boolean(),
  profileVisibility: z.enum(['public', 'private', 'verified']),
  showContactInfo: z.boolean(),
  allowMessages: z.boolean(),
  language: z.string(),
  timezone: z.string(),
});

// Owner settings schema
export const ownerSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  bookingNotifications: z.boolean(),
  inquiryNotifications: z.boolean(),
  paymentNotifications: z.boolean(),
  profileVisibility: z.enum(['public', 'private', 'verified']),
  showContactInfo: z.boolean(),
  allowMessages: z.boolean(),
  autoReply: z.boolean(),
  instantBooking: z.boolean(),
  showPricing: z.boolean(),
  language: z.string(),
  timezone: z.string(),
  currency: z.string(),
});

// Owner business schema
export const ownerBusinessSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(2, "Business type is required"),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  businessDescription: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  experience: z.string().optional(),
  propertyTypes: z.array(z.string()).optional(),
  serviceAreas: z.array(z.string()).optional(),
  businessAddress: z.string().optional(),
  businessPhone: z.string().optional(),
  businessEmail: z.string().email("Enter a valid email").optional(),
  websiteUrl: z.string().url("Enter a valid URL").optional(),
  socialMedia: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
});
