"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { templates, type Template } from "@/lib/templates";
import { createProject } from "@/lib/actions/projects";

type Step = "choose" | "template" | "ai" | "details";

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
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setStep(initialStep);
    setSelectedTemplate(null);
    setAiPrompt("");
    setProjectName("");
    setError(null);
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
      setProjectName("");
      setError(null);
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

  const handleCreate = () => {
    if (!projectName.trim()) {
      setError("Please enter a project name");
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const result = await createProject({
          name: projectName.trim(),
          templateId: selectedTemplate?.id || (aiPrompt ? undefined : "skinny"),
          aiPrompt: aiPrompt || undefined,
        });

        if (!result.success) {
          setError(result.error || "Failed to create project");
          return;
        }

        // Navigate to editor
        router.push(`/editor/${result.projectId}`);
        handleClose();
        onSuccess?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (step === "details") {
                    setStep(selectedTemplate ? "template" : aiPrompt ? "ai" : "choose");
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
          <div className="p-6">
            {/* Step: Choose starting point */}
            {step === "choose" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setSelectedTemplate(templates.find((t) => t.id === "blank") || null);
                    setStep("details");
                  }}
                  className="group p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#D6FC51]/50 hover:bg-white/[0.05] transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#D6FC51]/10 transition-colors">
                    <svg className="w-6 h-6 text-white/60 group-hover:text-[#D6FC51] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-1">Start from Scratch</h3>
                  <p className="text-white/50 text-sm">Build your page from a blank canvas</p>
                </button>

                <button
                  onClick={() => setStep("template")}
                  className="group p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#D6FC51]/50 hover:bg-white/[0.05] transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#D6FC51]/10 transition-colors">
                    <svg className="w-6 h-6 text-white/60 group-hover:text-[#D6FC51] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 3h15a1.5 1.5 0 011.5 1.5v15a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 19.5v-15A1.5 1.5 0 014.5 3zm0 0v15" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v18m6-18v18M3 9h18M3 15h18" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold mb-1">Use a Template</h3>
                  <p className="text-white/50 text-sm">Start with a professionally designed template</p>
                </button>

                <button
                  onClick={() => setStep("ai")}
                  className="group p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#D6FC51]/50 hover:bg-white/[0.05] transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#D6FC51]/10 transition-colors">
                    <svg className="w-6 h-6 text-white/60 group-hover:text-[#D6FC51] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates
                  .filter((t) => t.id !== "blank")
                  .map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`group p-4 rounded-xl border text-left transition-all ${
                        selectedTemplate?.id === template.id
                          ? "border-[#D6FC51] bg-[#D6FC51]/5"
                          : "border-white/10 bg-white/[0.02] hover:border-[#D6FC51]/50 hover:bg-white/[0.05]"
                      }`}
                    >
                      {/* Template Preview */}
                      <div className="aspect-video rounded-lg bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] mb-4 overflow-hidden relative">
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
                                <div className="text-xs text-[#D6FC51]/60 mt-1">
                                  {template.tags.join(" • ")}
                                </div>
                              </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute top-3 left-3 w-16 h-1 rounded-full bg-[#D6FC51]/20" />
                            <div className="absolute top-6 left-3 w-10 h-1 rounded-full bg-white/10" />
                            <div className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-[#D6FC51]/30" />
                          </>
                        )}
                      </div>
                      <h3 className="text-white font-semibold mb-1">{template.name}</h3>
                      <p className="text-white/50 text-sm">{template.description}</p>
                    </button>
                  ))}
              </div>
            )}

            {/* Step: AI Generation */}
            {step === "ai" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Describe your landing page
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., A landing page for a SaaS product that helps freelancers track their time and invoice clients. Modern, professional look with blue accents..."
                    className="w-full h-40 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D6FC51] focus:border-transparent resize-none"
                  />
                </div>

                {/* Example prompts */}
                <div>
                  <p className="text-xs text-white/50 mb-2">Need inspiration? Try:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "AI writing assistant SaaS",
                      "Fitness coaching program",
                      "Online course platform",
                      "E-commerce brand",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setAiPrompt(`A landing page for ${suggestion.toLowerCase()}`)}
                        className="px-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAISubmit}
                    disabled={aiPrompt.trim().length < 10}
                    className="px-5 py-2.5 bg-[#D6FC51] text-black text-sm font-semibold rounded-lg hover:bg-[#D6FC51]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step: Project Details */}
            {step === "details" && (
              <div className="space-y-6">
                {/* Summary */}
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

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My Landing Page"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D6FC51] focus:border-transparent"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {step === "details" && (
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3">
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
                className="px-5 py-2.5 bg-[#D6FC51] text-black text-sm font-semibold rounded-lg hover:bg-[#D6FC51]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
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
