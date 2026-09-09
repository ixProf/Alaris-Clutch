'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5E6AD2] disabled:pointer-events-none disabled:opacity-40 select-none';

    let variantStyles = '';
    if (variant === 'primary') {
      // primary = white/#EEEEEE background with #0E0F11 text, no glow
      variantStyles = 'bg-[#EEEEEE] text-[#0E0F11] hover:bg-[#E0E0E0] active:bg-[#CCCCCC] rounded-md';
    } else if (variant === 'secondary') {
      // secondary/outline = transparent background, #EEEEEE text, 1px solid rgba(255,255,255,0.08) border
      variantStyles =
        'bg-transparent text-[#EEEEEE] border border-[rgba(255,255,255,0.08)] hover:bg-[#1F2024] hover:border-[rgba(255,255,255,0.15)] rounded-md';
    } else if (variant === 'ghost') {
      variantStyles = 'bg-transparent text-[#8A8F98] hover:text-[#EEEEEE] hover:bg-[#1F2024] rounded-md';
    } else if (variant === 'destructive') {
      variantStyles =
        'bg-[#E05252] text-[#EEEEEE] hover:bg-[#C94545] rounded-md';
    }

    let sizeStyles = '';
    if (size === 'sm') {
      sizeStyles = 'h-8 px-3 text-xs gap-1.5';
    } else if (size === 'md') {
      sizeStyles = 'h-9 px-4 text-xs gap-2';
    } else if (size === 'lg') {
      sizeStyles = 'h-10 px-5 text-sm gap-2';
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
