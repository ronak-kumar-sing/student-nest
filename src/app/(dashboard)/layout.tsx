"use client";

import { UserSidebar } from "@/components/user-sidebar";
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import VerificationGuard from "@/components/verification/VerificationGuard";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "owner";
  image?: string;
  signedIn: boolean;
  isIdentityVerified?: boolean;
  identityVerificationSkipped?: boolean;
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get user from localStorage
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      // Not authenticated, redirect to login
      router.push("/");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      // Ensure signedIn is set to true
      setUser({ ...userData, signedIn: true });
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <VerificationGuard userRole={user.role}>
      <UserSidebar user={user}>
        {children}
      </UserSidebar>
    </VerificationGuard>
  );
}
