"use client";

import { ArrowRight } from "lucide-react";

export interface FlowButtonProps {
  text?: string;
  bgColor?: string;        // Circle/hover background color (default: #111111)
  textColor?: string;      // Text and arrow color (default: #111111)
  hoverTextColor?: string; // Text color on hover (default: white)
  borderColor?: string;    // Border color (default: #333333)
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;  // Custom styles (fontSize, padding, borderRadius, etc.)
}

export function FlowButton({
  text = "Modern Button",
  bgColor = "#111111",
  textColor = "#111111",
  hoverTextColor = "#ffffff",
  borderColor = "#333333",
  onClick,
  className = "",
  style,
}: FlowButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] bg-transparent px-8 py-3 text-sm font-semibold cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:rounded-[12px] active:scale-[0.95] ${className}`}
      style={{
        color: textColor,
        borderColor: `${borderColor}66`, // 40% opacity
        ...style,  // Merge custom styles (fontSize, padding, borderRadius override defaults)
      }}
    >
      {/* Left arrow (arr-2) */}
      <ArrowRight
        className="absolute w-4 h-4 left-[-25%] fill-none z-[9] group-hover:left-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ stroke: textColor }}
      />

      {/* Text */}
      <span
        className="relative z-[1] -translate-x-3 group-hover:translate-x-3 transition-all duration-[800ms] ease-out"
        style={{
          // Use CSS variable for hover state
        }}
      >
        {text}
      </span>

      {/* Circle (hover background) */}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-[50%] opacity-0 group-hover:w-[220px] group-hover:h-[220px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
        style={{ backgroundColor: bgColor }}
      />

      {/* Right arrow (arr-1) */}
      <ArrowRight
        className="absolute w-4 h-4 right-4 fill-none z-[9] group-hover:right-[-25%] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ stroke: textColor }}
      />

      {/* CSS for hover text color - using style tag for dynamic values */}
      <style jsx>{`
        button:hover {
          color: ${hoverTextColor};
        }
        button:hover :global(svg) {
          stroke: ${hoverTextColor};
        }
      `}</style>
    </button>
  );
}

export default FlowButton;
