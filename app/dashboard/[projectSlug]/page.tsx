import { getProjectDetails } from "@/actions/project-actions";
import { getProjectPages } from "@/actions/page-actions";
import { ProjectHubClient } from "./project-hub-client";
import { notFound } from "next/navigation";

export default async function ProjectHubPage({ params }: { params: { projectSlug: string } }) {
    // Parallel data fetching
    const [project, pages] = await Promise.all([
        getProjectDetails(params.projectSlug),
        getProjectPages(params.projectSlug)
    ]);

    if (!project) return notFound();

    return <ProjectHubClient project={project} pages={pages} />;
}