"use client";

import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Logo component with automatic dark/light mode support.
 * Uses brightness(0) to make all colors black, then invert for dark mode.
 * This ensures the logo matches the text color in both themes.
 */
export function Logo({ className = "", width = 32, height = 32 }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="MentorExpress Logo"
      width={width}
      height={height}
      className={`brightness-0 dark:invert object-contain ${className}`}
      priority
    />
  );
}
