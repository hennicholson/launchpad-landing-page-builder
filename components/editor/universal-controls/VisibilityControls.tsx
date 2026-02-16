"use client";

import React from "react";
import type { PageSection, SectionType } from "@/lib/page-schema";
import { VisibilityToggle } from "../shared-controls";

function getItemsLabel(sectionType: SectionType): string {
  switch (sectionType) {
    case "features": return "Feature Cards";
    case "pricing": return "Pricing Plans";
    case "offer": return "Offer Details";
    case "testimonials": return "Testimonials";
    case "stats": return "Statistics";
    case "faq": return "FAQ Items";
    case "gallery": return "Gallery Images";
    case "process": return "Process Steps";
    case "comparison": return "Comparison Items";
    case "founders": return "Team Members";
    case "whop-offer": return "Offer Items";
    case "whop-testimonials": return "Testimonials";
    case "whop-curriculum": return "Modules";
    case "whop-results": return "Results";
    case "whop-comparison": return "Comparison Columns";
    case "whop-creator": return "Creators";
    case "whop-final-cta": return "Trust Badges";
    case "glass-features": return "Features";
    case "glass-founders": return "Team Members";
    case "glass-testimonials": return "Testimonials";
    case "glass-pricing": return "Pricing Tiers";
    case "offer-details": return "Offer Items";
    case "detailed-features": return "Feature Items";
    case "creator": return "Credentials";
    default: return "Items";
  }
}

export function VisibilityControls({
  section,
  sectionId,
  sectionType,
  updateSectionContent,
}: {
  section: PageSection;
  sectionId: string;
  sectionType: SectionType;
  updateSectionContent: (id: string, content: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
          Element Visibility
        </label>
        <p className="text-[10px] text-white/30 mt-1">Toggle elements on/off</p>
      </div>

      {/* Text Content Group */}
      {(section.content.heading !== undefined ||
        section.content.subheading !== undefined ||
        section.content.bodyText !== undefined ||
        section.content.badge !== undefined) && (
        <div className="space-y-2">
          <div className="text-[10px] text-white/40 uppercase tracking-wide">Text Content</div>
          {section.content.heading !== undefined && (
            <VisibilityToggle
              label="Heading"
              checked={section.content.showHeading !== false}
              onChange={(v) => updateSectionContent(sectionId, { showHeading: v })}
            />
          )}
          {section.content.subheading !== undefined && (
            <VisibilityToggle
              label="Subheading"
              checked={section.content.showSubheading !== false}
              onChange={(v) => updateSectionContent(sectionId, { showSubheading: v })}
            />
          )}
          {section.content.bodyText !== undefined && (
            <VisibilityToggle
              label="Body Text"
              checked={section.content.showBodyText !== false}
              onChange={(v) => updateSectionContent(sectionId, { showBodyText: v })}
            />
          )}
          {section.content.badge !== undefined && (
            <VisibilityToggle
              label="Badge"
              checked={section.content.showBadge !== false}
              onChange={(v) => updateSectionContent(sectionId, { showBadge: v })}
            />
          )}
        </div>
      )}

      {/* Media Content Group */}
      {(section.content.imageUrl !== undefined ||
        section.content.videoUrl !== undefined ||
        section.content.backgroundImage !== undefined) && (
        <div className="space-y-2">
          <div className="text-[10px] text-white/40 uppercase tracking-wide">Media</div>
          {section.content.imageUrl !== undefined && (
            <VisibilityToggle
              label="Image"
              checked={section.content.showImage !== false}
              onChange={(v) => updateSectionContent(sectionId, { showImage: v })}
            />
          )}
          {section.content.videoUrl !== undefined && (
            <VisibilityToggle
              label="Video"
              checked={section.content.showVideo !== false}
              onChange={(v) => updateSectionContent(sectionId, { showVideo: v })}
            />
          )}
          {section.content.backgroundImage !== undefined && (
            <VisibilityToggle
              label="Background Image"
              checked={section.content.showBackgroundImage !== false}
              onChange={(v) => updateSectionContent(sectionId, { showBackgroundImage: v })}
            />
          )}
        </div>
      )}

      {/* Interactive Elements Group */}
      {(section.content.buttonText !== undefined ||
        (sectionType === "header" && section.content.headerVariant === "header-with-search" && section.content.searchPlaceholder !== undefined)) && (
        <div className="space-y-2">
          <div className="text-[10px] text-white/40 uppercase tracking-wide">Interactive</div>
          {section.content.buttonText !== undefined && (
            <VisibilityToggle
              label="Button"
              checked={section.content.showButton !== false}
              onChange={(v) => updateSectionContent(sectionId, { showButton: v })}
            />
          )}
          {sectionType === "header" && section.content.headerVariant === "header-with-search" && section.content.searchPlaceholder !== undefined && (
            <VisibilityToggle
              label="Search Bar"
              checked={section.content.showSearchBar !== false}
              onChange={(v) => updateSectionContent(sectionId, { showSearchBar: v })}
            />
          )}
        </div>
      )}

      {/* Section-Specific Content Group */}
      {(section.items && section.items.length > 0 ||
        section.content.brands && section.content.brands.length > 0 ||
        ((sectionType === "header" || sectionType === "footer") && (section.content.links && section.content.links.length > 0)) ||
        ((sectionType === "header" || sectionType === "footer") && (section.content.logoUrl || section.content.logoText)) ||
        (sectionType === "footer" && section.content.tagline) ||
        (sectionType === "audience" && (section.content.forItems || section.content.notForItems))) && (
        <div className="space-y-2">
          <div className="text-[10px] text-white/40 uppercase tracking-wide">Section Content</div>
          {section.items && section.items.length > 0 && (
            <VisibilityToggle
              label={getItemsLabel(sectionType)}
              checked={section.content.showItems !== false}
              onChange={(v) => updateSectionContent(sectionId, { showItems: v })}
            />
          )}
          {section.content.brands && section.content.brands.length > 0 && (
            <VisibilityToggle
              label="Brand Logos"
              checked={section.content.showBrands !== false}
              onChange={(v) => updateSectionContent(sectionId, { showBrands: v })}
            />
          )}
          {(sectionType === "header" || sectionType === "footer") && (section.content.logoUrl || section.content.logoText) && (
            <VisibilityToggle
              label="Logo"
              checked={section.content.showLogo !== false}
              onChange={(v) => updateSectionContent(sectionId, { showLogo: v })}
            />
          )}
          {(sectionType === "header" || sectionType === "footer") && section.content.links && section.content.links.length > 0 && (
            <VisibilityToggle
              label="Navigation Links"
              checked={section.content.showLinks !== false}
              onChange={(v) => updateSectionContent(sectionId, { showLinks: v })}
            />
          )}
          {sectionType === "footer" && section.content.tagline && (
            <VisibilityToggle
              label="Tagline"
              checked={section.content.showTagline !== false}
              onChange={(v) => updateSectionContent(sectionId, { showTagline: v })}
            />
          )}
          {sectionType === "footer" && (
            <VisibilityToggle
              label="Social Icons"
              checked={section.content.showSocial !== false}
              onChange={(v) => updateSectionContent(sectionId, { showSocial: v })}
            />
          )}
          {sectionType === "audience" && section.content.forItems && section.content.forItems.length > 0 && (
            <VisibilityToggle
              label="'For You' List"
              checked={section.content.showForItems !== false}
              onChange={(v) => updateSectionContent(sectionId, { showForItems: v })}
            />
          )}
          {sectionType === "audience" && section.content.notForItems && section.content.notForItems.length > 0 && (
            <VisibilityToggle
              label="'Not For You' List"
              checked={section.content.showNotForItems !== false}
              onChange={(v) => updateSectionContent(sectionId, { showNotForItems: v })}
            />
          )}
        </div>
      )}
    </div>
  );
}
