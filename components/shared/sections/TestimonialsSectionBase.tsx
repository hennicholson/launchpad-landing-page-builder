"use client";

import { motion } from "framer-motion";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import type { SectionItem, TestimonialVariant } from "@/lib/page-schema";
import { ScrollColumn } from "../primitives/ScrollColumn";
import { Testimonials, type TestimonialCardProps } from "@/components/ui/twitter-testimonial-cards";
import { SectionBackground } from "../SectionBackground";
import { useEditorStore } from "@/lib/store";
import { cn } from "@/lib/utils";

// CSS variables wrapper for shadcn component theming
function ShadcnWrapper({
  children,
  colorScheme,
  textColor,
}: {
  children: React.ReactNode;
  colorScheme: { background: string; primary: string; accent: string };
  textColor: string;
}) {
  return (
    <div
      style={
        {
          "--background": colorScheme.background,
          "--foreground": textColor,
          "--card": colorScheme.background,
          "--card-foreground": textColor,
          "--primary": colorScheme.primary,
          "--primary-foreground": colorScheme.background,
          "--muted": `${textColor}10`,
          "--muted-foreground": `${textColor}80`,
          "--accent": colorScheme.accent,
          "--accent-foreground": textColor,
          "--border": `${textColor}20`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

// Twitter Cards variant component
function TwitterCardsVariant({
  items,
  textColor,
  colorScheme,
}: {
  items: SectionItem[];
  textColor: string;
  colorScheme: { background: string; primary: string; accent: string };
}) {
  // Map section items to Twitter card format (max 3 cards for stacked effect)
  const displayItems = items.slice(0, 3);

  const cards: TestimonialCardProps[] = displayItems.map((item, index) => {
    // Generate card styling based on position in stack
    let className = "";
    if (index === 0) {
      className =
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0";
    } else if (index === 1) {
      className =
        "[grid-area:stack] translate-x-8 sm:translate-x-16 translate-y-6 sm:translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0";
    } else {
      className =
        "[grid-area:stack] translate-x-16 sm:translate-x-32 translate-y-12 sm:translate-y-20 hover:translate-y-6 sm:hover:translate-y-10";
    }

    // Generate handle from role (e.g., "CEO at Company" -> "@ceo_company")
    const handle = item.role
      ? `@${item.role.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 15)}`
      : item.author
        ? `@${item.author.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 15)}`
        : "@user";

    return {
      className,
      avatar: item.imageUrl,
      username: item.author || "Customer",
      handle,
      content: item.title || item.description || "Great product!",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      verified: true,
      likes: Math.floor(Math.random() * 200) + 20,
      retweets: Math.floor(Math.random() * 50) + 5,
    };
  });

  return (
    <ShadcnWrapper colorScheme={colorScheme} textColor={textColor}>
      <div className="flex justify-center py-8">
        <Testimonials cards={cards} />
      </div>
    </ShadcnWrapper>
  );
}

// Scrolling columns variant (original implementation)
function ScrollingColumnsVariant({
  items,
  textColor,
  bgColor,
  accentColor,
}: {
  items: SectionItem[];
  textColor: string;
  bgColor: string;
  accentColor: string;
}) {
  // Split items into 3 columns
  const column1 = items?.filter((_: SectionItem, i: number) => i % 3 === 0) || [];
  const column2 = items?.filter((_: SectionItem, i: number) => i % 3 === 1) || [];
  const column3 = items?.filter((_: SectionItem, i: number) => i % 3 === 2) || [];

  // Different animation speeds for visual interest
  const speeds = [35, 28, 32];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Column 1 - scrolls up */}
      {column1.length > 0 && (
        <ScrollColumn
          items={column1}
          speed={speeds[0]}
          textColor={textColor}
          bgColor={bgColor}
          accentColor={accentColor}
          startIndex={0}
          direction="up"
        />
      )}

      {/* Column 2 - scrolls down (opposite direction) */}
      {column2.length > 0 && (
        <div className="hidden md:block">
          <ScrollColumn
            items={column2}
            speed={speeds[1]}
            textColor={textColor}
            bgColor={bgColor}
            accentColor={accentColor}
            startIndex={column1.length}
            direction="down"
          />
        </div>
      )}

      {/* Column 3 - scrolls up */}
      {column3.length > 0 && (
        <div className="hidden lg:block">
          <ScrollColumn
            items={column3}
            speed={speeds[2]}
            textColor={textColor}
            bgColor={bgColor}
            accentColor={accentColor}
            startIndex={column1.length + column2.length}
            direction="up"
          />
        </div>
      )}
    </div>
  );
}

export default function TestimonialsSectionBase({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content, items } = section;

  // Dynamic colors from color scheme
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;

  // Dynamic typography
  const headingFont = typography.headingFont;

  // Get the variant
  const variant: TestimonialVariant = content.testimonialVariant || "scrolling";

  const DEFAULT_PADDING = { top: 80, bottom: 128 };

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
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {content.showBadge !== false && content.badge && (
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
          {content.showHeading !== false && content.heading && (
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]"
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
          {content.showSubheading !== false && content.subheading && (
            <span
              className="block mt-4 text-lg max-w-2xl mx-auto"
              style={{ color: `${textColor}70` }}
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
            </span>
          )}
        </motion.div>

        {/* Testimonials Content - based on variant */}
        {content.showItems !== false && items && items.length > 0 ? (
          variant === "twitter-cards" ? (
            <TwitterCardsVariant
              items={items}
              textColor={textColor}
              colorScheme={colorScheme}
            />
          ) : (
            <ScrollingColumnsVariant
              items={items}
              textColor={textColor}
              bgColor={bgColor}
              accentColor={accentColor}
            />
          )
        ) : (
          <motion.div
            className="text-center py-16 rounded-2xl"
            style={{
              color: textColor,
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.1)",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="opacity-50">Add testimonials in the properties panel</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
