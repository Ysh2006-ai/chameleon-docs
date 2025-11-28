"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Sparkles, RefreshCw, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useChameleonTransition } from "@/hooks/use-chameleon";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ViewTracker } from "@/components/view-tracker";

export function ReaderClient({ project, pages, activePage }: { project: any, pages: any[], activePage: any }) {
    // State for AI Content
    const [mode, setMode] = useState<"original" | "reimagined">("original");
    const [reimaginedContent, setReimaginedContent] = useState("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Custom Hook for the "Vibrate -> Blur -> Flip" animation
    const { controls, triggerTransformation, isTransforming } = useChameleonTransition();

    const handleReimagine = async () => {
        triggerTransformation(async () => {
            if (mode === "reimagined") {
                setMode("original");
                return;
            }
            setReimaginedContent("");

            try {
                const response = await fetch("/api/reimagine", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content: activePage.content,
                        mode: "simple",
                    }),
                });

                if (!response.ok) throw new Error("Gemini request failed");

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                if (reader) {
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
                alert("Failed to reimagine content. Check your API Key.");
            }
        });
    };

    // Theme Application
    const themeClass = `theme-${project.theme?.color || 'indigo'}`;
    const fontClass = project.theme?.font === 'Space Grotesk' ? 'font-heading' : 'font-sans';

    return (
        <div className={cn("min-h-screen bg-background text-foreground", themeClass, fontClass)}>
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-xl">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </Button>
                        <div className="h-8 w-8 rounded-lg bg-primary" />
                        <span className="font-heading text-xl font-bold tracking-tight">
                            {project.name}
                        </span>
                    </div>
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm">Dashboard</Button>
                    </Link>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden p-8 pt-24"
                    >
                        <h3 className="font-heading text-sm font-semibold text-muted-foreground mb-4">PAGES</h3>
                        <ul className="space-y-4">
                            {pages.map(page => (
                                <Link key={page._id} href={`/p/${project.slug}?page=${page.slug}`} onClick={() => setIsMobileMenuOpen(false)}>
                                    <li className={cn(
                                        "text-lg transition-colors cursor-pointer",
                                        page.slug === activePage.slug ? "font-bold text-primary" : "text-muted-foreground"
                                    )}>
                                        {page.title}
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container relative flex gap-10 py-10">
                {/* Sidebar (Desktop) */}
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
                <main className="flex-1 min-w-0">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <h1 className="font-heading text-4xl font-bold tracking-tight lg:text-5xl">
                            {activePage.title}
                        </h1>

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

                    <motion.div animate={controls}>
                        <GlassCard className="min-h-[400px] p-8 md:p-12">
                            {mode === "original" ? (
                                <MarkdownRenderer content={activePage.content || "# No content yet."} />
                            ) : (
                                <div className="relative">
                                    <div className="mb-6 flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 w-fit">
                                        <Sparkles className="h-3 w-3 text-purple-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                                            Simplified by Gemini 1.5
                                        </span>
                                    </div>
                                    <MarkdownRenderer content={reimaginedContent} />

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

                    <ViewTracker pageId={activePage._id} />
                </main>
            </div>
        </div>
    );
}