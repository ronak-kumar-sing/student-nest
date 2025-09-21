# SMS & Email Integration with Twilio - Next.js

A comprehensive guide to integrate SMS and Email functionality into your Next.js project using Twilio APIs for authentication, notifications, and communication.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Installation](#installation)
4. [Project Structure](#project-structure)
5. [Configuration](#configuration)
6. [API Implementation](#api-implementation)
7. [Frontend Integration](#frontend-integration)
8. [Usage Examples](#usage-examples)
9. [Error Handling](#error-handling)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Cost Optimization](#cost-optimization)
13. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

- **Next.js 13+** project
- **Node.js 16+** installed
- **Twilio Account** with credits ($15.50+ recommended)
- **Student GitHub Pack** (optional but recommended for additional credits)
- **Valid email** for SendGrid or Gmail SMTP setup

## 🌐 Environment Setup

Create a `.env.local` file in your project root:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_VERIFY_SID=your_verification_service_sid

# Email Configuration (Choose one)
# Option 1: SendGrid (Recommended)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Option 2: Gmail SMTP (Budget option)
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# Application Settings
NEXT_PUBLIC_APP_NAME=YourAppName
OTP_EXPIRY_MINUTES=5
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_ATTEMPTS=5
```

## 📦 Installation

Install required dependencies:

```bash
# Core dependencies
npm install twilio @sendgrid/mail nodemailer

# Additional utilities
npm install crypto js-cookie next-auth

# Development dependencies (optional)
npm install --save-dev @types/nodemailer
```

## 📁 Project Structure

```
your-nextjs-project/
├── pages/api/
│   ├── auth/
│   │   ├── send-otp.js          # Send OTP via SMS/Email
│   │   ├── verify-otp.js        # Verify OTP code
│   │   └── resend-otp.js        # Resend OTP functionality
│   ├── notifications/
│   │   ├── send-sms.js          # General SMS sending
│   │   ├── send-email.js        # General email sending
│   │   └── send-whatsapp.js     # WhatsApp messaging
│   └── health/
│       └── check-services.js    # Service health check
├── lib/
│   ├── twilio.js                # Twilio client configuration
│   ├── email.js                 # Email service configuration
│   ├── otp.js                   # OTP generation and validation
│   └── rate-limiter.js          # Rate limiting utilities
├── components/
│   ├── auth/
│   │   ├── OTPInput.jsx         # OTP input component
│   │   └── AuthForm.jsx         # Authentication form
│   └── notifications/
│       └── NotificationCenter.jsx
└── utils/
    ├── validators.js            # Input validation
    └── constants.js             # Application constants
```

## ⚙️ Configuration

### 1. Twilio Client Setup (`lib/twilio.js`)

```javascript
import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default client;

// Twilio service configurations
export const TWILIO_CONFIG = {
  SMS_FROM: process.env.TWILIO_PHONE_NUMBER,
  WHATSAPP_FROM: process.env.TWILIO_WHATSAPP_NUMBER,
  VERIFY_SID: process.env.TWILIO_VERIFY_SID,
  
  // Message templates
  OTP_MESSAGE: (otp) => `Your ${process.env.NEXT_PUBLIC_APP_NAME} verification code is: ${otp}. Valid for 5 minutes.`,
  WELCOME_MESSAGE: (name) => `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}, ${name}! Your account has been created successfully.`,
};
```

### 2. Email Service Setup (`lib/email.js`)

```javascript
import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';

// SendGrid configuration (recommended)
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Gmail SMTP configuration (fallback)
const gmailTransporter = process.env.GMAIL_USER ? nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
}) : null;

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (process.env.SENDGRID_API_KEY) {
      // Use SendGrid
      await sgMail.send({
        to,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject,
        text,
        html,
      });
    } else if (gmailTransporter) {
      // Use Gmail SMTP
      await gmailTransporter.sendMail({
        from: process.env.GMAIL_USER,
        to,
        subject,
        text,
        html,
      });
    } else {
      throw new Error('No email service configured');
    }
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Email templates
export const EMAIL_TEMPLATES = {
  OTP: (otp, appName) => ({
    subject: `Your ${appName} verification code`,
    text: `Your verification code is: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verification Code</h2>
        <p>Your verification code is:</p>
        <h1 style="background: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px;">
          ${otp}
        </h1>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `
  }),
  
  WELCOME: (name, appName) => ({
    subject: `Welcome to ${appName}!`,
    text: `Welcome ${name}! Your account has been created successfully.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to ${appName}!</h2>
        <p>Hello ${name},</p>
        <p>Your account has been created successfully. You can now access all features.</p>
        <p>Thank you for joining us!</p>
      </div>
    `
  })
};
```

### 3. OTP Utilities (`lib/otp.js`)

```javascript
import crypto from 'crypto';

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate secure OTP using crypto
export const generateSecureOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }
  
  return otp;
};

// OTP storage (use Redis in production)
const otpStore = new Map();

export const storeOTP = (identifier, otp, expiryMinutes = 5) => {
  const expiryTime = Date.now() + (expiryMinutes * 60 * 1000);
  otpStore.set(identifier, {
    otp,
    expiryTime,
    attempts: 0
  });
};

export const verifyOTP = (identifier, inputOtp) => {
  const stored = otpStore.get(identifier);
  
  if (!stored) {
    return { valid: false, error: 'OTP not found' };
  }
  
  if (Date.now() > stored.expiryTime) {
    otpStore.delete(identifier);
    return { valid: false, error: 'OTP expired' };
  }
  
  stored.attempts += 1;
  
  if (stored.attempts > 3) {
    otpStore.delete(identifier);
    return { valid: false, error: 'Too many attempts' };
  }
  
  if (stored.otp === inputOtp) {
    otpStore.delete(identifier);
    return { valid: true };
  }
  
  return { valid: false, error: 'Invalid OTP' };
};
```

## 🚀 API Implementation

### 1. Send OTP API (`pages/api/auth/send-otp.js`)

```javascript
import twilioClient, { TWILIO_CONFIG } from '../../../lib/twilio';
import { sendEmail, EMAIL_TEMPLATES } from '../../../lib/email';
import { generateSecureOTP, storeOTP } from '../../../lib/otp';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, email, method = 'sms' } = req.body;

  // Validation
  if (!phone && !email) {
    return res.status(400).json({ error: 'Phone number or email required' });
  }

  try {
    const otp = generateSecureOTP();
    const identifier = phone || email;
    
    // Store OTP
    storeOTP(identifier, otp);

    let result = { success: false };

    switch (method) {
      case 'sms':
        if (!phone) {
          return res.status(400).json({ error: 'Phone number required for SMS' });
        }
        
        result = await twilioClient.messages.create({
          body: TWILIO_CONFIG.OTP_MESSAGE(otp),
          from: TWILIO_CONFIG.SMS_FROM,
          to: phone
        });
        break;

      case 'whatsapp':
        if (!phone) {
          return res.status(400).json({ error: 'Phone number required for WhatsApp' });
        }
        
        result = await twilioClient.messages.create({
          body: TWILIO_CONFIG.OTP_MESSAGE(otp),
          from: TWILIO_CONFIG.WHATSAPP_FROM,
          to: `whatsapp:${phone}`
        });
        break;

      case 'email':
        if (!email) {
          return res.status(400).json({ error: 'Email required for email method' });
        }
        
        const emailTemplate = EMAIL_TEMPLATES.OTP(otp, process.env.NEXT_PUBLIC_APP_NAME);
        result = await sendEmail({
          to: email,
          ...emailTemplate
        });
        break;

      case 'both':
        const promises = [];
        
        if (phone) {
          promises.push(
            twilioClient.messages.create({
              body: TWILIO_CONFIG.OTP_MESSAGE(otp),
              from: TWILIO_CONFIG.SMS_FROM,
              to: phone
            })
          );
        }
        
        if (email) {
          const emailTemplate = EMAIL_TEMPLATES.OTP(otp, process.env.NEXT_PUBLIC_APP_NAME);
          promises.push(sendEmail({ to: email, ...emailTemplate }));
        }
        
        await Promise.all(promises);
        result = { success: true };
        break;

      default:
        return res.status(400).json({ error: 'Invalid method' });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      method,
      messageSid: result.sid || 'email-sent'
    });

  } catch (error) {
    console.error('OTP sending failed:', error);
    res.status(500).json({
      error: 'Failed to send OTP',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
```

### 2. Verify OTP API (`pages/api/auth/verify-otp.js`)

```javascript
import { verifyOTP } from '../../../lib/otp';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { identifier, otp } = req.body;

  if (!identifier || !otp) {
    return res.status(400).json({ error: 'Identifier and OTP required' });
  }

  try {
    const verification = verifyOTP(identifier, otp);

    if (verification.valid) {
      res.status(200).json({
        success: true,
        message: 'OTP verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: verification.error
      });
    }
  } catch (error) {
    console.error('OTP verification failed:', error);
    res.status(500).json({
      error: 'Verification failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
```

### 3. General SMS API (`pages/api/notifications/send-sms.js`)

```javascript
import twilioClient, { TWILIO_CONFIG } from '../../../lib/twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, message, from } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: 'Phone number and message required' });
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: from || TWILIO_CONFIG.SMS_FROM,
      to: to
    });

    res.status(200).json({
      success: true,
      messageSid: result.sid,
      status: result.status
    });

  } catch (error) {
    console.error('SMS sending failed:', error);
    res.status(500).json({
      error: 'Failed to send SMS',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
```

### 4. Service Health Check (`pages/api/health/check-services.js`)

```javascript
import twilioClient from '../../../lib/twilio';
import { sendEmail } from '../../../lib/email';

export default async function handler(req, res) {
  const health = {
    twilio: 'unknown',
    email: 'unknown',
    timestamp: new Date().toISOString()
  };

  // Check Twilio
  try {
    await twilioClient.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    health.twilio = 'healthy';
  } catch (error) {
    health.twilio = 'unhealthy';
    health.twilioError = error.message;
  }

  // Check Email service
  try {
    // This is a dry run - doesn't actually send
    if (process.env.SENDGRID_API_KEY || process.env.GMAIL_USER) {
      health.email = 'configured';
    } else {
      health.email = 'not_configured';
    }
  } catch (error) {
    health.email = 'unhealthy';
    health.emailError = error.message;
  }

  const statusCode = health.twilio === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
}
```

## 🎨 Frontend Integration

### 1. OTP Input Component (`components/auth/OTPInput.jsx`)

```jsx
import { useState, useRef, useEffect } from 'react';

export default function OTPInput({ length = 6, onComplete, disabled = false }) {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Move to next input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Call onComplete when all digits are filled
    if (newOtp.every(digit => digit !== '') && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.slice(0, length).split('');
    
    if (pasteArray.every(char => !isNaN(char))) {
      const newOtp = [...otp];
      pasteArray.forEach((char, index) => {
        if (index < length) newOtp[index] = char;
      });
      setOtp(newOtp);
      
      if (pasteArray.length === length && onComplete) {
        onComplete(pasteArray.join(''));
      }
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          ref={ref => inputRefs.current[index] = ref}
          value={digit}
          onChange={e => handleChange(e.target, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
          maxLength="1"
        />
      ))}
    </div>
  );
}
```

### 2. Authentication Form (`components/auth/AuthForm.jsx`)

```jsx
import { useState } from 'react';
import OTPInput from './OTPInput';

export default function AuthForm() {
  const [step, setStep] = useState('input'); // 'input', 'verify'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState('sms');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendOTP = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email, method })
      });

      const data = await response.json();

      if (data.success) {
        setStep('verify');
        setMessage('OTP sent successfully!');
      } else {
        setMessage(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      setMessage('Network error occurred');
    }

    setLoading(false);
  };

  const verifyOTP = async (otpCode) => {
    setLoading(true);

    try {
      const identifier = phone || email;
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp: otpCode })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Verification successful!');
        // Redirect or update app state
      } else {
        setMessage(data.error || 'Verification failed');
      }
    } catch (error) {
      setMessage('Verification error occurred');
    }

    setLoading(false);
  };

  if (step === 'verify') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
        
        <div className="mb-6">
          <OTPInput onComplete={verifyOTP} disabled={loading} />
        </div>

        {message && (
          <div className={`p-3 rounded text-center mb-4 ${
            message.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <button
          onClick={() => setStep('input')}
          className="w-full py-2 text-blue-600 hover:text-blue-800"
          disabled={loading}
        >
          ← Back to send OTP
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Send OTP</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="sms">SMS</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
          <option value="both">SMS + Email</option>
        </select>
      </div>

      {(method === 'sms' || method === 'whatsapp' || method === 'both') && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {(method === 'email' || method === 'both') && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {message && (
        <div className={`p-3 rounded text-center mb-4 ${
          message.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <button
        onClick={sendOTP}
        disabled={loading || (!phone && !email)}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Sending...' : 'Send OTP'}
      </button>
    </div>
  );
}
```

## 🔍 Usage Examples

### Send OTP via API

```javascript
// Send SMS OTP
const sendSMSOTP = async (phone) => {
  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, method: 'sms' })
  });
  return response.json();
};

// Send WhatsApp OTP
const sendWhatsAppOTP = async (phone) => {
  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, method: 'whatsapp' })
  });
  return response.json();
};

// Send Email OTP
const sendEmailOTP = async (email) => {
  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, method: 'email' })
  });
  return response.json();
};
```

### General Messaging

```javascript
// Send custom SMS
const sendSMS = async (to, message) => {
  const response = await fetch('/api/notifications/send-sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, message })
  });
  return response.json();
};

// Send custom email
const sendCustomEmail = async (to, subject, message) => {
  const response = await fetch('/api/notifications/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      to, 
      subject, 
      text: message,
      html: `<p>${message}</p>`
    })
  });
  return response.json();
};
```

## 🛠️ Error Handling

### Common Error Scenarios

```javascript
// pages/api/auth/send-otp.js - Enhanced error handling
export default async function handler(req, res) {
  try {
    // ... existing code
  } catch (error) {
    console.error('OTP Error:', error);
    
    // Handle specific Twilio errors
    if (error.code) {
      switch (error.code) {
        case 21608:
          return res.status(400).json({ error: 'Invalid phone number format' });
        case 21614:
          return res.status(400).json({ error: 'Phone number is invalid' });
        case 21211:
          return res.status(400).json({ error: 'Invalid phone number' });
        case 20003:
          return res.status(401).json({ error: 'Authentication failed' });
        case 20404:
          return res.status(404).json({ error: 'Phone number not found' });
        default:
          return res.status(500).json({ error: 'Service temporarily unavailable' });
      }
    }
    
    // Handle email errors
    if (error.response?.body?.errors) {
      return res.status(400).json({ 
        error: 'Email sending failed',
        details: error.response.body.errors
      });
    }
    
    // Generic error
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

## 🧪 Testing

### Test OTP Flow

```javascript
// test/otp.test.js
import { generateSecureOTP, storeOTP, verifyOTP } from '../lib/otp';

describe('OTP Functions', () => {
  test('generates valid OTP', () => {
    const otp = generateSecureOTP();
    expect(otp).toHaveLength(6);
    expect(/^\d{6}$/.test(otp)).toBe(true);
  });

  test('stores and verifies OTP correctly', () => {
    const identifier = '+1234567890';
    const otp = '123456';
    
    storeOTP(identifier, otp, 5);
    const result = verifyOTP(identifier, otp);
    
    expect(result.valid).toBe(true);
  });

  test('fails with wrong OTP', () => {
    const identifier = '+1234567890';
    storeOTP(identifier, '123456', 5);
    
    const result = verifyOTP(identifier, '654321');
    expect(result.valid).toBe(false);
  });
});
```

### Manual Testing

```bash
# Test SMS endpoint
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890", "method": "sms"}'

# Test email endpoint
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "method": "email"}'

# Test verification
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"identifier": "+1234567890", "otp": "123456"}'
```

## 🚀 Deployment

### Environment Variables for Production

```bash
# Add to your hosting platform (Vercel, Netlify, etc.)
TWILIO_ACCOUNT_SID=your_production_sid
TWILIO_AUTH_TOKEN=your_production_token
TWILIO_PHONE_NUMBER=your_production_number
SENDGRID_API_KEY=your_production_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
NODE_ENV=production
```

### Production Considerations

1. **Use Redis for OTP storage** instead of in-memory Map
2. **Implement rate limiting** to prevent abuse
3. **Add request validation** and sanitization
4. **Set up monitoring** and logging
5. **Configure CORS** properly
6. **Use environment-specific configurations**

## 💰 Cost Optimization

### Best Practices for $15.50 Budget

1. **Use WhatsApp for OTP** (~$0.009/message vs $0.0079 SMS)
2. **Implement smart fallbacks**:
   ```javascript
   // Try WhatsApp first, fallback to SMS
   const sendWithFallback = async (phone, message) => {
     try {
       return await sendWhatsApp(phone, message);
     } catch (error) {
       return await sendSMS(phone, message);
     }
   };
   ```

3. **Cache OTP attempts** to prevent duplicate sends
4. **Use customer service windows** for WhatsApp (24-hour cheaper messaging)
5. **Monitor usage** with Twilio Console

### Expected Message Counts with $15.50

- **WhatsApp OTP**: ~1,684 messages
- **SMS**: ~1,962 messages  
- **Email** (SendGrid free): 100/day (3,000/month free)
- **Mixed approach**: ~1,600+ total verifications

## 🔧 Troubleshooting

### Common Issues

#### 1. Twilio Authentication Errors
```javascript
// Check credentials
const testTwilioConnection = async () => {
  try {
    const account = await twilioClient.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    console.log('Twilio connected:', account.friendlyName);
  } catch (error) {
    console.error('Twilio error:', error.message);
  }
};
```

#### 2. WhatsApp Sandbox Setup
- Enable WhatsApp Sandbox in Twilio Console
- Send "join [sandbox-name]" to your sandbox number
- Use sandbox number for testing: `whatsapp:+14155238886`

#### 3. Email Delivery Issues
- Verify sender domain in SendGrid
- Check spam folders
- Use proper email headers
- Test with different email providers

#### 4. OTP Not Receiving
- Verify phone number format (+country code)
- Check Twilio logs in Console
- Ensure sufficient account balance
- Verify service availability in your region

### Debug Mode

Add debug logging in development:

```javascript
// lib/debug.js
export const debugLog = (service, action, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${service.toUpperCase()}] ${action}:`, data);
  }
};

// Usage in APIs
debugLog('twilio', 'send-sms', { to: phone, message: message.substring(0, 50) });
```

## 📝 Additional Resources

- [Twilio SMS Quickstart](https://www.twilio.com/docs/sms/quickstart)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [SendGrid Email API](https://sendgrid.com/docs/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [GitHub Student Developer Pack](https://education.github.com/pack)

## 🆘 Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review Twilio Console logs
3. Verify environment variables
4. Test with different phone numbers/emails
5. Check service health with `/api/health/check-services`

---

**Created for Next.js projects with Twilio integration**  
**Optimized for student budgets and learning purposes**

*Last updated: September 2025*