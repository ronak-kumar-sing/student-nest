"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Check,
  CheckCheck,
  Download,
  ExternalLink,
  Image as ImageIcon,
  FileText,
  Video,
  Calendar,
  DollarSign,
  MapPin,
  Eye
} from "lucide-react";

export default function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  onAcceptOffer,
  onCounterOffer,
  onJoinMeeting,
  userType = "student"
}) {
  const [imageError, setImageError] = useState(false);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = () => {
    if (!isOwn) return null;

    switch (message.status) {
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
      case 'sent':
        return <Check className="w-3 h-3 text-muted-foreground" />;
      default:
        return <Check className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'meeting_link':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Video className="w-4 h-4" />
              Meeting Scheduled
            </div>
            <div className="space-y-2">
              <p className="text-sm">{message.meetingData?.title || 'Virtual Meeting'}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(message.meetingData?.scheduledTime).toLocaleString()}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => window.open(message.meetingData?.link)}
                  className="flex items-center gap-1"
                >
                  <Video className="w-3 h-3" />
                  Join Meeting
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Add to calendar
                    const event = {
                      title: message.meetingData?.title,
                      start: message.meetingData?.scheduledTime,
                      description: `Meeting link: ${message.meetingData?.link}`
                    };
                    // Google Calendar link
                    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${new Date(event.start).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
                    window.open(googleCalendarUrl);
                  }}
                >
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>
        );

      case 'negotiation_offer':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <DollarSign className="w-4 h-4" />
              Price Negotiation
            </div>
            <div className="space-y-2">
              <div className="bg-muted/50 rounded p-2">
                <p className="text-sm font-medium">
                  Offered: ₹{message.negotiationData?.amount?.toLocaleString()}/month
                </p>
                {message.negotiationData?.originalPrice && (
                  <p className="text-xs text-muted-foreground">
                    Original: ₹{message.negotiationData.originalPrice.toLocaleString()}/month
                  </p>
                )}
                {message.negotiationData?.terms && (
                  <p className="text-xs mt-1">{message.negotiationData.terms}</p>
                )}
              </div>

              {!isOwn && userType === 'owner' && message.negotiationData?.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onAcceptOffer(message.id)}
                    className="flex-1"
                  >
                    Accept Offer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCounterOffer(message.id)}
                    className="flex-1"
                  >
                    Counter Offer
                  </Button>
                </div>
              )}

              {message.negotiationData?.status && (
                <Badge
                  variant={
                    message.negotiationData.status === 'accepted' ? 'default' :
                      message.negotiationData.status === 'rejected' ? 'destructive' :
                        'secondary'
                  }
                  className="text-xs"
                >
                  {message.negotiationData.status.charAt(0).toUpperCase() + message.negotiationData.status.slice(1)}
                </Badge>
              )}
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-3">
            {message.fileData?.type?.startsWith('image/') ? (
              <div className="space-y-2">
                {!imageError ? (
                  <img
                    src={message.fileData.url}
                    alt={message.fileData.name}
                    className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onError={() => setImageError(true)}
                    onClick={() => window.open(message.fileData.url)}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{message.fileData?.name || 'Image'}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 border rounded-lg max-w-xs">
                <div className="flex-shrink-0">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {message.fileData?.name || 'File'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {message.fileData?.size && `${(message.fileData.size / 1024 / 1024).toFixed(1)} MB`}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(message.fileData?.url)}
                className="flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = message.fileData?.url;
                  link.download = message.fileData?.name || 'file';
                  link.click();
                }}
                className="flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Download
              </Button>
            </div>
          </div>
        );

      case 'property_visit':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4" />
              Property Visit
            </div>
            <div className="space-y-2">
              <p className="text-sm">{message.content}</p>
              {message.visitData && (
                <div className="bg-muted/50 rounded p-2 text-xs space-y-1">
                  <p><strong>Date:</strong> {new Date(message.visitData.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {message.visitData.time}</p>
                  {message.visitData.notes && (
                    <p><strong>Notes:</strong> {message.visitData.notes}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="text-center">
            <div className="inline-block bg-muted/50 rounded-full px-3 py-1 text-xs text-muted-foreground">
              {message.content}
            </div>
          </div>
        );

      default:
        return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
    }
  };

  // System messages are centered
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        {renderMessageContent()}
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isOwn ? 'justify-end' : 'justify-start'} group`}>
      {/* Avatar for received messages */}
      {!isOwn && showAvatar && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={message.senderAvatar} />
          <AvatarFallback className="text-xs">
            {message.senderName?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message bubble */}
      <div className={`max-w-[70%] ${isOwn ? 'order-1' : ''}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${isOwn
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted rounded-bl-md'
            }`}
        >
          {renderMessageContent()}
        </div>

        {/* Timestamp and status */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'justify-end' : 'justify-start'
          }`}>
          <span className="text-xs text-muted-foreground">
            {formatTime(message.createdAt)}
          </span>
          {getStatusIcon()}
        </div>
      </div>

      {/* Spacer for sent messages */}
      {isOwn && !showAvatar && <div className="w-8" />}
    </div>
  );
}
