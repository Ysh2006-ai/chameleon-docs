"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background text-foreground">
            {/* Abstract Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <GlassCard className="relative z-10 max-w-lg text-center p-12 backdrop-blur-2xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="font-heading text-9xl font-bold text-primary/20">404</h1>
                    <h2 className="mt-4 font-heading text-3xl font-bold">Page not found</h2>
                    <p className="mt-4 text-muted-foreground">
                        It seems you have wandered into the void. The page you are looking for
                        has either been moved or does not exist.
                    </p>

                    <div className="mt-8 flex justify-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="default" size="lg">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Return Home
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </GlassCard>
        </div>
    );
}