import { getUserProjects } from "@/actions/project-actions";
import { DashboardClient } from "./dashboard-client"; // We will move client logic here

export default async function DashboardPage() {
    // Fetch data directly on the server
    const projects = await getUserProjects();

    // Pass data to a client component to handle animations/interactions
    return <DashboardClient initialProjects={projects} />;
}