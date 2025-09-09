"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Crown,
  RefreshCw,
  Settings,
  Download,
  ExternalLink,
  Calendar,
  DollarSign
} from "lucide-react";

// Import our dashboard components
import OwnerStatsCards from "@/components/dashboard/OwnerStatsCards";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import OwnerQuickActions from "@/components/dashboard/OwnerQuickActions";
import AnalyticsOverview from "@/components/dashboard/AnalyticsOverview";

export default function OwnerDashboardPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    activities: [],
    analytics: {}
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }

    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data - replace with actual API calls
      setDashboardData({
        stats: {
          activeListings: 5,
          fullyBooked: 2,
          monthlyRevenue: 45000,
          revenueChange: 12,
          pendingVisits: 7,
          totalMessages: 12,
          unreadMessages: 5,
          totalBookings: 23,
          occupancyRate: 85,
          pendingBookings: 3
        },
        activities: [
          {
            id: 1,
            type: "booking",
            title: "New booking request received",
            description: "Rajesh Kumar requested to book Single Room at Green Valley PG",
            time: "2 hours ago",
            icon: Calendar,
            color: "blue",
            urgent: false
          },
          {
            id: 2,
            type: "payment",
            title: "Payment received",
            description: "₹15,000 received from Priya Sharma for December rent",
            time: "3 hours ago",
            icon: DollarSign,
            color: "green",
            urgent: false
          }
        ],
        analytics: {
          monthlyRevenue: 45000,
          revenueChange: 12,
          totalBookings: 23,
          bookingChange: 8,
          averageOccupancy: 85,
          occupancyChange: -3,
          totalProperties: 5,
          topPerformingProperty: "Green Valley PG",
          conversionRate: 68,
          conversionChange: 5
        }
      });

      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.fullName || user?.username}!
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage your properties and track your business performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Separator />

      {/* Owner Stats Cards */}
      <OwnerStatsCards stats={dashboardData.stats} />

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Activity Feed (takes 2 columns) */}
        <div className="xl:col-span-2 space-y-6">
          <ActivityFeed activities={dashboardData.activities} />
          <AnalyticsOverview analyticsData={dashboardData.analytics} />
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <OwnerQuickActions stats={dashboardData.stats} />

          {/* Additional Owner Tools */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Owner Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/help/owner-guide" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Owner Guide
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/support" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Contact Support
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/legal/terms" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Terms & Conditions
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Bar */}
      <Card className="bg-muted/30 border-border">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
              <Badge variant="outline" className="text-xs">
                All systems operational
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Need help?</span>
              <Button variant="link" size="sm" className="p-0 h-auto">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
