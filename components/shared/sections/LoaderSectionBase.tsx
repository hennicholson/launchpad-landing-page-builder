"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import SectionButton, { getButtonPropsFromContent } from "./SectionButton";
import { SectionBackground } from "../SectionBackground";

const LOGO_SIZES = {
  small: 80,
  medium: 120,
  large: 180,
};

export default function LoaderSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content } = section;
  const [isExiting, setIsExiting] = useState(false);

  // Extract colors and fonts
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary;

  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  // Determine logo dimensions
  const logoWidth =
    content.logoSize === "custom" && content.customLogoSize
      ? content.customLogoSize
      : LOGO_SIZES[content.logoSize || "medium"];

  // Handle button click with transition animation
  const handleEnterClick = () => {
    setIsExiting(true);

    // Wait for animation to complete before navigating
    setTimeout(() => {
      const link = content.buttonLink || "#";

      // If link is anchor, smooth scroll
      if (link.startsWith("#")) {
        const target = document.querySelector(link);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to external URL
        window.location.href = link;
      }
    }, (content.transitionDuration || 0.8) * 1000);
  };

  // Define exit animation variants
  const exitVariants = {
    fade: { opacity: 0 },
    slide: { y: "-100%", opacity: 0 },
    zoom: { scale: 1.5, opacity: 0 },
  };

  const transitionAnimation = content.transitionAnimation || "fade";

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.section
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: bgColor }}
          exit={exitVariants[transitionAnimation]}
          transition={{
            duration: content.transitionDuration || 0.8,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          {/* Background Effect */}
          <SectionBackground
            effect={content.backgroundEffect || "none"}
            config={content.backgroundConfig}
          />

          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-2xl">
            {/* Logo */}
            {content.logoUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="mb-8"
              >
                <img
                  src={content.logoUrl}
                  alt="Logo"
                  className="object-contain"
                  style={{ width: logoWidth, height: "auto", maxHeight: logoWidth }}
                />
              </motion.div>
            )}

            {/* Heading */}
            {content.heading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="mb-8"
              >
                {renderText ? (
                  renderText({
                    value: content.heading,
                    sectionId: section.id,
                    field: "heading",
                    className: "text-4xl md:text-5xl lg:text-6xl font-bold",
                    style: { color: textColor, fontFamily: headingFont },
                  })
                ) : (
                  <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold"
                    style={{ color: textColor, fontFamily: headingFont }}
                  >
                    {content.heading}
                  </h1>
                )}
              </motion.div>
            )}

            {/* Enter Button */}
            {content.buttonText && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              >
                <div onClick={handleEnterClick}>
                  <SectionButton
                    text={content.buttonText}
                    link={content.buttonLink || "#"}
                    sectionId={section.id}
                    {...getButtonPropsFromContent(content)}
                    sectionBgColor={bgColor}
                    primaryColor={primaryColor}
                    accentColor={accentColor}
                    schemeTextColor={textColor}
                    bodyFont={bodyFont}
                    renderText={renderText}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
