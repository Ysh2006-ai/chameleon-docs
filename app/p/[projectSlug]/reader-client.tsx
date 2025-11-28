"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Sparkles, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useChameleonTransition } from "@/hooks/use-chameleon";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";

export function ReaderClient({ project, pages, activePage }: { project: any, pages: any[], activePage: any }) {
    // State for AI Content
    const [mode, setMode] = useState<"original" | "reimagined">("original");
    const [reimaginedContent, setReimaginedContent] = useState("");

    // Custom Hook for the "Vibrate -> Blur -> Flip" animation
    const { controls, triggerTransformation, isTransforming } = useChameleonTransition();

    const handleReimagine = async () => {
        // 1. Trigger the visual animation (The "Bliss" Factor)
        triggerTransformation(async () => {

            // If we are already reimagined, just switch back to original instantly
            if (mode === "reimagined") {
                setMode("original");
                return;
            }

            // 2. Prepare for API Call
            setReimaginedContent("");

            try {
                const response = await fetch("/api/reimagine", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content: activePage.content,
                        // Toggle logic: If original is simple, ask for complex, and vice versa. 
                        // For now, let's default to "simple" (ELI5 mode)
                        mode: "simple",
                    }),
                });

                if (!response.ok) throw new Error("Gemini request failed");

                // 3. Handle Streaming Response
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                if (reader) {
                    // Switch mode to show the new content area
                    setMode("reimagined");

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value);
                        setReimaginedContent((prev) => prev + chunk);
                    }
                }
            } catch (err) {
                console.error(err);
                alert("Failed to reimagine content. Check your Google API Key.");
            }
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500" />
                        <span className="font-heading text-xl font-bold tracking-tight">
                            {project.name}
                        </span>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm">Dashboard</Button>
                    </Link>
                </div>
            </nav>

            <div className="container relative flex gap-10 py-10">
                {/* Sidebar */}
                <aside className="hidden w-64 shrink-0 lg:block">
                    <div className="sticky top-28 space-y-8">
                        <div className="space-y-4">
                            <h3 className="font-heading text-sm font-semibold text-muted-foreground">PAGES</h3>
                            <ul className="space-y-2 border-l border-white/10 pl-4">
                                {pages.map(page => (
                                    <Link key={page._id} href={`/p/${project.slug}?page=${page.slug}`}>
                                        <li className={cn(
                                            "text-sm transition-colors cursor-pointer mb-2 block",
                                            page.slug === activePage.slug ? "font-medium text-primary" : "text-muted-foreground hover:text-primary"
                                        )}>
                                            {page.title}
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="flex-1">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <h1 className="font-heading text-4xl font-bold tracking-tight lg:text-5xl">
                            {activePage.title}
                        </h1>

                        {/* The Magic Button */}
                        <Button
                            onClick={handleReimagine}
                            disabled={isTransforming || !activePage.content}
                            className={cn(
                                "group relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg transition-all hover:scale-105 hover:shadow-indigo-500/25",
                                isTransforming && "cursor-not-allowed opacity-80"
                            )}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {mode === "original" ? (
                                    <>
                                        <Sparkles className={cn("h-4 w-4", isTransforming && "animate-spin")} />
                                        Reimagine with Gemini
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="h-4 w-4" />
                                        Show Original
                                    </>
                                )}
                            </span>
                        </Button>
                    </div>

                    {/* Animated Content Container */}
                    <motion.div animate={controls}>
                        <GlassCard className="min-h-[400px] p-8 md:p-12">
                            {mode === "original" ? (
                                /* Original Content */
                                <MarkdownRenderer content={activePage.content || "# No content yet."} />
                            ) : (
                                /* Gemini Content */
                                <div className="relative">
                                    <div className="mb-6 flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 w-fit">
                                        <Sparkles className="h-3 w-3 text-purple-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                                            Simplified by Gemini 1.5
                                        </span>
                                    </div>
                                    <MarkdownRenderer content={reimaginedContent} />

                                    {/* Typing Cursor Effect if content is empty (loading start) */}
                                    {reimaginedContent === "" && (
                                        <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                                            <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                            <span className="text-sm">Gemini is thinking...</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </GlassCard>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}