"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function SharedRoomsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold">Room Sharing</h1>
        <p className="text-muted-foreground mt-2">
          Find verified students to share rooms with
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Room Sharing Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Connect with compatible roommates based on lifestyle and preferences.
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
