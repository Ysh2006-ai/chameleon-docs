import { getProjectDetails } from "@/actions/project-actions";
import { getProjectPages, getPageContent } from "@/actions/page-actions";
import { notFound } from "next/navigation";
import { ReaderClient } from "./reader-client"; // We'll move the UI here

export default async function ReaderPage({
    params,
    searchParams
}: {
    params: { projectSlug: string },
    searchParams: { page?: string }
}) {
    const project = await getProjectDetails(params.projectSlug);
    if (!project) return notFound();

    const pages = await getProjectPages(params.projectSlug);

    // Determine which page to show
    const targetPageSlug = searchParams.page || pages[0]?.slug;
    const pageContent = await getPageContent(params.projectSlug, targetPageSlug);

    if (!pageContent) return notFound();

    return (
        <ReaderClient
            project={project}
            pages={pages}
            activePage={pageContent}
        />
    );
}