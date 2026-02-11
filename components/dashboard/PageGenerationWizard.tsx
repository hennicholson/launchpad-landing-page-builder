"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Color theme literal union
export type ColorTheme = "dark" | "light" | "midnight" | "forest" | "ocean" | "sunset" | "custom";

// Wizard data type
export interface WizardData {
  // Step 1: Business Info
  businessName: string;
  productDescription: string;
  targetAudience: string;

  // Step 2: Style & Theme
  colorTheme: ColorTheme;
  vibe: "modern" | "minimal" | "bold" | "professional" | "playful" | "elegant" | "techy";

  // Step 3: Typography
  fontPair: "anton-inter" | "playfair-inter" | "space-grotesk-inter" | "poppins-inter" | "inter-inter";

  // Step 4: Page Structure
  pageType: "landing" | "sales-funnel" | "product" | "lead-magnet" | "auto";
}

const VIBES = [
  { id: "modern", label: "Modern", desc: "Clean lines, bold typography" },
  { id: "minimal", label: "Minimal", desc: "Less is more, lots of whitespace" },
  { id: "bold", label: "Bold", desc: "Strong colors, impactful design" },
  { id: "professional", label: "Professional", desc: "Corporate, trustworthy" },
  { id: "playful", label: "Playful", desc: "Fun, colorful, friendly" },
  { id: "elegant", label: "Elegant", desc: "Sophisticated, premium feel" },
  { id: "techy", label: "Techy", desc: "Developer-focused, code vibes" },
] as const;

const FONT_PAIRS = [
  { id: "anton-inter", heading: "Anton", body: "Inter", desc: "Bold & Modern" },
  { id: "playfair-inter", heading: "Playfair Display", body: "Inter", desc: "Elegant & Classic" },
  { id: "space-grotesk-inter", heading: "Space Grotesk", body: "Inter", desc: "Tech & Clean" },
  { id: "poppins-inter", heading: "Poppins", body: "Inter", desc: "Friendly & Rounded" },
  { id: "inter-inter", heading: "Inter", body: "Inter", desc: "Clean & Versatile" },
] as const;

const PAGE_TYPES = [
  { id: "landing", label: "Landing Page", desc: "Hero → Features → Testimonials → Pricing → CTA", icon: "🏠" },
  { id: "sales-funnel", label: "Sales Funnel", desc: "Hero → Value Prop → Offer → Testimonials → CTA", icon: "🎯" },
  { id: "product", label: "Product Page", desc: "Hero → Features → Gallery → Pricing → FAQ", icon: "📦" },
  { id: "lead-magnet", label: "Lead Magnet", desc: "Hero → Benefits → Form → Testimonials", icon: "📧" },
  { id: "auto", label: "Let AI Decide", desc: "Based on your description", icon: "✨" },
] as const;

const THEMES = [
  { id: "dark", name: "Dark", primary: "#D6FC51", background: "#000000" },
  { id: "light", name: "Light", primary: "#000000", background: "#FFFFFF" },
  { id: "midnight", name: "Midnight", primary: "#e94560", background: "#1a1a2e" },
  { id: "forest", name: "Forest", primary: "#4ade80", background: "#0f1f0f" },
  { id: "ocean", name: "Ocean", primary: "#38bdf8", background: "#0c1929" },
  { id: "sunset", name: "Sunset", primary: "#f97316", background: "#1c1413" },
] as const;

type Props = {
  onComplete: (data: WizardData) => void;
  onBack: () => void;
};

export default function PageGenerationWizard({ onComplete, onBack }: Props) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    businessName: "",
    productDescription: "",
    targetAudience: "",
    colorTheme: "dark",
    vibe: "modern",
    fontPair: "anton-inter",
    pageType: "auto",
  });

  const updateData = <K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const canContinue = () => {
    if (step === 1) {
      return data.businessName.trim().length > 0 && data.productDescription.trim().length > 10;
    }
    return true;
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                s === step
                  ? "bg-[#FA4616] text-white"
                  : s < step
                  ? "bg-[#FA4616]/20 text-[#FA4616]"
                  : "bg-white/10 text-white/40"
              }`}
            >
              {s < step ? "✓" : s}
            </div>
            {s < 4 && (
              <div
                className={`w-8 h-0.5 mx-1 ${
                  s < step ? "bg-[#FA4616]/40" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Step 1: Business Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">Tell us about your business</h3>
                <p className="text-sm text-white/50">This helps AI write compelling copy</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Business / Product Name
                </label>
                <input
                  type="text"
                  value={data.businessName}
                  onChange={(e) => updateData("businessName", e.target.value)}
                  placeholder="e.g., Acme SaaS, FitCoach Pro"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FA4616] focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  What do you sell?
                </label>
                <textarea
                  value={data.productDescription}
                  onChange={(e) => updateData("productDescription", e.target.value)}
                  placeholder="Describe your product or service in 2-3 sentences..."
                  className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FA4616] focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Who is it for? <span className="text-white/40">(optional)</span>
                </label>
                <input
                  type="text"
                  value={data.targetAudience}
                  onChange={(e) => updateData("targetAudience", e.target.value)}
                  placeholder="e.g., Freelancers, small business owners, developers"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FA4616] focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 2: Style & Theme */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-1">Choose your style</h3>
                <p className="text-sm text-white/50">Select a color theme and vibe</p>
              </div>

              {/* Color Themes */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-3">Color Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => updateData("colorTheme", theme.id as WizardData["colorTheme"])}
                      className={`group p-3 rounded-xl border transition-all ${
                        data.colorTheme === theme.id
                          ? "border-[#FA4616] bg-[#FA4616]/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: theme.background }}
                        >
                          <div
                            className="w-2 h-2 rounded-full ml-1 mt-1"
                            style={{ backgroundColor: theme.primary }}
                          />
                        </div>
                        <span className="text-sm font-medium text-white">{theme.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Vibe */}
              <div>
                <label className="block text-sm font-medium text-white/60 mb-3">Vibe / Tone</label>
                <div className="flex flex-wrap gap-2">
                  {VIBES.map((vibe) => (
                    <button
                      key={vibe.id}
                      onClick={() => updateData("vibe", vibe.id as WizardData["vibe"])}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        data.vibe === vibe.id
                          ? "bg-[#FA4616] text-white"
                          : "bg-white/5 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {vibe.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Typography */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-1">Pick a font pairing</h3>
                <p className="text-sm text-white/50">This sets the tone for your page</p>
              </div>

              <div className="space-y-2">
                {FONT_PAIRS.map((pair) => (
                  <button
                    key={pair.id}
                    onClick={() => updateData("fontPair", pair.id as WizardData["fontPair"])}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      data.fontPair === pair.id
                        ? "border-[#FA4616] bg-[#FA4616]/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          className="text-xl font-bold text-white mb-0.5"
                          style={{ fontFamily: pair.heading === "Anton" ? "'Anton', sans-serif" :
                                              pair.heading === "Playfair Display" ? "'Playfair Display', serif" :
                                              pair.heading === "Space Grotesk" ? "'Space Grotesk', sans-serif" :
                                              pair.heading === "Poppins" ? "'Poppins', sans-serif" : "'Inter', sans-serif" }}
                        >
                          {pair.heading}
                        </div>
                        <div className="text-sm text-white/50">{pair.desc}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          data.fontPair === pair.id
                            ? "border-[#FA4616] bg-[#FA4616]"
                            : "border-white/20"
                        }`}
                      >
                        {data.fontPair === pair.id && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Page Structure */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-1">Choose page type</h3>
                <p className="text-sm text-white/50">This determines the section flow</p>
              </div>

              <div className="space-y-2">
                {PAGE_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => updateData("pageType", type.id as WizardData["pageType"])}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      data.pageType === type.id
                        ? "border-[#FA4616] bg-[#FA4616]/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-white">{type.label}</div>
                        <div className="text-xs text-white/40">{type.desc}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          data.pageType === type.id
                            ? "border-[#FA4616] bg-[#FA4616]"
                            : "border-white/20"
                        }`}
                      >
                        {data.pageType === type.id && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          onClick={handleBack}
          className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canContinue()}
          className="px-5 py-2.5 bg-[#FA4616] text-white text-sm font-semibold rounded-lg hover:bg-[#FA4616]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {step === 4 ? (
            <>
              Generate Page
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
}
