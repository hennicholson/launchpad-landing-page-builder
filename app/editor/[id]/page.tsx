import { getProject, getDashboardUser } from "@/lib/actions/projects";
import { redirect } from "next/navigation";
import EditorClient from "./EditorClient";

type Params = { id: string };

// Loading skeleton component
function EditorSkeleton() {
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

// This is a Server Component - data is fetched during SSR when Whop auth headers are available
export default async function EditorPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  // Fetch project and user data during server render - headers are available here
  const [result, userData] = await Promise.all([
    getProject(id),
    getDashboardUser(),
  ]);

  if (!result.success || !result.project) {
    // Redirect to dashboard if project not found or unauthorized
    redirect("/dashboard");
  }

  // Pass project data and user plan to client component as props
  return (
    <EditorClient
      project={result.project}
      userPlan={userData.internal?.plan || "free"}
    />
  );
}
