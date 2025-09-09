## Error Type
Build Error

## Error Message
  × The "use client" directive must be placed before other expressions. Move it to the top of the file to resolve this issue.

## Build Output
./src/app/(dashboard)/dashboard/messages/page.jsx
Error:   × The "use client" directive must be placed before other expressions. Move it to the top of the file to resolve this issue.
    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/(dashboard)/dashboard/messages/page.jsx:7:1]
  4 │ import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  5 │ import { MessageSquare, Send, Search } from "lucide-react";
  6 │
  7 │ "use client";
    · ─────────────
  8 │
  9 │ import { useState, useEffect } from "react";
 10 │ import { Card } from "@/components/ui/card";
    ╰────
  × You're importing a component that needs `useState`. This React Hook only works in a Client Component. To fix, mark the file (or its parent) with the `"use client"` directive.
  │
  │  Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client
  │

    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/(dashboard)/dashboard/messages/page.jsx:9:1]
  6 │
  7 │ "use client";
  8 │
  9 │ import { useState, useEffect } from "react";
    ·          ────────
 10 │ import { Card } from "@/components/ui/card";
 11 │ import MessageList from "@/components/messaging/MessageList";
 12 │ import ChatWindow from "@/components/messaging/ChatWindow";
    ╰────
  × You're importing a component that needs `useEffect`. This React Hook only works in a Client Component. To fix, mark the file (or its parent) with the `"use client"` directive.
  │
  │  Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client
  │

    ╭─[/Users/ronakkumarsingh/Desktop/student-nest/src/app/(dashboard)/dashboard/messages/page.jsx:9:1]
  6 │
  7 │ "use client";
  8 │
  9 │ import { useState, useEffect } from "react";
    ·                    ─────────
 10 │ import { Card } from "@/components/ui/card";
 11 │ import MessageList from "@/components/messaging/MessageList";
 12 │ import ChatWindow from "@/components/messaging/ChatWindow";
    ╰────

Next.js version: 15.5.2 (Webpack)


