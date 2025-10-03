/**
 * StudentNest API Client
 * Centralized API communication layer for frontend-backend integration
 */

class APIClient {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';
  }

  /**
   * Generic request method with error handling and token management
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get token from localStorage (client-side) or context
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }
      
      return { 
        success: response.ok, 
        data, 
        status: response.status,
        message: data.message || data.error || 'Request completed'
      };
    } catch (error) {
      console.error(`API Request Error [${endpoint}]:`, error);
      return { 
        success: false, 
        error: error.message, 
        status: 0,
        message: 'Network error occurred'
      };
    }
  }

  // ==========================================
  // AUTHENTICATION METHODS
  // ==========================================

  /**
   * User login (Student/Owner)
   */
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: credentials.email || credentials.identifier,
        password: credentials.password,
        role: credentials.role || 'student'
      }),
    });
  }

  /**
   * User logout (optional - mainly clears client-side storage)
   */
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    return Promise.resolve({ success: true });
  }

  // ==========================================
  // DASHBOARD METHODS
  // ==========================================

  /**
   * Get user dashboard data (role-based)
   */
  async getDashboard() {
    return this.request('/api/dashboard');
  }

  // ==========================================
  // ROOM METHODS
  // ==========================================

  /**
   * Get rooms list with optional filtering and pagination
   */
  async getRooms(params = {}) {
    const cleanParams = {};
    
    // Only include non-empty parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key];
      }
    });

    const query = new URLSearchParams(cleanParams).toString();
    return this.request(`/api/rooms${query ? `?${query}` : ''}`);
  }

  /**
   * Get detailed information for a specific room
   */
  async getRoomDetails(id) {
    return this.request(`/api/rooms/${id}`);
  }

  // ==========================================
  // BOOKING METHODS
  // ==========================================

  /**
   * Create a new booking
   */
  async createBooking(bookingData) {
    return this.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        roomId: bookingData.roomId,
        moveInDate: bookingData.moveInDate,
        duration: bookingData.duration || 6,
        agreementType: bookingData.agreementType || 'monthly',
        notes: bookingData.notes || '',
        securityDeposit: bookingData.securityDeposit,
        maintenanceCharges: bookingData.maintenanceCharges,
        isUrgent: bookingData.isUrgent || false
      }),
    });
  }

  /**
   * Get user's bookings (filtered by role)
   */
  async getBookings(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/bookings${query ? `?${query}` : ''}`);
  }

  // ==========================================
  // MEETING METHODS
  // ==========================================

  /**
   * Schedule a meeting with property owner
   */
  async scheduleMeeting(meetingData) {
    return this.request('/api/meetings', {
      method: 'POST',
      body: JSON.stringify({
        propertyId: meetingData.propertyId,
        ownerId: meetingData.ownerId,
        preferredDates: meetingData.preferredDates,
        meetingType: meetingData.meetingType || 'physical',
        notes: meetingData.notes || '',
        purpose: meetingData.purpose || 'property_viewing',
        isUrgent: meetingData.isUrgent || false
      }),
    });
  }

  /**
   * Get user's meetings (filtered by role)
   */
  async getMeetings(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/meetings${query ? `?${query}` : ''}`);
  }

  // ==========================================
  // REVIEW METHODS
  // ==========================================

  /**
   * Submit a review for a property
   */
  async submitReview(reviewData) {
    return this.request('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        propertyId: reviewData.propertyId,
        overallRating: reviewData.overallRating,
        categories: {
          cleanliness: reviewData.categories?.cleanliness || reviewData.overallRating,
          location: reviewData.categories?.location || reviewData.overallRating,
          facilities: reviewData.categories?.facilities || reviewData.overallRating,
          owner: reviewData.categories?.owner || reviewData.overallRating,
          value: reviewData.categories?.value || reviewData.overallRating
        },
        comment: reviewData.comment || '',
        stayDuration: reviewData.stayDuration || '1-3 months',
        images: reviewData.images || []
      }),
    });
  }

  /**
   * Get reviews for a property
   */
  async getReviews(propertyId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/reviews/${propertyId}${query ? `?${query}` : ''}`);
  }

  // ==========================================
  // ROOM SHARING METHODS
  // ==========================================

  /**
   * Create a room sharing request
   */
  async createRoomSharing(sharingData) {
    return this.request('/api/room-sharing', {
      method: 'POST',
      body: JSON.stringify({
        propertyId: sharingData.propertyId,
        maxParticipants: sharingData.maxParticipants || 2,
        description: sharingData.description,
        costSharing: {
          monthlyRent: sharingData.costSharing.monthlyRent,
          securityDeposit: sharingData.costSharing.securityDeposit,
          maintenanceCharges: sharingData.costSharing.maintenanceCharges || 0
        },
        requirements: {
          gender: sharingData.requirements?.gender || 'any',
          ageRange: {
            min: sharingData.requirements?.ageRange?.min || 18,
            max: sharingData.requirements?.ageRange?.max || 30
          },
          preferences: sharingData.requirements?.preferences || []
        },
        roomConfiguration: sharingData.roomConfiguration || {},
        availableFrom: sharingData.availableFrom,
        tags: sharingData.tags || []
      }),
    });
  }

  /**
   * Get room sharing opportunities
   */
  async getRoomSharing(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/room-sharing${query ? `?${query}` : ''}`);
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  /**
   * Health check for API connection
   */
  async healthCheck() {
    return this.request('/api/health');
  }

  /**
   * Test authentication status
   */
  async testAuth() {
    return this.request('/api/dashboard');
  }
}

// Create and export singleton instance
export const apiClient = new APIClient();

// Export class for testing or custom instances
export default APIClient;

// Export individual methods for convenience
export const {
  login,
  logout,
  getDashboard,
  getRooms,
  getRoomDetails,
  createBooking,
  getBookings,
  scheduleMeeting,
  getMeetings,
  submitReview,
  getReviews,
  createRoomSharing,
  getRoomSharing,
  healthCheck,
  testAuth
} = apiClient;