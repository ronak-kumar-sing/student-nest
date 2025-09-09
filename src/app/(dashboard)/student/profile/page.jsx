"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileNavigation from '@/components/profile/ProfileNavigation';
import ProfileEditForm from '@/components/forms/ProfileEditForm';
import { getStudentProfile, updateStudentProfile, uploadAvatar } from '@/lib/api';
import { Camera, Edit, RefreshCw } from 'lucide-react';

function StudentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState({});
  const [activityStats, setActivityStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await getStudentProfile();
      if (response.success) {
        setProfile(response.data.profile);
        setVerificationStatus(response.data.verificationStatus);
        setActivityStats(response.data.activityStats);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (formData) => {
    setUpdating(true);
    try {
      const response = await updateStudentProfile(formData);
      if (response.success) {
        setProfile(response.data);
        setShowEditModal(false);
        // Show success message
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/jpg,image/webp';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('avatar', file);

          const response = await uploadAvatar(formData);
          if (response.success) {
            setProfile(prev => ({ ...prev, avatar: response.data.avatarUrl }));
            alert('Avatar updated successfully!');
          }
        } catch (error) {
          console.error('Error uploading avatar:', error);
          alert('Failed to upload avatar. Please try again.');
        }
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3 text-gray-400">
              <RefreshCw size={24} className="animate-spin" />
              <span>Loading profile...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Profile Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Unable to load your profile information.
            </p>
            <Button onClick={fetchProfile}>
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header */}
        <ProfileHeader
          user={profile}
          userType="student"
          onEditClick={() => setShowEditModal(true)}
          onUploadAvatar={handleAvatarUpload}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <ProfileNavigation userType="student" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => setShowEditModal(true)}
                  >
                    <Edit size={20} />
                    <span>Edit Profile</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={handleAvatarUpload}
                  >
                    <Camera size={20} />
                    <span>Change Avatar</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    asChild
                  >
                    <a href="/student/profile/preferences">
                      <span>💙</span>
                      <span>Preferences</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completeness */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Completeness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Profile Completion</span>
                    <span className="text-sm text-gray-500">
                      {activityStats.profileCompleteness}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${activityStats.profileCompleteness}%` }}
                    ></div>
                  </div>

                  {activityStats.profileCompleteness < 100 && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Complete your profile to improve your chances of finding the perfect room!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900 dark:text-blue-300">
                        Profile Updated
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        {new Date(profile.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900 dark:text-green-300">
                        Account Created
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <ProfileEditForm
              profile={profile}
              userType="student"
              onUpdate={handleUpdateProfile}
              isLoading={updating}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default StudentProfilePage;
