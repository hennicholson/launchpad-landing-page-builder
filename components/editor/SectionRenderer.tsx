"use client";

import type { PageSection } from "@/lib/page-schema";
import HeroSection from "./sections/HeroSection";
import FeaturesSection from "./sections/FeaturesSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import PricingSection from "./sections/PricingSection";
import CTASection from "./sections/CTASection";
import FAQSection from "./sections/FAQSection";
import HeaderSection from "./sections/HeaderSection";
import FoundersSection from "./sections/FoundersSection";
import CredibilitySection from "./sections/CredibilitySection";
import OfferSection from "./sections/OfferSection";
import AudienceSection from "./sections/AudienceSection";
import FooterSection from "./sections/FooterSection";
import VideoSection from "./sections/VideoSection";
import GallerySection from "./sections/GallerySection";
import StatsSection from "./sections/StatsSection";
import LogoCloudSection from "./sections/LogoCloudSection";
import ComparisonSection from "./sections/ComparisonSection";
import ProcessSection from "./sections/ProcessSection";

type Props = {
  section: PageSection;
};

export default function SectionRenderer({ section }: Props) {
  switch (section.type) {
    case "hero":
      return <HeroSection section={section} />;
    case "features":
      return <FeaturesSection section={section} />;
    case "testimonials":
      return <TestimonialsSection section={section} />;
    case "pricing":
      return <PricingSection section={section} />;
    case "cta":
      return <CTASection section={section} />;
    case "faq":
      return <FAQSection section={section} />;
    case "header":
      return <HeaderSection section={section} />;
    case "founders":
      return <FoundersSection section={section} />;
    case "credibility":
      return <CredibilitySection section={section} />;
    case "offer":
      return <OfferSection section={section} />;
    case "audience":
      return <AudienceSection section={section} />;
    case "footer":
      return <FooterSection section={section} />;
    case "video":
      return <VideoSection section={section} />;
    case "gallery":
      return <GallerySection section={section} />;
    case "stats":
      return <StatsSection section={section} />;
    case "logoCloud":
      return <LogoCloudSection section={section} />;
    case "comparison":
      return <ComparisonSection section={section} />;
    case "process":
      return <ProcessSection section={section} />;
    default:
      return (
        <div className="py-16 px-8 text-center opacity-50">
          Unknown section type: {section.type}
        </div>
      );
  }
}
