"use client";

import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  /** Apply gradient effect to the logo */
  gradient?: boolean;
  /** Scale factor to crop internal padding (default: 1.3) */
  cropScale?: number;
}

/**
 * Logo component with automatic dark/light mode support.
 * - Uses brightness(0) to make all colors black, then invert for dark mode
 * - Optional gradient overlay for a more elegant look
 * - Optional scale cropping to remove internal SVG padding
 */
export function Logo({ 
  className = "", 
  width = 32, 
  height = 32,
  gradient = false,
  cropScale = 1
}: LogoProps) {
  const baseClasses = "brightness-0 dark:brightness-100 dark:invert object-contain";
  
  if (gradient) {
    return (
      <div 
        className={`relative overflow-hidden ${className}`}
        style={{ width, height }}
      >
        {/* Gradient overlay using mask */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500"
          style={{
            maskImage: `url(/logo.svg)`,
            maskSize: `${cropScale * 100}%`,
            maskPosition: 'center',
            maskRepeat: 'no-repeat',
            WebkitMaskImage: `url(/logo.svg)`,
            WebkitMaskSize: `${cropScale * 100}%`,
            WebkitMaskPosition: 'center',
            WebkitMaskRepeat: 'no-repeat',
          }}
        />
      </div>
    );
  }
  
  // Non-gradient version with optional crop
  if (cropScale !== 1) {
    return (
      <div 
        className={`relative overflow-hidden ${className}`}
        style={{ width, height }}
      >
        <Image
          src="/logo.svg"
          alt="MentorExpress Logo"
          width={width * cropScale}
          height={height * cropScale}
          className={`${baseClasses} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
          style={{ 
            width: `${cropScale * 100}%`, 
            height: `${cropScale * 100}%` 
          }}
          priority
        />
      </div>
    );
  }

  return (
    <Image
      src="/logo.svg"
      alt="MentorExpress Logo"
      width={width}
      height={height}
      className={`${baseClasses} ${className}`}
      priority
    />
  );
}
