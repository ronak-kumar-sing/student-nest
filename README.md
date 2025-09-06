# Student Nest - Modern Authentication UI

A production-ready authentication system for Student and Room Owner accounts with OTP verification, identity validation, and modern UX.

## 🚀 Features

### Student Authentication
- **Secure Signup**: Full name, email, phone, college ID, and college name
- **OTP Verification**: Email and phone number verification required
- **Strong Passwords**: Minimum 8 characters with uppercase, number, and special character
- **College Integration**: College ID and name validation

### Room Owner Authentication
- **Secure Signup**: Full name, email, phone, and password
- **OTP Verification**: Email and phone number verification required
- **Identity Verification**: Mandatory Aadhaar/DigiLocker verification before account activation
- **Verification Status**: Pending → In Review → Verified/Rejected workflow

### Technical Features
- **Modern UI**: Built with Next.js 15, Tailwind CSS, and Shadcn UI
- **Form Validation**: React Hook Form with Zod schema validation
- **Responsive Design**: Mobile-first approach with dark/light theme support
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Type Safety**: Full TypeScript support with proper type definitions

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Authentication pages
│   │   ├── student/
│   │   │   ├── login/page.jsx
│   │   │   └── signup/page.jsx
│   │   └── owner/
│   │       ├── login/page.jsx
│   │       ├── signup/page.jsx
│   │       └── verify/page.jsx
│   ├── api/                       # API routes
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   ├── student/signup/route.js
│   │   │   └── owner/signup/route.js
│   │   ├── otp/
│   │   │   ├── email/
│   │   │   └── phone/
│   │   └── verification/
│   │       ├── aadhaar/
│   │       └── digilocker/
│   ├── layout.js                  # Root layout with theme provider
│   └── page.js                    # Landing page
├── components/
│   ├── ui/                        # Shadcn UI components
│   └── forms/                     # Reusable form components
│       ├── InputField.jsx
│       ├── PasswordInput.jsx
│       └── OtpModal.jsx
└── lib/
    ├── validation/
    │   └── authSchemas.js         # Zod validation schemas
    ├── providers/
    │   └── theme-provider.jsx     # Theme context provider
    └── api.js                     # API client utility
```

## 🎨 Design System

### Color Scheme
- **Students**: Blue gradient theme (`from-blue-50 to-indigo-100`)
- **Owners**: Green gradient theme (`from-green-50 to-emerald-100`)
- **Dark Mode**: Automatic system detection with manual toggle

### Components
- **Cards**: Clean, minimal design with subtle shadows
- **Forms**: Inline validation with helpful error messages
- **Buttons**: Clear hierarchy with loading states
- **Badges**: Status indicators for verification stages

## 🔒 Security Features

### Authentication
- **Password Requirements**: 8+ characters, uppercase, number, special character
- **OTP Verification**: 6-digit codes for email and phone verification
- **Rate Limiting**: Built-in protection against brute force attacks (production)
- **Session Management**: JWT tokens with expiration

### Identity Verification (Owners)
- **Aadhaar Integration**: Manual number entry with document upload
- **DigiLocker**: OAuth-based instant verification (production ready)
- **Verification Workflow**: Pending → In Review → Verified/Rejected
- **Document Storage**: Secure file handling with size/type validation

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository>
   cd student-nest
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Student Login: http://localhost:3000/student/login
   - Owner Login: http://localhost:3000/owner/login

## 🧪 Demo Credentials

For testing the authentication flow:

### Login Credentials
- **Student**: `student@test.com` / `password123`
- **Owner**: `owner@test.com` / `password123`

### OTP Verification
- **Email/Phone OTP**: `123456` (works for all demo verifications)

### Test Flow
1. Go to signup page
2. Fill form with valid details
3. Use OTP `123456` for email/phone verification
4. Complete signup process
5. For owners: proceed to verification page
6. Test Aadhaar verification with any 12-digit number

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/login                 # User login
POST /api/auth/student/signup        # Student registration
POST /api/auth/owner/signup          # Owner registration
```

### OTP Verification
```
POST /api/otp/email/send            # Send email OTP
POST /api/otp/email/verify          # Verify email OTP
POST /api/otp/phone/send            # Send phone OTP
POST /api/otp/phone/verify          # Verify phone OTP
```

### Identity Verification
```
POST /api/verification/aadhaar/initiate    # Initiate Aadhaar verification
GET  /api/verification/digilocker/initiate # Initiate DigiLocker flow
```

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet**: Responsive grid layouts
- **Desktop**: Full-width experience with proper spacing
- **Touch Friendly**: Large tap targets and intuitive gestures

## ♿ Accessibility

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Error Handling**: Live regions for dynamic content
- **Color Contrast**: WCAG AA compliant color ratios

## 🌐 Internationalization Ready

- **Text Externalization**: Easy to add i18n support
- **RTL Support**: Layout ready for right-to-left languages
- **Date/Number Formatting**: Locale-aware formatting

## 🔮 Production Deployment

### Environment Variables
```bash
# Required for production
DATABASE_URL="your_database_connection"
JWT_SECRET="your_jwt_secret_key"
EMAIL_SERVICE_API_KEY="your_email_provider_key"
SMS_SERVICE_API_KEY="your_sms_provider_key"
DIGILOCKER_CLIENT_ID="your_digilocker_client_id"
DIGILOCKER_CLIENT_SECRET="your_digilocker_secret"
```

### Security Checklist
- [ ] Enable HTTPS/TLS
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Use production database
- [ ] Enable logging and monitoring
- [ ] Set up backup systems
- [ ] Configure email/SMS providers
- [ ] Test DigiLocker integration

### Deployment Platforms
- **Vercel**: One-click deployment with zero configuration
- **Netlify**: JAMstack deployment with serverless functions
- **AWS**: Full control with EC2/Lambda deployment
- **DigitalOcean**: App Platform for easy scaling

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs or request features via GitHub Issues
- **Discord**: Join our community for real-time support
- **Email**: Contact support@studentnest.com for urgent matters

---

Built with ❤️ for the student community. Making housing search safe, simple, and secure.
