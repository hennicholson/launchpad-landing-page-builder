"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
  CSSProperties,
  MouseEvent as ReactMouseEvent,
} from "react";

// ============================================
// CONTEXT FOR 3D CARD STATE
// ============================================
interface CardContextType {
  rotateX: ReturnType<typeof useSpring>;
  rotateY: ReturnType<typeof useSpring>;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  isHovered: boolean;
}

const CardContext = createContext<CardContextType | null>(null);

const useCard3D = () => {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("useCard3D must be used within Card3DContainer");
  return ctx;
};

// ============================================
// WHOP BRAND COLORS
// ============================================
const WHOP = {
  dark: "#141212",
  cream: "#FCF6F5",
  orange: "#FA4616",
  orangeLight: "#FF6B3D",
};

// ============================================
// CARD 3D CONTAINER
// ============================================
interface Card3DContainerProps {
  children: ReactNode;
  className?: string;
  /** Perspective distance - lower = more dramatic 3D. Default: 1000 */
  perspective?: number;
}

export function Card3DContainer({
  children,
  className = "",
  perspective = 1000,
}: Card3DContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothed rotation values with spring physics
  const rotateX = useSpring(0, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate rotation based on mouse distance from center (subtle tilt)
    const rotateXValue = ((e.clientY - centerY) / (rect.height / 2)) * -5;
    const rotateYValue = ((e.clientX - centerX) / (rect.width / 2)) * 5;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);

    // Store mouse position for shine effect (0-1 range)
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <CardContext.Provider value={{ rotateX, rotateY, mouseX, mouseY, isHovered }}>
      <div
        ref={containerRef}
        className={`relative ${className}`}
        style={{ perspective }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

// ============================================
// CARD 3D BODY - The main card with transforms
// ============================================
interface Card3DBodyProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Glass blur intensity. Default: 12 */
  blur?: number;
  /** Border radius. Default: 20 */
  radius?: number;
  /** Show glare/shine effect. Default: true */
  showGlare?: boolean;
  /** Variant for different intensities */
  variant?: "default" | "prominent" | "subtle";
}

export function Card3DBody({
  children,
  className = "",
  style,
  blur = 12,
  radius = 20,
  showGlare = true,
  variant = "default",
}: Card3DBodyProps) {
  const { rotateX, rotateY, mouseX, mouseY, isHovered } = useCard3D();

  // Dynamic glare position based on mouse
  const glareX = useTransform(mouseX, [0, 1], ["-50%", "150%"]);
  const glareY = useTransform(mouseY, [0, 1], ["-50%", "150%"]);
  const glareOpacity = useTransform(
    [mouseX, mouseY],
    ([x, y]) => {
      // Glare is strongest near edges, subtle in center
      const distFromCenter = Math.sqrt(
        Math.pow((x as number) - 0.5, 2) + Math.pow((y as number) - 0.5, 2)
      );
      return isHovered ? Math.min(0.4, distFromCenter * 0.8) : 0;
    }
  );

  // Variant-specific styles
  const variantStyles: Record<string, CSSProperties> = {
    default: {
      backgroundColor: `rgba(252, 246, 245, 0.06)`,
      boxShadow: `
        0 4px 6px -1px rgba(0, 0, 0, 0.3),
        0 10px 20px -5px rgba(0, 0, 0, 0.4),
        0 25px 50px -12px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 0 rgba(252, 246, 245, 0.1),
        inset 0 -1px 0 0 rgba(0, 0, 0, 0.2)
      `,
    },
    prominent: {
      backgroundColor: `rgba(252, 246, 245, 0.1)`,
      boxShadow: `
        0 8px 12px -2px rgba(250, 70, 22, 0.15),
        0 16px 32px -8px rgba(0, 0, 0, 0.5),
        0 32px 64px -16px rgba(0, 0, 0, 0.6),
        inset 0 1px 0 0 rgba(252, 246, 245, 0.15),
        inset 0 -1px 0 0 rgba(0, 0, 0, 0.3)
      `,
    },
    subtle: {
      backgroundColor: `rgba(252, 246, 245, 0.03)`,
      boxShadow: `
        0 2px 4px -1px rgba(0, 0, 0, 0.2),
        0 8px 16px -4px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 0 rgba(252, 246, 245, 0.06)
      `,
    },
  };

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{
        transformStyle: "preserve-3d",
        borderRadius: radius,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: `1px solid rgba(252, 246, 245, 0.08)`,
        ...variantStyles[variant],
        rotateX,
        rotateY,
        ...style,
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Dynamic glare/shine effect */}
      {showGlare && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${glareX} ${glareY},
                rgba(255, 255, 255, 0.15),
                transparent 40%
              )
            `,
            opacity: glareOpacity,
            borderRadius: radius,
          }}
        />
      )}

      {/* Top edge highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none z-30"
        style={{
          background: `linear-gradient(90deg,
            transparent 0%,
            rgba(255,255,255,0.2) 20%,
            rgba(255,255,255,0.3) 50%,
            rgba(255,255,255,0.2) 80%,
            transparent 100%
          )`,
        }}
      />

      {/* Subtle inner glow at top */}
      <div
        className="absolute inset-x-0 top-0 h-32 pointer-events-none z-0"
        style={{
          background: `linear-gradient(180deg,
            rgba(255,255,255,0.04) 0%,
            transparent 100%
          )`,
          borderRadius: `${radius}px ${radius}px 0 0`,
        }}
      />

      {/* Noise texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] z-10" aria-hidden="true">
        <filter id="card-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#card-noise)" />
      </svg>
    </motion.div>
  );
}

// ============================================
// CARD 3D ITEM - Elements that float in Z-space
// ============================================
interface Card3DItemProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: React.ElementType;
  /** Z-axis translation (px). Higher = more forward. Default: 0 */
  translateZ?: number;
  /** Additional X translation on hover */
  translateX?: number;
  /** Additional Y translation on hover */
  translateY?: number;
  /** Rotation on X axis */
  rotateX?: number;
  /** Rotation on Y axis */
  rotateY?: number;
}

export function Card3DItem({
  children,
  className = "",
  style,
  as: Component = "div",
  translateZ = 0,
  translateX = 0,
  translateY = 0,
  rotateX = 0,
  rotateY = 0,
}: Card3DItemProps) {
  const { isHovered } = useCard3D();

  return (
    <motion.div
      className={className}
      style={{
        transformStyle: "preserve-3d",
        ...style,
      }}
      animate={{
        translateZ: isHovered ? translateZ : 0,
        translateX: isHovered ? translateX : 0,
        translateY: isHovered ? translateY : 0,
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {Component === "div" ? children : <Component>{children}</Component>}
    </motion.div>
  );
}

// ============================================
// COMPLETE GLASS CARD - All-in-one component
// ============================================
interface GlassCard3DProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  padding?: string;
  variant?: "default" | "prominent" | "subtle";
  /** Enable 3D tilt effect. Default: true */
  tilt?: boolean;
  onClick?: () => void;
}

export function GlassCard3D({
  children,
  className = "",
  style,
  padding = "24px",
  variant = "default",
  tilt = true,
  onClick,
}: GlassCard3DProps) {
  if (!tilt) {
    // Simplified non-tilt version
    return (
      <div
        className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] ${className}`}
        style={{
          borderRadius: 20,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: "rgba(252, 246, 245, 0.06)",
          border: "1px solid rgba(252, 246, 245, 0.08)",
          boxShadow: `
            0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 10px 20px -5px rgba(0, 0, 0, 0.4),
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 0 rgba(252, 246, 245, 0.1)
          `,
          padding,
          ...style,
        }}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  return (
    <Card3DContainer className={className}>
      <Card3DBody variant={variant} style={{ padding, cursor: onClick ? "pointer" : "default", ...style }}>
        <div onClick={onClick}>{children}</div>
      </Card3DBody>
    </Card3DContainer>
  );
}

export default GlassCard3D;
