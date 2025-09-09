"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import MessageList from "@/components/messaging/MessageList";
import ChatWindow from "@/components/messaging/ChatWindow";
import NegotiationPanel from "@/components/messaging/NegotiationPanel";
import GoogleMeetButton from "@/components/messaging/GoogleMeetButton";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [userType, setUserType] = useState("student"); // Will be from auth context

  // Sample conversations data - in real app, this would come from API
  useEffect(() => {
    const sampleConversations = [
      {
        id: 1,
        participant: {
          id: "user_1",
          name: "Priya Sharma",
          avatar: "/avatars/priya.jpg",
          type: "owner",
          isOnline: true,
          lastSeen: new Date()
        },
        property: {
          id: "prop_1",
          title: "2BHK Apartment near IIT Delhi",
          rent: 25000,
          location: "Hauz Khas, New Delhi",
          images: ["/properties/prop1.jpg"],
          securityDeposit: 50000
        },
        lastMessage: {
          id: "msg_1",
          content: "Is the room still available for viewing?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          senderId: "user_1",
          type: "text"
        },
        unreadCount: 2,
        isPinned: false,
        isMuted: false,
        negotiation: {
          amount: 22000,
          status: "pending",
          history: []
        },
        meeting: {
          meetingId: "meet_1",
          meetingUrl: "https://meet.google.com/abc-defg-hij",
          scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: "scheduled"
        }
      },
      {
        id: 2,
        participant: {
          id: "user_2",
          name: "Rahul Properties",
          avatar: "/avatars/rahul.jpg",
          type: "owner",
          isOnline: false,
          lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        property: {
          id: "prop_2",
          title: "Single Room in Malviya Nagar",
          rent: 18000,
          location: "Malviya Nagar, New Delhi",
          images: ["/properties/prop2.jpg"],
          securityDeposit: 36000
        },
        lastMessage: {
          id: "msg_2",
          content: "The security deposit is negotiable...",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          senderId: "user_2",
          type: "text"
        },
        unreadCount: 0,
        isPinned: true,
        isMuted: false
      },
      {
        id: 3,
        participant: {
          id: "user_3",
          name: "Sneha Gupta",
          avatar: "/avatars/sneha.jpg",
          type: "student",
          isOnline: true,
          lastSeen: new Date()
        },
        property: {
          id: "prop_3",
          title: "Studio Apartment in Lajpat Nagar",
          rent: 15000,
          location: "Lajpat Nagar, New Delhi",
          images: ["/properties/prop3.jpg"],
          securityDeposit: 30000
        },
        lastMessage: {
          id: "msg_3",
          content: "Can we schedule a video call?",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          senderId: "user_3",
          type: "text"
        },
        unreadCount: 1,
        isPinned: false,
        isMuted: false
      }
    ];

    setTimeout(() => {
      setConversations(sampleConversations);
      setLoading(false);
    }, 500);
  }, []);

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
