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
import { InsetButton } from "@/components/shared/primitives/InsetButton";

// Whop Brand Colors
const WHOP = {
  dark: "#141212",
  cream: "#FCF6F5",
  orange: "#FA4616",
};

/**
 * Glass Pricing Section Base
 * 3D glass cards for pricing tiers with features
 */
export function GlassPricingBase({
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

      {/* Pricing Grid */}
      <div className="grid md:grid-cols-3 gap-8 px-6 relative z-10 items-start max-w-6xl mx-auto">
        {items.map((plan, i) => (
          <motion.div
            key={plan.id || i}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="relative"
          >
            {/* Popular badge */}
            {plan.popular && (
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold z-30"
                style={{
                  backgroundColor: accentColor,
                  color: textColor,
                  boxShadow: `0 4px 14px ${accentColor}50`,
                }}
              >
                MOST POPULAR
              </div>
            )}

            <Card3DContainer>
              <Card3DBody
                variant={plan.popular ? "prominent" : "default"}
                style={{
                  padding: "32px",
                  border: plan.popular ? `2px solid ${accentColor}` : undefined,
                }}
              >
                {/* Plan Header */}
                <Card3DItem translateZ={20}>
                  <div className="text-center mb-6">
                    {/* Plan Name */}
                    {plan.title && (
                      <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>
                        {renderText
                          ? renderText({
                              value: plan.title,
                              sectionId: section.id,
                              field: "title",
                              itemId: plan.id,
                              inline: true,
                            })
                          : plan.title}
                      </h3>
                    )}

                    {/* Price */}
                    {plan.price && (
                      <div className="flex items-baseline justify-center gap-1">
                        <span
                          className="text-5xl font-black"
                          style={{ color: textColor, fontFamily: headingFont }}
                        >
                          {renderText
                            ? renderText({
                                value: plan.price,
                                sectionId: section.id,
                                field: "price",
                                itemId: plan.id,
                                inline: true,
                              })
                            : plan.price}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {plan.description && (
                      <p className="text-sm mt-2" style={{ color: `${textColor}80` }}>
                        {renderText
                          ? renderText({
                              value: plan.description,
                              sectionId: section.id,
                              field: "description",
                              itemId: plan.id,
                              inline: true,
                            })
                          : plan.description}
                      </p>
                    )}
                  </div>
                </Card3DItem>

                {/* Features List */}
                {plan.features && plan.features.length > 0 && (
                  <Card3DItem translateZ={35}>
                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, j) => (
                        <div key={j} className="flex items-center gap-3">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                            style={{ backgroundColor: "#10B98120", color: "#10B981" }}
                          >
                            ✓
                          </span>
                          <span className="text-sm" style={{ color: `${textColor}cc` }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card3DItem>
                )}

                {/* CTA Button */}
                {plan.buttonText && (
                  <Card3DItem translateZ={50}>
                    <InsetButton
                      href={plan.buttonLink || "#"}
                      variant={plan.popular ? "primary" : "default"}
                      size="md"
                      fullWidth
                    >
                      {renderText
                        ? renderText({
                            value: plan.buttonText,
                            sectionId: section.id,
                            field: "buttonText",
                            itemId: plan.id,
                            inline: true,
                          })
                        : plan.buttonText}
                    </InsetButton>
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

export default GlassPricingBase;
