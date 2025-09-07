"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import { ownerBusinessSchema } from '@/lib/validation/profileSchemas';
import { getOwnerBusiness, updateOwnerBusiness } from '@/lib/api';
import {
  Building,
  FileText,
  CreditCard,
  MapPin,
  Calendar,
  Star,
  Save,
  RefreshCw,
  Loader2,
  Award,
  TrendingUp
} from 'lucide-react';

const businessTypes = [
  'Individual Property Owner',
  'Real Estate Agency',
  'Property Management Company',
  'PG/Hostel Operator',
  'Builder/Developer',
  'Other'
];

const propertyCategories = [
  'Student Housing',
  'Residential Rental',
  'Commercial Properties',
  'PG/Hostels',
  'Apartments',
  'Independent Houses',
  'Shared Accommodations'
];

function OwnerBusinessPage() {
  const [businessInfo, setBusinessInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(ownerBusinessSchema),
    defaultValues: {
      businessName: '',
      businessType: '',
      gstNumber: '',
      panNumber: '',
      businessDescription: '',
      experience: '',
      propertyTypes: [],
      serviceAreas: [],
      businessAddress: '',
      businessPhone: '',
      businessEmail: '',
      websiteUrl: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        linkedin: ''
      }
    }
  });

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    setLoading(true);
    try {
      const response = await getOwnerBusiness();
      if (response.success) {
        setBusinessInfo(response.data);
        form.reset(response.data);
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const response = await updateOwnerBusiness(data);
      if (response.success) {
        setBusinessInfo(data);
        alert('Business information updated successfully!');
      }
    } catch (error) {
      console.error('Error updating business info:', error);
      alert('Failed to update business information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-gray-400">
              <RefreshCw size={24} className="animate-spin" />
              <span>Loading business information...</span>
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
          <Building size={24} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <ProfileNavigation userType="owner" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Business Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building size={20} className="text-blue-600" />
                      Business Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your business name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="businessType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select business type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {businessTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter years of experience"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="businessPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter business phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="businessDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your business, services, and what makes you unique..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="businessAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your complete business address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Legal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText size={20} className="text-green-600" />
                      Legal & Tax Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="gstNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GST Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter GST number (if applicable)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="panNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PAN Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter PAN number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin size={20} className="text-purple-600" />
                      Contact & Online Presence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="businessEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter business email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="websiteUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter website URL (if any)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="socialMedia.facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook Page</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Facebook page URL"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="socialMedia.instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram Profile</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Instagram profile URL"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Business Statistics */}
                {businessInfo && (
                  <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                        <TrendingUp size={20} />
                        Business Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Award size={24} className="text-blue-600" />
                          </div>
                          <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                            {businessInfo.totalProperties || 0}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Total Properties
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Star size={24} className="text-yellow-600" />
                          </div>
                          <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                            {businessInfo.averageRating || 0}/5
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Average Rating
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Calendar size={24} className="text-green-600" />
                          </div>
                          <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                            {businessInfo.totalBookings || 0}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Total Bookings
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                        Save Business Info
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

export default OwnerBusinessPage;
