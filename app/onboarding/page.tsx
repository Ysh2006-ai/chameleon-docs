"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const STEPS = [
    { id: 1, title: "Name your workspace" },
    { id: 2, title: "Choose your role" },
    { id: 3, title: "All set!" },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [workspaceName, setWorkspaceName] = useState("");
    const progress = (step / STEPS.length) * 100;

    const handleNext = () => {
        if (step < STEPS.length) {
            setStep(step + 1);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">

                {/* Progress Header */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        <span>Step {step} of {STEPS.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                </div>

                <GlassCard className="p-8">
                    <AnimatePresence mode="wait">

                        {/* Step 1: Workspace Name */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h2 className="font-heading text-2xl font-bold">Let's start with a name.</h2>
                                    <p className="text-muted-foreground">What should we call your documentation hub?</p>
                                </div>
                                <Input
                                    placeholder="e.g. Acme Corp Docs"
                                    value={workspaceName}
                                    onChange={(e) => setWorkspaceName(e.target.value)}
                                    autoFocus
                                />
                            </motion.div>
                        )}

                        {/* Step 2: Role Selection */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h2 className="font-heading text-2xl font-bold">How will you use Chameleon?</h2>
                                    <p className="text-muted-foreground">This helps us customize your experience.</p>
                                </div>
                                <div className="grid gap-3">
                                    {["Software Engineer", "Product Manager", "Technical Writer"].map((role) => (
                                        <button
                                            key={role}
                                            onClick={handleNext}
                                            className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 text-left text-sm transition-all hover:border-primary hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Success */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center space-y-6 text-center"
                            >
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                                    <Check className="h-10 w-10" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="font-heading text-2xl font-bold">You are ready to go!</h2>
                                    <p className="text-muted-foreground">Preparing your dashboard...</p>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>

                    {/* Footer Actions */}
                    <div className="mt-8 flex justify-end">
                        <Button onClick={handleNext} variant="default" className="w-full sm:w-auto">
                            {step === 3 ? "Enter Dashboard" : "Continue"}
                            {step !== 3 && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}