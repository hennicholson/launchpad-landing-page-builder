"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { SectionItem } from "@/lib/page-schema";
import { BentoGridShowcase } from "@/components/ui/bento-product-features";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { SubheadingText } from "./SubheadingText";
import { Zap, TrendingUp, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/lib/store";
import { SectionBackground } from "../SectionBackground";

// Metadata type for card variants
type CardMetadata = {
  variant?: "integration" | "stat" | "metric" | "feature" | "action";
  showIcon?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  showSwitch?: boolean;
  showButton?: boolean;
  buttonText?: string;
  statValue?: string;
  statLabel?: string;
  dotPattern?: boolean;
  highlighted?: boolean;

  // Image styling
  imageBlur?: number;              // 0-20
  imageBrightness?: number;        // 0-100
  imageOverlay?: string;           // hex color
  imageOverlayOpacity?: number;    // 0-100
  imageEffect?: "parallax" | "zoom" | "none";
  imagePosition?: "top" | "center" | "bottom";
  imageFit?: "cover" | "contain";

  // Card backgrounds
  cardBackground?: "gradient" | "mesh" | "noise" | "dots" | "grid" | "none";
  gradientFrom?: string;
  gradientTo?: string;

  // Animation enhancements
  entranceAnimation?: "fade" | "slide" | "scale" | "flip" | "bounce";
  animationDelay?: number;
  hoverBorderGlow?: boolean;
};

interface FeatureCardProps {
  item: SectionItem;
  textColor: string;
  accentColor: string;
  bodyFont: string;
  renderText?: BaseSectionProps["renderText"];
  sectionId: string;
}

// Parse metadata safely
function parseMetadata(metadataString?: string): CardMetadata {
  if (!metadataString) return {};
  try {
    return JSON.parse(metadataString);
  } catch {
    return {};
  }
}

// Overlay gradient generator
function getOverlayStyle(metadata: CardMetadata, defaultColor = "#000000") {
  if (!metadata.imageOverlay && !metadata.imageOverlayOpacity) {
    return {
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8))'
    };
  }

  const color = metadata.imageOverlay || defaultColor;
  const opacity = (metadata.imageOverlayOpacity || 60) / 100;
  const hex1 = Math.round(opacity * 255).toString(16).padStart(2, '0');
  const hex2 = Math.round(opacity * 200).toString(16).padStart(2, '0');

  return {
    background: `linear-gradient(to bottom, ${color}${hex1}, ${color}${hex2})`
  };
}

// Background image component with lazy loading
function CardBackgroundImage({
  imageUrl,
  metadata,
  accentColor,
  cardRef,
}: {
  imageUrl: string;
  metadata: CardMetadata;
  accentColor: string;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  const y = metadata.imageEffect === "parallax"
    ? useTransform(scrollYProgress, [0, 1], [20, -20])
    : useTransform(scrollYProgress, [0, 1], [0, 0]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Blur placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: `${accentColor}10` }}
        />
      )}

      {/* Image */}
      <motion.img
        src={imageUrl}
        alt=""
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        style={{
          y,
          filter: `blur(${metadata.imageBlur || 0}px) brightness(${metadata.imageBrightness || 100}%)`,
          objectPosition: metadata.imagePosition || 'center',
          objectFit: (metadata.imageFit || 'cover') as any,
        }}
        className={cn(
          "absolute inset-0 w-full h-full transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        whileHover={metadata.imageEffect === "zoom" ? { scale: 1.08 } : {}}
        transition={metadata.imageEffect === "zoom" ? { duration: 0.4, ease: "easeOut" } : {}}
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-1" style={getOverlayStyle(metadata)} />
    </div>
  );
}

// Background pattern component
function CardBackgroundPattern({
  type,
  accentColor,
  gradientFrom,
  gradientTo,
}: {
  type: "gradient" | "mesh" | "noise" | "dots" | "grid";
  accentColor: string;
  gradientFrom?: string;
  gradientTo?: string;
}) {
  if (type === "mesh") {
    return (
      <div className="absolute inset-0 z-[5]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, ${gradientFrom || accentColor}40 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, ${gradientTo || accentColor}20 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, ${accentColor}15 0%, transparent 50%)
            `,
          }}
        />
      </div>
    );
  }

  if (type === "noise") {
    const noisePattern = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /></filter><rect width="200" height="200" filter="url(#noise)" opacity="0.4" /></svg>`;
    return (
      <div
        className="absolute inset-0 z-[5] opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(noisePattern)}")`,
          backgroundSize: '200px 200px',
        }}
      />
    );
  }

  if (type === "dots") {
    return (
      <div
        className="absolute inset-0 z-[5] opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, ${accentColor} 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />
    );
  }

  if (type === "grid") {
    return (
      <div
        className="absolute inset-0 z-[5] opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${accentColor}40 1px, transparent 1px),
            linear-gradient(to bottom, ${accentColor}40 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />
    );
  }

  // gradient
  return (
    <div
      className="absolute inset-0 z-[5] opacity-20"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom || accentColor}40, ${gradientTo || accentColor}20)`,
      }}
    />
  );
}

// Icon component with animation
function AnimatedIcon({ color, variant = "default" }: { color: string; variant?: string }) {
  const IconComponent = variant === "stat" ? TrendingUp : variant === "metric" ? Target : Zap;

  return (
    <div
      className="relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
      style={{ backgroundColor: `${color}15` }}
    >
      <IconComponent className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" style={{ color }} />
    </div>
  );
}

// Enhanced FeatureCard component with hover glow
function FeatureCard({ item, textColor, accentColor, bodyFont, renderText, sectionId }: FeatureCardProps) {
  const metadata = parseMetadata(item.metadata);
  const variant = metadata.variant || "feature";
  const cardRef = useRef<HTMLDivElement>(null);

  // Only enable selection in editor mode (when renderText exists)
  const isEditorMode = !!renderText;
  const selectItem = useEditorStore((state) => state.selectItem);
  const selectedItemId = useEditorStore((state) => state.selectedItemId);
  const isSelected = isEditorMode && selectedItemId === item.id;

  const handleCardClick = (e: React.MouseEvent) => {
    // Only handle clicks in editor mode
    if (!isEditorMode) return;
    // Prevent click if user is selecting text
    if (window.getSelection()?.toString()) return;
    selectItem(sectionId, item.id);
  };

  // Hover glow effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.removeProperty("--mouse-x");
    cardRef.current.style.removeProperty("--mouse-y");
  };

  // Integration Card: icon + button + switch
  if (variant === "integration") {
    const hasImage = !!item.imageUrl;

    return (
      <Card
        ref={cardRef}
        onClick={isEditorMode ? handleCardClick : undefined}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden border transition-all duration-300",
          "hover:shadow-2xl backdrop-blur-sm",
          isEditorMode && "cursor-pointer",
          isSelected && "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent",
          metadata.highlighted === true && "border-2 shadow-lg"
        )}
        style={{
          borderColor: metadata.highlighted === true ? accentColor : undefined,
          backgroundColor: hasImage ? 'transparent' : `${accentColor}03`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background image */}
        {hasImage && (
          <CardBackgroundImage
            imageUrl={item.imageUrl!}
            metadata={metadata}
            accentColor={accentColor}
            cardRef={cardRef}
          />
        )}

        {/* Background pattern */}
        {metadata.cardBackground &&
         metadata.cardBackground !== "none" &&
         ["gradient", "mesh", "noise", "dots", "grid"].includes(metadata.cardBackground) && (
          <CardBackgroundPattern
            type={metadata.cardBackground as "gradient" | "mesh" | "noise" | "dots" | "grid"}
            accentColor={accentColor}
            gradientFrom={metadata.gradientFrom}
            gradientTo={metadata.gradientTo}
          />
        )}

        {/* Hover glow effect */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${accentColor}15, transparent 70%)`,
          }}
        />

        <CardHeader
          className={cn(
            "relative z-10",
            hasImage && "backdrop-blur-md rounded-t-lg"
          )}
          style={hasImage ? {
            background: 'rgba(0, 0, 0, 0.3)',
          } : undefined}
        >
          <div className="flex items-start justify-between">
            {metadata.showIcon === true && <AnimatedIcon color={accentColor} variant={variant} />}
            {metadata.showBadge === true && metadata.badgeText && (
              <Badge variant="secondary" className="text-xs">
                {metadata.badgeText}
              </Badge>
            )}
          </div>
          <CardTitle
            className="mt-4 text-xl"
            style={{
              color: textColor,
              fontFamily: bodyFont,
              textShadow: hasImage ? '0 2px 8px rgba(0, 0, 0, 0.8)' : undefined,
            }}
          >
            {renderText
              ? renderText({
                  value: item.title || "",
                  sectionId,
                  field: "title",
                  itemId: item.id,
                  className: "inline",
                })
              : item.title}
          </CardTitle>
          <CardDescription
            className="text-sm leading-relaxed"
            style={{
              fontFamily: bodyFont,
              textShadow: hasImage ? '0 2px 8px rgba(0, 0, 0, 0.8)' : undefined,
            }}
          >
            {renderText
              ? renderText({
                  value: item.description || "",
                  sectionId,
                  field: "description",
                  itemId: item.id,
                  className: "inline",
                })
              : item.description}
          </CardDescription>
        </CardHeader>
        {(metadata.showButton === true || metadata.showSwitch === true) && (
          <CardFooter
            className={cn(
              "relative z-10 mt-auto flex items-center justify-between border-t pt-4",
              hasImage && "backdrop-blur-md rounded-b-lg"
            )}
            style={{
              borderColor: `${textColor}10`,
              background: hasImage ? 'rgba(0, 0, 0, 0.3)' : undefined,
            }}
          >
            {metadata.showButton === true && (
              <Button variant="outline" size="sm">
                {metadata.buttonText || "Configure"}
              </Button>
            )}
            {metadata.showSwitch === true && <Switch />}
          </CardFooter>
        )}
      </Card>
    );
  }

  // Stat Card: large number + label + badge
  if (variant === "stat") {
    const hasImage = !!item.imageUrl;

    return (
      <Card
        ref={cardRef}
        onClick={isEditorMode ? handleCardClick : undefined}
        className={cn(
          "group relative h-full overflow-hidden border transition-all duration-300 hover:shadow-2xl backdrop-blur-sm",
          isEditorMode && "cursor-pointer",
          isSelected && "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent"
        )}
        style={{ backgroundColor: hasImage ? 'transparent' : `${accentColor}03` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background image */}
        {hasImage && (
          <CardBackgroundImage
            imageUrl={item.imageUrl!}
            metadata={metadata}
            accentColor={accentColor}
            cardRef={cardRef}
          />
        )}

        {/* Background pattern */}
        {metadata.cardBackground &&
         metadata.cardBackground !== "none" &&
         ["gradient", "mesh", "noise", "dots", "grid"].includes(metadata.cardBackground) && (
          <CardBackgroundPattern
            type={metadata.cardBackground as "gradient" | "mesh" | "noise" | "dots" | "grid"}
            accentColor={accentColor}
            gradientFrom={metadata.gradientFrom}
            gradientTo={metadata.gradientTo}
          />
        )}

        {/* Hover glow effect */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${accentColor}15, transparent 70%)`,
          }}
        />

        <CardContent
          className={cn(
            "relative z-10 flex h-full flex-col justify-between p-6",
            hasImage && "backdrop-blur-md rounded-lg"
          )}
          style={hasImage ? {
            background: 'rgba(0, 0, 0, 0.3)',
          } : undefined}
        >
          <div>
            <div className="mb-4 flex items-center justify-between">
              {metadata.showBadge === true && metadata.badgeText && (
                <Badge variant="outline" className="text-xs">
                  {metadata.badgeText}
                </Badge>
              )}
              {metadata.showIcon === true && <AnimatedIcon color={accentColor} variant={variant} />}
            </div>
            <CardTitle
              className="mb-2 text-base"
              style={{
                color: textColor,
                fontFamily: bodyFont,
                textShadow: hasImage ? '0 2px 8px rgba(0, 0, 0, 0.8)' : undefined,
              }}
            >
              {renderText
                ? renderText({
                    value: item.title || "",
                    sectionId,
                    field: "title",
                    itemId: item.id,
                    className: "inline",
                  })
                : item.title}
            </CardTitle>
            <CardDescription
              className="text-sm"
              style={{
                fontFamily: bodyFont,
                textShadow: hasImage ? '0 2px 8px rgba(0, 0, 0, 0.8)' : undefined,
              }}
            >
              {renderText
                ? renderText({
                    value: item.description || "",
                    sectionId,
                    field: "description",
                    itemId: item.id,
                    className: "inline",
                  })
                : item.description}
            </CardDescription>
          </div>
          {metadata.statValue && (
            <div className="mt-8">
              <div
                className="font-mono text-6xl font-bold tracking-tight"
                style={{
                  color: accentColor,
                  fontFamily: bodyFont,
                  textShadow: hasImage ? '0 2px 8px rgba(0, 0, 0, 0.8)' : undefined,
                }}
              >
                {metadata.statValue}
              </div>
              {metadata.statLabel && (
                <div
                  className="mt-2 text-xs uppercase tracking-wider opacity-60"
                  style={{
                    fontFamily: bodyFont,
                    textShadow: hasImage ? '0 2px 8px rgba(0, 0, 0, 0.8)' : undefined,
                  }}
                >
                  {metadata.statLabel}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Metric Card: dotted background + huge text
  if (variant === "metric") {
    const hasImage = !!item.imageUrl;

    return (
      <Card
        ref={cardRef}
        onClick={isEditorMode ? handleCardClick : undefined}
        className={cn(
          "group relative h-full overflow-hidden border transition-all duration-300 hover:shadow-2xl",
          isEditorMode && "cursor-pointer",
          isSelected && "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent"
        )}
        style={{ backgroundColor: hasImage ? 'transparent' : `${accentColor}03` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background image - lowest layer (z-0) */}
        {hasImage && (
          <CardBackgroundImage
            imageUrl={item.imageUrl!}
            metadata={metadata}
            accentColor={accentColor}
            cardRef={cardRef}
          />
        )}

        {/* Background pattern */}
        {metadata.cardBackground &&
         metadata.cardBackground !== "none" &&
         ["gradient", "mesh", "noise", "dots", "grid"].includes(metadata.cardBackground) && (
          <CardBackgroundPattern
            type={metadata.cardBackground as "gradient" | "mesh" | "noise" | "dots" | "grid"}
            accentColor={accentColor}
            gradientFrom={metadata.gradientFrom}
            gradientTo={metadata.gradientTo}
          />
        )}

        {/* Dot pattern background - layer above image (z-5) */}
        {metadata.dotPattern === true && (
          <div
            className="absolute inset-0 z-5 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, ${accentColor} 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
            }}
          />
        )}

        {/* Grid overlay - layer above dots (z-5) */}
        <div
          className="absolute inset-0 z-5 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${accentColor}40 1px, transparent 1px),
              linear-gradient(to bottom, ${accentColor}40 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Hover glow effect - top layer (z-10) */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${accentColor}20, transparent 70%)`,
          }}
        />

        <CardContent
          className={cn(
            "relative z-10 flex h-full flex-col items-center justify-center p-8 text-center",
            hasImage && "backdrop-blur-md rounded-lg"
          )}
          style={hasImage ? {
            background: 'rgba(0, 0, 0, 0.3)',
          } : undefined}
        >
          {metadata.showIcon === true && (
            <div className="mb-6">
              <AnimatedIcon color={accentColor} variant={variant} />
            </div>
          )}
          {metadata.statValue && (
            <div
              className="font-mono text-8xl font-bold leading-none tracking-tighter"
              style={{
                color: accentColor,
                fontFamily: bodyFont,
                textShadow: hasImage ? '0 2px 8px rgba(0, 0, 0, 0.8)' : undefined,
              }}
            >
              {metadata.statValue}
            </div>
          )}
          {item.title && (
            <p
              className="mt-6 text-sm font-medium uppercase tracking-widest"
              style={{
                color: textColor,
                fontFamily: bodyFont,
                textShadow: hasImage ? '0 2px 8px rgba(0, 0, 0, 0.8)' : undefined,
              }}
            >
              {renderText
                ? renderText({
                    value: item.title,
                    sectionId,
                    field: "title",
                    itemId: item.id,
                    className: "inline",
                  })
                : item.title}
            </p>
          )}
          {item.description && (
            <p
              className="mt-2 text-xs opacity-60"
              style={{
                fontFamily: bodyFont,
                textShadow: hasImage ? '0 2px 8px rgba(0, 0, 0, 0.8)' : undefined,
              }}
            >
              {renderText
                ? renderText({
                    value: item.description,
                    sectionId,
                    field: "description",
                    itemId: item.id,
                    className: "inline",
                  })
                : item.description}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default/Feature Card: simple title/description with optional image
  const hasImage = !!item.imageUrl;
  const useBackgroundImage = metadata.imageEffect === "parallax" || metadata.imageEffect === "zoom";

  return (
    <Card
      ref={cardRef}
      onClick={isEditorMode ? handleCardClick : undefined}
      className={cn(
        "group relative h-full overflow-hidden border transition-all duration-300 hover:shadow-2xl backdrop-blur-sm",
        isEditorMode && "cursor-pointer",
        isSelected && "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent"
      )}
      style={{ backgroundColor: (hasImage && useBackgroundImage) ? 'transparent' : `${accentColor}02` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background image (when parallax or zoom effect is enabled) */}
      {hasImage && useBackgroundImage && (
        <CardBackgroundImage
          imageUrl={item.imageUrl!}
          metadata={metadata}
          accentColor={accentColor}
          cardRef={cardRef}
        />
      )}

      {/* Background pattern */}
      {metadata.cardBackground && metadata.cardBackground !== "none" && (
        <CardBackgroundPattern
          type={metadata.cardBackground}
          accentColor={accentColor}
          gradientFrom={metadata.gradientFrom}
          gradientTo={metadata.gradientTo}
        />
      )}

      {/* Hover glow effect */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${accentColor}12, transparent 70%)`,
        }}
      />

      <CardHeader
        className={cn(
          "relative z-10",
          hasImage && useBackgroundImage && "backdrop-blur-md rounded-t-lg"
        )}
        style={hasImage && useBackgroundImage ? {
          background: 'rgba(0, 0, 0, 0.3)',
        } : undefined}
      >
        <CardTitle
          className="text-xl"
          style={{
            color: textColor,
            fontFamily: bodyFont,
            textShadow: (hasImage && useBackgroundImage) ? '0 2px 8px rgba(0, 0, 0, 0.8)' : undefined,
          }}
        >
          {renderText
            ? renderText({
                value: item.title || "",
                sectionId,
                field: "title",
                itemId: item.id,
                className: "inline",
              })
            : item.title}
        </CardTitle>
        <CardDescription
          className="text-sm leading-relaxed"
          style={{
            fontFamily: bodyFont,
            textShadow: (hasImage && useBackgroundImage) ? '0 2px 8px rgba(0, 0, 0, 0.8)' : undefined,
          }}
        >
          {renderText
            ? renderText({
                value: item.description || "",
                sectionId,
                field: "description",
                itemId: item.id,
                className: "inline",
              })
            : item.description}
        </CardDescription>
      </CardHeader>
      {/* Foreground image (default behavior when no special effects) */}
      {hasImage && !useBackgroundImage && (
        <CardContent className="relative z-10 p-0">
          <img
            src={item.imageUrl}
            alt={item.title || ""}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </CardContent>
      )}
    </Card>
  );
}

export default function FeaturesBentoBase({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content, items } = section;

  // Extract styling
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  const DEFAULT_PADDING = { top: 96, bottom: 96 };

  // Map items to BentoGridShowcase format
  const bentoItems = (items || []).map((item) => ({
    content: (
      <FeatureCard
        item={item}
        textColor={textColor}
        accentColor={accentColor}
        bodyFont={typography.bodyFont}
        renderText={renderText}
        sectionId={section.id}
      />
    ),
    gridClass: item.gridClass, // Use gridClass from item if provided
  }));

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
      {/* Animated mesh gradient background */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 10% 20%, ${accentColor}15 0%, transparent 50%),
            radial-gradient(ellipse at 90% 80%, ${accentColor}10 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, ${accentColor}08 0%, transparent 60%)
          `,
        }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${textColor}08 1px, transparent 1px),
            linear-gradient(to bottom, ${textColor}08 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          maskImage: "linear-gradient(to bottom, black 20%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 95%)",
        }}
      />

      {/* Gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at top, ${accentColor}08 0%, transparent 50%)`,
        }}
      />

      <div className="container relative z-10 mx-auto px-4">
        {/* Heading Section */}
        {(content.showHeading !== false && content.heading) || (content.showSubheading !== false && content.subheading) ? (
          <div className="mb-16 text-center">
            {content.showHeading !== false && content.heading && (
              renderText ? (
                renderText({
                  value: content.heading,
                  sectionId: section.id,
                  field: "heading",
                  className: "mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl",
                  style: { color: textColor, fontFamily: typography.headingFont },
                })
              ) : (
                <h2
                  className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
                  style={{ color: textColor, fontFamily: typography.headingFont }}
                >
                  {content.heading}
                </h2>
              )
            )}
            <SubheadingText
              content={content}
              sectionId={section.id}
              textColor={textColor}
              bodyFont={typography.bodyFont}
              renderText={renderText}
              className="mx-auto max-w-3xl text-base sm:text-lg"
            />
          </div>
        ) : null}

        {/* Bento Grid */}
        {content.showItems !== false && bentoItems.length > 0 && (
          <BentoGridShowcase items={bentoItems} className="mx-auto max-w-7xl" />
        )}
      </div>
    </section>
  );
}
