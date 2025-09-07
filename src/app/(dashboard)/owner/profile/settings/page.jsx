"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import { ownerSettingsSchema } from '@/lib/validation/profileSchemas';
import { getOwnerSettings, updateOwnerSettings, deleteOwnerAccount } from '@/lib/api';
import {
  Settings,
  Bell,
  Lock,
  Eye,
  Globe,
  Smartphone,
  Mail,
  Shield,
  Trash2,
  Save,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Building,
  Users,
  DollarSign
} from 'lucide-react';

function OwnerSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(ownerSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: false,
      bookingNotifications: true,
      inquiryNotifications: true,
      paymentNotifications: true,
      profileVisibility: 'public',
      showContactInfo: true,
      allowMessages: true,
      autoReply: false,
      instantBooking: false,
      showPricing: true,
      language: 'en',
      timezone: 'Asia/Kolkata',
      currency: 'INR'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await getOwnerSettings();
      if (response.success) {
        setSettings(response.data);
        form.reset(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const response = await updateOwnerSettings(data);
      if (response.success) {
        setSettings(data);
        alert('Settings updated successfully!');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This will also remove all your property listings. This action cannot be undone.')) {
      try {
        const response = await deleteOwnerAccount();
        if (response.success) {
          alert('Account deleted successfully. You will be redirected to the homepage.');
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-gray-400">
              <RefreshCw size={24} className="animate-spin" />
              <span>Loading settings...</span>
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
          <Settings size={24} className="text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Business Settings</h1>
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
                {/* Notification Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell size={20} className="text-blue-600" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center gap-2">
                              <Mail size={16} />
                              Email Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive general notifications via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bookingNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center gap-2">
                              <Building size={16} />
                              Booking Notifications
                            </FormLabel>
                            <FormDescription>
                              Get notified when students book your properties
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="inquiryNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center gap-2">
                              <Users size={16} />
                              Inquiry Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive notifications for new property inquiries
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center gap-2">
                              <DollarSign size={16} />
                              Payment Notifications
                            </FormLabel>
                            <FormDescription>
                              Get notified about payments and transactions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="smsNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center gap-2">
                              <Smartphone size={16} />
                              SMS Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive important updates via text message
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Marketing Emails
                            </FormLabel>
                            <FormDescription>
                              Receive emails about new features and business opportunities
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Business Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building size={20} className="text-green-600" />
                      Business Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="instantBooking"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Instant Booking
                            </FormLabel>
                            <FormDescription>
                              Allow students to book your properties instantly without approval
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="autoReply"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Auto Reply Messages
                            </FormLabel>
                            <FormDescription>
                              Automatically respond to student inquiries with pre-set messages
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="showPricing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Show Pricing Publicly
                            </FormLabel>
                            <FormDescription>
                              Display room prices on your property listings
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Privacy Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye size={20} className="text-orange-600" />
                      Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="profileVisibility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Visibility</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select visibility" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="public">Public - Visible to all users</SelectItem>
                              <SelectItem value="private">Private - Visible only to inquiring students</SelectItem>
                              <SelectItem value="verified">Verified Students Only</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Control who can view your business profile
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="showContactInfo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Show Contact Information
                            </FormLabel>
                            <FormDescription>
                              Display your contact details on property listings
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allowMessages"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Allow Direct Messages
                            </FormLabel>
                            <FormDescription>
                              Allow students to send you direct messages
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Account Preferences */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe size={20} className="text-purple-600" />
                      Account Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="hi">Hindi</SelectItem>
                                <SelectItem value="te">Telugu</SelectItem>
                                <SelectItem value="ta">Tamil</SelectItem>
                                <SelectItem value="kn">Kannada</SelectItem>
                                <SelectItem value="ml">Malayalam</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose your preferred language for the interface
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                                <SelectItem value="USD">US Dollar ($)</SelectItem>
                                <SelectItem value="EUR">Euro (€)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Choose currency for pricing display
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                              <SelectItem value="Asia/Dubai">Gulf Standard Time (GST)</SelectItem>
                              <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose your timezone for scheduling and notifications
                          </FormDescription>
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
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Danger Zone */}
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-300">
                  <AlertTriangle size={20} />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                      Delete Account
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                      Permanently delete your account and all associated data including property listings, bookings, and business information. This action cannot be undone.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerSettingsPage;
