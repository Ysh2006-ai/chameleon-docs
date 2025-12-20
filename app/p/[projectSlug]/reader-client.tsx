"use client";

import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    ChevronRight,
    Menu,
    X,
    Settings2,
    Sparkles,
    ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ViewTracker } from "@/components/view-tracker";
import { cn } from "@/lib/utils";

interface PageData {
    _id: string;
    title: string;
    slug: string;
    status: string;
    section?: string;
    updatedAt: string;
}

interface ActivePageData {
    _id: string;
    title: string;
    slug: string;
    content: string;
    section?: string;
    isPublished: boolean;
}

interface ProjectData {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    ownerEmail: string;
    isPublic: boolean;
    emoji?: string;
    theme: {
        color: string;
        font: string;
    };
}

interface ReaderClientProps {
    project: ProjectData;
    pages: PageData[];
    activePage: ActivePageData;
}

// Custom smooth scroll for the content
function useSmoothScroll(ref: React.RefObject<HTMLElement | null>) {
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let targetScroll = element.scrollTop;
        let currentScroll = element.scrollTop;
        let animationId: number | null = null;
        const ease = 0.1;

        const animate = () => {
            const diff = targetScroll - currentScroll;

            if (Math.abs(diff) > 0.5) {
                currentScroll += diff * ease;
                element.scrollTop = currentScroll;
                animationId = requestAnimationFrame(animate);
            } else {
                currentScroll = targetScroll;
                element.scrollTop = targetScroll;
                animationId = null;
            }
        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const maxScroll = element.scrollHeight - element.clientHeight;
            targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + e.deltaY));
            if (!animationId) {
                animationId = requestAnimationFrame(animate);
            }
        };

        element.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            element.removeEventListener('wheel', handleWheel);
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, [ref]);
}

export function ReaderClient({ project, pages, activePage }: ReaderClientProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [reimaginedContent, setReimaginedContent] = useState<string | null>(null);
    const [isReimaging, setIsReimaging] = useState(false);
    const [simplificationLevel, setSimplificationLevel] = useState<string>("standard");
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const contentRef = useRef<HTMLDivElement>(null);

    // Apply smooth scrolling
    useSmoothScroll(contentRef);

    // Group pages by section - memoized
    const groupedPages = useMemo(() => {
        // Only show published pages in the reader
        const publishedPages = pages.filter(p => p.status === "Published");
        return publishedPages.reduce((acc: Record<string, PageData[]>, page) => {
            const section = page.section || "Uncategorized";
            if (!acc[section]) acc[section] = [];
            acc[section].push(page);
            return acc;
        }, {});
    }, [pages]);

    const sections = useMemo(() => {
        return Object.keys(groupedPages).sort((a, b) =>
            a === "Uncategorized" ? -1 : b === "Uncategorized" ? 1 : a.localeCompare(b)
        );
    }, [groupedPages]);

    // Initialize expanded sections
    useEffect(() => {
        const initial: Record<string, boolean> = {};
        sections.forEach(s => initial[s] = true);
        setExpandedSections(initial);
    }, [sections]);

    const toggleSection = useCallback((sec: string) => {
        setExpandedSections(prev => ({ ...prev, [sec]: !prev[sec] }));
    }, []);

    // Handle page navigation
    const handlePageClick = useCallback((pageSlug: string) => {
        router.push(`/p/${project.slug}?page=${pageSlug}`);
        setSidebarOpen(false);
        setReimaginedContent(null); // Reset when switching pages
    }, [router, project.slug]);

    // Reimagine content with AI
    const handleReimagine = async (level: string) => {
        setIsReimaging(true);
        setSimplificationLevel(level);

        try {
            const response = await fetch("/api/reimagine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: activePage.content,
                    simplificationLevel: level,
                }),
            });

            if (!response.ok) throw new Error("Failed to reimagine");

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let result = "";

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    result += decoder.decode(value);
                    setReimaginedContent(result);
                }
            }
        } catch (error) {
            console.error("Reimagine error:", error);
        } finally {
            setIsReimaging(false);
        }
    };

    // Reset to original content
    const handleResetContent = () => {
        setReimaginedContent(null);
        setSimplificationLevel("standard");
    };

    // Scroll to top when page changes
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [activePage._id]);

    const displayContent = reimaginedContent || activePage.content;

    return (
        <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
            {/* Track page view */}
            <ViewTracker pageId={activePage._id} />

            {/* Header */}
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-background/80 px-4 backdrop-blur-xl z-50">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                    <Link href={`/p/${project.slug}`} className="flex items-center gap-2">
                        <span
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
                            style={{
                                background: `linear-gradient(135deg, ${project.theme.color}, ${project.theme.color}88)`,
                            }}
                        >
                            {project.emoji || "📚"}
                        </span>
                        <span className="font-heading font-bold">{project.name}</span>
                    </Link>
                </div>

                {/* AI Reimagine Controls */}
                <div className="flex items-center gap-2">
                    {reimaginedContent && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetContent}
                            className="text-xs"
                        >
                            Show Original
                        </Button>
                    )}
                    <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg p-1">
                        {["technical", "standard", "simplified", "beginner", "noob"].map((level) => (
                            <Button
                                key={level}
                                variant={simplificationLevel === level ? "default" : "ghost"}
                                size="sm"
                                onClick={() => handleReimagine(level)}
                                disabled={isReimaging}
                                className="text-xs capitalize"
                            >
                                {level}
                            </Button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 min-h-0 overflow-hidden">
                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <aside
                    className={cn(
                        "fixed inset-y-0 left-0 z-40 w-64 transform bg-background border-r border-white/10 transition-transform duration-300 lg:relative lg:translate-x-0",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    )}
                    style={{ top: "3.5rem" }}
                >
                    <div className="h-full overflow-y-auto p-4">
                        <nav className="space-y-4">
                            {sections.map((sec) => (
                                <div key={sec}>
                                    {sec !== "Uncategorized" && (
                                        <button
                                            onClick={() => toggleSection(sec)}
                                            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 w-full text-left hover:text-foreground transition-colors"
                                        >
                                            {expandedSections[sec] ? (
                                                <ChevronDown className="h-3 w-3" />
                                            ) : (
                                                <ChevronRight className="h-3 w-3" />
                                            )}
                                            {sec}
                                        </button>
                                    )}
                                    {(sec === "Uncategorized" || expandedSections[sec]) && (
                                        <div className="space-y-1 pl-2 border-l border-white/10 ml-1">
                                            {groupedPages[sec].map((page) => (
                                                <button
                                                    key={page._id}
                                                    onClick={() => handlePageClick(page.slug)}
                                                    className={cn(
                                                        "w-full text-left rounded-r-md px-3 py-1.5 text-sm truncate transition-colors",
                                                        page.slug === activePage.slug
                                                            ? "bg-primary/10 text-primary font-medium border-l-2 border-primary -ml-[1px]"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                                    )}
                                                >
                                                    {page.title}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main
                    ref={contentRef}
                    className="flex-1 overflow-y-auto"
                    data-lenis-prevent
                >
                    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
                        {/* AI Status Indicator */}
                        {isReimaging && (
                            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                                <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                                <span>Reimagining content...</span>
                            </div>
                        )}

                        {reimaginedContent && !isReimaging && (
                            <div className="mb-6 flex items-center gap-2">
                                <GlassCard className="inline-flex items-center gap-2 px-3 py-1.5 text-xs">
                                    <Sparkles className="h-3 w-3 text-primary" />
                                    <span>Viewing {simplificationLevel} version</span>
                                </GlassCard>
                            </div>
                        )}

                        {/* Page Title */}
                        <h1 className="font-heading text-4xl font-bold tracking-tight mb-8 lg:text-5xl">
                            {activePage.title}
                        </h1>

                        {/* Markdown Content */}
                        <MarkdownRenderer content={displayContent} />

                        {/* Footer Navigation */}
                        <div className="mt-16 pt-8 border-t border-white/10">
                            <div className="flex justify-between items-center">
                                {/* Previous Page */}
                                {getPreviousPage(pages, activePage.slug) && (
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            handlePageClick(getPreviousPage(pages, activePage.slug)!.slug)
                                        }
                                    >
                                        ← {getPreviousPage(pages, activePage.slug)!.title}
                                    </Button>
                                )}
                                <div />
                                {/* Next Page */}
                                {getNextPage(pages, activePage.slug) && (
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            handlePageClick(getNextPage(pages, activePage.slug)!.slug)
                                        }
                                    >
                                        {getNextPage(pages, activePage.slug)!.title} →
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Helper functions for navigation
function getPreviousPage(pages: PageData[], currentSlug: string): PageData | null {
    const publishedPages = pages.filter(p => p.status === "Published");
    const currentIndex = publishedPages.findIndex((p) => p.slug === currentSlug);
    return currentIndex > 0 ? publishedPages[currentIndex - 1] : null;
}

function getNextPage(pages: PageData[], currentSlug: string): PageData | null {
    const publishedPages = pages.filter(p => p.status === "Published");
    const currentIndex = publishedPages.findIndex((p) => p.slug === currentSlug);
    return currentIndex < publishedPages.length - 1 ? publishedPages[currentIndex + 1] : null;
}
