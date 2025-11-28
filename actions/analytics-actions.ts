"use server";

import { connectToDB } from "@/lib/db";
import Page from "@/models/Page";
import { revalidatePath } from "next/cache";

export async function incrementPageView(pageId: string) {
    try {
        await connectToDB();

        console.log(`[Analytics] Incrementing view for page: ${pageId}`);

        await Page.findByIdAndUpdate(
            pageId,
            { $inc: { views: 1 } },
            { new: true }
        );

        revalidatePath("/dashboard");

    } catch (error) {
        console.error("[Analytics] Failed to track view", error);
    }
}

export async function getProjectAnalytics(projectSlug: string) {
    try {
        await connectToDB();

        const Project = (await import("@/models/Project")).default;
        const project = await Project.findOne({ slug: projectSlug });
        if (!project) return null;

        const pages = await Page.find({ projectId: project._id }).select("title views slug").lean();

        const totalViews = pages.reduce((acc, curr) => acc + (curr.views || 0), 0);

        const topPages = [...pages]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5)
            .map(p => ({
                title: p.title,
                slug: p.slug,
                views: p.views || 0
            }));

        return { totalViews, topPages };
    } catch (error) {
        return null;
    }
}