"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";

export default function VideoSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content } = section;
  const [isPlaying, setIsPlaying] = useState(false);

  // Dynamic colors
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const primaryColor = colorScheme.primary;

  // Dynamic typography
  const headingFont = typography.headingFont;
  const bodyFont = typography.bodyFont;

  // Check if it's a YouTube or Vimeo URL
  const getEmbedUrl = (url: string) => {
    if (!url) return null;

    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(content.videoUrl || "");

  return (
    <section
      className="py-20 lg:py-32 relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-30"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {content.badge && (
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
              style={{
                backgroundColor: `${accentColor}15`,
                color: accentColor,
              }}
            >
              {renderText ? (
                renderText({
                  value: content.badge,
                  sectionId: section.id,
                  field: "badge",
                  className: "",
                })
              ) : (
                content.badge
              )}
            </span>
          )}
          {content.heading && (
            <h2
              className="text-4xl sm:text-5xl uppercase leading-[0.95]"
              style={{ color: textColor, fontFamily: headingFont }}
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
            </h2>
          )}
          {content.subheading && (
            <p
              className="mt-4 text-lg max-w-2xl mx-auto"
              style={{ color: `${textColor}70`, fontFamily: bodyFont }}
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
            </p>
          )}
        </motion.div>

        {/* Video Container */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Decorative frame */}
          <div
            className="absolute -inset-4 rounded-3xl opacity-20"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, transparent, ${primaryColor})`,
            }}
          />

          <div
            className="relative aspect-video rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {content.videoUrl && isPlaying ? (
              <iframe
                src={embedUrl || content.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : content.imageUrl || content.videoUrl ? (
              <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
                {/* Thumbnail */}
                {content.imageUrl ? (
                  renderImage ? (
                    renderImage({
                      src: content.imageUrl,
                      sectionId: section.id,
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

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: primaryColor }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className="w-8 h-8 ml-1"
                      style={{ color: bgColor }}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                </div>

                {/* Duration badge */}
                {content.bodyText && (
                  <div
                    className="absolute bottom-4 right-4 px-3 py-1 rounded-lg text-xs font-medium"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "#fff",
                    }}
                  >
                    {content.bodyText}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center" style={{ color: `${textColor}50` }}>
                <svg
                  className="w-16 h-16 mb-4 opacity-30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                <p className="text-sm opacity-50">Add video URL in properties panel</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
