"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function VerifyBadge({ isVerified, className = "", showIcon = true, showText = true }) {
  if (isVerified) {
    return (
      <Badge
        variant="secondary"
        className={cn("bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800", className)}
      >
        {showIcon && <CheckCircle className="w-3 h-3 mr-1" />}
        {showText && "Verified"}
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={cn("bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800", className)}
    >
      {showIcon && <AlertCircle className="w-3 h-3 mr-1" />}
      {showText && "Unverified"}
    </Badge>
  );
}

export default VerifyBadge;