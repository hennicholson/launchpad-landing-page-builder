"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { startDeploy } from "@/lib/actions/projects";

type DeployModalProps = {
  projectId: string;
  projectName: string;
  existingSlug: string | null;
  onClose: () => void;
  onSuccess: (url: string) => void;
};

export default function DeployModal({
  projectId,
  projectName,
  existingSlug,
  onClose,
  onSuccess,
}: DeployModalProps) {
  const [step, setStep] = useState<"config" | "deploying" | "success" | "error">("config");
  const [slug, setSlug] = useState(existingSlug || "");
  const [useExisting, setUseExisting] = useState(!!existingSlug);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate default slug from project name
  useEffect(() => {
    if (!existingSlug && !slug) {
      const defaultSlug = projectName
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 30);
      setSlug(defaultSlug || "my-landing-page");
    }
  }, [projectName, existingSlug, slug]);

  const handleDeploy = async () => {
    setStep("deploying");
    setErrorMessage(null);

    try {
      // Deploy is instant - just a DB update
      const result = await startDeploy(
        projectId,
        useExisting ? null : slug
      );

      if (!result.success) {
        throw new Error(result.message || result.error || "Failed to publish site");
      }

      setDeployUrl(result.url || null);
      setStep("success");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      setErrorMessage(msg);
      setStep("error");
    }
  };

  const isValidSlug = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(slug);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-xl bg-[#0a0a0b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {step === "config" && "Publish Your Landing Page"}
                  {step === "deploying" && "Publishing..."}
                  {step === "success" && "Site Published!"}
                  {step === "error" && "Publishing Failed"}
                </h2>
                <p className="text-xs text-white/50">{projectName}</p>
              </div>
            </div>
            {step !== "deploying" && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-6">
            {step === "config" && (
              <div className="space-y-5">
                {/* URL path options */}
                {existingSlug && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.07] transition-colors">
                      <input
                        type="radio"
                        checked={useExisting}
                        onChange={() => setUseExisting(true)}
                        className="w-4 h-4 accent-amber-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm text-white">Use existing URL</span>
                        <p className="text-xs text-white/50 mt-0.5">
                          onwhop.com/s/{existingSlug}
                        </p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.07] transition-colors">
                      <input
                        type="radio"
                        checked={!useExisting}
                        onChange={() => setUseExisting(false)}
                        className="w-4 h-4 accent-amber-500"
                      />
                      <span className="text-sm text-white">Use new URL path</span>
                    </label>
                  </div>
                )}

                {/* URL path input */}
                {(!existingSlug || !useExisting) && (
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      URL Path
                    </label>
                    <div className="flex items-stretch">
                      <div className="px-4 py-3 bg-white/[0.03] border border-r-0 border-white/10 rounded-l-xl text-white/40 text-sm flex items-center">
                        onwhop.com/s/
                      </div>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) =>
                          setSlug(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, "")
                          )
                        }
                        placeholder="my-landing-page"
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-r-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    {slug && !isValidSlug && (
                      <p className="text-xs text-amber-400 mt-2">
                        URL path must start and end with a letter or number
                      </p>
                    )}
                    {slug && isValidSlug && (
                      <p className="text-xs text-white/40 mt-2">
                        Your site will be available at onwhop.com/s/{slug}
                      </p>
                    )}
                  </div>
                )}

                {/* Info box */}
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-amber-200/90">
                        Your landing page will be published instantly with SSL enabled.
                      </p>
                      <p className="text-xs text-amber-200/60 mt-1">
                        Updates are live immediately - no build time required.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === "deploying" && (
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4" />
                <p className="text-white/60">Publishing your site...</p>
              </div>
            )}

            {step === "success" && deployUrl && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-emerald-400 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-emerald-200/90">
                        Your site is now live!
                      </p>
                      <a
                        href={deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-400 hover:underline"
                      >
                        {deployUrl}
                      </a>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/40 text-center">
                  Any future changes you make will be reflected instantly at this URL.
                </p>
              </div>
            )}

            {step === "error" && errorMessage && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-red-400 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                  <p className="text-sm text-red-200/90">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3">
            {step === "config" && (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeploy}
                  disabled={!slug || (!useExisting && !isValidSlug)}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-sm font-semibold rounded-lg hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                    />
                  </svg>
                  Publish
                </button>
              </>
            )}
            {step === "success" && (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  Close
                </button>
                <a
                  href={deployUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onSuccess(deployUrl || "")}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-sm font-semibold rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                  View Site
                </a>
              </>
            )}
            {step === "error" && (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setStep("config");
                    setErrorMessage(null);
                  }}
                  className="px-5 py-2.5 bg-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
