"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    className={cn(
                        "h-10 w-full appearance-none rounded-lg border border-white/10 bg-black/5 px-3 py-2 pr-8 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </select>
                <div className="pointer-events-none absolute right-3 top-3 text-muted-foreground">
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>
        );
    }
);
Select.displayName = "Select";

export { Select };