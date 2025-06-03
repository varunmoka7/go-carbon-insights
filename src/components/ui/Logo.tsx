
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo = ({ size = 'medium', className }: LogoProps) => {
  const sizeClasses = {
    small: 'h-6 w-auto',
    medium: 'h-8 w-auto',
    large: 'h-10 w-auto'
  };

  return (
    <svg 
      viewBox="0 0 200 120" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], className)}
      aria-label="GoCarbonTracker Logo"
    >
      {/* Outer box frame */}
      <rect 
        x="10" 
        y="10" 
        width="180" 
        height="100" 
        fill="none" 
        stroke="#228B22" 
        strokeWidth="2" 
        rx="4" 
        ry="4"
      />
      
      {/* First bar (tallest) */}
      <rect 
        x="25" 
        y="25" 
        width="25" 
        height="70" 
        fill="none" 
        stroke="#228B22" 
        strokeWidth="3" 
        rx="2" 
        ry="2"
      />
      
      {/* Second bar (medium) */}
      <rect 
        x="65" 
        y="45" 
        width="25" 
        height="50" 
        fill="none" 
        stroke="#228B22" 
        strokeWidth="3" 
        rx="2" 
        ry="2"
      />
      
      {/* Third bar (shortest) */}
      <rect 
        x="105" 
        y="65" 
        width="25" 
        height="30" 
        fill="none" 
        stroke="#228B22" 
        strokeWidth="3" 
        rx="2" 
        ry="2"
      />
      
      {/* Circle representing zero */}
      <circle 
        cx="157" 
        cy="83" 
        r="12" 
        fill="none" 
        stroke="#228B22" 
        strokeWidth="3"
      />
    </svg>
  );
};

export default Logo;
