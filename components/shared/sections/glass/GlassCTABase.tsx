"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import {
  Card3DContainer,
  Card3DBody,
  Card3DItem,
} from "@/components/shared/primitives/Card3D";
import { NoiseOverlay } from "@/components/shared/primitives/NoiseOverlay";
import { InsetButton } from "@/components/shared/primitives/InsetButton";

// Whop Brand Colors
const WHOP = {
  dark: "#141212",
  cream: "#FCF6F5",
  orange: "#FA4616",
};

/**
 * Glass CTA Section Base
 * Minimal 3D glass card CTA with heading and button
 */
export function GlassCTABase({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content } = section;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Colors
  const bgColor = content.backgroundColor || WHOP.dark;
  const textColor = content.textColor || WHOP.cream;
  const accentColor = content.accentColor || colorScheme?.accent || WHOP.orange;

  // Typography
  const headingFont = typography?.headingFont || "Acid Grotesk, sans-serif";

  // Default padding
  const DEFAULT_PADDING = { top: 64, bottom: 64 };

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
      <Card3DContainer className="rounded-3xl overflow-hidden">
        <Card3DBody
          variant="prominent"
          radius={24}
          showGlare={true}
          style={{ padding: "48px" }}
        >
          <NoiseOverlay opacity={0.03} baseFrequency={0.7} />

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Heading */}
              {content.heading && content.showHeading !== false && (
                <Card3DItem translateZ={30}>
                  <h2
                    className="text-3xl md:text-4xl font-bold"
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
                </Card3DItem>
              )}

              {/* Subheading */}
              {content.subheading && content.showSubheading !== false && (
                <Card3DItem translateZ={25}>
                  <p
                    className="text-lg max-w-2xl"
                    style={{ color: `${textColor}99` }}
                  >
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
                </Card3DItem>
              )}

              {/* CTA Button */}
              {content.buttonText && content.showButton !== false && (
                <Card3DItem translateZ={40}>
                  <InsetButton
                    href={content.buttonLink || "#"}
                    variant="primary"
                    size="lg"
                  >
                    {renderText
                      ? renderText({
                          value: content.buttonText,
                          sectionId: section.id,
                          field: "buttonText",
                          inline: true,
                        })
                      : content.buttonText}
                  </InsetButton>
                </Card3DItem>
              )}
            </motion.div>
          </div>
        </Card3DBody>
      </Card3DContainer>
    </section>
  );
}

export default GlassCTABase;
