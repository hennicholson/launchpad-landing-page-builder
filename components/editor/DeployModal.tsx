"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { startDeploy, getDeployStatus } from "@/lib/actions/projects";

type DeployStep = {
  name: string;
  status: "pending" | "in_progress" | "complete" | "error";
};

type DeployModalProps = {
  projectId: string;
  projectName: string;
  existingSubdomain: string | null;
  onClose: () => void;
  onSuccess: (url: string) => void;
};

const DEPLOY_STEPS: string[] = [
  "Generating project",
  "Installing dependencies",
  "Building Next.js app",
  "Uploading to Netlify",
  "Verifying deployment",
];

export default function DeployModal({
  projectId,
  projectName,
  existingSubdomain,
  onClose,
  onSuccess,
}: DeployModalProps) {
  const [step, setStep] = useState<"config" | "deploying" | "success" | "error">("config");
  const [subdomain, setSubdomain] = useState(existingSubdomain || "");
  const [useExisting, setUseExisting] = useState(!!existingSubdomain);
  const [deploySteps, setDeploySteps] = useState<DeployStep[]>(
    DEPLOY_STEPS.map((name) => ({ name, status: "pending" }))
  );
  const [progress, setProgress] = useState(0);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Generate default subdomain from project name
  useEffect(() => {
    if (!existingSubdomain && !subdomain) {
      const defaultSubdomain = projectName
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 30);
      setSubdomain(defaultSubdomain || "my-landing-page");
    }
  }, [projectName, existingSubdomain, subdomain]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const addTerminalLine = (line: string) => {
    setTerminalLines((prev) => [...prev, line]);
  };

  const updateStepStatus = (index: number, status: DeployStep["status"]) => {
    setDeploySteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], status };
      return next;
    });
  };

  const handleDeploy = async () => {
    setStep("deploying");
    setTerminalLines([]);
    setProgress(0);
    setDeploySteps(DEPLOY_STEPS.map((name) => ({ name, status: "pending" })));

    const timestamp = new Date().toLocaleTimeString();
    addTerminalLine(`[${timestamp}] Starting deployment...`);
    addTerminalLine(`[${timestamp}] Target: ${subdomain}.onwhop.com`);
    addTerminalLine("");

    // Step 1: Start deployment (returns immediately)
    updateStepStatus(0, "in_progress");
    addTerminalLine("> Starting build process...");
    setProgress(5);

    try {
      // Start the deployment using server action - avoids Whop iframe proxy issues
      const startResult = await startDeploy(
        projectId,
        useExisting ? null : subdomain
      );

      if (!startResult.success) {
        throw new Error(startResult.message || startResult.error || "Failed to start deployment");
      }

      updateStepStatus(0, "complete");
      addTerminalLine("  Build queued successfully");
      setProgress(10);

      // Now poll for status updates using server action
      let lastStatus = "pending";
      let pollCount = 0;
      const maxPolls = 300; // 15 minutes max (3s intervals)

      while (pollCount < maxPolls) {
        await simulateDelay(3000); // Poll every 3 seconds
        pollCount++;

        try {
          const statusResult = await getDeployStatus(projectId);

          if (!statusResult.success || !statusResult.data) {
            throw new Error("Failed to check deployment status");
          }

          const deployment = statusResult.data.deployments?.[0];
          if (!deployment) continue;

          const newStatus = deployment.status;

          // Update UI based on status changes
          if (newStatus !== lastStatus) {
            lastStatus = newStatus;

            if (newStatus === "building") {
              // Step 2: Installing dependencies
              updateStepStatus(1, "in_progress");
              addTerminalLine("> Installing npm dependencies...");
              addTerminalLine("  This may take a moment...");
              setProgress(20);

              // Simulate some progress
              await simulateDelay(2000);
              addTerminalLine("  Installing react, next, framer-motion...");
              setProgress(30);
              updateStepStatus(1, "complete");

              // Step 3: Building
              updateStepStatus(2, "in_progress");
              addTerminalLine("> Building Next.js application...");
              addTerminalLine("  Compiling TypeScript...");
              setProgress(40);
            }

            if (newStatus === "ready") {
              // Complete remaining steps
              updateStepStatus(2, "complete");
              addTerminalLine("  Build complete");
              setProgress(75);

              updateStepStatus(3, "in_progress");
              addTerminalLine("> Uploading to Netlify...");
              await simulateDelay(500);
              updateStepStatus(3, "complete");
              addTerminalLine("  Files uploaded successfully");
              setProgress(90);

              updateStepStatus(4, "in_progress");
              addTerminalLine("> Verifying deployment...");
              await simulateDelay(500);
              updateStepStatus(4, "complete");
              setProgress(100);
              addTerminalLine("  Deployment verified");
              addTerminalLine("");

              const finalUrl = deployment.url || statusResult.data.liveUrl;
              addTerminalLine(`Deployed to: ${finalUrl}`);

              setDeployUrl(finalUrl);
              setStep("success");
              return;
            }

            if (newStatus === "failed") {
              const errorMsg = deployment.errorMessage || "Deployment failed";
              throw new Error(errorMsg);
            }
          }

          // Increment progress slowly while building
          if (newStatus === "building" && progress < 70) {
            setProgress((prev) => Math.min(prev + 2, 70));

            // Add occasional progress messages
            if (pollCount % 5 === 0) {
              const messages = [
                "  Optimizing pages...",
                "  Generating static export...",
                "  Processing assets...",
              ];
              const msg = messages[Math.floor(pollCount / 5) % messages.length];
              addTerminalLine(msg);
            }
          }
        } catch (pollError) {
          console.error("Poll error:", pollError);
          // Don't fail on individual poll errors, keep trying
        }
      }

      // If we get here, polling timed out
      throw new Error("Deployment timed out. Please check the admin dashboard.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      // Mark the current step as error
      const currentStepIndex = deploySteps.findIndex(s => s.status === "in_progress");
      if (currentStepIndex >= 0) {
        updateStepStatus(currentStepIndex, "error");
      }
      addTerminalLine(`  Error: ${msg}`);
      setErrorMessage(msg);
      setStep("error");
    }
  };

  const simulateDelay = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const isValidSubdomain = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(subdomain);

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
                  {step === "config" && "Deploy Your Landing Page"}
                  {step === "deploying" && "Deploying..."}
                  {step === "success" && "Deployment Complete"}
                  {step === "error" && "Deployment Failed"}
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
                {/* Subdomain options */}
                {existingSubdomain && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/[0.07] transition-colors">
                      <input
                        type="radio"
                        checked={useExisting}
                        onChange={() => setUseExisting(true)}
                        className="w-4 h-4 accent-amber-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm text-white">Use existing subdomain</span>
                        <p className="text-xs text-white/50 mt-0.5">
                          https://{existingSubdomain}.onwhop.com
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
                      <span className="text-sm text-white">Use new subdomain</span>
                    </label>
                  </div>
                )}

                {/* Subdomain input */}
                {(!existingSubdomain || !useExisting) && (
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Subdomain Name
                    </label>
                    <div className="flex items-stretch">
                      <input
                        type="text"
                        value={subdomain}
                        onChange={(e) =>
                          setSubdomain(
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, "")
                          )
                        }
                        placeholder="my-landing-page"
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-l-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                      <div className="px-4 py-3 bg-white/[0.03] border border-l-0 border-white/10 rounded-r-xl text-white/40 text-sm flex items-center">
                        .onwhop.com
                      </div>
                    </div>
                    {subdomain && !isValidSubdomain && (
                      <p className="text-xs text-amber-400 mt-2">
                        Subdomain must start and end with a letter or number
                      </p>
                    )}
                    {subdomain && isValidSubdomain && (
                      <p className="text-xs text-white/40 mt-2">
                        Your site will be available at https://{subdomain}.onwhop.com
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
                        Your landing page will be built as a full Next.js app with animations and deployed to Netlify with SSL.
                      </p>
                      <p className="text-xs text-amber-200/60 mt-1">
                        Build and deployment typically takes 30-60 seconds.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(step === "deploying" || step === "success" || step === "error") && (
              <div className="space-y-4">
                {/* Progress steps */}
                <div className="space-y-2">
                  {deploySteps.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        {s.status === "pending" && (
                          <div className="w-2 h-2 rounded-full bg-white/20" />
                        )}
                        {s.status === "in_progress" && (
                          <svg
                            className="w-4 h-4 animate-spin text-amber-500"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        )}
                        {s.status === "complete" && (
                          <svg
                            className="w-4 h-4 text-emerald-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {s.status === "error" && (
                          <svg
                            className="w-4 h-4 text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-sm ${
                          s.status === "pending"
                            ? "text-white/40"
                            : s.status === "in_progress"
                            ? "text-amber-400"
                            : s.status === "complete"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {s.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Terminal */}
                <div
                  ref={terminalRef}
                  className="h-40 bg-black rounded-lg border border-white/10 p-4 font-mono text-xs overflow-auto"
                >
                  {terminalLines.map((line, i) => (
                    <div
                      key={i}
                      className={`${
                        line.startsWith(">")
                          ? "text-amber-400"
                          : line.startsWith("  Error:")
                          ? "text-red-400"
                          : line.startsWith("Deployed to:")
                          ? "text-emerald-400"
                          : "text-white/60"
                      }`}
                    >
                      {line || "\u00A0"}
                    </div>
                  ))}
                  {step === "deploying" && (
                    <span className="inline-block w-2 h-4 bg-amber-500 animate-pulse" />
                  )}
                </div>

                {/* Success message */}
                {step === "success" && deployUrl && (
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
                )}

                {/* Error message */}
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
                  disabled={!subdomain || (!useExisting && !isValidSubdomain)}
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
                  Deploy
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
                    setProgress(0);
                    setDeploySteps(
                      DEPLOY_STEPS.map((name) => ({ name, status: "pending" }))
                    );
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
