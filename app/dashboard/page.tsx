import { getProjects, getDashboardUser } from "@/lib/actions/projects";
import DashboardClient from "./DashboardClient";

// This is a Server Component - data is fetched during SSR when Whop auth headers are available
export default async function DashboardPage() {
  // Fetch user first - creates user in DB if not exists
  // This must run before getProjects() to avoid race condition
  const userData = await getDashboardUser();

  // Now fetch projects - user is guaranteed to exist
  const projects = await getProjects();

  // Pass data to client component as props
  return <DashboardClient initialProjects={projects} initialUser={userData} />;
}
