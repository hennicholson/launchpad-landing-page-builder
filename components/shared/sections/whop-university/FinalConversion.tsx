"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { MagneticButton } from "./primitives/MagneticButton";
import { useEditorStore } from "@/lib/store";

/**
 * Final Conversion Section
 * Full-viewport closing CTA with spotlight effect, trust badges, and urgency
 */
export function FinalConversion({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content, items = [] } = section;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Editor state
  const isEditorMode = !!renderText;
  const selectItem = useEditorStore((state) => state.selectItem);
  const selectedItemId = useEditorStore((state) => state.selectedItemId);

  // Colors
  const bgColor = content.backgroundColor || colorScheme.background || "#141212";
  const textColor = content.textColor || colorScheme.text || "#FCF6F5";
  const accentColor = content.accentColor || colorScheme.accent || "#FA4616";
  const primaryColor = colorScheme.primary || accentColor;

  // Typography
  const headingFont = typography?.headingFont || "Acid Grotesk";
  const bodyFont = typography?.bodyFont || "Inter";

  // Default padding
  const DEFAULT_PADDING = { top: 96, bottom: 128 };

  // Spotlight follow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };

    const container = containerRef.current;
    container?.addEventListener("mousemove", handleMouseMove);
    return () => container?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Parallax for decorative elements
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const floatY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Default trust badges
  const trustBadges = content.trustBadges || items.map((i: any) => ({
    icon: i.icon,
    label: i.title || i.label,
  })) || [
    { icon: "🔒", label: "Secure Checkout" },
    { icon: "💯", label: "Money-Back Guarantee" },
    { icon: "⚡", label: "Instant Access" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
      {/* Animated spotlight background */}
      <div
        className="absolute inset-0 transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(circle 600px at ${mousePos.x}% ${mousePos.y}%, ${accentColor}15 0%, transparent 70%)`,
        }}
      />

      {/* Secondary gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 100%, ${primaryColor}10 0%, transparent 70%)`,
        }}
      />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: accentColor, y: floatY }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-48 h-48 rounded-full blur-3xl opacity-15"
        style={{ backgroundColor: primaryColor, y: floatY }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        {content.badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
                border: `1px solid ${accentColor}40`,
                fontFamily: bodyFont,
              }}
            >
              {renderText
                ? renderText({
                    value: content.badge,
                    sectionId: section.id,
                    field: "badge",
                    inline: true,
                  })
                : content.badge}
            </span>
          </motion.div>
        )}

        {/* Main headline with animated gradient */}
        <motion.h2
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span
            style={{
              fontFamily: headingFont,
              // Only apply gradient in non-edit mode - edit mode passes style to renderText
              ...(!renderText && {
                background: `linear-gradient(135deg, ${textColor} 0%, ${textColor} 40%, ${accentColor} 60%, ${primaryColor} 80%, ${textColor} 100%)`,
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradient-shift 4s ease infinite",
              }),
            }}
          >
            {renderText
              ? renderText({
                  value: content.heading || "Ready to Transform?",
                  sectionId: section.id,
                  field: "heading",
                  inline: true,
                  style: {
                    background: `linear-gradient(135deg, ${textColor} 0%, ${textColor} 40%, ${accentColor} 60%, ${primaryColor} 80%, ${textColor} 100%)`,
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "gradient-shift 4s ease infinite",
                  },
                })
              : content.heading || "Ready to Transform?"}
          </span>
        </motion.h2>

        {/* Subheading */}
        {content.subheading && (
          <motion.p
            className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto"
            style={{ color: `${textColor}cc`, fontFamily: bodyFont }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {renderText
              ? renderText({
                  value: content.subheading,
                  sectionId: section.id,
                  field: "subheading",
                  inline: true,
                  style: { color: `${textColor}cc`, fontFamily: bodyFont },
                })
              : content.subheading}
          </motion.p>
        )}

        {/* Price section (optional) */}
        {content.price && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {content.originalPrice && (
              <span
                className="text-xl line-through mr-3"
                style={{ color: `${textColor}50`, fontFamily: bodyFont }}
              >
                $
                {renderText
                  ? renderText({
                      value: content.originalPrice,
                      sectionId: section.id,
                      field: "originalPrice",
                      inline: true,
                    })
                  : content.originalPrice}
              </span>
            )}
            <span
              className="text-5xl md:text-6xl font-bold"
              style={{ color: textColor, fontFamily: headingFont }}
            >
              $
              {renderText
                ? renderText({
                    value: content.price,
                    sectionId: section.id,
                    field: "price",
                    inline: true,
                  })
                : content.price}
            </span>
            {content.pricePeriod && (
              <span
                className="text-lg ml-2"
                style={{ color: `${textColor}60`, fontFamily: bodyFont }}
              >
                {renderText
                  ? renderText({
                      value: content.pricePeriod,
                      sectionId: section.id,
                      field: "pricePeriod",
                      inline: true,
                    })
                  : content.pricePeriod}
              </span>
            )}
          </motion.div>
        )}

        {/* CTA Button - Largest on page */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {content.buttonText && (
            <MagneticButton
              href={content.buttonLink || "#"}
              variant="liquid"
              primaryColor={accentColor}
              size="xl"
              className="text-xl px-12 py-6"
            >
              {renderText
                ? renderText({
                    value: content.buttonText,
                    sectionId: section.id,
                    field: "buttonText",
                  })
                : content.buttonText}
            </MagneticButton>
          )}
        </motion.div>

        {/* Trust badges row */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {items.map((item: any, index: number) => {
            const itemId = item.id || `trust-badge-${index}`;
            const isSelected = selectedItemId === itemId;
            return (
              <motion.div
                key={itemId}
                className={`flex items-center gap-2 rounded-lg px-2 py-1 transition-all ${
                  isEditorMode ? "cursor-pointer hover:bg-white/5" : ""
                } ${isSelected ? "ring-2 ring-[#FA4616] ring-offset-2 ring-offset-[#141212]" : ""}`}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                onClick={
                  isEditorMode
                    ? (e) => {
                        e.stopPropagation();
                        selectItem(section.id, itemId);
                      }
                    : undefined
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span
                  className="text-sm font-medium"
                  style={{ color: `${textColor}80`, fontFamily: bodyFont }}
                >
                  {renderText
                    ? renderText({
                        value: item.title || item.label,
                        sectionId: section.id,
                        field: "label",
                        itemId,
                        inline: true,
                      })
                    : item.title || item.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Creator profile (optional) */}
        {content.creatorName && (
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {content.creatorImageUrl && (
              <motion.div
                className="relative rounded-full"
                animate={{
                  boxShadow: [
                    `0 0 0 3px ${accentColor}40`,
                    `0 0 0 6px ${accentColor}20`,
                    `0 0 0 3px ${accentColor}40`,
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {renderImage ? (
                  <div className="w-14 h-14 rounded-full overflow-hidden">
                    {renderImage({
                      src: content.creatorImageUrl,
                      sectionId: section.id,
                      field: "creatorImageUrl",
                      className: "w-full h-full object-cover",
                      alt: content.creatorName,
                    })}
                  </div>
                ) : (
                  <img
                    src={content.creatorImageUrl}
                    alt={content.creatorName}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                )}
              </motion.div>
            )}
            <div className="text-left">
              <p
                className="font-medium"
                style={{ color: textColor, fontFamily: bodyFont }}
              >
                {renderText
                  ? renderText({
                      value: content.creatorName,
                      sectionId: section.id,
                      field: "creatorName",
                      inline: true,
                    })
                  : content.creatorName}
              </p>
              {content.creatorRole && (
                <p
                  className="text-sm"
                  style={{ color: `${textColor}60`, fontFamily: bodyFont }}
                >
                  {renderText
                    ? renderText({
                        value: content.creatorRole,
                        sectionId: section.id,
                        field: "creatorRole",
                        inline: true,
                      })
                    : content.creatorRole}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Social proof summary (optional) */}
        {content.socialProof && (
          <motion.p
            className="mt-8 text-sm"
            style={{ color: `${textColor}60`, fontFamily: bodyFont }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {renderText
              ? renderText({
                  value: content.socialProof,
                  sectionId: section.id,
                  field: "socialProof",
                  inline: true,
                })
              : content.socialProof}
          </motion.p>
        )}

        {/* Countdown timer (optional - use sparingly) */}
        {content.showCountdown && content.countdownEnd && (
          <CountdownTimer
            endDate={content.countdownEnd}
            textColor={textColor}
            accentColor={accentColor}
            bodyFont={bodyFont}
          />
        )}
      </div>

      {/* CSS for gradient animation */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}

/**
 * Optional Countdown Timer Component
 */
function CountdownTimer({
  endDate,
  textColor,
  accentColor,
  bodyFont,
}: {
  endDate: string;
  textColor: string;
  accentColor: string;
  bodyFont: string;
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Mins" },
    { value: timeLeft.seconds, label: "Secs" },
  ];

  return (
    <motion.div
      className="mt-10 flex items-center justify-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.9 }}
    >
      <span
        className="text-sm font-medium"
        style={{ color: `${textColor}60`, fontFamily: bodyFont }}
      >
        Offer ends in:
      </span>
      <div className="flex gap-2">
        {units.map((unit, index) => (
          <div key={index} className="text-center">
            <motion.div
              className="w-14 h-14 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${accentColor}20`,
                border: `1px solid ${accentColor}30`,
              }}
              animate={{
                scale: unit.value !== 0 ? [1, 1.05, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <span
                className="text-xl font-bold"
                style={{ color: textColor, fontFamily: bodyFont }}
              >
                {unit.value.toString().padStart(2, "0")}
              </span>
            </motion.div>
            <p
              className="text-xs mt-1"
              style={{ color: `${textColor}50`, fontFamily: bodyFont }}
            >
              {unit.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
