"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import NewProjectModal from "@/components/dashboard/NewProjectModal";
import { deleteProject, type Project, type DashboardUser } from "@/lib/actions/projects";

type Props = {
  initialProjects: Project[];
  initialUser: DashboardUser;
};

export default function DashboardClient({ initialProjects, initialUser }: Props) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"choose" | "template" | "ai" | "details">("choose");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isPending, startTransition] = useTransition();

  // User state - can be updated from client-side fetch if SSR auth failed
  const [userData, setUserData] = useState(initialUser);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // Drag-to-scroll state for carousel
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  // Client-side auth fallback: if SSR didn't get user data, try using localStorage token
  useEffect(() => {
    // Only fetch if SSR returned no user data
    if (userData.whop || userData.internal) {
      console.log("[DashboardClient] User data from SSR:", userData.whop?.username || userData.internal?.username);
      return;
    }

    // Check for stored token from /whop entry
    const storedToken = localStorage.getItem('whop-dev-token');
    if (!storedToken) {
      console.log("[DashboardClient] No stored token, cannot fetch user");
      return;
    }

    console.log("[DashboardClient] SSR returned no user, fetching with stored token...");
    setIsLoadingUser(true);

    fetch('/api/users/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: storedToken }),
    })
      .then(res => res.json())
      .then(data => {
        console.log("[DashboardClient] Fetched user:", data.whop?.username || data.user?.username);
        if (data.whop || data.user) {
          setUserData({
            whop: data.whop,
            internal: data.user,
          });

          // Fetch projects directly with token in body (client-side auth)
          // This avoids SSR issues when headers aren't available
          console.log("[DashboardClient] Fetching projects with token...");
          fetch('/api/users/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: storedToken }),
          })
            .then(res => res.json())
            .then(projectData => {
              console.log("[DashboardClient] Fetched projects:", projectData.projects?.length || 0);
              if (projectData.projects) {
                setProjects(projectData.projects);
              }
            })
            .catch(err => console.error("[DashboardClient] Failed to fetch projects:", err));
        }
      })
      .catch(err => {
        console.error("[DashboardClient] Failed to fetch user:", err);
      })
      .finally(() => {
        setIsLoadingUser(false);
      });
  }, []); // Only run once on mount

  const whop = userData.whop;
  const user = userData.internal;

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
    // Refresh the page to get new data via SSR
    router.refresh();
  };

  const handleCreateBlank = async () => {
    // For now, open the modal - blank project creation can be added later
    // Or we could create a project with default data and navigate directly
    setIsModalOpen(true);
  };

  // Drag-to-scroll handlers for carousel
  const handleDragStart = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setDragStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setDragScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - dragStartX) * 1.5;
    scrollContainerRef.current.scrollLeft = dragScrollLeft - walk;
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
                  {isLoadingUser ? (
                    <div className="w-7 h-7 rounded-full bg-white/10 ring-2 ring-white/10 flex items-center justify-center animate-pulse">
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : whop?.profile_pic_url ? (
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
                    {isLoadingUser ? "Loading..." : (whop?.username || whop?.name || user?.username || user?.name || "User")}
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
                          onClick={() => router.push('/billing')}
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
          {/* Create New Project Section */}
          <div className="mb-12">
            <h2 className="font-['Sora',sans-serif] text-xl font-semibold mb-6 text-white/90">Create New Project</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              {/* Start from Scratch */}
              <button
                onClick={() => {
                  setModalStep("details");
                  setIsModalOpen(true);
                }}
                className="group text-left p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center mb-4 transition-all">
                  <svg className="w-6 h-6 text-white/50 group-hover:text-white/70 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <p className="font-['Sora',sans-serif] font-medium text-white/80 group-hover:text-white transition-colors">Start from Scratch</p>
                <p className="text-sm text-white/40 mt-1">Blank canvas</p>
              </button>

              {/* Use a Template */}
              <button
                onClick={() => {
                  setModalStep("template");
                  setIsModalOpen(true);
                }}
                className="group text-left p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center mb-4 transition-all">
                  <svg className="w-6 h-6 text-white/50 group-hover:text-white/70 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
                <p className="font-['Sora',sans-serif] font-medium text-white/80 group-hover:text-white transition-colors">Use a Template</p>
                <p className="text-sm text-white/40 mt-1">Pre-built layouts</p>
              </button>

              {/* Generate with AI */}
              <button
                onClick={() => {
                  setModalStep("ai");
                  setIsModalOpen(true);
                }}
                className="group text-left p-6 rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/10 hover:from-amber-500/10 hover:to-orange-500/20 border border-amber-500/10 hover:border-amber-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 group-hover:bg-amber-500/20 flex items-center justify-center mb-4 transition-all">
                  <svg className="w-6 h-6 text-amber-400/70 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </div>
                <p className="font-['Sora',sans-serif] font-medium text-amber-300/90 group-hover:text-amber-300 transition-colors">Generate w/ AI</p>
                <p className="text-sm text-white/40 mt-1">Describe your page</p>
              </button>
            </div>
          </div>

          {/* Your Projects Section */}
          <div className="mb-6">
            <h2 className="font-['Sora',sans-serif] text-xl font-semibold mb-2 text-white/90">Your Projects</h2>
            <p className="text-white/40 text-sm">
              {projects.length === 0
                ? "Create your first high-converting landing page"
                : `${projects.length} project${projects.length !== 1 ? 's' : ''} in your workspace`}
            </p>
          </div>

          {/* Projects Carousel - 3D Cards with Preview */}
          <div className="relative w-full" style={{ perspective: '1200px' }}>
            {/* Drag-scrollable Container */}
            <div
              ref={scrollContainerRef}
              className={`flex space-x-6 overflow-x-auto pt-6 pb-6 scrollbar-hide select-none ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onMouseMove={handleDragMove}
              onMouseLeave={handleDragEnd}
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  className="relative flex-shrink-0 w-[280px] h-[360px] rounded-2xl cursor-pointer group snap-start"
                  style={{ backfaceVisibility: 'hidden' }}
                  whileHover={{
                    y: -12,
                    scale: 1.02,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => router.push(`/editor/${project.id}`)}
                >
                  {/* Shadow layer for 3D depth */}
                  <div className="absolute inset-0 rounded-2xl bg-black/50 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 -z-10 translate-y-4" />

                  {/* TOP HALF - Gradient with Glass Preview Container */}
                  <div className="relative h-[55%] rounded-t-2xl overflow-hidden bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-rose-500/10">
                    {/* Status badge */}
                    <div className="absolute top-3 left-3 z-20">
                      {project.isPublished === "true" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium backdrop-blur-sm border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-black/30 text-white/70 text-xs font-medium backdrop-blur-sm border border-white/10">
                          Draft
                        </span>
                      )}
                    </div>

                    {/* Delete button in top right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(project.id);
                      }}
                      className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/30 hover:bg-red-500/40 text-white/60 hover:text-red-400 transition-all backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>

                    {/* Glass Preview Container */}
                    <div className="absolute inset-3 top-10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg group-hover:scale-[1.02] transition-transform duration-300">
                      <div className="relative w-full h-full overflow-hidden">
                        <iframe
                          src={`/preview/${project.id}`}
                          className="w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none"
                          title={`${project.name} preview`}
                          loading="lazy"
                        />
                        {/* Subtle overlay for polish */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM HALF - Dark Card Content */}
                  <div className="relative h-[45%] rounded-b-2xl overflow-hidden bg-[#141416] p-4 flex flex-col">
                    {/* Tag */}
                    <span className="inline-flex self-start items-center px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs font-medium mb-2">
                      Landing Page
                    </span>

                    {/* Title */}
                    <h3 className="font-['Sora',sans-serif] font-semibold text-white text-base truncate mb-1">
                      {project.name}
                    </h3>

                    {/* Description */}
                    <p className="text-white/40 text-sm line-clamp-2 flex-1">
                      Updated {formatDate(project.updatedAt)}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white">S</span>
                        </div>
                        <span className="text-xs text-white/50">Skinny</span>
                      </div>

                      {/* Arrow button */}
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 group-hover:rotate-[-45deg] transition-all duration-300">
                        <svg className="w-4 h-4 text-white/40 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Empty state - shown when no projects */}
          {projects.length === 0 && (
            <div className="mt-8 flex items-center justify-center p-12 rounded-2xl border border-white/5 bg-white/[0.01]">
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
        </main>

        {/* Create Project Modal */}
        <NewProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleProjectCreated}
          initialStep={modalStep}
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
