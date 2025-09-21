# Student Nest Backend API Documentation

![Student Nest](./public/logo.png)

## 🏠 Overview

Student Nest is a comprehensive accommodation platform for students and property owners. This backend provides a robust authentication system, user management, and property booking functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Gmail account (for email services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd student-nest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://ronakkumar20062006:mdIdTUokzofZF5Pe@cluster0.969t4yr.mongodb.net/student-nest?retryWrites=true&w=majority

   # JWT Secrets
   JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_here_make_it_long_and_complex
   JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_here_make_it_different_and_long

   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=Student Nest <noreply@studentnest.com>

   # SMS Configuration (Optional)
   SMS_API_KEY=your_sms_api_key
   SMS_SENDER_ID=STDNEST

   # App Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_key_here
   ```

4. **Seed the database with test data**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000/api`

## 📊 Database Schema

### User Models

#### Student
```javascript
{
  fullName: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  collegeId: String,
  collegeName: String,
  course: String,
  yearOfStudy: Number,
  preferences: {
    budgetRange: { min: Number, max: Number },
    location: String,
    roomType: String,
    amenities: [String]
  },
  profileCompleteness: Number,
  isEmailVerified: Boolean,
  isPhoneVerified: Boolean,
  role: 'student'
}
```

#### Owner
```javascript
{
  fullName: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  businessName: String,
  businessType: String ('individual' | 'company'),
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  verification: {
    status: String ('pending' | 'verified' | 'rejected'),
    aadhaarNumber: String,
    digilockerLinked: Boolean,
    digilockerData: Object,
    verifiedAt: Date
  },
  totalProperties: Number,
  totalBookings: Number,
  averageRating: Number,
  responseTime: Number,
  isActive: Boolean,
  role: 'owner'
}
```

#### OTP
```javascript
{
  identifier: String, // email or phone
  otp: String,
  type: String ('email' | 'sms'),
  purpose: String ('verification' | 'password_reset'),
  attempts: Number,
  isUsed: Boolean,
  expiresAt: Date
}
```

## 🔐 Authentication API

### Base URL: `/api/auth`

### Student Registration
**POST** `/api/auth/student/signup`

```javascript
// Request Body
{
  "fullName": "John Doe",
  "email": "john.doe@gmail.com",
  "phone": "+919876543210",
  "password": "SecurePassword123!",
  "collegeId": "CS2024001",
  "collegeName": "Indian Institute of Technology, Delhi",
  "course": "Computer Science Engineering",
  "yearOfStudy": 3
}

// Success Response (201)
{
  "success": true,
  "message": "Student account created successfully",
  "data": {
    "user": { /* user object without password */ },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}

// Error Response (400)
{
  "success": false,
  "message": "Email already exists",
  "errors": []
}
```

### Owner Registration
**POST** `/api/auth/owner/signup`

```javascript
// Request Body
{
  "fullName": "Vikram Patel",
  "email": "vikram.patel@gmail.com",
  "phone": "+918765432109",
  "password": "SecurePassword123!",
  "businessName": "Patel Properties",
  "businessType": "company",
  "address": {
    "street": "Shop No. 15, Sector 18",
    "city": "Noida",
    "state": "Uttar Pradesh",
    "pincode": "201301",
    "country": "India"
  }
}

// Success Response (201)
{
  "success": true,
  "message": "Owner account created successfully",
  "data": {
    "user": { /* user object without password */ },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### User Login
**POST** `/api/auth/login`

```javascript
// Request Body
{
  "email": "john.doe@gmail.com",
  "password": "SecurePassword123!",
  "role": "student" // or "owner"
}

// Success Response (200)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john.doe@gmail.com",
      "role": "student",
      "isEmailVerified": true,
      "isPhoneVerified": true
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}

// Error Response (401)
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Token Refresh
**POST** `/api/auth/refresh`

```javascript
// Request Body
{
  "refreshToken": "jwt_refresh_token"
}

// Success Response (200)
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_access_token",
    "refreshToken": "new_jwt_refresh_token"
  }
}
```

### User Logout
**POST** `/api/auth/logout`

```javascript
// Headers
Authorization: Bearer jwt_access_token

// Request Body
{
  "refreshToken": "jwt_refresh_token"
}

// Success Response (200)
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Get User Profile
**GET** `/api/auth/me`

```javascript
// Headers
Authorization: Bearer jwt_access_token

// Success Response (200)
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john.doe@gmail.com",
      "role": "student",
      "isEmailVerified": true,
      "isPhoneVerified": true,
      // ... other user fields
    }
  }
}
```

## 📧 OTP Verification API

### Send OTP
**POST** `/api/otp/send`

```javascript
// Request Body
{
  "identifier": "john.doe@gmail.com", // email or phone
  "type": "email", // "email" or "sms"
  "purpose": "verification" // "verification" or "password_reset"
}

// Success Response (200)
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "expiresIn": 300 // seconds
  }
}
```

### Verify OTP
**POST** `/api/otp/verify`

```javascript
// Request Body
{
  "identifier": "john.doe@gmail.com",
  "otp": "123456",
  "purpose": "verification"
}

// Success Response (200)
{
  "success": true,
  "message": "OTP verified successfully"
}
```

## 🔍 Mock DigiLocker API

### Verify Aadhaar
**POST** `/api/verification/digilocker/verify`

```javascript
// Request Body
{
  "aadhaarNumber": "123456789012"
}

// Success Response (200)
{
  "success": true,
  "message": "Aadhaar verified successfully",
  "data": {
    "name": "John Doe",
    "dob": "1990-01-15",
    "gender": "M",
    "address": "123 Main Street, City, State - 123456"
  }
}

// Error Response (400)
{
  "success": false,
  "message": "Invalid Aadhaar number"
}
```

## 🧪 Test Data

The application comes with pre-seeded test data for easy testing:

### Test Students
| Name | Email | Password | College |
|------|-------|----------|---------|
| Priya Sharma | priya.sharma@gmail.com | Student123! | IIT Delhi |
| Rahul Kumar | rahul.kumar@gmail.com | Student123! | JNU |
| Anita Singh | anita.singh@gmail.com | Student123! | Delhi University |
| Amit Patel | amit.patel@gmail.com | Student123! | NSIT |
| Neha Gupta | neha.gupta@gmail.com | Student123! | IGDTUW |

### Test Owners
| Name | Email | Password | Business | Status |
|------|-------|----------|----------|--------|
| Vikram Patel | vikram.patel@gmail.com | Owner123! | Patel Properties | Verified |
| Sunita Agarwal | sunita.agarwal@gmail.com | Owner123! | Agarwal Student Housing | Verified |
| Rajesh Kumar | rajesh.kumar@gmail.com | Owner123! | Kumar Residency | Verified |
| Meera Joshi | meera.joshi@gmail.com | Owner123! | Joshi Accommodations | Pending |

## 🔒 Security Features

### Password Security
- Bcrypt hashing with salt rounds of 12
- Password complexity requirements
- Account lockout after 5 failed attempts

### Rate Limiting
- Login: 5 attempts per 15 minutes per IP
- OTP: 3 sends per 5 minutes per identifier
- Verification: 5 attempts per 15 minutes per IP

### JWT Security
- Access tokens: 1 hour expiry
- Refresh tokens: 7 days expiry
- Secure token storage recommendations
- Automatic token rotation

### Input Validation
- Zod schema validation for all inputs
- Email format validation
- Phone number format validation
- XSS protection through sanitization

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production:

```env
MONGODB_URI=your_production_mongodb_uri
JWT_ACCESS_SECRET=strong_production_access_secret
JWT_REFRESH_SECRET=strong_production_refresh_secret
EMAIL_USER=your_production_email
EMAIL_PASS=your_production_email_password
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=strong_nextauth_secret
```

### Production Checklist
- [ ] Update CORS settings for production domains
- [ ] Enable MongoDB connection encryption
- [ ] Set up proper logging and monitoring
- [ ] Configure rate limiting for production traffic
- [ ] Set up backup strategies for MongoDB
- [ ] Enable HTTPS in production
- [ ] Update password policies if needed

## 📝 API Response Format

All API responses follow a consistent format:

### Success Response
```javascript
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```javascript
{
  "success": false,
  "message": "Error message",
  "errors": [
    // Validation errors array (if applicable)
  ]
}
```

## 🐛 Error Handling

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Error Types
- Validation errors (Zod validation failures)
- Authentication errors (invalid credentials)
- Authorization errors (insufficient permissions)
- Rate limiting errors (too many requests)
- Database errors (connection issues)

## 🛠️ Development

### Project Structure
```
src/
├── app/
│   └── api/           # API routes
│       ├── auth/      # Authentication endpoints
│       ├── otp/       # OTP verification endpoints
│       └── verification/ # DigiLocker mock endpoints
├── lib/
│   ├── db/           # Database connection
│   ├── models/       # Mongoose models
│   ├── utils/        # Utility functions
│   └── validation/   # Zod schemas
└── utils/
    └── constants.js  # Application constants
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Seed database with test data
npm run db:reset     # Reset and seed database
```

## 📞 Support

For any issues or questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section below

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
Error: MongooseError: Operation `users.findOne()` buffering timed out
```
**Solution**: Check MongoDB URI and network connectivity

#### JWT Token Error
```bash
Error: JsonWebTokenError: invalid token
```
**Solution**: Verify JWT secrets in environment variables

#### Email Service Error
```bash
Error: Invalid login credentials
```
**Solution**: Check Gmail app password and EMAIL_USER/EMAIL_PASS variables

#### Rate Limiting Error
```bash
Error: Too Many Requests
```
**Solution**: Wait for the rate limit window to reset or adjust rate limiting configuration

---

**Happy Coding! 🎉**

For more information, visit our documentation or contact the development team.