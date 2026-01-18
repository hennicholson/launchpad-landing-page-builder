"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassButtonVariants = cva(
  "relative isolate all-unset cursor-pointer rounded-full transition-all",
  {
    variants: {
      size: {
        default: "text-base font-medium",
        sm: "text-sm font-medium",
        lg: "text-lg font-medium",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const glassButtonTextVariants = cva(
  "glass-button-text relative block select-none tracking-tighter",
  {
    variants: {
      size: {
        default: "px-6 py-3.5",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "flex h-10 w-10 items-center justify-center",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
  bgColor?: string;      // Tint color for glass effect
  textColor?: string;    // Text color
  borderColor?: string;  // Border color
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, bgColor, textColor, borderColor, style, ...props }, ref) => {
    // Build custom styles
    const wrapperStyle: React.CSSProperties = {
      ...(bgColor && {
        '--glass-bg': bgColor,
        backgroundColor: `${bgColor}20`, // 12% opacity tint
      } as React.CSSProperties),
    };

    const buttonStyle: React.CSSProperties = {
      ...style,
      ...(borderColor && { borderColor }),
    };

    // Text gradient styling - use custom color or default white
    const textGradientStyle: React.CSSProperties = textColor
      ? {
          background: `linear-gradient(180deg, ${textColor} 0%, ${textColor}cc 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }
      : {}; // Let CSS class handle default white gradient

    return (
      <div
        className={cn(
          "glass-button-wrap cursor-pointer rounded-full",
          className
        )}
        style={wrapperStyle}
      >
        <button
          className={cn("glass-button", glassButtonVariants({ size }))}
          ref={ref}
          style={buttonStyle}
          {...props}
        >
          <span
            className={cn(
              glassButtonTextVariants({ size }),
              // Only use CSS class for gradient if no custom textColor
              !textColor && "glass-button-text",
              contentClassName
            )}
            style={textGradientStyle}
          >
            {children}
          </span>
        </button>
        <div
          className="glass-button-shadow rounded-full"
          style={bgColor ? { backgroundColor: `${bgColor}40` } as React.CSSProperties : undefined}
        />
      </div>
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
export default GlassButton;
