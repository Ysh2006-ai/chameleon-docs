"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, FileText, Plus, Edit3, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassTabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { createPage } from "@/actions/page-actions";
import { useRouter } from "next/navigation";

const TABS = [
    { id: "overview", label: "Overview" },
    { id: "docs", label: "Documentation" },
    { id: "settings", label: "Settings" },
];

export function ProjectHubClient({ project, pages }: { project: any, pages: any[] }) {
    const [activeTab, setActiveTab] = useState("docs"); // Default to docs for convenience
    const router = useRouter();

    const handleCreatePage = async () => {
        const title = prompt("Enter page title:"); // Simple prompt for now
        if (!title) return;

        const res = await createPage(project.slug, title);
        if (res.success) {
            router.refresh(); // Refresh to show new page
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-6xl space-y-8">

                {/* Header */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
                            <span>/</span>
                            <span>Projects</span>
                        </div>
                        <h1 className="mt-2 font-heading text-3xl font-bold">{project.name}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={`/p/${project.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                                View Live <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <GlassTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "overview" && (
                            <GlassCard className="p-12 text-center text-muted-foreground">
                                Analytics coming soon to MongoDB.
                            </GlassCard>
                        )}

                        {activeTab === "docs" && (
                            <GlassCard className="overflow-hidden p-0">
                                <div className="flex items-center justify-between border-b border-white/10 p-4">
                                    <h3 className="font-heading text-lg font-semibold">Pages ({pages.length})</h3>
                                    <Button variant="default" size="sm" onClick={handleCreatePage}>
                                        <Plus className="mr-2 h-4 w-4" /> New Page
                                    </Button>
                                </div>
                                <div className="divide-y divide-white/10">
                                    {pages.length === 0 && (
                                        <div className="p-8 text-center text-muted-foreground">No pages yet.</div>
                                    )}
                                    {pages.map((page) => (
                                        <div key={page._id} className="group flex items-center justify-between p-4 transition-colors hover:bg-white/5">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{page.title}</p>
                                                    <p className="text-xs text-muted-foreground">/{page.slug}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant={page.status === "Published" ? "success" : "secondary"}>
                                                    {page.status}
                                                </Badge>
                                                <Link href={`/dashboard/${project.slug}/editor?page=${page.slug}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit3 className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        )}

                        {activeTab === "settings" && (
                            <GlassCard className="p-12 text-center text-muted-foreground">
                                Settings coming soon.
                            </GlassCard>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}