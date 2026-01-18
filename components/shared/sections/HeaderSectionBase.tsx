"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, Grid2x2Plus, X } from "lucide-react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { NavLink, HeaderVariant, HeaderPosition } from "@/lib/page-schema";
import SectionButton, { getButtonPropsFromContent } from "./SectionButton";
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useScroll } from "@/hooks/use-scroll";
import { MenuToggle, MenuToggleIcon } from "@/components/ui/menu-toggle";
import { cn } from "@/lib/utils";
import { SectionBackground } from "../SectionBackground";
import { usePublishedContext } from "@/lib/published-context";

// Shared props interface for all header variants
interface HeaderVariantProps {
  section: BaseSectionProps["section"];
  colorScheme: BaseSectionProps["colorScheme"];
  typography: BaseSectionProps["typography"];
  renderText?: BaseSectionProps["renderText"];
  renderImage?: BaseSectionProps["renderImage"];
  textColor: string;
  bgColor: string;
  accentColor: string;
  primaryColor: string;
  backgroundColor: string;
  isPublished: boolean; // true = deployed page, false = editor preview
}

// Logo component shared across variants
function Logo({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
  textColor,
}: Pick<
  HeaderVariantProps,
  | "section"
  | "colorScheme"
  | "typography"
  | "renderText"
  | "renderImage"
  | "textColor"
>) {
  const { content } = section;

  if (content.logoUrl) {
    return renderImage ? (
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
    );
  }

  return (
    <span
      className="text-xl font-bold"
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
  );
}

// CSS variables wrapper for shadcn components
function ShadcnWrapper({
  children,
  colorScheme,
  textColor,
}: {
  children: React.ReactNode;
  colorScheme: BaseSectionProps["colorScheme"];
  textColor: string;
}) {
  return (
    <div
      style={
        {
          "--background": colorScheme.background,
          "--foreground": textColor,
          "--primary": colorScheme.primary,
          "--primary-foreground": "#ffffff",
          "--accent": colorScheme.accent,
          "--border": `${textColor}20`,
          "--muted": `${textColor}10`,
          "--muted-foreground": `${textColor}80`,
          "--popover": colorScheme.background,
          "--popover-foreground": textColor,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

// Helper function to get position classes based on headerPosition setting
// Uses static class names (Tailwind requires static analysis - no template literals)
// isPublished: true = deployed page (apply actual positioning), false = editor preview (Canvas wrapper handles it)
function getPositionClasses(position?: HeaderPosition, isPublished: boolean = false): string {
  // In editor preview, Canvas.tsx applies sticky to the section wrapper div
  // So the header element itself should be relative (default flow)
  if (!isPublished) {
    return "relative";
  }

  // On published pages, apply actual positioning to the header element
  switch (position) {
    case "fixed":
      return "fixed left-0 right-0";
    case "static":
      return "relative";
    case "sticky":
    default:
      return "sticky";
  }
}

// Helper to get top offset as inline style (since dynamic Tailwind classes don't work)
function getTopStyle(position?: HeaderPosition, topOffsetRem: number = 0): React.CSSProperties {
  if (position === "static") return {};
  return { top: topOffsetRem === 0 ? 0 : `${topOffsetRem}rem` };
}

// Helper to apply opacity to a hex color for glass effects
function applyOpacity(color: string, opacity: number = 100): string {
  if (!color || color === "transparent") return "transparent";
  if (opacity >= 100) return color;
  if (opacity <= 0) return "transparent";

  // Convert opacity 0-100 to hex 00-ff
  const hex = Math.round((opacity / 100) * 255).toString(16).padStart(2, '0');

  // If color is hex, append opacity
  if (color.startsWith('#')) {
    // Remove existing alpha if present (9-char hex)
    const baseColor = color.length === 9 ? color.slice(0, 7) : color;
    return `${baseColor}${hex}`;
  }

  return color; // For other formats, return as-is
}

// ==================== DEFAULT VARIANT ====================
function HeaderDefault(props: HeaderVariantProps) {
  const {
    section,
    colorScheme,
    typography,
    renderText,
    renderImage,
    textColor,
    bgColor,
    accentColor,
    primaryColor,
  } = props;
  const { content } = section;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ShadcnWrapper colorScheme={colorScheme} textColor={textColor}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo area - always takes space to maintain layout */}
          <div className="flex-shrink-0">
            {content.showLogo !== false && (content.logoUrl || content.logoText) && (
              <motion.a
                href="#"
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Logo
                  section={section}
                  colorScheme={colorScheme}
                  typography={typography}
                  renderText={renderText}
                  renderImage={renderImage}
                  textColor={textColor}
                />
              </motion.a>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {content.showLinks !== false && content.links?.map((link: NavLink, index: number) => (
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
            {content.showButton !== false && content.buttonText && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <SectionButton
                  text={content.buttonText || ""}
                  link={content.buttonLink || "#"}
                  sectionId={section.id}
                  {...getButtonPropsFromContent(content)}
                  size={content.buttonSize ?? "md"}
                  sectionBgColor={bgColor}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  schemeTextColor={textColor}
                  bodyFont={typography.bodyFont}
                  showArrow={false}
                />
              </motion.div>
            )}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: textColor }}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <SheetContent
              side="left"
              showClose={false}
              className="gap-0"
              style={{
                backgroundColor: `${colorScheme.background}f2`,
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                {content.showLinks !== false && content.links?.map((link: NavLink, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    className="text-sm font-medium py-2 px-3 rounded-md transition-colors hover:bg-white/10"
                    style={{ color: textColor }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <SheetFooter className="flex-col gap-2 p-4 border-t border-white/10">
                {content.showButton !== false && content.buttonText && (
                  <SectionButton
                    text={content.buttonText || ""}
                    link={content.buttonLink || "#"}
                    sectionId={section.id}
                    {...getButtonPropsFromContent(content)}
                    size={content.buttonSize ?? "md"}
                    sectionBgColor={bgColor}
                    primaryColor={primaryColor}
                    accentColor={accentColor}
                    schemeTextColor={textColor}
                    bodyFont={typography.bodyFont}
                    showArrow={false}
                    className="w-full justify-center"
                  />
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </ShadcnWrapper>
  );
}

// ==================== HEADER-2 VARIANT (Scroll-responsive) ====================
function Header2(props: HeaderVariantProps) {
  const {
    section,
    colorScheme,
    typography,
    renderText,
    renderImage,
    textColor,
    bgColor,
    primaryColor,
    accentColor,
    backgroundColor,
    isPublished,
  } = props;
  const { content } = section;
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScroll(10);
  const headerOpacity = content.headerBackgroundOpacity ?? 80; // Default 80% for this variant
  const headerPadding = content.headerPaddingY ?? 14;

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <ShadcnWrapper colorScheme={colorScheme} textColor={textColor}>
      <header
        className={cn(
          getPositionClasses(content.headerPosition, isPublished),
          "z-50 mx-auto w-full max-w-5xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out",
          content.headerPosition !== "static" && scrolled && !mobileOpen &&
            "md:top-4 md:max-w-4xl md:shadow"
        )}
        style={{
          ...getTopStyle(content.headerPosition, 0),
          backgroundColor:
            scrolled && !mobileOpen
              ? applyOpacity(backgroundColor, headerOpacity)
              : mobileOpen
              ? applyOpacity(backgroundColor, 90)
              : "transparent",
          backdropFilter: scrolled || headerOpacity < 100 ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled || headerOpacity < 100 ? "blur(12px)" : "none",
          borderColor: scrolled ? `${textColor}10` : "transparent",
        }}
      >
        <nav
          className={cn(
            "flex w-full items-center justify-between px-4 md:transition-all md:ease-out",
            scrolled && "md:px-2"
          )}
          style={{ paddingTop: headerPadding, paddingBottom: headerPadding }}
        >
          {/* Logo area - always takes space to maintain layout */}
          <div className="flex-shrink-0">
            {content.showLogo !== false && (content.logoUrl || content.logoText) && (
              <Logo
                section={section}
                colorScheme={colorScheme}
                typography={typography}
                renderText={renderText}
                renderImage={renderImage}
                textColor={textColor}
              />
            )}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {content.showLinks !== false && content.links?.map((link: NavLink, index: number) => (
              <a
                key={index}
                href={link.url}
                className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-white/10"
                style={{ color: textColor }}
              >
                {link.label}
              </a>
            ))}
            {content.showButton !== false && content.buttonText && (
              <SectionButton
                text={content.buttonText}
                link={content.buttonLink || "#"}
                sectionId={section.id}
                {...getButtonPropsFromContent(content)}
                size="sm"
                sectionBgColor={bgColor}
                primaryColor={primaryColor}
                accentColor={accentColor}
                schemeTextColor={textColor}
                bodyFont={typography.bodyFont}
                showArrow={false}
              />
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg border"
            style={{
              color: textColor,
              borderColor: `${textColor}20`,
            }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <MenuToggleIcon
              open={mobileOpen}
              className="w-5 h-5"
              duration={300}
            />
          </button>
        </nav>

        {/* Mobile fullscreen menu */}
        <div
          className={cn(
            "fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-y md:hidden",
            mobileOpen ? "block" : "hidden"
          )}
          style={{
            backgroundColor: `${backgroundColor}e6`,
            borderColor: `${textColor}10`,
          }}
        >
          <div
            data-slot={mobileOpen ? "open" : "closed"}
            className={cn(
              "data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out",
              "flex h-full w-full flex-col justify-between gap-y-2 p-4"
            )}
          >
            <div className="grid gap-y-2">
              {content.showLinks !== false && content.links?.map((link: NavLink, index: number) => (
                <a
                  key={index}
                  href={link.url}
                  className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-white/10"
                  style={{ color: textColor }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {content.showButton !== false && content.buttonText && (
                <SectionButton
                  text={content.buttonText}
                  link={content.buttonLink || "#"}
                  sectionId={section.id}
                  {...getButtonPropsFromContent(content)}
                  size="md"
                  sectionBgColor={bgColor}
                  primaryColor={primaryColor}
                  accentColor={accentColor}
                  schemeTextColor={textColor}
                  bodyFont={typography.bodyFont}
                  showArrow={false}
                  className="w-full justify-center"
                />
              )}
            </div>
          </div>
        </div>
      </header>
    </ShadcnWrapper>
  );
}

// ==================== FLOATING HEADER VARIANT ====================
function FloatingHeader(props: HeaderVariantProps) {
  const {
    section,
    colorScheme,
    typography,
    renderText,
    renderImage,
    textColor,
    bgColor,
    primaryColor,
    accentColor,
    backgroundColor,
    isPublished,
  } = props;
  const { content } = section;
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerOpacity = content.headerBackgroundOpacity ?? 80; // Default 80% for floating
  const headerPadding = content.headerPaddingY ?? 6;

  return (
    <ShadcnWrapper colorScheme={colorScheme} textColor={textColor}>
      <header
        className={cn(getPositionClasses(content.headerPosition, isPublished), "z-50 mx-auto w-full max-w-3xl rounded-lg border shadow")}
        style={{
          ...getTopStyle(content.headerPosition, 1.25),
          backgroundColor: applyOpacity(backgroundColor, headerOpacity),
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: `${textColor}10`,
        }}
      >
        <nav className="mx-auto flex items-center justify-between" style={{ padding: headerPadding }}>
          {/* Logo area - always takes space to maintain layout */}
          <div className="flex-shrink-0">
            {content.showLogo !== false && (content.logoUrl || content.logoText) && (
              <div className="hover:bg-white/10 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition-colors">
                <Logo
                  section={section}
                  colorScheme={colorScheme}
                  typography={typography}
                  renderText={renderText}
                  renderImage={renderImage}
                  textColor={textColor}
                />
              </div>
            )}
          </div>

          <div className="hidden items-center gap-1 lg:flex">
            {content.showLinks !== false && content.links?.map((link: NavLink, index: number) => (
              <a
                key={index}
                href={link.url}
                className="px-3 py-1.5 text-sm rounded-md transition-colors hover:bg-white/10"
                style={{ color: textColor }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {content.showButton !== false && content.buttonText && (
              <SectionButton
                text={content.buttonText}
                link={content.buttonLink || "#"}
                sectionId={section.id}
                {...getButtonPropsFromContent(content)}
                size="sm"
                sectionBgColor={bgColor}
                primaryColor={primaryColor}
                accentColor={accentColor}
                schemeTextColor={textColor}
                bodyFont={typography.bodyFont}
                showArrow={false}
              />
            )}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <button
                className="lg:hidden p-2 rounded-md border"
                style={{
                  color: textColor,
                  borderColor: `${textColor}20`,
                }}
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="w-4 h-4" />
              </button>
              <SheetContent
                side="left"
                showClose={false}
                className="gap-0"
                style={{
                  backgroundColor: `${backgroundColor}f2`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                  {content.showLinks !== false && content.links?.map((link: NavLink, index: number) => (
                    <a
                      key={index}
                      href={link.url}
                      className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-white/10"
                      style={{ color: textColor }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <SheetFooter className="flex-col gap-2 p-4 border-t border-white/10">
                  {content.showButton !== false && content.buttonText && (
                    <SectionButton
                      text={content.buttonText}
                      link={content.buttonLink || "#"}
                      sectionId={section.id}
                      {...getButtonPropsFromContent(content)}
                      size="md"
                      sectionBgColor={bgColor}
                      primaryColor={primaryColor}
                      accentColor={accentColor}
                      schemeTextColor={textColor}
                      bodyFont={typography.bodyFont}
                      showArrow={false}
                      className="w-full justify-center"
                    />
                  )}
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </ShadcnWrapper>
  );
}

// ==================== SIMPLE HEADER VARIANT ====================
function SimpleHeader(props: HeaderVariantProps) {
  const {
    section,
    colorScheme,
    typography,
    renderText,
    renderImage,
    textColor,
    bgColor,
    primaryColor,
    accentColor,
    backgroundColor,
    isPublished,
  } = props;
  const { content } = section;
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerOpacity = content.headerBackgroundOpacity ?? 95; // Default 95% for simple
  const headerPadding = content.headerPaddingY ?? 14;

  return (
    <ShadcnWrapper colorScheme={colorScheme} textColor={textColor}>
      <header
        className={cn(getPositionClasses(content.headerPosition, isPublished), "z-50 w-full border-b")}
        style={{
          ...getTopStyle(content.headerPosition, 0),
          backgroundColor: applyOpacity(backgroundColor, headerOpacity),
          backdropFilter: headerOpacity < 100 ? "blur(12px)" : undefined,
          WebkitBackdropFilter: headerOpacity < 100 ? "blur(12px)" : undefined,
          borderColor: `${textColor}10`,
        }}
      >
        <nav className="mx-auto flex w-full max-w-4xl items-center justify-between px-4" style={{ paddingTop: headerPadding, paddingBottom: headerPadding }}>
          {/* Logo area - always takes space to maintain layout */}
          <div className="flex-shrink-0">
            {content.showLogo !== false && (content.logoUrl || content.logoText) && (
              <div className="flex items-center gap-2">
                <Logo
                  section={section}
                  colorScheme={colorScheme}
                  typography={typography}
                  renderText={renderText}
                  renderImage={renderImage}
                  textColor={textColor}
                />
              </div>
            )}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {content.showLinks !== false && content.links?.map((link: NavLink, index: number) => (
              <a
                key={index}
                href={link.url}
                className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-white/10"
                style={{ color: textColor }}
              >
                {link.label}
              </a>
            ))}
            {content.showButton !== false && content.buttonText && (
              <SectionButton
                text={content.buttonText}
                link={content.buttonLink || "#"}
                sectionId={section.id}
                {...getButtonPropsFromContent(content)}
                size="md"
                sectionBgColor={bgColor}
                primaryColor={primaryColor}
                accentColor={accentColor}
                schemeTextColor={textColor}
                bodyFont={typography.bodyFont}
                showArrow={false}
              />
            )}
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <button
              className="lg:hidden p-2 rounded-md border"
              style={{
                color: textColor,
                borderColor: `${textColor}20`,
              }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuToggle
                open={mobileOpen}
                onOpenChange={setMobileOpen}
                className="w-6 h-6"
                strokeWidth={2.5}
              />
            </button>
            <SheetContent
              side="left"
              showClose={false}
              className="gap-0"
              style={{
                backgroundColor: `${backgroundColor}f2`,
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                {content.showLinks !== false && content.links?.map((link: NavLink, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-white/10"
                    style={{ color: textColor }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <SheetFooter className="flex-col gap-2 p-4 border-t border-white/10">
                {content.showButton !== false && content.buttonText && (
                  <SectionButton
                    text={content.buttonText}
                    link={content.buttonLink || "#"}
                    sectionId={section.id}
                    {...getButtonPropsFromContent(content)}
                    size="md"
                    sectionBgColor={bgColor}
                    primaryColor={primaryColor}
                    accentColor={accentColor}
                    schemeTextColor={textColor}
                    bodyFont={typography.bodyFont}
                    showArrow={false}
                    className="w-full justify-center"
                  />
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </nav>
      </header>
    </ShadcnWrapper>
  );
}

// ==================== HEADER WITH SEARCH VARIANT ====================
function HeaderWithSearch(props: HeaderVariantProps) {
  const {
    section,
    colorScheme,
    typography,
    renderText,
    renderImage,
    textColor,
    bgColor,
    primaryColor,
    accentColor,
    backgroundColor,
    isPublished,
  } = props;
  const { content } = section;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerOpacity = content.headerBackgroundOpacity ?? 95; // Default 95% for search header
  const headerPadding = content.headerPaddingY ?? 14;

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchPlaceholder = (content as any).searchPlaceholder || "Search...";

  return (
    <ShadcnWrapper colorScheme={colorScheme} textColor={textColor}>
      <header
        className={cn(getPositionClasses(content.headerPosition, isPublished), "z-50 w-full border-b")}
        style={{
          ...getTopStyle(content.headerPosition, 0),
          backgroundColor: applyOpacity(backgroundColor, headerOpacity),
          backdropFilter: headerOpacity < 100 ? "blur(12px)" : undefined,
          WebkitBackdropFilter: headerOpacity < 100 ? "blur(12px)" : undefined,
          borderColor: `${textColor}10`,
        }}
      >
        <nav className="mx-auto flex w-full max-w-4xl items-center justify-between px-4" style={{ paddingTop: headerPadding, paddingBottom: headerPadding }}>
          {/* Logo area - always takes space to maintain layout */}
          <div className="flex-shrink-0">
            {content.showLogo !== false && (content.logoUrl || content.logoText) && (
              <div className="hover:bg-white/10 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition-colors">
                <Logo
                  section={section}
                  colorScheme={colorScheme}
                  typography={typography}
                  renderText={renderText}
                  renderImage={renderImage}
                  textColor={textColor}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 lg:flex">
              {content.showLinks !== false && content.links?.map((link: NavLink, index: number) => (
                <a
                  key={index}
                  href={link.url}
                  className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-white/10"
                  style={{ color: textColor }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Search Button */}
            {content.showSearchBar !== false && (content as any).searchPlaceholder && (
              <button
                onClick={() => setSearchOpen(true)}
                className="relative flex items-center justify-center w-9 h-9 p-0 rounded-md border cursor-pointer md:border xl:h-9 xl:w-60 xl:justify-between xl:px-3 xl:py-2"
                style={{
                  borderColor: `${textColor}20`,
                  color: `${textColor}80`,
                }}
              >
                <span className="hidden xl:inline-flex">{searchPlaceholder}</span>
                <span className="sr-only">Search</span>
                <Search className="w-4 h-4" />
              </button>
            )}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <button
                className="lg:hidden p-2 rounded-md border"
                style={{
                  color: textColor,
                  borderColor: `${textColor}20`,
                }}
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="w-4 h-4" />
              </button>
              <SheetContent
                side="left"
                showClose={false}
                className="gap-0"
                style={{
                  backgroundColor: `${backgroundColor}f2`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
                  {content.showLinks !== false && content.links?.map((link: NavLink, index: number) => (
                    <a
                      key={index}
                      href={link.url}
                      className="px-3 py-2 text-sm rounded-md transition-colors hover:bg-white/10"
                      style={{ color: textColor }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <SheetFooter className="flex-col gap-2 p-4 border-t border-white/10">
                  {content.showButton !== false && content.buttonText && (
                    <SectionButton
                      text={content.buttonText}
                      link={content.buttonLink || "#"}
                      sectionId={section.id}
                      {...getButtonPropsFromContent(content)}
                      size="md"
                      sectionBgColor={bgColor}
                      primaryColor={primaryColor}
                      accentColor={accentColor}
                      schemeTextColor={textColor}
                      bodyFont={typography.bodyFont}
                      showArrow={false}
                      className="w-full justify-center"
                    />
                  )}
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      {/* Search Modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent
          className="p-1"
          style={{
            backgroundColor: colorScheme.background,
            borderColor: `${textColor}20`,
          }}
        >
          <Command
            className="rounded-md"
            style={{
              backgroundColor: colorScheme.background,
            }}
          >
            <CommandInput
              placeholder={searchPlaceholder}
              style={{ color: textColor }}
            />
            <CommandList
              className="max-h-[380px] min-h-[200px] px-2"
              style={{ color: textColor }}
            >
              <CommandEmpty className="flex min-h-[140px] flex-col items-center justify-center">
                <Search
                  className="mb-2 w-6 h-6"
                  style={{ color: `${textColor}60` }}
                />
                <p className="text-xs" style={{ color: `${textColor}60` }}>
                  No results found
                </p>
              </CommandEmpty>
              <CommandGroup>
                {/* Demo search items */}
                {["Features", "Pricing", "Documentation", "Support"].map(
                  (item) => (
                    <CommandItem
                      key={item}
                      className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2"
                      style={{ color: textColor }}
                      onSelect={() => setSearchOpen(false)}
                    >
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{item}</p>
                        <p
                          className="text-xs"
                          style={{ color: `${textColor}60` }}
                        >
                          Navigate to {item.toLowerCase()}
                        </p>
                      </div>
                    </CommandItem>
                  )
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </ShadcnWrapper>
  );
}

// ==================== MAIN COMPONENT ====================
export default function HeaderSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
  renderImage,
}: BaseSectionProps) {
  const { content } = section;
  const headerRef = useRef<HTMLElement>(null);

  // Detect if we're on a published page (vs editor preview)
  const publishedContext = usePublishedContext();
  const isPublished = publishedContext !== null;

  // Get variant
  const variant: HeaderVariant =
    (content.headerVariant as HeaderVariant) || "default";

  // Dynamic colors
  const accentColor = content.accentColor || colorScheme.accent;
  const textColor = content.textColor || colorScheme.text;
  const bgColor = content.backgroundColor || "transparent";
  const primaryColor = colorScheme.primary;
  const backgroundColor = colorScheme.background;

  const sharedProps: HeaderVariantProps = {
    section,
    colorScheme,
    typography,
    renderText,
    renderImage,
    textColor,
    bgColor,
    accentColor,
    primaryColor,
    backgroundColor,
    isPublished,
  };

  // Floating header has its own wrapper
  if (variant === "floating-header") {
    return (
      <div className="w-full px-4 py-4">
        <FloatingHeader {...sharedProps} />
      </div>
    );
  }

  // Header-2 is self-contained with its own sticky behavior
  if (variant === "header-2") {
    return <Header2 {...sharedProps} />;
  }

  // Simple header is self-contained
  if (variant === "simple-header") {
    return <SimpleHeader {...sharedProps} />;
  }

  // Header with search is self-contained
  if (variant === "header-with-search") {
    return <HeaderWithSearch {...sharedProps} />;
  }

  // Default header
  const headerOpacity = content.headerBackgroundOpacity ?? 100;
  const headerPadding = content.headerPaddingY ?? 20;
  return (
    <header
      ref={headerRef}
      className={cn(getPositionClasses(content.headerPosition, isPublished), "z-50 w-full overflow-hidden")}
      style={{
        ...getTopStyle(content.headerPosition, 0),
        paddingTop: headerPadding,
        paddingBottom: headerPadding,
        backgroundColor: bgColor === "transparent" ? "transparent" : applyOpacity(bgColor, headerOpacity),
        backdropFilter: headerOpacity < 100 ? "blur(12px)" : undefined,
        WebkitBackdropFilter: headerOpacity < 100 ? "blur(12px)" : undefined,
      }}
    >
      <SectionBackground effect={content.backgroundEffect} />
      <HeaderDefault {...sharedProps} />
    </header>
  );
}
