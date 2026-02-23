"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { SectionBackground } from "../../SectionBackground";

export default function HeroEmailGlass({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content } = section;

  // Dynamic colors
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  const DEFAULT_PADDING = { top: 80, bottom: 80 };

  // Form state
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const apiUrl = `${window.location.origin}/api/forms/submit`;
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          sectionId: section.id,
          sectionType: "hero-email-glass",
          sourceUrl: window.location.href,
          referrer: document.referrer,
        }),
      });
    } catch {
      // Silently continue
    }

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
        paddingLeft: content.paddingLeft,
        paddingRight: content.paddingRight,
        fontFamily: `'${bodyFont}', sans-serif`,
      }}
    >
      {/* Background Effect */}
      <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />

      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            backgroundColor: `${accentColor}08`,
            filter: "blur(180px)",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-2xl w-full px-6 text-center">
        {/* Badge */}
        {content.showBadge !== false && content.badge && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md"
              style={{
                backgroundColor: `${accentColor}15`,
                color: accentColor,
                border: `1px solid ${accentColor}30`,
              }}
            >
              {renderText
                ? renderText({
                    value: content.badge,
                    sectionId: section.id,
                    field: "badge",
                  })
                : content.badge}
            </span>
          </motion.div>
        )}

        {/* Heading */}
        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
          style={{
            fontFamily: `'${headingFont}', sans-serif`,
            color: textColor,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {renderText
            ? renderText({
                value: content.heading || "Join the Future of Creation",
                sectionId: section.id,
                field: "heading",
                className: "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight",
                style: { fontFamily: `'${headingFont}', sans-serif`, color: textColor },
              })
            : content.heading || "Join the Future of Creation"}
        </motion.h1>

        {/* Subheading */}
        {content.subheading && (
          <motion.p
            className="text-base sm:text-lg mb-8 max-w-lg mx-auto"
            style={{ color: `${textColor}99`, fontFamily: `'${bodyFont}', sans-serif` }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {renderText
              ? renderText({
                  value: content.subheading,
                  sectionId: section.id,
                  field: "subheading",
                  multiline: true,
                  inline: true,
                })
              : content.subheading}
          </motion.p>
        )}

        {/* Glass Card with Form */}
        <motion.div
          className="max-w-md mx-auto rounded-2xl p-6 md:p-8 backdrop-blur-xl"
          style={{
            backgroundColor: `${textColor}03`,
            border: `1px solid ${textColor}14`,
            boxShadow: `0 0 60px -15px ${accentColor}26`,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                key="success"
                className="text-center py-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <motion.div
                  className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}20` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                >
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke={accentColor} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <p className="text-lg font-semibold" style={{ color: textColor, fontFamily: headingFont }}>
                  You're on the list!
                </p>
                <p className="text-sm mt-1" style={{ color: `${textColor}80`, fontFamily: bodyFont }}>
                  Check your inbox for confirmation.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                data-lp-form
                onSubmit={handleFormSubmit}
                className="space-y-3"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Email Input */}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    typeof content.formPlaceholder === "string"
                      ? content.formPlaceholder
                      : "Enter your email address"
                  }
                  className="w-full px-4 py-3.5 rounded-xl outline-none transition-all duration-300"
                  style={{
                    backgroundColor: `${textColor}08`,
                    border: `1px solid ${textColor}15`,
                    color: textColor,
                    fontFamily: bodyFont,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = `${accentColor}50`;
                    e.currentTarget.style.boxShadow = `0 0 0 2px ${accentColor}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = `${textColor}15`;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  required
                  disabled={isSubmitting}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className="w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    backgroundColor: accentColor,
                    color: bgColor,
                    fontFamily: bodyFont,
                    boxShadow: `0 4px 20px ${accentColor}40`,
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        className="w-5 h-5 border-2 rounded-full"
                        style={{ borderColor: `${bgColor}30`, borderTopColor: bgColor }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Processing...
                    </span>
                  ) : renderText ? (
                    renderText({
                      value: content.formButtonText || "Get Access",
                      sectionId: section.id,
                      field: "formButtonText",
                    })
                  ) : (
                    content.formButtonText || "Get Access"
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Privacy Text */}
        <motion.p
          className="text-xs mt-4"
          style={{ color: `${textColor}50`, fontFamily: bodyFont }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          We respect your privacy. Unsubscribe anytime.
        </motion.p>

        {/* Trust / Brands */}
        {content.brands && content.brands.length > 0 && (
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {content.brands.map((brand: string, idx: number) => (
              <span
                key={idx}
                className="text-sm font-medium"
                style={{ color: `${textColor}50`, fontFamily: bodyFont }}
              >
                {brand}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
