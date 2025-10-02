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
      localStorage.setItem('token', token);
    }
  }

  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
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

  // Profile methods
  async getStudentProfile() {
    return this.request('/profile/student', {
      method: 'GET',
    });
  }

  async updateStudentProfile(profileData) {
    return this.request('/profile/student', {
      method: 'PUT',
      body: profileData,
    });
  }

  async uploadAvatar(formData) {
    // Accept FormData directly from the caller
    return this.request('/profile/upload-avatar', {
      method: 'POST',
      body: formData,
      headers: {} // Remove Content-Type header to let browser set it for FormData
    });
  }

  async getStudentPreferences() {
    return this.request('/profile/student/preferences', {
      method: 'GET',
    });
  }

  async updateStudentPreferences(preferences) {
    return this.request('/profile/student/preferences', {
      method: 'PUT',
      body: preferences,
    });
  }

  async getStudentVerification() {
    return this.request('/profile/student/verification', {
      method: 'GET',
    });
  }

  async uploadStudentVerification(formData) {
    return this.request('/profile/student/verification', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  async getOwnerProfile() {
    return this.request('/profile/owner', {
      method: 'GET',
    });
  }

  async updateOwnerProfile(profileData) {
    return this.request('/profile/owner', {
      method: 'PUT',
      body: profileData,
    });
  }

  async getOwnerVerification() {
    return this.request('/profile/owner/verification', {
      method: 'GET',
    });
  }

  async uploadOwnerVerification(formData) {
    return this.request('/profile/owner/verification', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }



  async changePassword(passwordData) {
    return this.request('/profile/password', {
      method: 'PUT',
      body: passwordData,
    });
  }

  async getNotificationSettings() {
    return this.request('/profile/settings/notifications', {
      method: 'GET',
    });
  }

  async updateNotificationSettings(settings) {
    return this.request('/profile/settings/notifications', {
      method: 'PUT',
      body: settings,
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

  // Student Settings methods
  async getStudentSettings() {
    return this.request('/profile/settings/student', {
      method: 'GET',
    });
  }

  async updateStudentSettings(settingsData) {
    return this.request('/profile/settings/student', {
      method: 'PUT',
      body: settingsData,
    });
  }

  async deleteStudentAccount() {
    return this.request('/profile/student', {
      method: 'DELETE',
    });
  }

  // Owner Business methods
  async getOwnerBusiness() {
    return this.request('/profile/owner/business', {
      method: 'GET',
    });
  }

  async updateOwnerBusiness(businessData) {
    return this.request('/profile/owner/business', {
      method: 'PUT',
      body: businessData,
    });
  }

  // Owner Settings methods
  async getOwnerSettings() {
    return this.request('/profile/settings/owner', {
      method: 'GET',
    });
  }

  async updateOwnerSettings(settingsData) {
    return this.request('/profile/settings/owner', {
      method: 'PUT',
      body: settingsData,
    });
  }

  async deleteOwnerAccount() {
    return this.request('/profile/owner', {
      method: 'DELETE',
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

// Export individual methods for convenience with proper binding
export const login = apiClient.login.bind(apiClient);
export const studentSignup = apiClient.studentSignup.bind(apiClient);
export const ownerSignup = apiClient.ownerSignup.bind(apiClient);
export const sendEmailOtp = apiClient.sendEmailOtp.bind(apiClient);
export const verifyEmailOtp = apiClient.verifyEmailOtp.bind(apiClient);
export const sendPhoneOtp = apiClient.sendPhoneOtp.bind(apiClient);
export const verifyPhoneOtp = apiClient.verifyPhoneOtp.bind(apiClient);
export const initiateAadhaarVerification = apiClient.initiateAadhaarVerification.bind(apiClient);
export const initiateDigilockerVerification = apiClient.initiateDigiLockerVerification.bind(apiClient);
export const getStudentProfile = apiClient.getStudentProfile.bind(apiClient);
export const updateStudentProfile = apiClient.updateStudentProfile.bind(apiClient);
export const uploadAvatar = apiClient.uploadAvatar.bind(apiClient);
export const getStudentPreferences = apiClient.getStudentPreferences.bind(apiClient);
export const updateStudentPreferences = apiClient.updateStudentPreferences.bind(apiClient);
export const getStudentSettings = apiClient.getStudentSettings.bind(apiClient);
export const updateStudentSettings = apiClient.updateStudentSettings.bind(apiClient);
export const deleteStudentAccount = apiClient.deleteStudentAccount.bind(apiClient);
export const getStudentVerification = apiClient.getStudentVerification.bind(apiClient);
export const uploadStudentVerification = apiClient.uploadStudentVerification.bind(apiClient);
export const getOwnerProfile = apiClient.getOwnerProfile.bind(apiClient);
export const updateOwnerProfile = apiClient.updateOwnerProfile.bind(apiClient);
export const getOwnerBusiness = apiClient.getOwnerBusiness.bind(apiClient);
export const updateOwnerBusiness = apiClient.updateOwnerBusiness.bind(apiClient);
export const getOwnerSettings = apiClient.getOwnerSettings.bind(apiClient);
export const updateOwnerSettings = apiClient.updateOwnerSettings.bind(apiClient);
export const deleteOwnerAccount = apiClient.deleteOwnerAccount.bind(apiClient);
export const getOwnerVerification = apiClient.getOwnerVerification.bind(apiClient);
export const uploadOwnerVerification = apiClient.uploadOwnerVerification.bind(apiClient);

export const changePassword = apiClient.changePassword.bind(apiClient);
export const getNotificationSettings = apiClient.getNotificationSettings.bind(apiClient);
export const updateNotificationSettings = apiClient.updateNotificationSettings.bind(apiClient);
export const scheduleMeeting = apiClient.scheduleMeeting.bind(apiClient);
export const getStudentMeetings = apiClient.getStudentMeetings.bind(apiClient);
export const getOwnerMeetings = apiClient.getOwnerMeetings.bind(apiClient);
export const respondToMeeting = apiClient.respondToMeeting.bind(apiClient);
export const acceptMeetingTime = apiClient.acceptMeetingTime.bind(apiClient);
export const getMeetingDetails = apiClient.getMeetingDetails.bind(apiClient);
export const logout = apiClient.logout.bind(apiClient);