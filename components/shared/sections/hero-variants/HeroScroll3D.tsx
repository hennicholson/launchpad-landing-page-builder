"use client";

import type { BaseSectionProps } from "@/lib/shared-section-types";
import { ContainerScroll } from "../../primitives/scroll/ContainerScroll";
import { AnimatedMesh } from "../../primitives/background/AnimatedMesh";
import { ParticleField } from "../../primitives/particles/ParticleField";
import { motion } from "framer-motion";
import SectionButton, { getButtonPropsFromContent } from "../SectionButton";
import { SectionBackground } from "../../SectionBackground";

const DEFAULT_PADDING = { top: 80, bottom: 80 };

export default function HeroScroll3D({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content } = section;

  // Dynamic colors from props
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary || accentColor;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  // Title Component (Header content that scrolls up)
  const titleComponent = (
    <>
      <h1
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-4"
        style={{ fontFamily: headingFont, color: textColor }}
      >
        {renderText ? (
          renderText({
            value: content.heading || content.cardTitle || "Unleash the power of",
            sectionId: section.id,
            field: "heading",
            className: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold",
            style: { color: textColor, fontFamily: headingFont },
          })
        ) : (
          content.heading || content.cardTitle || "Unleash the power of"
        )}
      </h1>

      {content.accentHeading && (
        <span
          className="text-4xl md:text-[6rem] font-bold mt-1 leading-none block"
          style={{ fontFamily: headingFont, color: accentColor }}
        >
          {renderText ? (
            renderText({
              value: content.accentHeading,
              sectionId: section.id,
              field: "accentHeading",
              className: "text-4xl md:text-[6rem] font-bold mt-1 leading-none",
              style: { color: accentColor, fontFamily: headingFont },
            })
          ) : (
            content.accentHeading
          )}
        </span>
      )}

      {content.subheading && (
        <p
          className="text-base sm:text-lg mt-6 max-w-2xl mx-auto"
          style={{ fontFamily: bodyFont, color: `${textColor}cc` }}
        >
          {renderText ? (
            renderText({
              value: content.subheading,
              sectionId: section.id,
              field: "subheading",
              multiline: true,
              className: "text-base sm:text-lg mt-6",
              style: { color: `${textColor}cc`, fontFamily: bodyFont },
            })
          ) : (
            content.subheading
          )}
        </p>
      )}
    </>
  );

  return (
    <div
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
        paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
        minHeight: "100vh",
      }}
    >
      {/* User-configurable Background Effect */}
      <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatedMesh
          colors={[`${accentColor}80`, `${primaryColor}60`, `${accentColor}70`]}
          speed={0.5}
          opacity={0.1}
          morphIntensity={0.5}
        />

        <ParticleField
          count={100}
          color={accentColor}
          size={2}
          speed={0.3}
          connectionDistance={80}
          connectionOpacity={0.15}
          fadeEdges
          interactive
          interactionRadius={120}
        />
      </div>

      {/* ContainerScroll with 21st.dev effect */}
      <ContainerScroll titleComponent={titleComponent}>
        {(content.imageUrl || content.cardImageUrl) ? (
          renderImage ? (
            renderImage({
              src: content.imageUrl || content.cardImageUrl,
              sectionId: section.id,
              field: content.imageUrl ? "imageUrl" : "cardImageUrl",
              className: "mx-auto rounded-2xl object-cover h-full object-center",
              alt: content.heading || content.cardTitle || "hero",
            })
          ) : (
            <img
              src={content.imageUrl || content.cardImageUrl}
              alt={content.heading || content.cardTitle || "hero"}
              className="mx-auto rounded-2xl object-cover h-full object-center"
              draggable={false}
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800">
            <div className="text-center">
              <svg
                className="w-24 h-24 mx-auto opacity-20 mb-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm opacity-40 text-white" style={{ fontFamily: bodyFont }}>
                Add an image to see the scroll effect
              </p>
            </div>
          </div>
        )}
      </ContainerScroll>

      {/* CTA Buttons Below */}
      <motion.div
        className="relative z-20 flex flex-wrap items-center justify-center gap-4 pb-20 px-6 -mt-[300px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
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
            renderText={renderText}
          />
        )}

        {content.showSecondaryButton !== false && content.secondaryButtonText && (
          <SectionButton
            text={content.secondaryButtonText || ""}
            link={content.secondaryButtonLink || "#"}
            sectionId={section.id}
            {...getButtonPropsFromContent(content, "secondary")}
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
