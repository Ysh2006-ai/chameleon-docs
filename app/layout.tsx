import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Space_Grotesk, Manrope, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AccentProvider } from "@/components/accent-provider";
import { CommandMenu } from "@/components/command-menu";
import SmoothScroll from "@/components/smooth-scroll";
import { cn } from "@/lib/utils";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Chameleon Docs",
    template: "%s | Chameleon Docs",
  },
  description: "A visually blissful documentation platform that adapts to your reading level.",
  keywords: ["documentation", "docs", "knowledge base", "AI", "writing"],
  authors: [{ name: "Chameleon Docs" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Chameleon Docs",
    title: "Chameleon Docs",
    description: "A visually blissful documentation platform that adapts to your reading level.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chameleon Docs",
    description: "A visually blissful documentation platform that adapts to your reading level.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased selection:bg-accent/30 selection:text-accent-foreground",
          cormorant.variable,
          jakarta.variable,
          spaceGrotesk.variable,
          manrope.variable,
          inter.variable
        )}
      >
        <SmoothScroll />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AccentProvider>
            <CommandMenu />
            {children}
          </AccentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}