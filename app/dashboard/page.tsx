import { getProjects, getDashboardUser } from "@/lib/actions/projects";
import DashboardClient from "./DashboardClient";

// This is a Server Component - data is fetched during SSR when Whop auth headers are available
export default async function DashboardPage() {
  // Fetch data during server render - headers are available here
  const [projects, userData] = await Promise.all([
    getProjects(),
    getDashboardUser(),
  ]);

  // Pass data to client component as props
  return <DashboardClient initialProjects={projects} initialUser={userData} />;
}
