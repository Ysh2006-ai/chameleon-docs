"use client";

import { useFormState } from "react-dom";
import { authenticate } from "@/actions/login-action";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
    // @ts-ignore - Types for useFormState in Next.js 14 can be strict regarding initial state
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
            <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-purple-500/20 blur-[120px]" />
            <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-[120px]" />

            <GlassCard className="w-full max-w-md p-8" gradient>
                <div className="mb-8 text-center">
                    <h1 className="font-heading text-3xl font-bold">Welcome Back</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your credentials to access your workspace.
                    </p>
                </div>

                <form action={dispatch} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Email
                        </label>
                        <Input name="email" type="email" placeholder="you@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Password
                        </label>
                        <Input name="password" type="password" placeholder="••••••••" required />
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-500 text-center">{errorMessage}</p>
                    )}

                    <Button variant="glass" className="w-full" size="lg">
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