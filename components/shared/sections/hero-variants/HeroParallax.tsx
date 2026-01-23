"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { SectionBackground } from "../../SectionBackground";
import { AnimatedMesh } from "../../primitives/background/AnimatedMesh";
import { GridPattern } from "../../primitives/background/GridPattern";
import { FloatingElements } from "../../primitives/particles/FloatingElements";
import { ParallaxContainer } from "../../primitives/scroll/ParallaxContainer";
import { TiltCard } from "../../primitives/scroll/TiltCard";
import { MagneticButton } from "../../primitives/cursor/MagneticButton";
import { SpotlightCursor } from "../../primitives/cursor/SpotlightCursor";

// Gallery image type
interface GalleryImage {
  url: string;
  title?: string;
}

// Default placeholder gallery images
const generateDefaultGallery = (): GalleryImage[] =>
  Array.from({ length: 18 }, (_, i) => ({
    url: `https://images.unsplash.com/photo-${1500000000000 + i * 100000000}?w=400&h=400&fit=crop`,
    title: `Project ${i + 1}`,
  }));

export default function HeroParallax({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content, items = [] } = section;
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for parallax layers
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Scroll position in pixels for background layers
  const scrollY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 500]),
    { stiffness: 100, damping: 30 }
  );

  // Scroll-based opacity for bottom gradient
  const bottomGradientOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Dynamic colors
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary || accentColor;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  const DEFAULT_PADDING = { top: 80, bottom: 120 };

  // Get gallery images from content or use defaults
  const getGalleryImages = (): GalleryImage[] => {
    if (content.galleryImages && content.galleryImages.length > 0) {
      return content.galleryImages as GalleryImage[];
    }
    if (items && items.length > 0) {
      return items.map((item: any) => ({
        url: item.imageUrl || item.image || "",
        title: item.title,
      }));
    }
    return generateDefaultGallery();
  };

  const galleryImages = getGalleryImages();

  // Ensure we have 18 images by repeating if necessary
  const normalizedGallery = [...galleryImages];
  while (normalizedGallery.length < 18) {
    normalizedGallery.push(...galleryImages.slice(0, 18 - normalizedGallery.length));
  }

  // Split into 3 rows of 6
  const row1 = normalizedGallery.slice(0, 6);
  const row2 = normalizedGallery.slice(6, 12);
  const row3 = normalizedGallery.slice(12, 18);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />

      <section
        className="relative min-h-screen"
        style={{
          backgroundColor: bgColor,
          paddingTop: content.paddingTop ?? DEFAULT_PADDING.top,
          paddingBottom: content.paddingBottom ?? DEFAULT_PADDING.bottom,
        }}
      >
        {/* ========== DEPTH LAYERS BACKGROUND ========== */}

        {/* Layer 1: Base gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 120% 80% at 50% 0%, ${accentColor}10, transparent 60%)`,
          }}
        />

        {/* Layer 2: Animated mesh (slowest parallax) */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: useTransform(scrollY, (v) => v * 0.1) }}
        >
          <AnimatedMesh
            colors={[`${accentColor}60`, `${primaryColor}40`, `${accentColor}50`]}
            speed={0.6}
            opacity={0.06}
            morphIntensity={0.3}
          />
        </motion.div>

        {/* Layer 3: Grid pattern (medium parallax) */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: useTransform(scrollY, (v) => v * 0.2) }}
        >
          <GridPattern
            cellSize={80}
            pattern="grid"
            color={textColor}
            opacity={0.08}
            fadeEdges
          />
        </motion.div>

        {/* Layer 4: Floating elements (fastest parallax) */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: useTransform(scrollY, (v) => v * 0.4) }}
        >
          <FloatingElements
            count={15}
            speed={0.8}
            direction="random"
            spread={200}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: `${accentColor}4d` }}
            />
          </FloatingElements>
        </motion.div>

        {/* Spotlight cursor effect */}
        <SpotlightCursor
          size={800}
          color={accentColor}
          intensity={0.12}
          blur={150}
          mix="screen"
        />

        {/* ========== CONTENT ========== */}
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          {/* Heading Section */}
          <div className="text-center space-y-6 mb-16 md:mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1
                className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-tight"
                style={{ fontFamily: headingFont, color: textColor }}
              >
                {renderText ? (
                  renderText({
                    value: content.heading || "Explore Possibilities",
                    sectionId: section.id,
                    field: "heading",
                    className: "text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight leading-tight",
                    style: { color: textColor, fontFamily: headingFont },
                  })
                ) : (
                  content.heading || "Explore Possibilities"
                )}
              </h1>
              {content.accentHeading && (
                <motion.div
                  className="mt-4 text-5xl sm:text-6xl lg:text-8xl font-bold"
                  style={{ fontFamily: headingFont, color: accentColor }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  {renderText ? (
                    renderText({
                      value: content.accentHeading,
                      sectionId: section.id,
                      field: "accentHeading",
                      className: "text-5xl sm:text-6xl lg:text-8xl font-bold",
                      style: { color: accentColor, fontFamily: headingFont },
                    })
                  ) : (
                    content.accentHeading
                  )}
                </motion.div>
              )}
            </motion.div>

            {content.subheading && (
              <motion.p
                className="text-lg sm:text-xl max-w-3xl mx-auto"
                style={{ fontFamily: bodyFont, color: `${textColor}b3` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {renderText ? (
                  renderText({
                    value: content.subheading,
                    sectionId: section.id,
                    field: "subheading",
                    multiline: true,
                    inline: true,
                    className: "text-lg sm:text-xl",
                    style: { color: `${textColor}b3`, fontFamily: bodyFont },
                  })
                ) : (
                  content.subheading
                )}
              </motion.p>
            )}
          </div>

          {/* ========== 3-ROW GALLERY WITH PARALLAX DEPTH ========== */}
          <div className="space-y-8 md:space-y-12">
            {/* Row 1 - Slowest (foreground, sharpest) */}
            <GalleryRow
              images={row1}
              speed={0.2}
              delay={0.2}
              blur={0}
              sectionId={section.id}
              renderImage={renderImage}
              bgColor={bgColor}
              textColor={textColor}
              accentColor={accentColor}
              bodyFont={bodyFont}
              rowIndex={0}
            />

            {/* Row 2 - Medium (middle ground, slight blur) */}
            <GalleryRow
              images={row2}
              speed={0.5}
              delay={0.4}
              blur={0.5}
              sectionId={section.id}
              renderImage={renderImage}
              bgColor={bgColor}
              textColor={textColor}
              accentColor={accentColor}
              bodyFont={bodyFont}
              rowIndex={1}
            />

            {/* Row 3 - Fastest (background, most blur) */}
            <GalleryRow
              images={row3}
              speed={0.8}
              delay={0.6}
              blur={1}
              sectionId={section.id}
              renderImage={renderImage}
              bgColor={bgColor}
              textColor={textColor}
              accentColor={accentColor}
              bodyFont={bodyFont}
              rowIndex={2}
            />
          </div>
        </div>

        {/* Scroll-Based Gradient Fade Overlay */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${bgColor}, transparent)`,
            opacity: bottomGradientOpacity,
          }}
        />
      </section>
    </div>
  );
}

// ========== GALLERY ROW COMPONENT ==========
interface GalleryRowProps {
  images: GalleryImage[];
  speed: number;
  delay: number;
  blur: number;
  sectionId: string;
  renderImage?: any;
  bgColor: string;
  textColor: string;
  accentColor: string;
  bodyFont: string;
  rowIndex: number;
}

function GalleryRow({
  images,
  speed,
  delay,
  blur,
  sectionId,
  renderImage,
  bgColor,
  textColor,
  accentColor,
  bodyFont,
  rowIndex,
}: GalleryRowProps) {
  return (
    <ParallaxContainer speed={speed} direction="up">
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: delay,
            },
          },
        }}
      >
        {images.map((image, index) => (
          <motion.div
            key={`row${rowIndex}-${index}`}
            variants={{
              hidden: { opacity: 0, y: 60, scale: 0.8 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                },
              },
            }}
          >
            <GalleryCard
              image={image}
              index={index}
              blur={blur}
              sectionId={sectionId}
              renderImage={renderImage}
              bgColor={bgColor}
              textColor={textColor}
              accentColor={accentColor}
              bodyFont={bodyFont}
              rowIndex={rowIndex}
            />
          </motion.div>
        ))}
      </motion.div>
    </ParallaxContainer>
  );
}

// ========== GALLERY CARD COMPONENT ==========
interface GalleryCardProps {
  image: GalleryImage;
  index: number;
  blur: number;
  sectionId: string;
  renderImage?: any;
  bgColor: string;
  textColor: string;
  accentColor: string;
  bodyFont: string;
  rowIndex: number;
}

function GalleryCard({
  image,
  index,
  blur,
  sectionId,
  renderImage,
  bgColor,
  textColor,
  accentColor,
  bodyFont,
  rowIndex,
}: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <MagneticButton strength={0.2} radius={100}>
      <TiltCard
        tiltIntensity={0.3}
        rotateXRange={[-8, 8]}
        rotateYRange={[-8, 8]}
        scaleOnHover={1.05}
        glare
        glareOpacity={0.2}
      >
        <div
          className="relative overflow-hidden rounded-2xl border transition-all duration-300 group cursor-pointer"
          style={{
            backgroundColor: `${bgColor}60`,
            borderColor: isHovered ? `${accentColor}60` : `${textColor}20`,
            boxShadow: isHovered
              ? `0 12px 32px ${accentColor}40`
              : `0 8px 24px ${textColor}20`,
            filter: isHovered ? "blur(0px)" : `blur(${blur}px)`,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Image */}
          <div className="aspect-square overflow-hidden">
            {image.url ? (
              renderImage ? (
                renderImage({
                  src: image.url,
                  sectionId: sectionId,
                  field: `galleryImage${rowIndex * 6 + index}`,
                  className:
                    "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
                  alt: image.title || `Gallery ${rowIndex * 6 + index + 1}`,
                })
              ) : (
                <img
                  src={image.url}
                  alt={image.title || `Gallery ${rowIndex * 6 + index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              )
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: `${textColor}10` }}
              >
                <svg
                  className="w-12 h-12 opacity-20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: textColor }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Overlay gradient on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `linear-gradient(to top, ${bgColor}e6, transparent 50%)`,
            }}
          />

          {/* Optional title overlay on hover */}
          {image.title && (
            <div
              className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
              style={{
                backgroundColor: `${bgColor}f2`,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <p
                className="text-xs font-medium truncate"
                style={{ color: textColor, fontFamily: bodyFont }}
              >
                {image.title}
              </p>
            </div>
          )}

          {/* Glow ring effect on hover */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              boxShadow: `inset 0 0 20px ${accentColor}30`,
            }}
          />
        </div>
      </TiltCard>
    </MagneticButton>
  );
}
