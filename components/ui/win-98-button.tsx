"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface Win98ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  bgColor?: string;      // Background color (default: silver)
  textColor?: string;    // Text color (default: black)
}

const Win98Button = React.forwardRef<HTMLButtonElement, Win98ButtonProps>(
  ({ className, asChild = false, bgColor, textColor, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    // Build custom styles - apply colors via inline styles
    const customStyle: React.CSSProperties = {
      ...style,
      ...(bgColor && { backgroundColor: bgColor }),
      ...(textColor && { color: textColor }),
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-mono text-xs -outline-offset-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          "focus:outline-dotted focus:outline-1 focus:outline-black",
          "focus-visible:outline-dotted focus-visible:outline-1 focus-visible:outline-black",
          // Default colors when no custom colors provided
          !textColor && "text-black",
          "disabled:text-[grey]",
          !bgColor && "bg-[silver]",
          // Win98 bevel shadow effect - always present
          "shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_grey,inset_2px_2px_#dfdfdf]",
          "active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080]",
          "disabled:shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#fff,inset_-2px_-2px_grey,inset_2px_2px_#dfdfdf]",
          "h-7 px-3 min-w-20",
          className
        )}
        ref={ref}
        style={customStyle}
        {...props}
      />
    );
  }
);
Win98Button.displayName = "Win98Button";

export { Win98Button };
export default Win98Button;
