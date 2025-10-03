// Custom hooks for API integration
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';

// Dashboard hook
export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getDashboard();
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.error || 'Failed to load dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return { data, loading, error, refetch: loadDashboard };
};

// Rooms hook
export const useRooms = (params = {}) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getRooms(params);
      if (response.success) {
        setRooms(response.data.rooms || []);
        setPagination(response.data.pagination || null);
      } else {
        throw new Error(response.error || 'Failed to load rooms');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [JSON.stringify(params)]);

  return {
    rooms,
    loading,
    error,
    pagination,
    refetch: loadRooms
  };
};

// Single room hook
export const useRoom = (id) => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRoom = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getRoomById(id);
      if (response.success) {
        setRoom(response.data);
      } else {
        throw new Error(response.error || 'Failed to load room');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoom();
  }, [id]);

  return { room, loading, error, refetch: loadRoom };
};

// Properties hook
export const useProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getMyProperties();
      if (response.success) {
        setProperties(response.data.properties || []);
      } else {
        throw new Error(response.error || 'Failed to load properties');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    refetch: loadProperties
  };
};

// Bookings hook
export const useBookings = (params = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getBookings(params);
      if (response.success) {
        setBookings(response.data.bookings || []);
      } else {
        throw new Error(response.error || 'Failed to load bookings');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      const response = await apiClient.createBooking(bookingData);
      if (response.success) {
        await loadBookings(); // Refresh the list
        return response;
      } else {
        throw new Error(response.error || 'Failed to create booking');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    loadBookings();
  }, [JSON.stringify(params)]);

  return {
    bookings,
    loading,
    error,
    createBooking,
    refetch: loadBookings
  };
};

// Meetings hook
export const useMeetings = (params = {}) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getMeetings(params);
      if (response.success) {
        setMeetings(response.data.meetings || []);
      } else {
        throw new Error(response.error || 'Failed to load meetings');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (meetingData) => {
    try {
      const response = await apiClient.createMeeting(meetingData);
      if (response.success) {
        await loadMeetings(); // Refresh the list
        return response;
      } else {
        throw new Error(response.error || 'Failed to create meeting');
      }
    } catch (err) {
      throw err;
    }
  };

  const respondToMeeting = async (meetingId, responseData) => {
    try {
      const response = await apiClient.respondToMeeting(meetingId, responseData);
      if (response.success) {
        await loadMeetings(); // Refresh the list
        return response;
      } else {
        throw new Error(response.error || 'Failed to respond to meeting');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [JSON.stringify(params)]);

  return {
    meetings,
    loading,
    error,
    createMeeting,
    respondToMeeting,
    refetch: loadMeetings
  };
};

// Reviews hook
export const useReviews = (params = {}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getReviews(params);
      if (response.success) {
        setReviews(response.data.reviews || []);
      } else {
        throw new Error(response.error || 'Failed to load reviews');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData) => {
    try {
      const response = await apiClient.createReview(reviewData);
      if (response.success) {
        await loadReviews(); // Refresh the list
        return response;
      } else {
        throw new Error(response.error || 'Failed to create review');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    loadReviews();
  }, [JSON.stringify(params)]);

  return {
    reviews,
    loading,
    error,
    createReview,
    refetch: loadReviews
  };
};

// Room sharing hook
export const useRoomSharing = () => {
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRoomSharing = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getRoomSharingList();
      if (response.success) {
        setShares(response.data.shares || []);
      } else {
        throw new Error(response.error || 'Failed to load room sharing');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRoomSharing = async (sharingData) => {
    try {
      const response = await apiClient.createRoomSharing(sharingData);
      if (response.success) {
        await loadRoomSharing(); // Refresh the list
        return response;
      } else {
        throw new Error(response.error || 'Failed to create room sharing');
      }
    } catch (err) {
      throw err;
    }
  };

  const joinRoomSharing = async (shareId) => {
    try {
      const response = await apiClient.joinRoomSharing(shareId);
      if (response.success) {
        await loadRoomSharing(); // Refresh the list
        return response;
      } else {
        throw new Error(response.error || 'Failed to join room sharing');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    loadRoomSharing();
  }, []);

  return {
    shares,
    loading,
    error,
    createRoomSharing,
    joinRoomSharing,
    refetch: loadRoomSharing
  };
};

// User profile hook
export const useProfile = (userType = 'student') => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = userType === 'student'
        ? await apiClient.getStudentProfile()
        : await apiClient.getOwnerProfile();

      if (response.success) {
        setProfile(response.data);
      } else {
        throw new Error(response.error || 'Failed to load profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = userType === 'student'
        ? await apiClient.updateStudentProfile(profileData)
        : await apiClient.updateOwnerProfile(profileData);

      if (response.success) {
        setProfile(response.data);
        return response;
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    loadProfile();
  }, [userType]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: loadProfile
  };
};

// Current user hook
export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getCurrentUser();
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } else {
        throw new Error(response.error || 'Failed to load user');
      }
    } catch (err) {
      setError(err.message);
      // Try to get user from localStorage as fallback
      const localUser = localStorage.getItem('user');
      if (localUser) {
        setUser(JSON.parse(localUser));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // First try to get user from localStorage
    const localUser = localStorage.getItem('user');
    if (localUser) {
      setUser(JSON.parse(localUser));
      setLoading(false);
    }

    // Then load from API
    loadCurrentUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: loadCurrentUser
  };
};