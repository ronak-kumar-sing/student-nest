'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, X, AlertTriangle } from 'lucide-react';

export default function LoginFixNotice() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md">
      <Alert className="border-green-500/20 bg-green-500/10">
        <CheckCircle className="h-4 w-4 text-green-400" />
        <AlertDescription className="text-green-400">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="font-semibold">🎉 Login Fixed!</p>
              <p className="text-sm mt-1">
                The login error has been resolved. API now correctly handles user authentication across all collections.
              </p>
              <div className="mt-2 text-xs">
                <p>✅ Fixed: Cannot read properties of undefined (reading 'role')</p>
                <p>✅ Fixed: API response structure handling</p>
                <p>✅ Fixed: Cross-collection user lookup</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
