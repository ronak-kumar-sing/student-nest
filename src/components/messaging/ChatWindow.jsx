"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import PropertyCard from "./PropertyCard";
import NegotiationPanel from "./NegotiationPanel";
import GoogleMeetButton from "./GoogleMeetButton";
import {
  Phone,
  Video,
  MoreVertical,
  Info,
  Archive,
  Flag,
  Star,
  Pin
} from "lucide-react";

export default function ChatWindow({
  conversation,
  messages = [],
  onSendMessage,
  onStartNegotiation,
  onScheduleMeeting,
  currentUser,
  userType = "student"
}) {
  const [isTyping, setIsTyping] = useState(false);
  const [showPropertyCard, setShowPropertyCard] = useState(true);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle typing indicators
  useEffect(() => {
    if (conversation?.participantTyping) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 3000);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [conversation?.participantTyping]);

  if (!conversation) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <div className="mb-4 text-muted-foreground">
            <svg
              className="w-24 h-24 mx-auto mb-4 opacity-20"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Select a conversation
          </h3>
          <p className="text-muted-foreground">
            Choose a conversation from the list to start messaging
          </p>
        </CardContent>
      </Card>
    );
  }

  const getParticipantStatus = () => {
    if (conversation.participantTyping) return "typing...";
    
    const isOnline = conversation.participant?.isOnline;
    const lastSeen = conversation.participant?.lastSeen;
    
    if (isOnline) {
      return "Active now";
    } else if (lastSeen) {
      const lastSeenDate = new Date(lastSeen);
      const now = new Date();
      const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));

      if (diffInMinutes < 60) return `Last seen ${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `Last seen ${Math.floor(diffInMinutes / 60)}h ago`;
      return `Last seen ${Math.floor(diffInMinutes / 1440)}d ago`;
    } else {
      return "Offline";
    }
  };

  const handleSendMessage = (messageData) => {
    onSendMessage({
      conversationId: conversation.id,
      ...messageData
    });
  };

  const handleStartNegotiation = () => {
    setShowNegotiation(true);
    onStartNegotiation(conversation.id);
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Chat Header */}
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.participant?.avatar} />
                <AvatarFallback>
                  {conversation.participant?.name?.split(' ').map(n => n[0]).join('') || '?'}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${conversation.participant?.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">
                  {conversation.participant?.name || 'Unknown'}
                </h3>
                {conversation.participant?.verified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
                {conversation.isPinned && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {getParticipantStatus()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>

            <GoogleMeetButton
              conversationId={conversation.id}
              onMeetingScheduled={(meetingData) => {
                handleSendMessage({
                  type: 'meeting_link',
                  content: `Meeting scheduled: ${meetingData.title}`,
                  meetingData
                });
              }}
            />

            <Button variant="ghost" size="sm">
              <Info className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {/* Property Context Card */}
            {userType === "student" && conversation.property && showPropertyCard && (
              <PropertyCard
                property={conversation.property}
                onClose={() => setShowPropertyCard(false)}
                onNegotiate={handleStartNegotiation}
              />
            )}

            {/* Negotiation Panel */}
            {showNegotiation && conversation.property && (
              <NegotiationPanel
                conversation={conversation}
                property={conversation.property}
                onSubmitOffer={(offerData) => {
                  handleSendMessage({
                    type: 'negotiation_offer',
                    content: `Price negotiation: ₹${offerData.amount}/month`,
                    negotiationData: offerData
                  });
                }}
                onClose={() => setShowNegotiation(false)}
                userType={userType}
              />
            )}

            {/* Messages */}
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === "me" || message.senderId === currentUser?.id}
                showAvatar={
                  index === 0 ||
                  messages[index - 1].senderId !== message.senderId
                }
                onAcceptOffer={(messageId) => {
                  // Handle offer acceptance
                  console.log('Accept offer:', messageId);
                }}
                onCounterOffer={(messageId) => {
                  // Handle counter offer
                  setShowNegotiation(true);
                }}
                userType={userType}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 p-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={conversation.participant?.avatar} />
                  <AvatarFallback className="text-xs">
                    {conversation.participant?.name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex-shrink-0 pt-4 border-t">
          <MessageInput
            onSendMessage={handleSendMessage}
            onStartTyping={() => {
              // Send typing indicator
            }}
            onStopTyping={() => {
              // Stop typing indicator
            }}
            disabled={conversation.archived}
            placeholder={
              conversation.archived
                ? "This conversation is archived"
                : "Type your message..."
            }
            userType={userType}
            conversationId={conversation.id}
          />
        </div>
      </CardContent>
    </Card>
  );
}
