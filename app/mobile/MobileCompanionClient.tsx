"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Project, DashboardUser } from "@/lib/actions/projects";

type Props = {
  initialProjects: Project[];
  initialUser: DashboardUser;
};

// ─── Icon Components ─────────────────────────────────────────────────────────

function IconLink({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" />
    </svg>
  );
}

function IconExternalLink({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}

function IconClose({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconChevronRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function IconPhone({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  );
}

function IconDesktop({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  );
}

function IconDocs({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function IconChart({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function IconEmpty({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

// ─── Copied Toast Component ──────────────────────────────────────────────────

function CopiedToast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500 text-black text-sm font-semibold shadow-lg shadow-amber-500/20"
        >
          <IconCheck className="w-4 h-4" />
          Copied!
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Project Card Thumbnail ──────────────────────────────────────────────────

function ProjectThumbnail({ project }: { project: Project }) {
  const bgColor = project.pageData?.colorScheme?.primary || "#f59e0b";
  const initial = (project.name || "P").charAt(0).toUpperCase();

  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${bgColor}22, ${bgColor}44)`,
        border: `1px solid ${bgColor}33`,
      }}
    >
      <span
        className="text-lg font-bold font-['Sora',sans-serif]"
        style={{ color: bgColor }}
      >
        {initial}
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MobileCompanionClient({ initialProjects, initialUser }: Props) {
  const router = useRouter();
  const [projects] = useState<Project[]>(initialProjects);
  const [activeTab, setActiveTab] = useState<"projects" | "analytics">("projects");
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [copiedToast, setCopiedToast] = useState(false);

  const whop = initialUser.whop;
  const user = initialUser.internal;

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Unknown";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getProjectUrl = useCallback((project: Project): string => {
    if (project.isPublished === "true" && project.liveUrl) {
      return project.liveUrl;
    }
    return `${typeof window !== "undefined" ? window.location.origin : ""}/preview/${project.id}`;
  }, []);

  const copyLink = useCallback(async (project: Project) => {
    const url = getProjectUrl(project);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 1800);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 1800);
    }
  }, [getProjectUrl]);

  const openPreview = useCallback((project: Project) => {
    setIframeLoading(true);
    setPreviewProject(project);
  }, []);

  const publishedCount = projects.filter((p) => p.isPublished === "true").length;

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Mobile Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-[#0a0a0b]/95 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/launchpad-logo.png"
              alt="LaunchPad"
              className="h-7 w-auto"
              style={{ height: "28px", width: "auto" }}
            />
            <span className="font-['Sora',sans-serif] text-sm font-semibold text-white/70">
              Mobile
            </span>
          </div>
          <div className="flex items-center gap-2">
            {whop?.profile_pic_url ? (
              <img
                src={whop.profile_pic_url}
                alt={whop.username || "User"}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 ring-2 ring-white/10 flex items-center justify-center">
                <span className="text-xs font-bold text-black">
                  {(whop?.username || user?.username || "U").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mt-3 bg-white/[0.04] rounded-xl p-1">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === "projects"
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 active:bg-white/[0.04]"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === "analytics"
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 active:bg-white/[0.04]"
            }`}
          >
            Analytics
          </button>
        </div>
      </header>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <main className="flex-1 px-4 py-4">
        {activeTab === "projects" && (
          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
                  <IconEmpty className="w-8 h-8 text-white/15" />
                </div>
                <p className="text-white/60 text-sm mb-1 font-semibold">No projects yet</p>
                <p className="text-white/30 text-xs max-w-[240px]">
                  Open LaunchPad on desktop to create your first page.
                </p>
              </div>
            ) : (
              projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => openPreview(project)}
                    className="w-full text-left p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] active:scale-[0.98] active:bg-white/[0.06] transition-all duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <ProjectThumbnail project={project} />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-['Sora',sans-serif] font-semibold text-white text-[15px] truncate">
                            {project.name}
                          </h3>
                          {project.isPublished === "true" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold flex-shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Live
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 text-[10px] font-medium flex-shrink-0">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-white/35 text-xs">
                          Updated {formatDate(project.updatedAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Inline copy link for published sites */}
                        {project.isPublished === "true" && project.liveUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyLink(project);
                            }}
                            className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center active:bg-amber-500/20 transition-colors"
                            aria-label="Copy link"
                          >
                            <IconLink className="w-4 h-4 text-amber-400" />
                          </button>
                        )}
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                          <IconChevronRight className="w-4 h-4 text-white/25" />
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-4">
            {/* Stats overview */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
              >
                <p className="text-white/40 text-xs mb-1.5 font-medium">Total Projects</p>
                <p className="font-['Sora',sans-serif] text-3xl font-bold text-white">
                  {projects.length}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
              >
                <p className="text-white/40 text-xs mb-1.5 font-medium">Published</p>
                <p className="font-['Sora',sans-serif] text-3xl font-bold text-emerald-400">
                  {publishedCount}
                </p>
              </motion.div>
            </div>

            {/* Placeholder panel */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <IconChart className="w-7 h-7 text-amber-400/60" />
              </div>
              <p className="text-white/50 text-sm font-semibold mb-1">Analytics Coming Soon</p>
              <p className="text-white/25 text-xs max-w-[260px] mx-auto">
                Page views, clicks, and conversion data will appear here.
              </p>
            </motion.div>
          </div>
        )}
      </main>

      {/* ── Preview Modal (Full-screen overlay) ───────────────────────── */}
      <AnimatePresence>
        {previewProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0b]"
          >
            {/* Preview top bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.06] flex-shrink-0 bg-[#0a0a0b]"
            >
              {/* Left: project info */}
              <div className="min-w-0 flex-1 mr-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-['Sora',sans-serif] font-semibold text-white text-sm truncate">
                    {previewProject.name}
                  </h3>
                  {previewProject.isPublished === "true" ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-semibold flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-white/[0.06] text-white/40 text-[10px] font-medium flex-shrink-0">
                      Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Right: action buttons */}
              <div className="flex items-center gap-1.5">
                {/* Copy Link */}
                <button
                  onClick={() => copyLink(previewProject)}
                  className="h-9 px-3 rounded-xl bg-amber-500/15 flex items-center gap-1.5 active:bg-amber-500/25 transition-colors"
                  aria-label="Copy link"
                >
                  <IconLink className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 text-xs font-semibold">Copy</span>
                </button>

                {/* Open in Browser (published only) */}
                {previewProject.isPublished === "true" && previewProject.liveUrl && (
                  <a
                    href={previewProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-xl bg-white/[0.06] flex items-center justify-center active:bg-white/10 transition-colors"
                    aria-label="Open in browser"
                  >
                    <IconExternalLink className="w-4 h-4 text-white/60" />
                  </a>
                )}

                {/* Close */}
                <button
                  onClick={() => setPreviewProject(null)}
                  className="h-9 w-9 rounded-xl bg-white/[0.06] flex items-center justify-center active:bg-white/10 transition-colors"
                  aria-label="Close preview"
                >
                  <IconClose className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </motion.div>

            {/* Loading indicator */}
            <AnimatePresence>
              {iframeLoading && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 top-[53px] z-10 flex items-center justify-center bg-[#0a0a0b]"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-amber-400 animate-spin" />
                    <p className="text-white/30 text-xs font-medium">Loading preview...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Preview iframe */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={`/preview/${previewProject.id}`}
                className="w-full h-full border-0"
                title={`${previewProject.name} preview`}
                onLoad={() => setIframeLoading(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Copied Toast ──────────────────────────────────────────────── */}
      <CopiedToast show={copiedToast} />

      {/* ── Bottom Nav ────────────────────────────────────────────────── */}
      <nav className="sticky bottom-0 z-20 bg-[#0a0a0b]/95 backdrop-blur-md border-t border-white/[0.06] px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around">
          <button
            onClick={() => router.push("/mobile")}
            className="flex flex-col items-center gap-0.5 py-1.5 min-w-[56px] text-amber-400"
          >
            <IconPhone className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Mobile</span>
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex flex-col items-center gap-0.5 py-1.5 min-w-[56px] text-white/35 active:text-white/60 transition-colors"
          >
            <IconDesktop className="w-5 h-5" />
            <span className="text-[10px] font-medium">Desktop</span>
          </button>
          <button
            onClick={() => router.push("/docs")}
            className="flex flex-col items-center gap-0.5 py-1.5 min-w-[56px] text-white/35 active:text-white/60 transition-colors"
          >
            <IconDocs className="w-5 h-5" />
            <span className="text-[10px] font-medium">Docs</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
