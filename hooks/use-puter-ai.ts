"use client";

/**
 * Hook for using PuterJS AI chat functionality
 * Uses model: google/gemini-3-flash-preview
 */

import { useState, useCallback, useRef } from "react";

// Simplification level prompts - same as server-side but now client-side
const SIMPLIFICATION_PROMPTS: Record<string, string> = {
    technical: `
You are a senior principal engineer.
Rewrite the following documentation to be highly technical and rigorous.
Focus on precise terminology, implementation specifics, and edge cases.
Maintain professional tone. No analogies or simplified explanations.
Keep the formatting (Markdown) clean.
Only return the modified text, no explanations.
`,
    standard: `
You are a documentation editor.
Make minimal rephrasing to the following documentation for improved clarity.
Preserve the original meaning and technical accuracy.
Only fix grammar issues or slightly awkward phrasing.
Maintain professional tone.
Keep the formatting (Markdown) clean.
Only return the modified text, no explanations.
`,
    simplified: `
You are a technical writer.
Rewrite the following documentation with clearer, more accessible language.
Reduce jargon where possible without losing accuracy.
Keep explanations direct and professional.
Maintain the same information depth but improve readability.
Keep the formatting (Markdown) clean.
Only return the modified text, no explanations.
`,
    beginner: `
You are a technical educator.
Rewrite the following documentation for someone with basic technical knowledge.
Explain concepts clearly without assuming prior expertise.
Break down complex ideas into simpler components.
Maintain a professional and direct tone.
Keep the formatting (Markdown) clean.
Only return the modified text, no explanations.
`,
    noob: `
You are a patient technical educator writing for complete beginners.
Rewrite the following documentation to be extremely accessible.
Assume no prior technical knowledge.
Use simple language and explain every concept from first principles.
Break complex ideas into small, digestible steps.
Maintain a professional and clear tone.
Keep the formatting (Markdown) clean.
Only return the modified text, no explanations.
`,
};

export interface UsePuterAIOptions {
    onStreamUpdate?: (partialContent: string) => void;
    onComplete?: (finalContent: string) => void;
    onError?: (error: Error) => void;
}

export interface UsePuterAIReturn {
    isLoading: boolean;
    error: Error | null;
    reimagine: (content: string, simplificationLevel: string) => Promise<string>;
    reimagineCustom: (content: string, customPrompt: string) => Promise<string>;
    abort: () => void;
}

export function usePuterAI(options: UsePuterAIOptions = {}): UsePuterAIReturn {
    const { onStreamUpdate, onComplete, onError } = options;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const buildPrompt = useCallback((content: string, systemInstruction: string): string => {
        return `${systemInstruction}\n\n---\n\nText to modify:\n${content}`;
    }, []);

    const callPuterAI = useCallback(async (prompt: string): Promise<string> => {
        // Check if puter is available
        if (typeof window === "undefined" || !window.puter) {
            throw new Error("PuterJS is not loaded. Please refresh the page.");
        }

        setIsLoading(true);
        setError(null);

        try {
            // Only sign in if not already authenticated (prevents popup on every call)
            if (!window.puter.auth.isSignedIn()) {
                await window.puter.auth.signIn({ attempt_temp_user_creation: true });
            }
            
            // Use streaming for better UX
            const response = await window.puter.ai.chat(prompt, {
                model: "google/gemini-3-flash-preview",
                stream: true,
            });

            let fullContent = "";

            // Handle streaming response
            // PuterJS streaming returns an async iterator
            if (Symbol.asyncIterator in (response as object)) {
                for await (const chunk of response as AsyncIterable<string>) {
                    fullContent += chunk;
                    onStreamUpdate?.(fullContent);
                }
            } else {
                // Non-streaming fallback
                const nonStreamResponse = response as { message: { content: string } };
                fullContent = nonStreamResponse.message?.content || "";
            }

            onComplete?.(fullContent);
            return fullContent;
        } catch (err) {
            const error = err instanceof Error ? err : new Error("AI request failed");
            setError(error);
            onError?.(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [onStreamUpdate, onComplete, onError]);

    const reimagine = useCallback(async (content: string, simplificationLevel: string): Promise<string> => {
        const systemInstruction = SIMPLIFICATION_PROMPTS[simplificationLevel] || SIMPLIFICATION_PROMPTS.standard;
        const prompt = buildPrompt(content, systemInstruction);
        return callPuterAI(prompt);
    }, [buildPrompt, callPuterAI]);

    const reimagineCustom = useCallback(async (content: string, customPrompt: string): Promise<string> => {
        const systemInstruction = `
You are an expert editor and writing assistant.
Apply the following instruction to the given text.
Keep the same general format (Markdown if present).
Only return the modified text, no explanations or extra content.

Instruction: ${customPrompt}
`;
        const prompt = buildPrompt(content, systemInstruction);
        return callPuterAI(prompt);
    }, [buildPrompt, callPuterAI]);

    const abort = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    return {
        isLoading,
        error,
        reimagine,
        reimagineCustom,
        abort,
    };
}
