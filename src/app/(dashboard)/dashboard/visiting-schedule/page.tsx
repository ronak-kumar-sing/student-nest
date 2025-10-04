"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

export default function VisitingSchedulePage() {
  return (
    <div className="space-y-6">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold">Visiting Schedule</h1>
        <p className="text-muted-foreground mt-2">
          Manage your property visit appointments
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Scheduled Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your scheduled property visits will appear here.
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
