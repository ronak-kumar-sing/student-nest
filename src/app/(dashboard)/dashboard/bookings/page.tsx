"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, MessageSquare, Building } from "lucide-react";

export default function StudentBookingsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your property bookings
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Booking Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your booking history and active reservations will appear here.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This feature is under development. Check back soon!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
