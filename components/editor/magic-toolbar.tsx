import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { EDITOR_TOOLS } from "@/config/editor.config";
import { cn } from "@/lib/utils";

interface MagicToolbarProps {
    isVisible: boolean;
    position: { top: number; left: number };
    onAction: (actionId: string) => void;
}

export const MagicToolbar: React.FC<MagicToolbarProps> = ({
    isVisible,
    position,
    onAction
}) => {
    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ top: position.top - 60, left: position.left }}
            className="absolute z-50 flex items-center gap-1 rounded-xl border border-white/10 bg-black/80 p-1.5 shadow-2xl backdrop-blur-xl"
        >
            {EDITOR_TOOLS.map((group, i) => (
                <div key={group.id} className="flex items-center gap-1 border-r border-white/10 px-1 last:border-0">
                    {group.items.map((tool) => (
                        <Button
                            key={tool.id}
                            variant="ghost"
                            size="icon"
                            onClick={() => onAction(tool.id)}
                            className={cn(
                                "h-8 w-8 text-white/70 hover:bg-white/20 hover:text-white",
                                tool.color // Apply custom color if defined (e.g., for Magic button)
                            )}
                            title={tool.label}
                        >
                            <tool.icon className="h-4 w-4" />
                        </Button>
                    ))}
                </div>
            ))}
        </motion.div>
    );
};