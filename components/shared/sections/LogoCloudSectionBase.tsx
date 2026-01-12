"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { SectionItem } from "@/lib/page-schema";

export default function LogoCloudSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content, items } = section;

  // Dynamic colors
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  // Get logos from items or brands array
  const logos = items || [];
  const brandNames = content.brands || [];

  // Double for infinite scroll
  const duplicatedLogos = [...logos, ...logos];
  const duplicatedBrands = [...brandNames, ...brandNames];

  return (
    <section
      className="py-16 lg:py-24 relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {content.heading && (
            <span
              className="block text-sm uppercase tracking-wider mb-8"
              style={{ color: `${textColor}50`, fontFamily: bodyFont }}
            >
              {renderText ? (
                renderText({
                  value: content.heading,
                  sectionId: section.id,
                  field: "heading",
                  className: "",
                })
              ) : (
                content.heading
              )}
            </span>
          )}
        </motion.div>

        {/* Logo Marquee */}
        {logos.length > 0 ? (
          <div className="relative">
            {/* Gradient masks */}
            <div
              className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
              style={{ background: `linear-gradient(to right, ${bgColor}, transparent)` }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
              style={{ background: `linear-gradient(to left, ${bgColor}, transparent)` }}
            />

            <div className="overflow-hidden">
              <motion.div
                className="flex gap-16 items-center"
                animate={{ x: [0, -50 * logos.length] }}
                transition={{
                  duration: logos.length * 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {duplicatedLogos.map((logo: SectionItem, index: number) => (
                  <div
                    key={`${logo.id}-${index}`}
                    className="flex-shrink-0 h-12 px-4 flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
                  >
                    {logo.imageUrl ? (
                      renderImage ? (
                        renderImage({
                          src: logo.imageUrl,
                          sectionId: section.id,
                          field: "imageUrl",
                          itemId: logo.id,
                          className: "h-full w-auto object-contain max-w-[160px]",
                          alt: logo.title || "Partner logo",
                        })
                      ) : (
                        <img
                          src={logo.imageUrl}
                          alt={logo.title || "Partner logo"}
                          className="h-full w-auto object-contain max-w-[160px]"
                        />
                      )
                    ) : logo.title ? (
                      <span
                        className="text-xl font-semibold whitespace-nowrap"
                        style={{ color: textColor, fontFamily: headingFont }}
                      >
                        {logo.title}
                      </span>
                    ) : null}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        ) : brandNames.length > 0 ? (
          /* Text-based brand marquee */
          <div className="relative">
            {/* Gradient masks */}
            <div
              className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
              style={{ background: `linear-gradient(to right, ${bgColor}, transparent)` }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
              style={{ background: `linear-gradient(to left, ${bgColor}, transparent)` }}
            />

            <div className="overflow-hidden">
              <motion.div
                className="flex gap-12 items-center"
                animate={{ x: [0, -100 * brandNames.length] }}
                transition={{
                  duration: brandNames.length * 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {duplicatedBrands.map((brand: string, index: number) => (
                  <div
                    key={`brand-${index}`}
                    className="flex-shrink-0 flex items-center gap-8"
                  >
                    <span
                      className="text-2xl font-semibold opacity-40 hover:opacity-80 transition-opacity whitespace-nowrap"
                      style={{ color: textColor, fontFamily: headingFont }}
                    >
                      {brand}
                    </span>
                    <span
                      className="text-2xl opacity-20"
                      style={{ color: accentColor }}
                    >
                      &bull;
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        ) : (
          /* Empty state */
          <motion.div
            className="text-center py-12 rounded-2xl"
            style={{
              color: textColor,
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.1)",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="opacity-50">Add logos or brand names in the properties panel</p>
          </motion.div>
        )}

        {/* Subheading below logos */}
        {content.subheading && (
          <motion.div
            className="text-center text-sm mt-8"
            style={{ color: `${textColor}40` }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {renderText ? (
              renderText({
                value: content.subheading,
                sectionId: section.id,
                field: "subheading",
                className: "",
              })
            ) : (
              content.subheading
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
