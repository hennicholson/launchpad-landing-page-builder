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
 * Glass Founders Section Base
 * 3D glass cards for team/founders with avatars and bios
 */
export function GlassFoundersBase({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
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

      {/* Founders Grid */}
      <div className="grid md:grid-cols-3 gap-8 px-6 relative z-10 max-w-6xl mx-auto">
        {items.map((founder, i) => (
          <motion.div
            key={founder.id || i}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            <Card3DContainer className="h-full">
              <Card3DBody variant="default" style={{ padding: "40px" }} className="h-full flex flex-col">
                <div className="text-center flex flex-col flex-1">
                  {/* Avatar */}
                  {founder.imageUrl && (
                    <Card3DItem translateZ={60} className="mb-5 inline-block">
                      <div className="relative">
                        <div
                          className="absolute inset-0 rounded-full blur-xl"
                          style={{ backgroundColor: accentColor, opacity: 0.3 }}
                        />
                        {renderImage ? (
                          renderImage({
                            src: founder.imageUrl,
                            sectionId: section.id,
                            field: "imageUrl",
                            itemId: founder.id,
                            className: "relative w-24 h-24 rounded-full object-cover ring-2 ring-white/10",
                            alt: founder.title || "Team member",
                          })
                        ) : (
                          <img
                            src={founder.imageUrl}
                            alt={founder.title || "Team member"}
                            className="relative w-24 h-24 rounded-full object-cover ring-2 ring-white/10"
                          />
                        )}
                      </div>
                    </Card3DItem>
                  )}

                  {/* Label badge */}
                  {founder.label && (
                    <Card3DItem translateZ={35} className="mb-2">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                      >
                        {renderText
                          ? renderText({
                              value: founder.label,
                              sectionId: section.id,
                              field: "label",
                              itemId: founder.id,
                              inline: true,
                            })
                          : founder.label}
                      </span>
                    </Card3DItem>
                  )}

                  {/* Name */}
                  {founder.title && (
                    <Card3DItem translateZ={40}>
                      <h3 className="text-xl font-bold mb-1" style={{ color: textColor }}>
                        {renderText
                          ? renderText({
                              value: founder.title,
                              sectionId: section.id,
                              field: "title",
                              itemId: founder.id,
                              inline: true,
                            })
                          : founder.title}
                      </h3>
                    </Card3DItem>
                  )}

                  {/* Role */}
                  {founder.role && (
                    <Card3DItem translateZ={30}>
                      <p className="text-sm font-medium mb-3" style={{ color: accentColor }}>
                        {renderText
                          ? renderText({
                              value: founder.role,
                              sectionId: section.id,
                              field: "role",
                              itemId: founder.id,
                              inline: true,
                            })
                          : founder.role}
                      </p>
                    </Card3DItem>
                  )}

                  {/* Bio */}
                  {founder.bio && (
                    <Card3DItem translateZ={20} className="flex-1">
                      <p className="text-sm mb-5 leading-relaxed" style={{ color: `${textColor}bb` }}>
                        {renderText
                          ? renderText({
                              value: founder.bio,
                              sectionId: section.id,
                              field: "bio",
                              itemId: founder.id,
                              inline: true,
                              multiline: true,
                            })
                          : founder.bio}
                      </p>
                    </Card3DItem>
                  )}

                  {/* Feature badges from features array */}
                  {founder.features && founder.features.length > 0 && (
                    <Card3DItem translateZ={50} className="flex gap-2 justify-center flex-wrap mt-auto pt-3">
                      {founder.features.map((badge, j) => (
                        <span
                          key={j}
                          className="px-3 py-1.5 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: `${accentColor}20`,
                            color: accentColor,
                            border: `1px solid ${accentColor}40`,
                            boxShadow: `0 2px 8px ${accentColor}15`,
                          }}
                        >
                          {badge}
                        </span>
                      ))}
                    </Card3DItem>
                  )}
                </div>
              </Card3DBody>
            </Card3DContainer>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default GlassFoundersBase;
