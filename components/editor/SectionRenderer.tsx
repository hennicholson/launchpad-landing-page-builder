"use client";

import type { PageSection, ColorScheme, Typography } from "@/lib/page-schema";
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
import BlankSection from "./sections/BlankSection";
import LoaderSection from "./sections/LoaderSection";
import CustomersTableSection from "./sections/CustomersTableSection";
// Sales Funnel sections
import ValuePropositionSection from "./sections/ValuePropositionSection";
import OfferDetailsSection from "./sections/OfferDetailsSection";
import CreatorSection from "./sections/CreatorSection";
import DetailedFeaturesSection from "./sections/DetailedFeaturesSection";
import FeaturesIllustratedSection from "./sections/FeaturesIllustratedSection";
import FeaturesHoverSection from "./sections/FeaturesHoverSection";
import FeaturesBentoSection from "./sections/FeaturesBentoSection";
// Whop University editor wrapper sections
import WhopHeroSection from "./sections/WhopHeroSection";
import WhopValuePropSection from "./sections/WhopValuePropSection";
import WhopOfferSection from "./sections/WhopOfferSection";
import WhopCTASection from "./sections/WhopCTASection";
import WhopComparisonSection from "./sections/WhopComparisonSection";
import WhopCreatorSection from "./sections/WhopCreatorSection";
import WhopCurriculumSection from "./sections/WhopCurriculumSection";
import WhopResultsSection from "./sections/WhopResultsSection";
import WhopTestimonialsSection from "./sections/WhopTestimonialsSection";
import WhopFinalCTASection from "./sections/WhopFinalCTASection";
// Glass 3D sections
import GlassCTASection from "./sections/GlassCTASection";
import GlassFeaturesSection from "./sections/GlassFeaturesSection";
import GlassFoundersSection from "./sections/GlassFoundersSection";
import GlassTestimonialsSection from "./sections/GlassTestimonialsSection";
import GlassPricingSection from "./sections/GlassPricingSection";

type Props = {
  section: PageSection;
  colorScheme?: ColorScheme;
  typography?: Typography;
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
    case "loader":
      return <LoaderSection section={section} />;
    case "blank":
      return <BlankSection section={section} />;
    // Sales Funnel sections (with editor wrappers for inline editing)
    case "value-proposition":
      return <ValuePropositionSection section={section} />;
    case "offer-details":
      return <OfferDetailsSection section={section} />;
    case "creator":
      return <CreatorSection section={section} />;
    case "detailed-features":
      return <DetailedFeaturesSection section={section} />;
    // Whop University premium sections (with editor wrappers for inline editing)
    case "whop-hero":
      return <WhopHeroSection section={section} />;
    case "whop-value-prop":
      return <WhopValuePropSection section={section} />;
    case "whop-offer":
      return <WhopOfferSection section={section} />;
    case "whop-cta":
      return <WhopCTASection section={section} />;
    case "whop-comparison":
      return <WhopComparisonSection section={section} />;
    case "whop-creator":
      return <WhopCreatorSection section={section} />;
    case "whop-curriculum":
      return <WhopCurriculumSection section={section} />;
    case "whop-results":
      return <WhopResultsSection section={section} />;
    case "whop-testimonials":
      return <WhopTestimonialsSection section={section} />;
    case "whop-final-cta":
      return <WhopFinalCTASection section={section} />;
    // Glass 3D sections (with editor wrappers for inline editing)
    case "glass-cta":
      return <GlassCTASection section={section} />;
    case "glass-features":
      return <GlassFeaturesSection section={section} />;
    case "glass-founders":
      return <GlassFoundersSection section={section} />;
    case "glass-testimonials":
      return <GlassTestimonialsSection section={section} />;
    case "glass-pricing":
      return <GlassPricingSection section={section} />;
    default:
      return (
        <div className="py-16 px-8 text-center opacity-50">
          Unknown section type: {section.type}
        </div>
      );
  }
}
