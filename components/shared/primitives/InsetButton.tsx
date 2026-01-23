"use client";

import { motion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

// Whop Brand Colors
const WHOP = {
  dark: "#141212",
  cream: "#FCF6F5",
  orange: "#FA4616",
  orangeLight: "#FF6B3D",
};

interface InsetButtonProps {
  children: ReactNode;
  /** Button variant */
  variant?: "default" | "primary" | "ghost";
  /** Button size */
  size?: "sm" | "md" | "lg";
  /** Click handler */
  onClick?: () => void;
  /** Link href (renders as anchor) */
  href?: string;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
  /** Disabled state */
  disabled?: boolean;
  /** Full width button */
  fullWidth?: boolean;
}

/**
 * InsetButton - Button that looks pressed/sunken into the surface
 * Creates a premium glass-integrated feel with inner shadows
 */
export function InsetButton({
  children,
  variant = "default",
  size = "md",
  onClick,
  href,
  className = "",
  style,
  disabled = false,
  fullWidth = false,
}: InsetButtonProps) {
  // Size configurations
  const sizeStyles: Record<string, CSSProperties> = {
    sm: {
      padding: "8px 16px",
      fontSize: "13px",
      borderRadius: "8px",
    },
    md: {
      padding: "12px 24px",
      fontSize: "14px",
      borderRadius: "10px",
    },
    lg: {
      padding: "16px 32px",
      fontSize: "16px",
      borderRadius: "12px",
    },
  };

  // Variant base styles
  const variantStyles: Record<string, CSSProperties> = {
    default: {
      backgroundColor: `rgba(252, 246, 245, 0.06)`,
      color: WHOP.cream,
      border: `1px solid rgba(252, 246, 245, 0.1)`,
      boxShadow: `
        inset 0 2px 4px rgba(0, 0, 0, 0.4),
        inset 0 -1px 0 rgba(255, 255, 255, 0.08),
        0 1px 0 rgba(255, 255, 255, 0.03)
      `,
    },
    primary: {
      backgroundColor: `rgba(250, 70, 22, 0.15)`,
      color: WHOP.orange,
      border: `1px solid rgba(250, 70, 22, 0.25)`,
      boxShadow: `
        inset 0 2px 4px rgba(0, 0, 0, 0.35),
        inset 0 -1px 0 rgba(250, 70, 22, 0.2),
        0 1px 0 rgba(250, 70, 22, 0.1)
      `,
    },
    ghost: {
      backgroundColor: `transparent`,
      color: `${WHOP.cream}cc`,
      border: `1px solid rgba(252, 246, 245, 0.06)`,
      boxShadow: `
        inset 0 1px 2px rgba(0, 0, 0, 0.2),
        inset 0 -1px 0 rgba(255, 255, 255, 0.04)
      `,
    },
  };

  // Hover variants
  const hoverVariants: Record<string, CSSProperties> = {
    default: {
      backgroundColor: `rgba(252, 246, 245, 0.09)`,
      boxShadow: `
        inset 0 1px 2px rgba(0, 0, 0, 0.3),
        inset 0 -1px 0 rgba(255, 255, 255, 0.12),
        0 2px 8px rgba(0, 0, 0, 0.15)
      `,
    },
    primary: {
      backgroundColor: `rgba(250, 70, 22, 0.22)`,
      boxShadow: `
        inset 0 1px 2px rgba(0, 0, 0, 0.25),
        inset 0 -1px 0 rgba(250, 70, 22, 0.3),
        0 2px 12px rgba(250, 70, 22, 0.2)
      `,
    },
    ghost: {
      backgroundColor: `rgba(252, 246, 245, 0.04)`,
      boxShadow: `
        inset 0 1px 1px rgba(0, 0, 0, 0.15),
        inset 0 -1px 0 rgba(255, 255, 255, 0.06)
      `,
    },
  };

  // Active/pressed variants - deeper inset
  const activeVariants: Record<string, CSSProperties> = {
    default: {
      backgroundColor: `rgba(252, 246, 245, 0.04)`,
      boxShadow: `
        inset 0 3px 6px rgba(0, 0, 0, 0.5),
        inset 0 -1px 0 rgba(255, 255, 255, 0.04)
      `,
    },
    primary: {
      backgroundColor: `rgba(250, 70, 22, 0.12)`,
      boxShadow: `
        inset 0 3px 6px rgba(0, 0, 0, 0.45),
        inset 0 -1px 0 rgba(250, 70, 22, 0.15)
      `,
    },
    ghost: {
      backgroundColor: `rgba(252, 246, 245, 0.02)`,
      boxShadow: `
        inset 0 2px 4px rgba(0, 0, 0, 0.25)
      `,
    },
  };

  const baseStyle: CSSProperties = {
    position: "relative",
    display: fullWidth ? "flex" : "inline-flex",
    width: fullWidth ? "100%" : "auto",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: 600,
    letterSpacing: "0.01em",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    transition: "all 0.15s ease",
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style,
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      onClick={disabled ? undefined : onClick}
      className={className}
      style={baseStyle}
      whileHover={disabled ? undefined : hoverVariants[variant]}
      whileTap={disabled ? undefined : activeVariants[variant]}
      transition={{ duration: 0.15 }}
    >
      {/* Inner highlight at top */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg,
            transparent 0%,
            ${variant === "primary" ? `${WHOP.orange}30` : "rgba(255,255,255,0.08)"} 50%,
            transparent 100%
          )`,
          borderRadius: "inherit",
        }}
      />

      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </Component>
  );
}

export default InsetButton;
