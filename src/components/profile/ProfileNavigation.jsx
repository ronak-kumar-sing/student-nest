"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  User,
  Settings,
  Shield,
  Heart,
  Building2,
  Briefcase,
  Bell,
  Lock
} from 'lucide-react';

const ProfileNavigation = ({ userType = "student" }) => {
  const pathname = usePathname();

  const studentNavItems = [
    {
      label: "Profile",
      href: "/student/profile",
      icon: User,
      description: "Personal information and bio"
    },
    {
      label: "Preferences",
      href: "/student/profile/preferences",
      icon: Heart,
      description: "Room preferences and budget"
    },
    {
      label: "Verification",
      href: "/student/profile/verification",
      icon: Shield,
      description: "Account verification status"
    },
    {
      label: "Settings",
      href: "/student/profile/settings",
      icon: Settings,
      description: "Account and privacy settings"
    }
  ];

  const ownerNavItems = [
    {
      label: "Profile",
      href: "/owner/profile",
      icon: User,
      description: "Personal information and bio"
    },
    {
      label: "Business",
      href: "/owner/profile/business",
      icon: Briefcase,
      description: "Business details and experience"
    },
    {
      label: "Verification",
      href: "/owner/profile/verification",
      icon: Shield,
      description: "Identity verification status"
    },
    {
      label: "Settings",
      href: "/owner/profile/settings",
      icon: Settings,
      description: "Account and privacy settings"
    }
  ];

  const navItems = userType === "student" ? studentNavItems : ownerNavItems;

  const isActivePath = (href) => {
    if (href === `/${userType}/profile`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <CardContent className="p-0">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start h-auto p-4 ${isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <Icon
                      size={20}
                      className={isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}
                    />
                    <div className="text-left flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
};

export default ProfileNavigation;
