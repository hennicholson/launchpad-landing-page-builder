import { getProject, getDashboardUser } from "@/lib/actions/projects";
import { redirect } from "next/navigation";
import SubmissionsDashboard from "./SubmissionsDashboard";

type Params = { id: string };

export default async function SubmissionsPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const [result, userData] = await Promise.all([
    getProject(id),
    getDashboardUser(),
  ]);

  if (!result.success || !result.project) {
    redirect("/dashboard");
  }

  return (
    <SubmissionsDashboard
      projectId={id}
      projectName={result.project.name}
      userPlan={userData.internal?.plan || "free"}
    />
  );
}
