# Student Nest - AI Coding Agent Instructions

## Project Overview

Student Nest is a Next.js 13+ application for student accommodation matching, connecting students with property owners. Built with App Router, MongoDB, and includes comprehensive authentication, verification, and communication systems.

## Architecture & Key Patterns

### 1. Authentication Flow
- **Dual User Types**: Students (collegeId-based) and Owners (business-based) with separate registration flows
- **OTP Verification**: Required for both email/phone during signup via `/api/otp/{email,phone}/{send,verify}`
- **Mock→Real Pattern**: Currently using mock services, designed for Twilio/SendGrid integration
- **Verification Pipeline**: Owner accounts require multi-step verification (email→phone→documents→business)

### 2. Database Architecture (MongoDB + Mongoose)
```javascript
// Discriminator pattern for user types
User (base) → Student | Owner
```
- **Key Models**: `src/lib/models/{User,Student,Owner}.js`
- **Validation**: Zod schemas in `src/lib/validation/`
- **Connection**: Singleton pattern in `src/lib/db/connection.js`

### 3. API Structure
```
src/app/api/
├── auth/
│   ├── {login,refresh}/route.js
│   ├── {student,owner}/signup/route.js
│   └── forgot-password/route.js
├── otp/
│   └── {email,phone}/{send,verify}/route.js  # Ready for Twilio/SendGrid
├── verification/
│   └── {aadhaar,digilocker}/initiate/route.js
└── profile/{student,owner}/route.js
```

### 4. Frontend Patterns
- **Form Handling**: `react-hook-form` + Zod validation
- **OTP Component**: `src/components/forms/OtpModal.jsx` (reusable 6-digit input)
- **State Management**: localStorage for auth tokens + user data
- **API Client**: Centralized in `src/lib/api.js` with token management

## SMS/Email Integration Guide

### Current State → Target Implementation

**Replace these mock services with real Twilio/SendGrid:**

1. **Email Service** (`src/lib/utils/email.js`)
   ```javascript
   // CURRENT: Mock console.log emails
   // TARGET: SendGrid integration with templates
   ```

2. **SMS Service** (`src/lib/utils/sms.js`)
   ```javascript
   // CURRENT: Mock console.log SMS
   // TARGET: Twilio SMS + WhatsApp integration
   ```

### Implementation Pattern
```javascript
// Environment-based service switching
const SERVICE_TYPE = process.env.EMAIL_SERVICE || 'mock';

if (SERVICE_TYPE === 'sendgrid') {
  // Use SendGrid
} else {
  // Use mock service for development
}
```

### Required Environment Variables
```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Gmail SMTP (Alternative)
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# Service toggles
EMAIL_SERVICE=sendgrid  # 'mock', 'sendgrid', 'gmail', 'smtp'
PHONE_SERVICE=twilio    # 'mock', 'twilio'
PHONE_OTP_SENDER_ID=STDNST

# OTP Configuration
OTP_EXPIRY_MINUTES=5
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_ATTEMPTS=5
```

### Key Integration Points

1. **Implemented Services**
   - ✅ Twilio SMS + WhatsApp with fallback (`src/lib/twilio.js`)
   - ✅ SendGrid + Gmail SMTP with mock fallback (`src/lib/utils/email.js`)
   - ✅ Enhanced OTP system with database storage (`src/lib/otp.js`)
   - ✅ Notification service for all app events (`src/lib/services/NotificationService.js`)

2. **Smart Service Switching**
   ```javascript
   // Environment-based service switching
   if (PHONE_SERVICE === 'twilio') {
     // Try WhatsApp first (cheaper), fallback to SMS
     result = await sendWhatsApp(phone, message);
   } else {
     // Use mock service for development
   }
   ```

3. **Database-backed OTP System**
   - MongoDB OTP model with TTL expiration
   - Rate limiting with RateLimiterMemory
   - 3 attempts max, 5-minute expiry
   - Automatic cleanup of expired OTPs

4. **Notification Triggers**
   - Welcome messages on signup completion
   - Meeting request/confirmation/cancellation
   - Verification status updates
   - Payment confirmations
   - Property inquiries

## Development Workflows

### Testing Commands
```bash
# Database seeding with test users
npm run seed

# Test SMS/Email services health
curl -X GET http://localhost:3000/api/health/services

# Test OTP flow with real services
curl -X POST http://localhost:3000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","type":"email"}'

# Test notification service
curl -X POST http://localhost:3000/api/health/services \
  -H "Content-Type: application/json" \
  -d '{"service":"email","action":"test"}'

# Run with different service configurations
EMAIL_SERVICE=mock PHONE_SERVICE=mock npm run dev
EMAIL_SERVICE=sendgrid PHONE_SERVICE=twilio npm run dev
```

### Service Architecture

```
Notification Flow:
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Action   │ -> │ NotificationService │ -> │ SMS/Email Utils │
│ (signup, etc.)  │    │                  │    │ (Twilio/SendGrid)│
└─────────────────┘    └──────────────────┘    └─────────────────┘

OTP Flow:
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Frontend Request│ -> │   OTP API Route  │ -> │ Database Storage│
│   (send/verify) │    │ (rate limited)   │    │ (MongoDB + TTL) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Database Operations
```bash
# Connect to MongoDB
# Check connection: src/lib/db/connection.js
# Seed data: scripts/seed.js (test students/owners)
```

## Critical Code Patterns

### 1. OTP Verification Flow
```javascript
// Pattern used in signup pages
const [otpChannel, setOtpChannel] = useState(false)
const [emailVerified, setEmailVerified] = useState(false)

// Send OTP
await fetch(`/api/otp/${channel}/send`, {
  method: 'POST',
  body: JSON.stringify({ value })
})

// Verify with OtpModal component
<OtpModal
  open={otpOpen}
  channel={otpChannel}
  onVerify={verifyOtp}
  onResend={resendOtp}
/>
```

### 2. User Context Pattern
```javascript
// User data stored in localStorage, checked in useEffect
const [user, setUser] = useState(null)
useEffect(() => {
  const userData = localStorage.getItem('user')
  if (userData) setUser(JSON.parse(userData))
}, [])
```

### 3. API Client Pattern
```javascript
// Centralized API calls with token management
import { sendEmailOtp, verifyEmailOtp } from '@/lib/api'

// Automatic token attachment for authenticated routes
```

## File Structure Conventions

- **Pages**: App Router in `src/app/` with route groups `(auth)`, `(dashboard)`
- **Components**: Organized by feature in `src/components/{auth,forms,dashboard}`
- **Utils**: Shared utilities in `src/lib/utils/`
- **Models**: Mongoose schemas in `src/lib/models/`
- **Validation**: Zod schemas in `src/lib/validation/`

## Integration Checklist

✅ **Completed Implementations:**
- [x] Twilio client configuration with error handling
- [x] SendGrid + Gmail SMTP email service with fallbacks
- [x] Enhanced OTP system with database storage & rate limiting
- [x] Notification service for all user events
- [x] Environment-based service switching
- [x] Message templates for OTP, welcome, meetings, verification
- [x] Rate limiting on OTP endpoints (RateLimiterMemory)
- [x] Service health check endpoint
- [x] WhatsApp integration with SMS fallback
- [x] Email templates for all notification types

🔧 **Production Setup:**
- [ ] Configure Twilio account with phone number
- [ ] Set up SendGrid account and verify sender domain
- [ ] Add production environment variables
- [ ] Test with real phone numbers and email addresses
- [ ] Monitor usage/costs with service dashboards
- [ ] Set up Redis for OTP storage (optional but recommended)

📱 **Usage Examples:**
```javascript
// Send notification using NotificationService
import NotificationService from '@/lib/services/NotificationService';

// Meeting request notification
await NotificationService.sendMeetingRequest(
  owner.email,
  owner.phone,
  {
    studentName: 'John Doe',
    propertyName: 'Cozy Studio Apartment',
    requestedDate: '2024-01-15',
    requestedTime: '2:00 PM'
  }
);

// Verification status update
await NotificationService.sendVerificationStatusUpdate(
  user.email,
  user.phone,
  'verified',
  user.fullName
);
```

## Common Issues & Solutions

### Authentication Issues
- Check JWT_SECRET in environment
- Verify token storage in localStorage
- Use `/api/auth/refresh` for token renewal

### Database Connection
- MongoDB URI in MONGODB_URI env var
- Use connection singleton pattern
- Check network access for MongoDB Atlas

### OTP Development
- Use fixed "123456" for mock testing
- Switch EMAIL_SERVICE/PHONE_SERVICE env vars
- Check console logs for mock message content

## Testing Data

Reference `scripts/seed.js` for complete test users:
- **Students**: priya.sharma@gmail.com / Student123!
- **Owners**: vikram.patel@gmail.com / Owner123!

All test users have pre-verified email/phone for easier testing.