import { getProjects, getDashboardUser } from "@/lib/actions/projects";
import MobileCompanionClient from "./MobileCompanionClient";

export default async function MobilePage() {
  const userData = await getDashboardUser();
  const projects = await getProjects();

  return <MobileCompanionClient initialProjects={projects} initialUser={userData} />;
}
