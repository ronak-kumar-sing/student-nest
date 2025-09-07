"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MeetingScheduler from '@/components/meetings/MeetingScheduler';
import MeetingStatusCard from '@/components/meetings/MeetingStatusCard';
import MeetingRequestCard from '@/components/meetings/MeetingRequestCard';
import { Calendar, Video, MapPin } from 'lucide-react';

// Sample meeting data for testing
const sampleStudentMeeting = {
  id: 1,
  studentId: 1,
  ownerId: 2,
  propertyId: 101,
  meetingType: 'online',
  requestedDate: '2024-09-15',
  requestedTime: '14:00',
  status: 'modified',
  studentNotes: 'I would like to see the property and discuss the amenities available.',
  ownerResponse: 'I have proposed alternative times that work better with my schedule.',
  createdAt: '2024-09-07T10:30:00Z',
  updatedAt: '2024-09-07T15:45:00Z',
  proposedTimeSlots: [
    {
      id: 1,
      meetingRequestId: 1,
      proposedDate: '2024-09-16',
      proposedTime: '10:00',
      proposedBy: 'owner',
      isSelected: false,
      createdAt: '2024-09-07T15:45:00Z'
    },
    {
      id: 2,
      meetingRequestId: 1,
      proposedDate: '2024-09-16',
      proposedTime: '16:00',
      proposedBy: 'owner',
      isSelected: false,
      createdAt: '2024-09-07T15:45:00Z'
    },
    {
      id: 3,
      meetingRequestId: 1,
      proposedDate: '2024-09-17',
      proposedTime: '11:00',
      proposedBy: 'owner',
      isSelected: false,
      createdAt: '2024-09-07T15:45:00Z'
    }
  ]
};

const sampleOwnerRequest = {
  id: 2,
  studentId: 3,
  ownerId: 2,
  propertyId: 102,
  meetingType: 'offline',
  requestedDate: '2024-09-20',
  requestedTime: '15:30',
  status: 'pending',
  studentNotes: 'Hi! I\'m interested in this property for my studies. Can we schedule an in-person visit? I\'d like to see the room and common areas.',
  ownerResponse: '',
  createdAt: '2024-09-07T12:15:00Z',
  updatedAt: '2024-09-07T12:15:00Z'
};

function MeetingDemo() {
  const handleScheduleSuccess = () => {
    alert('Meeting request sent successfully! 🎉');
  };

  const handleAcceptTime = (meetingId, timeSlotId) => {
    alert(`Meeting time accepted! Meeting ID: ${meetingId}, Time Slot ID: ${timeSlotId}`);
  };

  const handleModifyTime = (meeting) => {
    alert(`Requesting different times for meeting ${meeting.id}`);
  };

  const handleOwnerAccept = (meetingId) => {
    alert(`Meeting ${meetingId} accepted by owner!`);
  };

  const handleOwnerDecline = (meetingId) => {
    alert(`Meeting ${meetingId} declined by owner`);
  };

  const handleOwnerModify = (meetingId) => {
    alert(`Owner proposed alternative times for meeting ${meetingId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Meeting Scheduling System Demo</h1>
          <p className="text-gray-400 text-lg">
            Test the complete meeting scheduling workflow between students and property owners
          </p>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Student Section */}
          <div className="space-y-6">
            <Card className="bg-blue-900/20 border-blue-800/50">
              <CardHeader>
                <CardTitle className="text-blue-300 text-2xl">👨‍🎓 Student View</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Meeting Scheduler Demo */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold">1. Schedule a Visit</h3>
                  <p className="text-gray-400 text-sm">
                    Click below to schedule a property visit (Property ID: 123)
                  </p>
                  <MeetingScheduler
                    propertyId={123}
                    ownerId={2}
                    onScheduleSuccess={handleScheduleSuccess}
                    trigger={
                      <Button className="w-full bg-green-600 hover:bg-green-500 text-white">
                        <Calendar size={18} className="mr-2" />
                        Schedule Property Visit
                      </Button>
                    }
                  />
                </div>

                {/* Meeting Status Demo */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold">2. Manage Your Requests</h3>
                  <p className="text-gray-400 text-sm">
                    View and respond to meeting requests (sample with proposed times)
                  </p>
                  <MeetingStatusCard
                    meeting={sampleStudentMeeting}
                    onAcceptTime={handleAcceptTime}
                    onModifyTime={handleModifyTime}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Owner Section */}
          <div className="space-y-6">
            <Card className="bg-green-900/20 border-green-800/50">
              <CardHeader>
                <CardTitle className="text-green-300 text-2xl">🏠 Owner View</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-white font-semibold">Incoming Visit Request</h3>
                  <p className="text-gray-400 text-sm">
                    Manage incoming meeting requests from students
                  </p>
                  <MeetingRequestCard
                    request={sampleOwnerRequest}
                    onAccept={handleOwnerAccept}
                    onDecline={handleOwnerDecline}
                    onModify={handleOwnerModify}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Overview */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl">🚀 System Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-400">
                  <Video size={20} />
                  <h4 className="font-semibold">Online & Offline Meetings</h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Support for both virtual property tours and in-person visits
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-400">
                  <Calendar size={20} />
                  <h4 className="font-semibold">Flexible Scheduling</h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Easy time selection with owner modification capabilities
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-400">
                  <MapPin size={20} />
                  <h4 className="font-semibold">Smart Notifications</h4>
                </div>
                <p className="text-gray-400 text-sm">
                  Real-time updates for all meeting status changes
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-800/50 rounded-lg">
              <h4 className="text-yellow-300 font-semibold mb-2">🔧 Integration Ready</h4>
              <p className="text-gray-300 text-sm">
                This meeting system is fully integrated with the existing room browsing,
                authentication, and navigation systems. API endpoints are configured for
                production database integration.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button asChild variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-900/30">
            <a href="/dashboard/visiting-schedule">
              <Calendar size={16} className="mr-2" />
              Student Visits Dashboard
            </a>
          </Button>
          <Button asChild variant="outline" className="border-green-600 text-green-400 hover:bg-green-900/30">
            <a href="/owner/visits">
              <Calendar size={16} className="mr-2" />
              Owner Visits Dashboard
            </a>
          </Button>
          <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <a href="/dashboard">
              <MapPin size={16} className="mr-2" />
              Browse Properties
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MeetingDemo;
