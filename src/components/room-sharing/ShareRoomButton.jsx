"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { RoomShareAssessment } from './RoomShareAssessment';
import { SharingParticipantCard } from './SharingParticipantCard';
import { VerifyBadge } from './VerifyBadge';
import {
  Users,
  UserPlus,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';

export function ShareRoomButton({
  roomId,
  currentUser,
  maxSharingCapacity = 2,
  onSuccess
}) {
  const [sharingData, setSharingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [assessmentLoading, setAssessmentLoading] = useState(false);

  const isVerified = currentUser?.emailVerified &&
    currentUser?.phoneVerified &&
    currentUser?.studentIdVerified &&
    currentUser?.collegeVerified;

  useEffect(() => {
    fetchSharingData();
  }, [roomId]);

  const fetchSharingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/room-sharing/list?studentId=${currentUser?.id}`);
      const data = await response.json();

      if (data.success) {
        const roomSharing = data.data.find(share => share.roomId === roomId);
        setSharingData(roomSharing);
      }
    } catch (error) {
      console.error('Error fetching sharing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSharing = async () => {
    if (!isVerified) {
      setVerificationDialogOpen(true);
      return;
    }

    setAssessmentOpen(true);
  };

  const handleJoinSharing = async () => {
    if (!isVerified) {
      setVerificationDialogOpen(true);
      return;
    }

    if (!sharingData?.canJoin) {
      toast.error('Cannot join this room sharing');
      return;
    }

    setAssessmentOpen(true);
  };

  const handleAssessmentSubmit = async (assessmentAnswers) => {
    try {
      setAssessmentLoading(true);

      let endpoint, body;

      if (sharingData) {
        // Join existing sharing
        endpoint = '/api/room-sharing/join';
        body = {
          roomSharingId: sharingData.id,
          studentId: currentUser.id,
          assessmentAnswers
        };
      } else {
        // Create new sharing post
        endpoint = '/api/room-sharing/post';
        body = {
          roomId,
          studentId: currentUser.id,
          assessmentAnswers
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setAssessmentOpen(false);
        await fetchSharingData(); // Refresh data
        onSuccess?.();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to process request');
    } finally {
      setAssessmentLoading(false);
    }
  };

  const handleMessageUser = (userId) => {
    // In a real app, this would open the messaging interface
    toast.info(`Messaging feature will open chat with user ${userId}`);
  };

  const isUserInSharing = sharingData?.participants?.some(
    p => p.studentId === currentUser?.id
  );

  const availableSlots = sharingData ?
    sharingData.maxParticipants - sharingData.participants.length :
    maxSharingCapacity;

  if (loading) {
    return (
      <Button disabled className="w-full">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main action button */}
        {!sharingData ? (
          // No sharing exists - show post button
          <Button
            onClick={handlePostSharing}
            className="w-full"
            size="lg"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Post for Room Sharing
          </Button>
        ) : isUserInSharing ? (
          // User is already in sharing
          <div className="space-y-3">
            <Button
              disabled
              className="w-full bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
              size="lg"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Already in Sharing List
            </Button>

            {/* Show current participants */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                Room Partners ({sharingData.participants.length}/{sharingData.maxParticipants})
              </h4>
              <div className="grid gap-2">
                {sharingData.participants.map((participant) => (
                  <SharingParticipantCard
                    key={participant.studentId}
                    participant={participant}
                    isCurrentUser={participant.studentId === currentUser?.id}
                    onMessageClick={handleMessageUser}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // User can join existing sharing
          <div className="space-y-3">
            <Button
              onClick={handleJoinSharing}
              className="w-full"
              size="lg"
              disabled={!sharingData.canJoin}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {availableSlots > 0 ?
                `Join Room Sharing (${availableSlots} spots left)` :
                'Room Sharing Full'
              }
            </Button>

            {/* Show current participants */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                Current Partners ({sharingData.participants.length}/{sharingData.maxParticipants})
              </h4>
              <div className="grid gap-2">
                {sharingData.participants.map((participant) => (
                  <SharingParticipantCard
                    key={participant.studentId}
                    participant={participant}
                    showMessageButton={false}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Verification status */}
        {!isVerified && (
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-orange-800 dark:text-orange-400">
                  Verification Required
                </p>
                <p className="text-orange-600 dark:text-orange-300 mt-1">
                  Complete verification to post or join room sharing
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assessment Modal */}
      <RoomShareAssessment
        isOpen={assessmentOpen}
        onClose={() => setAssessmentOpen(false)}
        onSubmit={handleAssessmentSubmit}
        isLoading={assessmentLoading}
        title={sharingData ? "Join Room Sharing" : "Post Room for Sharing"}
        description={sharingData ?
          "Complete this assessment to join the room sharing" :
          "Complete this assessment to start room sharing"
        }
      />

      {/* Verification Dialog */}
      <Dialog open={verificationDialogOpen} onOpenChange={setVerificationDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-600" />
              Verification Required
            </DialogTitle>
            <DialogDescription>
              You need to complete verification before you can participate in room sharing.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email Verification</span>
                </div>
                <VerifyBadge isVerified={currentUser?.emailVerified} showText={false} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Phone Verification</span>
                </div>
                <VerifyBadge isVerified={currentUser?.phoneVerified} showText={false} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm">Student ID Verification</span>
                </div>
                <VerifyBadge isVerified={currentUser?.studentIdVerified} showText={false} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm">College Verification</span>
                </div>
                <VerifyBadge isVerified={currentUser?.collegeVerified} showText={false} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setVerificationDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setVerificationDialogOpen(false);
                // In real app, redirect to profile verification page
                toast.info('Redirecting to verification page...');
              }}>
                Complete Verification
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ShareRoomButton;