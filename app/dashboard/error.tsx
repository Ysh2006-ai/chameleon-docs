"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Page error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <GlassCard className="max-w-md w-full p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
                <p className="text-muted-foreground mb-6">
                    We encountered an error while loading this page.
                </p>
                
                {process.env.NODE_ENV === "development" && (
                    <div className="mb-4 p-3 bg-red-500/10 rounded-lg text-left">
                        <p className="text-xs font-mono text-red-400 break-all">
                            {error.message}
                        </p>
                    </div>
                )}
                
                <div className="flex gap-3 justify-center">
                    <Button onClick={reset} variant="default" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                    <Link href="/dashboard">
                        <Button variant="glass" className="gap-2">
                            <Home className="h-4 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                </div>
            </GlassCard>
        </div>
    );
}
