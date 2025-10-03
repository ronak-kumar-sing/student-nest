# 🔧 StudentNest Environment Setup Guide

## 📋 Prerequisites
- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Cloudinary account (for image uploads)
- JWT secret for authentication

## 🌍 Environment Variables Setup

Create a `.env.local` file in your project root:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/student-nest
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-nest?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key-here

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (for OTP and notifications)
EMAIL_FROM=noreply@studentnest.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS Configuration (for OTP)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Payment Gateway (Optional - for future implementation)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🗄️ Database Setup

### Option 1: Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. Create database: `student-nest`

### Option 2: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create a database user
4. Add your IP to whitelist (or use 0.0.0.0/0 for development)
5. Get connection string and update `MONGODB_URI`

## 🔐 JWT Secrets Generation

Generate secure JWT secrets:

```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## ☁️ Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to your `.env.local`

## 📧 Email Setup (Gmail)
1. Enable 2-factor authentication in Gmail
2. Generate App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use your email and app password in `.env.local`

## 📱 Twilio Setup (SMS)
1. Sign up at [Twilio](https://www.twilio.com/)
2. Get Account SID and Auth Token from Console
3. Buy a phone number
4. Add credentials to `.env.local`

## 🚀 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Test Database Connection
```bash
node scripts/test-apis.js
```

### 4. Access Application
- Frontend: http://localhost:3000
- API: http://localhost:3000/api

## 🧪 Testing APIs

### Test Room Listing
```bash
curl http://localhost:3000/api/rooms
```

### Test Authentication (after creating a user)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@test.com","password":"Test123@"}'
```

### Test Room Creation (with auth token)
```bash
curl -X POST http://localhost:3000/api/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Room",
    "description": "A test room",
    "price": 15000,
    "roomType": "single",
    "accommodationType": "pg",
    "location": {
      "address": "Test Address",
      "city": "Test City",
      "coordinates": {"lat": 28.6139, "lng": 77.2090}
    },
    "owner": "USER_ID_HERE"
  }'
```

## 🔍 Troubleshooting

### Database Connection Issues
- Check if MongoDB is running
- Verify MONGODB_URI format
- Check network connectivity (for Atlas)

### Authentication Issues
- Verify JWT_SECRET is set
- Check token format in Authorization header
- Ensure user exists in database

### API Errors
- Check server logs: `npm run dev`
- Verify environment variables
- Test with Postman or similar tool

## 📚 Next Steps

1. **Start Development Server**: `npm run dev`
2. **Create Test Users**: Use signup APIs
3. **Test Core Features**: Rooms, bookings, meetings
4. **Add Sample Data**: Create test properties
5. **Frontend Integration**: Connect with existing frontend

## 🛠️ Development Tools

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Thunder Client (API testing)

### Database Management
- MongoDB Compass (GUI for MongoDB)
- Robo 3T (Alternative GUI)

### API Testing
- Postman
- Insomnia
- Thunder Client (VS Code extension)

## 🔒 Security Checklist

- ✅ Environment variables in `.env.local` (not committed)
- ✅ Strong JWT secrets
- ✅ Input validation in all APIs
- ✅ Authentication middleware
- ✅ CORS configuration
- ✅ Rate limiting (to be implemented)
- ✅ Data sanitization

## 📈 Performance Optimization

- ✅ Database indexes implemented
- ✅ Pagination in list APIs
- ✅ Selective field population
- ✅ Efficient aggregation pipelines
- ⏳ Caching (Redis - future implementation)
- ⏳ Image optimization (Cloudinary transforms)

Your StudentNest backend is now ready for development! 🚀