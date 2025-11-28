import { notFound } from "next/navigation";
import { getProjectPages, getPageContent } from "@/actions/page-actions";
import { EditorClient } from "./editor-client";

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
        return (
            <div className="flex h-screen items-center justify-center text-muted-foreground">
                Please create a page in the dashboard first.
            </div>
        );
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