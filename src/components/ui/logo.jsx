"use client";

import React from 'react';
import Image from 'next/image';

export function StudentNestLogo({ className = "", showText = true, textClassName = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo */}
      <div className="w-10 h-10 relative">
        <Image
          src="/logo.png"
          alt="StudentNest Logo"
          width={40}
          height={40}
          className="w-10 h-10 rounded-xl"
          priority
        />
      </div>

      {/* Text */}
      {showText && (
        <span className={`text-2xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent ${textClassName}`}>
          StudentNest
        </span>
      )}
    </div>
  );
}

export function StudentNestLogoIcon({ className = "w-10 h-10" }) {
  return (
    <div className="relative">
      <Image
        src="/logo.png"
        alt="StudentNest Logo"
        width={40}
        height={40}
        className={`${className} rounded-xl`}
        priority
      />
    </div>
  );
}

export default StudentNestLogo;
