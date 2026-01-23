import { skinnyTemplate } from "./skinny-template";
import { saasTemplate } from "./saas-template";
import { agencyTemplate } from "./agency-template";
import { courseTemplate } from "./course-template";
import { ecommerceTemplate } from "./ecommerce-template";
import { darkConversionTemplate } from "./dark-conversion-template";
import { saasProductTemplate } from "./saas-product-template";
import { webinarTemplate } from "./webinar-template";
import { leadMagnetTemplate } from "./leadmagnet-template";
import { whopUniversityTemplate } from "./whop-university-template";
import { salesFunnelTemplate } from "./sales-funnel-template";
import type { LandingPage } from "../page-schema";
import { defaultPage } from "../page-schema";

export type Template = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  preview?: string;
  template: LandingPage;
  tags: string[];
};

// Blank template for starting from scratch
const blankTemplate: LandingPage = {
  ...defaultPage,
  title: "New Landing Page",
  description: "A new landing page",
};

export const templates: Template[] = [
  {
    id: "blank",
    name: "Start from Scratch",
    description: "A blank canvas to build your page from the ground up",
    thumbnail: "/templates/blank-thumb.svg",
    template: blankTemplate,
    tags: ["minimal", "custom"],
  },
  {
    id: "skinny",
    name: "Skinny Studio",
    description: "Bold dark theme with lime accents. Perfect for creators, agencies, and tech products.",
    thumbnail: "/templates/skinny-thumb.png",
    template: skinnyTemplate,
    tags: ["dark", "bold", "modern", "creators"],
  },
  {
    id: "saas",
    name: "SaaS Funnel",
    description: "High-converting SaaS template with trust-building blue and action-driving orange. AIDA copywriting formula.",
    thumbnail: "/templates/saas-thumb.png",
    preview: "/templates/saas.gif",
    template: saasTemplate,
    tags: ["saas", "software", "startup", "funnel", "light"],
  },
  {
    id: "agency",
    name: "Agency Funnel",
    description: "Premium black and gold theme for service businesses. PAS copywriting formula for maximum conversions.",
    thumbnail: "/templates/agency-thumb.png",
    preview: "/templates/agency.gif",
    template: agencyTemplate,
    tags: ["agency", "services", "consulting", "premium", "dark", "funnel"],
  },
  {
    id: "course",
    name: "Course Funnel",
    description: "Growth-focused green and navy theme for online courses. Before-After-Bridge formula that sells.",
    thumbnail: "/templates/course-thumb.png",
    preview: "/templates/course.gif",
    template: courseTemplate,
    tags: ["course", "education", "coaching", "funnel", "light"],
  },
  {
    id: "ecommerce",
    name: "E-Commerce Funnel",
    description: "Bold red and gold theme that drives urgency and action. Direct benefit copy for physical products.",
    thumbnail: "/templates/ecommerce-thumb.png",
    preview: "/templates/ecom.gif",
    template: ecommerceTemplate,
    tags: ["ecommerce", "product", "shop", "retail", "funnel", "light"],
  },
  {
    id: "dark-conversion",
    name: "Dark Conversion Pro",
    description: "High-converting sales page with advanced components and dark styling. Showcases all features variants, stats, animations, and CTAs.",
    thumbnail: "/templates/dark-conversion.png",
    preview: "/templates/dark-conversion.gif",
    template: darkConversionTemplate,
    tags: ["sales", "dark", "advanced", "conversion", "saas"],
  },
  {
    id: "saas-product",
    name: "SaaS Product",
    description: "Free trial + feature-focused conversion funnel. Perfect for B2B software products with comprehensive feature showcases.",
    thumbnail: "/templates/saas-product-thumb.png",
    template: saasProductTemplate,
    tags: ["saas", "b2b", "software", "trial", "funnel"],
  },
  {
    id: "webinar",
    name: "Webinar Registration",
    description: "Countdown + speaker credibility + registration form. Optimized for event signups and live training sessions.",
    thumbnail: "/templates/webinar-thumb.png",
    template: webinarTemplate,
    tags: ["webinar", "event", "leadgen", "education", "funnel"],
  },
  {
    id: "leadmagnet",
    name: "Lead Magnet / Ebook",
    description: "Value-first email capture with ebook preview. Perfect for building your email list with high-value content offers.",
    thumbnail: "/templates/leadmagnet-thumb.png",
    template: leadMagnetTemplate,
    tags: ["leadgen", "ebook", "download", "email", "funnel"],
  },
  {
    id: "whop-university",
    name: "Whop University",
    description: "High-converting course funnel with dark theme, multiple CTAs, comparison section, and social proof. Perfect for course creators and educators.",
    thumbnail: "/templates/whop-university-thumb.png",
    template: whopUniversityTemplate,
    tags: ["course", "education", "dark", "conversion", "funnel", "whop"],
  },
  {
    id: "sales-funnel",
    name: "Sales Funnel",
    description: "High-converting sales funnel with proven 12-section structure. Perfect for digital products, courses, and services. Text-focused for maximum conversion.",
    thumbnail: "/templates/sales-funnel-thumb.png",
    template: salesFunnelTemplate,
    tags: ["sales", "funnel", "conversion", "lead-gen", "copy-heavy", "light"],
  },
];

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplateByIdOrDefault(id: string): LandingPage {
  const template = getTemplateById(id);
  return template ? template.template : skinnyTemplate;
}
