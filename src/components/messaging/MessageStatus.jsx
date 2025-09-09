"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Check,
  CheckCheck,
  Clock,
  X,
  Eye,
  EyeOff
} from "lucide-react";

export default function MessageStatus({
  message,
  showDetailedStatus = false,
  className = ""
}) {
  const [showDetails, setShowDetails] = useState(false);

  const {
    status = "sent",
    timestamp,
    editedAt,
    deliveredAt,
    readAt,
    reactions = [],
    isEncrypted = false,
    failureReason = null
  } = message;

  // Status icon mapping
  const getStatusIcon = () => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-gray-400 animate-pulse" />;
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-500" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case "failed":
        return <X className="h-3 w-3 text-red-500" />;
      default:
        return <Clock className="h-3 w-3 text-gray-400" />;
    }
  };

  // Status text mapping
  const getStatusText = () => {
    switch (status) {
      case "sending":
        return "Sending...";
      case "sent":
        return "Sent";
      case "delivered":
        return "Delivered";
      case "read":
        return "Read";
      case "failed":
        return failureReason || "Failed to send";
      default:
        return "Unknown";
    }
  };

  // Format timestamp
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  // Detailed status tooltip content
  const getDetailedStatus = () => {
    const details = [];

    if (timestamp) {
      details.push(`Sent: ${new Date(timestamp).toLocaleString()}`);
    }

    if (deliveredAt) {
      details.push(`Delivered: ${new Date(deliveredAt).toLocaleString()}`);
    }

    if (readAt) {
      details.push(`Read: ${new Date(readAt).toLocaleString()}`);
    }

    if (editedAt) {
      details.push(`Edited: ${new Date(editedAt).toLocaleString()}`);
    }

    if (isEncrypted) {
      details.push("🔐 End-to-end encrypted");
    }

    return details.join('\n');
  };

  if (!showDetailedStatus) {
    // Simple status display
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {getStatusIcon()}
        <span className="text-xs text-muted-foreground">
          {formatTime(timestamp)}
        </span>
        {editedAt && (
          <span className="text-xs text-muted-foreground italic">
            (edited)
          </span>
        )}
      </div>
    );
  }

  // Detailed status display
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Status Icon with Tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-help">
              {getStatusIcon()}
              <span className="text-xs text-muted-foreground">
                {getStatusText()}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="whitespace-pre-line text-sm">
              {getDetailedStatus()}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Timestamp */}
      <span className="text-xs text-muted-foreground">
        {formatTime(timestamp)}
      </span>

      {/* Edited Indicator */}
      {editedAt && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs text-muted-foreground italic cursor-help">
                (edited)
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                Edited: {new Date(editedAt).toLocaleString()}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Encryption Indicator */}
      {isEncrypted && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-xs text-green-600 cursor-help">🔐</div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">End-to-end encrypted</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Reactions Count */}
      {reactions.length > 0 && (
        <div className="flex items-center gap-1">
          {reactions.slice(0, 3).map((reaction, index) => (
            <span key={index} className="text-xs">
              {reaction.emoji}
            </span>
          ))}
          {reactions.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{reactions.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Privacy Status Toggle */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showDetails ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              {showDetails ? "Hide" : "Show"} detailed status
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Extended Details */}
      {showDetails && (
        <div className="absolute right-0 top-full mt-1 p-2 bg-popover border rounded-lg shadow-lg z-10 text-xs whitespace-nowrap">
          <div className="space-y-1">
            {timestamp && (
              <div>Sent: {new Date(timestamp).toLocaleString()}</div>
            )}
            {deliveredAt && (
              <div>Delivered: {new Date(deliveredAt).toLocaleString()}</div>
            )}
            {readAt && (
              <div>Read: {new Date(readAt).toLocaleString()}</div>
            )}
            {editedAt && (
              <div>Edited: {new Date(editedAt).toLocaleString()}</div>
            )}
            {message.id && (
              <div className="text-muted-foreground border-t pt-1">
                ID: {message.id.slice(-8)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Failure Status */}
      {status === "failed" && (
        <Badge variant="destructive" className="text-xs">
          Failed
        </Badge>
      )}
    </div>
  );
}
