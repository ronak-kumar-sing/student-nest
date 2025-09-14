"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SharingParticipantCard } from './SharingParticipantCard';
import { RoomShareAssessment } from './RoomShareAssessment';
import {
  MapPin,
  IndianRupee,
  Users,
  UserPlus,
  Filter,
  Search,
  Heart,
  Wifi,
  Car,
  Utensils,
  Shield,
  Loader2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

const amenityIcons = {
  'WiFi': Wifi,
  'AC': Car,
  'Kitchen': Utensils,
  'Security': Shield,
  'Laundry': Car,
  'Study Room': Users,
  'Gym': Users
};

export function SharingRoomList({ currentUser }) {
  const [sharingRooms, setSharingRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    roomType: 'all'
  });
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [assessmentLoading, setAssessmentLoading] = useState(false);

  useEffect(() => {
    fetchSharingRooms();
  }, [currentUser?.id]);

  const fetchSharingRooms = async () => {
    try {
      setLoading(true);

      // Filter out empty values and 'all' values
      const validFilters = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) =>
          value && value !== 'all'
        )
      );

      const queryParams = new URLSearchParams({
        studentId: currentUser?.id || '',
        ...validFilters
      });

      const response = await fetch(`/api/room-sharing/list?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setSharingRooms(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching sharing rooms:', error);
      toast.error('Failed to load room sharing data');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchSharingRooms();
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      roomType: 'all'
    });
    setTimeout(fetchSharingRooms, 100);
  };

  const handleJoinRoom = (room) => {
    if (!currentUser?.emailVerified || !currentUser?.phoneVerified ||
      !currentUser?.studentIdVerified || !currentUser?.collegeVerified) {
      toast.error('Please complete verification before joining room sharing');
      return;
    }

    if (!room.canJoin) {
      toast.error('Cannot join this room sharing');
      return;
    }

    setSelectedRoom(room);
    setAssessmentOpen(true);
  };

  const handleAssessmentSubmit = async (assessmentAnswers) => {
    try {
      setAssessmentLoading(true);

      const response = await fetch('/api/room-sharing/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomSharingId: selectedRoom.id,
          studentId: currentUser.id,
          assessmentAnswers
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Successfully joined room sharing!');
        setAssessmentOpen(false);
        setSelectedRoom(null);
        await fetchSharingRooms(); // Refresh data
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to join room sharing');
    } finally {
      setAssessmentLoading(false);
    }
  };

  const handleMessageUser = (userId) => {
    // In a real app, this would open the messaging interface
    toast.info(`Opening chat with user ${userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Rooms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location..."
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minPrice">Min Price</Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="Min price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPrice">Max Price</Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="Max price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomType">Room Type</Label>
              <Select value={filters.roomType} onValueChange={(value) => handleFilterChange('roomType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="shared">Shared</SelectItem>
                  <SelectItem value="single">Single</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={applyFilters}>
              <Search className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Available Room Shares ({sharingRooms.length})
          </h3>
        </div>

        {sharingRooms.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Room Shares Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or check back later for new room sharing posts.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sharingRooms.map((sharingRoom) => (
              <Card key={sharingRoom.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Link href={`/dashboard/rooms/${sharingRoom.room.id}`}>
                    <Image
                      src={sharingRoom.room.images[0]}
                      alt={sharingRoom.room.title}
                      width={300}
                      height={150}
                      className="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </Link>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-blue-600 text-white text-xs">
                      {sharingRoom.availableSlots} spots
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Link href={`/dashboard/rooms/${sharingRoom.room.id}`}>
                      <Button size="sm" variant="secondary" className="h-6 px-2 text-xs opacity-90 hover:opacity-100">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Room
                      </Button>
                    </Link>
                  </div>
                </div>

                <CardContent className="p-3 space-y-3">
                  {/* Room details */}
                  <div>
                    <Link href={`/dashboard/rooms/${sharingRoom.room.id}`}>
                      <h3 className="font-semibold text-base mb-1 line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer">
                        {sharingRoom.room.title}
                      </h3>
                    </Link>

                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="line-clamp-1">{sharingRoom.room.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-3 h-3" />
                          <span className="font-medium">₹{sharingRoom.room.price}/mo</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{sharingRoom.participants.length}/{sharingRoom.maxParticipants}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amenities - More compact */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sharingRoom.room.amenities.slice(0, 3).map((amenity, index) => {
                        const Icon = amenityIcons[amenity] || Heart;
                        return (
                          <Badge key={index} variant="secondary" className="text-xs py-0 px-1 h-5">
                            <Icon className="w-2.5 h-2.5 mr-0.5" />
                            {amenity}
                          </Badge>
                        );
                      })}
                      {sharingRoom.room.amenities.length > 3 && (
                        <Badge variant="secondary" className="text-xs py-0 px-1 h-5">
                          +{sharingRoom.room.amenities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Participants - More compact */}
                  <div>
                    <h4 className="font-medium text-xs mb-1 text-gray-700 dark:text-gray-300">Current Partners:</h4>
                    <div className="space-y-1">
                      {sharingRoom.participants.slice(0, 2).map((participant) => (
                        <div key={participant.studentId} className="text-xs">
                          <SharingParticipantCard
                            participant={participant}
                            isCurrentUser={participant.studentId === currentUser?.id}
                            onMessageClick={handleMessageUser}
                            showCompatibility={participant.studentId !== currentUser?.id}
                            compact={true}
                          />
                        </div>
                      ))}
                      {sharingRoom.participants.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{sharingRoom.participants.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 border-t space-y-2">
                    {/* View Details Button */}
                    <Link href={`/dashboard/rooms/${sharingRoom.room.id}`}>
                      <Button variant="outline" className="w-full h-8 text-xs">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Room Details
                      </Button>
                    </Link>

                    {/* Join/Joined Button */}
                    {sharingRoom.participants.some(p => p.studentId === currentUser?.id) ? (
                      <Button disabled className="w-full h-8 text-xs" variant="secondary">
                        ✓ Joined
                      </Button>
                    ) : (
                      <Button
                        className="w-full h-8 text-xs"
                        onClick={() => handleJoinRoom(sharingRoom)}
                        disabled={!sharingRoom.canJoin}
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        {sharingRoom.canJoin ? 'Join Room Sharing' : 'Room Full'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Assessment Modal */}
      <RoomShareAssessment
        isOpen={assessmentOpen}
        onClose={() => {
          setAssessmentOpen(false);
          setSelectedRoom(null);
        }}
        onSubmit={handleAssessmentSubmit}
        isLoading={assessmentLoading}
        title="Join Room Sharing"
        description="Complete this assessment to join the room sharing and find compatible roommates."
      />
    </div>
  );
}

export default SharingRoomList;