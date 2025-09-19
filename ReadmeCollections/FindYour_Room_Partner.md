# Find Your Room Partner – Student Nest Feature README

A modern, secure, and student-focused room sharing system for Student Nest, enabling students to find verified room partners, post rooms for sharing (with assessment-based matching), and connect with others—all within a seamless Next.js 15 + shadcn/ui platform.

***

## 🧭 Feature Overview

**Find Your Room Partner** is an integrated module designed for students to:
- Discover other students seeking room shares
- Post or join room shares after verification and assessment
- Chat safely with matched partners
- Benefit from assessment-based compatibility and owner-controlled limits

This feature ensures only verified students can participate, maintaining trust and safety within the platform.

***

## 🚦 User Flow

1. **Visit Room Details**
   - See options:
     - **Already in Sharing List**: Join existing sharing.
     - **Post for Sharing**: Start a new sharing if room is not already posted.
   - Posting for sharing requires:
     - Student verification (email/phone/college ID complete)
     - Completion of a quick matching assessment for compatibility

2. **Room Sharing Assessment (Before Posting)**
   - Students take a short quiz covering lifestyle, habits, preferences, etc.
   - The system stores their responses for matching compatibility with potential partners.

3. **Room Owner Controls**
   - Owner can set the *maximum number of students* allowed for sharing in each room.
   - System will not allow posting beyond this limit.

4. **Browsing Shared Rooms**
   - New sidebar menu: **Room Sharing**
   - Students can explore a dedicated page listing all rooms currently open for sharing, view participant profiles, and compatibility scores.
   - Filter by location, price, room type, and compatibility percentage.

5. **Joining a Shared Room**
   - Students must also be verified and take the assessment.
   - Join action only possible if owner’s capacity is not exceeded.
   - Connect instantly via in-app messaging with the primary sharing student.

6. **Safety and Verification**
   - Only students with verified status can post/join sharing.
   - Unverified students see prompts to complete verification.
   - Verification badge and status shown on all sharing listings & profiles.

7. **Messaging**
   - Once matched/joined, students can start a chat with each other using the built-in messaging system.
   - Protects contact info until both are matched and verified.

***

## 🏛️ Directory & Code Integration

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── shared-rooms/                 # New: Shared Rooms Listing Page
│   │   │   └── page.tsx
│   │   └── dashboard/
│   │       ├── rooms/[id]/page.tsx       # Room Details updated for sharing
│   ├── api/
│   │   ├── room-sharing/
│   │   │   ├── post/route.ts             # POST: Create sharing post
│   │   │   ├── join/route.ts             # POST: Join sharing
│   │   │   ├── list/route.ts             # GET: List all room shares
│   │   │   └── assessment/route.ts       # POST/GET: Submit/get assessment
├── components/
│   ├── room-sharing/
│   │   ├── ShareRoomButton.tsx           # "Post for Sharing"/"Already in Sharing"
│   │   ├── RoomShareAssessment.tsx       # Assessment modal (zod+react-hook-form)
│   │   ├── SharingParticipantCard.tsx    # Cards for each sharing member
│   │   ├── SharingRoomList.tsx           # Shared rooms browsing
│   │   └── VerifyBadge.tsx               # Verification indicator
│   └── ui/
│       └── ...                           # shadcn/ui components
```

## 🔑 Core Features

- **Verification Gatekeeping**
  - Only students verified by email, phone, and college ID can post or join room shares.
  - Non-verified students are prompted to verify before proceeding.

- **Room Sharing Assessment**
  - Short quiz before posting/joining.
  - Covers sleep schedule, cleanliness, food preference, hobbies, etc.
  - Used to match partners with highest compatibility.

- **Owner-Set Sharing Limit**
  - Owner specifies the sharing capacity on property listing or room edit.
  - Prevents oversubscription of shared rooms.

- **Listing & Browsing**
  - `/shared-rooms`: Lists all available sharing rooms with:
    - Room details
    - Current participants (with verification badges)
    - Compatibility % displayed for each student
    - “Join” button (if eligible)
  - Sidebar updated: Adds “Room Sharing” menu under student navigation

- **Messaging Integration**
  - Students can message other matched/joined partners directly
  - Built-in Student Nest messaging with verification check

***

## ⚡ API Contracts

- **POST** `/api/room-sharing/post`
  - Body: `{ roomId, assessmentAnswers }` (student must be verified)
  - Error if already posted or over limit
- **POST** `/api/room-sharing/join`
  - Body: `{ roomSharingId, assessmentAnswers }`
  - Error if already full, not verified, or assessment incomplete
- **GET** `/api/room-sharing/list`
  - Lists all open room sharing posts, participants, available slots
- **POST** `/api/room-sharing/assessment`
  - Submit or update assessment answers
- **GET** `/api/room-sharing/assessment`
  - Fetch student’s latest assessment (for matching compatibility)

***

## 🧑‍💻 Component Notes

- **ShareRoomButton**
  - Contextually shows “Already in Sharing List” or “Post for Sharing” with eligibility check
- **RoomShareAssessment**
  - Modal triggered when posting/joining
  - Zod validation and error feedback
- **VerifyBadge**
  - Shows on participant avatars and in sharing list
- **SharingRoomList**
  - Infinite scroll/filter for available sharing posts
  - Displays compatibility % and verification badge
- **Sidebar Navigation**
  - Under student menu: *Room Sharing* → `/shared-rooms`
  - Displays count of available rooms

***

## 🎨 UI/UX Guidelines

- Use **shadcn/ui** for all forms, buttons, badges, and dialogs
- Responsive and mobile-friendly
- Visual states for: not verified, already joined, owner capacity reached
- Assessment should be clear, quick (~60 seconds), and actionable

***

## 🔒 Security & Validation

- Only allow verified students to post/join
- Owner’s max sharing limit strictly enforced
- No access to participant contacts before matching & verification
- All assessment answers and matches handled server-side for integrity

***

## 🚀 Quick Start

1. **Sidebar Integration**
   - Import and add new menu item:
     ```js
     { path: '/shared-rooms', label: 'Room Sharing' }
     ```
2. **Room Details Integration**
   - Import `ShareRoomButton` in `rooms/[id]/page.tsx`
   - Conditionally render button/actions based on sharing/post/checks, with verification checks
3. **Assessment Integration**
   - Use `RoomShareAssessment` modal in both post and join flows
4. **Room Sharing Listing**
   - `/shared-rooms` page: Displays all available rooms and joining controls

***

## 📝 Example Usage

- Student visits a room, clicks "Post for Sharing," completes assessment, and the post appears in the shared rooms list.
- Another student, browsing `/shared-rooms`, sees compatible matches, clicks “Join,” takes assessment, and is added if all checks pass.
- Both students see each other's verification and can message directly within the Student Nest app.

***

## 📌 Best Practices

- Always validate that a student is verified before allowing sharing actions
- Use zod/react-hook-form for assessment and error handling
- Show success/error toasts for all operations (via shadcn/ui Sonner)
- Protect room sharing integrity—never show private info unless both parties are verified and accepted

***

## 📄 LICENSE

MIT. Incorporate or reference any licenses from shared shadcn/ui/JS utility snippets as needed.
