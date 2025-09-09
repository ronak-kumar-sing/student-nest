"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { FilterX, MapPin, Star, Home, Zap } from 'lucide-react';

const FilterComponent = ({
  priceRange,
  setPriceRange,
  availabilityFilter,
  setAvailabilityFilter,
  roomTypeFilter,
  setRoomTypeFilter,
  amenityFilter,
  setAmenityFilter,
  locationFilter,
  setLocationFilter,
  ratingFilter,
  setRatingFilter,
  sortBy,
  setSortBy,
  areaRange,
  setAreaRange,
  displayedRooms,
  totalRooms,
  clearAllFilters
}) => {
  const handleRoomTypeChange = (type, checked) => {
    setRoomTypeFilter(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  const handleAmenityChange = (amenity, checked) => {
    setAmenityFilter(prev => ({
      ...prev,
      [amenity]: checked
    }));
  };

  const handleAvailabilityChange = (type, checked) => {
    setAvailabilityFilter(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  const roomTypes = [
    { id: 'single', label: 'Single Room' },
    { id: 'shared', label: 'Shared Room' },
    { id: 'pg', label: 'PG' },
    { id: 'hostel', label: 'Hostel' },
    { id: 'apartment', label: 'Apartment' },
    { id: 'studio', label: 'Studio' }
  ];

  const amenities = [
    { id: 'wifi', label: 'Wi-Fi', icon: Zap },
    { id: 'parking', label: 'Parking' },
    { id: 'security', label: 'Security' },
    { id: 'kitchen', label: 'Kitchen' },
    { id: 'laundry', label: 'Laundry' },
    { id: 'gym', label: 'Gym' },
    { id: 'ac', label: 'AC' },
    { id: 'heating', label: 'Heating' }
  ];

  return (
    <Card className="sticky top-6 w-full max-w-sm bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <FilterX size={20} />
            Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-400 hover:text-white"
          >
            Clear All
          </Button>
        </div>
        <div className="text-sm text-gray-400">
          Showing {displayedRooms} of {totalRooms} rooms
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-white font-medium">Price Range (₹/month)</Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={25000}
            min={2000}
            step={500}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Location */}
        <div className="space-y-3">
          <Label className="text-white font-medium flex items-center gap-2">
            <MapPin size={16} />
            Location
          </Label>
          <Input
            placeholder="Search by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
          />
        </div>

        <Separator className="bg-gray-700" />

        {/* Availability */}
        <div className="space-y-3">
          <Label className="text-white font-medium">Availability</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="availableNow"
                checked={availabilityFilter.availableNow}
                onCheckedChange={(checked) => handleAvailabilityChange('availableNow', checked)}
              />
              <Label htmlFor="availableNow" className="text-gray-300">Available Now</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="availableNextMonth"
                checked={availabilityFilter.availableNextMonth}
                onCheckedChange={(checked) => handleAvailabilityChange('availableNextMonth', checked)}
              />
              <Label htmlFor="availableNextMonth" className="text-gray-300">Available Next Month</Label>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Room Type */}
        <div className="space-y-3">
          <Label className="text-white font-medium flex items-center gap-2">
            <Home size={16} />
            Room Type
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {roomTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={roomTypeFilter[type.id]}
                  onCheckedChange={(checked) => handleRoomTypeChange(type.id, checked)}
                />
                <Label htmlFor={type.id} className="text-gray-300 text-sm">{type.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Amenities */}
        <div className="space-y-3">
          <Label className="text-white font-medium">Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity.id}
                  checked={amenityFilter[amenity.id]}
                  onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked)}
                />
                <Label htmlFor={amenity.id} className="text-gray-300 text-sm">{amenity.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Rating */}
        <div className="space-y-3">
          <Label className="text-white font-medium flex items-center gap-2">
            <Star size={16} />
            Minimum Rating
          </Label>
          <Select value={ratingFilter.toString()} onValueChange={(value) => setRatingFilter(Number(value))}>
            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any rating</SelectItem>
              <SelectItem value="3">3+ stars</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="4.5">4.5+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-gray-700" />

        {/* Area Range */}
        <div className="space-y-3">
          <Label className="text-white font-medium">Area (sq ft)</Label>
          <Slider
            value={areaRange}
            onValueChange={setAreaRange}
            max={500}
            min={50}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-400">
            <span>{areaRange[0]} sq ft</span>
            <span>{areaRange[1]} sq ft</span>
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Sort By */}
        <div className="space-y-3">
          <Label className="text-white font-medium">Sort By</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="area">Largest Area</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterComponent;
