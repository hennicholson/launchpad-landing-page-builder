"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import NewProjectModal from "@/components/dashboard/NewProjectModal";
import { useUser } from "@/lib/context/user-context";
import { deleteProject, getProjects, type Project } from "@/lib/actions/projects";

export default function DashboardPage() {
  const router = useRouter();
  const { whop, user, isLoading: userLoading, isAuthenticated } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Wait for user context to be ready before loading projects
    // This prevents 500 errors when auth headers aren't available yet
    if (!userLoading && isAuthenticated) {
      loadProjects();
    } else if (!userLoading && !isAuthenticated) {
      // Not authenticated - stop loading state
      setLoading(false);
    }
  }, [userLoading, isAuthenticated]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      // Use server action instead of API route to avoid Whop iframe proxy issues
      // Server actions run on the server in the same request context, preserving auth
      const projectsData = await getProjects();
      console.log('[loadProjects] Loaded projects via server action:', projectsData.length);
      setProjects(projectsData);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        const result = await deleteProject(id);

        if (!result.success) {
          const errorMsg = result.error || "Unknown error";
          console.error("Delete failed:", errorMsg);
          alert(`Failed to delete project: ${errorMsg}`);
          setDeleteConfirm(null);
          return;
        }

        setProjects(projects.filter((p) => p.id !== id));
        setDeleteConfirm(null);
      } catch (error) {
        console.error("Failed to delete project:", error);
        alert("Failed to delete project. Please try again.");
        setDeleteConfirm(null);
      }
    });
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Unknown";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleProjectCreated = () => {
    loadProjects();
  };

  return (
    <>
      {/* Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      <div className="min-h-screen bg-[#0a0a0b] text-white font-['DM_Sans',sans-serif] relative overflow-hidden">
        {/* Noise texture overlay */}
        <div
          className="fixed inset-0 opacity-[0.015] pointer-events-none z-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Ambient gradient orbs */}
        <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-30%] left-[-10%] w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Header */}
        <header className="relative z-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/launchpad-logo.png"
                alt="LaunchPad"
                className="h-10 w-auto"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="text-sm text-white/50 hover:text-white transition-colors">
                Docs
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  {/* Avatar */}
                  {whop?.profile_pic_url ? (
                    <img
                      src={whop.profile_pic_url}
                      alt={whop.username || whop.name || "User"}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-white/10"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 ring-2 ring-white/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {(whop?.username || whop?.name || user?.username || user?.name || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-white/80 hidden sm:block">
                    {whop?.username || whop?.name || user?.username || user?.name || "User"}
                  </span>
                  <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-[#141416] border border-white/10 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User info header */}
                      <div className="p-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          {whop?.profile_pic_url ? (
                            <img
                              src={whop.profile_pic_url}
                              alt={whop.username || whop.name || "User"}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {(whop?.username || whop?.name || "U").charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">
                              {whop?.name || whop?.username || user?.name || user?.username || "User"}
                            </p>
                            <p className="text-xs text-white/40 truncate">
                              {whop?.email || user?.email || ""}
                            </p>
                          </div>
                        </div>
                        {/* Plan badge */}
                        <div className="mt-3 flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            user?.plan === "pro"
                              ? "bg-amber-500/10 text-amber-400"
                              : user?.plan === "starter"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-white/5 text-white/40"
                          }`}>
                            {user?.plan?.charAt(0).toUpperCase()}{user?.plan?.slice(1) || "Free"} Plan
                          </span>
                          <span className="text-xs text-white/30">
                            {user?.projectCount || 0} projects
                          </span>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Settings
                        </button>
                        <button
                          onClick={() => router.push('/pricing')}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Billing
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Page header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <h1 className="font-['Sora',sans-serif] text-4xl font-semibold tracking-tight mb-2">
                Your Projects
              </h1>
              <p className="text-white/40 text-lg">
                {projects.length === 0
                  ? "Create your first high-converting landing page"
                  : `${projects.length} project${projects.length !== 1 ? 's' : ''} in your workspace`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-2xl bg-white/[0.02] animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Create New Project Card */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="group relative aspect-[4/3] rounded-2xl border-2 border-dashed border-white/10 hover:border-amber-500/50 transition-all duration-500 flex flex-col items-center justify-center gap-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative w-14 h-14 rounded-2xl bg-white/5 group-hover:bg-amber-500/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <svg className="w-7 h-7 text-white/40 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div className="relative text-center">
                  <p className="font-['Sora',sans-serif] font-medium text-white/70 group-hover:text-white transition-colors">New Project</p>
                  <p className="text-sm text-white/30 mt-1">Start with AI or blank canvas</p>
                </div>
              </button>

              {/* Project Cards */}
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Card background with gradient */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br opacity-20"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${project.pageData?.colorScheme?.primary || '#3b82f6'}, ${project.pageData?.colorScheme?.background || '#1e40af'})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-[#0f0f10]/80 backdrop-blur-sm" />

                  {/* Glass border effect */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all duration-300" />

                  {/* Content */}
                  <div className="relative h-full p-5 flex flex-col">
                    {/* Status badge */}
                    <div className="flex items-center gap-2 mb-auto">
                      {project.isPublished === "true" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-white/40 text-xs font-medium">
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Project info */}
                    <div className="mt-auto">
                      <h3 className="font-['Sora',sans-serif] font-semibold text-lg mb-1 truncate">
                        {project.name}
                      </h3>
                      <p className="text-sm text-white/30">
                        Updated {formatDate(project.updatedAt)}
                      </p>
                    </div>

                    {/* Action buttons - appear on hover */}
                    <div className="absolute inset-x-5 bottom-5 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <button
                        onClick={() => router.push(`/editor/${project.id}`)}
                        className="flex-1 py-2.5 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
                      >
                        Edit
                      </button>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(project.id)}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {projects.length === 0 && (
                <div className="col-span-full md:col-span-1 lg:col-span-2 flex items-center justify-center p-12 rounded-2xl border border-white/5 bg-white/[0.01]">
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <h3 className="font-['Sora',sans-serif] font-semibold text-xl mb-2">No projects yet</h3>
                    <p className="text-white/40 mb-6">
                      Create your first landing page with AI assistance or start from scratch.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Create Project Modal */}
        <NewProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleProjectCreated}
        />

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(null)}
            />
            <div className="relative w-full max-w-sm rounded-2xl bg-[#141416] border border-white/10 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="font-['Sora',sans-serif] font-semibold text-lg text-center mb-2">Delete Project?</h3>
              <p className="text-white/40 text-center text-sm mb-6">
                This action cannot be undone. The project and all its data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/70 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
