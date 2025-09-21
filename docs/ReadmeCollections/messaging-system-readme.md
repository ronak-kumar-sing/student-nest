# Student Nest - Messaging System

A comprehensive messaging platform for Students and Room Owners with integrated Google Meet scheduling, negotiation workflows, and real-time communication using [shadcn/ui](https://ui.shadcn.com/) components.

## 🚀 Core Messaging Features

### Universal Chat Features
- **Real-time Messaging**: Instant communication between students and owners
- **Message Status**: Delivered, read receipts with visual indicators
- **File Sharing**: Images, documents, property photos with drag-and-drop
- **Message History**: Complete conversation archive with search functionality
- **Typing Indicators**: Live typing status for active conversations

### Google Meet Integration
- **Instant Meeting Creation**: Owner can generate Google Meet links directly in chat
- **Meeting Notifications**: Automatic calendar invites sent to both parties
- **Pre-meeting Reminders**: Automated reminders 15 minutes before scheduled meetings
- **Meeting History**: Track all scheduled and completed virtual meetings

### Negotiation Workflow
- **Price Negotiation**: Structured negotiation with offer/counter-offer system
- **Terms Discussion**: Negotiate lease terms, deposit amounts, move-in dates
- **Negotiation Status**: Visual indicators for pending, accepted, rejected offers
- **Agreement Summary**: Auto-generated summary of agreed terms

### Smart Features
- **Property Context**: Chat automatically shows relevant property details
- **Quick Responses**: Pre-defined responses for common questions
- **Language Translation**: Built-in translation for multilingual communication
- **Message Templates**: Saved templates for frequently asked questions

## 📁 Messaging Structure

```
src/
├── app/
│   ├── (dashboard)/
│   │   ├── student/
│   │   │   └── messages/
│   │   │       ├── page.tsx                    # Message list/inbox
│   │   │       └── [conversationId]/
│   │   │           └── page.tsx                # Individual chat
│   │   └── owner/
│   │       └── messages/
│   │           ├── page.tsx                    # Message list/inbox
│   │           └── [conversationId]/
│   │               └── page.tsx                # Individual chat
│   └── api/
│       ├── messages/
│       │   ├── route.ts                        # Get/Send messages
│       │   ├── [conversationId]/route.ts       # Conversation management
│       │   ├── negotiations/route.ts           # Negotiation handling
│       │   └── meet/
│       │       └── generate/route.ts           # Google Meet link generation
│       └── notifications/
│           └── messages/route.ts               # Message notifications
├── components/
│   ├── messaging/
│   │   ├── MessageList.tsx                     # Chat conversation list
│   │   ├── ChatWindow.tsx                      # Main chat interface
│   │   ├── MessageBubble.tsx                   # Individual message component
│   │   ├── MessageInput.tsx                    # Message composition
│   │   ├── FileUpload.tsx                      # File sharing component
│   │   ├── GoogleMeetButton.tsx                # Meet link generation
│   │   ├── NegotiationPanel.tsx                # Negotiation interface
│   │   ├── PropertyCard.tsx                    # Property context card
│   │   └── MessageStatus.tsx                   # Read/delivery status
│   ├── negotiations/
│   │   ├── NegotiationOffer.tsx                # Offer/counter-offer form
│   │   ├── NegotiationHistory.tsx              # Negotiation timeline
│   │   └── AgreementSummary.tsx                # Final agreement display
│   └── ui/                                     # shadcn/ui components
└── lib/
    ├── messaging/
    │   ├── messageApi.ts                       # Message API functions
    │   ├── googlemeet.ts                       # Google Meet integration
    │   └── negotiations.ts                     # Negotiation logic
    └── hooks/
        ├── useMessages.ts                      # Message management hook
        ├── useNegotiations.ts                  # Negotiation state hook
        └── useGoogleMeet.ts                    # Meet integration hook
```

## 🧩 shadcn/ui Components Integration

### Core Messaging Components
```tsx
// Main chat interface using shadcn/ui
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Toast } from "@/components/ui/toast"
```

### Message List Component
```tsx
const MessageList = () => (
  <Card className="h-full">
    <CardHeader>
      <h2 className="text-lg font-semibold">Messages</h2>
    </CardHeader>
    <CardContent className="p-0">
      <ScrollArea className="h-[600px]">
        {conversations.map(conversation => (
          <div key={conversation.id} className="p-4 border-b hover:bg-muted/50">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={conversation.avatar} />
                <AvatarFallback>{conversation.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">{conversation.name}</p>
                  <Badge variant={conversation.unread ? "default" : "secondary"}>
                    {conversation.unread || ""}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </CardContent>
  </Card>
);
```

## 🎮 Core Features Implementation

### 1. Google Meet Integration
```tsx
const GoogleMeetButton = ({ conversationId, onMeetingScheduled }) => {
  const handleGenerateMeet = async () => {
    try {
      const response = await fetch('/api/messages/meet/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          scheduledTime: selectedDateTime,
          participants: [studentEmail, ownerEmail]
        })
      });
      
      const { meetLink, calendarInvite } = await response.json();
      
      // Send meet link as message
      await sendMessage({
        type: 'meeting_link',
        content: `Meeting scheduled: ${meetLink}`,
        meetingData: { link: meetLink, time: selectedDateTime }
      });
      
      toast({ title: "Meeting scheduled!", description: "Google Meet link sent to both parties" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to schedule meeting", variant: "destructive" });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <VideoIcon className="w-4 h-4 mr-2" />
          Schedule Meet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Schedule Online Meeting</h3>
          <DateTimePicker onSelect={setSelectedDateTime} />
          <Button onClick={handleGenerateMeet} className="w-full">
            Generate Google Meet Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

### 2. Negotiation Panel
```tsx
const NegotiationPanel = ({ propertyId, conversationId }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Price Negotiation</h3>
          <Badge variant={negotiationStatus === 'active' ? 'default' : 'secondary'}>
            {negotiationStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Original Price:</span>
            <span className="font-semibold">₹{originalPrice}/month</span>
          </div>
          
          {currentOffer && (
            <div className="flex items-center justify-between">
              <span>Current Offer:</span>
              <span className="font-semibold text-blue-600">₹{currentOffer}/month</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Enter your offer"
              value={newOffer}
              onChange={(e) => setNewOffer(e.target.value)}
            />
            <Button onClick={handleSubmitOffer}>
              {userType === 'student' ? 'Make Offer' : 'Counter Offer'}
            </Button>
          </div>
          
          {userType === 'owner' && (
            <Button variant="outline" onClick={handleAcceptOffer} className="w-full">
              Accept Current Offer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
```

### 3. Message Bubble with Special Types
```tsx
const MessageBubble = ({ message, isOwn }) => {
  const renderMessageContent = () => {
    switch (message.type) {
      case 'meeting_link':
        return (
          <div className="space-y-2">
            <p>{message.content}</p>
            <Button size="sm" onClick={() => window.open(message.meetingData.link)}>
              Join Meeting
            </Button>
          </div>
        );
        
      case 'negotiation_offer':
        return (
          <div className="space-y-2">
            <p className="font-semibold">Price Negotiation</p>
            <p>Offered: ₹{message.negotiationData.amount}/month</p>
            {!isOwn && (
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => acceptOffer(message.id)}>Accept</Button>
                <Button size="sm" variant="outline" onClick={() => counterOffer(message.id)}>
                  Counter
                </Button>
              </div>
            )}
          </div>
        );
        
      case 'file':
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileIcon className="w-4 h-4" />
              <span className="text-sm">{message.fileName}</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => downloadFile(message.fileUrl)}>
              Download
            </Button>
          </div>
        );
        
      default:
        return <p>{message.content}</p>;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] p-3 rounded-lg ${
        isOwn 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
      }`}>
        {renderMessageContent()}
        <div className="flex items-center justify-between mt-2 text-xs opacity-70">
          <span>{formatTime(message.createdAt)}</span>
          {isOwn && (
            <span className="flex items-center space-x-1">
              {message.status === 'read' ? (
                <CheckCheck className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
```

## 🔄 Real-time Updates

### WebSocket Integration
```tsx
const useRealtimeMessages = (conversationId) => {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3001/messages/${conversationId}`);
    
    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages(prev => [...prev, newMessage]);
      
      // Show toast for new messages
      if (newMessage.senderId !== currentUserId) {
        toast({
          title: `New message from ${newMessage.senderName}`,
          description: newMessage.content.substring(0, 50) + '...'
        });
      }
    };
    
    return () => ws.close();
  }, [conversationId]);
  
  return messages;
};
```

## 🛠️ API Endpoints

### Message Management
```typescript
// Send message
POST /api/messages
Body: {
  conversationId: string,
  content: string,
  type: 'text' | 'file' | 'meeting_link' | 'negotiation_offer',
  metadata?: object
}

// Get conversation messages
GET /api/messages/[conversationId]
Query: { page: number, limit: number }

// Mark messages as read
PUT /api/messages/[conversationId]/read
Body: { messageIds: string[] }

// Generate Google Meet link
POST /api/messages/meet/generate
Body: {
  conversationId: string,
  scheduledTime: string,
  participants: string[]
}

// Submit negotiation offer
POST /api/messages/negotiations
Body: {
  conversationId: string,
  propertyId: string,
  offerAmount: number,
  terms?: string
}
```

## 📱 Mobile-First Design

### Responsive Chat Interface
```tsx
const ResponsiveChatLayout = () => (
  <div className="flex h-screen">
    {/* Desktop: Side-by-side layout */}
    <div className="hidden md:flex md:w-1/3 border-r">
      <MessageList />
    </div>
    
    {/* Mobile: Sheet for message list */}
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline" size="icon">
          <MessageSquare className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full">
        <MessageList />
      </SheetContent>
    </Sheet>
    
    {/* Chat window - full width on mobile, 2/3 on desktop */}
    <div className="flex-1 flex flex-col">
      <ChatWindow />
    </div>
  </div>
);
```

## 🔒 Security & Privacy Features

### Message Encryption
- End-to-end encryption for sensitive conversations
- Secure file upload with virus scanning
- Message retention policies (auto-delete after lease completion)
- Report/block functionality with admin review

### Privacy Controls
```tsx
const PrivacySettings = () => (
  <Card>
    <CardHeader>
      <h3 className="font-semibold">Message Privacy</h3>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Read receipts</Label>
        <Switch checked={readReceipts} onCheckedChange={setReadReceipts} />
      </div>
      <div className="flex items-center justify-between">
        <Label>Online status</Label>
        <Switch checked={onlineStatus} onCheckedChange={setOnlineStatus} />
      </div>
      <div className="flex items-center justify-between">
        <Label>Message notifications</Label>
        <Switch checked={notifications} onCheckedChange={setNotifications} />
      </div>
    </CardContent>
  </Card>
);
```

## 🎯 Student-Specific Features

### Smart Assistance
- **Property Comparison**: Compare multiple properties in chat
- **Budget Calculator**: Built-in affordability calculator
- **Documentation Checklist**: Required documents for lease
- **Moving Timeline**: Step-by-step moving guide

### Quick Actions for Students
```tsx
const StudentQuickActions = () => (
  <div className="flex space-x-2 p-3 border-t">
    <Button size="sm" variant="outline">Ask about amenities</Button>
    <Button size="sm" variant="outline">Request virtual tour</Button>
    <Button size="sm" variant="outline">Negotiate price</Button>
    <Button size="sm" variant="outline">Schedule visit</Button>
  </div>
);
```

## 🏢 Owner-Specific Features

### Business Tools
- **Bulk Messaging**: Send updates to multiple tenants
- **Automated Responses**: AI-powered responses to common questions
- **Lead Scoring**: Prioritize serious inquiries
- **Property Showcase**: Interactive property tours in chat

### Quick Actions for Owners
```tsx
const OwnerQuickActions = () => (
  <div className="flex space-x-2 p-3 border-t">
    <Button size="sm" variant="outline">Send property details</Button>
    <Button size="sm" variant="outline">Schedule viewing</Button>
    <Button size="sm" variant="outline">Generate meet link</Button>
    <Button size="sm" variant="outline">Send lease terms</Button>
  </div>
);
```

## 📊 Analytics & Insights

### Message Analytics
- Response time tracking
- Conversation conversion rates
- Popular inquiry topics
- Peak messaging hours

### Performance Metrics
```tsx
const MessageAnalytics = () => (
  <Card>
    <CardHeader>
      <h3 className="font-semibold">Message Performance</h3>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Avg. Response Time</p>
          <p className="text-2xl font-bold">2.5 hours</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Conversion Rate</p>
          <p className="text-2xl font-bold">34%</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
```

## 🚀 Advanced Features

### AI-Powered Assistance
- **Smart Replies**: Suggested responses based on context
- **Language Translation**: Real-time message translation
- **Sentiment Analysis**: Detect frustrated users for priority support
- **Content Moderation**: Automatic filtering of inappropriate content

### Integration Capabilities
- **Calendar Sync**: Automatic meeting scheduling
- **Document Sharing**: Lease agreements, ID verification
- **Payment Links**: Direct payment integration in chat
- **Property Updates**: Automated notifications for price/availability changes

This comprehensive messaging system ensures seamless communication between students and property owners while providing powerful tools for negotiation, scheduling, and relationship building within the Student Nest platform.