// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password'
  },
  
  // Properties/Rooms
  ROOMS: {
    LIST: '/api/rooms',
    DETAILS: (id) => `/api/rooms/${id}`,
    CREATE: '/api/rooms',
    UPDATE: (id) => `/api/rooms/${id}`,
    DELETE: (id) => `/api/rooms/${id}`,
    OWNER_ROOMS: (ownerId) => `/api/rooms/owner/${ownerId}`
  },
  
  // Dashboard
  DASHBOARD: {
    STUDENT: '/api/dashboard',
    OWNER: '/api/dashboard'
  },
  
  // Bookings
  BOOKINGS: {
    CREATE: '/api/bookings',
    LIST: '/api/bookings',
    DETAILS: (id) => `/api/bookings/${id}`,
    CONFIRM: (id) => `/api/bookings/${id}/confirm`,
    CANCEL: (id) => `/api/bookings/${id}/cancel`
  },
  
  // Meetings
  MEETINGS: {
    CREATE: '/api/meetings',
    LIST: '/api/meetings',
    RESPOND: (id) => `/api/meetings/${id}/respond`,
    RESCHEDULE: (id) => `/api/meetings/${id}/reschedule`
  },
  
  // Reviews
  REVIEWS: {
    CREATE: '/api/reviews',
    LIST: (propertyId) => `/api/reviews/property/${propertyId}`,
    HELPFUL: (id) => `/api/reviews/${id}/helpful`,
    DELETE: (id) => `/api/reviews/${id}`
  },
  
  // Room Sharing
  ROOM_SHARING: {
    CREATE: '/api/room-sharing',
    LIST: '/api/room-sharing',
    JOIN: (id) => `/api/room-sharing/${id}/join`
  },
  
  // Profile
  PROFILE: {
    STUDENT: '/api/profile/student',
    OWNER: '/api/profile/owner',
    UPDATE: '/api/profile/update'
  }
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};