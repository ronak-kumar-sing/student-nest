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
import VisitRequestsWidget from "@/components/dashboard/VisitRequestsWidget";
import RevenueWidget from "@/components/dashboard/RevenueWidget";
import VerificationWidget from "@/components/verification/VerificationWidget";
import { useVerificationStatus } from "@/components/verification/VerificationGuard";
import apiClient from "@/lib/api";

export default function OwnerDashboardPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    activities: [],
    analytics: {}
  });
  const { verificationStatus, isVerified } = useVerificationStatus();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }

    // Load dashboard data from API
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load dashboard data and analytics in parallel
      const [dashboardResponse, analyticsResponse] = await Promise.all([
        apiClient.getDashboard(),
        apiClient.getOwnerAnalytics('all')
      ]);

      if (dashboardResponse.success && analyticsResponse.success) {
        const dashData = dashboardResponse.data;
        const analyticsData = analyticsResponse.data;

        setDashboardData({
          stats: {
            activeListings: dashData.stats?.activeListings || 0,
            fullyBooked: dashData.stats?.fullyBooked || 0,
            monthlyRevenue: dashData.stats?.monthlyRevenue || analyticsData.revenue?.currentMonth || 0,
            revenueChange: analyticsData.revenue?.changePercentage || dashData.stats?.revenueChange || 0,
            pendingVisits: dashData.stats?.pendingVisits || analyticsData.visitRequests?.pending || 0,
            totalMessages: dashData.stats?.totalMessages || 0,
            unreadMessages: dashData.stats?.unreadMessages || 0,
            totalBookings: dashData.stats?.totalBookings || 0,
            occupancyRate: dashData.stats?.occupancyRate || 0,
            pendingBookings: dashData.stats?.pendingBookings || 0,
            totalReviews: dashData.stats?.totalReviews || 0
          },
          activities: analyticsData.recentActivity || dashData.recentActivity || [],
          analytics: {
            monthlyRevenue: analyticsData.revenue?.currentMonth || dashData.stats?.monthlyRevenue || 0,
            revenueChange: analyticsData.revenue?.changePercentage || dashData.stats?.revenueChange || 0,
            totalBookings: dashData.stats?.totalBookings || 0,
            bookingChange: dashData.stats?.bookingChange || 0,
            averageOccupancy: dashData.stats?.occupancyRate || 0,
            occupancyChange: dashData.stats?.occupancyChange || 0,
            totalProperties: dashData.stats?.activeListings || 0,
            topPerformingProperty: dashData.stats?.topPerformingProperty || "N/A",
            conversionRate: dashData.stats?.conversionRate || 0,
            conversionChange: dashData.stats?.conversionChange || 0
          },
          visitRequests: analyticsData.visitRequests || null,
          revenue: analyticsData.revenue || null,
          propertyPerformance: analyticsData.propertyPerformance || []
        });
      } else {
        // Fallback to basic dashboard data if analytics fails
        if (dashboardResponse.success) {
          const apiData = dashboardResponse.data;
          setDashboardData({
            stats: {
              activeListings: apiData.stats?.activeListings || 0,
              fullyBooked: apiData.stats?.fullyBooked || 0,
              monthlyRevenue: apiData.stats?.monthlyRevenue || 0,
              revenueChange: apiData.stats?.revenueChange || 0,
              pendingVisits: apiData.stats?.pendingVisits || 0,
              totalMessages: apiData.stats?.totalMessages || 0,
              unreadMessages: apiData.stats?.unreadMessages || 0,
              totalBookings: apiData.stats?.totalBookings || 0,
              occupancyRate: apiData.stats?.occupancyRate || 0,
              pendingBookings: apiData.stats?.pendingBookings || 0
            },
            activities: apiData.recentActivity || [],
            analytics: {}
          });
        } else {
          throw new Error('Failed to load dashboard data');
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Show empty state on error
      setDashboardData({
        stats: {},
        activities: [],
        analytics: {},
        visitRequests: null,
        revenue: null,
        propertyPerformance: []
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      {/* Verification Widget - Only show if not verified */}
      {!isVerified && (
        <VerificationWidget userRole="owner" compact={false} />
      )}

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

          {/* Visit Requests */}
          <VisitRequestsWidget
            visitRequests={dashboardData.visitRequests}
            onRefresh={loadDashboardData}
          />
        </div>

        {/* Right Column - Quick Actions & Revenue */}
        <div className="space-y-6">
          <OwnerQuickActions stats={dashboardData.stats} />

          {/* Revenue & Payments */}
          <RevenueWidget revenue={dashboardData.revenue} />

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
