// Complete API utility for StudentNest Frontend-Backend Integration

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-domain.com'
  : 'http://localhost:3000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('accessToken', token);
    }
  }

  getToken() {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken') || localStorage.getItem('token');
    }
    return null;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    const token = this.getToken();

    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const config = {
      headers: defaultHeaders,
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    if (config.body && typeof config.body === 'object' && !config.isFormData) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle token expiry
        if (response.status === 401) {
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', endpoint, error);
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

  // Dashboard methods
  async getDashboard() {
    return this.request('/dashboard');
  }

  // Room methods
  async getRooms(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/rooms${queryString ? `?${queryString}` : ''}`);
  }

  async getRoomById(id) {
    return this.request(`/rooms/${id}`);
  }

  // Saved rooms methods
  async getSavedRooms() {
    return this.request('/saved-rooms');
  }

  async saveRoom(roomId) {
    return this.request('/saved-rooms', {
      method: 'POST',
      body: { roomId },
    });
  }

  async unsaveRoom(roomId) {
    return this.request(`/saved-rooms?roomId=${roomId}`, {
      method: 'DELETE',
    });
  }

  async isRoomSaved(roomId) {
    const response = await this.getSavedRooms();
    if (response.success) {
      return response.data.savedRooms.some(room => room.id === roomId);
    }
    return false;
  }

  // Property methods
  async getProperties() {
    return this.request('/properties');
  }

  async getMyProperties() {
    return this.request('/properties/my-properties');
  }

  async postProperty(propertyData) {
    return this.request('/properties/post', {
      method: 'POST',
      body: propertyData,
    });
  }

  // Booking methods
  async getBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/bookings${queryString ? `?${queryString}` : ''}`);
  }

  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: bookingData,
    });
  }

  async getBookingById(id) {
    return this.request(`/bookings/${id}`);
  }

  async updateBooking(id, data) {
    return this.request(`/bookings/${id}`, {
      method: 'PATCH',
      body: data,
    });
  }

  async processPayment(bookingId, paymentAmount, paymentMethod = 'card') {
    return this.request('/bookings/payment', {
      method: 'POST',
      body: {
        bookingId,
        paymentAmount,
        paymentMethod
      },
    });
  }

  // Meeting methods (additional)
  async getMeetings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/meetings${queryString ? `?${queryString}` : ''}`);
  }

  async createMeeting(meetingData) {
    return this.request('/meetings', {
      method: 'POST',
      body: meetingData,
    });
  }

  async getMeetingById(id) {
    return this.request(`/meetings/${id}`);
  }

  // Review methods
  async getReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/reviews${queryString ? `?${queryString}` : ''}`);
  }

  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: reviewData,
    });
  }

  async getReviewById(id) {
    return this.request(`/reviews/${id}`);
  }

  // Room Sharing methods
  async getRoomSharingList() {
    return this.request('/room-sharing/list');
  }

  async createRoomSharing(sharingData) {
    return this.request('/room-sharing', {
      method: 'POST',
      body: sharingData,
    });
  }

  async getRoomSharingById(id) {
    return this.request(`/room-sharing/${id}`);
  }

  async joinRoomSharing(id) {
    return this.request(`/room-sharing/${id}/join`, {
      method: 'POST',
    });
  }

  async postRoomSharing(postData) {
    return this.request('/room-sharing/post', {
      method: 'POST',
      body: postData,
    });
  }

  async roomSharingAssessment(assessmentData) {
    return this.request('/room-sharing/assessment', {
      method: 'POST',
      body: assessmentData,
    });
  }

  // Upload methods
  async uploadFile(formData) {
    return this.request('/upload', {
      method: 'POST',
      body: formData,
      headers: {},
      isFormData: true,
    });
  }

  async uploadPropertyImage(formData) {
    return this.request('/upload/property', {
      method: 'POST',
      body: formData,
      headers: {},
      isFormData: true,
    });
  }

  async debugUpload() {
    return this.request('/upload/debug');
  }

  // Verification methods (additional)
  async getVerificationStatus() {
    return this.request('/verify/status');
  }

  async getVerificationRequirements() {
    return this.request('/verify/requirements');
  }

  async uploadDocument(formData) {
    return this.request('/verify/upload-document', {
      method: 'POST',
      body: formData,
      headers: {},
      isFormData: true,
    });
  }

  async uploadSelfie(formData) {
    return this.request('/verify/upload-selfie', {
      method: 'POST',
      body: formData,
      headers: {},
      isFormData: true,
    });
  }

  async uploadSelfieMock(formData) {
    return this.request('/verify/upload-selfie-mock', {
      method: 'POST',
      body: formData,
      headers: {},
      isFormData: true,
    });
  }

  async setupUser(userData) {
    return this.request('/verify/setup-user', {
      method: 'POST',
      body: userData,
    });
  }

  async fixVerificationStatus(statusData) {
    return this.request('/verify/fix-status', {
      method: 'POST',
      body: statusData,
    });
  }

  async testConnection() {
    return this.request('/verify/test-connection');
  }

  async debugUser() {
    return this.request('/verify/debug-user');
  }

  async debugVerification() {
    return this.request('/verify/debug');
  }

  async verifyDigilocker() {
    return this.request('/verify/digilocker');
  }

  // OTP methods (additional)
  async sendOtp(otpData) {
    return this.request('/otp/send', {
      method: 'POST',
      body: otpData,
    });
  }

  async verifyOtp(verificationData) {
    return this.request('/otp/verify', {
      method: 'POST',
      body: verificationData,
    });
  }

  // Authentication methods (additional)
  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  async forgotPassword(identifier) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: { identifier },
    });
  }

  async resetPassword(token, password) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: { token, password },
    });
  }

  async logoutUser() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    this.clearToken();
    return response;
  }

  // Admin methods
  async adminLogin(credentials) {
    return this.request('/admin/auth/login', {
      method: 'POST',
      body: credentials,
    });
  }

  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async reviewVerification(reviewData) {
    return this.request('/admin/verification/review', {
      method: 'POST',
      body: reviewData,
    });
  }

  // Health check methods
  async getHealthServices() {
    return this.request('/health/services');
  }

  // Debug methods
  async debugLogin() {
    return this.request('/debug-login');
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