"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RoomCard from '../room/RoomCard';
import FilterComponent from '../filters/FilterComponent';
import SplitText from '../animations/SplitText';
import apiClient from '@/lib/api';
import { Loader2 } from 'lucide-react';

function RoomBrowser() {
  const [displayedRooms, setDisplayedRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([2000, 25000]);
  const [availabilityFilter, setAvailabilityFilter] = useState({
    availableNow: true,
    availableNextMonth: false
  });
  const [roomTypeFilter, setRoomTypeFilter] = useState({
    single: false,
    shared: false,
    pg: false,
    hostel: false,
    apartment: false,
    studio: false
  });
  const [amenityFilter, setAmenityFilter] = useState({
    wifi: false,
    parking: false,
    security: false,
    kitchen: false,
    laundry: false,
    gym: false,
    ac: false,
    heating: false
  });
  const [locationFilter, setLocationFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [areaRange, setAreaRange] = useState([50, 500]);

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
        setAllRooms(rooms);
        setDisplayedRooms(rooms.slice(0, 6));
      } else {
        console.error('Failed to load rooms:', response.error);
        setAllRooms([]);
        setDisplayedRooms([]);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
      // Set empty arrays as fallback
      setAllRooms([]);
      setDisplayedRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Load rooms on component mount
  useEffect(() => {
    loadRooms();
  }, []);

  const handleCardClick = (roomId) => {
    console.log('Navigating to room:', roomId);
    // Navigate to room details page
    window.location.href = `/dashboard/rooms/${roomId}`;
  };

  const handleFavorite = (roomId) => {
    console.log('Toggled favorite for room:', roomId);
    // Update favorite status in state/database
  };

  // Comprehensive filter function
  const applyFilters = () => {
    let filtered = [...allRooms];

    // Price filter
    filtered = filtered.filter(room =>
      room.price >= priceRange[0] && room.price <= priceRange[1]
    );

    // Availability filter
    if (availabilityFilter.availableNow && !availabilityFilter.availableNextMonth) {
      filtered = filtered.filter(room => room.availability.isAvailable);
    } else if (!availabilityFilter.availableNow && availabilityFilter.availableNextMonth) {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      filtered = filtered.filter(room => {
        const availableDate = new Date(room.availability.availableFrom);
        return availableDate <= nextMonth;
      });
    } else if (availabilityFilter.availableNow && availabilityFilter.availableNextMonth) {
      // Show all rooms if both are selected
    } else if (!availabilityFilter.availableNow && !availabilityFilter.availableNextMonth) {
      filtered = []; // Show no rooms if none selected
    }

    // Room type filter
    const selectedRoomTypes = Object.keys(roomTypeFilter).filter(type => roomTypeFilter[type]);
    if (selectedRoomTypes.length > 0) {
      filtered = filtered.filter(room => selectedRoomTypes.includes(room.roomType));
    }

    // Amenity filter
    const selectedAmenities = Object.keys(amenityFilter).filter(amenity => amenityFilter[amenity]);
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(room =>
        selectedAmenities.every(amenity => room.amenities.includes(amenity))
      );
    }

    // Location filter
    if (locationFilter.trim()) {
      filtered = filtered.filter(room =>
        room.location.address.toLowerCase().includes(locationFilter.toLowerCase()) ||
        room.location.city.toLowerCase().includes(locationFilter.toLowerCase()) ||
        room.location.nearbyUniversities.some(uni =>
          uni.name.toLowerCase().includes(locationFilter.toLowerCase())
        )
      );
    }

    // Rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(room => room.rating >= ratingFilter);
    }

    // Area filter
    filtered = filtered.filter(room =>
      room.features.area >= areaRange[0] && room.features.area <= areaRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.availability.availableFrom) - new Date(a.availability.availableFrom));
        break;
      case 'area':
        filtered.sort((a, b) => b.features.area - a.features.area);
        break;
      default:
        // Keep original order
        break;
    }

    setDisplayedRooms(filtered);
  };

  // Auto-apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [priceRange, availabilityFilter, roomTypeFilter, amenityFilter, locationFilter, ratingFilter, sortBy, areaRange]);

  const clearAllFilters = () => {
    setPriceRange([2000, 25000]);
    setAvailabilityFilter({ availableNow: true, availableNextMonth: false });
    setRoomTypeFilter({
      single: false,
      shared: false,
      pg: false,
      hostel: false,
      apartment: false,
      studio: false
    });
    setAmenityFilter({
      wifi: false,
      parking: false,
      security: false,
      kitchen: false,
      laundry: false,
      gym: false,
      ac: false,
      heating: false
    });
    setLocationFilter('');
    setRatingFilter(0);
    setSortBy('default');
    setAreaRange([50, 500]);
  };

  return (
    <div className="space-y-6">
      {/* Header Section with Animation */}
      <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white text-center">
            <SplitText
              text="Find Your Perfect Accommodation"
              className="text-3xl font-bold"
              delay={50}
              duration={0.8}
            />
          </CardTitle>
          <p className="text-center text-gray-300 mt-2">
            Discover comfortable and affordable student housing near top universities
          </p>
        </CardHeader>
      </Card>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <div className="w-80 flex-shrink-0">
          <FilterComponent
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            availabilityFilter={availabilityFilter}
            setAvailabilityFilter={setAvailabilityFilter}
            roomTypeFilter={roomTypeFilter}
            setRoomTypeFilter={setRoomTypeFilter}
            amenityFilter={amenityFilter}
            setAmenityFilter={setAmenityFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            areaRange={areaRange}
            setAreaRange={setAreaRange}
            displayedRooms={displayedRooms.length}
            totalRooms={allRooms.length}
            clearAllFilters={clearAllFilters}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Available Rooms</h2>
              <p className="text-gray-400">
                {displayedRooms.length} room{displayedRooms.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                <p className="text-gray-400">Loading available rooms...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Rooms Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedRooms.map(room => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onCardClick={handleCardClick}
                    onFavorite={handleFavorite}
                    showDistance={true}
                    className="transform hover:scale-[1.02] transition-transform duration-300"
                  />
                ))}
              </div>

              {/* No Results State */}
              {displayedRooms.length === 0 && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="text-center py-12">
                    <div className="text-white/60 text-lg mb-4">No rooms match your current filters</div>
                    <Button
                      onClick={clearAllFilters}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Load More Button */}
              {displayedRooms.length < allRooms.length && displayedRooms.length > 0 && (
                <div className="text-center mt-8">
                  <Button
                    onClick={() => setDisplayedRooms(allRooms)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Load More Rooms
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomBrowser;
