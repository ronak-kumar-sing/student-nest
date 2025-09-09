"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  DollarSign,
  Home,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function AnalyticsOverview({ analyticsData = {} }) {
  const {
    monthlyRevenue = 45000,
    revenueChange = 12,
    totalBookings = 23,
    bookingChange = 8,
    averageOccupancy = 85,
    occupancyChange = -3,
    totalProperties = 5,
    propertiesChange = 0,
    topPerformingProperty = "Green Valley PG",
    conversionRate = 68,
    conversionChange = 5
  } = analyticsData;

  const metrics = [
    {
      title: "Revenue Trend",
      value: `₹${monthlyRevenue.toLocaleString()}`,
      change: revenueChange,
      changeLabel: "vs last month",
      icon: DollarSign,
      color: "green"
    },
    {
      title: "Booking Rate",
      value: totalBookings,
      change: bookingChange,
      changeLabel: "vs last month",
      icon: Calendar,
      color: "blue"
    },
    {
      title: "Occupancy Rate",
      value: `${averageOccupancy}%`,
      change: occupancyChange,
      changeLabel: "vs last month",
      icon: Users,
      color: occupancyChange >= 0 ? "green" : "red"
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      change: conversionChange,
      changeLabel: "inquiries to bookings",
      icon: TrendingUp,
      color: "purple"
    }
  ];

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

  return (
    <div className="space-y-6">
      {/* Analytics Overview Header */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-foreground">Analytics Overview</CardTitle>
          </div>
          <Button variant="outline" size="sm">
            View Full Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const ChangeIcon = getChangeIcon(metric.change);

              return (
                <div key={index} className="p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {ChangeIcon && (
                      <ChangeIcon className={`h-3 w-3 ${getChangeColor(metric.change)}`} />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.title}
                  </div>
                  {metric.change !== 0 && (
                    <div className={`text-xs mt-1 ${getChangeColor(metric.change)}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}% {metric.changeLabel}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Top Performing Property</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
              <div>
                <h3 className="font-semibold text-foreground">{topPerformingProperty}</h3>
                <p className="text-sm text-muted-foreground">95% occupancy rate</p>
                <p className="text-sm text-green-500">₹18,000/month avg</p>
              </div>
              <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
                Top Performer
              </Badge>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Revenue</span>
                <span className="font-medium text-foreground">₹54,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Bookings</span>
                <span className="font-medium text-foreground">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Average Rating</span>
                <span className="font-medium text-foreground">4.8/5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-foreground">Peak Season Ahead</p>
                <p className="text-xs text-muted-foreground">Consider increasing prices by 10-15%</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <Home className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-foreground">Property Maintenance</p>
                <p className="text-xs text-muted-foreground">2 properties due for inspection</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-foreground">High Demand Area</p>
                <p className="text-xs text-muted-foreground">Consider expanding in Koramangala</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
