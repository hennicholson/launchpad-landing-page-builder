"use client";

import { motion } from "framer-motion";
import type { CTAVariant, HeadingStyle } from "@/lib/page-schema";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import SectionButton, { getButtonPropsFromContent } from "./SectionButton";
import { SectionBackground } from "../SectionBackground";

// Helper to determine if a color is light or dark
function isLightColor(color: string): boolean {
  if (!color || color === "transparent") return false;
  let hex = color.toLowerCase().replace(/[^0-9a-f]/g, "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) return false;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

// Get contrasting text color
function getContrastTextColor(bgColor: string): string {
  return isLightColor(bgColor) ? "#000000" : "#ffffff";
}

// Helper to get heading styles based on headingStyle setting
function getHeadingStyles(
  headingStyle: HeadingStyle,
  textColor: string,
  accentColor: string,
  primaryColor: string
): React.CSSProperties {
  switch (headingStyle) {
    case "gradient":
      return {
        background: `linear-gradient(135deg, ${textColor} 0%, ${accentColor} 50%, ${textColor} 100%)`,
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      };
    case "outline":
      return {
        color: "transparent",
        WebkitTextStroke: `2px ${textColor}`,
        textShadow: `0 0 40px ${accentColor}30`,
      };
    case "solid":
    default:
      return {
        color: textColor,
      };
  }
}


function TrustIndicators({ textColor }: { textColor: string }) {
  return (
    <motion.div
      className="mt-16 flex flex-wrap items-center justify-center gap-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="flex items-center gap-2" style={{ color: `${textColor}50` }}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <span className="text-xs uppercase tracking-wider">Secure</span>
      </div>
      <div className="flex items-center gap-2" style={{ color: `${textColor}50` }}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs uppercase tracking-wider">Instant Access</span>
      </div>
      <div className="flex items-center gap-2" style={{ color: `${textColor}50` }}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
        <span className="text-xs uppercase tracking-wider">Guaranteed</span>
      </div>
    </motion.div>
  );
}

// ==================== CENTERED VARIANT ====================
function CTACentered({
  section,
  bgColor,
  textColor,
  accentColor,
  primaryColor,
  headingFont,
  bodyFont,
  headingStyle,
  renderText,
}: {
  section: BaseSectionProps["section"];
  bgColor: string;
  textColor: string;
  accentColor: string;
  primaryColor: string;
  headingFont: string;
  bodyFont: string;
  headingStyle: HeadingStyle;
  renderText?: BaseSectionProps["renderText"];
}) {
  const { content } = section;
  const headingStyles = getHeadingStyles(headingStyle, textColor, accentColor, primaryColor);

  return (
    <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
      {content.showBadge !== false && content.badge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-8"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
            }}
          >
            {renderText ? renderText({ value: content.badge, sectionId: section.id, field: "badge", className: "" }) : content.badge}
          </span>
        </motion.div>
      )}

      {content.showHeading !== false && content.heading && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="text-3xl sm:text-5xl lg:text-7xl uppercase leading-[0.95] mb-8"
            style={{ fontFamily: headingFont, ...headingStyles }}
          >
            {renderText ? renderText({ value: content.heading || "", sectionId: section.id, field: "heading", className: "" }) : content.heading}
          </h2>
        </motion.div>
      )}

      {content.showSubheading !== false && content.subheading && (
        <motion.div
          className="max-w-xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="block text-lg sm:text-xl leading-relaxed" style={{ color: `${textColor}70`, fontFamily: bodyFont }}>
            {renderText ? renderText({ value: content.subheading || "", sectionId: section.id, field: "subheading", className: "" }) : content.subheading}
          </span>
        </motion.div>
      )}

      {content.showButton !== false && content.buttonText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <SectionButton
            text={content.buttonText || ""}
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
        </motion.div>
      )}

      {content.showBodyText !== false && content.bodyText && (
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span className="block text-sm" style={{ color: `${textColor}60` }}>
            {renderText ? renderText({ value: content.bodyText, sectionId: section.id, field: "bodyText", className: "" }) : content.bodyText}
          </span>
        </motion.div>
      )}

      <TrustIndicators textColor={textColor} />
    </div>
  );
}

// ==================== SPLIT VARIANT ====================
function CTASplit({
  section,
  bgColor,
  textColor,
  accentColor,
  primaryColor,
  headingFont,
  bodyFont,
  headingStyle,
  renderText,
}: {
  section: BaseSectionProps["section"];
  bgColor: string;
  textColor: string;
  accentColor: string;
  primaryColor: string;
  headingFont: string;
  bodyFont: string;
  headingStyle: HeadingStyle;
  renderText?: BaseSectionProps["renderText"];
}) {
  const { content } = section;
  const headingStyles = getHeadingStyles(headingStyle, textColor, accentColor, primaryColor);

  return (
    <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {content.showBadge !== false && content.badge && (
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
              style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
            >
              {content.badge}
            </span>
          )}

          {content.showHeading !== false && content.heading && (
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95] mb-6"
              style={{ fontFamily: headingFont, ...headingStyles }}
            >
              {renderText ? renderText({ value: content.heading || "", sectionId: section.id, field: "heading", className: "" }) : content.heading}
            </h2>
          )}

          {content.showSubheading !== false && content.subheading && (
            <div className="mb-8">
              <span className="block text-lg leading-relaxed" style={{ color: `${textColor}70`, fontFamily: bodyFont }}>
                {renderText ? renderText({ value: content.subheading || "", sectionId: section.id, field: "subheading", className: "" }) : content.subheading}
              </span>
            </div>
          )}

          {content.showBodyText !== false && content.bodyText && (
            <p className="text-sm" style={{ color: `${textColor}50` }}>{content.bodyText}</p>
          )}
        </motion.div>

        <motion.div
          className="flex flex-col items-center lg:items-end"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {content.showButton !== false && content.buttonText && (
            <SectionButton
              text={content.buttonText || ""}
              link={content.buttonLink || "#"}
              sectionId={section.id}
              {...getButtonPropsFromContent(content)}
              sectionBgColor={bgColor}
              primaryColor={primaryColor}
              accentColor={accentColor}
              schemeTextColor={textColor}
              bodyFont={bodyFont}
              large
              renderText={renderText}
            />
          )}

          <div className="mt-8 flex flex-wrap gap-4" style={{ color: `${textColor}50` }}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-xs">Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">Instant</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ==================== BANNER VARIANT ====================
function CTABanner({
  section,
  bgColor,
  primaryColor,
  accentColor,
  headingFont,
  bodyFont,
  renderText,
}: {
  section: BaseSectionProps["section"];
  bgColor: string;
  primaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  renderText?: BaseSectionProps["renderText"];
}) {
  const { content } = section;

  // Calculate proper contrast text color for the banner (which has primaryColor bg)
  const bannerTextColor = getContrastTextColor(primaryColor);
  const bannerTextColorSubtle = `${bannerTextColor}cc`; // 80% opacity

  return (
    <div className="relative">
      <motion.div
        className="py-12 sm:py-16"
        style={{ backgroundColor: primaryColor }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left">
              {content.showHeading !== false && content.heading && (
                <h2
                  className="text-2xl sm:text-3xl lg:text-4xl uppercase leading-tight mb-2"
                  style={{ fontFamily: headingFont, color: bannerTextColor }}
                >
                  {renderText ? renderText({ value: content.heading || "", sectionId: section.id, field: "heading", className: "" }) : content.heading}
                </h2>
              )}
              {content.showSubheading !== false && content.subheading && (
                <p className="text-sm sm:text-base" style={{ color: bannerTextColorSubtle, fontFamily: bodyFont }}>
                  {content.subheading}
                </p>
              )}
            </div>

            {content.showButton !== false && content.buttonText && (
              <SectionButton
                text={content.buttonText || ""}
                link={content.buttonLink || "#"}
                sectionId={section.id}
                {...getButtonPropsFromContent(content)}
                // Banner variant defaults: inverted colors if no custom colors set
                bgColor={content.buttonBgColor ?? bannerTextColor}
                textColor={content.buttonTextColor ?? primaryColor}
                sectionBgColor={primaryColor}
                primaryColor={bannerTextColor}
                accentColor={accentColor}
                schemeTextColor={bannerTextColor}
                bodyFont={bodyFont}
                renderText={renderText}
                className="flex-shrink-0"
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ==================== MINIMAL VARIANT ====================
function CTAMinimal({
  section,
  bgColor,
  textColor,
  accentColor,
  primaryColor,
  headingFont,
  bodyFont,
  headingStyle,
  renderText,
}: {
  section: BaseSectionProps["section"];
  bgColor: string;
  textColor: string;
  accentColor: string;
  primaryColor: string;
  headingFont: string;
  bodyFont: string;
  headingStyle: HeadingStyle;
  renderText?: BaseSectionProps["renderText"];
}) {
  const { content } = section;
  const headingStyles = getHeadingStyles(headingStyle, textColor, accentColor, primaryColor);

  return (
    <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {content.showHeading !== false && content.heading && (
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl uppercase leading-[0.95] mb-6"
            style={{ fontFamily: headingFont, ...headingStyles }}
          >
            {renderText ? renderText({ value: content.heading || "", sectionId: section.id, field: "heading", className: "" }) : content.heading}
          </h2>
        )}

        {content.showSubheading !== false && content.subheading && (
          <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: `${textColor}60`, fontFamily: bodyFont }}>
            {renderText ? renderText({ value: content.subheading, sectionId: section.id, field: "subheading", className: "" }) : content.subheading}
          </p>
        )}

        {content.showButton !== false && content.buttonText && (
          <SectionButton
            text={content.buttonText || ""}
            link={content.buttonLink || "#"}
            sectionId={section.id}
            {...getButtonPropsFromContent(content)}
            // Minimal variant defaults to underline style if no variant set
            variant={content.buttonVariant ?? "underline"}
            sectionBgColor={bgColor}
            primaryColor={primaryColor}
            accentColor={accentColor}
            schemeTextColor={textColor}
            bodyFont={bodyFont}
            renderText={renderText}
          />
        )}
      </motion.div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function CTASectionBase({
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
  const primaryColor = colorScheme.primary;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  // Get variant and heading style
  const variant: CTAVariant = content.ctaVariant || "centered";
  const headingStyle: HeadingStyle = content.headingStyle || "solid";

  const sharedProps = {
    section,
    bgColor,
    textColor,
    accentColor,
    primaryColor,
    headingFont,
    bodyFont,
    headingStyle,
    renderText,
  };

  const DEFAULT_PADDING = { top: 96, bottom: 160 };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
      <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />
      {/* Background effects (not for banner) */}
      {variant !== "banner" && variant !== "minimal" && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px]"
              style={{ backgroundColor: `${accentColor}08` }}
            />
            <div
              className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
              style={{ backgroundColor: `${primaryColor}06` }}
            />
          </motion.div>

          {/* Grid background - toggleable */}
          {content.showGridBackground !== false && (
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(${textColor} 1px, transparent 1px), linear-gradient(90deg, ${textColor} 1px, transparent 1px)`,
                backgroundSize: "64px 64px",
              }}
            />
          )}
        </>
      )}

      {/* Render based on variant */}
      {variant === "centered" && <CTACentered {...sharedProps} />}
      {variant === "split" && <CTASplit {...sharedProps} />}
      {variant === "banner" && <CTABanner {...sharedProps} />}
      {variant === "minimal" && <CTAMinimal {...sharedProps} />}

      {/* Add keyframe animation for shine effect - adaptive to background color */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .shine-effect {
          background: linear-gradient(90deg, transparent, ${isLightColor(bgColor) ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)"}, transparent);
          transform: translateX(-100%);
          opacity: 0;
          transition: opacity 0.5s;
        }
        .group:hover .shine-effect {
          opacity: 1;
          animation: shine 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
