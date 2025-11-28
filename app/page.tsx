"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Layers, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  // Animation variants for staggering children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30">

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-purple-500/20" />
            <span className="font-heading text-xl font-bold tracking-tight">
              Chameleon<span className="text-primary/40">Docs</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button variant="glass" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container pt-24 pb-32 text-center lg:pt-32">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-4xl space-y-8"
          >
            <motion.div variants={item} className="flex justify-center">
              <Badge variant="glass" className="px-4 py-1.5 text-sm">
                <Sparkles className="mr-2 h-3 w-3 text-yellow-400" />
                v2.0 is now Public Beta
              </Badge>
            </motion.div>

            <motion.h1 variants={item} className="font-heading text-5xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/40">
              Documentation that <br />
              <span className="text-foreground">Adapts to You.</span>
            </motion.h1>

            <motion.p variants={item} className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Stop writing static docs. Build living knowledge bases that transform
              from simple summaries to deep technical dives with a single click.
            </motion.p>

            <motion.div variants={item} className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-base shadow-xl shadow-indigo-500/20">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button variant="glass" size="lg" className="h-12 px-8 text-base">
                <Github className="mr-2 h-4 w-4" /> Star on GitHub
              </Button>
            </motion.div>
          </motion.div>

          {/* Visual Demo (The "Glass" Effect Showcase) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-20 flex justify-center px-4"
          >
            <GlassCard className="w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-black/40 p-1 shadow-2xl backdrop-blur-xl">
              <div className="rounded-lg bg-background/50 p-8 md:p-12 border border-white/5">
                <div className="flex flex-col gap-8 md:flex-row">
                  {/* Fake Sidebar */}
                  <div className="hidden w-48 space-y-4 md:block opacity-50">
                    <div className="h-2 w-24 rounded bg-foreground/20" />
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded bg-foreground/10" />
                      <div className="h-2 w-3/4 rounded bg-foreground/10" />
                      <div className="h-2 w-5/6 rounded bg-foreground/10" />
                    </div>
                  </div>
                  {/* Fake Content */}
                  <div className="flex-1 space-y-6">
                    <div className="h-8 w-3/4 rounded bg-gradient-to-r from-foreground/20 to-transparent" />
                    <div className="space-y-3">
                      <div className="h-3 w-full rounded bg-foreground/10" />
                      <div className="h-3 w-full rounded bg-foreground/10" />
                      <div className="h-3 w-2/3 rounded bg-foreground/10" />
                    </div>
                    <div className="mt-8 rounded-lg border border-white/10 bg-black/20 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-3 w-3 rounded-full bg-red-500/20" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
                        <div className="h-3 w-3 rounded-full bg-green-500/20" />
                      </div>
                      <div className="space-y-2 font-mono text-xs text-blue-300/50">
                        <div className="flex gap-2"><span className="text-purple-400">const</span> magic = <span className="text-yellow-400">require</span>(<span className="text-green-400">'chameleon'</span>);</div>
                        <div className="flex gap-2">magic.<span className="text-blue-400">init</span>( ... );</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="container py-24">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Zero Latency",
                desc: "Powered by Next.js 14 and React Server Components for instant page loads."
              },
              {
                icon: Layers,
                title: "Atomic Design",
                desc: "Built on a strict atomic system. Every component is reusable and type-safe."
              },
              {
                icon: Sparkles,
                title: "Visual Bliss",
                desc: "Glassmorphism, smooth animations, and eye-care colors out of the box."
              }
            ].map((feature, i) => (
              <GlassCard key={i} className="p-8 hover:bg-white/10 transition-colors">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-heading text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 py-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 Chameleon Docs. Crafted with precision.</p>
        </div>
      </footer>
    </div>
  );
}