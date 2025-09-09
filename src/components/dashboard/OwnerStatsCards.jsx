"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  TrendingUp,
  Calendar,
  MessageSquare,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function OwnerStatsCards({ stats = {} }) {
  const {
    activeListings = 5,
    fullyBooked = 2,
    monthlyRevenue = 45000,
    revenueChange = 12,
    pendingVisits = 7,
    totalMessages = 12,
    unreadMessages = 5,
    totalBookings = 23,
    occupancyRate = 85
  } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Active Listings */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Active Listings</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{activeListings}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {fullyBooked} fully booked
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Revenue */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">₹{monthlyRevenue.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1">
            {revenueChange >= 0 ? (
              <ArrowUpRight className="h-3 w-3 text-green-500" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-500" />
            )}
            <p className={`text-xs ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(revenueChange)}% from last month
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pending Visits */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Pending Visits</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{pendingVisits}</div>
          <p className="text-xs text-muted-foreground mt-1">
            This week
          </p>
          {pendingVisits > 5 && (
            <Badge variant="destructive" className="text-xs mt-2">
              Needs attention
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalMessages}</div>
          <div className="flex items-center gap-2 mt-1">
            {unreadMessages > 0 && (
              <Badge variant="default" className="text-xs">
                {unreadMessages} unread
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total Bookings (Additional stat) */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Total Bookings</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalBookings}</div>
          <p className="text-xs text-muted-foreground mt-1">
            This month
          </p>
        </CardContent>
      </Card>

      {/* Occupancy Rate */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">Occupancy Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{occupancyRate}%</div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
