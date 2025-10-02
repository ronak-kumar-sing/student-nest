# Forgot Password Implementation

This document outlines the complete forgot password functionality implemented for Student Nest.

## Overview

The forgot password system uses OTP (One-Time Password) verification via email or SMS for secure password reset. The implementation follows security best practices including rate limiting, user enumeration protection, and secure token handling.

## Architecture

### Backend Components

1. **API Routes**
   - `/api/auth/forgot-password` - Request password reset OTP
   - `/api/auth/reset-password` - Reset password with OTP verification

2. **Models**
   - `User` - Base user model with password management
   - `OTP` - OTP storage and verification
   - `PasswordResetToken` - Alternative token-based approach (future enhancement)

3. **Utilities**
   - `email.js` - Email sending with OTP templates
   - `sms.js` - SMS sending via Twilio
   - `jwt.js` - Token generation and validation

### Frontend Components

1. **Pages**
   - `/forgot-password` - Request password reset form
   - `/reset-password` - Password reset form with OTP input

2. **Components**
   - `InputField` - Enhanced input with icon support
   - `PasswordInput` - Secure password input with strength indicator

## API Endpoints

### POST /api/auth/forgot-password

Request password reset OTP for email or phone number.

**Request Body:**
```json
{
  "identifier": "user@example.com" // or phone number
}
```

**Response:**
```json
{
  "success": true,
  "message": "If an account with this email/phone exists, you will receive a password reset code."
}
```

**Features:**
- Rate limiting (3 requests per 15 minutes)
- User enumeration protection
- Email and SMS support
- Account status validation

### POST /api/auth/reset-password

Reset password using OTP verification.

**Request Body:**
```json
{
  "identifier": "user@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successfully. Please log in with your new password."
}
```

**Features:**
- OTP verification
- Password strength validation
- Login attempt reset
- Session invalidation

## Security Features

### Rate Limiting
- Forgot password: 3 attempts per 15 minutes per IP/identifier
- Reset password: 5 attempts per 15 minutes per IP/identifier

### User Enumeration Protection
- Always returns success response regardless of user existence
- Consistent response timing
- No indication if user exists or not

### OTP Security
- 6-digit random codes
- 5-minute expiration
- Maximum 3 verification attempts
- Automatic cleanup of expired codes

### Password Security
- Minimum 8 characters
- Must include uppercase, lowercase, number, special character
- Bcrypt hashing with 12 rounds
- Password strength indicator

## Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/student-nest-dev

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret

# Email Service (choose one)
EMAIL_SERVICE=mock # or gmail, sendgrid, smtp
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# SMS Service
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number

# Security Settings
BCRYPT_ROUNDS=12
OTP_EXPIRY_MINUTES=5
PASSWORD_RESET_EXPIRY_HOURS=1
MAX_LOGIN_ATTEMPTS=5
```

## Frontend Flow

1. **Request Reset**
   - User enters email/phone on `/forgot-password`
   - System sends OTP via email/SMS
   - User sees success message

2. **Reset Password**
   - User navigates to `/reset-password`
   - Enters identifier, OTP, and new password
   - System validates OTP and updates password
   - User redirected to login

## Email Templates

The system includes responsive HTML email templates:
- OTP verification email with branding
- Password reset confirmation
- Security tips and best practices

## SMS Templates

SMS messages are concise and include:
- OTP code
- Expiration time
- App branding

## Error Handling

### Common Errors
- Invalid email/phone format
- Rate limit exceeded
- Invalid or expired OTP
- Weak password
- Account locked/inactive

### User-Friendly Messages
- Clear error descriptions
- Helpful suggestions
- No sensitive information disclosure

## Testing

Use the provided test script:

```bash
# Install dependencies
npm install node-fetch

# Run tests
node scripts/test-forgot-password.js
```

Test cases include:
- Valid and invalid identifiers
- Rate limiting scenarios
- OTP verification
- Password strength validation

## Integration Points

### Login Pages
Forgot password links added to:
- `/student/login`
- `/owner/login`

Both link to `/forgot-password` for unified experience.

### Navigation
- Back buttons for easy navigation
- Consistent UI/UX across auth flows
- Responsive design for all devices

## Monitoring & Logging

The system logs:
- Password reset requests
- OTP generation and verification
- Failed attempts and rate limiting
- Email/SMS delivery status

## Future Enhancements

1. **Token-based Reset** (alternative to OTP)
   - Secure URLs with time-limited tokens
   - Single-use token validation

2. **Two-Factor Authentication**
   - Enhanced security for sensitive accounts
   - Multiple verification methods

3. **Account Recovery**
   - Alternative verification methods
   - Admin-assisted recovery

4. **Analytics**
   - Reset request patterns
   - Success/failure rates
   - User behavior insights

## Troubleshooting

### Common Issues

1. **OTP not received**
   - Check spam folder
   - Verify email/phone format
   - Check service provider status

2. **OTP expired/invalid**
   - Request new code
   - Check system time synchronization
   - Verify rate limits

3. **Password validation errors**
   - Check strength requirements
   - Use password strength indicator
   - Clear error messages

### Debug Mode

Enable detailed logging:
```env
NODE_ENV=development
DEBUG=student-nest:*
```

This provides comprehensive logs for troubleshooting issues.

## Support

For issues or questions:
- Check logs for error details
- Verify environment configuration
- Test with provided scripts
- Check rate limiting status