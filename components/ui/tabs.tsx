"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
    id: string;
    label: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

export function GlassTabs({ tabs, activeTab, onChange, className }: TabsProps) {
    return (
        <div className={cn("flex space-x-1 rounded-xl bg-black/5 p-1 dark:bg-white/5", className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={cn(
                        "relative px-4 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2",
                        activeTab === tab.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="active-tab-indicator"
                            className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-white/10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                </button>
            ))}
        </div>
    );
}