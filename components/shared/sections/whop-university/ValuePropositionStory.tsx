"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";

/**
 * Value Proposition Story Section
 * Long-form conversational copy with animated highlights
 * Pain points, pull quotes, and scroll-triggered reveals
 */
export function ValuePropositionStory({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content, items = [] } = section;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Colors
  const bgColor = content.backgroundColor || colorScheme.background || "#141212";
  const textColor = content.textColor || colorScheme.text || "#FCF6F5";
  const accentColor = content.accentColor || colorScheme.accent || "#FA4616";

  // Typography
  const headingFont = typography?.headingFont || "Acid Grotesk";
  const bodyFont = typography?.bodyFont || "Inter";

  // Split content into paragraphs
  const paragraphs = content.body?.split("\n\n") || items.map((i: any) => i.text || i.description) || [];

  // Default padding
  const DEFAULT_PADDING = { top: 80, bottom: 128 };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Side gradient accent */}
      <div
        className="absolute left-0 top-1/4 w-1 h-1/2 opacity-60"
        style={{
          background: `linear-gradient(to bottom, transparent, ${accentColor}, transparent)`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Optional opening badge */}
        {content.badge && (
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
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

        {/* Main heading */}
        {content.heading && (
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-center"
            style={{ color: textColor, fontFamily: headingFont }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {renderText
              ? renderText({
                  value: content.heading,
                  sectionId: section.id,
                  field: "heading",
                  inline: true,
                })
              : content.heading}
          </motion.h2>
        )}

        {/* Story paragraphs */}
        <div className="space-y-8">
          {renderText ? (
            <div
              className="text-lg md:text-xl leading-relaxed"
              style={{
                color: `${textColor}cc`,
                fontFamily: bodyFont,
                whiteSpace: 'pre-wrap', // Preserve line breaks in edit mode
              }}
            >
              {renderText({
                value: content.body,
                sectionId: section.id,
                field: "body",
                multiline: true,
              })}
            </div>
          ) : (
            paragraphs.map((paragraph: string, index: number) => (
              <StoryParagraph
                key={index}
                text={paragraph}
                index={index}
                textColor={textColor}
                accentColor={accentColor}
                bodyFont={bodyFont}
              />
            ))
          )}
        </div>

        {/* Pull quote (optional) */}
        {content.pullQuote && (
          <motion.blockquote
            className="my-16 relative"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {/* Gradient border */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
              style={{
                background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}40)`,
              }}
            />

            <p
              className="text-2xl md:text-3xl font-medium italic pl-8"
              style={{
                color: textColor,
                fontFamily: headingFont,
                lineHeight: 1.4,
              }}
            >
              "
              {renderText
                ? renderText({
                    value: content.pullQuote,
                    sectionId: section.id,
                    field: "pullQuote",
                    multiline: true,
                    inline: true,
                  })
                : content.pullQuote}
              "
            </p>

            {content.pullQuoteAuthor && (
              <cite
                className="block mt-4 pl-8 not-italic text-sm"
                style={{ color: `${textColor}60`, fontFamily: bodyFont }}
              >
                — {content.pullQuoteAuthor}
              </cite>
            )}
          </motion.blockquote>
        )}

        {/* Pain points section (optional) */}
        {content.painPoints && content.painPoints.length > 0 && (
          <motion.div
            className="mt-16 p-8 rounded-2xl"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.05)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h3
              className="text-xl font-semibold mb-6"
              style={{ color: "#EF4444", fontFamily: headingFont }}
            >
              Sound familiar?
            </h3>
            <ul className="space-y-4">
              {content.painPoints.map((pain: string, index: number) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <span className="text-red-400 mt-1">✗</span>
                  <span
                    className="text-base"
                    style={{ color: `${textColor}cc`, fontFamily: bodyFont }}
                  >
                    {pain}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Solution teaser (optional) */}
        {content.solutionTeaser && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-lg md:text-xl"
              style={{ color: `${textColor}cc`, fontFamily: bodyFont }}
            >
              {renderText
                ? renderText({
                    value: content.solutionTeaser,
                    sectionId: section.id,
                    field: "solutionTeaser",
                    inline: true,
                  })
                : content.solutionTeaser}
            </p>

            {/* Animated arrow pointing down */}
            <motion.div
              className="mt-8"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke={accentColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/**
 * Individual Story Paragraph with highlight detection
 */
function StoryParagraph({
  text,
  index,
  textColor,
  accentColor,
  bodyFont,
}: {
  text: string;
  index: number;
  textColor: string;
  accentColor: string;
  bodyFont: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Detect text wrapped in **bold** or ==highlight== markers
  const renderHighlightedText = (text: string) => {
    // Replace **text** with bold spans and ==text== with highlighted spans
    const parts = text.split(/(\*\*[^*]+\*\*|==[^=]+=+)/g);

    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const content = part.slice(2, -2);
        return (
          <strong key={i} style={{ color: textColor, fontWeight: 600 }}>
            {content}
          </strong>
        );
      }
      if (part.startsWith("==") && part.endsWith("==")) {
        const content = part.slice(2, -2);
        return (
          <motion.span
            key={i}
            className="relative inline"
            initial={{ backgroundSize: "0% 100%" }}
            whileInView={{ backgroundSize: "100% 100%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              background: `linear-gradient(to right, ${accentColor}30, ${accentColor}30)`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "0 100%",
              padding: "0 4px",
              borderRadius: 4,
            }}
          >
            {content}
          </motion.span>
        );
      }
      return part;
    });
  };

  return (
    <motion.p
      ref={ref}
      className="text-lg md:text-xl leading-relaxed"
      style={{
        color: `${textColor}cc`,
        fontFamily: bodyFont,
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {renderHighlightedText(text)}
    </motion.p>
  );
}
