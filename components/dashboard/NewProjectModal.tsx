"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { templates, type Template } from "@/lib/templates";
import { createProject } from "@/lib/actions/projects";
import PageGenerationWizard, { type WizardData } from "./PageGenerationWizard";

type Step = "choose" | "template" | "ai" | "details";

// AI Generation progress phases
type GenerationPhase = "understanding" | "planning" | "generating" | "validating" | "complete";

const GENERATION_PHASES: { id: GenerationPhase; label: string; description: string; duration: number }[] = [
  { id: "understanding", label: "Understanding", description: "Analyzing your requirements...", duration: 5000 },
  { id: "planning", label: "Planning", description: "Creating page blueprint...", duration: 5000 },
  { id: "generating", label: "Generating", description: "Crafting sections...", duration: 25000 },
  { id: "validating", label: "Validating", description: "Quality check...", duration: 5000 },
  { id: "complete", label: "Complete", description: "Your page is ready!", duration: 0 },
];

function GenerationProgress({ isGenerating }: { isGenerating: boolean }) {
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isGenerating) {
      setCurrentPhaseIndex(0);
      setProgress(0);
      return;
    }

    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      let totalTime = 0;
      let newPhaseIndex = 0;

      for (let i = 0; i < GENERATION_PHASES.length - 1; i++) {
        totalTime += GENERATION_PHASES[i].duration;
        if (elapsed >= totalTime) {
          newPhaseIndex = i + 1;
        } else {
          break;
        }
      }

      // Cap at validating phase (index 3) until actually complete
      newPhaseIndex = Math.min(newPhaseIndex, 3);
      setCurrentPhaseIndex(newPhaseIndex);

      // Calculate progress within current phase
      const phaseStartTime = GENERATION_PHASES.slice(0, newPhaseIndex).reduce((sum, p) => sum + p.duration, 0);
      const phaseElapsed = elapsed - phaseStartTime;
      const phaseDuration = GENERATION_PHASES[newPhaseIndex].duration;
      const phaseProgress = Math.min((phaseElapsed / phaseDuration) * 100, 99);
      setProgress(phaseProgress);
    }, 100);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const currentPhase = GENERATION_PHASES[currentPhaseIndex];

  return (
    <div className="space-y-6">
      {/* Phase indicator */}
      <div className="flex items-center justify-between gap-2">
        {GENERATION_PHASES.slice(0, -1).map((phase, index) => (
          <div key={phase.id} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
              index < currentPhaseIndex
                ? "bg-[#FA4616] border-[#FA4616] text-black"
                : index === currentPhaseIndex
                ? "border-[#FA4616] text-[#FA4616]"
                : "border-white/20 text-white/40"
            }`}>
              {index < currentPhaseIndex ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : index === currentPhaseIndex ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
            {index < GENERATION_PHASES.length - 2 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                index < currentPhaseIndex ? "bg-[#FA4616]" : "bg-white/10"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Phase labels */}
      <div className="flex justify-between text-xs">
        {GENERATION_PHASES.slice(0, -1).map((phase, index) => (
          <span key={phase.id} className={`${
            index <= currentPhaseIndex ? "text-white" : "text-white/40"
          }`}>
            {phase.label}
          </span>
        ))}
      </div>

      {/* Current phase info */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FA4616]/10 border border-[#FA4616]/20 rounded-full">
          <svg className="w-4 h-4 text-[#FA4616] animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          <span className="text-sm font-medium text-white">{currentPhase.description}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FA4616] to-orange-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentPhaseIndex / (GENERATION_PHASES.length - 1)) * 100 + (progress / (GENERATION_PHASES.length - 1))}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Tips */}
      <div className="text-center text-xs text-white/40">
        <p>AI is crafting your page with industry-proven copywriting frameworks</p>
        <p className="mt-1">This usually takes 30-45 seconds</p>
      </div>
    </div>
  );
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialStep?: Step;
};

export default function NewProjectModal({ isOpen, onClose, onSuccess, initialStep = "choose" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>(initialStep);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [wizardData, setWizardData] = useState<WizardData | null>(null);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const resetState = () => {
    setStep(initialStep);
    setSelectedTemplate(null);
    setAiPrompt("");
    setWizardData(null);
    setProjectName("");
    setError(null);
    setIsGenerating(false);
  };

  // Reset step when modal opens with different initialStep
  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      // For "details" step (Start from Scratch), pre-select blank template
      if (initialStep === "details") {
        setSelectedTemplate(templates.find((t) => t.id === "blank") || null);
      } else {
        setSelectedTemplate(null);
      }
      setAiPrompt("");
      setWizardData(null);
      setProjectName("");
      setError(null);
      setIsGenerating(false);
    }
  }, [isOpen, initialStep]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setStep("details");
  };

  const handleAISubmit = () => {
    if (aiPrompt.trim().length < 10) {
      setError("Please provide a more detailed description");
      return;
    }
    setStep("details");
  };

  const handleWizardComplete = (data: WizardData) => {
    setWizardData(data);
    // Auto-generate the project name from business name
    setProjectName(data.businessName || "My Landing Page");
    setStep("details");
  };

  const handleCreate = () => {
    if (!projectName.trim()) {
      setError("Please enter a project name");
      return;
    }

    setError(null);
    setIsGenerating(wizardData !== null);

    startTransition(async () => {
      try {
        let generatedPageData = null;

        // If using AI generation, use background function with polling
        if (wizardData) {
          const aiPromptText = buildAIPromptFromWizard(wizardData);

          // Step 1: Trigger background generation
          const triggerResponse = await fetch("/api/ai/page", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "generate",
              description: aiPromptText,
              wizardData,
            }),
          });

          if (!triggerResponse.ok) {
            const errorData = await triggerResponse.json().catch(() => ({}));
            throw new Error(errorData.error || `AI generation failed: ${triggerResponse.status}`);
          }

          const triggerResult = await triggerResponse.json();
          if (!triggerResult.success || !triggerResult.generationId) {
            throw new Error(triggerResult.error || "Failed to start generation");
          }

          const generationId = triggerResult.generationId;
          console.log("[AI Generation] Started with ID:", generationId);

          // Step 2: Poll for completion (max 3 minutes)
          const maxPollTime = 180000; // 3 minutes
          const pollInterval = 2000; // 2 seconds
          const startTime = Date.now();

          while (Date.now() - startTime < maxPollTime) {
            await new Promise(resolve => setTimeout(resolve, pollInterval));

            const statusResponse = await fetch(`/api/ai/page?id=${generationId}`);
            if (!statusResponse.ok) {
              console.warn("[AI Generation] Poll failed, retrying...");
              continue;
            }

            const statusResult = await statusResponse.json();
            console.log("[AI Generation] Status:", statusResult.status);

            if (statusResult.status === "complete") {
              generatedPageData = statusResult.result;
              break;
            } else if (statusResult.status === "failed") {
              throw new Error(statusResult.error || "AI generation failed");
            }
            // Keep polling if status is "pending" or "generating"
          }

          if (!generatedPageData) {
            throw new Error("Generation timed out. Please try again.");
          }
        }

        // Create project with pre-generated page data
        const result = await createProject({
          name: projectName.trim(),
          templateId: selectedTemplate?.id || (wizardData ? undefined : "skinny"),
          pageData: generatedPageData || undefined,
        });

        if (!result.success) {
          setError(result.error || "Failed to create project");
          setIsGenerating(false);
          return;
        }

        // Navigate to editor
        router.push(`/editor/${result.projectId}`);
        handleClose();
        onSuccess?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsGenerating(false);
      }
    });
  };

  // Build a comprehensive AI prompt from wizard data
  const buildAIPromptFromWizard = (data: WizardData): string => {
    return `Generate a ${data.pageType === 'auto' ? 'landing' : data.pageType} page for:

Business: ${data.businessName}
Product/Service: ${data.productDescription}
${data.targetAudience ? `Target Audience: ${data.targetAudience}` : ''}

Style Requirements:
- Vibe: ${data.vibe}
- Color Theme: ${data.colorTheme}
- Typography: ${data.fontPair.replace('-', ' + ')}

Write compelling, conversion-focused copy that speaks directly to the target audience.`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 pt-8 sm:pt-4 overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl max-h-[90vh] bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (step === "details") {
                    if (wizardData) {
                      setWizardData(null);
                      setStep("ai");
                    } else {
                      setStep(selectedTemplate ? "template" : aiPrompt ? "ai" : "choose");
                    }
                  } else if (step === "template" || step === "ai") {
                    setStep("choose");
                  } else {
                    handleClose();
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold text-white">
                {step === "choose" && "Create New Project"}
                {step === "template" && "Choose a Template"}
                {step === "ai" && "Generate with AI"}
                {step === "details" && "Project Details"}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto min-h-0">
            {/* Step: Choose starting point */}
            {step === "choose" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setSelectedTemplate(templates.find((t) => t.id === "blank") || null);
                    setStep("details");
                  }}
                  className="group p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#FA4616]/50 hover:bg-white/[0.05] transition-all text-left"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#FA4616]/10 transition-colors">
                    <svg className="w-6 h-6 text-white/60 group-hover:text-[#FA4616] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-1">Start from Scratch</h3>
                  <p className="text-white/50 text-sm">Build your page from a blank canvas</p>
                </button>

                <button
                  onClick={() => setStep("template")}
                  className="group p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#FA4616]/50 hover:bg-white/[0.05] transition-all text-left"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#FA4616]/10 transition-colors">
                    <svg className="w-6 h-6 text-white/60 group-hover:text-[#FA4616] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 3h15a1.5 1.5 0 011.5 1.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15A1.5 1.5 0 014.5 3zm0 0v15" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18m6-18v18M3 9h18M3 15h18" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-1">Use a Template</h3>
                  <p className="text-white/50 text-sm">Start with a professionally designed template</p>
                </button>

                <button
                  onClick={() => setStep("ai")}
                  className="group p-4 sm:p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#FA4616]/50 hover:bg-white/[0.05] transition-all text-left"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[#FA4616]/10 transition-colors">
                    <svg className="w-6 h-6 text-white/60 group-hover:text-[#FA4616] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-1">Generate with AI</h3>
                  <p className="text-white/50 text-sm">Describe your page and let AI create it</p>
                </button>
              </div>
            )}

            {/* Step: Template Selection */}
            {step === "template" && (
              <div className="space-y-6">
                {/* Recommended Template Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-[#FA4616]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Recommended Template</h3>
                  </div>
                  <div className="grid grid-cols-1">
                    {templates
                      .filter((t) => t.id === "sales-funnel")
                      .map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template)}
                          className={`group p-3 sm:p-4 rounded-xl border text-left transition-all ${
                            selectedTemplate?.id === template.id
                              ? "border-[#FA4616] bg-[#FA4616]/5"
                              : "border-white/10 bg-white/[0.02] hover:border-[#FA4616]/50 hover:bg-white/[0.05]"
                          }`}
                        >
                          {/* Template Preview with hover video */}
                          <div className="aspect-[4/3] sm:aspect-[21/9] rounded-lg bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] mb-3 sm:mb-4 overflow-hidden relative group/preview">
                            {/* WHOP U CHALLENGE Badge */}
                            <div className="absolute top-3 right-3 z-10 px-2 py-1 bg-[#FA4616] text-white text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wide">
                              Compatible with Whop U Challenge
                            </div>
                            {template.preview ? (
                              <>
                                {/* Static image - hides on hover */}
                                <img
                                  src={template.preview}
                                  alt={`${template.name} preview`}
                                  className="w-full h-full object-cover group-hover/preview:opacity-0 transition-opacity duration-300"
                                />
                                {/* Video on hover */}
                                <video
                                  src="/templates/sales-funnel-preview.mp4"
                                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300"
                                  muted
                                  loop
                                  playsInline
                                  onMouseEnter={(e) => e.currentTarget.play()}
                                  onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                />
                              </>
                            ) : (
                              <>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="font-anton text-xl text-white/80 uppercase">
                                      {template.name}
                                    </div>
                                    <div className="text-xs text-[#FA4616]/60 mt-1">
                                      {template.tags.join(" • ")}
                                    </div>
                                  </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute top-3 left-3 w-16 h-1 rounded-full bg-[#FA4616]/20" />
                                <div className="absolute top-6 left-3 w-10 h-1 rounded-full bg-white/10" />
                                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-[#FA4616]/30" />
                              </>
                            )}
                          </div>
                          <h3 className="text-white font-semibold mb-1">{template.name}</h3>
                          <p className="text-white/50 text-sm">{template.description}</p>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Other Templates Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide">Other Templates</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {templates
                      .filter((t) => t.id !== "blank" && t.id !== "sales-funnel" && t.id !== "skinny")
                      .map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template)}
                          className={`group p-3 sm:p-4 rounded-xl border text-left transition-all ${
                            selectedTemplate?.id === template.id
                              ? "border-[#FA4616] bg-[#FA4616]/5"
                              : "border-white/10 bg-white/[0.02] hover:border-[#FA4616]/50 hover:bg-white/[0.05]"
                          }`}
                        >
                          {/* Template Preview */}
                          <div className="aspect-[4/3] sm:aspect-video rounded-lg bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] mb-3 sm:mb-4 overflow-hidden relative">
                            {template.preview ? (
                              <img
                                src={template.preview}
                                alt={`${template.name} preview`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="font-anton text-xl text-white/80 uppercase">
                                      {template.name}
                                    </div>
                                    <div className="text-xs text-[#FA4616]/60 mt-1">
                                      {template.tags.join(" • ")}
                                    </div>
                                  </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute top-3 left-3 w-16 h-1 rounded-full bg-[#FA4616]/20" />
                                <div className="absolute top-6 left-3 w-10 h-1 rounded-full bg-white/10" />
                                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-[#FA4616]/30" />
                              </>
                            )}
                          </div>
                          <h3 className="text-white font-semibold mb-1">{template.name}</h3>
                          <p className="text-white/50 text-sm">{template.description}</p>
                        </button>
                      ))}
                    {/* Skinny Studio at the end */}
                    {templates
                      .filter((t) => t.id === "skinny")
                      .map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template)}
                          className={`group p-3 sm:p-4 rounded-xl border text-left transition-all ${
                            selectedTemplate?.id === template.id
                              ? "border-[#FA4616] bg-[#FA4616]/5"
                              : "border-white/10 bg-white/[0.02] hover:border-[#FA4616]/50 hover:bg-white/[0.05]"
                          }`}
                        >
                          {/* Template Preview */}
                          <div className="aspect-[4/3] sm:aspect-video rounded-lg bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] mb-3 sm:mb-4 overflow-hidden relative">
                            {template.preview ? (
                              <img
                                src={template.preview}
                                alt={`${template.name} preview`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="font-anton text-xl text-white/80 uppercase">
                                      {template.name}
                                    </div>
                                    <div className="text-xs text-[#FA4616]/60 mt-1">
                                      {template.tags.join(" • ")}
                                    </div>
                                  </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute top-3 left-3 w-16 h-1 rounded-full bg-[#FA4616]/20" />
                                <div className="absolute top-6 left-3 w-10 h-1 rounded-full bg-white/10" />
                                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-[#FA4616]/30" />
                              </>
                            )}
                          </div>
                          <h3 className="text-white font-semibold mb-1">{template.name}</h3>
                          <p className="text-white/50 text-sm">{template.description}</p>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step: AI Generation Wizard */}
            {step === "ai" && (
              <PageGenerationWizard
                onComplete={handleWizardComplete}
                onBack={() => setStep("choose")}
              />
            )}

            {/* Step: Project Details */}
            {step === "details" && (
              <div className="space-y-6">
                {/* Show generation progress when generating */}
                {isGenerating ? (
                  <div className="py-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-white mb-2">Creating Your Page</h3>
                      <p className="text-white/60">Our AI orchestrator is building a high-converting landing page</p>
                    </div>
                    <GenerationProgress isGenerating={isGenerating} />
                  </div>
                ) : (
                  <>
                    {/* Summary */}
                    {wizardData ? (
                      <div className="p-4 rounded-xl bg-gradient-to-br from-[#FA4616]/10 to-orange-500/5 border border-[#FA4616]/20">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-5 h-5 text-[#FA4616]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                          </svg>
                          <p className="text-sm font-medium text-white">AI will generate your page with:</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-white/40">Theme:</span>{" "}
                            <span className="text-white capitalize">{wizardData.colorTheme}</span>
                          </div>
                          <div>
                            <span className="text-white/40">Vibe:</span>{" "}
                            <span className="text-white capitalize">{wizardData.vibe}</span>
                          </div>
                          <div>
                            <span className="text-white/40">Type:</span>{" "}
                            <span className="text-white capitalize">{wizardData.pageType.replace("-", " ")}</span>
                          </div>
                          <div>
                            <span className="text-white/40">Font:</span>{" "}
                            <span className="text-white">{wizardData.fontPair.split("-")[0]}</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#FA4616]/20">
                          <p className="text-xs text-[#FA4616]/80">
                            Using {wizardData.pageType === "sales-funnel" ? "PAS" : wizardData.pageType === "lead-magnet" ? "BAB" : "AIDA"} copywriting framework for maximum conversion
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-sm text-white/60 mb-1">Creating project with:</p>
                        <p className="text-white font-medium">
                          {selectedTemplate
                            ? `${selectedTemplate.name} Template`
                            : aiPrompt
                            ? "AI-Generated Design"
                            : "Blank Canvas"}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="My Landing Page"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#FA4616] focus:border-transparent"
                        autoFocus
                      />
                    </div>

                    {error && (
                      <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {step === "details" && !isGenerating && (
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/10 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!projectName.trim() || isPending}
                className="px-5 py-2.5 bg-[#FA4616] text-black text-sm font-semibold rounded-lg hover:bg-[#FA4616]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : wizardData ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    Generate with AI
                  </>
                ) : (
                  "Create Project"
                )}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
