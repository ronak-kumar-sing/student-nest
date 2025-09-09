"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import { studentPreferencesSchema } from '@/lib/validation/profileSchemas';
import { getStudentPreferences, updateStudentPreferences } from '@/lib/api';
import {
  Save,
  Heart,
  Home,
  MapPin,
  DollarSign,
  Wifi,
  Car,
  Utensils,
  RefreshCw,
  Loader2
} from 'lucide-react';

// Room types and amenities options
const roomTypes = [
  { id: 'single', label: 'Single Room', icon: '🛏️' },
  { id: 'shared', label: 'Shared Room', icon: '👥' },
  { id: 'studio', label: 'Studio Apartment', icon: '🏠' },
  { id: 'pg', label: 'PG Accommodation', icon: '🏢' }
];

const locationPreferences = [
  'Near Metro Station',
  'Close to College',
  'Market Area',
  'Quiet Neighborhood',
  'Bus Stand Nearby',
  'Hospital Nearby',
  'Mall/Shopping Center',
  'Park/Garden Nearby'
];

const amenityOptions = [
  { id: 'wifi', label: 'WiFi', icon: Wifi },
  { id: 'ac', label: 'Air Conditioning', icon: '❄️' },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'laundry', label: 'Laundry', icon: '🧺' },
  { id: 'kitchen', label: 'Kitchen Access', icon: Utensils },
  { id: 'gym', label: 'Gym', icon: '💪' },
  { id: 'security', label: '24/7 Security', icon: '🔒' },
  { id: 'housekeeping', label: 'Housekeeping', icon: '🧹' },
  { id: 'food', label: 'Food Service', icon: '🍽️' },
  { id: 'water', label: 'Water Purifier', icon: '💧' }
];

function StudentPreferencesPage() {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(studentPreferencesSchema),
    defaultValues: {
      roomTypePreference: [],
      budgetMin: 5000,
      budgetMax: 20000,
      locationPreferences: [],
      amenityPreferences: []
    }
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const response = await getStudentPreferences();
      if (response.success) {
        setPreferences(response.data);
        form.reset(response.data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const response = await updateStudentPreferences(data);
      if (response.success) {
        setPreferences(data);
        alert('Preferences updated successfully!');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const budgetRange = form.watch(['budgetMin', 'budgetMax']);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-gray-400">
              <RefreshCw size={24} className="animate-spin" />
              <span>Loading preferences...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Heart size={24} className="text-pink-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Room Preferences</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <ProfileNavigation userType="student" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Room Type Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home size={20} className="text-blue-600" />
                      Room Type Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="roomTypePreference"
                      render={() => (
                        <FormItem>
                          <FormLabel>Select your preferred room types</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {roomTypes.map((type) => (
                              <FormField
                                key={type.id}
                                control={form.control}
                                name="roomTypePreference"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(type.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, type.id])
                                            : field.onChange(
                                              field.value?.filter((value) => value !== type.id)
                                            );
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm font-normal cursor-pointer">
                                        <div className="flex items-center gap-2">
                                          <span className="text-lg">{type.icon}</span>
                                          {type.label}
                                        </div>
                                      </FormLabel>
                                    </div>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Budget Range */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign size={20} className="text-green-600" />
                      Budget Range
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Monthly Budget</span>
                        <Badge variant="secondary" className="text-lg font-semibold">
                          ₹{budgetRange[0]?.toLocaleString()} - ₹{budgetRange[1]?.toLocaleString()}
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="budgetMin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Budget: ₹{field.value?.toLocaleString()}</FormLabel>
                              <FormControl>
                                <Slider
                                  min={2000}
                                  max={50000}
                                  step={1000}
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="budgetMax"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Budget: ₹{field.value?.toLocaleString()}</FormLabel>
                              <FormControl>
                                <Slider
                                  min={2000}
                                  max={50000}
                                  step={1000}
                                  value={[field.value]}
                                  onValueChange={(value) => field.onChange(value[0])}
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin size={20} className="text-red-600" />
                      Location Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="locationPreferences"
                      render={() => (
                        <FormItem>
                          <FormLabel>Select your preferred location features</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {locationPreferences.map((location) => (
                              <FormField
                                key={location}
                                control={form.control}
                                name="locationPreferences"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(location)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, location])
                                            : field.onChange(
                                              field.value?.filter((value) => value !== location)
                                            );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal cursor-pointer">
                                      {location}
                                    </FormLabel>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Amenity Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wifi size={20} className="text-purple-600" />
                      Amenity Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="amenityPreferences"
                      render={() => (
                        <FormItem>
                          <FormLabel>Select your preferred amenities</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {amenityOptions.map((amenity) => {
                              const IconComponent = typeof amenity.icon === 'string' ?
                                () => <span className="text-lg">{amenity.icon}</span> :
                                amenity.icon;

                              return (
                                <FormField
                                  key={amenity.id}
                                  control={form.control}
                                  name="amenityPreferences"
                                  render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(amenity.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, amenity.id])
                                              : field.onChange(
                                                field.value?.filter((value) => value !== amenity.id)
                                              );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal cursor-pointer">
                                        <div className="flex items-center gap-2">
                                          <IconComponent size={16} />
                                          {amenity.label}
                                        </div>
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="min-w-[140px]"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentPreferencesPage;
