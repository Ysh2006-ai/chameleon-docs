"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service in production
        console.error("Application error:", error);
    }, [error]);

    return (
        <html>
            <body className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
                <GlassCard className="max-w-md w-full p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>
                    </div>
                    
                    <h1 className="text-2xl font-bold mb-2">Something went wrong!</h1>
                    <p className="text-muted-foreground mb-6">
                        We apologize for the inconvenience. An unexpected error occurred.
                    </p>
                    
                    {error.digest && (
                        <p className="text-xs text-muted-foreground mb-4 font-mono">
                            Error ID: {error.digest}
                        </p>
                    )}
                    
                    <div className="flex gap-3 justify-center">
                        <Button onClick={reset} variant="default" className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Try Again
                        </Button>
                        <Link href="/">
                            <Button variant="glass" className="gap-2">
                                <Home className="h-4 w-4" />
                                Go Home
                            </Button>
                        </Link>
                    </div>
                </GlassCard>
            </body>
        </html>
    );
}
