"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SortableSectionProps {
    id: string;
    isExpanded: boolean;
    isDragging: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

export function SortableSection({ 
    id, 
    isExpanded, 
    isDragging,
    onToggle, 
    children 
}: SortableSectionProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isThisDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isThisDragging ? 0.3 : 1,
    };

    // Don't make Uncategorized draggable
    if (id === "Uncategorized") {
        return (
            <div>
                <AnimatePresence initial={false}>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                        >
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div ref={setNodeRef} style={style}>
            <div className="flex items-center gap-1 mb-2">
                {/* Drag handle */}
                <div 
                    {...attributes} 
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-white/10 transition-colors"
                >
                    <GripVertical className="h-3 w-3 text-muted-foreground/50" />
                </div>
                
                {/* Section toggle button */}
                <button 
                    onClick={onToggle}
                    className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground w-full text-left hover:text-foreground transition-colors"
                >
                    {isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                    ) : (
                        <ChevronRight className="h-3 w-3" />
                    )}
                    {id}
                </button>
            </div>
            
            {/* Section content with smooth animation */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
