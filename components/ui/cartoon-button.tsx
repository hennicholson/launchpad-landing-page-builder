"use client";

interface CartoonButtonProps {
  label: string;
  bgColor?: string;       // Background color (default: #fb923c / orange-400)
  textColor?: string;     // Text color (default: #262626 / neutral-800)
  borderColor?: string;   // Border and shadow color (default: #262626)
  hasHighlight?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;  // Custom styles (fontSize, padding, borderRadius, etc.)
}

export function CartoonButton({
  label,
  bgColor = "#fb923c",
  textColor = "#262626",
  borderColor = "#262626",
  hasHighlight = true,
  disabled = false,
  onClick,
  className = "",
  style,
}: CartoonButtonProps) {
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  return (
    <div
      className={`inline-block ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <button
        disabled={disabled}
        onClick={handleClick}
        className={`relative h-12 px-6 text-xl rounded-full font-bold border-2 transition-all duration-150 overflow-hidden group
        ${disabled ? "opacity-50 pointer-events-none" : "hover:-translate-y-1 active:translate-y-0 active:shadow-none"}`}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderColor: borderColor,
          ...style,  // Merge custom styles (fontSize, padding, borderRadius override defaults)
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.boxShadow = `0 4px 0 0 ${borderColor}`;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span className="relative z-10 whitespace-nowrap">{label}</span>
        {hasHighlight && !disabled && (
          <div
            className="absolute top-1/2 left-[-100%] w-16 h-24 -translate-y-1/2 rotate-12 transition-all duration-500 ease-in-out group-hover:left-[200%]"
            style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
          />
        )}
      </button>
    </div>
  );
}

export default CartoonButton;
