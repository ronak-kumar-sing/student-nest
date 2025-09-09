"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Paperclip,
  Smile,
  Image as ImageIcon,
  Video,
  DollarSign,
  Plus,
  X,
  Loader2
} from "lucide-react";

export default function MessageInput({
  onSendMessage,
  onStartTyping,
  onStopTyping,
  disabled = false,
  placeholder = "Type your message...",
  userType = "student",
  conversationId
}) {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);

    // Handle typing indicators
    if (value && !typingTimeoutRef.current) {
      onStartTyping?.();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping?.();
      typingTimeoutRef.current = null;
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if ((!message.trim() && attachments.length === 0) || disabled) return;

    const messageData = {
      type: attachments.length > 0 ? 'file' : 'text',
      content: message.trim(),
      attachments: attachments
    };

    // Send message
    await onSendMessage(messageData);

    // Clear input
    setMessage("");
    setAttachments([]);
    onStopTyping?.();
  };

  const handleFileUpload = async (files) => {
    if (files.length === 0) return;

    setIsUploading(true);
    const newAttachments = [];

    for (let file of files) {
      try {
        // Create preview for images
        const fileData = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          file: file
        };

        // Create preview URL for images
        if (file.type.startsWith('image/')) {
          fileData.preview = URL.createObjectURL(file);
        }

        newAttachments.push(fileData);
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }

    setAttachments(prev => [...prev, ...newAttachments]);
    setIsUploading(false);
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => {
      const updated = prev.filter(att => att.id !== attachmentId);
      // Revoke preview URLs to prevent memory leaks
      const removed = prev.find(att => att.id === attachmentId);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  const quickActions = userType === "student" ? [
    { label: "Ask about amenities", icon: Plus, action: () => setMessage("Can you tell me more about the amenities available?") },
    { label: "Request virtual tour", icon: Video, action: () => setMessage("Would it be possible to schedule a virtual tour?") },
    { label: "Negotiate price", icon: DollarSign, action: () => onSendMessage({ type: 'start_negotiation' }) },
    { label: "Schedule visit", icon: Plus, action: () => setMessage("I'd like to schedule a visit. When would be convenient?") }
  ] : [
    { label: "Send property details", icon: Plus, action: () => setMessage("Here are the detailed property specifications and amenities.") },
    { label: "Schedule viewing", icon: Plus, action: () => setMessage("Would you like to schedule a property viewing? I have availability this week.") },
    { label: "Send lease terms", icon: Plus, action: () => setMessage("Here are the lease terms and rental agreement details.") },
    { label: "Offer virtual tour", icon: Video, action: () => setMessage("I can arrange a virtual tour if you'd like to see the property remotely.") }
  ];

  return (
    <div className="space-y-3">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-lg">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="relative group">
              {attachment.type.startsWith('image/') ? (
                <div className="relative">
                  <img
                    src={attachment.preview}
                    alt={attachment.name}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-background border rounded">
                  <div className="text-xs">📄</div>
                  <span className="text-xs truncate max-w-20">{attachment.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4"
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="grid grid-cols-2 gap-2 p-3 bg-muted/50 rounded-lg">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="justify-start h-auto p-2 text-xs"
                onClick={() => {
                  action.action();
                  setShowQuickActions(false);
                }}
              >
                <Icon className="h-3 w-3 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-end gap-2">
        {/* Quick Actions Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="mb-1"
          onClick={() => setShowQuickActions(!showQuickActions)}
          disabled={disabled}
        >
          <Plus className={`h-4 w-4 transition-transform ${showQuickActions ? 'rotate-45' : ''}`} />
        </Button>

        {/* File Upload */}
        <Button
          variant="ghost"
          size="icon"
          className="mb-1"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Paperclip className="h-4 w-4" />
          )}
        </Button>

        {/* Message Textarea */}
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? "This conversation is archived" : placeholder}
            disabled={disabled}
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={(!message.trim() && attachments.length === 0) || disabled}
          size="icon"
          className="mb-1"
        >
          <Send className="h-4 w-4" />
        </Button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
          onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
          className="hidden"
        />
      </div>

      {/* Character count for long messages */}
      {message.length > 500 && (
        <div className="text-xs text-muted-foreground text-right">
          {message.length}/1000
        </div>
      )}
    </div>
  );
}
