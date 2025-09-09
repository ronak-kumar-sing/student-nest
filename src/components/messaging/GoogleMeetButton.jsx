"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar, ExternalLink, Clock, Users } from "lucide-react";

export default function GoogleMeetButton({
  meetingData = {},
  onScheduleMeeting,
  userType = "student",
  disabled = false
}) {
  const {
    meetingId,
    meetingUrl,
    scheduledTime,
    duration = 30,
    status = "scheduled",
    attendees = [],
    title = "Property Viewing Discussion"
  } = meetingData;

  // Generate Google Meet URL for new meetings
  const generateMeetingUrl = () => {
    const meetId = `nest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return `https://meet.google.com/${meetId}`;
  };

  const handleJoinMeeting = () => {
    if (meetingUrl) {
      window.open(meetingUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleScheduleMeeting = () => {
    const newMeetingData = {
      meetingId: `meet-${Date.now()}`,
      meetingUrl: generateMeetingUrl(),
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      duration: 30,
      status: 'scheduled',
      title: title,
      attendees: attendees,
      type: 'property_viewing'
    };

    onScheduleMeeting(newMeetingData);
  };

  const isUpcoming = scheduledTime && new Date(scheduledTime) > new Date();
  const isLive = status === 'live';
  const hasEnded = scheduledTime && new Date(scheduledTime) < new Date() && status !== 'live';

  // If no meeting is scheduled yet
  if (!meetingId) {
    return (
      <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium">Schedule a Video Call</h4>
            <p className="text-sm text-muted-foreground">
              Discuss property details face-to-face
            </p>
          </div>
        </div>

        <Button
          onClick={handleScheduleMeeting}
          disabled={disabled}
          className="w-full"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Google Meet
        </Button>
      </div>
    );
  }

  // If meeting is scheduled
  return (
    <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Video className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h4 className="font-medium">{title}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {scheduledTime && new Date(scheduledTime).toLocaleString()}
              <span>•</span>
              <span>{duration} mins</span>
            </div>
          </div>
        </div>

        <Badge
          variant={isLive ? "destructive" : isUpcoming ? "default" : "secondary"}
          className={
            isLive ? "bg-red-500 animate-pulse" :
              isUpcoming ? "bg-green-500" :
                "bg-gray-500"
          }
        >
          {isLive ? "Live" : isUpcoming ? "Scheduled" : "Ended"}
        </Badge>
      </div>

      {attendees.length > 0 && (
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{attendees.length} attendee{attendees.length > 1 ? 's' : ''}</span>
        </div>
      )}

      <div className="flex gap-2">
        {(isUpcoming || isLive) && (
          <Button
            onClick={handleJoinMeeting}
            disabled={disabled}
            className="flex-1"
            variant={isLive ? "destructive" : "default"}
          >
            <Video className="h-4 w-4 mr-2" />
            {isLive ? "Join Live Meeting" : "Join Meeting"}
          </Button>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(meetingUrl, '_blank', 'noopener,noreferrer')}
          disabled={disabled || !meetingUrl}
          title="Open in new tab"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      {hasEnded && (
        <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm text-center text-muted-foreground">
          This meeting has ended. Schedule a new one if needed.
        </div>
      )}

      {/* Meeting Preparation Tips */}
      {isUpcoming && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
          <h5 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
            📋 Meeting Preparation
          </h5>
          <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
            {userType === "student" ? (
              <>
                <li>• Prepare your questions about the property</li>
                <li>• Have your documents ready if requested</li>
                <li>• Test your camera and microphone</li>
                <li>• Choose a quiet location for the call</li>
              </>
            ) : (
              <>
                <li>• Prepare property details and photos</li>
                <li>• Review the student's profile beforehand</li>
                <li>• Have lease terms and pricing ready</li>
                <li>• Ensure good lighting for property showcase</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
