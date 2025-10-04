"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  TrendingUp,
  MapPin,
  Clock
} from "lucide-react";
import { useEffect, useState } from "react";
import RoomBrowser from "@/components/room/RoomBrowser";
import SplitText from "@/components/animations/SplitText";
import VerificationWidget from "@/components/verification/VerificationWidget";
import { useVerificationStatus } from "@/components/verification/VerificationGuard";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const { verificationStatus, isVerified } = useVerificationStatus();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isStudent = user?.role === 'Student' || user?.userType === 'student';
  const isOwner = user?.role === 'Owner' || user?.userType === 'owner';

  // If user is an owner, redirect to owner dashboard
  useEffect(() => {
    if (isOwner) {
      window.location.href = '/owner/dashboard';
    }
  }, [isOwner]);

  // If user is a student, show the room browser
  if (isStudent) {
    return (
      <div className="space-y-6">
        {/* Verification Widget */}
        {!isVerified && (
          <VerificationWidget userRole="student" compact={false} />
        )}

        {/* Welcome Header */}
        {/* <div className="border-b border-gray-700 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            <SplitText
              text={`Welcome back, ${user?.fullName || user?.username}!`}
              className="text-3xl font-bold"
              delay={50}
              duration={0.8}
            />
          </h1>
          <p className="text-gray-400">
            Find your perfect accommodation near top universities
          </p>
        </div> */}



        {/* Room Browser Component */}
        <RoomBrowser />
      </div>
    );
  }

  // Loading state for owners while redirecting
  if (isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirecting to Owner Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="border-b border-gray-700 pb-6">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.fullName || user?.username}!
        </h1>
        <p className="text-gray-400 mt-2">
          {isStudent ? "Find your perfect accommodation" : "Manage your properties and bookings"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {isStudent && (
          <>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Saved Properties</CardTitle>
                <Home className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">12</div>
                <p className="text-xs text-gray-400">
                  +2 from last week
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Applications</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">3</div>
                <p className="text-xs text-gray-400">
                  2 pending review
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">8</div>
                <p className="text-xs text-gray-400">
                  3 unread
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Visits Scheduled</CardTitle>
                <Calendar className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">2</div>
                <p className="text-xs text-gray-400">
                  This week
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {isOwner && (
          <>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Active Listings</CardTitle>
                <Home className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">5</div>
                <p className="text-xs text-gray-400">
                  2 fully booked
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₹45,000</div>
                <p className="text-xs text-gray-400">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Pending Visits</CardTitle>
                <Calendar className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">7</div>
                <p className="text-xs text-gray-400">
                  This week
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">12</div>
                <p className="text-xs text-gray-400">
                  5 unread
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your latest updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isStudent && (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-white">New message from Sunshine PG</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-white">Visit confirmed for tomorrow</p>
                    <p className="text-xs text-gray-400">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-white">Application under review</p>
                    <p className="text-xs text-gray-400">1 day ago</p>
                  </div>
                </div>
              </>
            )}
            {isOwner && (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-white">New booking request received</p>
                    <p className="text-xs text-gray-400">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-white">Payment received - ₹15,000</p>
                    <p className="text-xs text-gray-400">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-white">Property listing approved</p>
                    <p className="text-xs text-gray-400">6 hours ago</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-gray-400">
              Common tasks to get you started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isStudent && (
              <>
                <Button variant="outline" className="w-full justify-start border-gray-600 hover:bg-gray-700">
                  <Home className="h-4 w-4 mr-2" />
                  Browse Properties
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-600 hover:bg-gray-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule a Visit
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-600 hover:bg-gray-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </>
            )}
            {isOwner && (
              <>
                <Button variant="outline" className="w-full justify-start border-gray-600 hover:bg-gray-700">
                  <Home className="h-4 w-4 mr-2" />
                  Post New Property
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-600 hover:bg-gray-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Bookings
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-600 hover:bg-gray-700">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
