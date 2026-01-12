"use client";

import { motion } from "framer-motion";

type BrandMarqueeProps = {
  brands: string[];
  textColor?: string;
  bgColor?: string;
  headingFont?: string;
};

export function BrandMarquee({
  brands,
  textColor,
  bgColor,
  headingFont
}: BrandMarqueeProps) {
  if (!brands || brands.length === 0) return null;

  return (
    <div className="relative overflow-hidden py-6 border-y" style={{ borderColor: `${textColor}0d` }}>
      {/* Gradient masks - use dynamic background color */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10"
        style={{ background: `linear-gradient(to right, ${bgColor || '#0a0a0a'}, transparent)` }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10"
        style={{ background: `linear-gradient(to left, ${bgColor || '#0a0a0a'}, transparent)` }}
      />

      <motion.div
        className="flex gap-16 sm:gap-24 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...brands, ...brands, ...brands, ...brands].map((brand, index) => (
          <span
            key={`${brand}-${index}`}
            className="text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider"
            style={{ color: textColor ? `${textColor}33` : "rgba(255,255,255,0.2)", fontFamily: headingFont }}
          >
            {brand}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
