"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiClient from '@/lib/api';
import { toast } from 'sonner';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Home,
  Calendar,
  RefreshCw,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    revenueChange: number;
    totalBookings: number;
    bookingsChange: number;
    totalVisits: number;
    visitsChange: number;
    totalProperties: number;
  };
  propertyPerformance: Array<{
    name: string;
    revenue: number;
    occupancy: number;
    bookings: number;
    rating: number;
  }>;
  recentActivity: Array<{
    date: string;
    action: string;
    details: string;
  }>;
  visitRequests: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
  };
  revenue: {
    allTime: number;
    currentMonth: number;
    changePercentage: number;
  };
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    bookings: number;
    occupancy: number;
  }>;
}

export default function OwnerAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getOwnerAnalytics('all');

      if (response.success && response.data) {
        const data = response.data;

        // Transform the data with proper fallbacks matching actual API structure
        const transformedData: AnalyticsData = {
          overview: {
            totalRevenue: data.revenue?.allTime || 0,
            revenueChange: data.revenue?.changePercentage || 0,
            totalBookings: data.bookings?.total || 0,
            bookingsChange: data.bookings?.changePercentage || 0,
            totalVisits: data.visitRequests?.total || 0,
            visitsChange: 0, // Calculate from data if available
            totalProperties: data.properties?.total || 0
          },
          propertyPerformance: (data.propertyPerformance || []).map((prop: any) => ({
            name: prop.name,
            revenue: prop.revenue || 0,
            occupancy: prop.occupancy || 0,
            bookings: prop.bookings || 0,
            rating: prop.rating || 0
          })),
          recentActivity: (data.recentActivity || []).map((activity: any) => ({
            date: activity.time,
            action: activity.title,
            details: activity.description
          })),
          visitRequests: data.visitRequests || {
            total: 0,
            pending: 0,
            confirmed: 0,
            completed: 0
          },
          revenue: {
            allTime: data.revenue?.allTime || 0,
            currentMonth: data.revenue?.currentMonth || 0,
            changePercentage: data.revenue?.changePercentage || 0
          },
          monthlyTrends: data.monthlyTrends || []
        };

        setAnalyticsData(transformedData);
      } else {
        toast.error('Failed to load analytics');
        setAnalyticsData(getFallbackData());
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
      setAnalyticsData(getFallbackData());
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackData = (): AnalyticsData => ({
    overview: {
      totalRevenue: 0,
      revenueChange: 0,
      totalBookings: 0,
      bookingsChange: 0,
      totalVisits: 0,
      visitsChange: 0,
      totalProperties: 0
    },
    propertyPerformance: [],
    recentActivity: [],
    visitRequests: {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0
    },
    revenue: {
      allTime: 0,
      currentMonth: 0,
      changePercentage: 0
    },
    monthlyTrends: []
  }); if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-8 w-8" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your property performance and insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ₹{analyticsData.overview.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {analyticsData.overview.revenueChange >= 0 ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">
                    +{analyticsData.overview.revenueChange}%
                  </span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-500">
                    {analyticsData.overview.revenueChange}%
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analyticsData.overview.totalBookings}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {analyticsData.overview.bookingsChange >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">
                    +{analyticsData.overview.bookingsChange}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-500">
                    {analyticsData.overview.bookingsChange}%
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Visit Requests
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analyticsData.overview.totalVisits}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {analyticsData.overview.visitsChange >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">
                    +{analyticsData.overview.visitsChange}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-500">
                    {analyticsData.overview.visitsChange}%
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Properties
            </CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analyticsData.overview.totalProperties}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active listings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed analytics */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Property Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.propertyPerformance.map((property, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{property.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Revenue: ₹{property.revenue.toLocaleString()}</span>
                        <span>Occupancy: {property.occupancy}%</span>
                        <span>Bookings: {property.bookings}</span>
                        <span>Rating: {property.rating}/5</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={property.occupancy > 90 ? "default" : property.occupancy > 80 ? "secondary" : "outline"}>
                        {property.occupancy > 90 ? "Excellent" : property.occupancy > 80 ? "Good" : "Needs Attention"}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Monthly Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.monthlyTrends.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="font-medium text-foreground">{month.month}</div>
                    <div className="flex items-center gap-6 text-sm">
                      <span>₹{month.revenue.toLocaleString()}</span>
                      <span>{month.bookings} bookings</span>
                      <span>{month.occupancy}% occupancy</span>
                    </div>
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${Math.min((month.revenue / 60000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Business Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h4 className="font-medium text-green-500 mb-1">Increase Pricing</h4>
                  <p className="text-sm text-muted-foreground">
                    High occupancy properties can support 10-15% rent increase.
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h4 className="font-medium text-yellow-500 mb-1">Marketing Focus</h4>
                  <p className="text-sm text-muted-foreground">
                    Properties with lower occupancy need more visibility.
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="font-medium text-blue-500 mb-1">Peak Season</h4>
                  <p className="text-sm text-muted-foreground">
                    Academic year starting soon. Prepare for increased demand.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Performance Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Revenue Target</span>
                    <span>₹60,000</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground">75% achieved</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Occupancy Rate Target</span>
                    <span>90%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground">87% achieved</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Customer Satisfaction</span>
                    <span>4.5/5</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '90%' }} />
                  </div>
                  <p className="text-xs text-muted-foreground">4.5/5 average rating</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
