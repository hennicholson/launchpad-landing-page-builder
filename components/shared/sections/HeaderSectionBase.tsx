"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { NavLink } from "@/lib/page-schema";

export default function HeaderSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content } = section;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Dynamic colors
  const accentColor = content.accentColor || colorScheme.accent;
  const textColor = content.textColor || colorScheme.text;
  const bgColor = content.backgroundColor || "transparent";
  const primaryColor = colorScheme.primary;
  const backgroundColor = colorScheme.background;

  // Handle scroll detection
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    // Find the scrollable parent or use window
    let scrollParent: HTMLElement | Window | null = header.parentElement;
    while (scrollParent && scrollParent !== document.body && getComputedStyle(scrollParent as HTMLElement).overflowY !== 'auto') {
      scrollParent = (scrollParent as HTMLElement).parentElement;
    }
    if (!scrollParent || scrollParent === document.body) {
      scrollParent = window;
    }

    const handleScroll = () => {
      if (scrollParent === window) {
        setIsScrolled(window.scrollY > 20);
      } else {
        setIsScrolled((scrollParent as HTMLElement).scrollTop > 20);
      }
    };

    scrollParent.addEventListener("scroll", handleScroll);
    return () => scrollParent?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "py-3" : "py-5"
      }`}
      style={{
        backgroundColor: isScrolled ? `${backgroundColor}cc` : bgColor,
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        borderBottom: isScrolled ? `1px solid ${textColor}0d` : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {content.logoUrl ? (
              renderImage ? (
                renderImage({
                  src: content.logoUrl,
                  sectionId: section.id,
                  field: "logoUrl",
                  className: "h-8 w-auto",
                  alt: content.logoText || "Logo",
                })
              ) : (
                <img
                  src={content.logoUrl}
                  alt={content.logoText || "Logo"}
                  className="h-8 w-auto"
                />
              )
            ) : (
              <span
                className="text-xl uppercase tracking-wider"
                style={{
                  color: textColor,
                  fontFamily: typography.headingFont,
                }}
              >
                {renderText ? (
                  renderText({
                    value: content.logoText || "Your Brand",
                    sectionId: section.id,
                    field: "logoText",
                    className: "",
                  })
                ) : (
                  content.logoText || "Your Brand"
                )}
              </span>
            )}
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {content.links?.map((link: NavLink, index: number) => (
              <motion.a
                key={index}
                href={link.url}
                className="text-sm font-medium uppercase tracking-wider transition-colors relative group"
                style={{ color: `${textColor}99` }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              >
                {link.label}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: accentColor }}
                />
              </motion.a>
            ))}

            {/* CTA Button */}
            {content.buttonText && (
              <motion.a
                href={content.buttonLink || "#"}
                className="px-5 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all duration-300"
                style={{
                  backgroundColor: primaryColor,
                  color: backgroundColor,
                  fontFamily: typography.bodyFont,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                whileHover={{
                  boxShadow: `0 0 20px ${primaryColor}4d`,
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
              >
                {content.buttonText}
              </motion.a>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: textColor }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <motion.div
              className="w-6 h-5 flex flex-col justify-between"
              animate={isMobileMenuOpen ? "open" : "closed"}
            >
              <motion.span
                className="block h-0.5 w-full rounded"
                style={{ backgroundColor: textColor }}
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 9 },
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block h-0.5 w-full rounded"
                style={{ backgroundColor: textColor }}
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 },
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-0.5 w-full rounded"
                style={{ backgroundColor: textColor }}
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -9 },
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              className="md:hidden mt-4 pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-4">
                {content.links?.map((link: NavLink, index: number) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    className="text-sm font-medium uppercase tracking-wider py-2"
                    style={{ color: `${textColor}99` }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}

                {content.buttonText && (
                  <motion.a
                    href={content.buttonLink || "#"}
                    className="mt-2 px-5 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider text-center"
                    style={{
                      backgroundColor: primaryColor,
                      color: backgroundColor,
                      fontFamily: typography.bodyFont,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {content.buttonText}
                  </motion.a>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
