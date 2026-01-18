import { skinnyTemplate } from "./skinny-template";
import { saasTemplate } from "./saas-template";
import { agencyTemplate } from "./agency-template";
import { courseTemplate } from "./course-template";
import { ecommerceTemplate } from "./ecommerce-template";
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
];

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplateByIdOrDefault(id: string): LandingPage {
  const template = getTemplateById(id);
  return template ? template.template : skinnyTemplate;
}
