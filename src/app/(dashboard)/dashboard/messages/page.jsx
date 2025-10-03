"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import MessageList from "@/components/messaging/MessageList";
import ChatWindow from "@/components/messaging/ChatWindow";
import NegotiationPanel from "@/components/messaging/NegotiationPanel";
import GoogleMeetButton from "@/components/messaging/GoogleMeetButton";
import { MessageSquare, Loader2 } from "lucide-react";
import apiClient from "@/lib/api";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [userType, setUserType] = useState("student"); // Will be from auth context

  // Load conversations data from API
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);

      // Check if user is authenticated
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (!token) {
        console.log('No authentication token found');
        setConversations([]);
        return;
      }

      // Try to load meetings which can serve as conversation starters
      const meetingsResponse = await apiClient.getMeetings();

      if (meetingsResponse.success && meetingsResponse.data.meetings) {
        // Transform meetings into conversation format
        const conversationsFromMeetings = meetingsResponse.data.meetings.map(meeting => ({
          id: meeting._id,
          participant: {
            id: meeting.student._id || meeting.owner._id,
            name: meeting.student?.fullName || meeting.owner?.fullName || 'Unknown User',
            avatar: meeting.student?.profilePhoto || meeting.owner?.profilePhoto || '/default-avatar.png',
            type: userType === 'student' ? 'owner' : 'student',
            isOnline: false,
            lastSeen: new Date(meeting.updatedAt)
          },
          property: {
            id: meeting.property._id,
            title: meeting.property.title,
            rent: meeting.property.price,
            location: meeting.property.location?.address || 'Location not specified',
            images: meeting.property.images || [],
            securityDeposit: meeting.property.securityDeposit || meeting.property.price
          },
          lastMessage: {
            id: `msg_${meeting._id}`,
            content: meeting.studentNotes || `Meeting scheduled for ${meeting.preferredDates?.[0] || 'TBD'}`,
            timestamp: new Date(meeting.updatedAt),
            senderId: meeting.student._id,
            type: "meeting"
          },
          unreadCount: meeting.status === 'pending' ? 1 : 0,
          isPinned: false,
          isMuted: false,
          meetingStatus: meeting.status,
          meetingData: meeting
        }));

        setConversations(conversationsFromMeetings);
      } else {
        // No meetings found - show empty state
        setConversations([]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  // Sample messages for selected conversation
  const getMessagesForConversation = (conversationId) => {
    const baseMessages = [
      {
        id: "msg_base_1",
        senderId: selectedConversation?.participant.id,
        content: "Hi! I'm interested in your room listing.",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        type: "text",
        status: "read"
      },
      {
        id: "msg_base_2",
        senderId: "me",
        content: "Great! The room is still available. Would you like to schedule a viewing?",
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        type: "text",
        status: "read"
      },
      {
        id: "msg_base_3",
        senderId: selectedConversation?.participant.id,
        content: selectedConversation?.lastMessage.content || "Looking forward to hearing from you!",
        timestamp: selectedConversation?.lastMessage.timestamp || new Date(),
        type: "text",
        status: "delivered"
      }
    ];

    // Add special message types based on conversation data
    const specialMessages = [];

    if (selectedConversation?.meeting) {
      specialMessages.push({
        id: "msg_meeting_1",
        senderId: "system",
        content: "Google Meet scheduled",
        timestamp: selectedConversation.meeting.scheduledTime,
        type: "meeting_link",
        meetingData: selectedConversation.meeting,
        status: "sent"
      });
    }

    if (selectedConversation?.negotiation) {
      specialMessages.push({
        id: "msg_negotiation_1",
        senderId: selectedConversation.participant.id,
        content: `Negotiation offer: ₹${selectedConversation.negotiation.amount.toLocaleString()}/month`,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        type: "negotiation_offer",
        negotiationData: selectedConversation.negotiation,
        status: "read"
      });
    }

    return [...baseMessages, ...specialMessages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const handleSendMessage = async (messageData) => {
    // Handle sending message - in real app, this would make API call
    console.log("Sending message:", messageData);

    // Update conversations with new message
    setConversations(prev => prev.map(conv =>
      conv.id === selectedConversation?.id
        ? {
          ...conv,
          lastMessage: {
            id: Date.now().toString(),
            content: messageData.content || "File attachment",
            timestamp: new Date(),
            senderId: "me",
            type: messageData.type || "text"
          }
        }
        : conv
    ));
  };

  const handleScheduleMeeting = async (meetingData) => {
    // Handle meeting scheduling
    console.log("Scheduling meeting:", meetingData);

    // Update conversation with meeting data
    setConversations(prev => prev.map(conv =>
      conv.id === selectedConversation?.id
        ? { ...conv, meeting: meetingData }
        : conv
    ));

    // Send meeting message
    await handleSendMessage({
      type: "meeting_link",
      content: "Google Meet scheduled",
      meetingData
    });
  };

  const handleNegotiation = async (negotiationData) => {
    // Handle negotiation offer
    console.log("Negotiation offer:", negotiationData);

    // Update conversation with negotiation data
    setConversations(prev => prev.map(conv =>
      conv.id === selectedConversation?.id
        ? { ...conv, negotiation: negotiationData }
        : conv
    ));

    // Send negotiation message
    await handleSendMessage({
      type: "negotiation_offer",
      content: `Negotiation offer: ₹${negotiationData.amount.toLocaleString()}/month`,
      negotiationData
    });

    setShowNegotiation(false);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      {/* Message List */}
      <div className="w-1/3">
        <MessageList
          conversations={conversations}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={setSelectedConversation}
          userType={userType}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col gap-4">
        {selectedConversation ? (
          <>
            {/* Negotiation Panel */}
            {showNegotiation && (
              <NegotiationPanel
                conversation={selectedConversation}
                property={selectedConversation.property}
                onSubmitOffer={handleNegotiation}
                onClose={() => setShowNegotiation(false)}
                userType={userType}
                existingNegotiation={selectedConversation.negotiation}
              />
            )}

            {/* Main Chat Window */}
            <ChatWindow
              conversation={selectedConversation}
              messages={getMessagesForConversation(selectedConversation.id)}
              onSendMessage={handleSendMessage}
              onScheduleMeeting={handleScheduleMeeting}
              onStartNegotiation={() => setShowNegotiation(true)}
              userType={userType}
            />
          </>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
