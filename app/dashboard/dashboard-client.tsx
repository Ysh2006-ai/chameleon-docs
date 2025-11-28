"use client";

import { motion } from "framer-motion";
import { Plus, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { createProject } from "@/actions/project-actions"; // Import the server action
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

// Define the shape based on our Mongoose result
interface ProjectData {
    _id: string;
    name: string;
    slug: string;
    isPublic: boolean;
    createdAt: string;
}

export function DashboardClient({ initialProjects }: { initialProjects: ProjectData[] }) {
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    async function handleCreate(formData: FormData) {
        const res = await createProject(formData);
        if (res.success && res.slug) {
            setIsCreating(false);
            // Next.js revalidatePath in action will refresh data, 
            // but we might want to navigate immediately
            router.push(`/dashboard/${res.slug}`);
        } else {
            alert("Error creating project");
        }
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-6xl space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">Overview of your documentation ecosystem.</p>
                    </div>
                    <Button variant="glass" className="gap-2" onClick={() => setIsCreating(!isCreating)}>
                        <Plus className="h-4 w-4" /> New Project
                    </Button>
                </div>

                {/* Create Project Form (Simple Toggle) */}
                {isCreating && (
                    <GlassCard className="p-6">
                        <form action={handleCreate} className="flex gap-4 items-end">
                            <div className="w-full space-y-2">
                                <label className="text-sm font-medium">Project Name</label>
                                <Input name="name" placeholder="e.g. My Awesome API" required />
                            </div>
                            <Button type="submit" variant="default">Create</Button>
                        </form>
                    </GlassCard>
                )}

                {/* Projects Grid */}
                <div className="space-y-4">
                    <h2 className="font-heading text-xl font-semibold">Your Projects</h2>

                    {initialProjects.length === 0 ? (
                        <div className="text-center py-20 opacity-50">
                            <p>No projects yet. Create one to get started.</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {initialProjects.map((project) => (
                                <motion.div key={project._id} variants={itemVariants}>
                                    <Link href={`/dashboard/${project.slug}`}>
                                        <GlassCard className="group relative h-full cursor-pointer transition-all hover:border-primary/20 hover:bg-white/10">
                                            <div className="mb-4 flex items-start justify-between">
                                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-800 to-black border border-white/10" />
                                                <Badge variant={project.isPublic ? "success" : "glass"}>
                                                    {project.isPublic ? "Public" : "Private"}
                                                </Badge>
                                            </div>

                                            <h3 className="font-heading text-lg font-bold group-hover:text-primary transition-colors">
                                                {project.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">/{project.slug}</p>

                                            <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                                                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                                            </div>

                                            <div className="absolute bottom-6 right-6 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                                                <ArrowRight className="h-5 w-5 text-primary" />
                                            </div>
                                        </GlassCard>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}