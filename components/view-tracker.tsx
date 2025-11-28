"use client";

import { useEffect, useRef } from "react";
import { incrementPageView } from "@/actions/analytics-actions";

export function ViewTracker({ pageId }: { pageId: string }) {
    const hasTracked = useRef(false);

    useEffect(() => {
        // Prevent double-tracking in React Strict Mode
        if (!hasTracked.current && pageId) {
            incrementPageView(pageId);
            hasTracked.current = true;
        }
    }, [pageId]);

    return null;
}