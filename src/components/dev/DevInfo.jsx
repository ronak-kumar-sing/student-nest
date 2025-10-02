'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ShieldCheck,
  User,
  Phone,
  Eye,
  ExternalLink,
  Copy,
  CheckCircle,
  Settings
} from 'lucide-react';
import Link from 'next/link';

export default function DevInfoComponent() {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Hide in production
  }

  const accounts = [
    {
      type: 'Admin',
      email: 'admin@studentnest.com',
      password: 'Admin@123',
      phone: '+919999999999',
      link: '/admin/login',
      icon: ShieldCheck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      type: 'Demo Owner',
      email: 'demo@owner.test',
      password: 'DemoOwner123!',
      phone: '+919999999999',
      link: '/owner/login',
      icon: User,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 border-2 border-yellow-500/20 bg-yellow-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Development Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {accounts.map((account) => (
            <div key={account.type} className={`p-3 rounded-lg border ${account.bgColor}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <account.icon className={`w-4 h-4 ${account.color}`} />
                  <Badge variant="outline" className="text-xs">
                    {account.type}
                  </Badge>
                </div>
                <Link href={account.link}>
                  <Button size="sm" variant="outline" className="h-6 text-xs">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Login
                  </Button>
                </Link>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <button
                    onClick={() => copyToClipboard(account.email, `${account.type}-email`)}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span className="font-mono">{account.email}</span>
                    {copied === `${account.type}-email` ? (
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Password:</span>
                  <button
                    onClick={() => copyToClipboard(account.password, `${account.type}-password`)}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <span className="font-mono">••••••••</span>
                    {copied === `${account.type}-password` ? (
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Alert className="border-yellow-500/20 bg-yellow-500/10">
            <Phone className="h-3 w-3 text-yellow-400" />
            <AlertDescription className="text-xs text-yellow-400">
              <div className="space-y-1">
                <p>OTP Mock Mode: Use <code className="bg-background/50 px-1 rounded">123456</code></p>
                <Link href="/test-otp" className="text-yellow-300 underline hover:no-underline">
                  Test OTP System →
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}