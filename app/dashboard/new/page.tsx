"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/actions/project-actions";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function onSubmit(formData: FormData) {
        setIsLoading(true);
        const res = await createProject(formData);
        if (res.success && res.slug) {
            router.push(`/dashboard/${res.slug}`);
        } else {
            setIsLoading(false);
            alert(res.error || "Error creating project");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-lg space-y-6">
                <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronLeft className="mr-1 h-4 w-4" /> Back to Dashboard
                </Link>

                <GlassCard className="p-8">
                    <div className="mb-6">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h1 className="font-heading text-2xl font-bold">Create a new project</h1>
                        <p className="text-muted-foreground">
                            Initialize a new documentation hub. It will be private by default.
                        </p>
                    </div>

                    <form action={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Project Name</label>
                            <Input
                                name="name"
                                placeholder="e.g. Acme API V2"
                                required
                                autoFocus
                                className="bg-background/50"
                            />
                            <p className="text-xs text-muted-foreground">
                                This will generate your URL slug automatically.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Button variant="glass" className="w-full" size="lg" disabled={isLoading}>
                                {isLoading ? "Creating..." : "Create Project"}
                            </Button>
                        </div>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
}