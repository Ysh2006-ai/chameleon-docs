"use client";

import React, { useState, useEffect, useRef } from "react";
import { Save, ChevronLeft, Check, Settings, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { MagicToolbar } from "@/components/editor/magic-toolbar";
import { updatePageContent } from "@/actions/page-actions";
import { cn } from "@/lib/utils";

interface EditorClientProps {
    projectSlug: string;
    pages: any[];
    activePage: {
        _id: string;
        title: string;
        content: string;
        slug: string;
    };
}

export function EditorClient({ projectSlug, pages, activePage }: EditorClientProps) {
    const [content, setContent] = useState(activePage.content);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(false);

    // Toolbar State
    const [toolbarVisible, setToolbarVisible] = useState(false);
    const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });

    const router = useRouter();
    const editorRef = useRef<HTMLTextAreaElement>(null);

    // Reset state when switching pages
    useEffect(() => {
        setContent(activePage.content);
        setLastSaved(false);
    }, [activePage]);

    // Handle Text Selection to show Toolbar
    const handleSelect = () => {
        const selection = window.getSelection();
        // Only show if selection is inside our textarea (approximated here by focus)
        if (!selection || selection.isCollapsed || document.activeElement !== editorRef.current) {
            setToolbarVisible(false);
            return;
        }

        // In a real textarea, getting exact coordinates of selection is hard. 
        // We approximate or use a library like 'textarea-caret' in production.
        // For this blueprint, we center it above the cursor roughly.
        setToolbarVisible(true);
        // Note: Actual positioning logic for textarea is complex; simplified here:
        const rect = editorRef.current?.getBoundingClientRect();
        if (rect) {
            setToolbarPos({ top: rect.top + 100, left: rect.left + 100 });
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        const res = await updatePageContent(activePage._id, content);
        setIsSaving(false);

        if (res.success) {
            setLastSaved(true);
            setTimeout(() => setLastSaved(false), 2000);
        } else {
            alert("Failed to save");
        }
    };

    // Keyboard shortcut for save
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "s") {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [content]);

    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Header */}
            <header className="flex h-14 items-center justify-between border-b border-white/10 bg-background/50 px-4 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/${projectSlug}`}>
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">{projectSlug} /</span>
                        <span className="text-sm font-bold">{activePage.title}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="glass"
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className={cn(lastSaved && "border-green-500/50 text-green-500")}
                    >
                        {isSaving ? "Saving..." : lastSaved ? <><Check className="mr-2 h-4 w-4" /> Saved</> : <><Save className="mr-2 h-4 w-4" /> Save</>}
                    </Button>
                    <Link href={`/p/${projectSlug}?page=${activePage.slug}`} target="_blank">
                        <Button variant="default" size="sm">
                            <MonitorPlay className="mr-2 h-4 w-4" /> View Live
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="hidden w-64 border-r border-white/10 bg-black/5 p-4 lg:block overflow-y-auto">
                    <div className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Pages
                    </div>
                    <nav className="space-y-1">
                        {pages.map((page) => (
                            <div
                                key={page._id}
                                onClick={() => router.push(`?page=${page.slug}`)}
                                className={cn(
                                    "cursor-pointer rounded-md px-3 py-2 text-sm transition-colors",
                                    page.slug === activePage.slug
                                        ? "bg-white/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-primary"
                                )}
                            >
                                {page.title}
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Canvas */}
                <main className="relative flex-1 overflow-y-auto p-8 lg:p-12">
                    <div className="mx-auto max-w-3xl">
                        <h1 className="mb-8 w-full bg-transparent font-heading text-4xl font-bold text-foreground outline-none">
                            {activePage.title}
                        </h1>

                        <GlassCard className="min-h-[600px] p-0" gradient={false}>
                            <textarea
                                ref={editorRef}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onSelect={handleSelect}
                                className="h-full min-h-[600px] w-full resize-none bg-transparent p-8 font-mono text-base leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/30"
                                spellCheck={false}
                                placeholder="# Start writing with Markdown..."
                            />
                        </GlassCard>

                        <MagicToolbar
                            isVisible={toolbarVisible}
                            position={toolbarPos}
                            onAction={(id) => console.log("Tool clicked:", id)}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}