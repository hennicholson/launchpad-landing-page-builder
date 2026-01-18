"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/lib/store";
import SectionList from "@/components/editor/SectionList";
import Canvas from "@/components/editor/Canvas";
import PropertyPanel from "@/components/editor/PropertyPanel";
import DeployModal from "@/components/editor/DeployModal";
import { updateProject, type FullProject } from "@/lib/actions/projects";
import type { LandingPage } from "@/lib/page-schema";
import { useFullScreen, useFullScreenKeyboardShortcut } from "@/lib/useFullScreen";

type Props = {
  project: FullProject;
  userPlan: string;
};

export default function EditorClient({ project, userPlan }: Props) {
  const router = useRouter();
  const [projectName, setProjectName] = useState(project.name);
  const [saving, setSaving] = useState(false);
  const [liveUrl, setLiveUrl] = useState<string | null>(project.liveUrl);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showDraftRecovery, setShowDraftRecovery] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const saveRetryCount = useRef(0);
  const initializedRef = useRef(false);

  const { page, setPage, isDirty, markSaved, undo, redo, canUndo, canRedo, selectSection } = useEditorStore();

  // Full-screen mode
  const { isFullScreen, toggleFullScreen, isSupported: isFullScreenSupported } = useFullScreen();

  // Enable keyboard shortcut: Cmd/Ctrl + Shift + F
  useFullScreenKeyboardShortcut(toggleFullScreen);

  // Initialize the page data from the project (only once)
  useEffect(() => {
    if (!initializedRef.current && project.pageData) {
      setPage(project.pageData as LandingPage);
      initializedRef.current = true;
    }
  }, [project.pageData, setPage]);

  // Save to localStorage as backup
  const saveDraftToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem(`draft-${project.id}`, JSON.stringify(page));
    } catch (e) {
      console.warn("Failed to save draft to localStorage:", e);
    }
  }, [project.id, page]);

  // Auto-save function with retry logic
  const performAutoSave = useCallback(async () => {
    if (!isDirty) return;

    setSaving(true);
    setSaveError(null);

    // Always save to localStorage as backup
    saveDraftToLocalStorage();

    try {
      // Use server action instead of API route to avoid Whop iframe proxy issues
      const result = await updateProject(project.id, { pageData: page as LandingPage });
      if (result.success) {
        markSaved();
        setLastSaved(new Date());
        saveRetryCount.current = 0;
        // Clear localStorage draft on successful save
        localStorage.removeItem(`draft-${project.id}`);
      } else {
        throw new Error(result.error || "Save failed");
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
      saveRetryCount.current += 1;

      if (saveRetryCount.current <= 3) {
        setSaveError(`Save failed. Retrying... (${saveRetryCount.current}/3)`);
        // Retry after 3 seconds
        setTimeout(() => performAutoSave(), 3000);
      } else {
        setSaveError("Save failed. Your changes are saved locally.");
        saveRetryCount.current = 0;
      }
    } finally {
      setSaving(false);
    }
  }, [project.id, page, isDirty, markSaved, saveDraftToLocalStorage]);

  // Auto-save when changes are made (debounced)
  useEffect(() => {
    if (isDirty && initializedRef.current) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer for 2 seconds after last change
      autoSaveTimerRef.current = setTimeout(() => {
        performAutoSave();
      }, 2000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [isDirty, page, performAutoSave]);

  // Save before leaving page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        // Try to save to localStorage before leaving
        saveDraftToLocalStorage();
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, saveDraftToLocalStorage]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Cmd/Ctrl + S: Save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (isDirty && !saving) {
          performAutoSave();
        }
      }

      // Cmd/Ctrl + Z: Undo
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) {
          undo();
        }
      }

      // Cmd/Ctrl + Shift + Z: Redo
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "z") {
        e.preventDefault();
        if (canRedo()) {
          redo();
        }
      }

      // Escape: Deselect section
      if (e.key === "Escape") {
        selectSection(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDirty, saving, performAutoSave, undo, redo, canUndo, canRedo, selectSection]);

  // Check for draft recovery on mount
  useEffect(() => {
    const draft = localStorage.getItem(`draft-${project.id}`);
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        // Only show recovery if there's actual content
        if (parsedDraft && parsedDraft.sections?.length > 0) {
          setShowDraftRecovery(true);
        }
      } catch (e) {
        localStorage.removeItem(`draft-${project.id}`);
      }
    }
  }, [project.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Use server action instead of API route to avoid Whop iframe proxy issues
      const result = await updateProject(project.id, { pageData: page as LandingPage });
      if (result.success) {
        markSaved();
        setLastSaved(new Date());
      } else {
        console.error("Failed to save:", result.error);
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  // Handle draft recovery
  const handleRecoverDraft = () => {
    const draft = localStorage.getItem(`draft-${project.id}`);
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setPage(parsedDraft);
        localStorage.removeItem(`draft-${project.id}`);
      } catch (e) {
        console.error("Failed to recover draft:", e);
      }
    }
    setShowDraftRecovery(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(`draft-${project.id}`);
    setShowDraftRecovery(false);
  };

  return (
    <div className="h-screen bg-[#0a0a0b] text-white font-['DM_Sans',sans-serif] flex flex-col overflow-hidden">
      {/* Editor Header */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>
            <span className="font-['Sora',sans-serif] font-medium">{projectName}</span>
            {saving ? (
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs flex items-center gap-1">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : isDirty ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs">
                Unsaved
              </span>
            ) : lastSaved ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">
                Saved
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}
          {/* Full-screen toggle button */}
          {isFullScreenSupported && (
            <button
              onClick={toggleFullScreen}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              title={isFullScreen ? "Exit full screen (⌘⇧F)" : "Enter full screen (⌘⇧F)"}
            >
              {isFullScreen ? (
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              )}
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              // Check if user is on free plan
              if (userPlan === "free") {
                setShowUpgradeModal(true);
                return;
              }
              // Save first if there are changes
              if (isDirty) {
                handleSave();
              }
              setShowDeployModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black text-sm font-semibold hover:from-amber-400 hover:to-orange-400 transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
            Publish
          </button>
        </div>
      </header>

      {/* Deploy notifications */}
      {deployError && (
        <div className="mx-4 mt-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {deployError}
          </div>
          <button onClick={() => setDeployError(null)} className="text-red-400 hover:text-red-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {deploySuccess && (
        <div className="mx-4 mt-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Successfully deployed! Your site is now live.
        </div>
      )}

      {/* Save error notification */}
      {saveError && (
        <div className="mx-4 mt-2 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {saveError}
          </div>
          <button onClick={() => setSaveError(null)} className="text-amber-400 hover:text-amber-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Draft Recovery Modal */}
      {showDraftRecovery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1b] rounded-xl border border-white/10 p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Recover Unsaved Changes?</h3>
                <p className="text-white/60 text-sm">We found unsaved changes from a previous session.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDiscardDraft}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleRecoverDraft}
                className="flex-1 px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors"
              >
                Recover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Section List */}
        <SectionList />

        {/* Center - Canvas */}
        <Canvas />

        {/* Right Sidebar - Property Panel */}
        <PropertyPanel />
      </div>

      {/* Deploy Modal */}
      {showDeployModal && (
        <DeployModal
          projectId={project.id}
          projectName={projectName}
          existingSlug={liveUrl ? extractSlug(liveUrl) : null}
          onClose={() => setShowDeployModal(false)}
          onSuccess={(url) => {
            setLiveUrl(url);
            setShowDeployModal(false);
          }}
        />
      )}

      {/* Upgrade Modal - Free users trying to publish */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a1b] rounded-2xl border border-white/10 p-8 max-w-md mx-4 shadow-2xl">
            {/* Rocket icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-2">
              Upgrade to Publish
            </h3>
            <p className="text-white/60 text-center mb-6">
              Publishing your landing page to a live URL is a Pro feature. Upgrade to unlock this and more.
            </p>

            {/* Pro features list */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white/80">Publish to live URL</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white/80">Custom onwhop.com subdomain</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white/80">50 AI page generations / month</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white/80">Up to 7 projects</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white/80">No analytics tracking (private)</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  router.push("/billing");
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black text-sm font-bold hover:from-amber-400 hover:to-orange-400 transition-all"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to extract slug from path-based URL (e.g., onwhop.com/s/mybusiness)
function extractSlug(url: string): string | null {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    // Match /s/{slug} pattern
    const match = pathname.match(/^\/s\/([a-z0-9-]+)$/);
    if (match) {
      return match[1];
    }
    return null;
  } catch {
    return null;
  }
}
