"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const glowVariants = cva("absolute w-full pointer-events-none", {
  variants: {
    variant: {
      top: "top-0",
      above: "-top-[128px]",
      bottom: "bottom-0",
      below: "-bottom-[128px]",
      center: "top-[50%]",
    },
  },
  defaultVariants: {
    variant: "center",
  },
});

export interface GlowBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glowVariants> {}

export function GlowBackground({ className, variant, ...props }: GlowBackgroundProps) {
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}
      {...props}
    >
      <div className={cn(glowVariants({ variant }))}>
        <div
          className={cn(
            "absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.5)_10%,_rgba(139,92,246,0)_60%)] sm:h-[512px]",
            variant === "center" && "-translate-y-1/2"
          )}
        />
        <div
          className={cn(
            "absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-[2] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.3)_10%,_rgba(139,92,246,0)_60%)] sm:h-[256px]",
            variant === "center" && "-translate-y-1/2"
          )}
        />
      </div>
    </div>
  );
}
