// API utility functions for authentication

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-domain.com/api'
  : 'http://localhost:3000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(identifier, password, userType) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { identifier, password, userType },
    });

    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async studentSignup(userData) {
    return this.request('/auth/student/signup', {
      method: 'POST',
      body: userData,
    });
  }

  async ownerSignup(userData) {
    return this.request('/auth/owner/signup', {
      method: 'POST',
      body: userData,
    });
  }

  // OTP methods
  async sendEmailOtp(email) {
    return this.request('/otp/email/send', {
      method: 'POST',
      body: { value: email },
    });
  }

  async verifyEmailOtp(email, code) {
    return this.request('/otp/email/verify', {
      method: 'POST',
      body: { value: email, code },
    });
  }

  async sendPhoneOtp(phone) {
    return this.request('/otp/phone/send', {
      method: 'POST',
      body: { value: phone },
    });
  }

  async verifyPhoneOtp(phone, code) {
    return this.request('/otp/phone/verify', {
      method: 'POST',
      body: { value: phone, code },
    });
  }

  // Verification methods
  async initiateAadhaarVerification(aadhaarNumber) {
    return this.request('/verification/aadhaar/initiate', {
      method: 'POST',
      body: { aadhaarNumber },
    });
  }

  async initiateDigiLockerVerification() {
    return this.request('/verification/digilocker/initiate', {
      method: 'GET',
    });
  }

  // Meeting methods
  async scheduleMeeting(meetingData) {
    return this.request('/meetings/schedule', {
      method: 'POST',
      body: meetingData,
    });
  }

  async getStudentMeetings(studentId) {
    return this.request(`/meetings/schedule?studentId=${studentId}`, {
      method: 'GET',
    });
  }

  async getOwnerMeetings(ownerId) {
    return this.request(`/meetings/schedule?ownerId=${ownerId}`, {
      method: 'GET',
    });
  }

  async respondToMeeting(meetingId, responseData) {
    return this.request(`/meetings/${meetingId}/respond`, {
      method: 'PUT',
      body: responseData,
    });
  }

  async acceptMeetingTime(meetingId, timeSlotId) {
    return this.request(`/meetings/${meetingId}/accept-time`, {
      method: 'PUT',
      body: { timeSlotId },
    });
  }

  async getMeetingDetails(meetingId) {
    return this.request(`/meetings/${meetingId}/respond`, {
      method: 'GET',
    });
  }

  // Logout
  logout() {
    this.clearToken();
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;

// Export individual methods for convenience
export const {
  login,
  studentSignup,
  ownerSignup,
  sendEmailOtp,
  verifyEmailOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
  initiateAadhaarVerification,
  initiateDigiLockerVerification,
  scheduleMeeting,
  getStudentMeetings,
  getOwnerMeetings,
  respondToMeeting,
  acceptMeetingTime,
  getMeetingDetails,
  logout,
} = apiClient;