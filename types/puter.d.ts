/**
 * PuterJS Type Declarations
 * @see https://docs.puter.com/
 */

interface PuterAIChatOptions {
  /** The AI model to use */
  model?: string;
  /** Enable streaming responses */
  stream?: boolean;
  /** Maximum tokens to generate */
  max_tokens?: number;
  /** Temperature (0-2) for randomness control */
  temperature?: number;
  /** Controls reasoning effort: 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' */
  reasoning_effort?: 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh';
  /** Controls response length: 'low' | 'medium' | 'high' */
  text_verbosity?: 'low' | 'medium' | 'high';
}

interface PuterAIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface PuterAIChatResponse {
  /** The generated text response */
  message: {
    content: string;
    role: 'assistant';
  };
}

interface PuterAIChatStreamResponse {
  /** Async iterator for streaming chunks */
  [Symbol.asyncIterator](): AsyncIterator<string>;
}

interface PuterAI {
  /**
   * Send a chat message to an AI model
   * @param prompt - Text prompt or array of messages
   * @param options - Configuration options
   */
  chat(
    prompt: string | PuterAIChatMessage[],
    options?: PuterAIChatOptions
  ): Promise<PuterAIChatResponse | PuterAIChatStreamResponse>;
}

interface PuterAuthSignInOptions {
  /** Automatically create a temporary user if not signed in */
  attempt_temp_user_creation?: boolean;
}

interface PuterAuth {
  /**
   * Sign in to Puter (or create temporary account)
   */
  signIn(options?: PuterAuthSignInOptions): Promise<void>;
  
  /**
   * Check if user is signed in
   */
  isSignedIn(): boolean;
}

interface Puter {
  ai: PuterAI;
  auth: PuterAuth;
}

declare global {
  const puter: Puter;
  interface Window {
    puter: Puter;
  }
}

export {};
