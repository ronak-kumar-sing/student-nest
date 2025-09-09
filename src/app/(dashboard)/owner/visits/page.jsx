"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar,
  Clock,
  Search,
  Bell,
  CheckCircle,
  XCircle,
  Edit,
  RefreshCw,
  Users,
  TrendingUp
} from 'lucide-react';
import MeetingRequestCard from '@/components/meetings/MeetingRequestCard';
import { getOwnerMeetings } from '@/lib/api';

function OwnerVisitsPage() {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');

  // Mock owner ID - in production, get from auth context
  const ownerId = 2;

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    filterMeetings();
  }, [meetings, searchTerm, statusFilter, propertyFilter]);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const response = await getOwnerMeetings(ownerId);
      if (response.success) {
        setMeetings(response.data);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMeetings = () => {
    let filtered = meetings;

    // Filter by search term (student ID)
    if (searchTerm) {
      filtered = filtered.filter(meeting =>
        meeting.studentId.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(meeting => meeting.status === statusFilter);
    }

    // Filter by property
    if (propertyFilter !== 'all') {
      filtered = filtered.filter(meeting =>
        meeting.propertyId.toString() === propertyFilter
      );
    }

    // Sort by creation date (newest first), but prioritize pending requests
    filtered.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (b.status === 'pending' && a.status !== 'pending') return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredMeetings(filtered);
  };

  const handleAccept = (meetingId) => {
    setMeetings(prev => prev.map(meeting =>
      meeting.id === meetingId
        ? { ...meeting, status: 'accepted', ownerResponse: 'Meeting accepted as requested' }
        : meeting
    ));
  };

  const handleDecline = (meetingId) => {
    setMeetings(prev => prev.map(meeting =>
      meeting.id === meetingId
        ? { ...meeting, status: 'declined' }
        : meeting
    ));
  };

  const handleModify = (meetingId) => {
    setMeetings(prev => prev.map(meeting =>
      meeting.id === meetingId
        ? { ...meeting, status: 'modified' }
        : meeting
    ));
  };

  const getStatusCounts = () => {
    return {
      total: meetings.length,
      pending: meetings.filter(m => m.status === 'pending').length,
      accepted: meetings.filter(m => m.status === 'accepted').length,
      confirmed: meetings.filter(m => m.status === 'confirmed').length,
      declined: meetings.filter(m => m.status === 'declined').length,
    };
  };

  const getUniqueProperties = () => {
    const propertyIds = [...new Set(meetings.map(m => m.propertyId))];
    return propertyIds.map(id => ({ id, name: `Property #${id}` }));
  };

  const statusCounts = getStatusCounts();
  const uniqueProperties = getUniqueProperties();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-gray-400">
              <RefreshCw size={24} className="animate-spin" />
              <span>Loading visit requests...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Visit Requests</h1>
            <p className="text-gray-400">Manage property visit requests from students</p>
          </div>
          <div className="flex gap-3">
            {statusCounts.pending > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-900/30 border border-yellow-600 rounded-lg">
                <Bell size={16} className="text-yellow-400" />
                <span className="text-yellow-300 text-sm">{statusCounts.pending} pending</span>
              </div>
            )}
            <Button onClick={fetchMeetings} variant="outline" className="border-gray-600 text-gray-300">
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{statusCounts.total}</div>
              <div className="text-sm text-gray-400">Total Requests</div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-900/20 border-yellow-800/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{statusCounts.pending}</div>
              <div className="text-sm text-yellow-300">Pending</div>
            </CardContent>
          </Card>

          <Card className="bg-green-900/20 border-green-800/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{statusCounts.accepted}</div>
              <div className="text-sm text-green-300">Accepted</div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-900/20 border-emerald-800/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{statusCounts.confirmed}</div>
              <div className="text-sm text-emerald-300">Confirmed</div>
            </CardContent>
          </Card>

          <Card className="bg-red-900/20 border-red-800/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{statusCounts.declined}</div>
              <div className="text-sm text-red-300">Declined</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions for Pending Requests */}
        {statusCounts.pending > 0 && (
          <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-800/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-yellow-400" />
                  <div>
                    <div className="text-white font-medium">Action Required</div>
                    <div className="text-yellow-300 text-sm">
                      You have {statusCounts.pending} pending visit request{statusCounts.pending > 1 ? 's' : ''} waiting for your response
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setStatusFilter('pending')}
                  className="bg-yellow-600 hover:bg-yellow-500 text-white"
                >
                  Review Requests
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by Student ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-white">All Status</SelectItem>
                  <SelectItem value="pending" className="text-white">Pending</SelectItem>
                  <SelectItem value="accepted" className="text-white">Accepted</SelectItem>
                  <SelectItem value="confirmed" className="text-white">Confirmed</SelectItem>
                  <SelectItem value="declined" className="text-white">Declined</SelectItem>
                </SelectContent>
              </Select>

              {uniqueProperties.length > 1 && (
                <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                  <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Property" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="all" className="text-white">All Properties</SelectItem>
                    {uniqueProperties.map((property) => (
                      <SelectItem key={property.id} value={property.id.toString()} className="text-white">
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Meetings List */}
        <div className="space-y-4">
          {filteredMeetings.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {meetings.length === 0 ? 'No Visit Requests Yet' : 'No Matching Requests'}
                </h3>
                <p className="text-gray-400">
                  {meetings.length === 0
                    ? 'When students request to visit your properties, they\'ll appear here.'
                    : 'Try adjusting your filters to see more results.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMeetings.map((meeting) => (
              <MeetingRequestCard
                key={meeting.id}
                request={meeting}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onModify={handleModify}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnerVisitsPage;
