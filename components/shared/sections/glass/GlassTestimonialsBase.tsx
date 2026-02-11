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
 * Glass Testimonials Section Base
 * 3D glass cards for testimonials with avatars and quotes
 */
export function GlassTestimonialsBase({
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

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-3 gap-8 px-6 relative z-10 max-w-6xl mx-auto">
        {items.map((testimonial, i) => (
          <motion.div
            key={testimonial.id || i}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Card3DContainer>
              <Card3DBody variant="default" style={{ padding: "28px" }}>
                {/* Stars */}
                {testimonial.rating && (
                  <Card3DItem translateZ={25} className="flex items-center gap-1 mb-4">
                    {[...Array(Math.min(5, Math.max(0, testimonial.rating)))].map((_, j) => (
                      <span key={j} className="text-lg" style={{ color: accentColor }}>
                        ★
                      </span>
                    ))}
                  </Card3DItem>
                )}

                {/* Quote */}
                {testimonial.description && (
                  <Card3DItem translateZ={35}>
                    <p
                      className="text-base mb-6 italic leading-relaxed"
                      style={{ color: `${textColor}dd` }}
                    >
                      "{renderText
                        ? renderText({
                            value: testimonial.description,
                            sectionId: section.id,
                            field: "description",
                            itemId: testimonial.id,
                            inline: true,
                            multiline: true,
                          })
                        : testimonial.description}"
                    </p>
                  </Card3DItem>
                )}

                {/* Proof Images */}
                {testimonial.proofImages && testimonial.proofImages.length > 0 && (
                  <Card3DItem translateZ={30} className="mb-4">
                    <div className={`grid gap-2 ${testimonial.proofImages.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                      {testimonial.proofImages.map((url, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={url}
                          alt={`Proof screenshot ${imgIndex + 1}`}
                          className="w-full rounded-lg object-cover"
                          style={{ border: `1px solid ${textColor}15` }}
                        />
                      ))}
                    </div>
                  </Card3DItem>
                )}

                {/* Author Info */}
                <Card3DItem translateZ={45} className="flex items-center gap-3">
                  {/* Avatar */}
                  {testimonial.imageUrl && (
                    <div className="relative">
                      <div
                        className="absolute inset-0 rounded-full blur-md"
                        style={{ backgroundColor: accentColor, opacity: 0.25 }}
                      />
                      {renderImage ? (
                        renderImage({
                          src: testimonial.imageUrl,
                          sectionId: section.id,
                          field: "imageUrl",
                          itemId: testimonial.id,
                          className: "relative w-10 h-10 rounded-full object-cover ring-1 ring-white/10",
                          alt: testimonial.author || "Testimonial author",
                        })
                      ) : (
                        <img
                          src={testimonial.imageUrl}
                          alt={testimonial.author || "Testimonial author"}
                          className="relative w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
                        />
                      )}
                    </div>
                  )}

                  {/* Name and Role */}
                  <div className="flex-1">
                    {testimonial.author && (
                      <p className="text-sm font-semibold" style={{ color: textColor }}>
                        {renderText
                          ? renderText({
                              value: testimonial.author,
                              sectionId: section.id,
                              field: "author",
                              itemId: testimonial.id,
                              inline: true,
                            })
                          : testimonial.author}
                      </p>
                    )}
                    {testimonial.role && (
                      <p className="text-xs" style={{ color: `${textColor}70` }}>
                        {renderText
                          ? renderText({
                              value: testimonial.role,
                              sectionId: section.id,
                              field: "role",
                              itemId: testimonial.id,
                              inline: true,
                            })
                          : testimonial.role}
                      </p>
                    )}
                  </div>

                  {/* Result badge */}
                  {testimonial.title && (
                    <span
                      className="px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor: "#10B98125",
                        color: "#10B981",
                        border: "1px solid #10B98140",
                      }}
                    >
                      {renderText
                        ? renderText({
                            value: testimonial.title,
                            sectionId: section.id,
                            field: "title",
                            itemId: testimonial.id,
                            inline: true,
                          })
                        : testimonial.title}
                    </span>
                  )}
                </Card3DItem>
              </Card3DBody>
            </Card3DContainer>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default GlassTestimonialsBase;
