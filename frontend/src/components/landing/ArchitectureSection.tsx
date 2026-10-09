"use client";

import { motion } from "framer-motion";
import { Cpu, Database, Network, Zap, Shield, ArrowRight, Layers, Lock, Server } from "lucide-react";

export default function ArchitectureSection() {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-amber-500/10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel-subtle border-amber-500/20 mb-4">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs uppercase font-mono tracking-widest text-amber-300">
            System Topology &bull; Enterprise Stack
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Indic Cyber-Sabhā <span className="gold-gradient-text">Architecture</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 font-light">
          Engineered for deterministic grounding, ultra-low latency, and cryptographic paper trails.
        </p>
      </div>

      {/* Interactive Topology Graph */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {/* Step 1: Input Ingestion */}
        <div className="glass-panel p-6 rounded-2xl border-amber-500/20 flex flex-col justify-between relative group hover:border-amber-400/50 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mb-5 text-amber-400">
              <Shield className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
              01 &bull; Formulation
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              Dilemma Modeling
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Accepts multidimensional parameterization: organizational pressure intensity, role asymmetry, counterparty rank, and primary legal/career fear.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Next.js 14+ Client</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>

        {/* Step 2: Vector Retrieval */}
        <div className="glass-panel-cyan p-6 rounded-2xl border-cyan-500/20 flex flex-col justify-between relative group hover:border-cyan-400/50 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mb-5 text-cyan-400">
              <Database className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
              02 &bull; Dual-Index RAG
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              Upstash Vector Engine
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              1536-dimensional dense cosine semantic retrieval co-indexes verified BORI Vidura Nīti verses with ACM &amp; IEEE professional codes.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Cosine Match &gt; 0.88</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        </div>

        {/* Step 3: Groq LPU Generation */}
        <div className="glass-panel p-6 rounded-2xl border-amber-500/20 flex flex-col justify-between relative group hover:border-amber-400/50 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mb-5 text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
              03 &bull; Groq LPU Engine
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              Sub-500ms Streaming
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              FastAPI SSE streaming pipelines synthesize counsel via high-throughput Groq LPU clusters, enforcing Sāma/Dāna/Bheda tactical insulation.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>&lt; 500ms TTFT</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>

        {/* Step 4: Supabase Telemetry */}
        <div className="glass-panel p-6 rounded-2xl border-emerald-500/20 flex flex-col justify-between relative group hover:border-emerald-400/50 transition-all">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mb-5 text-emerald-400">
              <Server className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 mb-1">
              04 &bull; Supabase Ledger
            </div>
            <h3 className="font-serif text-lg font-bold text-white">
              PostgreSQL Telemetry
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Logs user scenario parameters, retrieved embeddings, Likert ratings, and RAGAS benchmarks for continuous model evaluation.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>PostgreSQL 17.11</span>
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
