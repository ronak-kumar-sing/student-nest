import {
  Home,
  Settings,
  CalendarClock,
  MessagesSquare,
  Bookmark,
  Plus,
  CreditCard,
  User,
  Building,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Visiting Schedule", href: "/dashboard/visiting-schedule", icon: CalendarClock, roles: ["student"] },
  { label: "Visit Requests", href: "/owner/visits", icon: CalendarClock, roles: ["owner"] },
  { label: "Messages", href: "/dashboard/messages", icon: MessagesSquare },
  { label: "Saved", href: "/dashboard/saved", icon: Bookmark, roles: ["student"] },
  { label: "Post Room", href: "/dashboard/post-room", icon: Plus, roles: ["owner"] },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard, roles: ["owner"] },
  { label: "Student Profile", href: "/student/profile", icon: User, roles: ["student"] },
  { label: "Owner Profile", href: "/owner/profile", icon: Building, roles: ["owner"] },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];
