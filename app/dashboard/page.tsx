import { getUserProjects } from "@/actions/project-actions";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
    const projects = await getUserProjects();
    return <DashboardClient initialProjects={projects} />;
}