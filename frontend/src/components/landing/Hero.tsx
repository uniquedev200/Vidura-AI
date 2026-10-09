"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Scale, ArrowRight, BookOpen, Compass, ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-20 md:pt-36 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Top Banner Tag */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-subtle border-amber-500/25 mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-xs uppercase tracking-widest text-amber-300 font-medium font-mono">
          Indic Cyber-Sabhā &bull; High Governance Engine
        </span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-5xl leading-[1.12]"
      >
        When Duty Clashes With{" "}
        <span className="gold-gradient-text italic font-normal">Authority.</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl font-light leading-relaxed"
      >
        Enterprise AI Decision Support Grounded in 3,000-Year-Old Strategic Statecraft (
        <span className="text-amber-300/90 font-serif italic">Vidura Nīti</span>) and Modern Engineering
        Compliance Standards (ACM & IEEE Codes of Ethics).
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
      >
        <Link
          href="/console"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-semibold text-base shadow-[0_0_28px_-4px_rgba(245,158,11,0.5)] hover:shadow-[0_0_36px_0_rgba(245,158,11,0.7)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Compass className="w-5 h-5 text-slate-950" />
          <span>Enter Counsel Chamber</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </Link>

        <a
          href="#research"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl glass-panel text-slate-200 hover:text-white hover:border-amber-400/40 font-medium text-base transition-all duration-300 hover:bg-slate-800/60"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Explore Research Grounding</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </a>
      </motion.div>

      {/* Metric Badges */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl"
      >
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 text-left border-amber-500/15">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white flex items-center gap-2">
              &lt; 500ms
              <span className="text-[10px] font-sans font-normal uppercase px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-500/20">
                Groq
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-sans">
              Ultra-Low Latency Inference
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 text-left border-cyan-500/15">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white flex items-center gap-2">
              Source-Grounded
              <span className="text-[10px] font-sans font-normal uppercase px-1.5 py-0.5 rounded bg-cyan-400/10 text-cyan-300 border border-cyan-500/20">
                RAG
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-sans">
              Verified BORI &amp; ACM Corpus
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 text-left border-amber-500/15">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-white flex items-center gap-2">
              &gt; 0.88
              <span className="text-[10px] font-sans font-normal uppercase px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-300 border border-emerald-500/20">
                RAGAS
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-sans">
              Faithfulness &amp; Relevancy Score
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
