import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Search } from "lucide-react";

export default function MessagesPage() {
  const messages = [
    {
      id: 1,
      sender: "Sunshine PG",
      avatar: "/avatars/sunshine-pg.jpg",
      lastMessage: "Your visit is confirmed for tomorrow at 3 PM",
      timestamp: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      sender: "Green Valley Hostel",
      avatar: "/avatars/green-valley.jpg",
      lastMessage: "Thank you for your interest. Room is still available.",
      timestamp: "5 hours ago",
      unread: true,
    },
    {
      id: 3,
      sender: "City Center PG",
      avatar: "/avatars/city-center.jpg",
      lastMessage: "We have received your application and will review it soon.",
      timestamp: "1 day ago",
      unread: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-muted-foreground mt-2">
          Communicate with property owners and manage your inquiries
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Messages List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversations
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border rounded-md text-sm"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex items-center gap-3 p-4 hover:bg-accent cursor-pointer border-b last:border-b-0"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={message.avatar} alt={message.sender} />
                  <AvatarFallback>
                    {message.sender.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{message.sender}</p>
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{message.lastMessage}</p>
                </div>
                {message.unread && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatars/sunshine-pg.jpg" alt="Sunshine PG" />
                <AvatarFallback>SP</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Sunshine PG</CardTitle>
                <CardDescription>Active now</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-64 border rounded-md p-4 space-y-4 overflow-y-auto">
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg max-w-xs">
                  <p className="text-sm">Hello! Thank you for your interest in our PG accommodation.</p>
                  <span className="text-xs text-muted-foreground">Yesterday 2:30 PM</span>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                  <p className="text-sm">Hi! I'd like to schedule a visit to see the rooms.</p>
                  <span className="text-xs opacity-80">Yesterday 3:15 PM</span>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg max-w-xs">
                  <p className="text-sm">Perfect! Your visit is confirmed for tomorrow at 3 PM. Please bring a valid ID.</p>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border rounded-md text-sm"
              />
              <Button size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
