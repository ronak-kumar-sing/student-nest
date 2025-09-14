"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VerifyBadge } from './VerifyBadge';
import { MessageCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SharingParticipantCard({
  participant,
  showCompatibility = true,
  showMessageButton = true,
  isCurrentUser = false,
  onMessageClick,
  compact = false
}) {
  const { student, compatibilityScore, isOriginalPoster, joinedAt } = participant;

  if (!student) {
    return null;
  }

  const getCompatibilityColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
    if (score >= 60) return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      isCurrentUser && "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/10",
      compact && "border-0 shadow-none bg-gray-50/50 dark:bg-gray-800/30"
    )}>
      <CardContent className={cn("p-4", compact && "p-2")}>
        <div className={cn("flex items-start gap-3", compact && "gap-2")}>
          {/* Avatar */}
          <div className="relative">
            <Link href={`/student/profile/${student.id}`}>
              <Avatar className={cn("w-12 h-12 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all", compact && "w-8 h-8")}>
                <AvatarImage src={student.avatar} alt={student.fullName} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {student.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
            {isOriginalPoster && (
              <div className={cn("absolute -top-1 -right-1", compact && "absolute -top-0.5 -right-0.5")}>
                <Star className={cn("w-4 h-4 text-yellow-500 fill-yellow-500", compact && "w-3 h-3")} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name and badges */}
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/student/profile/${student.id}`}>
                <h3 className={cn("font-semibold text-sm truncate hover:text-blue-600 transition-colors cursor-pointer", compact && "text-xs")}>
                  {student.fullName}
                  {isCurrentUser && " (You)"}
                </h3>
              </Link>
              <VerifyBadge
                isVerified={student.isVerified}
                showText={false}
                className={cn("flex-shrink-0", compact && "w-3 h-3")}
              />
            </div>

            {!compact && (
              <>
                {/* College */}
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 truncate">
                  {student.collegeName}
                </p>

                {/* Compatibility score */}
                {showCompatibility && compatibilityScore > 0 && !isCurrentUser && (
                  <Badge
                    variant="secondary"
                    className={cn("text-xs mb-2", getCompatibilityColor(compatibilityScore))}
                  >
                    {compatibilityScore}% Compatible
                  </Badge>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {isOriginalPoster && (
                    <Badge variant="outline" className="text-xs">
                      Room Poster
                    </Badge>
                  )}
                  {isCurrentUser && (
                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      You
                    </Badge>
                  )}
                </div>

                {/* Message button */}
                {showMessageButton && !isCurrentUser && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs h-7"
                    onClick={() => onMessageClick?.(student.id)}
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Message
                  </Button>
                )}
              </>
            )}

            {compact && (
              <div className="flex items-center justify-between">
                {/* Compatibility score for compact mode */}
                {showCompatibility && compatibilityScore > 0 && !isCurrentUser && (
                  <Badge
                    variant="secondary"
                    className={cn("text-xs py-0 px-1", getCompatibilityColor(compatibilityScore))}
                  >
                    {compatibilityScore}%
                  </Badge>
                )}
                {isOriginalPoster && (
                  <Badge variant="outline" className="text-xs py-0 px-1">
                    Poster
                  </Badge>
                )}
                {isCurrentUser && (
                  <Badge variant="outline" className="text-xs py-0 px-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                    You
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Join date - only show in non-compact mode */}
        {!compact && (
          <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {isOriginalPoster ? 'Posted' : 'Joined'}: {new Date(joinedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SharingParticipantCard;