"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { SectionContent, SectionItem, ColorScheme, VideoVariant } from "@/lib/page-schema";
import { SectionBackground } from "../SectionBackground";
import { VideoMuteButton } from "../primitives/VideoMuteButton";

// ================= CENTERED VARIANT =================
function CenteredVariant({
  content,
  colorScheme,
  accentColor,
  textColor,
  primaryColor,
  headingFont,
  bodyFont,
  renderText,
  renderImage,
  sectionId,
}: {
  content: SectionContent;
  colorScheme: ColorScheme;
  accentColor: string;
  textColor: string;
  primaryColor: string;
  headingFont: string;
  bodyFont: string;
  renderText?: BaseSectionProps["renderText"];
  renderImage?: BaseSectionProps["renderImage"];
  sectionId: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(content.muteVideo ?? true);

  // Get aspect ratio from content or default
  const aspectRatio = content.videoAspectRatio || "16:9";
  const aspectClass = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
  }[aspectRatio];

  // Responsive sizes
  const playButtonSize = "w-16 h-16 sm:w-20 sm:h-20";
  const playIconSize = "w-6 h-6 sm:w-8 sm:h-8";

  // Get embed URL with proper parameters
  const getEmbedUrl = (url: string) => {
    if (!url) return null;

    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);

    const autoplay = content.autoplayVideo ? 1 : 0;
    const muted = content.muteVideo ? 1 : 0;

    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=${autoplay}&mute=${muted}`;
    }
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=${autoplay}&muted=${muted}`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(content.videoUrl || "");

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Background glow - responsive */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] rounded-full blur-[100px] sm:blur-[150px] opacity-20 md:opacity-30"
        style={{ backgroundColor: accentColor }}
      />

      {/* Header */}
      <motion.div
        className="relative text-center mb-8 sm:mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {content.showBadge !== false && content.badge && (
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
            }}
          >
            {renderText ? (
              renderText({
                value: content.badge,
                sectionId,
                field: "badge",
                className: "",
              })
            ) : (
              content.badge
            )}
          </span>
        )}
        {content.showHeading !== false && content.heading && (
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase leading-[0.95]"
            style={{ color: textColor, fontFamily: headingFont }}
          >
            {renderText ? (
              renderText({
                value: content.heading,
                sectionId,
                field: "heading",
                className: "",
              })
            ) : (
              content.heading
            )}
          </h2>
        )}
        {content.showSubheading !== false && content.subheading && (
          <p
            className="mt-3 sm:mt-4 text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: `${textColor}70`, fontFamily: bodyFont }}
          >
            {renderText ? (
              renderText({
                value: content.subheading,
                sectionId,
                field: "subheading",
                className: "",
              })
            ) : (
              content.subheading
            )}
          </p>
        )}
      </motion.div>

      {/* Video Container */}
      {content.showVideo !== false && content.videoUrl && (
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Decorative frame */}
          <div
            className="absolute -inset-2 sm:-inset-4 rounded-2xl sm:rounded-3xl opacity-10 sm:opacity-20"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, transparent, ${primaryColor})`,
            }}
          />

          <div
            className={`relative ${aspectClass} rounded-xl sm:rounded-2xl overflow-hidden`}
            style={{
              backgroundColor: "rgba(0,0,0,0.3)",
              border: `1px solid ${textColor}10`,
            }}
          >
            {isPlaying ? (
              <iframe
                src={embedUrl || content.videoUrl}
                className="w-full h-full"
                title="Video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                frameBorder="0"
                loading="lazy"
              />
            ) : (
              <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                {/* Thumbnail */}
                {content.imageUrl ? (
                  renderImage ? (
                    renderImage({
                      src: content.imageUrl,
                      sectionId,
                      field: "imageUrl",
                      className: "w-full h-full object-cover",
                      alt: "Video thumbnail",
                    })
                  ) : (
                    <img
                      src={content.imageUrl}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    <span className="text-white/30 text-sm">Video Preview</span>
                  </div>
                )}

                {/* Play button overlay - responsive */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-colors"
                  style={{ backgroundColor: `rgba(0,0,0,0.3)` }}
                >
                  <motion.div
                    className={`${playButtonSize} rounded-full flex items-center justify-center`}
                    style={{ backgroundColor: primaryColor }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className={`${playIconSize} ml-1`}
                      style={{ color: textColor }}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                </div>

                {/* Duration badge */}
                {content.videoDuration && (
                  <div
                    className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-medium"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "#fff",
                    }}
                  >
                    {content.videoDuration}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ================= GRID VARIANT =================
function GridVariant({
  items,
  content,
  colorScheme,
  textColor,
  accentColor,
  headingFont,
  bodyFont,
  renderText,
  renderImage,
  sectionId,
}: {
  items: SectionItem[];
  content: SectionContent;
  colorScheme: ColorScheme;
  textColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  renderText?: BaseSectionProps["renderText"];
  renderImage?: BaseSectionProps["renderImage"];
  sectionId: string;
}) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        {content.showHeading !== false && content.heading && (
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl uppercase leading-tight"
            style={{ color: textColor, fontFamily: headingFont }}
          >
            {renderText ? renderText({ value: content.heading, sectionId, field: "heading", className: "" }) : content.heading}
          </h2>
        )}
        {content.showSubheading !== false && content.subheading && (
          <p className="mt-4 text-lg" style={{ color: `${textColor}70`, fontFamily: bodyFont }}>
            {renderText ? renderText({ value: content.subheading, sectionId, field: "subheading", className: "" }) : content.subheading}
          </p>
        )}
      </motion.div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
              style={{
                backgroundColor: `${textColor}05`,
                border: `1px solid ${textColor}10`,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedVideo(item.videoUrl || null)}
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title || ""} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
                  <span className="text-white/30 text-sm">Video {index + 1}</span>
                </div>
              )}

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: accentColor }}
                >
                  <svg className="w-5 h-5 ml-0.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Video title */}
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-sm font-medium text-white truncate">{item.title}</p>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 opacity-50" style={{ color: textColor }}>
            Add video items in the properties panel
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedVideo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-5xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={selectedVideo}
              className="w-full h-full rounded-xl"
              title="Video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              frameBorder="0"
            />
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ================= SIDE-BY-SIDE VARIANT =================
function SideBySideVariant({
  content,
  items,
  colorScheme,
  textColor,
  accentColor,
  primaryColor,
  headingFont,
  bodyFont,
  renderText,
  renderImage,
  sectionId,
}: {
  content: SectionContent;
  items?: SectionItem[];
  colorScheme: ColorScheme;
  textColor: string;
  accentColor: string;
  primaryColor: string;
  headingFont: string;
  bodyFont: string;
  renderText?: BaseSectionProps["renderText"];
  renderImage?: BaseSectionProps["renderImage"];
  sectionId: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const aspectRatio = content.videoAspectRatio || "16:9";
  const aspectClass = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
  }[aspectRatio];

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    const autoplay = content.autoplayVideo ? 1 : 0;
    const muted = content.muteVideo ? 1 : 0;

    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=${autoplay}&mute=${muted}`;
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=${autoplay}&muted=${muted}`;
    return url;
  };

  const embedUrl = getEmbedUrl(content.videoUrl || "");

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Video Side */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className={`relative ${aspectClass} rounded-xl overflow-hidden`}
            style={{
              backgroundColor: "rgba(0,0,0,0.3)",
              border: `1px solid ${textColor}10`,
            }}
          >
            {isPlaying ? (
              <iframe
                src={embedUrl || content.videoUrl}
                className="w-full h-full"
                title="Video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                frameBorder="0"
              />
            ) : (
              <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                {content.imageUrl ? (
                  <img src={content.imageUrl} alt="Video thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-black/50">
                    <span className="text-white/30">Video Preview</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <svg className="w-7 h-7 ml-1" style={{ color: textColor }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Content Side */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {content.showBadge !== false && content.badge && (
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
            >
              {renderText ? renderText({ value: content.badge, sectionId, field: "badge", className: "" }) : content.badge}
            </span>
          )}
          {content.showHeading !== false && content.heading && (
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl uppercase leading-tight"
              style={{ color: textColor, fontFamily: headingFont }}
            >
              {renderText ? renderText({ value: content.heading, sectionId, field: "heading", className: "" }) : content.heading}
            </h2>
          )}
          {content.showSubheading !== false && content.subheading && (
            <p className="text-lg leading-relaxed" style={{ color: `${textColor}70`, fontFamily: bodyFont }}>
              {renderText ? renderText({ value: content.subheading, sectionId, field: "subheading", className: "" }) : content.subheading}
            </p>
          )}

          {/* Feature list from items */}
          {items && items.length > 0 && (
            <ul className="space-y-3">
              {items.map((item, index) => (
                <motion.li
                  key={item.id}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    <svg className="w-3 h-3" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-base" style={{ color: `${textColor}90`, fontFamily: bodyFont }}>
                    {item.title || item.description}
                  </span>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ================= FULLSCREEN VARIANT =================
function FullscreenVariant({
  content,
  colorScheme,
  textColor,
  accentColor,
  headingFont,
  bodyFont,
  renderText,
  sectionId,
}: {
  content: SectionContent;
  colorScheme: ColorScheme;
  textColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  renderText?: BaseSectionProps["renderText"];
  sectionId: string;
}) {
  const [isMuted, setIsMuted] = useState(content.muteVideo ?? true);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      {content.videoUrl && (
        <video
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={content.videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {content.showBadge !== false && content.badge && (
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
            >
              {renderText ? renderText({ value: content.badge, sectionId, field: "badge", className: "" }) : content.badge}
            </span>
          )}
          {content.showHeading !== false && content.heading && (
            <h1
              className="text-4xl sm:text-5xl lg:text-7xl uppercase leading-tight mb-6"
              style={{ color: textColor, fontFamily: headingFont }}
            >
              {renderText ? renderText({ value: content.heading, sectionId, field: "heading", className: "" }) : content.heading}
            </h1>
          )}
          {content.showSubheading !== false && content.subheading && (
            <p
              className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto"
              style={{ color: `${textColor}90`, fontFamily: bodyFont }}
            >
              {renderText ? renderText({ value: content.subheading, sectionId, field: "subheading", className: "" }) : content.subheading}
            </p>
          )}
        </motion.div>
      </div>

      {/* Mute button */}
      <div className="absolute bottom-6 right-6 z-20">
        <VideoMuteButton isMuted={isMuted} onToggle={() => setIsMuted(!isMuted)} />
      </div>
    </div>
  );
}

// ================= MAIN COMPONENT =================
export default function VideoSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content, items } = section;

  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary;

  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  // Get the variant
  const variant: VideoVariant = content.videoVariant || "centered";

  // Responsive padding (fullscreen has no padding)
  const paddingTop = content.paddingTop ?? (variant === "fullscreen" ? 0 : 80);
  const paddingBottom = content.paddingBottom ?? (variant === "fullscreen" ? 0 : 128);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: bgColor,
        paddingTop: variant === "fullscreen" ? 0 : paddingTop,
        paddingBottom: variant === "fullscreen" ? 0 : paddingBottom,
      }}
    >
      {variant !== "fullscreen" && <SectionBackground effect={content.backgroundEffect} config={content.backgroundConfig} />}

      {/* Variant conditional rendering */}
      {variant === "grid" && items && items.length > 0 ? (
        <GridVariant
          items={items}
          content={content}
          colorScheme={colorScheme}
          textColor={textColor}
          accentColor={accentColor}
          headingFont={headingFont}
          bodyFont={bodyFont}
          renderText={renderText}
          renderImage={renderImage}
          sectionId={section.id}
        />
      ) : variant === "side-by-side" ? (
        <SideBySideVariant
          content={content}
          items={items}
          colorScheme={colorScheme}
          textColor={textColor}
          accentColor={accentColor}
          primaryColor={primaryColor}
          headingFont={headingFont}
          bodyFont={bodyFont}
          renderText={renderText}
          renderImage={renderImage}
          sectionId={section.id}
        />
      ) : variant === "fullscreen" ? (
        <FullscreenVariant
          content={content}
          colorScheme={colorScheme}
          textColor={textColor}
          accentColor={accentColor}
          headingFont={headingFont}
          bodyFont={bodyFont}
          renderText={renderText}
          sectionId={section.id}
        />
      ) : (
        <CenteredVariant
          content={content}
          colorScheme={colorScheme}
          accentColor={accentColor}
          textColor={textColor}
          primaryColor={primaryColor}
          headingFont={headingFont}
          bodyFont={bodyFont}
          renderText={renderText}
          renderImage={renderImage}
          sectionId={section.id}
        />
      )}
    </section>
  );
}
