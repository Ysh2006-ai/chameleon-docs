"use client";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function LoginPage() {
    const router = useRouter();

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
            {/* Ambient Background Gradients */}
            <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-purple-500/20 blur-[120px]" />
            <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-[120px]" />

            <GlassCard className="w-full max-w-md p-8" gradient>
                <div className="mb-8 text-center">
                    <h1 className="font-heading text-3xl font-bold">Welcome Back</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your credentials to access your workspace.
                    </p>
                </div>

                <form className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Email
                        </label>
                        <input
                            className="w-full rounded-lg border border-white/10 bg-black/5 p-3 text-sm outline-none ring-offset-background transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-white/5"
                            placeholder="you@example.com"
                            type="email"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Password
                        </label>
                        <input
                            className="w-full rounded-lg border border-white/10 bg-black/5 p-3 text-sm outline-none ring-offset-background transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:bg-white/5"
                            placeholder="••••••••"
                            type="password"
                        />
                    </div>

                    <Button
                        variant="glass"
                        className="w-full"
                        size="lg"
                        onClick={(e) => {
                            e.preventDefault();
                            router.push("/dashboard");
                        }}
                    >
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="font-medium text-primary hover:underline">
                        Create one
                    </Link>
                </div>
            </GlassCard>
        </div>
    );
}