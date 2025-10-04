"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function OwnerBookingsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold">Bookings Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage property bookings from students
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Booking Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Manage booking requests and reservations for your properties.
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
