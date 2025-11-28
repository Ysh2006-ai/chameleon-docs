import { notFound } from "next/navigation";
import { getProjectDetails } from "@/actions/project-actions";
import { getProjectPages } from "@/actions/page-actions";
import { getProjectAnalytics } from "@/actions/analytics-actions";
import { ProjectHubClient } from "./project-hub-client";

export default async function ProjectHubPage({ params }: { params: { projectSlug: string } }) {
    const [project, pages, analytics] = await Promise.all([
        getProjectDetails(params.projectSlug),
        getProjectPages(params.projectSlug),
        getProjectAnalytics(params.projectSlug)
    ]);

    if (!project) return notFound();

    return <ProjectHubClient project={project} pages={pages} analytics={analytics} />;
}