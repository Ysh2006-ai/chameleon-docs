"use server";

import { connectToDB } from "@/lib/db";
import Page from "@/models/Page";
import PageView from "@/models/PageView";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

/**
 * Track a page view with duplicate prevention
 * - Checks if the same IP has viewed this page in the last 24 hours
 * - If not, increments the view count and logs the view
 * - PageView entries auto-expire after 24 hours via MongoDB TTL index
 */
export async function incrementPageView(pageId: string) {
    try {
        await connectToDB();

        // Get IP address from headers
        const headersList = headers();
        const forwardedFor = headersList.get("x-forwarded-for");
        const realIp = headersList.get("x-real-ip");
        const ipAddress = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
        
        // Get user agent for additional context
        const userAgent = headersList.get("user-agent") || undefined;

        // Check if this IP has viewed this page in the last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const existingView = await PageView.findOne({
            pageId,
            ipAddress,
            createdAt: { $gte: twentyFourHoursAgo }
        });

        // If already viewed within 24 hours, don't count again
        if (existingView) {
            return { counted: false, reason: "duplicate" };
        }

        // Log the new view
        await PageView.create({
            pageId,
            ipAddress,
            userAgent,
            createdAt: new Date()
        });

        // Increment the page view counter
        await Page.findByIdAndUpdate(
            pageId,
            { $inc: { views: 1 } },
            { new: true }
        );

        revalidatePath("/dashboard");

        return { counted: true };
    } catch (error) {
        console.error("[Analytics] Failed to track view", error);
        return { counted: false, reason: "error" };
    }
}

/**
 * Get analytics for a project
 */
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

/**
 * Get recent unique visitors count (last 24 hours)
 */
export async function getRecentVisitors(projectSlug: string) {
    try {
        await connectToDB();

        const Project = (await import("@/models/Project")).default;
        const project = await Project.findOne({ slug: projectSlug });
        if (!project) return 0;

        const pages = await Page.find({ projectId: project._id }).select("_id").lean();
        const pageIds = pages.map(p => p._id);

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Count unique IPs that viewed any page in this project in the last 24 hours
        const uniqueVisitors = await PageView.distinct("ipAddress", {
            pageId: { $in: pageIds },
            createdAt: { $gte: twentyFourHoursAgo }
        });

        return uniqueVisitors.length;
    } catch (error) {
        console.error("[Analytics] Failed to get recent visitors", error);
        return 0;
    }
}

/**
 * Manual cleanup function (optional - TTL index handles this automatically)
 * Can be called via a cron job if needed for immediate cleanup
 */
export async function cleanupOldViews() {
    try {
        await connectToDB();

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        const result = await PageView.deleteMany({
            createdAt: { $lt: twentyFourHoursAgo }
        });

        // Cleanup completed
        return { deleted: result.deletedCount };
    } catch (error) {
        console.error("[Analytics] Failed to cleanup old views", error);
        return { deleted: 0 };
    }
}