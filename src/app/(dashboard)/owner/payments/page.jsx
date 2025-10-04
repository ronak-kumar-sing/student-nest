"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Download,
  Search,
  Filter,
  Calendar,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Eye,
  ExternalLink
} from "lucide-react";

import apiClient from '@/lib/api';

export default function OwnerPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getOwnerRevenue();
      if (response.success) {
        const revenueData = response.data.revenue;
        setPaymentData({
          overview: {
            totalRevenue: revenueData?.allTime || 0,
            pendingPayments: revenueData?.pendingPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0,
            thisMonth: revenueData?.currentMonth || 0,
            lastMonthComparison: revenueData?.changePercentage || 0,
            averagePaymentTime: "2.5 days"
          },
          recentPayments: [
            ...(revenueData?.activeBookings?.map(booking => ({
              id: booking.id,
              tenant: booking.studentName,
              property: booking.propertyTitle,
              amount: booking.monthlyRent,
              date: booking.startDate,
              status: "completed",
              method: "Online",
              transactionId: `TXN${booking.id}`
            })) || []),
            ...(revenueData?.pendingPayments?.map(payment => ({
              id: payment.id,
              tenant: payment.studentName,
              property: payment.propertyTitle,
              amount: payment.amount,
              date: payment.dueDate,
              status: payment.overdue ? "overdue" : "pending",
              method: "Pending",
              transactionId: null
            })) || [])
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setPaymentData({
        overview: {
          totalRevenue: 0,
          pendingPayments: 0,
          thisMonth: 0,
          lastMonthComparison: 0,
          averagePaymentTime: "N/A"
        },
        recentPayments: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Use paymentData from state, fallback to empty structure
  const displayPaymentData = paymentData || {
    overview: {
      totalRevenue: 0,
      pendingPayments: 0,
      thisMonth: 0,
      lastMonthComparison: 0,
      averagePaymentTime: "N/A"
    },
    recentPayments: []
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'due':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'overdue':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'failed':
      case 'overdue':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const filteredPayments = (displayPaymentData.recentPayments || []).filter(payment => {
    const matchesSearch = payment.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Payments & Revenue
          </h1>
          <p className="text-muted-foreground mt-2">
            Track payments, manage payouts, and monitor revenue
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
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
              ₹{displayPaymentData.overview.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">
                +{displayPaymentData.overview.lastMonthComparison}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ₹{displayPaymentData.overview.thisMonth.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              January 2024
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ₹{displayPaymentData.overview.pendingPayments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting collection
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Payment Time
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {displayPaymentData.overview.averagePaymentTime}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average collection time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Management Tabs */}
      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent Payments</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Payments</TabsTrigger>
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-6">
          {/* Search and Filter */}
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by tenant or property name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payments List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPayments.map((payment) => {
                  const StatusIcon = getStatusIcon(payment.status);

                  return (
                    <div key={payment.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getStatusColor(payment.status)}`}>
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{payment.tenant}</h3>
                          <p className="text-sm text-muted-foreground">{payment.property}</p>
                          <p className="text-xs text-muted-foreground">
                            {payment.date} • {payment.method}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">
                          ₹{payment.amount.toLocaleString()}
                        </div>
                        <Badge variant="outline" className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>

                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Upcoming Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(displayPaymentData.upcomingPayments || []).map((payment) => {
                  const StatusIcon = getStatusIcon(payment.status);

                  return (
                    <div key={payment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getStatusColor(payment.status)}`}>
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{payment.tenant}</h3>
                          <p className="text-sm text-muted-foreground">{payment.property}</p>
                          <p className="text-xs text-muted-foreground">
                            Due: {payment.dueDate}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">
                          ₹{payment.amount.toLocaleString()}
                        </div>
                        <Badge variant="outline" className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>

                      <Button variant="outline" size="sm">
                        Send Reminder
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Payout History</CardTitle>
              <Button>
                <ExternalLink className="h-4 w-4 mr-2" />
                Request Payout
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(displayPaymentData.payoutHistory || []).map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-green-500/10 text-green-500">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Payout to {payout.bankAccount}</h3>
                        <p className="text-sm text-muted-foreground">
                          {payout.date} • Processing fee: ₹{payout.fees}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">
                        ₹{payout.amount.toLocaleString()}
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Completed
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
