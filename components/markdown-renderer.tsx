"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <div className={cn("space-y-6", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // 1. Headings
                    h1: ({ node, ...props }) => (
                        <h1 className="mt-8 scroll-m-20 font-heading text-4xl font-bold tracking-tight lg:text-5xl" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="mt-10 scroll-m-20 border-b border-white/10 pb-2 font-heading text-3xl font-semibold tracking-tight first:mt-0" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="mt-8 scroll-m-20 font-heading text-2xl font-semibold tracking-tight" {...props} />
                    ),

                    // 2. Paragraphs & Text
                    p: ({ node, ...props }) => (
                        <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground text-lg" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                        <a className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors" {...props} />
                    ),

                    // 3. Blockquotes (Glass Style)
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground bg-white/5 p-4 rounded-r-lg" {...props} />
                    ),

                    // 4. Lists
                    ul: ({ node, ...props }) => (
                        <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-muted-foreground" {...props} />
                    ),

                    // 5. Code Blocks
                    code: ({ node, inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                            <div className="relative mt-6 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                                {/* Mac-style window dots */}
                                <div className="flex items-center gap-2 bg-[#282a36] px-4 py-3 border-b border-white/5">
                                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                                    <span className="ml-2 text-xs text-white/40 font-mono">{match[1]}</span>
                                </div>
                                <SyntaxHighlighter
                                    style={dracula}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{
                                        margin: 0,
                                        borderRadius: 0,
                                        background: "#282a36",
                                        padding: "1.5rem",
                                        fontSize: "0.9rem",
                                    }}
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code className="relative rounded bg-primary/10 px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-primary" {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}