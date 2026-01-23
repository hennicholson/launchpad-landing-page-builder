"use client";

import { useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  magneticStrength?: number;
  magneticRadius?: number;
  variant?: "liquid" | "glow" | "solid";
  primaryColor?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Magnetic button that pulls toward cursor on hover
 * Inspired by premium sites like Linear and Stripe
 */
export function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  magneticStrength = 0.3,
  magneticRadius = 150,
  variant = "glow",
  primaryColor = "#7C3AED",
  size = "lg",
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    if (distance < magneticRadius) {
      const factor = (1 - distance / magneticRadius) * magneticStrength;
      x.set(distanceX * factor);
      y.set(distanceY * factor);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const variantStyles = {
    liquid: {
      background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${primaryColor}aa 100%)`,
      boxShadow: isHovered
        ? `0 20px 40px -10px ${primaryColor}80, 0 0 0 1px ${primaryColor}40`
        : `0 10px 30px -10px ${primaryColor}60`,
    },
    glow: {
      background: primaryColor,
      boxShadow: isHovered
        ? `0 0 60px ${primaryColor}80, 0 0 100px ${primaryColor}40, inset 0 1px 0 rgba(255,255,255,0.2)`
        : `0 0 30px ${primaryColor}40, inset 0 1px 0 rgba(255,255,255,0.1)`,
    },
    solid: {
      background: primaryColor,
      boxShadow: isHovered
        ? `0 10px 30px -5px ${primaryColor}60`
        : `0 4px 15px -3px ${primaryColor}40`,
    },
  };

  const buttonContent = (
    <>
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-full"
        initial={false}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
            transform: "translateX(-100%)",
          }}
          animate={isHovered ? { transform: "translateX(100%)" } : {}}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Button text */}
      <span className="relative z-10 font-semibold tracking-wide">{children}</span>

      {/* Pulse ring on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${primaryColor}` }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </>
  );

  const commonProps = {
    ref: buttonRef as any,
    className: cn(
      "relative inline-flex items-center justify-center rounded-full",
      "text-white font-medium cursor-pointer",
      "transition-all duration-300",
      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black",
      sizeClasses[size],
      className
    ),
    style: {
      x: springX,
      y: springY,
      ...variantStyles[variant],
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    whileTap: { scale: 0.95 },
  };

  if (href) {
    return (
      <motion.a href={href} {...commonProps}>
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button onClick={onClick} {...commonProps}>
      {buttonContent}
    </motion.button>
  );
}
