"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, CalendarCheck, Sparkles } from "lucide-react";
import type { BaseSectionProps } from "@/lib/shared-section-types";
import { cn } from "@/lib/utils";
import { SubheadingText } from "./SubheadingText";
import { useEditorStore } from "@/lib/store";
import { SectionBackground } from "../SectionBackground";

const MeetingIllustration = () => {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Card className="w-full max-w-[200px] p-3">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-500" />
            <div className="flex-1 space-y-1">
              <div className="h-2 w-3/4 rounded bg-neutral-300 dark:bg-neutral-700" />
              <div className="h-2 w-1/2 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "aspect-square rounded-sm",
                  i === 10 || i === 17 || i === 24
                    ? "bg-blue-500"
                    : "bg-neutral-200 dark:bg-neutral-800"
                )}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const CodeReviewIllustration = () => {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[200px]">
          <Card className="mb-2 p-2 transition-transform duration-300 group-hover:-rotate-2">
            <div className="mb-1 h-2 w-3/4 rounded bg-purple-500" />
            <div className="h-2 w-1/2 rounded bg-neutral-300 dark:bg-neutral-700" />
          </Card>
          <Card className="mb-2 p-2 transition-transform duration-300 group-hover:rotate-1">
            <div className="mb-1 h-2 w-2/3 rounded bg-pink-500" />
            <div className="h-2 w-5/6 rounded bg-neutral-300 dark:bg-neutral-700" />
          </Card>
          <Card className="p-2 transition-transform duration-300 group-hover:-rotate-1">
            <div className="mb-1 h-2 w-4/5 rounded bg-purple-400" />
            <div className="h-2 w-3/5 rounded bg-neutral-300 dark:bg-neutral-700" />
          </Card>
        </div>
      </div>
    </div>
  );
};

const AIAssistantIllustration = () => {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-900">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-[200px] space-y-2">
          <div className="flex justify-end">
            <Card className="max-w-[80%] p-2">
              <div className="h-2 w-full rounded bg-neutral-300 dark:bg-neutral-700" />
            </Card>
          </div>
          <div className="flex justify-start">
            <Card className="max-w-[80%] p-2">
              <div className="mb-1 h-2 w-full rounded bg-emerald-500" />
              <div className="h-2 w-3/4 rounded bg-emerald-400" />
            </Card>
          </div>
          <div className="flex justify-end">
            <Card className="max-w-[60%] p-2">
              <div className="h-2 w-full rounded bg-neutral-300 dark:bg-neutral-700" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  target: Target,
  calendar: CalendarCheck,
  sparkles: Sparkles,
};

export default function FeaturesIllustratedBase({
  section,
  colorScheme,
  typography,
  renderText,
}: BaseSectionProps) {
  const { content, items } = section;

  // Only enable selection in editor mode (when renderText exists)
  const isEditorMode = !!renderText;
  const selectItem = useEditorStore((state) => state.selectItem);
  const selectedItemId = useEditorStore((state) => state.selectedItemId);

  // Extract styling
  const bgColor = content.backgroundColor || colorScheme.background;
  const textColor = content.textColor || colorScheme.text;
  const accentColor = content.accentColor || colorScheme.accent;
  const bodyFont = typography.bodyFont;

  const DEFAULT_PADDING = { top: 96, bottom: 96 };

  const illustrationMap: Record<string, React.ComponentType> = {
    meeting: MeetingIllustration,
    "code-review": CodeReviewIllustration,
    "ai-assistant": AIAssistantIllustration,
  };

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
                  className: "mb-4 text-4xl font-bold tracking-tight",
                })
              ) : (
                <h2 className="mb-4 text-4xl font-bold tracking-tight" style={{ color: textColor }}>
                  {content.heading}
                </h2>
              )
            )}
            <SubheadingText
              content={content}
              sectionId={section.id}
              textColor={textColor}
              bodyFont={bodyFont}
              renderText={renderText}
            />
          </div>
        ) : null}

        {/* Features Grid */}
        {content.showItems !== false && items && items.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const Icon = iconMap[item.icon || "target"] || Target;
              const Illustration = illustrationMap[item.illustrationType || "meeting"] || MeetingIllustration;
              const isSelected = isEditorMode && selectedItemId === item.id;

              const handleCardClick = (e: React.MouseEvent) => {
                if (!isEditorMode) return;
                if (window.getSelection()?.toString()) return;
                selectItem(section.id, item.id);
              };

              return (
                <div
                  key={item.id}
                  onClick={isEditorMode ? handleCardClick : undefined}
                  className={cn(
                    "group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg",
                    isEditorMode && "cursor-pointer",
                    isSelected && "ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent"
                  )}
                >
                  <Illustration />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <div style={{ color: accentColor }}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    {renderText ? (
                      renderText({
                        value: item.title || "",
                        sectionId: section.id,
                        field: "title",
                        itemId: item.id,
                        className: "mb-2 text-xl font-semibold",
                      })
                    ) : (
                      <h3 className="mb-2 text-xl font-semibold" style={{ color: textColor }}>
                        {item.title}
                      </h3>
                    )}
                    {renderText ? (
                      renderText({
                        value: item.description || "",
                        sectionId: section.id,
                        field: "description",
                        itemId: item.id,
                        className: "mb-4 flex-1 text-muted-foreground",
                      })
                    ) : (
                      <p className="mb-4 flex-1 text-muted-foreground" style={{ color: `${textColor}99` }}>
                        {item.description}
                      </p>
                    )}
                    {content.showButton !== false && (
                      <Button variant="ghost" className="w-fit">
                        Learn more →
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
