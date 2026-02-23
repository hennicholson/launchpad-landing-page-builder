"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { usePublishedContext } from "@/lib/published-context";
import { useEditorStore } from "@/lib/store";
import { SectionBackground } from "../../SectionBackground";
import { collectBrowserMeta } from "@/lib/form-utils";

export default function HeroSplitForm({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content } = section;
  const publishedCtx = usePublishedContext();
  const editorProjectId = useEditorStore((s) => s.projectId);
  const projectId = publishedCtx?.projectId || editorProjectId;

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

  // Mouse tracking for ambient glow on left panel
  const [panelMouse, setPanelMouse] = useState({ x: 0, y: 0, active: false });

  // Mouse tracking for input hover border effect
  const [inputMouse, setInputMouse] = useState({ x: 0, active: false });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    setIsSubmitting(true);

    if (projectId) {
      try {
        const apiBase = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        const apiUrl = `${apiBase}/api/forms/${projectId}/submit`;
        await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            fields: collectBrowserMeta(),
            sectionId: section.id,
            sectionType: "hero-split-form",
            sourceUrl: window.location.href,
            referrer: document.referrer,
          }),
        });
      } catch {
        // Silently continue
      }
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

      {/* Inner container */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6">
        {/* Split card */}
        <motion.div
          className="flex rounded-2xl overflow-hidden"
          style={{
            backdropFilter: "blur(24px)",
            backgroundColor: `${textColor}05`,
            border: `1px solid ${textColor}12`,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Left side - Form */}
          <div
            className="w-full lg:w-1/2 p-6 md:p-10 relative overflow-hidden"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setPanelMouse({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                active: true,
              });
            }}
            onMouseLeave={() => setPanelMouse((prev) => ({ ...prev, active: false }))}
          >
            {/* Mouse-tracking ambient glow */}
            <div
              className="absolute pointer-events-none transition-opacity duration-500"
              style={{
                left: panelMouse.x - 200,
                top: panelMouse.y - 200,
                width: 400,
                height: 400,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${accentColor}12 0%, transparent 70%)`,
                filter: "blur(60px)",
                opacity: panelMouse.active ? 1 : 0,
              }}
            />

            <div className="relative z-10">
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
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
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
                      value: content.heading || "Get Early Access",
                      sectionId: section.id,
                      field: "heading",
                      className: "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight",
                      style: { fontFamily: `'${headingFont}', sans-serif`, color: textColor },
                    })
                  : content.heading || "Get Early Access"}
              </motion.h1>

              {/* Subheading */}
              {content.subheading && (
                <motion.p
                  className="text-base sm:text-lg mb-8 max-w-md"
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

              {/* Form */}
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    className="py-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <motion.div
                      className="w-14 h-14 mb-3 rounded-full flex items-center justify-center"
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
                      You&apos;re on the list!
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
                    {/* Email Input with radial gradient border effect */}
                    <div
                      className="relative"
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setInputMouse({ x: e.clientX - rect.left, active: true });
                      }}
                      onMouseLeave={() => setInputMouse((prev) => ({ ...prev, active: false }))}
                    >
                      {/* Top edge gradient */}
                      <div
                        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none transition-opacity duration-300 rounded-t-xl overflow-hidden"
                        style={{
                          opacity: inputMouse.active ? 1 : 0,
                          background: `radial-gradient(30px circle at ${inputMouse.x}px 0px, ${accentColor} 0%, transparent 70%)`,
                        }}
                      />
                      {/* Bottom edge gradient */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none transition-opacity duration-300 rounded-b-xl overflow-hidden"
                        style={{
                          opacity: inputMouse.active ? 1 : 0,
                          background: `radial-gradient(30px circle at ${inputMouse.x}px 2px, ${accentColor} 0%, transparent 70%)`,
                        }}
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                          typeof content.formPlaceholder === "string"
                            ? content.formPlaceholder
                            : "Enter your email"
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
                    </div>

                    {/* Submit button with shimmer effect */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !email}
                      className="group relative w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{
                        backgroundColor: accentColor,
                        color: bgColor,
                        fontFamily: bodyFont,
                        boxShadow: `0 4px 20px ${accentColor}40`,
                      }}
                    >
                      {/* Shimmer hover effect */}
                      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-13deg)_translateX(100%)]">
                        <div className="relative h-full w-8 bg-white/20" />
                      </div>
                      <span className="relative z-10">
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
                            value: content.formButtonText || "Get Started",
                            sectionId: section.id,
                            field: "formButtonText",
                          })
                        ) : (
                          content.formButtonText || "Get Started"
                        )}
                      </span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Privacy text */}
              <motion.p
                className="text-xs mt-4"
                style={{ color: `${textColor}50`, fontFamily: bodyFont }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Your data is secure and private.
              </motion.p>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="hidden lg:block w-1/2 relative">
            {content.heroImageUrl ? (
              <img
                src={content.heroImageUrl}
                alt={content.heroImageAlt || "Hero image"}
                className="object-cover w-full h-full"
                style={{ opacity: 0.7 }}
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}30 0%, ${accentColor}08 50%, ${bgColor} 100%)`,
                  minHeight: 400,
                }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
