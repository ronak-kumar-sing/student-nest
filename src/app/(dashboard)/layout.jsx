"use client";

import { UserSidebar } from "@/components/user-sidebar";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage or API
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userData && token) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          name: parsedUser.fullName || parsedUser.username || 'User',
          image: parsedUser.avatar || null,
          role: parsedUser.userType === 'owner' ? 'owner' : 'student',
          signedIn: true,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Redirect to login if invalid data
        window.location.href = '/';
      }
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/';
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <UserSidebar user={user}>
      <div className="p-4 md:p-6 lg:p-8">
        {children}
      </div>
    </UserSidebar>
  );
}
