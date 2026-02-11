"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Crown,
  Star,
  Hexagon,
  Triangle,
  Command,
  Ghost,
  Gem,
  Cpu,
  X
} from "lucide-react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { getContentWidthClass } from "@/lib/page-schema";
import SectionButton, { getButtonPropsFromContent, getSecondaryButtonPropsFromContent } from "../SectionButton";

// Helper to get embed URL for YouTube/Vimeo
const getEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  return null; // It's an MP4 or other direct URL
};

// Icon map for client logos
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  hexagon: Hexagon,
  triangle: Triangle,
  command: Command,
  ghost: Ghost,
  gem: Gem,
  cpu: Cpu,
};

// Default client logos
const DEFAULT_CLIENTS = [
  { name: "Acme Corp", icon: "hexagon" },
  { name: "Quantum", icon: "triangle" },
  { name: "Command+Z", icon: "command" },
  { name: "Phantom", icon: "ghost" },
  { name: "Ruby", icon: "gem" },
  { name: "Chipset", icon: "cpu" },
];

/**
 * HeroGlassmorphismTrust - Premium Agency Hero
 */
export default function HeroGlassmorphismTrust({
  section,
  colorScheme,
  typography,
  contentWidth,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content } = section;
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Dynamic colors from scheme
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const mutedText = `${textColor}99`;

  // Typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  // Padding
  const paddingTop = content.paddingTop ?? 96;
  const paddingBottom = content.paddingBottom ?? 80;

  // Content defaults
  const badge = content.badge || "Award-Winning Design";
  const heading = content.heading || "Crafting Digital";
  const accentHeading = content.accentHeading || "Experiences";
  const headingEnd = content.subheading || "That Matter";
  const description = content.bodyText || "We design interfaces that combine beauty with functionality, creating seamless experiences that users love and businesses thrive on.";
  const buttonText = content.buttonText || "View Portfolio";
  const secondaryButtonText = content.secondaryButtonText || "Watch Showreel";
  const statValue = content.statValue || "150+";
  const statLabel = content.statLabel || "Projects Delivered";
  const progressLabel = content.progressLabel || "Client Satisfaction";
  const progressValue = content.progressValue ?? 98;
  const backgroundImageUrl = content.backgroundImageUrl || "";

  const miniStats = content.miniStats || [
    { value: "5+", label: "Years" },
    { value: "24/7", label: "Support" },
    { value: "100%", label: "Quality" },
  ];

  const clientLogos = content.clientLogos || DEFAULT_CLIENTS;

  // Stat Item Component
  const StatItem = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
      <span className="text-xl font-bold sm:text-2xl" style={{ color: textColor }}>{value}</span>
      <span className="text-[10px] uppercase tracking-wider font-medium sm:text-xs" style={{ color: mutedText }}>{label}</span>
    </div>
  );

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: bgColor,
        fontFamily: bodyFont,
        paddingTop,
        paddingBottom,
      }}
    >
      {/* Scoped Animations */}
      <style>{`
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .hero-fade { animation: heroFadeIn 0.8s ease-out forwards; opacity: 0; }
        .hero-marquee { animation: heroMarquee 40s linear infinite; }
        .hero-d1 { animation-delay: 0.1s; }
        .hero-d2 { animation-delay: 0.2s; }
        .hero-d3 { animation-delay: 0.3s; }
        .hero-d4 { animation-delay: 0.4s; }
        .hero-d5 { animation-delay: 0.5s; }
      `}</style>

      {/* Background Image with Gradient Mask */}
      {backgroundImageUrl && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            maskImage: "linear-gradient(180deg, transparent 0%, black 10%, black 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 10%, black 70%, transparent 100%)",
          }}
        />
      )}

      {/* Content Container */}
      <div className={`relative z-10 mx-auto px-4 sm:px-6 lg:px-8 ${getContentWidthClass(contentWidth)}`}>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">

          {/* LEFT COLUMN */}
          <div
            className="lg:col-span-7 flex flex-col justify-center"
            style={{ gap: `${content.heroElementGap ?? 32}px` }}
          >

            {/* Badge */}
            {content.showBadge !== false && (
              <div className="hero-fade hero-d1">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur-md transition-colors"
                  style={{
                    backgroundColor: `${textColor}08`,
                    border: `1px solid ${textColor}15`,
                  }}
                >
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider flex items-center gap-2" style={{ color: mutedText }}>
                    {renderText
                      ? renderText({
                          value: badge,
                          sectionId: section.id,
                          field: "badge",
                          placeholder: "Award-Winning Design",
                        })
                      : badge}
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  </span>
                </div>
              </div>
            )}

            {/* Heading */}
            {content.showHeading !== false && (
              <h1
                className="hero-fade hero-d2 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight leading-[1.1]"
                style={{ fontFamily: headingFont, color: textColor }}
              >
                {renderText
                  ? renderText({
                      value: heading,
                      sectionId: section.id,
                      field: "heading",
                      placeholder: "Crafting Digital",
                      className: "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight leading-[1.1]",
                      style: { fontFamily: headingFont, color: textColor },
                    })
                  : heading}
                {content.showAccentHeading !== false && (
                  <>
                    <br />
                    <span
                      className="bg-clip-text text-transparent"
                      style={{ backgroundImage: `linear-gradient(135deg, ${textColor}, ${accentColor})` }}
                    >
                      {renderText
                        ? renderText({
                            value: accentHeading,
                            sectionId: section.id,
                            field: "accentHeading",
                            placeholder: "Experiences",
                            className: "bg-clip-text text-transparent",
                            style: { backgroundImage: `linear-gradient(135deg, ${textColor}, ${accentColor})` },
                          })
                        : accentHeading}
                    </span>
                  </>
                )}
                <br />
                {renderText
                  ? renderText({
                      value: headingEnd,
                      sectionId: section.id,
                      field: "subheading",
                      placeholder: "That Matter",
                    })
                  : headingEnd}
              </h1>
            )}

            {/* Description */}
            {content.showSubheading !== false && (
              <p className="hero-fade hero-d3 max-w-xl text-base sm:text-lg leading-relaxed" style={{ color: mutedText }}>
                {renderText
                  ? renderText({
                      value: description,
                      sectionId: section.id,
                      field: "bodyText",
                      multiline: true,
                      placeholder: "We design interfaces that combine beauty with functionality...",
                      className: "max-w-xl text-base sm:text-lg leading-relaxed",
                      style: { color: mutedText },
                    })
                  : description}
              </p>
            )}

            {/* CTA Buttons */}
            {content.showButton !== false && (
              <div className="hero-fade hero-d4 flex flex-col sm:flex-row gap-4">
                <SectionButton
                  text={buttonText}
                  link={content.buttonLink || "#"}
                  sectionId={section.id}
                  buttonType="primary"
                  {...getButtonPropsFromContent(content)}
                  sectionBgColor={bgColor}
                  primaryColor={accentColor}
                  accentColor={accentColor}
                  schemeTextColor={textColor}
                  bodyFont={bodyFont}
                  renderText={renderText}
                />

                {content.showSecondaryButton !== false && (
                  <div
                    onClick={() => content.showreelVideoUrl ? setShowVideoModal(true) : null}
                    className="cursor-pointer"
                  >
                    <SectionButton
                      text={secondaryButtonText}
                      link={content.secondaryButtonLink || "#"}
                      sectionId={section.id}
                      buttonType="secondary"
                      {...getSecondaryButtonPropsFromContent(content)}
                      sectionBgColor={bgColor}
                      primaryColor={accentColor}
                      accentColor={accentColor}
                      schemeTextColor={textColor}
                      bodyFont={bodyFont}
                      renderText={renderText}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Stats Card */}
          <div className="lg:col-span-5 space-y-6 lg:mt-8">

            {/* Stats Card */}
            <div
              className="hero-fade hero-d5 relative overflow-hidden rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
              style={{
                backgroundColor: `${textColor}05`,
                border: `1px solid ${textColor}10`,
              }}
            >
              {/* Glow */}
              <div
                className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: `${accentColor}15` }}
              />

              <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', gap: `${content.statsCardGap ?? 24}px` }}>
                {/* Main Stat */}
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${textColor}10`, boxShadow: `inset 0 0 0 1px ${textColor}20` }}
                  >
                    <Target className="h-6 w-6" style={{ color: textColor }} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tight" style={{ color: textColor }}>
                      {renderText
                        ? renderText({
                            value: statValue,
                            sectionId: section.id,
                            field: "statValue",
                            placeholder: "150+",
                            className: "text-3xl font-bold tracking-tight",
                            style: { color: textColor },
                          })
                        : statValue}
                    </div>
                    <div className="text-sm" style={{ color: mutedText }}>
                      {renderText
                        ? renderText({
                            value: statLabel,
                            sectionId: section.id,
                            field: "statLabel",
                            placeholder: "Projects Delivered",
                            className: "text-sm",
                            style: { color: mutedText },
                          })
                        : statLabel}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: mutedText }}>
                      {renderText
                        ? renderText({
                            value: progressLabel,
                            sectionId: section.id,
                            field: "progressLabel",
                            placeholder: "Client Satisfaction",
                            className: "text-sm",
                            style: { color: mutedText },
                          })
                        : progressLabel}
                    </span>
                    <span className="font-medium" style={{ color: textColor }}>{progressValue}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: `${textColor}10` }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${textColor}, ${mutedText})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressValue}%` }}
                      transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="h-px w-full" style={{ backgroundColor: `${textColor}10` }} />

                {/* Mini Stats */}
                {content.showMiniStats !== false && miniStats.length > 0 && (
                  <div className="flex flex-wrap justify-center items-center gap-4">
                    {miniStats.map((stat, index) => (
                      <React.Fragment key={index}>
                        <StatItem value={stat.value} label={stat.label} />
                        {index < miniStats.length - 1 && (
                          <div className="w-px h-10" style={{ backgroundColor: `${textColor}15` }} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <div
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium tracking-wide"
                    style={{ backgroundColor: `${textColor}05`, border: `1px solid ${textColor}10`, color: mutedText }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    ACTIVE
                  </div>
                  <div
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium tracking-wide"
                    style={{ backgroundColor: `${textColor}05`, border: `1px solid ${textColor}10`, color: mutedText }}
                  >
                    <Crown className="w-3 h-3 text-yellow-500" />
                    PREMIUM
                  </div>
                </div>
              </div>
            </div>

            {/* Marquee Card */}
            {content.showClientLogos !== false && clientLogos.length > 0 && (
              <div
                className="hero-fade hero-d5 relative overflow-hidden rounded-3xl py-6 backdrop-blur-xl"
                style={{ backgroundColor: `${textColor}05`, border: `1px solid ${textColor}10` }}
              >
                <h3 className="mb-4 px-6 text-sm font-medium" style={{ color: mutedText }}>
                  Trusted by Industry Leaders
                </h3>

                <div
                  className="relative flex overflow-hidden"
                  style={{
                    maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)"
                  }}
                >
                  <div className="hero-marquee flex gap-10 whitespace-nowrap px-4">
                    {[...clientLogos, ...clientLogos, ...clientLogos].map((client, i) => {
                      const IconComponent = client.icon ? (ICON_MAP[client.icon?.toLowerCase()] || Hexagon) : null;
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2 opacity-50 transition-all hover:opacity-100 hover:scale-105 cursor-default grayscale hover:grayscale-0"
                        >
                          {client.imageUrl ? (
                            <img
                              src={client.imageUrl}
                              alt={client.name}
                              className="h-5 w-auto object-contain"
                            />
                          ) : IconComponent ? (
                            <IconComponent className="h-5 w-5" style={{ color: textColor }} />
                          ) : null}
                          <span className="text-base font-semibold tracking-tight" style={{ color: textColor }}>
                            {client.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && content.showreelVideoUrl && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl aspect-video"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {getEmbedUrl(content.showreelVideoUrl) ? (
                <iframe
                  src={getEmbedUrl(content.showreelVideoUrl) || ""}
                  className="w-full h-full rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={content.showreelVideoUrl}
                  className="w-full h-full rounded-2xl object-contain bg-black"
                  controls
                  autoPlay
                />
              )}
              {/* Close button */}
              <button
                onClick={() => setShowVideoModal(false)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
