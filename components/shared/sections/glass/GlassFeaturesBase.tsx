"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import {
  Card3DContainer,
  Card3DBody,
  Card3DItem,
} from "@/components/shared/primitives/Card3D";
import { ShimmerText } from "@/components/shared/primitives/ShimmerText";

// Whop Brand Colors
const WHOP = {
  dark: "#141212",
  cream: "#FCF6F5",
  orange: "#FA4616",
};

/**
 * Glass Features Section Base
 * 3D glass cards grid for features with icons
 */
export function GlassFeaturesBase({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content, items = [] } = section;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Colors
  const bgColor = content.backgroundColor || WHOP.dark;
  const textColor = content.textColor || WHOP.cream;
  const accentColor = content.accentColor || colorScheme?.accent || WHOP.orange;

  // Typography
  const headingFont = typography?.headingFont || "Acid Grotesk, sans-serif";

  // Default padding
  const DEFAULT_PADDING = { top: 80, bottom: 80 };

  return (
    <section
      ref={ref}
      className="relative"
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
      }}
    >
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${textColor} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Section Header */}
      <motion.div
        className="text-center mb-12 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        {content.badge && content.showBadge !== false && (
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
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
        )}
        {content.heading && content.showHeading !== false && (
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: textColor, fontFamily: headingFont }}
          >
            {renderText
              ? renderText({
                  value: content.heading,
                  sectionId: section.id,
                  field: "heading",
                  inline: true,
                })
              : content.heading}
          </h2>
        )}
        {content.subheading && content.showSubheading !== false && (
          <p className="text-lg max-w-2xl mx-auto" style={{ color: `${textColor}99` }}>
            {renderText
              ? renderText({
                  value: content.subheading,
                  sectionId: section.id,
                  field: "subheading",
                  inline: true,
                  multiline: true,
                })
              : content.subheading}
          </p>
        )}
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 relative z-10 max-w-6xl mx-auto">
        {items.map((feature, i) => (
          <motion.div
            key={feature.id || i}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <Card3DContainer>
              <Card3DBody variant="subtle" style={{ padding: "28px" }}>
                {/* Icon */}
                {feature.icon && (
                  <Card3DItem translateZ={50}>
                    <div
                      className="text-3xl mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${accentColor}15`,
                        boxShadow: `0 4px 12px ${accentColor}20`,
                      }}
                    >
                      {feature.icon}
                    </div>
                  </Card3DItem>
                )}

                {/* Title */}
                {feature.title && (
                  <Card3DItem translateZ={30}>
                    <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>
                      {renderText
                        ? renderText({
                            value: feature.title,
                            sectionId: section.id,
                            field: "title",
                            itemId: feature.id,
                            inline: true,
                          })
                        : feature.title}
                    </h3>
                  </Card3DItem>
                )}

                {/* Description */}
                {feature.description && (
                  <Card3DItem translateZ={15}>
                    <p className="text-sm leading-relaxed" style={{ color: `${textColor}99` }}>
                      {renderText
                        ? renderText({
                            value: feature.description,
                            sectionId: section.id,
                            field: "description",
                            itemId: feature.id,
                            inline: true,
                            multiline: true,
                          })
                        : feature.description}
                    </p>
                  </Card3DItem>
                )}
              </Card3DBody>
            </Card3DContainer>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default GlassFeaturesBase;
