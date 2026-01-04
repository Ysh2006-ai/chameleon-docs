"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Menu, X, ChevronRight, LayoutDashboard, RefreshCw, RotateCcw, Sparkles, ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePuterAI } from "@/hooks/use-puter-ai";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ChameleonLogo } from "@/components/ChameleonLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReaderClientProps {
  project: any;
  pages: any[];
  activePage: any;
}

const REIMAGINE_MODES = [
  { id: "technical", label: "Technical" },
  { id: "standard", label: "Standard" },
  { id: "simplified", label: "Simplified" },
  { id: "beginner", label: "Beginner" },
  { id: "noob", label: "Like I'm 5" },
];

export function ReaderClient({ project, pages, activePage }: ReaderClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchParams = useSearchParams();
  const currentPageSlug = searchParams.get("page") || pages[0]?.slug;

  const [reimagineMode, setReimagineMode] = useState("standard");
  const [viewMode, setViewMode] = useState<"original" | "reimagined" | "diff">("original");
  const [storedReimaginedContent, setStoredReimaginedContent] = useState<string | null>(null);
  const [isReimagining, setIsReimagining] = useState(false);

  const sidebarRef = useRef<HTMLElement>(null);

  const { reimagine } = usePuterAI();

  /* Load cached AI content */
  useEffect(() => {
    const key = `reimagined-${project.slug}-${activePage.slug}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      setStoredReimaginedContent(cached);
    }
    setViewMode("original");
  }, [project.slug, activePage.slug]);

  /* AI Reimagine */
  const handleReimagine = async () => {
    if (isReimagining) return;

    try {
      setIsReimagining(true);
      const newContent = await reimagine(activePage.content, reimagineMode);
      setStoredReimaginedContent(newContent);
      localStorage.setItem(
        `reimagined-${project.slug}-${activePage.slug}`,
        newContent
      );
      setViewMode("reimagined");
    } catch (err) {
      console.error("AI Reimagination failed", err);
    } finally {
      setIsReimagining(false);
    }
  };

  /* Diff logic (simple line-based) */
  const getDiffContent = () => {
    if (!storedReimaginedContent) return activePage.content;

    const originalLines = activePage.content.split("\n");
    const aiLines = storedReimaginedContent.split("\n");

    return aiLines
      .map((line, i) =>
        line !== originalLines[i]
          ? `> **🟢 Changed:** ${line}`
          : line
      )
      .join("\n");
  };

  const displayContent =
    viewMode === "diff"
      ? getDiffContent()
      : viewMode === "reimagined" && storedReimaginedContent
      ? storedReimaginedContent
      : activePage.content;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r bg-card/80 backdrop-blur transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-6">
            <Link href="/" className="flex items-center gap-2">
              <ChameleonLogo size={24} />
              <span className="font-bold">Chameleon</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {pages.map((page) => {
              const active = currentPageSlug === page.slug;
              return (
                <Link
                  key={page._id}
                  href={`/p/${project.slug}?page=${page.slug}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div
                    className={cn(
                      "rounded-md px-3 py-2 text-sm",
                      active
                        ? "bg-primary/15 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    {page.title}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 bg-background/80 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            {storedReimaginedContent && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setViewMode(viewMode === "reimagined" ? "original" : "reimagined")
                  }
                  disabled={isReimagining}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  {viewMode === "reimagined" ? "Original" : "Reimagined"}
                </Button>

                <Button
                  size="sm"
                  variant={viewMode === "diff" ? "default" : "outline"}
                  onClick={() =>
                    setViewMode(viewMode === "diff" ? "reimagined" : "diff")
                  }
                  disabled={isReimagining}
                >
                  Diff View
                </Button>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" disabled={isReimagining}>
                  {REIMAGINE_MODES.find(m => m.id === reimagineMode)?.label}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {REIMAGINE_MODES.map(mode => (
                  <DropdownMenuItem
                    key={mode.id}
                    onClick={() => setReimagineMode(mode.id)}
                  >
                    {mode.label}
                    {reimagineMode === mode.id && (
                      <Check className="h-3 w-3 ml-auto" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              onClick={handleReimagine}
              disabled={isReimagining}
            >
              {isReimagining ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Reimagine
            </Button>
          </div>
        </header>

        <div className="container max-w-4xl py-12">
          <h1 className="text-4xl font-bold mb-6">{activePage.title}</h1>
          <MarkdownRenderer content={displayContent} />
        </div>
      </main>
    </div>
  );
}
