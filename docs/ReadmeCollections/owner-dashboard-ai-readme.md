# Student Nest – Room Owner Dashboard AI Agent Guide

A blueprint for building a modern, user-friendly dashboard for Room Owners, using [shadcn/ui](https://ui.shadcn.com/) component library. This guide is designed for AI agents (and developers) to deliver fast, accessible, and insightful management tools integrated with actionable analytics, messaging, and booking management—ensuring every essential workflow is covered.

---

## 🎯 Purpose

Deliver an exceptional owner dashboard experience—insightful analytics, reservation management, notifications, and property controls—using accessible, production-quality UI from shadcn/ui.


## 🚀 Core Dashboard Features

### 1. Owner-Centric Quick Stats
- **Active Listings**: Count (and booking status) of rooms/PG spaces
- **Revenue**: Current month, trends vs previous period
- **Pending Visits**: Total property visits requested this week
- **Messages**: Unread and total messages (including booking inquiries)

### 2. Activity Feed
- Recent notifications: Bookings, payments received, reviews, verifications, or property status changes
- Color-coded event markers (success, info, warning)

### 3. Quick Actions
- Post New Property / Room
- Manage Bookings (approve/decline/reschedule)
- View Analytics

### 4. Navigation (Sidebar)
- Home (Dashboard)
- Visit Requests
- Messages
- Post Room
- Payments
- Owner Profile
- Settings
- Sign out


## 🧩 UI Components & Layout
- Use shadcn/ui for every interactive component and container
- **Cards**: For stats and quick actions (use `<Card>`, `<CardContent>`, `<CardTitle>`, `<CardDescription>`)
- **List**: For recent activity feed `<List>`, `<ListItem>`
- **Button**: For all main CTAs (add, manage, view, etc.). Use loading states and intent coloring
- **Badge**: For booking status, verification, or alerts
- **Avatar**: User profile in sidebar and messages (use `<Avatar>`) 
- **Table**: For bookings/payments/history
- **Dialog/Sheet**: Post property, manage booking, quick-edit profile
- **Toast**: Notifications (real-time feedback)
- **Sidebar**: Sticky navigation, collapsible for mobile
- **Responsive Grid**: shadcn/ui’s layout primitives for adaptive arrangement
- **Theme Toggle**: Built-in support for light/dark theme


## 🛠️ Technical Details

### Frameworks & Tools
- **Next.js 15** (App Router)
- **TypeScript** everywhere (for type safety)
- **shadcn/ui** for UI components ([Documentation](https://ui.shadcn.com/))
- **Tailwind CSS** for design tokens and utility classes
- **React Hook Form + Zod** for robust input validation (profile, listings, booking forms)
- **State Management**: Use context or libraries (e.g. Zustand) if necessary for cross-component state
- **API Integration**: React Query (or SWR) for owner data, bookings, payments, and notification fetches
- **Accessibility**: ARIA, keyboard support, color contrast from shadcn/ui


## 🏗 Dashboard Structure Example

```
src/
├── app/
│   └── owner/
│       ├── dashboard/
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── bookings/
│       ├── analytics/
│       └── profile/
├── components/
│   ├── dashboard/
│   │   ├── OwnerStatsCards.tsx     # Revenue, Listings, Pending, Messages
│   │   ├── ActivityFeed.tsx
│   │   ├── OwnerQuickActions.tsx
│   │   └── SidebarNav.tsx
│   ├── bookings/
│   ├── analytics/
│   ├── profile/
│   └── ui/                        # shadcn/ui components
└── lib/
    └── api.js                     # API calls for dashboard data
```


## 🔥 Implementation Tips
- **Mobile first**: Use responsive grids and `<Sheet>` for sidebar/drawer UX
- **All states covered**: Loading, empty, error, and success for all widgets
- **Accessible color tokens**: Use `bg-card`, `text-muted-foreground` etc. for light/dark readiness
- **Prop drilling vs context**: For dashboard-wide notifications use context or a hook pattern
- **Dashboard extends**: Add analytics, payout history, performance charts in future


## 🌟 User Experience Practices
- Accessible real-time feedback (badges, toasts, live updates)
- Documentation/tooltips in key areas for new features
- Group related actions (e.g., manage all bookings in one place)
- Show new messages and reviews as activity badges in real-time
- Use consistent iconography – shadcn/ui `lucide-react` icons


## 📈 Analytics & Insights
- Property-wise booking/occupancy rates
- Revenue trends (bar/line charts: e.g., recharts integration inside shadcn `<Card>`)
- Best-performing listings
- Conversion rates (requests to confirmed bookings)


## 📚 Further Reading
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Example dashboard UI](https://ui.shadcn.com/examples/dashboard)
- Shadcn's [card](https://ui.shadcn.com/docs/components/card), [navigation](https://ui.shadcn.com/docs/components/navigation-menu), [avatar](https://ui.shadcn.com/docs/components/avatar), and [badge](https://ui.shadcn.com/docs/components/badge) for usage


## 🏁 Conclusion

AI agents using this guide can automate/extend the Room Owner dashboard by leveraging the full power of shadcn/ui, ensuring every metric, action, and notification is both discoverable and actionable for a modern, productive experience.