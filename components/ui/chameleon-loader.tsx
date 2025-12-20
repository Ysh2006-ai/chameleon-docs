"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ChameleonLoaderProps {
    className?: string;
}

// Chameleon color palette - browns/oranges from the logo, cycling bottom to top
const chameleonColors = [
    "#c08b60", // lightest - bottom
    "#a87835",
    "#98601b",
    "#8d510b",
    "#75480b",
    "#653d0d", // darkest - top
];

export function ChameleonLoader({ className }: ChameleonLoaderProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-8", className)}>
            <div className="relative h-32 w-32">
                {/* Base logo */}
                <Image
                    src="/logo.svg"
                    alt="Chameleon"
                    fill
                    className="object-contain"
                    priority
                />
                
                {/* Color overlay animation - sweeps from bottom to top */}
                <motion.div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                        maskImage: "url(/logo.svg)",
                        WebkitMaskImage: "url(/logo.svg)",
                        maskSize: "contain",
                        WebkitMaskSize: "contain",
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                    }}
                >
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to top, ${chameleonColors.join(", ")})`,
                        }}
                        animate={{
                            y: ["100%", "-100%"],
                        }}
                        transition={{
                            duration: 2,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "loop",
                        }}
                    />
                </motion.div>

                {/* Pulse effect */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        maskImage: "url(/logo.svg)",
                        WebkitMaskImage: "url(/logo.svg)",
                        maskSize: "contain",
                        WebkitMaskSize: "contain",
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                    }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        repeat: Infinity,
                    }}
                >
                    <div className="h-full w-full bg-gradient-to-t from-amber-500 via-orange-500 to-amber-700" />
                </motion.div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <motion.p
                    className="font-heading text-lg font-medium text-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Loading...
                </motion.p>
                <motion.div
                    className="h-1 w-24 overflow-hidden rounded-full bg-secondary"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 96 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <motion.div
                        className="h-full"
                        style={{
                            background: `linear-gradient(to right, ${chameleonColors.join(", ")})`,
                        }}
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                </motion.div>
            </div>
        </div>
    );
}
