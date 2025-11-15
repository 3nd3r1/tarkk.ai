"use client"

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 24 }: LogoProps) {
  const { theme } = useTheme();
  const isMatrix = theme === "matrix";
  const strokeColor = isMatrix ? "#00ff00" : "currentColor";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-all duration-300", className)}
    >
      {/* Glow effect for matrix theme */}
      {isMatrix && (
        <defs>
          <filter id="matrixGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      )}
      
      {/* Letter T - horizontal bar at top, vertical stem */}
      <g filter={isMatrix ? "url(#matrixGlow)" : undefined}>
        {/* Horizontal bar */}
        <line
          x1="12"
          y1="12"
          x2="36"
          y2="12"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Vertical stem */}
        <line
          x1="24"
          y1="12"
          x2="24"
          y2="24"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
      
      {/* Checkmark - V shape below the T */}
      <g filter={isMatrix ? "url(#matrixGlow)" : undefined}>
        <path
          d="M16 30 L22 36 L32 22"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

