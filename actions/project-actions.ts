"use server";

import { connectToDB } from "@/lib/db";
import Project from "@/models/Project";
import Page from "@/models/Page";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. Create a New Project
export async function createProject(formData: FormData) {
    const name = formData.get("name") as string;
    // Simple slugify logic
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    // In a real app, get this from the session
    const ownerEmail = "demo@user.com";

    try {
        await connectToDB();

        // Check if slug exists
        const existing = await Project.findOne({ slug });
        if (existing) {
            throw new Error("Project with this name already exists");
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
            content: "# Welcome to " + name,
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
    const ownerEmail = "demo@user.com"; // Replace with auth session
    try {
        await connectToDB();
        const projects = await Project.find({ ownerEmail }).sort({ updatedAt: -1 }).lean();

        // Convert _id to string for React serialization
        return projects.map((p: any) => ({
            ...p,
            _id: p._id.toString(),
            createdAt: p.createdAt.toISOString(), // formatting for UI
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