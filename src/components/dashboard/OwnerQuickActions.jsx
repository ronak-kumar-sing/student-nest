"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar,
  TrendingUp,
  MessageSquare,
  Settings,
  FileText,
  Users,
  DollarSign,
  BarChart3
} from "lucide-react";
import Link from "next/link";

export default function OwnerQuickActions({ stats = {} }) {
  const {
    pendingVisits = 0,
    unreadMessages = 0,
    pendingBookings = 0
  } = stats;

  const quickActions = [
    {
      title: "Post New Property",
      description: "List a new room or PG space",
      icon: Plus,
      href: "/dashboard/post-room",
      variant: "default",
      className: "bg-primary text-primary-foreground hover:bg-primary/90"
    },
    {
      title: "Manage Bookings",
      description: "Review and approve bookings",
      icon: Calendar,
      href: "/owner/visits",
      variant: "outline",
      badge: pendingBookings > 0 ? pendingBookings : null,
      badgeVariant: "destructive"
    },
    {
      title: "Visit Requests",
      description: "Handle property visit requests",
      icon: Users,
      href: "/owner/visits",
      variant: "outline",
      badge: pendingVisits > 0 ? pendingVisits : null,
      badgeVariant: "secondary"
    },
    {
      title: "Messages",
      description: "Respond to inquiries",
      icon: MessageSquare,
      href: "/dashboard/messages",
      variant: "outline",
      badge: unreadMessages > 0 ? unreadMessages : null,
      badgeVariant: "default"
    },
    {
      title: "Analytics",
      description: "View performance insights",
      icon: BarChart3,
      href: "/owner/analytics",
      variant: "outline"
    },
    {
      title: "Payments",
      description: "Track revenue and payouts",
      icon: DollarSign,
      href: "/owner/payments",
      variant: "outline"
    }
  ];

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Settings className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;

          return (
            <Link key={index} href={action.href} className="block">
              <Button
                variant={action.variant}
                className={`w-full justify-start h-auto p-4 ${action.className || 'border-border hover:bg-muted'}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium text-sm">
                        {action.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </div>
                  {action.badge && (
                    <Badge variant={action.badgeVariant} className="ml-2">
                      {action.badge}
                    </Badge>
                  )}
                </div>
              </Button>
            </Link>
          );
        })}

        {/* Additional Management Actions */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Management</h4>
          <div className="space-y-2">
            <Link href="/owner/profile" className="block">
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Settings className="h-4 w-4 mr-2" />
                Profile Settings
              </Button>
            </Link>
            <Link href="/owner/reports" className="block">
              <Button variant="ghost" className="w-full justify-start text-sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
