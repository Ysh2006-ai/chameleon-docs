import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const { content, mode } = await req.json();

        // Construct the Prompt
        let systemInstruction = "";
        if (mode === "simple") {
            systemInstruction = `
        You are a technical simplifier. 
        Rewrite the following documentation to be extremely simple and concise. 
        Use analogies (like explaining to a 5th grader). 
        Strip away jargon. 
        Keep the formatting (Markdown) clean.
      `;
        } else {
            systemInstruction = `
        You are a senior principal engineer. 
        Rewrite the following documentation to be highly technical and rigorous. 
        Focus on implementation details, memory management, edge cases, and performance implications. 
        Use advanced terminology. 
        Keep the formatting (Markdown) clean.
      `;
        }

        const prompt = `${systemInstruction}\n\n---\n\nOriginal Content:\n${content}`;

        // Use the new AI SDK Core API
        const result = await streamText({
            model: google("gemini-2.0-flash"),
            prompt: prompt,
        });

        // Return a text stream directly (compatible with your frontend reader)
        return result.toTextStreamResponse();

    } catch (error) {
        console.error("Gemini API Error:", error);
        return new Response(JSON.stringify({ error: "Failed to process content" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}