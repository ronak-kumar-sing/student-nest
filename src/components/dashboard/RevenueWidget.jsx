"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  User,
  Home,
  Clock,
  AlertTriangle,
  Eye,
  Download
} from 'lucide-react';

export default function RevenueWidget({ revenue }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, active, pending

  if (!revenue) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue & Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No revenue data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTrendIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getTrendColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue & Payments
          </CardTitle>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'active' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('active')}
          >
            Active ({revenue.activeBookings?.length || 0})
          </Button>
          <Button
            variant={activeTab === 'pending' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('pending')}
          >
            Pending ({revenue.pendingPayments?.length || 0})
            {revenue.pendingPayments?.some(p => p.overdue) && (
              <AlertTriangle className="h-3 w-3 ml-1 text-orange-500" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Revenue Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(revenue.currentMonth)}
                </div>
                <div className="text-sm text-muted-foreground">This Month</div>
                {revenue.changePercentage !== 0 && (
                  <div className={`flex items-center justify-center gap-1 text-sm ${getTrendColor(revenue.changePercentage)}`}>
                    {getTrendIcon(revenue.changePercentage)}
                    <span>{Math.abs(revenue.changePercentage)}%</span>
                  </div>
                )}
              </div>

              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold">
                  {formatCurrency(revenue.lastMonth)}
                </div>
                <div className="text-sm text-muted-foreground">Last Month</div>
              </div>

              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold">
                  {formatCurrency(revenue.allTime)}
                </div>
                <div className="text-sm text-muted-foreground">All Time</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <span>{revenue.activeBookings?.length || 0} active bookings</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{revenue.pendingPayments?.length || 0} pending payments</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'active' && (
          <div className="space-y-4">
            {!revenue.activeBookings || revenue.activeBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active bookings</p>
              </div>
            ) : (
              revenue.activeBookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{booking.studentName}</span>
                        <Badge variant="success" className="bg-green-500">Active</Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Home className="h-4 w-4" />
                        <span>{booking.propertyTitle}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold text-primary">
                        {formatCurrency(booking.monthlyRent)}
                      </div>
                      <div className="text-sm text-muted-foreground">per month</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-4">
            {!revenue.pendingPayments || revenue.pendingPayments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending payments</p>
              </div>
            ) : (
              revenue.pendingPayments.map((payment) => (
                <div key={payment.id} className={`border rounded-lg p-4 ${payment.overdue ? 'border-red-200 bg-red-50' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{payment.studentName}</span>
                        <Badge variant={payment.overdue ? 'destructive' : 'secondary'}>
                          {payment.overdue ? 'Overdue' : 'Pending'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Home className="h-4 w-4" />
                        <span>{payment.propertyTitle}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-lg font-semibold ${payment.overdue ? 'text-red-600' : 'text-primary'}`}>
                        {formatCurrency(payment.amount)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Due: {formatDate(payment.dueDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {payment.overdue && (
                      <div className="flex items-center gap-1 text-sm text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Payment overdue</span>
                      </div>
                    )}
                    <div className="ml-auto">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}