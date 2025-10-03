"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Search,
  Bell,
  CheckCircle,
  XCircle,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  User,
  Eye
} from 'lucide-react';
import apiClient from '@/lib/api';

export default function OwnerVisitsPageNew() {
  const [visitData, setVisitData] = useState(null);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchVisitData();
    fetchProperties();
  }, []);

  useEffect(() => {
    filterVisits();
  }, [visitData, searchTerm, statusFilter, propertyFilter]);

  const fetchVisitData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getOwnerVisitRequests();
      if (response.success) {
        setVisitData(response.data.visitRequests);
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await apiClient.getMyProperties();
      if (response.success) {
        setProperties(response.data.properties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const filterVisits = () => {
    if (!visitData || !visitData.visits) return;
    
    let filtered = visitData.visits;

    if (searchTerm) {
      filtered = filtered.filter(visit =>
        visit.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visit.propertyTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(visit => visit.status === statusFilter);
    }

    if (propertyFilter !== 'all') {
      filtered = filtered.filter(visit =>
        visit.propertyTitle === propertyFilter
      );
    }

    filtered.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (b.status === 'pending' && a.status !== 'pending') return 1;
      return new Date(b.requestDate) - new Date(a.requestDate);
    });

    setFilteredVisits(filtered);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', label: 'Pending' },
      confirmed: { color: 'text-blue-600 bg-blue-50 border-blue-200', label: 'Confirmed' },
      completed: { color: 'text-green-600 bg-green-50 border-green-200', label: 'Completed' },
      cancelled: { color: 'text-red-600 bg-red-50 border-red-200', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleVisitAction = async (visitId, action) => {
    try {
      const response = await fetch(`/api/meetings/${visitId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        fetchVisitData();
        alert(`Visit ${action}ed successfully`);
      }
    } catch (error) {
      console.error('Error handling visit action:', error);
      alert('Failed to process request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading visit requests...</p>
        </div>
      </div>
    );
  }

  const statusCounts = visitData ? {
    total: visitData.total || 0,
    pending: visitData.pending || 0,
    confirmed: visitData.confirmed || 0,
    completed: visitData.completed || 0
  } : { total: 0, pending: 0, confirmed: 0, completed: 0 };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Visit Requests</h1>
          <p className="text-muted-foreground">Manage property visit requests from students</p>
        </div>
        <div className="flex gap-3">
          {statusCounts.pending > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Bell size={16} className="text-yellow-600" />
              <span className="text-yellow-700 text-sm">{statusCounts.pending} pending</span>
            </div>
          )}
          <Button onClick={fetchVisitData} variant="outline">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{statusCounts.total}</div>
            <div className="text-sm text-muted-foreground">Total Requests</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{statusCounts.confirmed}</div>
            <div className="text-sm text-muted-foreground">Confirmed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search by student name or property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={propertyFilter} onValueChange={setPropertyFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property._id} value={property.title}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Visit Requests List */}
      <div className="space-y-4">
        {!filteredVisits || filteredVisits.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No visit requests found</h3>
              <p className="text-muted-foreground">
                {visitData?.total === 0 
                  ? "You haven't received any visit requests yet." 
                  : "No visits match your current filters."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredVisits.map((visit) => (
            <Card key={visit.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Student & Property Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">{visit.studentName}</h3>
                        <p className="text-sm text-muted-foreground">wants to visit</p>
                      </div>
                      {getStatusBadge(visit.status)}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{visit.propertyTitle}</span>
                      {visit.propertyLocation && (
                        <span className="text-sm text-muted-foreground">• {visit.propertyLocation}</span>
                      )}
                    </div>

                    {/* Contact Information */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                      {visit.studentPhone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{visit.studentPhone}</span>
                        </div>
                      )}
                      {visit.studentEmail && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{visit.studentEmail}</span>
                        </div>
                      )}
                    </div>

                    {/* Visit Details */}
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Requested on {formatDate(visit.requestDate)}
                      </span>
                    </div>

                    {/* Confirmed Visit Time */}
                    {visit.status === 'confirmed' && visit.confirmedDate && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">
                            Confirmed for {formatDate(visit.confirmedDate)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {visit.notes && (
                      <div className="text-sm text-muted-foreground italic pl-4 border-l-2 border-muted">
                        "{visit.notes}"
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {visit.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleVisitAction(visit.id, 'confirm')}
                          className="bg-green-600 hover:bg-green-500"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleVisitAction(visit.id, 'decline')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}