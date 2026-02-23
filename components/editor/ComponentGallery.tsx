"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useEditorStore } from "@/lib/store";
import {
  COMPONENT_CATALOG,
  GALLERY_CATEGORIES,
  USE_CASE_TAGS,
  type ComponentCategory,
  type UseCaseTag,
} from "@/lib/component-catalog";
import type { SectionType, CTAVariant, HeaderVariant, TestimonialVariant, FeaturesVariant, HeroVariant } from "@/lib/page-schema";
import ComponentGalleryCard from "./ComponentGalleryCard";

type ComponentGalleryProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ComponentGallery({ open, onOpenChange }: ComponentGalleryProps) {
  const addSection = useEditorStore((s) => s.addSection);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<ComponentCategory | "all">("all");
  const [activeTags, setActiveTags] = useState<Set<UseCaseTag>>(new Set());
  const [showSidebar, setShowSidebar] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Scroll grid to top when category changes
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: COMPONENT_CATALOG.length };
    for (const entry of COMPONENT_CATALOG) {
      counts[entry.category] = (counts[entry.category] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredComponents = useMemo(() => {
    return COMPONENT_CATALOG.filter((entry) => {
      // Category filter
      if (activeTab !== "all" && entry.category !== activeTab) return false;
      // Tag filter
      if (activeTags.size > 0 && !entry.tags.some((t) => activeTags.has(t))) return false;
      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !entry.label.toLowerCase().includes(q) &&
          !entry.description.toLowerCase().includes(q) &&
          !entry.type.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [activeTab, activeTags, search]);

  const toggleTag = (tag: UseCaseTag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const handleAdd = (type: string, variantId?: string) => {
    const sectionType = type as SectionType;
    const options: {
      ctaVariant?: CTAVariant;
      headerVariant?: HeaderVariant;
      testimonialVariant?: TestimonialVariant;
      featuresVariant?: FeaturesVariant;
      heroVariant?: HeroVariant;
    } = {};

    if (variantId) {
      if (sectionType === "cta") options.ctaVariant = variantId as CTAVariant;
      else if (sectionType === "header") options.headerVariant = variantId as HeaderVariant;
      else if (sectionType === "testimonials") options.testimonialVariant = variantId as TestimonialVariant;
      else if (sectionType === "features") options.featuresVariant = variantId as FeaturesVariant;
      else if (sectionType === "hero") options.heroVariant = variantId as HeroVariant;
    }

    addSection(sectionType, undefined, Object.keys(options).length > 0 ? options : undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/70 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className="fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-[92vw] h-[88vh] max-w-7xl bg-[#0f0f10] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
        >
          {/* Top bar */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
            <h2 className="text-sm font-medium text-white/90 shrink-0">Component Library</h2>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search components..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/30"
              />
            </div>
            <div className="text-xs text-white/30">
              {filteredComponents.length} component{filteredComponents.length !== 1 ? "s" : ""}
            </div>
            <button
              onClick={() => setShowSidebar((v) => !v)}
              className={`lg:hidden p-1.5 rounded-lg transition-colors ${showSidebar ? "bg-white/10 text-white/70" : "hover:bg-white/5 text-white/40"}`}
              title="Toggle filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <DialogPrimitive.Close className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white/50" />
            </DialogPrimitive.Close>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1 px-6 py-2.5 border-b border-white/5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab("all")}
              className={`shrink-0 px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === "all"
                  ? "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30"
                  : "text-white/50 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              All
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === "all" ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-white/30"}`}>
                {categoryCounts.all}
              </span>
            </button>
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`shrink-0 px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === cat.id
                    ? "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30"
                    : "text-white/50 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                {cat.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === cat.id ? "bg-violet-500/20 text-violet-300" : "bg-white/5 text-white/30"}`}>
                  {categoryCounts[cat.id] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Main content area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Component grid */}
            <div ref={gridRef} className="flex-1 overflow-y-auto p-6">
              {filteredComponents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/30">
                  <Search className="w-10 h-10 mb-3 text-white/15" />
                  <p className="text-sm">No components found</p>
                  <p className="text-xs mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredComponents.map((entry) => (
                    <ComponentGalleryCard
                      key={entry.type}
                      entry={entry}
                      onAdd={handleAdd}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right sidebar - use-case tags */}
            <div className={`w-48 shrink-0 border-l border-white/5 p-4 flex-col gap-3 hidden lg:flex ${showSidebar ? "!flex" : ""}`}>
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">
                Use Cases
              </h3>
              <div className="flex flex-col gap-1.5">
                {USE_CASE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                      activeTags.has(tag)
                        ? "bg-[#D6FC51]/10 text-[#D6FC51] ring-1 ring-[#D6FC51]/20"
                        : "text-white/50 hover:text-white/70 hover:bg-white/5"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {activeTags.size > 0 && (
                <button
                  onClick={() => setActiveTags(new Set())}
                  className="text-[11px] text-white/30 hover:text-white/50 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
