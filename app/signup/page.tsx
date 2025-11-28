"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
            {/* Background Gradients */}
            <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
            <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-indigo-500/10 blur-[100px]" />

            <GlassCard className="w-full max-w-md p-8 backdrop-blur-2xl">
                <div className="mb-8 text-center">
                    <h1 className="font-heading text-3xl font-bold">Create an account</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Start building beautiful documentation today.
                    </p>
                </div>

                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">First Name</label>
                            <Input placeholder="Jane" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Last Name</label>
                            <Input placeholder="Doe" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
                        <Input type="email" placeholder="jane@example.com" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</label>
                        <Input type="password" placeholder="••••••••" />
                    </div>

                    <Link href="/onboarding" className="block w-full">
                        <Button variant="glass" className="w-full mt-2" size="lg">
                            Sign Up
                        </Button>
                    </Link>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-primary hover:underline">
                        Log in
                    </Link>
                </div>
            </GlassCard>
        </div>
    );
}