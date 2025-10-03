"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  MapPin,
  Video,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  RefreshCw
} from 'lucide-react';
import MeetingStatusCard from '@/components/meetings/MeetingStatusCard';
import apiClient from '@/lib/api';

function VisitingSchedulePage() {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock student ID - in production, get from auth context
  const studentId = 1;

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    filterMeetings();
  }, [meetings, searchTerm, statusFilter, typeFilter]);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (!token) {
        console.log('No authentication token found');
        setMeetings([]);
        return;
      }

      const response = await apiClient.getMeetings({ type: 'sent' });
      if (response.success) {
        setMeetings(response.data.meetings || []);
      } else {
        setMeetings([]);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const filterMeetings = () => {
    let filtered = meetings;

    // Filter by search term (property ID)
    if (searchTerm) {
      filtered = filtered.filter(meeting =>
        meeting.propertyId.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(meeting => meeting.status === statusFilter);
    }

    // Filter by meeting type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(meeting => meeting.meetingType === typeFilter);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredMeetings(filtered);
  };

  const handleAcceptTime = (meetingId, timeSlotId) => {
    // Update local state
    setMeetings(prev => prev.map(meeting =>
      meeting.id === meetingId
        ? { ...meeting, status: 'confirmed' }
        : meeting
    ));
  };

  const handleModifyTime = (meeting) => {
    // Handle counter-modification request
    console.log('Request different times for meeting:', meeting.id);
    // This would open a modal similar to the owner's modify modal
  };

  const getStatusCounts = () => {
    return {
      total: meetings.length,
      pending: meetings.filter(m => m.status === 'pending').length,
      confirmed: meetings.filter(m => m.status === 'confirmed').length,
      modified: meetings.filter(m => m.status === 'modified').length,
      declined: meetings.filter(m => m.status === 'declined').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-gray-400">
              <RefreshCw size={24} className="animate-spin" />
              <span>Loading your visit requests...</span>
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
            <h1 className="text-3xl font-bold text-white mb-2">My Visits</h1>
            <p className="text-gray-400">Track your property visit requests and schedules</p>
          </div>
          <Button onClick={fetchMeetings} variant="outline" className="border-gray-600 text-gray-300">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
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

          <Card className="bg-emerald-900/20 border-emerald-800/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{statusCounts.confirmed}</div>
              <div className="text-sm text-emerald-300">Confirmed</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-900/20 border-blue-800/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{statusCounts.modified}</div>
              <div className="text-sm text-blue-300">Modified</div>
            </CardContent>
          </Card>

          <Card className="bg-red-900/20 border-red-800/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{statusCounts.declined}</div>
              <div className="text-sm text-red-300">Declined</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by Property ID..."
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
                  <SelectItem value="confirmed" className="text-white">Confirmed</SelectItem>
                  <SelectItem value="modified" className="text-white">Modified</SelectItem>
                  <SelectItem value="declined" className="text-white">Declined</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-white">All Types</SelectItem>
                  <SelectItem value="online" className="text-white">Online</SelectItem>
                  <SelectItem value="offline" className="text-white">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Meetings List */}
        <div className="space-y-4">
          {filteredMeetings.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {meetings.length === 0 ? 'No Visit Requests Yet' : 'No Matching Requests'}
                </h3>
                <p className="text-gray-400">
                  {meetings.length === 0
                    ? 'Start browsing properties and schedule your first visit!'
                    : 'Try adjusting your filters to see more results.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMeetings.map((meeting) => (
              <MeetingStatusCard
                key={meeting.id}
                meeting={meeting}
                onAcceptTime={handleAcceptTime}
                onModifyTime={handleModifyTime}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default VisitingSchedulePage;
