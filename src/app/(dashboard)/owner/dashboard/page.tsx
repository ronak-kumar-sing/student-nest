"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Crown,
  RefreshCw,
  Settings,
  Download,
  ExternalLink,
  Home,
  DollarSign,
  Calendar,
  MessageSquare,
  TrendingUp,
  Bell
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface DashboardStats {
  activeListings: number;
  fullyBooked: number;
  monthlyRevenue: number;
  revenueChange: number;
  pendingVisits: number;
  totalMessages: number;
  unreadMessages: number;
  totalBookings: number;
  occupancyRate: number;
  averageRating: number;
  totalReviews: number;
  responseTime: string;
  responseRate: number;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    time: string;
    icon: string;
    color: string;
  }>;
  analytics: {
    totalBookings: number;
    bookingsChange: number;
    occupancyRate: number;
    occupancyChange: number;
    avgResponseTime: string;
    responseTimeChange: number;
    overallRating: number;
    ratingChange: number;
  };
}

export default function OwnerDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true)
        const response = await fetch('/api/dashboard/owner/stats')
        const data = await response.json()

        if (data.success) {
          setStats(data.data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setStatsLoading(false)
      }
    }

    if (user && isAuthenticated) {
      fetchStats()
    }
  }, [user, isAuthenticated])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/owner/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    // Redirect students to their dashboard
    if (user && (user.role === 'student' || user.role === 'Student')) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch('/api/dashboard/owner/stats')
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error refreshing stats:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const isOwner = user.role === 'owner' || user.role === 'Owner'

  // Redirect students
  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirecting to Student Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <h1 className="text-3xl font-bold">
                Welcome back, {user.fullName || user.email}!
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
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Owner Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.activeListings || 0}</div>
              <p className="text-xs text-muted-foreground">
                {statsLoading ? '...' : `${stats?.fullyBooked || 0} fully booked`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? '...' : `₹${stats?.monthlyRevenue?.toLocaleString() || 0}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {statsLoading ? '...' : `+${stats?.revenueChange || 0}% from last month`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Visits</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.pendingVisits || 0}</div>
              <p className="text-xs text-muted-foreground">
                This week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsLoading ? '...' : stats?.totalMessages || 0}</div>
              <p className="text-xs text-muted-foreground">
                {statsLoading ? '...' : `${stats?.unreadMessages || 0} unread`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Activity Feed */}
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {statsLoading ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Loading activity...</p>
                ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity) => {
                    const getColorClass = (color: string) => {
                      const colors: Record<string, string> = {
                        blue: 'bg-blue-500',
                        green: 'bg-green-500',
                        yellow: 'bg-yellow-500',
                        orange: 'bg-orange-500',
                        red: 'bg-red-500',
                        purple: 'bg-purple-500'
                      };
                      return colors[color] || 'bg-gray-500';
                    };

                    const getTimeAgo = (time: string) => {
                      const diff = Date.now() - new Date(time).getTime();
                      const hours = Math.floor(diff / 3600000);
                      const days = Math.floor(hours / 24);

                      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
                      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
                      return 'Just now';
                    };

                    return (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`w-2 h-2 ${getColorClass(activity.color)} rounded-full mt-2`}></div>
                        <div>
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{getTimeAgo(activity.time)}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                )}
              </CardContent>
            </Card>

            {/* Analytics Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">
                      {statsLoading ? '...' : stats?.analytics?.totalBookings || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                    <p className="text-2xl font-bold">
                      {statsLoading ? '...' : `${stats?.analytics?.occupancyRate || 0}%`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                    <p className="text-2xl font-bold">
                      {statsLoading ? '...' : stats?.analytics?.avgResponseTime || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="text-2xl font-bold">
                      {statsLoading ? '...' : `${stats?.analytics?.overallRating || 0}★`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Resources */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Add New Property
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Bookings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </Button>
              </CardContent>
            </Card>

            {/* Owner Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Owner Resources</CardTitle>
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
        <Card className="bg-muted/30">
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
    </div>
  )
}
