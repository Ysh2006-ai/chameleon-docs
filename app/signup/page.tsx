"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/actions/auth-actions";
import { ArrowRight, Layers } from "lucide-react";
import MagneticButton from "@/components/ui/magnetic-button";
import Image from "next/image";

// Google Icon SVG
function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
    );
}

// GitHub Icon SVG
function GitHubIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
    );
}

export default function SignupPage() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);
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

    const handleOAuthSignIn = async (provider: "google" | "github") => {
        setIsOAuthLoading(provider);
        try {
            await signIn(provider, { callbackUrl: "/dashboard" });
        } catch (error) {
            console.error("OAuth sign-in error:", error);
            setIsOAuthLoading(null);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-background text-foreground">
            {/* Left Side - Form */}
            <div className="flex w-full flex-col justify-center px-8 sm:px-12 lg:w-1/2 xl:px-24">
                <div className="mx-auto w-full max-w-sm space-y-8">
                    <div className="space-y-2">
                        <Link href="/" className="font-heading text-xl font-bold tracking-tight">
                            Chameleon
                        </Link>
                        <h1 className="font-heading text-4xl font-medium tracking-tight sm:text-5xl">
                            Create account
                        </h1>
                        <p className="text-muted-foreground">
                            Start building beautiful documentation today.
                        </p>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full h-12 gap-3 text-base font-medium"
                            onClick={() => handleOAuthSignIn("google")}
                            disabled={isOAuthLoading !== null || isLoading}
                        >
                            {isOAuthLoading === "google" ? (
                                <span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                            ) : (
                                <GoogleIcon className="h-5 w-5" />
                            )}
                            Continue with Google
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-12 gap-3 text-base font-medium"
                            onClick={() => handleOAuthSignIn("github")}
                            disabled={isOAuthLoading !== null || isLoading}
                        >
                            {isOAuthLoading === "github" ? (
                                <span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                            ) : (
                                <GitHubIcon className="h-5 w-5" />
                            )}
                            Continue with GitHub
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
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
                        </div>

                        {error && <p className="text-sm text-destructive">{error}</p>}

                        <MagneticButton type="submit" className="w-full" size="lg" disabled={isLoading || isOAuthLoading !== null}>
                            {isLoading ? "Creating..." : "Sign Up"} <ArrowRight className="ml-2 h-4 w-4" />
                        </MagneticButton>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-foreground hover:underline">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Editorial Art */}
            <div className="hidden w-1/2 bg-secondary lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                    alt="Abstract Art"
                    fill
                    className="object-cover grayscale contrast-125"
                    priority
                />
                <div className="absolute bottom-12 left-12 right-12 text-white z-20">
                    <div className="flex items-center gap-2 mb-4">
                        <Layers className="h-5 w-5 text-accent" />
                        <span className="text-sm font-medium tracking-wider uppercase opacity-80">Chameleon Docs (v1 Beta)</span>
                    </div>
                    <blockquote className="font-heading text-3xl font-medium leading-tight">
                        &ldquo;Good design is obvious. Great design is transparent.&rdquo;
                    </blockquote>
                    <cite className="mt-4 block text-sm opacity-60 not-italic">— Joe Sparano</cite>
                </div>
            </div>
        </div>
    );
}