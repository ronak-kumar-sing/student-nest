"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  MessageSquare,
  Phone,
  Video,
  MoreVertical,
  Filter,
  Archive,
  Star
} from "lucide-react";

export default function MessageList({
  conversations = [],
  selectedConversation,
  onSelectConversation,
  userType = "student"
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, unread, archived

  // Filter conversations based on search and filter
  const filteredConversations = conversations.filter(conv => {
    const participantName = conv.participant?.name || "";
    const lastMessageContent = conv.lastMessage?.content || "";
    const propertyTitle = conv.property?.title || "";

    const matchesSearch = participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastMessageContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      propertyTitle.toLowerCase().includes(searchTerm.toLowerCase());

    switch (filter) {
      case "unread":
        return matchesSearch && conv.unreadCount > 0;
      case "archived":
        return matchesSearch && conv.archived;
      default:
        return matchesSearch && !conv.archived;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
          >
            Unread
          </Button>
          <Button
            variant={filter === "archived" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("archived")}
          >
            Archived
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {searchTerm ? "No conversations found" : "No messages yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {userType === "student"
                  ? "Start browsing properties to connect with owners"
                  : "Messages from students will appear here"
                }
              </p>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors ${selectedConversation?.id === conversation.id ? "bg-muted" : ""
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.participant?.avatar} />
                      <AvatarFallback>
                        {conversation.participant?.name?.split(' ').map(n => n[0]).join('') || '?'}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online status indicator */}
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(conversation.participant?.isOnline ? 'online' : 'offline')}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground truncate">
                          {conversation.participant?.name || 'Unknown'}
                        </p>
                        {conversation.participant?.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                        {conversation.isPinned && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatLastMessageTime(conversation.lastMessage?.timestamp)}
                      </span>
                    </div>

                    {/* Property context for student */}
                    {userType === "student" && conversation.property?.title && (
                      <p className="text-xs text-muted-foreground mb-1">
                        Re: {conversation.property.title}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate flex-1">
                        {conversation.lastMessage?.type === "file" && "📎 "}
                        {conversation.lastMessage?.type === "meeting_link" && "📹 "}
                        {conversation.lastMessage?.type === "negotiation_offer" && "💰 "}
                        {conversation.lastMessage?.content || 'No messages'}
                      </p>

                      <div className="flex items-center gap-2 ml-2">
                        {conversation.unreadCount > 0 && (
                          <Badge variant="default" className="text-xs min-w-[20px] h-5">
                            {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                          </Badge>
                        )}
                        {conversation.negotiation && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        )}
                        {conversation.meeting && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
