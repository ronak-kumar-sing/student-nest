// Complete API utility for StudentNest Frontend-Backend Integration
import type { ApiResponse, User } from '@/types';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-domain.com'
  : 'http://localhost:3000';

class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('accessToken', token);
    }
  }

  getToken(): string | null {
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
      localStorage.removeItem('isLoggedIn');
    }
  }

  async request<T = any>(endpoint: string, options: RequestInit & { isFormData?: boolean } = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}/api${endpoint}`;
    const token = this.getToken();

    const defaultHeaders: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Only add Content-Type for non-FormData requests
    const isFormData = options.body instanceof FormData || options.isFormData;
    if (!isFormData) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
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
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${refreshResponse.data?.accessToken}`,
            };
            const retryResponse = await fetch(url, config);
            return await retryResponse.json();
          }
        } catch (refreshError) {
          console.log('Token refresh failed:', refreshError);
          this.handleAuthFailure();
          throw new Error('Authentication failed');
        }
      }

      const data: ApiResponse<T> = await response.json();

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

  async attemptTokenRefresh(): Promise<ApiResponse<{ accessToken: string; user: User }>> {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Include httpOnly cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: ApiResponse<{ accessToken: string; user: User }> = await response.json();

      if (response.ok && data.success && data.data) {
        // Update stored token
        this.setToken(data.data.accessToken);

        // Update user data if provided
        if (data.data.user && typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.data.user));
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
      if (currentPath !== '/student/login' && currentPath !== '/owner/login' && currentPath !== '/student/signup' && currentPath !== '/owner/signup') {
        localStorage.setItem('redirectAfterLogin', currentPath);
      }

      // Redirect to login
      window.location.href = '/student/login';
    }
  }

  clearAuthData() {
    this.clearToken();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;

    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  async initializeAuth(): Promise<User | null> {
    try {
      const token = this.getToken();

      if (!token) {
        this.clearAuthData();
        return null;
      }

      const response = await this.request<{ user: User }>('/auth/me');

      if (response.success && response.data?.user) {
        const user = response.data.user;

        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('isLoggedIn', 'true');
        }

        return user;
      }

      this.clearAuthData();
      return null;
    } catch (error) {
      console.error('Auth initialization failed:', error);
      this.clearAuthData();
      return null;
    }
  }

  async login(identifier: string, password: string, role?: 'student' | 'owner', rememberMe = true) {
    try {
      const response = await this.request<{ user: User; accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password, role }),
      });

      if (response.success && response.data) {
        this.setToken(response.data.accessToken);

        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('isLoggedIn', 'true');
        }

        return { success: true, user: response.data.user };
      }

      return { success: false, error: response.error || 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  }

  async logoutUser() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.clearAuthData();
    }
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      const response = await this.request('/auth/check');
      return response.success;
    } catch {
      return false;
    }
  }

  async getCurrentUser() {
    return this.request<{ user: User }>('/auth/me');
  }

  // Saved rooms methods
  async getSavedRooms() {
    return this.request('/saved-rooms');
  }

  async saveRoom(roomId: string) {
    return this.request('/saved-rooms', {
      method: 'POST',
      body: { roomId } as any,
    });
  }

  async unsaveRoom(roomId: string) {
    return this.request(`/saved-rooms?roomId=${roomId}`, {
      method: 'DELETE',
    });
  }

  async isRoomSaved(roomId: string) {
    const response = await this.getSavedRooms();
    if (response.success) {
      return response.data.savedRooms.some((room: any) => room.id === roomId);
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

  async postProperty(propertyData: any) {
    return this.request('/properties/post', {
      method: 'POST',
      body: propertyData as any,
    });
  }

  // Room methods
  async getRoomById(id: string) {
    return this.request(`/rooms/${id}`);
  }

  async getRooms() {
    return this.request('/rooms');
  }

  // Booking methods
  async getBookings() {
    return this.request('/bookings');
  }

  async createBooking(bookingData: any) {
    return this.request('/bookings', {
      method: 'POST',
      body: bookingData as any,
    });
  }

  async validateBookingEligibility(roomId: string, userId: string) {
    return this.request('/bookings/validate', {
      method: 'POST',
      body: { roomId, userId } as any,
    });
  }

  async getBookingById(id: string) {
    return this.request(`/bookings/${id}`);
  }

  async updateBookingStatus(id: string, status: string) {
    return this.request(`/bookings/${id}/status`, {
      method: 'PUT',
      body: { status } as any,
    });
  }

  // Review methods
  async getReviews(params?: { propertyId?: string; studentId?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/reviews${query ? `?${query}` : ''}`);
  }

  async createReview(reviewData: any) {
    return this.request('/reviews', {
      method: 'POST',
      body: reviewData as any,
    });
  }

  async updateReview(id: string, reviewData: any) {
    return this.request(`/reviews/${id}`, {
      method: 'PUT',
      body: reviewData as any,
    });
  }

  async deleteReview(id: string) {
    return this.request(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  // Meeting/Visit methods
  async scheduleMeeting(meetingData: any) {
    return this.request('/meetings', {
      method: 'POST',
      body: meetingData as any,
    });
  }

  async getMeetings() {
    return this.request('/meetings');
  }

  async updateMeetingStatus(id: string, status: string) {
    return this.request(`/meetings/${id}/status`, {
      method: 'PUT',
      body: { status } as any,
    });
  }
}

const apiClient = new ApiClient();
export default apiClient;
