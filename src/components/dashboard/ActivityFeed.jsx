"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Star,
  MessageSquare,
  Calendar,
  Home,
  Users
} from "lucide-react";

// Icon mapping for string-based icon names
const iconMap = {
  Bell,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Star,
  MessageSquare,
  Calendar,
  Home,
  Users
};

export default function ActivityFeed({ activities = [] }) {
  // Default activities if none provided
  const defaultActivities = [
    {
      id: 1,
      type: "booking",
      title: "New booking request received",
      description: "Rajesh Kumar requested to book Single Room at Green Valley PG",
      time: "2 hours ago",
      icon: Calendar,
      color: "blue",
      avatar: null,
      urgent: false
    },
    {
      id: 2,
      type: "payment",
      title: "Payment received",
      description: "₹15,000 received from Priya Sharma for December rent",
      time: "3 hours ago",
      icon: DollarSign,
      color: "green",
      avatar: null,
      urgent: false
    },
    {
      id: 3,
      type: "review",
      title: "New review posted",
      description: "Amit gave 5-star rating for Sunshine PG",
      time: "5 hours ago",
      icon: Star,
      color: "yellow",
      avatar: null,
      urgent: false
    },
    {
      id: 4,
      type: "visit",
      title: "Visit request - Urgent",
      description: "Sneha wants to visit tomorrow at 2 PM",
      time: "6 hours ago",
      icon: Users,
      color: "orange",
      avatar: null,
      urgent: true
    },
    {
      id: 5,
      type: "verification",
      title: "Property verification completed",
      description: "City Center PG verification approved by admin",
      time: "1 day ago",
      icon: CheckCircle,
      color: "purple",
      avatar: null,
      urgent: false
    },
    {
      id: 6,
      type: "message",
      title: "New message",
      description: "Question about WiFi availability at Green Valley PG",
      time: "1 day ago",
      icon: MessageSquare,
      color: "blue",
      avatar: null,
      urgent: false
    }
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  const getColorClasses = (color, urgent = false) => {
    if (urgent) {
      return {
        dot: "bg-red-500",
        iconBg: "bg-red-500/10 text-red-500",
        border: "border-red-200 dark:border-red-800"
      };
    }

    const colorMap = {
      blue: {
        dot: "bg-blue-500",
        iconBg: "bg-blue-500/10 text-blue-500",
        border: "border-blue-200 dark:border-blue-800"
      },
      green: {
        dot: "bg-green-500",
        iconBg: "bg-green-500/10 text-green-500",
        border: "border-green-200 dark:border-green-800"
      },
      yellow: {
        dot: "bg-yellow-500",
        iconBg: "bg-yellow-500/10 text-yellow-500",
        border: "border-yellow-200 dark:border-yellow-800"
      },
      orange: {
        dot: "bg-orange-500",
        iconBg: "bg-orange-500/10 text-orange-500",
        border: "border-orange-200 dark:border-orange-800"
      },
      purple: {
        dot: "bg-purple-500",
        iconBg: "bg-purple-500/10 text-purple-500",
        border: "border-purple-200 dark:border-purple-800"
      }
    };

    return colorMap[color] || colorMap.blue;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </div>
        <Badge variant="secondary" className="text-xs">
          {displayActivities.filter(a => a.urgent).length} urgent
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {displayActivities.map((activity, index) => {
          // Handle both component and string icon types
          const Icon = typeof activity.icon === 'string'
            ? iconMap[activity.icon] || Bell
            : activity.icon || Bell;
          const colorClasses = getColorClasses(activity.color, activity.urgent);

          return (
            <div
              key={activity.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${colorClasses.border} bg-card hover:bg-muted/50 transition-colors cursor-pointer`}
            >
              {/* Activity Icon or Avatar */}
              <div className="flex-shrink-0">
                {activity.avatar ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback>{activity.title.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className={`p-2 rounded-full ${colorClasses.iconBg}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.title}
                  </p>
                  {activity.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${colorClasses.dot}`} />
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              </div>

              {/* Status indicator */}
              {activity.urgent && (
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              )}
            </div>
          );
        })}

        {displayActivities.length === 0 && (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your notifications will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
