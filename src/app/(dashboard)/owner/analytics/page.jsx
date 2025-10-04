"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Home,
  Calendar,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Eye,
  Loader2
} from "lucide-react";

import apiClient from '@/lib/api';

export default function OwnerAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getOwnerAnalytics('all');
      if (response.success) {
        // Transform API data to match component expectations
        const transformedData = {
          overview: {
            totalRevenue: response.data.revenue?.allTime || 0,
            revenueChange: response.data.revenue?.changePercentage || 0,
            totalBookings: response.data.propertyPerformance?.reduce((sum, prop) => sum + prop.totalBookings, 0) || 0,
            bookingsChange: 8.5, // Calculate this from historical data
            averageOccupancy: 75, // Calculate from property data
            occupancyChange: -2.1,
            conversionRate: 68,
            conversionChange: 12.3
          },
          propertyPerformance: response.data.propertyPerformance?.map(prop => ({
            name: prop.title,
            revenue: prop.totalBookings * 15000, // Estimated revenue
            occupancy: Math.floor(Math.random() * 40 + 60), // Mock occupancy
            bookings: prop.totalBookings,
            rating: prop.averageRating
          })) || [],
          recentActivity: response.data.recentActivity || [],
          visitRequests: response.data.visitRequests || null,
          revenue: response.data.revenue || null,
          monthlyTrends: [
            { month: "Jan", revenue: 38000, bookings: 15, occupancy: 78 },
            { month: "Feb", revenue: 42000, bookings: 18, occupancy: 82 },
            { month: "Mar", revenue: 45000, bookings: 20, occupancy: 85 },
            { month: "Apr", revenue: 41000, bookings: 17, occupancy: 80 },
            { month: "May", revenue: 47000, bookings: 22, occupancy: 88 },
            { month: "Jun", revenue: 52000, bookings: 24, occupancy: 92 }
          ]
        };
        setAnalyticsData(transformedData);
      } else {
        // Set default data if API fails
        setAnalyticsData({
          overview: {
            totalRevenue: 0,
            revenueChange: 0,
            totalBookings: 0,
            bookingsChange: 0,
            averageOccupancy: 0,
            occupancyChange: 0,
            conversionRate: 0,
            conversionChange: 0
          },
          propertyPerformance: [],
          recentActivity: [],
          visitRequests: { total: 0, pending: 0, confirmed: 0, completed: 0 },
          revenue: { allTime: 0, changePercentage: 0, activeBookings: [] },
          monthlyTrends: []
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Set default empty data
      setAnalyticsData({
        overview: {
          totalRevenue: 0,
          revenueChange: 0,
          totalBookings: 0,
          bookingsChange: 0,
          averageOccupancy: 0,
          occupancyChange: 0,
          conversionRate: 0,
          conversionChange: 0
        },
        propertyPerformance: [],
        recentActivity: [],
        visitRequests: { total: 0, pending: 0, confirmed: 0, completed: 0 },
        revenue: { allTime: 0, changePercentage: 0, activeBookings: [] },
        monthlyTrends: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock monthly trends data (you can extend API to provide this)
  const mockMonthlyTrends = {
    overview: {
      totalRevenue: 135000,
      revenueChange: 15.2,
      totalBookings: 67,
      bookingsChange: 8.5,
      averageOccupancy: 87,
      occupancyChange: -2.1,
      conversionRate: 68,
      conversionChange: 12.3
    },
    propertyPerformance: [
      { name: "Green Valley PG", revenue: 54000, occupancy: 95, bookings: 18, rating: 4.8 },
      { name: "Sunshine PG", revenue: 42000, occupancy: 88, bookings: 14, rating: 4.6 },
      { name: "City Center PG", revenue: 39000, occupancy: 82, bookings: 12, rating: 4.4 },
      { name: "Metro View PG", revenue: 28000, occupancy: 75, bookings: 10, rating: 4.2 },
      { name: "Student Hub", revenue: 22000, occupancy: 68, bookings: 8, rating: 4.0 }
    ],
    monthlyTrends: [
      { month: "Jan", revenue: 38000, bookings: 15, occupancy: 78 },
      { month: "Feb", revenue: 42000, bookings: 18, occupancy: 82 },
      { month: "Mar", revenue: 45000, bookings: 20, occupancy: 85 },
      { month: "Apr", revenue: 41000, bookings: 17, occupancy: 80 },
      { month: "May", revenue: 47000, bookings: 22, occupancy: 88 },
      { month: "Jun", revenue: 52000, bookings: 24, occupancy: 92 }
    ]
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const getChangeColor = (change) => {
    if (change > 0) return "text-green-500";
    if (change < 0) return "text-red-500";
    return "text-muted-foreground";
  };

  const getChangeIcon = (change) => {
    if (change > 0) return ArrowUpRight;
    if (change < 0) return ArrowDownRight;
    return null;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Don't render if data is not loaded yet
  if (!analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Analytics & Insights
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your property performance and business metrics
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
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

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
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Revenue",
            value: `₹${(analyticsData?.revenue?.allTime || 0).toLocaleString()}`,
            change: analyticsData?.revenue?.changePercentage || 0,
            icon: DollarSign,
            color: "green"
          },
          {
            title: "Total Bookings",
            value: analyticsData?.revenue?.activeBookings?.length || 0,
            change: 0,
            icon: Calendar,
            color: "blue"
          },
          {
            title: "Visit Requests",
            value: analyticsData?.visitRequests?.total || 0,
            change: analyticsData.visitRequests?.pending || 0,
            icon: Users,
            color: "purple"
          },
          {
            title: "Properties",
            value: analyticsData.propertyPerformance?.length || 0,
            change: 0,
            icon: Target,
            color: "orange"
          }
        ].map((metric, index) => {
          const Icon = metric.icon;
          const ChangeIcon = getChangeIcon(metric.change);

          return (
            <Card key={index} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-2">
                  {metric.value}
                </div>
                <div className="flex items-center gap-1">
                  {ChangeIcon && (
                    <ChangeIcon className={`h-3 w-3 ${getChangeColor(metric.change)}`} />
                  )}
                  <span className={`text-xs ${getChangeColor(metric.change)}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}% from last period
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="performance">Property Performance</TabsTrigger>
          <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
          <TabsTrigger value="insights">Business Insights</TabsTrigger>
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
                {(analyticsData.monthlyTrends || []).map((month, index) => (
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
                        style={{ width: `${(month.revenue / 60000) * 100}%` }}
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
                    Green Valley PG has 95% occupancy. Consider increasing rent by 10-15%.
                  </p>
                </div>
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <h4 className="font-medium text-yellow-500 mb-1">Marketing Focus</h4>
                  <p className="text-sm text-muted-foreground">
                    Student Hub needs more visibility. Invest in digital marketing.
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
