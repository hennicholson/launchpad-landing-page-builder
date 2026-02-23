"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { usePublishedContext } from "@/lib/published-context";
import { useEditorStore } from "@/lib/store";
import { SectionBackground } from "../../SectionBackground";
import { collectBrowserMeta } from "@/lib/form-utils";

type FormField = {
  label: string;
  type: string;
  placeholder: string;
};

const DEFAULT_FIELDS: FormField[] = [
  { label: "Name", type: "text", placeholder: "Your full name" },
  { label: "Email", type: "email", placeholder: "your@email.com" },
  { label: "Company", type: "text", placeholder: "Your company name" },
];

export default function HeroFormMulti({
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

  // Build fields from items or use defaults
  const fields: FormField[] =
    section.items && section.items.length > 0
      ? section.items.map((item) => ({
          label: item.title || "Field",
          type: item.description || "text",  // subtitle maps to description in SectionItem
          placeholder: item.icon || "",       // description maps to icon for placeholder
        }))
      : DEFAULT_FIELDS;

  // Form state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFieldChange = (label: string, value: string) => {
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    if (projectId) {
      try {
        const apiBase = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        const apiUrl = `${apiBase}/api/forms/${projectId}/submit`;
        await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData["Email"] || formData["email"] || "",
            fields: { ...formData, ...collectBrowserMeta() },
            sectionId: section.id,
            sectionType: "hero-form-multi",
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

      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            backgroundColor: `${accentColor}06`,
            filter: "blur(160px)",
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
                value: content.heading || "Start Your Free Trial",
                sectionId: section.id,
                field: "heading",
                className: "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight",
                style: { fontFamily: `'${headingFont}', sans-serif`, color: textColor },
              })
            : content.heading || "Start Your Free Trial"}
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

        {/* Glass Form Card */}
        <motion.div
          className="max-w-lg mx-auto rounded-2xl p-6 md:p-8 backdrop-blur-xl"
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
                className="text-center py-8"
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
                  Thank you!
                </p>
                <p className="text-sm mt-1" style={{ color: `${textColor}80`, fontFamily: bodyFont }}>
                  We'll be in touch shortly.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                data-lp-form
                onSubmit={handleFormSubmit}
                className="space-y-4 text-left"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {fields.map((field, idx) => (
                  <div key={idx}>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: `${textColor}80`, fontFamily: bodyFont }}
                    >
                      {field.label}
                    </label>
                    <input
                      type={field.type === "email" ? "email" : "text"}
                      value={formData[field.label] || ""}
                      onChange={(e) => handleFieldChange(field.label, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300"
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
                      required={field.type === "email"}
                      disabled={isSubmitting}
                    />
                  </div>
                ))}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
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
                      value: content.formButtonText || "Start Free Trial",
                      sectionId: section.id,
                      field: "formButtonText",
                    })
                  ) : (
                    content.formButtonText || "Start Free Trial"
                  )}
                </button>

                {/* Privacy Text */}
                <p
                  className="text-xs text-center pt-1"
                  style={{ color: `${textColor}50`, fontFamily: bodyFont }}
                >
                  Your data is secure and private.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
