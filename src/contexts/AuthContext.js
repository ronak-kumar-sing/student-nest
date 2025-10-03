'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user with credentials
   */
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(credentials);
      
      if (response.success && response.data.success) {
        const { accessToken, user: userData } = response.data;
        
        // Update state
        setToken(accessToken);
        setUser(userData);
        
        // Persist to localStorage
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setLoading(false);
        return { success: true, user: userData };
      } else {
        const errorMessage = response.data?.message || response.data?.error || 'Login failed';
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'Network error. Please try again.';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Logout user and clear session
   */
  const logout = async () => {
    try {
      // Clear API client state
      await apiClient.logout();
      
      // Clear local state
      setToken(null);
      setUser(null);
      setError(null);
      
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  };

  /**
   * Update user data in context and storage
   */
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role) => {
    return user?.role?.toLowerCase() === role.toLowerCase();
  };

  /**
   * Check if user is student
   */
  const isStudent = () => hasRole('student');

  /**
   * Check if user is owner
   */
  const isOwner = () => hasRole('owner');

  /**
   * Verify token validity (optional - can be called periodically)
   */
  const verifyToken = async () => {
    if (!token) return false;

    try {
      const response = await apiClient.testAuth();
      return response.success;
    } catch (error) {
      console.error('Token verification failed:', error);
      // Auto logout on token verification failure
      await logout();
      return false;
    }
  };

  /**
   * Clear any authentication errors
   */
  const clearError = () => setError(null);

  // Context value
  const value = {
    // State
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    
    // Methods
    login,
    logout,
    updateUser,
    verifyToken,
    clearError,
    
    // Utility methods
    hasRole,
    isStudent,
    isOwner,
    
    // User data shortcuts
    userId: user?.id || user?._id,
    userName: user?.fullName,
    userEmail: user?.email,
    userRole: user?.role,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

/**
 * HOC for protecting routes
 */
export const withAuth = (WrappedComponent, options = {}) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading, hasRole } = useAuth();
    const { requireRole } = options;

    // Show loading while checking auth
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>;
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    // Check role if required
    if (requireRole && !hasRole(requireRole)) {
      return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default AuthContext;