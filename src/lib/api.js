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
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Only add Content-Type for non-FormData requests
    const isFormData = options.body instanceof FormData || options.isFormData;
    if (!isFormData) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const config = {
      headers: defaultHeaders,
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // Only stringify body if it's not FormData and is an object
    if (config.body && typeof config.body === 'object' && !isFormData) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle 401 - Token expired, try to refresh
      if (response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {
        console.log('Token expired, attempting to refresh...');
        
        try {
          const refreshResponse = await this.attemptTokenRefresh();
          if (refreshResponse.success) {
            // Retry original request with new token
            config.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
            const retryResponse = await fetch(url, config);
            return await retryResponse.json();
          }
        } catch (refreshError) {
          console.log('Token refresh failed:', refreshError.message);
          this.handleAuthFailure();
          throw new Error('Authentication failed');
        }
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle other auth failures
        if (response.status === 401) {
          this.handleAuthFailure();
        }
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', endpoint, error);
      throw error;
    }
  }

  async attemptTokenRefresh() {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Include httpOnly cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update stored token
        this.setToken(data.accessToken);
        
        // Update user data if provided
        if (data.user && typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        console.log('Token refreshed successfully');
        return data;
      } else {
        throw new Error(data.message || 'Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  handleAuthFailure() {
    console.log('Authentication failed, redirecting to login...');
    this.clearToken();
    
    if (typeof window !== 'undefined') {
      // Store current page for redirect after login
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        localStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      // Redirect to login
      window.location.href = '/login';
    }
  }

  // Auth methods
  async login(identifier, password, role, rememberMe = true) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { identifier, password, role, rememberMe },
      credentials: 'include', // Include httpOnly cookies
    });

    if (response.success && response.accessToken) {
      this.setToken(response.accessToken);
      
      // Store user data and login state
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('loginTime', new Date().toISOString());
        
        // Handle redirect after login
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
          window.location.href = redirectPath;
        }
      }
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

  async rescheduleMeeting(meetingId, rescheduleData) {
    return this.request(`/meetings/${meetingId}/reschedule`, {
      method: 'POST',
      body: rescheduleData,
    });
  }

  async cancelMeeting(meetingId, cancelData) {
    return this.request(`/meetings/${meetingId}/cancel`, {
      method: 'POST',
      body: cancelData,
    });
  }

  async createGoogleMeet(meetingId, meetData) {
    return this.request(`/meetings/${meetingId}/google-meet`, {
      method: 'POST',
      body: { action: 'create', ...meetData },
    });
  }

  async joinGoogleMeet(meetingId) {
    return this.request(`/meetings/${meetingId}/google-meet`, {
      method: 'POST',
      body: { action: 'join' },
    });
  }

  async endGoogleMeet(meetingId) {
    return this.request(`/meetings/${meetingId}/google-meet`, {
      method: 'POST',
      body: { action: 'end' },
    });
  }

  async getGoogleMeetDetails(meetingId) {
    return this.request(`/meetings/${meetingId}/google-meet`, {
      method: 'GET',
    });
  }

  async submitMeetingRating(meetingId, ratingData) {
    return this.request(`/meetings/${meetingId}/rating`, {
      method: 'POST',
      body: ratingData,
    });
  }

  async getMeetingRating(meetingId) {
    return this.request(`/meetings/${meetingId}/rating`, {
      method: 'GET',
    });
  }

  async studentRespondToMeeting(meetingId, responseData) {
    return this.request(`/meetings/${meetingId}/student-respond`, {
      method: 'POST',
      body: responseData,
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
    try {
      const response = await this.request('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear all stored data
      this.clearToken();
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTime');
      }
      
      return response;
    } catch (error) {
      // Clear local data even if server request fails
      this.clearToken();
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTime');
      }
      
      throw error;
    }
  }

  // Authentication persistence methods
  async checkAuthStatus() {
    if (typeof window === 'undefined') return false;
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = this.getToken();
    
    if (!isLoggedIn || !token) {
      return false;
    }
    
    try {
      // Try to get current user to validate token
      const response = await this.getCurrentUser();
      return response.success;
    } catch (error) {
      // Token invalid, try refresh
      try {
        const refreshResponse = await this.attemptTokenRefresh();
        return refreshResponse.success;
      } catch (refreshError) {
        this.clearAuthData();
        return false;
      }
    }
  }

  async initializeAuth() {
    if (typeof window === 'undefined') return null;
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const token = this.getToken();
    const userData = localStorage.getItem('user');
    
    if (!isLoggedIn || !token) {
      return null;
    }
    
    try {
      // Set the token
      this.setToken(token);
      
      // Try to refresh user data from server
      const response = await this.getCurrentUser();
      if (response.success && response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        return response.user;
      } else if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      // Try token refresh
      try {
        const refreshResponse = await this.attemptTokenRefresh();
        if (refreshResponse.success) {
          return refreshResponse.user;
        }
      } catch (refreshError) {
        console.log('Auto-login failed, clearing auth data');
        this.clearAuthData();
      }
    }
    
    return null;
  }

  clearAuthData() {
    this.clearToken();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loginTime');
    }
  }

  getStoredUser() {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  // Owner Analytics methods
  async getOwnerAnalytics(type = 'all') {
    return this.request(`/owner/analytics?type=${type}`, {
      method: 'GET',
    });
  }

  async getOwnerActivity() {
    return this.request('/owner/analytics?type=activity', {
      method: 'GET',
    });
  }

  async getOwnerVisitRequests() {
    return this.request('/owner/analytics?type=visits', {
      method: 'GET',
    });
  }

  async getOwnerRevenue() {
    return this.request('/owner/analytics?type=revenue', {
      method: 'GET',
    });
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