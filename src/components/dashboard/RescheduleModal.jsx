"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Loader2, Video } from 'lucide-react';
import apiClient from '@/lib/api';
import GoogleMeetIntegration from '@/components/meetings/GoogleMeetIntegration';

export default function RescheduleModal({ meetingId, currentDate, currentTime, onReschedule, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper function to format time properly
  const formatTimeForInput = (time) => {
    if (!time) return '';

    console.log('Formatting time:', time, 'Type:', typeof time);

    // If it's already in HH:MM format, return as is
    if (typeof time === 'string' && /^\d{2}:\d{2}$/.test(time)) {
      return time;
    }

    // Handle different time format patterns
    if (typeof time === 'string') {
      // If it's in format "HH:MM:SS" or "HH:MM:SS.sss"
      if (time.includes(':')) {
        const timeParts = time.split(':');
        if (timeParts.length >= 2) {
          const hours = timeParts[0].padStart(2, '0');
          const minutes = timeParts[1].padStart(2, '0');
          return `${hours}:${minutes}`;
        }
      }

      // Try parsing as ISO date string
      try {
        const date = new Date(time);
        if (!isNaN(date.getTime())) {
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        }
      } catch (e) {
        console.error('Error parsing time string:', e);
      }
    }

    // If it's a Date object
    if (time instanceof Date && !isNaN(time.getTime())) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }

    // If it's a number (assuming timestamp)
    if (typeof time === 'number') {
      const date = new Date(time);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    }

    console.warn('Could not format time:', time);
    return '';
  };

  const [formData, setFormData] = useState({
    newDate: currentDate ? currentDate.split('T')[0] : '',
    newTime: formatTimeForInput(currentTime),
    reason: ''
  });

  const handleCancelMeeting = async () => {
    setLoading(true);
    try {
      const response = await apiClient.cancelMeeting(meetingId, {
        reason: formData.reason || 'Meeting cancelled by owner'
      });

      if (response.success) {
        setIsOpen(false);
        if (onReschedule) {
          onReschedule(response.data);
        }
        // Reset form
        setFormData({
          newDate: '',
          newTime: '',
          reason: ''
        });
      } else {
        console.error('Failed to cancel meeting:', response.error);
        alert('Failed to cancel meeting. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling meeting:', error);
      alert('Error cancelling meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.rescheduleMeeting(meetingId, {
        newDate: formData.newDate,
        newTime: formData.newTime,
        reason: formData.reason || 'Meeting rescheduled by owner'
      });

      if (response.success) {
        setIsOpen(false);
        if (onReschedule) {
          onReschedule(response.data);
        }
        // Reset form
        setFormData({
          newDate: '',
          newTime: '',
          reason: ''
        });
      } else {
        console.error('Failed to reschedule meeting:', response.error);
        alert('Failed to reschedule meeting. Please try again.');
      }
    } catch (error) {
      console.error('Error rescheduling meeting:', error);
      alert('Error rescheduling meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  // Update form data when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setFormData({
        newDate: currentDate ? currentDate.split('T')[0] : '',
        newTime: formatTimeForInput(currentTime),
        reason: ''
      });
    }
  }, [isOpen, currentDate, currentTime]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Reschedule Meeting
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newDate">New Date</Label>
            <Input
              id="newDate"
              type="date"
              value={formData.newDate}
              onChange={(e) => handleInputChange('newDate', e.target.value)}
              min={today}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newTime">New Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="newTime"
                type="time"
                value={formData.newTime}
                onChange={(e) => handleInputChange('newTime', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Let the student know why you're rescheduling..."
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              rows={3}
            />
          </div>

          {/* Google Meet Integration */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Video className="h-4 w-4" />
              Video Meeting
            </div>
            <GoogleMeetIntegration
              meetingId={meetingId}
              userType="owner"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancelMeeting}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Meeting'
              )}
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={loading}
              >
                Close
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.newDate || !formData.newTime}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Rescheduling...
                  </>
                ) : (
                  'Reschedule Meeting'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}