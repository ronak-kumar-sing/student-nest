"use client";

import React, { useState, useEffect } from 'react';
import { SharingRoomList } from '@/components/room-sharing/SharingRoomList';
import { Users, AlertCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SharedRoomsPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage (in real app, this would be from auth context)
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to access room sharing features.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <a
              href="/student/login"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Login
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentUser.userType !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <CardTitle>Student Access Only</CardTitle>
            <CardDescription>
              Room sharing is only available for verified students.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isVerified = currentUser.emailVerified &&
    currentUser.phoneVerified &&
    currentUser.studentIdVerified &&
    currentUser.collegeVerified;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Room Sharing
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
            Find verified students to share rooms with. Connect with compatible roommates
            based on lifestyle assessments and preferences.
          </p>
        </div>

        {/* Verification Alert */}
        {!isVerified && (
          <Alert className="mb-6 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <Shield className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 dark:text-orange-400">
              <strong>Verification Required:</strong> Complete your email, phone, student ID,
              and college verification to participate in room sharing.
              <a href="/student/profile" className="underline ml-1">
                Complete verification
              </a>
            </AlertDescription>
          </Alert>
        )}

        {/* How it Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              How Room Sharing Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Browse Available Rooms</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View rooms posted by other verified students looking for roommates.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Take Compatibility Assessment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete a quick lifestyle assessment to find compatible roommates.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Connect & Move In</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Message your matches and coordinate moving in together.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Sharing List */}
        <SharingRoomList currentUser={currentUser} />
      </div>
    </div>
  );
}