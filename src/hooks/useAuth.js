'use client';

import { useState, useEffect, useContext, createContext } from 'react';
import apiClient from '@/lib/api';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setLoading(true);
    
    try {
      // Try to get user from stored session
      const storedUser = apiClient.getStoredUser();
      
      if (storedUser && apiClient.getToken()) {
        // Validate and refresh if needed
        const authenticatedUser = await apiClient.initializeAuth();
        
        if (authenticatedUser) {
          setUser(authenticatedUser);
          setIsAuthenticated(true);
          console.log('Auto-login successful:', authenticatedUser.email);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('Auth initialization error:', error.message);
      setUser(null);
      setIsAuthenticated(false);
      apiClient.clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password, role, rememberMe = true) => {
    try {
      setLoading(true);
      
      const response = await apiClient.login(identifier, password, role, rememberMe);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        
        console.log('Login successful:', response.user.email);
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      await apiClient.logoutUser();
      
      setUser(null);
      setIsAuthenticated(false);
      
      console.log('Logout successful');
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      
      // Clear local state even if server request fails
      setUser(null);
      setIsAuthenticated(false);
      apiClient.clearAuthData();
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      const isValid = await apiClient.checkAuthStatus();
      
      if (!isValid) {
        setUser(null);
        setIsAuthenticated(false);
        apiClient.clearAuthData();
        return false;
      }
      
      // Get updated user data
      const response = await apiClient.getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.log('Auth refresh failed:', error.message);
      setUser(null);
      setIsAuthenticated(false);
      apiClient.clearAuthData();
      return false;
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshAuth,
    updateUser,
    initializeAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Higher-order component for protected routes
export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading, user } = useAuth();
    
    useEffect(() => {
      if (!loading && !isAuthenticated) {
        // Store current path for redirect after login
        const currentPath = window.location.pathname + window.location.search;
        if (currentPath !== '/login' && currentPath !== '/signup') {
          localStorage.setItem('redirectAfterLogin', currentPath);
        }
        
        window.location.href = '/login';
      }
    }, [loading, isAuthenticated]);
    
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return null; // Will redirect
    }
    
    return <Component {...props} user={user} />;
  };
}

// Hook for checking specific permissions
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();
  
  const hasRole = (requiredRole) => {
    if (!isAuthenticated || !user) return false;
    return user.role === requiredRole;
  };
  
  const isStudent = () => hasRole('student');
  const isOwner = () => hasRole('owner');
  const isAdmin = () => hasRole('admin');
  
  const hasVerification = (type) => {
    if (!isAuthenticated || !user) return false;
    
    switch (type) {
      case 'email':
        return user.isEmailVerified;
      case 'phone':
        return user.isPhoneVerified;
      case 'identity':
        return user.isIdentityVerified;
      default:
        return false;
    }
  };
  
  return {
    hasRole,
    isStudent,
    isOwner,
    isAdmin,
    hasVerification,
    isAuthenticated,
    user
  };
}