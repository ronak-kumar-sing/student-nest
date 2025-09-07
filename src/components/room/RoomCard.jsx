"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Star, Users, ArrowRight, Eye, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ShinyText from '../animations/ShinyText';
import MeetingScheduler from '../meetings/MeetingScheduler';
import { AMENITIES_LIST } from '../../utils/constants';

function RoomCard({
  room,
  onFavorite,
  onCardClick,
  showDistance = false,
  compact = false,
  className = ''
}) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavorite?.(room.id);
  };

  const handleCardClick = () => {
    onCardClick?.(room.id);
  };

  const handleChatClick = (e) => {
    e.stopPropagation();
    // Handle chat functionality
    console.log('Opening chat for room:', room.id);
  };

  // Get the first amenity icons to display with enhanced styling
  const getAmenityIcons = () => {
    // Color themes for different amenity types
    const colorThemes = [
      { color: 'text-blue-300', bg: 'bg-blue-900/30' },
      { color: 'text-green-300', bg: 'bg-green-900/30' },
      { color: 'text-red-300', bg: 'bg-red-900/30' },
      { color: 'text-orange-300', bg: 'bg-orange-900/30' },
      { color: 'text-purple-300', bg: 'bg-purple-900/30' },
      { color: 'text-yellow-300', bg: 'bg-yellow-900/30' },
    ];

    return room.amenities?.slice(0, 4).map((amenityId, index) => {
      const amenity = AMENITIES_LIST[amenityId];
      const theme = colorThemes[index % colorThemes.length];

      if (!amenity) {
        return (
          <div
            key={amenityId}
            className="p-2 rounded-lg bg-gray-800/50 text-gray-300"
            title={amenityId}
          >
            •
          </div>
        );
      }

      const IconComponent = amenity.icon;

      return (
        <div
          key={amenityId}
          className={`p-2 rounded-lg ${theme.bg} ${theme.color} transition-all duration-200 hover:scale-110`}
          title={amenity.name}
        >
          <IconComponent size={16} />
        </div>
      );
    });
  };

  if (compact) {
    // Modern Compact Card Design
    return (
      <Card className="group cursor-pointer hover:shadow-xl hover:shadow-blue-500/20 border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:-translate-y-1 bg-gray-800/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <Link href={`/dashboard/rooms/${room.id}`} className="block">
            <div className="flex gap-4">
              {/* Image Section */}
              <div className="relative w-24 h-20 flex-shrink-0">
                <img
                  src={room.images?.[0] || '/api/placeholder/96/80'}
                  alt={room.title}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl"></div>
              </div>

              {/* Content Section */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate text-white group-hover:text-blue-400 transition-colors">
                      {room.title}
                    </h3>
                    {room.accommodationType && (
                      <Badge variant={room.accommodationType === 'pg' ? 'secondary' : 'outline'} className="mt-1">
                        {room.accommodationType === 'pg' ? 'PG' : 'Room'} • {room.roomType}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right ml-2">
                    <span className="text-lg font-bold">
                      <ShinyText
                        text={`₹${room.price.toLocaleString()}`}
                        className="text-white"
                      />
                    </span>
                    <span className="text-xs text-gray-400 block">/month</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-300 text-sm mb-2">
                  <MapPin size={14} className="mr-1 text-gray-400" />
                  <span className="truncate">{room.location.address}</span>
                </div>

                <div className="flex items-center justify-between">
                  {room.rating && (
                    <div className="flex items-center">
                      <Badge variant="secondary" className="bg-amber-900/30 text-amber-300">
                        <Star size={12} className="text-amber-400 fill-current mr-1" />
                        {room.rating}
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    {getAmenityIcons().slice(0, 3)}
                    {room.amenities?.length > 3 && (
                      <span className="text-xs text-gray-400 ml-1">+{room.amenities.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-gray-800/90 hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 z-10"
          >
            <Heart
              size={14}
              className={`${isFavorited ? 'fill-red-400 text-red-400' : 'text-gray-400 hover:text-red-400'} transition-colors duration-200`}
            />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Modern Full Card Design
  return (
    <Card className={`group cursor-pointer hover:shadow-2xl hover:shadow-blue-500/20 border-gray-700 hover:border-gray-600 transition-all duration-500 transform hover:-translate-y-2 bg-gray-800/50 backdrop-blur-sm ${className}`}>
      <div className="relative overflow-hidden rounded-t-lg">
        {/* Image Section with Overlay */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={room.images?.[0] || '/api/placeholder/400/256'}
            alt={room.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 p-3 rounded-full bg-gray-800/90 hover:bg-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 z-20 transform hover:scale-110"
          >
            <Heart
              size={18}
              className={`${isFavorited ? 'fill-red-400 text-red-400' : 'text-gray-300 hover:text-red-400'} transition-colors duration-200`}
            />
          </Button>

          {/* Price Badge */}
          <div className="absolute top-4 left-4 bg-gray-800/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-xl border border-gray-700">
            <div className="text-xl font-bold">
              <ShinyText
                text={`₹${room.price.toLocaleString()}`}
                className="text-white"
              />
            </div>
            <div className="text-sm text-gray-300 -mt-1">per month</div>
          </div>

          {/* View Details Floating Button */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <Link href={`/dashboard/rooms/${room.id}`}>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white shadow-xl hover:shadow-2xl">
                <Eye size={16} className="mr-2" />
                Quick View
              </Button>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-6">
          <Link href={`/dashboard/rooms/${room.id}`} className="block">
            {/* Title and Location */}
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2 line-clamp-2 text-white group-hover:text-blue-400 transition-colors">
                {room.title}
              </h3>
              <div className="flex items-center text-gray-300">
                <MapPin size={16} className="mr-2 text-gray-400" />
                <span className="text-sm">{room.location.address}</span>
              </div>
            </div>

            {/* Rating and Room Type */}
            <div className="flex items-center justify-between mb-4">
              {room.rating && (
                <Badge variant="secondary" className="bg-amber-900/30 text-amber-300">
                  <Star size={16} className="text-amber-400 fill-current mr-2" />
                  <span className="font-semibold mr-1">{room.rating}</span>
                  <span className="text-amber-400 text-sm">({room.totalReviews} reviews)</span>
                </Badge>
              )}
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-gray-700/50 text-gray-200">
                  <Users size={16} className="text-gray-400 mr-2" />
                  <span className="capitalize">{room.roomType}</span>
                </Badge>
                {room.accommodationType && (
                  <Badge variant={room.accommodationType === 'pg' ? 'secondary' : 'outline'}>
                    {room.accommodationType === 'pg' ? 'PG' : 'Room'}
                  </Badge>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                {getAmenityIcons()}
                {room.amenities?.length > 4 && (
                  <Badge variant="outline" className="bg-gray-700/50 text-gray-200">
                    +{room.amenities.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link href={`/dashboard/rooms/${room.id}`} className="flex-1">
              <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30">
                <span>View Details</span>
                <ArrowRight size={18} className="ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>

            <MeetingScheduler
              propertyId={room.id}
              ownerId={room.ownerId || 1} // Default owner ID, should come from room data
              onScheduleSuccess={() => {
                // Handle success, maybe show a toast or redirect
                console.log('Meeting scheduled successfully');
              }}
              trigger={
                <Button className="bg-green-600 hover:bg-green-500 text-white font-semibold px-3">
                  <Calendar size={18} />
                </Button>
              }
            />

            <Button
              variant="outline"
              size="lg"
              onClick={handleChatClick}
              className="flex-shrink-0 border-gray-600 hover:border-gray-500 hover:bg-gray-700"
            >
              <MessageCircle size={18} />
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default RoomCard;
