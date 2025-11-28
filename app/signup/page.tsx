"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/actions/auth-actions";

export default function SignupPage() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError("");

        const res = await registerUser(formData);

        if (res.error) {
            setError(res.error);
            setIsLoading(false);
        } else {
            router.push("/login");
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
            <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
            <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-indigo-500/10 blur-[100px]" />

            <GlassCard className="w-full max-w-md p-8 backdrop-blur-2xl">
                <div className="mb-8 text-center">
                    <h1 className="font-heading text-3xl font-bold">Create an account</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Start building beautiful documentation today.
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</label>
                        <Input name="name" placeholder="Jane Doe" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
                        <Input name="email" type="email" placeholder="jane@example.com" required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</label>
                        <Input name="password" type="password" placeholder="••••••••" required />
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button variant="glass" className="w-full mt-2" size="lg" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Sign Up"}
                    </Button>
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