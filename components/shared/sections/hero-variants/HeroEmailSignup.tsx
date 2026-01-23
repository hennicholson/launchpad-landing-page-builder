"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { TypewriterText } from "../../primitives/text/TypewriterText";
import { ParticleField } from "../../primitives/particles/ParticleField";
import { MorphingBlobs } from "../../primitives/background/MorphingBlobs";
import { TiltCard } from "../../primitives/scroll/TiltCard";
import { MagneticButton } from "../../primitives/cursor/MagneticButton";
import { InfiniteSlider } from "../../primitives/InfiniteSlider";
import { ProgressiveBlur } from "../../primitives/ProgressiveBlur";
import SectionButton, { getButtonPropsFromContent } from "../SectionButton";
import { SectionBackground } from "../../SectionBackground";

// Particle Burst Component for Input Focus Effect
interface ParticleBurstProps {
  isActive: boolean;
  color: string;
  originX: number;
  originY: number;
}

function ParticleBurst({ isActive, color, originX, originY }: ParticleBurstProps) {
  const particleCount = 20;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {Array.from({ length: particleCount }).map((_, i) => {
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 60 + Math.random() * 40;
            const size = 4 + Math.random() * 4;

            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  backgroundColor: color,
                  width: size,
                  height: size,
                  left: originX,
                  top: originY,
                  boxShadow: `0 0 ${size * 2}px ${color}`,
                }}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance,
                  opacity: 0,
                  scale: 0.2,
                }}
                transition={{
                  duration: 0.6 + Math.random() * 0.3,
                  ease: "easeOut",
                }}
              />
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function HeroEmailSignup({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content } = section;

  // Dynamic colors
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary || accentColor;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  const DEFAULT_PADDING = { top: 80, bottom: 80 };

  // Form state
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [particleBurst, setParticleBurst] = useState(false);
  const [burstOrigin, setBurstOrigin] = useState({ x: 0, y: 0 });
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle input focus with particle burst
  const handleInputFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const formRect = formRef.current?.getBoundingClientRect();

      if (formRect) {
        setBurstOrigin({
          x: rect.left - formRect.left + rect.width / 2,
          y: rect.top - formRect.top + rect.height / 2,
        });
      }

      setParticleBurst(true);
      setTimeout(() => setParticleBurst(false), 800);

      // Update input styles
      e.currentTarget.style.borderColor = `${accentColor}60`;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${accentColor}20, 0 0 30px ${accentColor}15`;
    },
    [accentColor]
  );

  const handleInputBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = `${textColor}20`;
      e.currentTarget.style.boxShadow = "none";
    },
    [textColor]
  );

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Email submitted:", email);
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <main className="overflow-hidden">
      <section
        className="relative min-h-[90vh] flex items-center"
        style={{
          backgroundColor: bgColor,
          paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
          paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
        }}
      >
        {/* User-configurable Background Effect */}
        <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />
        {/* Background Layer: Morphing Blobs */}
        <MorphingBlobs
          count={3}
          colors={[`${accentColor}40`, `${primaryColor}30`, `${accentColor}50`]}
          speed={12}
          blur={100}
          opacity={0.3}
          size={400}
        />

        {/* Background Layer: Interactive Particle Field */}
        <ParticleField
          count={80}
          color={accentColor}
          size={2}
          speed={0.3}
          interactive
          interactionRadius={150}
          connectionDistance={100}
          connectionOpacity={0.15}
          fadeEdges
        />

        {/* Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
            style={{
              backgroundColor: `${accentColor}08`,
              filter: "blur(200px)",
            }}
          />
          <div
            className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
            style={{
              backgroundColor: `${primaryColor}05`,
              filter: "blur(150px)",
            }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 mx-auto max-w-[1400px] w-full px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Heading + Form */}
            <div className="space-y-8">
              {/* Heading with Typewriter Effect */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {renderText ? (
                  <div
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
                    style={{ fontFamily: headingFont, color: textColor }}
                  >
                    {renderText({
                      value: content.heading || "Join the Magic",
                      sectionId: section.id,
                      field: "heading",
                      className:
                        "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight",
                      style: { fontFamily: headingFont, color: textColor },
                    })}
                  </div>
                ) : (
                  <TypewriterText
                    text={content.heading || "Join the Magic"}
                    speed={50}
                    cursor
                    cursorChar="|"
                    cursorBlink
                    loop={false}
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight block"
                    as="h1"
                  />
                )}

                {content.accentHeading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: (content.heading?.length || 15) * 0.05 + 0.5,
                    }}
                  >
                    {renderText ? (
                      <div
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
                        style={{ fontFamily: headingFont, color: accentColor }}
                      >
                        {renderText({
                          value: content.accentHeading,
                          sectionId: section.id,
                          field: "accentHeading",
                          className:
                            "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight",
                          style: { fontFamily: headingFont, color: accentColor },
                        })}
                      </div>
                    ) : (
                      <TypewriterText
                        text={content.accentHeading}
                        speed={50}
                        delay={(content.heading?.length || 15) * 50 + 200}
                        cursor
                        cursorChar="|"
                        cursorBlink
                        loop={false}
                        className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight block"
                        as="span"
                      />
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Subheading */}
              {content.subheading && (
                <motion.p
                  className="text-base sm:text-lg max-w-xl leading-relaxed"
                  style={{ fontFamily: bodyFont, color: `${textColor}cc` }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  {renderText
                    ? renderText({
                        value: content.subheading,
                        sectionId: section.id,
                        field: "subheading",
                        multiline: true,
                        inline: true,
                        className: "text-base sm:text-lg leading-relaxed",
                        style: { color: `${textColor}cc`, fontFamily: bodyFont },
                      })
                    : content.subheading}
                </motion.p>
              )}

              {/* Glass Morphism Form */}
              <motion.form
                ref={formRef}
                className="relative mt-8 p-6 sm:p-8 rounded-2xl backdrop-blur-xl space-y-6"
                style={{
                  backgroundColor: `${textColor}05`,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: `${accentColor}30`,
                  boxShadow: `0 8px 32px ${textColor}10, inset 0 0 0 1px ${textColor}05`,
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  delay: 1.0,
                }}
                onSubmit={handleFormSubmit}
              >
                {/* Particle Burst Effect Container */}
                <ParticleBurst
                  isActive={particleBurst}
                  color={accentColor}
                  originX={burstOrigin.x}
                  originY={burstOrigin.y}
                />

                {/* Success State */}
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      className="text-center py-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${accentColor}20` }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                          delay: 0.1,
                        }}
                      >
                        <svg
                          className="w-8 h-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke={accentColor}
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </motion.div>
                      <p
                        className="text-lg font-semibold"
                        style={{ color: textColor, fontFamily: headingFont }}
                      >
                        You're on the list!
                      </p>
                      <p
                        className="text-sm mt-2"
                        style={{ color: `${textColor}80`, fontFamily: bodyFont }}
                      >
                        Check your inbox for confirmation.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Email Input with Floating Label */}
                      <div className="relative">
                        <input
                          ref={inputRef}
                          type="email"
                          id="email-input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="peer w-full px-4 py-4 pt-6 rounded-xl backdrop-blur-md outline-none transition-all duration-300"
                          style={{
                            backgroundColor: `${bgColor}80`,
                            borderWidth: "1px",
                            borderStyle: "solid",
                            borderColor: `${textColor}20`,
                            color: textColor,
                            fontFamily: bodyFont,
                          }}
                          placeholder=" "
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur}
                          required
                          disabled={isSubmitting}
                        />

                        {/* Floating Label */}
                        <label
                          htmlFor="email-input"
                          className="absolute left-4 top-4 transition-all duration-200 pointer-events-none peer-focus:top-2 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs"
                          style={{
                            color: `${textColor}60`,
                            fontFamily: bodyFont,
                          }}
                        >
                          {renderText
                            ? renderText({
                                value: content.formPlaceholder || "Enter your email",
                                sectionId: section.id,
                                field: "formPlaceholder",
                              })
                            : content.formPlaceholder || "Enter your email"}
                        </label>
                      </div>

                      {/* Submit Button with Magnetic Effect */}
                      <MagneticButton strength={0.3} radius={120}>
                        <button
                          type="submit"
                          disabled={isSubmitting || !email}
                          className="w-full px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                          style={{
                            backgroundColor: accentColor,
                            color: bgColor,
                            fontFamily: bodyFont,
                            boxShadow: `0 4px 20px ${accentColor}40`,
                          }}
                          onMouseEnter={(e) => {
                            if (!isSubmitting && email) {
                              e.currentTarget.style.boxShadow = `0 0 40px ${accentColor}60, 0 4px 20px ${accentColor}40`;
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = `0 4px 20px ${accentColor}40`;
                          }}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                              <motion.span
                                className="w-5 h-5 border-2 rounded-full"
                                style={{
                                  borderColor: `${bgColor}30`,
                                  borderTopColor: bgColor,
                                }}
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                              Processing...
                            </span>
                          ) : renderText ? (
                            renderText({
                              value: content.formButtonText || "Get Early Access",
                              sectionId: section.id,
                              field: "formButtonText",
                            })
                          ) : (
                            content.formButtonText || "Get Early Access"
                          )}
                        </button>
                      </MagneticButton>

                      {/* Privacy Text */}
                      <p
                        className="text-xs text-center"
                        style={{ color: `${textColor}50`, fontFamily: bodyFont }}
                      >
                        We respect your privacy. Unsubscribe at any time.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>
            </div>

            {/* Right Column: Product Mockup with 3D Tilt & Iridescent Border */}
            {content.imageUrl && (
              <motion.div
                className="relative hidden md:block"
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 80,
                  damping: 20,
                  delay: 1.2,
                }}
              >
                <TiltCard
                  tiltIntensity={0.4}
                  rotateXRange={[-12, 12]}
                  rotateYRange={[-12, 12]}
                  scaleOnHover={1.02}
                  glare
                  glareOpacity={0.25}
                  perspective={1200}
                >
                  <div className="relative overflow-hidden rounded-3xl">
                    {/* Iridescent Animated Border */}
                    <div
                      className="absolute -inset-[2px] rounded-3xl"
                      style={{
                        background: `linear-gradient(135deg, ${accentColor}60, ${primaryColor}60, ${accentColor}60, ${primaryColor}60)`,
                        backgroundSize: "300% 300%",
                        animation: "gradientShift 6s ease infinite",
                      }}
                    />

                    {/* Inner Container */}
                    <div
                      className="relative rounded-3xl overflow-hidden"
                      style={{
                        backgroundColor: bgColor,
                        padding: "4px",
                      }}
                    >
                      <div
                        className="rounded-[20px] overflow-hidden"
                        style={{ backgroundColor: `${bgColor}40` }}
                      >
                        {renderImage ? (
                          renderImage({
                            src: content.imageUrl,
                            sectionId: section.id,
                            field: "imageUrl",
                            className: "w-full h-auto block",
                            alt: "Product Mockup",
                          })
                        ) : (
                          <img
                            src={content.imageUrl}
                            alt="Product Mockup"
                            className="w-full h-auto block"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </TiltCard>

                {/* Floating Accent Dots */}
                <motion.div
                  className="absolute -top-4 -left-4 w-8 h-8 rounded-full"
                  style={{
                    backgroundColor: accentColor,
                    opacity: 0.6,
                    filter: "blur(2px)",
                  }}
                  animate={{
                    y: [0, -12, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full"
                  style={{
                    backgroundColor: primaryColor,
                    opacity: 0.5,
                    filter: "blur(4px)",
                  }}
                  animate={{
                    y: [0, 12, 0],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />
                <motion.div
                  className="absolute top-1/2 -right-8 w-6 h-6 rounded-full"
                  style={{
                    backgroundColor: accentColor,
                    opacity: 0.4,
                    filter: "blur(3px)",
                  }}
                  animate={{
                    x: [0, 8, 0],
                    y: [0, -8, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />
              </motion.div>
            )}
          </div>

          {/* Optional CTA Buttons Below Form */}
          {((content.showButton !== false && (content.buttonText || content.primaryButtonText)) ||
            (content.showSecondaryButton !== false && content.secondaryButtonText)) && (
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              {/* Primary Button */}
              {content.showButton !== false && (content.buttonText || content.primaryButtonText) && (
                <SectionButton
                  text={content.buttonText || content.primaryButtonText || ""}
                  link={content.buttonLink || content.primaryButtonLink || "#"}
                  sectionId={section.id}
                  {...getButtonPropsFromContent(content)}
                  sectionBgColor={bgColor}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  schemeTextColor={textColor}
                  bodyFont={bodyFont}
                  renderText={renderText}
                />
              )}

              {/* Secondary Button */}
              {content.showSecondaryButton !== false && content.secondaryButtonText && (
                <SectionButton
                  text={content.secondaryButtonText || ""}
                  link={content.secondaryButtonLink || "#"}
                  sectionId={section.id}
                  {...getButtonPropsFromContent(content)}
                  sectionBgColor={bgColor}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  schemeTextColor={textColor}
                  bodyFont={bodyFont}
                  renderText={renderText}
                />
              )}
            </motion.div>
          )}
        </div>

        {/* CSS Keyframes for Gradient Animation */}
        <style jsx global>{`
          @keyframes gradientShift {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}</style>
      </section>

      {/* Logo Cloud with Infinite Slider */}
      {content.brands && content.brands.length > 0 && (
        <section
          className="relative py-16 md:py-24"
          style={{ backgroundColor: bgColor }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <p
              className="text-center text-xs tracking-widest uppercase mb-8"
              style={{ color: `${textColor}50`, fontFamily: bodyFont }}
            >
              Trusted by leading brands
            </p>

            <div className="relative">
              <ProgressiveBlur direction="left" blurIntensity={0.3} />
              <ProgressiveBlur direction="right" blurIntensity={0.3} />

              <InfiniteSlider
                speed={content.logoScrollSpeed || 1.0}
                gap={48}
                direction="horizontal"
              >
                {content.brands.map((brand: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center px-8"
                    style={{
                      color: `${textColor}60`,
                      fontFamily: headingFont,
                    }}
                  >
                    <span className="text-2xl font-bold whitespace-nowrap">
                      {brand}
                    </span>
                  </div>
                ))}
              </InfiniteSlider>
            </div>
          </motion.div>
        </section>
      )}
    </main>
  );
}
