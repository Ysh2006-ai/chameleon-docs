import {
    Bold, Italic, Code, List,
    Heading1, Heading2, Quote, Sparkles
} from "lucide-react";

export const EDITOR_TOOLS = [
    {
        id: "format",
        label: "Formatting",
        items: [
            { id: "bold", icon: Bold, label: "Bold", shortcut: "Cmd+B" },
            { id: "italic", icon: Italic, label: "Italic", shortcut: "Cmd+I" },
            { id: "code", icon: Code, label: "Inline Code", shortcut: "Cmd+E" },
        ]
    },
    {
        id: "blocks",
        label: "Blocks",
        items: [
            { id: "h1", icon: Heading1, label: "Heading 1" },
            { id: "h2", icon: Heading2, label: "Heading 2" },
            { id: "list", icon: List, label: "Bullet List" },
            { id: "quote", icon: Quote, label: "Blockquote" },
        ]
    },
    {
        id: "magic",
        label: "Chameleon Magic",
        items: [
            { id: "simplify", icon: Sparkles, label: "Auto-Simplify", color: "text-purple-400" },
        ]
    }
];