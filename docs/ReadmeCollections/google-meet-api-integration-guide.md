# Complete Google Meet API Integration Guide for AI Agent Websites

## Table of Contents
1. [Prerequisites & Setup](#prerequisites--setup)
2. [Google Cloud Console Configuration](#google-cloud-console-configuration)
3. [OAuth 2.0 Implementation](#oauth-20-implementation)
4. [Meeting Creation Implementation](#meeting-creation-implementation)
5. [Error Handling & Security](#error-handling--security)
6. [Testing & Deployment](#testing--deployment)

## Prerequisites & Setup

### Required Tools & Dependencies
- **Node.js** (v16+ recommended)
- **Google Cloud Console** account
- **OAuth 2.0 credentials** (Client ID & Secret)
- **Required npm packages**:
  ```bash
  npm install googleapis google-auth-library
  # For React/Next.js projects
  npm install gapi-script
  ```

### Required Google Workspace License
- **Google Workspace Business Standard** or higher
- **Education Plus** plan (for educational institutions)
- Personal Gmail accounts **cannot** create meetings via API

## Google Cloud Console Configuration

### Step 1: Create Google Cloud Project
1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Click **Select Project** → **New Project**
3. Enter project name: `"Student Nest Meet Integration"`
4. Click **Create**

### Step 2: Enable Required APIs
1. Navigate to **APIs & Services** → **Library**
2. Search and enable:
   - **Google Meet API**
   - **Google Calendar API** (if using calendar integration)
   - **Google Drive API** (if accessing recordings/transcripts)

### Step 3: Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill required fields:
   - **App name**: `"Student Nest"`
   - **User support email**: Your email
   - **Developer contact**: Your email
   - **Authorized domains**: Add your domain (e.g., `studentnest.com`)

### Step 4: Add Required Scopes
Navigate to **Scopes** section and add:
```
https://www.googleapis.com/auth/meetings.space.created
https://www.googleapis.com/auth/meetings.space.readonly
https://www.googleapis.com/auth/calendar (if using Calendar API)
```

### Step 5: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Add authorized origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
5. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback`
   - `https://yourdomain.com/api/auth/callback`
6. **Download the JSON credentials file**

## OAuth 2.0 Implementation

### Frontend Authentication (React/Next.js)

```javascript
// utils/googleAuth.js
import { GoogleAuth } from 'google-auth-library';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

// Required scopes for Meet API
const SCOPES = [
  'https://www.googleapis.com/auth/meetings.space.created'
];

class GoogleAuthManager {
  constructor() {
    this.auth = new GoogleAuth({
      scopes: SCOPES,
      credentials: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI
      }
    });
  }

  // Generate authorization URL
  getAuthUrl() {
    return this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent'
    });
  }

  // Exchange authorization code for tokens
  async getTokens(authCode) {
    const { tokens } = await this.auth.getAccessToken(authCode);
    return tokens;
  }
}

export default new GoogleAuthManager();
```

### Client-Side Authentication Hook

```javascript
// hooks/useGoogleAuth.js
import { useState, useCallback } from 'react';
import googleAuth from '../utils/googleAuth';

export const useGoogleAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const authenticate = useCallback(async () => {
    setLoading(true);
    try {
      // Redirect to Google OAuth
      const authUrl = googleAuth.getAuthUrl();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Authentication failed:', error);
      setLoading(false);
    }
  }, []);

  const handleCallback = useCallback(async (authCode) => {
    try {
      const tokens = await googleAuth.getTokens(authCode);
      setAccessToken(tokens.access_token);
      setIsAuthenticated(true);
      
      // Store tokens securely
      sessionStorage.setItem('google_access_token', tokens.access_token);
      if (tokens.refresh_token) {
        localStorage.setItem('google_refresh_token', tokens.refresh_token);
      }
    } catch (error) {
      console.error('Token exchange failed:', error);
    }
  }, []);

  return {
    authenticate,
    handleCallback,
    isAuthenticated,
    accessToken,
    loading
  };
};
```

## Meeting Creation Implementation

### Direct Meet API Implementation

```javascript
// api/meet.js
import { google } from 'googleapis';

const meet = google.meet('v2');

class MeetingService {
  constructor(accessToken) {
    this.auth = new google.auth.OAuth2();
    this.auth.setCredentials({ access_token: accessToken });
  }

  // Create a new meeting space
  async createMeeting(meetingData = {}) {
    try {
      const request = {
        auth: this.auth,
        requestBody: {
          // Optional: Configure meeting settings
          config: {
            accessType: meetingData.accessType || 'OPEN',
            entryPointAccess: meetingData.entryPointAccess || 'ALL'
          }
        }
      };

      const response = await meet.spaces.create(request);
      
      return {
        success: true,
        meetingUri: response.data.meetingUri,
        name: response.data.name,
        meetingCode: response.data.meetingCode,
        config: response.data.config
      };
    } catch (error) {
      console.error('Meeting creation failed:', error);
      throw new Error(`Failed to create meeting: ${error.message}`);
    }
  }

  // Get meeting details
  async getMeeting(spaceName) {
    try {
      const response = await meet.spaces.get({
        auth: this.auth,
        name: spaceName
      });

      return response.data;
    } catch (error) {
      console.error('Failed to get meeting:', error);
      throw error;
    }
  }

  // End a meeting
  async endMeeting(spaceName) {
    try {
      const response = await meet.spaces.endActiveConference({
        auth: this.auth,
        name: spaceName
      });

      return response.data;
    } catch (error) {
      console.error('Failed to end meeting:', error);
      throw error;
    }
  }
}

export default MeetingService;
```

### Next.js API Route Implementation

```javascript
// pages/api/meetings/create.js (or app/api/meetings/create/route.js for App Router)
import MeetingService from '../../../lib/meetingService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken, meetingData } = req.body;

    if (!accessToken) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const meetingService = new MeetingService(accessToken);
    const meeting = await meetingService.createMeeting(meetingData);

    res.status(200).json(meeting);
  } catch (error) {
    console.error('Meeting creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create meeting',
      message: error.message 
    });
  }
}
```

### Frontend Meeting Component

```javascript
// components/MeetingCreator.jsx
import { useState } from 'react';
import { useGoogleAuth } from '../hooks/useGoogleAuth';

export const MeetingCreator = () => {
  const { isAuthenticated, authenticate, accessToken } = useGoogleAuth();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createMeeting = async () => {
    if (!isAuthenticated || !accessToken) {
      await authenticate();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/meetings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          meetingData: {
            accessType: 'OPEN', // or 'TRUSTED'
            entryPointAccess: 'ALL'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create meeting');
      }

      const meetingData = await response.json();
      setMeeting(meetingData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyMeetingLink = () => {
    if (meeting?.meetingUri) {
      navigator.clipboard.writeText(meeting.meetingUri);
      alert('Meeting link copied to clipboard!');
    }
  };

  return (
    <div className="meeting-creator">
      <h2>Create Google Meet Session</h2>
      
      {!isAuthenticated ? (
        <button 
          onClick={authenticate}
          className="auth-button"
        >
          Authenticate with Google
        </button>
      ) : (
        <button 
          onClick={createMeeting}
          disabled={loading}
          className="create-button"
        >
          {loading ? 'Creating Meeting...' : 'Create Meeting'}
        </button>
      )}

      {error && (
        <div className="error">
          <p>Error: {error}</p>
        </div>
      )}

      {meeting && (
        <div className="meeting-result">
          <h3>Meeting Created Successfully!</h3>
          <div className="meeting-details">
            <p><strong>Meeting Link:</strong></p>
            <div className="link-container">
              <input 
                type="text" 
                value={meeting.meetingUri} 
                readOnly 
                className="meeting-link"
              />
              <button onClick={copyMeetingLink}>Copy Link</button>
            </div>
            <p><strong>Meeting Code:</strong> {meeting.meetingCode}</p>
            <a 
              href={meeting.meetingUri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="join-button"
            >
              Join Meeting Now
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
```

## Error Handling & Security

### Comprehensive Error Handling

```javascript
// utils/errorHandler.js
export class MeetingError extends Error {
  constructor(message, code, originalError) {
    super(message);
    this.name = 'MeetingError';
    this.code = code;
    this.originalError = originalError;
  }
}

export const handleMeetingError = (error) => {
  // Google API specific errors
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        return new MeetingError('Authentication failed', 'AUTH_ERROR', error);
      case 403:
        return new MeetingError('Insufficient permissions', 'PERMISSION_ERROR', error);
      case 429:
        return new MeetingError('Rate limit exceeded', 'RATE_LIMIT_ERROR', error);
      case 400:
        return new MeetingError('Invalid request parameters', 'VALIDATION_ERROR', error);
      default:
        return new MeetingError('API request failed', 'API_ERROR', error);
    }
  }

  // Network errors
  if (error.code === 'NETWORK_ERROR') {
    return new MeetingError('Network connection failed', 'NETWORK_ERROR', error);
  }

  // Default error
  return new MeetingError('Unknown error occurred', 'UNKNOWN_ERROR', error);
};
```

### Security Best Practices

```javascript
// utils/security.js
import crypto from 'crypto';

// Token encryption for storage
export const encryptToken = (token, secret) => {
  const cipher = crypto.createCipher('aes192', secret);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const decryptToken = (encryptedToken, secret) => {
  const decipher = crypto.createDecipher('aes192', secret);
  let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// Rate limiting
export const rateLimiter = {
  requests: new Map(),
  
  checkLimit(userId, maxRequests = 10, windowMs = 60000) {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Clean old requests
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    this.requests.set(userId, validRequests);
    return true; // Request allowed
  }
};
```

### Environment Variables (.env.local)

```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Security
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_SECRET=your_encryption_secret_here

# API Configuration
GOOGLE_MEET_API_VERSION=v2
MAX_REQUESTS_PER_MINUTE=10
```

## Testing & Deployment

### Unit Testing

```javascript
// __tests__/meetingService.test.js
import MeetingService from '../lib/meetingService';

describe('MeetingService', () => {
  let meetingService;
  const mockAccessToken = 'mock_access_token';

  beforeEach(() => {
    meetingService = new MeetingService(mockAccessToken);
  });

  test('should create meeting successfully', async () => {
    const mockMeeting = {
      meetingUri: 'https://meet.google.com/abc-def-ghi',
      name: 'spaces/mockSpaceId',
      meetingCode: 'abc-def-ghi'
    };

    // Mock the Google API response
    jest.mock('googleapis');
    
    const result = await meetingService.createMeeting();
    
    expect(result.success).toBe(true);
    expect(result.meetingUri).toContain('meet.google.com');
  });

  test('should handle authentication errors', async () => {
    const invalidService = new MeetingService('invalid_token');
    
    await expect(invalidService.createMeeting()).rejects.toThrow('Authentication failed');
  });
});
```

### Integration Testing

```javascript
// __tests__/api.integration.test.js
import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/meetings/create';

describe('/api/meetings/create', () => {
  test('should create meeting with valid token', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        accessToken: 'valid_access_token',
        meetingData: { accessType: 'OPEN' }
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(data.meetingUri).toBeDefined();
  });
});
```

### Production Deployment Checklist

1. **Environment Variables**: Ensure all required env vars are set in production
2. **HTTPS**: All OAuth redirect URIs must use HTTPS in production
3. **Domain Verification**: Add production domain to Google OAuth consent screen
4. **Rate Limiting**: Implement proper rate limiting for API endpoints
5. **Monitoring**: Set up logging and error tracking (Sentry, LogRocket, etc.)
6. **Backup Authentication**: Implement refresh token handling for long-term sessions

### Monitoring & Analytics

```javascript
// utils/analytics.js
export const trackMeetingCreation = (meetingData, userId) => {
  // Google Analytics 4
  gtag('event', 'meeting_created', {
    event_category: 'engagement',
    event_label: 'google_meet_api',
    user_id: userId,
    custom_parameters: {
      meeting_code: meetingData.meetingCode,
      access_type: meetingData.config?.accessType
    }
  });

  // Custom analytics
  console.log('Meeting created:', {
    timestamp: new Date().toISOString(),
    userId,
    meetingUri: meetingData.meetingUri,
    meetingCode: meetingData.meetingCode
  });
};
```

This comprehensive guide provides everything needed to integrate Google Meet API with your AI agent website. The implementation covers authentication, meeting creation, error handling, security, and testing - all optimized for your Student Nest platform's requirements.