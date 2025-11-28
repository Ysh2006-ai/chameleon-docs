"use server";

import { connectToDB } from "@/lib/db";
import Project from "@/models/Project";
import Page from "@/models/Page";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. Create a New Project
export async function createProject(formData: FormData) {
    const session = await auth();
    if (!session || !session.user?.email) {
        return { success: false, error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    // Simple slugify logic
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const ownerEmail = session.user.email;

    try {
        await connectToDB();

        // Check if slug exists
        const existing = await Project.findOne({ slug });
        if (existing) {
            // In production, you might append a random string here
            return { success: false, error: "Project name already exists" };
        }

        const newProject = await Project.create({
            name,
            slug,
            ownerEmail,
        });

        // Create a default "Introduction" page
        await Page.create({
            projectId: newProject._id,
            title: "Introduction",
            slug: "introduction",
            content: "# Welcome to " + name + "\n\nStart writing your documentation here.",
            isPublished: true,
            order: 0,
        });

        revalidatePath("/dashboard");
        return { success: true, slug: newProject.slug };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create project" };
    }
}

// 2. Fetch Projects for Dashboard
export async function getUserProjects() {
    const session = await auth();
    if (!session || !session.user?.email) return [];

    try {
        await connectToDB();
        const projects = await Project.find({ ownerEmail: session.user.email })
            .sort({ updatedAt: -1 })
            .lean();

        return projects.map((p: any) => ({
            ...p,
            _id: p._id.toString(),
            createdAt: p.createdAt.toISOString(),
        }));
    } catch (error) {
        return [];
    }
}

// 3. Fetch Single Project Details
export async function getProjectDetails(slug: string) {
    try {
        await connectToDB();
        const project = await Project.findOne({ slug }).lean();
        if (!project) return null;

        return {
            ...project,
            _id: project._id.toString(),
        };
    } catch (error) {
        return null;
    }
}

// 4. Update Project Settings (Theme & Visibility)
export async function updateProjectSettings(
    projectSlug: string,
    settings: { color: string; font: string; isPublic: boolean }
) {
    try {
        const session = await auth();
        if (!session?.user?.email) return { error: "Unauthorized" };

        await connectToDB();

        const project = await Project.findOne({ slug: projectSlug, ownerEmail: session.user.email });

        if (!project) return { error: "Project not found" };

        project.theme.color = settings.color;
        project.theme.font = settings.font;
        project.isPublic = settings.isPublic;

        await project.save();

        revalidatePath(`/dashboard/${projectSlug}`);
        revalidatePath(`/p/${projectSlug}`);

        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "Failed to update settings" };
    }
}