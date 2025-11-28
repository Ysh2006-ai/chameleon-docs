import { getProjectPages, getPageContent } from "@/actions/page-actions";
import { EditorClient } from "./editor-client";
import { notFound } from "next/navigation";

export default async function EditorPage({
    params,
    searchParams
}: {
    params: { projectSlug: string },
    searchParams: { page?: string }
}) {
    const pages = await getProjectPages(params.projectSlug);

    // Default to first page if no param provided
    const targetPageSlug = searchParams.page || pages[0]?.slug;

    if (!targetPageSlug) {
        // Logic for empty project (no pages)
        return <div>Please create a page in the dashboard first.</div>;
    }

    const pageContent = await getPageContent(params.projectSlug, targetPageSlug);

    if (!pageContent) return notFound();

    return (
        <EditorClient
            projectSlug={params.projectSlug}
            pages={pages}
            activePage={pageContent}
        />
    );
}