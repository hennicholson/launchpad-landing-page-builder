"use client";

import { useEffect, useState, use, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/lib/store";
import SectionList from "@/components/editor/SectionList";
import Canvas from "@/components/editor/Canvas";
import PropertyPanel from "@/components/editor/PropertyPanel";
import DeployModal from "@/components/editor/DeployModal";
import { getProject, updateProject } from "@/lib/actions/projects";
import type { LandingPage } from "@/lib/page-schema";

type Params = { id: string };

export default function EditorPage({ params }: { params: Promise<Params> }) {
  const { id } = use(params);
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showDraftRecovery, setShowDraftRecovery] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const saveRetryCount = useRef(0);

  const { page, setPage, isDirty, markSaved, undo, redo, canUndo, canRedo, selectSection, pushHistory } = useEditorStore();

  // Save to localStorage as backup
  const saveDraftToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem(`draft-${id}`, JSON.stringify(page));
    } catch (e) {
      console.warn("Failed to save draft to localStorage:", e);
    }
  }, [id, page]);

  // Auto-save function with retry logic
  const performAutoSave = useCallback(async () => {
    if (!isDirty) return;

    setSaving(true);
    setSaveError(null);

    // Always save to localStorage as backup
    saveDraftToLocalStorage();

    try {
      // Use server action instead of API route to avoid Whop iframe proxy issues
      const result = await updateProject(id, { pageData: page as LandingPage });
      if (result.success) {
        markSaved();
        setLastSaved(new Date());
        saveRetryCount.current = 0;
        // Clear localStorage draft on successful save
        localStorage.removeItem(`draft-${id}`);
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
  }, [id, page, isDirty, markSaved, saveDraftToLocalStorage]);

  // Auto-save when changes are made (debounced)
  useEffect(() => {
    if (isDirty && !loading) {
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
  }, [isDirty, page, loading, performAutoSave]);

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
    const draft = localStorage.getItem(`draft-${id}`);
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        // Only show recovery if there's actual content
        if (parsedDraft && parsedDraft.sections?.length > 0) {
          setShowDraftRecovery(true);
        }
      } catch (e) {
        localStorage.removeItem(`draft-${id}`);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      // Use server action instead of API route to avoid Whop iframe proxy issues
      const result = await getProject(id);
      if (!result.success || !result.project) {
        console.error("Failed to fetch project:", result.error);
        router.push("/dashboard");
        return;
      }
      setProjectName(result.project.name);
      setPage(result.project.pageData as LandingPage);
      setLiveUrl(result.project.liveUrl);
    } catch (error) {
      console.error("Failed to fetch project:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Use server action instead of API route to avoid Whop iframe proxy issues
      const result = await updateProject(id, { pageData: page as LandingPage });
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
    const draft = localStorage.getItem(`draft-${id}`);
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        setPage(parsedDraft);
        localStorage.removeItem(`draft-${id}`);
      } catch (e) {
        console.error("Failed to recover draft:", e);
      }
    }
    setShowDraftRecovery(false);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(`draft-${id}`);
    setShowDraftRecovery(false);
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#0a0a0b] flex flex-col overflow-hidden">
        {/* Skeleton Header */}
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-white/10 animate-pulse" />
              <div className="w-32 h-5 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-20 h-9 rounded-lg bg-white/5 animate-pulse" />
            <div className="w-24 h-9 rounded-lg bg-amber-500/20 animate-pulse" />
          </div>
        </div>
        {/* Skeleton Body */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 border-r border-white/5 p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="h-64 rounded-xl bg-white/5 animate-pulse" />
              <div className="h-48 rounded-xl bg-white/5 animate-pulse" />
            </div>
          </div>
          <div className="w-80 border-l border-white/5 p-4 space-y-4">
            <div className="h-8 w-24 rounded bg-white/10 animate-pulse" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

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
          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
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
          projectId={id}
          projectName={projectName}
          existingSubdomain={liveUrl ? extractSubdomain(liveUrl) : null}
          onClose={() => setShowDeployModal(false)}
          onSuccess={(url) => {
            setLiveUrl(url);
            setShowDeployModal(false);
          }}
        />
      )}
    </div>
  );
}

// Helper to extract subdomain from Netlify URL
function extractSubdomain(url: string): string | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname;
    if (hostname.endsWith(".netlify.app")) {
      return hostname.replace(".netlify.app", "");
    }
    return null;
  } catch {
    return null;
  }
}
