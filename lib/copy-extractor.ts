/**
 * Extract all text/copy content from a LandingPage for the copy sheet export
 */

import type { LandingPage, PageSection, SectionItem } from "./page-schema";

export interface CopyItem {
  label: string;
  value: string;
  link?: string;
}

export interface ItemCopy {
  title: string;
  content: CopyItem[];
}

export interface SectionCopy {
  sectionType: string;
  sectionName: string;
  content: CopyItem[];
  items?: ItemCopy[];
}

/**
 * Format section type for display (e.g., "hero" -> "Hero", "value-proposition" -> "Value Proposition")
 */
function formatSectionType(type: string): string {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Extract copy items from section content
 */
function extractSectionContent(section: PageSection): CopyItem[] {
  const { content, type } = section;
  const items: CopyItem[] = [];

  // Headlines
  if (content.heading) {
    items.push({ label: "Heading", value: content.heading });
  }
  if (content.topTitle) {
    items.push({ label: "Top Title", value: content.topTitle });
  }
  if (content.cardTitle) {
    items.push({ label: "Card Title", value: content.cardTitle });
  }

  // Subheadings
  if (content.subheading) {
    items.push({ label: "Subheading", value: content.subheading });
  }
  if (content.announcementText) {
    items.push({
      label: "Announcement",
      value: content.announcementText,
      link: content.announcementLink,
    });
  }

  // Badge
  if (content.badge) {
    items.push({ label: "Badge", value: content.badge });
  }

  // Body text
  if (content.bodyText) {
    items.push({ label: "Body Text", value: content.bodyText });
  }
  if (content.introText) {
    items.push({ label: "Intro Text", value: content.introText });
  }

  // Body paragraphs (for value-proposition)
  if (content.bodyParagraphs && content.bodyParagraphs.length > 0) {
    content.bodyParagraphs.forEach((para, i) => {
      items.push({ label: `Paragraph ${i + 1}`, value: para });
    });
  }

  // Buttons
  if (content.buttonText) {
    items.push({
      label: "Button",
      value: content.buttonText,
      link: content.buttonLink,
    });
  }
  if (content.primaryButtonText) {
    items.push({
      label: "Button (Primary)",
      value: content.primaryButtonText,
      link: content.primaryButtonLink,
    });
  }
  if (content.secondaryButtonText) {
    items.push({
      label: "Button (Secondary)",
      value: content.secondaryButtonText,
      link: content.secondaryButtonLink,
    });
  }
  if (content.ctaText) {
    items.push({
      label: "CTA Button",
      value: content.ctaText,
      link: content.ctaUrl,
    });
  }
  if (content.ctaSecondaryText) {
    items.push({ label: "CTA Secondary", value: content.ctaSecondaryText });
  }

  // Form elements
  if (content.formPlaceholder) {
    items.push({ label: "Form Placeholder", value: content.formPlaceholder });
  }
  if (content.formButtonText) {
    items.push({ label: "Form Button", value: content.formButtonText });
  }

  // Header/Footer specific
  if (content.logoText) {
    items.push({ label: "Logo Text", value: content.logoText });
  }
  if (content.tagline) {
    items.push({ label: "Tagline", value: content.tagline });
  }

  // Navigation links
  if (content.links && content.links.length > 0) {
    content.links.forEach((link, i) => {
      items.push({
        label: `Nav Link ${i + 1}`,
        value: link.label,
        link: link.url,
      });
    });
  }

  // Creator section
  if (content.creatorName) {
    items.push({ label: "Creator Name", value: content.creatorName });
  }
  if (content.creatorRole) {
    items.push({ label: "Creator Role", value: content.creatorRole });
  }
  if (content.creatorBio) {
    items.push({ label: "Creator Bio", value: content.creatorBio });
  }
  if (content.creatorCredentials && content.creatorCredentials.length > 0) {
    content.creatorCredentials.forEach((cred, i) => {
      items.push({ label: `Credential ${i + 1}`, value: cred });
    });
  }

  // Audience section
  if (content.forHeading) {
    items.push({ label: "For Heading", value: content.forHeading });
  }
  if (content.notForHeading) {
    items.push({ label: "Not For Heading", value: content.notForHeading });
  }
  if (content.forItems && content.forItems.length > 0) {
    content.forItems.forEach((item, i) => {
      items.push({ label: `For Item ${i + 1}`, value: item });
    });
  }
  if (content.notForItems && content.notForItems.length > 0) {
    content.notForItems.forEach((item, i) => {
      items.push({ label: `Not For Item ${i + 1}`, value: item });
    });
  }

  // Mockup/widget content
  if (content.mockupTitle) {
    items.push({ label: "Widget Title", value: content.mockupTitle });
  }
  if (content.mockupDescription) {
    items.push({ label: "Widget Description", value: content.mockupDescription });
  }

  // Pricing toggles
  if (content.priceMonthly) {
    items.push({ label: "Price (Monthly)", value: content.priceMonthly });
  }
  if (content.priceYearly) {
    items.push({ label: "Price (Yearly)", value: content.priceYearly });
  }

  return items;
}

/**
 * Extract copy from section items (features, testimonials, pricing tiers, etc.)
 */
function extractSectionItems(section: PageSection): ItemCopy[] {
  if (!section.items || section.items.length === 0) {
    return [];
  }

  const { type } = section;

  return section.items.map((item, index) => {
    const content: CopyItem[] = [];
    const itemTitle = item.title || `Item ${index + 1}`;

    // Title
    if (item.title) {
      content.push({ label: "Title", value: item.title });
    }

    // Description/quote
    if (item.description) {
      const label = type.includes("testimonial") ? "Quote" :
                    type === "faq" ? "Answer" : "Description";
      content.push({ label, value: item.description });
    }

    // Price (for pricing tiers)
    if (item.price) {
      content.push({ label: "Price", value: item.price });
    }

    // Author info (for testimonials)
    if (item.author) {
      content.push({ label: "Author", value: item.author });
    }
    if (item.role) {
      content.push({ label: "Role", value: item.role });
    }

    // Bio (for founders)
    if (item.bio) {
      content.push({ label: "Bio", value: item.bio });
    }

    // Label (for stats, achievements)
    if (item.label) {
      content.push({ label: "Label", value: item.label });
    }

    // Features list (for pricing tiers, offers)
    if (item.features && item.features.length > 0) {
      item.features.forEach((feature, i) => {
        content.push({ label: `Feature ${i + 1}`, value: feature });
      });
    }

    // Button
    if (item.buttonText) {
      content.push({
        label: "Button",
        value: item.buttonText,
        link: item.buttonLink,
      });
    }

    return {
      title: itemTitle,
      content,
    };
  }).filter(item => item.content.length > 0);
}

/**
 * Get a friendly name for the section based on its type and content
 */
function getSectionName(section: PageSection): string {
  const formatted = formatSectionType(section.type);

  // Use heading as section name if available
  if (section.content.heading) {
    return `${formatted}: "${section.content.heading}"`;
  }

  return formatted;
}

/**
 * Extract all copy/text from a LandingPage organized by section
 */
export function extractCopy(page: LandingPage): SectionCopy[] {
  return page.sections
    .map((section) => {
      const content = extractSectionContent(section);
      const items = extractSectionItems(section);

      // Skip sections with no content
      if (content.length === 0 && items.length === 0) {
        return null;
      }

      return {
        sectionType: section.type,
        sectionName: getSectionName(section),
        content,
        items: items.length > 0 ? items : undefined,
      };
    })
    .filter((section): section is SectionCopy => section !== null);
}
