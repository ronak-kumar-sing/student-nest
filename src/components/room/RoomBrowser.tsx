"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Heart, MapPin, Star, Users, Eye } from 'lucide-react';
import apiClient from '@/lib/api';
import Link from 'next/link';

interface Room {
  id: string;
  title: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
  };
  images?: string[];
  rating?: number;
  totalReviews?: number;
  amenities?: string[];
  roomType?: string;
  availability?: {
    isAvailable: boolean;
  };
  owner?: {
    verified?: boolean;
  };
  verified?: boolean;
}

function RoomBrowser() {
  const [displayedRooms, setDisplayedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Load rooms from API
  const loadRooms = async () => {
    try {
      setLoading(true);
      console.log('📡 Loading rooms from API...');

      const response = await apiClient.getRooms();
      console.log('📊 API Response:', response);

      if (response.success) {
        const rooms = response.data.rooms || [];
        console.log(`✅ Loaded ${rooms.length} rooms`);
        setDisplayedRooms(rooms);
      } else {
        console.error('Failed to load rooms:', response.error);
        setDisplayedRooms([]);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
      setDisplayedRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Load rooms on component mount
  useEffect(() => {
    loadRooms();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Find Your Perfect Accommodation
          </CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            Discover comfortable and affordable student housing near top universities
          </p>
        </CardHeader>
      </Card>

      {/* Main Content Area */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Available Rooms</h2>
            <p className="text-muted-foreground">
              {displayedRooms.length} room{displayedRooms.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-muted-foreground">Loading available rooms...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Rooms Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedRooms.map(room => (
                <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/dashboard/rooms/${room.id}`}>
                    <div className="relative">
                      <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900" />
                      {(room.verified || room.owner?.verified) && (
                        <Badge className="absolute top-2 left-2 bg-green-500">
                          Verified
                        </Badge>
                      )}
                      {room.availability?.isAvailable && (
                        <Badge className="absolute top-2 right-2 bg-blue-500">
                          Available
                        </Badge>
                      )}
                    </div>
                  </Link>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <Link href={`/dashboard/rooms/${room.id}`}>
                          <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">
                            {room.title}
                          </h3>
                        </Link>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {room.location?.address ||
                            (room.location?.city && room.location?.state ?
                              `${room.location.city}, ${room.location.state}` :
                              'Location not specified')}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-green-600">
                          ₹{room.price?.toLocaleString()}/month
                        </div>
                        {room.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{room.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({room.totalReviews || 0})
                            </span>
                          </div>
                        )}
                      </div>

                      {room.roomType && (
                        <Badge variant="outline" className="text-xs">
                          {room.roomType}
                        </Badge>
                      )}

                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.slice(0, 3).map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {room.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{room.amenities.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`/dashboard/rooms/${room.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* No Results State */}
            {displayedRooms.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-muted-foreground text-lg mb-4">
                    No rooms available at the moment
                  </div>
                  <Button onClick={loadRooms}>
                    Refresh
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default RoomBrowser;
