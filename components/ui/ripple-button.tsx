"use client";

import { cn } from "@/lib/utils";
import React, { MouseEvent, useEffect, useState } from "react";

interface RippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string;
  bgColor?: string;      // Background color (default: uses bg-background)
  textColor?: string;    // Text color (default: uses text-primary)
  borderColor?: string;  // Border color (default: currentColor)
  duration?: string;
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  (
    {
      className,
      children,
      rippleColor = "#ffffff",
      bgColor,
      textColor,
      borderColor,
      duration = "600ms",
      onClick,
      style,
      ...props
    },
    ref
  ) => {
    const [buttonRipples, setButtonRipples] = useState<
      Array<{ x: number; y: number; size: number; key: number }>
    >([]);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      createRipple(event);
      onClick?.(event);
    };

    const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      const newRipple = { x, y, size, key: Date.now() };
      setButtonRipples((prevRipples) => [...prevRipples, newRipple]);
    };

    useEffect(() => {
      if (buttonRipples.length > 0) {
        const lastRipple = buttonRipples[buttonRipples.length - 1];
        const timeout = setTimeout(() => {
          setButtonRipples((prevRipples) =>
            prevRipples.filter((ripple) => ripple.key !== lastRipple.key)
          );
        }, parseInt(duration));
        return () => clearTimeout(timeout);
      }
    }, [buttonRipples, duration]);

    // Build custom styles
    const customStyles: React.CSSProperties = {
      ...style,
      ...(bgColor && { backgroundColor: bgColor }),
      ...(textColor && { color: textColor }),
      ...(borderColor && { borderColor }),
    };

    return (
      <button
        className={cn(
          "relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 px-4 py-2 text-center",
          // Only apply default Tailwind colors if custom colors not provided
          !bgColor && "bg-background",
          !textColor && "text-primary",
          className
        )}
        onClick={handleClick}
        ref={ref}
        style={customStyles}
        {...props}
      >
        <div className="relative z-10">{children}</div>
        <span className="pointer-events-none absolute inset-0">
          {buttonRipples.map((ripple) => (
            <span
              className="absolute animate-rippling rounded-full opacity-30"
              key={ripple.key}
              style={{
                width: `${ripple.size}px`,
                height: `${ripple.size}px`,
                top: `${ripple.y}px`,
                left: `${ripple.x}px`,
                backgroundColor: rippleColor,
                transform: `scale(0)`,
              }}
            />
          ))}
        </span>
      </button>
    );
  }
);

RippleButton.displayName = "RippleButton";

export { RippleButton };
export default RippleButton;
