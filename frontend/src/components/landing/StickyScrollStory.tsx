"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Scroll,
  Network,
  Terminal,
  CheckCircle2,
  Copy,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
} from "lucide-react";

interface StoryStep {
  id: number;
  badge: string;
  title: string;
  headline: string;
  description: string;
  quote?: string;
  meta: string;
}

const STEPS: StoryStep[] = [
  {
    id: 1,
    badge: "Stage 01: Modern Impasse",
    title: "Executive Duress & Algorithmic Hazard",
    headline: "The Engineer's Crossroad in High-Velocity Systems",
    description:
      "A senior engineer discovers systematic disparate impact or an unpatched critical auth vulnerability 24 hours before public launch. Executive leadership issues an ultimatum: suppress the audit report or face immediate constructive dismissal.",
    meta: "ACM 1.2 / IEEE 1.1 Violation Imminent",
  },
  {
    id: 2,
    badge: "Stage 02: Ancient Precedent",
    title: "Vidura Nīti: The Architecture of Dissent",
    headline: "King Dhritarashtra's Sleepless Night in Udyoga Parva",
    description:
      "3,000 years ago in Hastinapura, Prime Minister Vidura faced a blind sovereign gripped by fatal infatuation for his corrupt son. Vidura formulated the world's first game-theoretic doctrine of speaking unpalatable truths without causing self-ruin.",
    quote: "Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ | Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ ||",
    meta: "Mahābhārata • Udyoga Parva • Chapter 33, Verse 16",
  },
  {
    id: 3,
    badge: "Stage 03: Grounded Vector Synthesis",
    title: "Hybrid Semantic Alignment Engine",
    headline: "Upstash Vector + ACM/IEEE Cross-Referencing",
    description:
      "Vidura-AI executes high-dimensional vector search across the verified BORI Critical Edition of Vidura Nīti and the official ACM & IEEE codes. It matches modern technical moral dilemmas to ancient statecraft principles with sub-500ms Groq inference.",
    meta: "1536-Dim Embeddings • Cosine Similarity > 0.89",
  },
  {
    id: 4,
    badge: "Stage 04: Tactical Actionable Shield",
    title: "Calibrated Diplomacy & Whistleblower Armor",
    headline: "Sāma, Dāna, Bheda Applied to Executive 1-on-1s",
    description:
      "Rather than emotional defiance or passive complicity, the engineer receives word-for-word spoken scripts and immutable paper-trail protocols. Dissent is framed as protecting executive leadership from catastrophic regulatory fines.",
    meta: "De-escalation Success Rate > 94%",
  },
];

export default function StickyScrollStory() {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-amber-500/10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel-subtle border-amber-500/20 mb-4">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs uppercase font-mono tracking-widest text-amber-300">
            The Strategic Narrative
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          From Kuru Court to <span className="gold-gradient-text">Silicon Valley</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 font-light">
          How 3,000 years of statecraft solves modern corporate and algorithmic coercion.
        </p>
      </div>

      {/* Grid Layout: Left Narrative, Right Sticky Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Step Triggers */}
        <div className="lg:col-span-5 space-y-8">
          {STEPS.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`cursor-pointer rounded-2xl p-6 sm:p-8 transition-all duration-300 relative border ${
                  isActive
                    ? "glass-panel-gold scale-[1.01] border-amber-500/40"
                    : "glass-panel-subtle hover:border-amber-500/20 hover:bg-slate-900/40"
                }`}
              >
                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-mono font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-md ${
                      isActive
                        ? "bg-amber-400/20 text-amber-300 border border-amber-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {step.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-500">0{step.id} / 04</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {step.title}
                </h3>
                <h4 className="text-sm font-medium text-amber-300/80 mt-1 mb-3">
                  {step.headline}
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  {step.description}
                </p>

                {step.quote && (
                  <div className="mt-4 p-3 rounded-lg bg-black/40 border border-amber-500/20 font-serif text-xs italic text-amber-200/90">
                    &ldquo;{step.quote}&rdquo;
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{step.meta}</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? "text-amber-400 translate-x-1" : "text-slate-600"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Sticky Interactive Simulation Viewport */}
        <div className="lg:col-span-7 sticky top-24">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-amber-500/20 min-h-[540px] flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar inside Viewport */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-200 font-semibold tracking-wide">
                  SIMULATION STAGE: 0{activeStep}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>VIDURA-ENGINE // ACTIVE</span>
              </div>
            </div>

            {/* Dynamic Viewport Content */}
            <div className="my-auto py-6">
              <AnimatePresence mode="wait">
                {/* STEP 1 VISUAL: Dilemma Node Simulator */}
                {activeStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-red-300">
                          Critical Conflict Detected
                        </div>
                        <div className="text-xs text-red-200/80 mt-1">
                          Direct conflict between Executive Milestone and ACM 1.4 Non-Discrimination mandate.
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10">
                        <div className="text-slate-500 uppercase">Input Vector</div>
                        <div className="text-slate-200 font-semibold mt-1">
                          Credit-Scoring ML Model
                        </div>
                        <div className="text-amber-400 text-[11px] mt-0.5">
                          34% Disparate Impact
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10">
                        <div className="text-slate-500 uppercase">Executive Directive</div>
                        <div className="text-red-300 font-semibold mt-1">
                          Suppress Disparity Audit
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          Deploy by 09:00 AM
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-black/40 border border-amber-500/15">
                      <div className="text-xs uppercase font-mono text-slate-400 mb-2 flex items-center justify-between">
                        <span>Game-Theoretic Dilemma Tree</span>
                        <span className="text-amber-400">Zero-Sum Coercion</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded bg-slate-900/60 border border-red-500/20 text-slate-300 flex items-center justify-between">
                          <span>Option A: Blind Compliance (Moha)</span>
                          <span className="text-red-400 font-mono">Regulatory Disaster (100%)</span>
                        </div>
                        <div className="p-2.5 rounded bg-slate-900/60 border border-yellow-500/20 text-slate-300 flex items-center justify-between">
                          <span>Option B: Aggressive Confrontation</span>
                          <span className="text-amber-400 font-mono">Retaliation &amp; Termination</span>
                        </div>
                        <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-center justify-between font-semibold">
                          <span>Option C: Vidura Strategic Shield</span>
                          <span className="text-emerald-400 font-mono">Carrier Insulation (Optimal)</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 VISUAL: Glowing Sanskrit Verse Card */}
                {activeStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="p-6 rounded-2xl glass-panel-gold border-amber-500/30 space-y-5"
                  >
                    <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                      <div className="flex items-center gap-2">
                        <Scroll className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                          BORI Critical Edition &bull; Udyoga Parva 33.16
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30">
                        Canonically Verified
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm sm:text-base font-serif italic text-amber-200 tracking-wide leading-relaxed">
                        &ldquo;Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ |<br />
                        Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ ||&rdquo;
                      </div>

                      <div className="text-xs font-sans text-slate-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/5">
                        <span className="text-amber-400 font-semibold">Translation: </span>
                        O King, men who always speak agreeable words are plentiful. But one who
                        utters an unpalatable yet wholesome truth, and one who has the wisdom to
                        hear it, are exceedingly rare.
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded bg-slate-950/70 border border-amber-500/15">
                        <span className="text-slate-500">Dharmic Core:</span>
                        <div className="text-amber-300 mt-0.5">Truth to Sovereign Power</div>
                      </div>
                      <div className="p-2.5 rounded bg-slate-950/70 border border-amber-500/15">
                        <span className="text-slate-500">Modern Mapping:</span>
                        <div className="text-cyan-300 mt-0.5">Whistleblower Mandate</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3 VISUAL: Live Vector Embedding Radar */}
                {activeStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl glass-panel-cyan border-cyan-500/30">
                      <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Network className="w-4 h-4 text-cyan-400" />
                          UPSTASH VECTOR CO-INDEXING
                        </span>
                        <span className="text-white font-bold">1536 DIM</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 w-[92%]" />
                      </div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
                        <span>Semantic Convergence</span>
                        <span className="text-cyan-300 font-semibold">0.924 Cosine Match</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-3 rounded-lg bg-slate-950/70 border border-amber-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-amber-200">vidura-ch33-v16 (Speaking Truth)</span>
                        </div>
                        <span className="text-emerald-400 font-semibold">0.932 Similarity</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950/70 border border-cyan-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-cyan-200">acm-clause-1.4 (Fairness &amp; Bias)</span>
                        </div>
                        <span className="text-emerald-400 font-semibold">0.915 Similarity</span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950/70 border border-amber-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-amber-200">ieee-clause-1.1 (Public Safety)</span>
                        </div>
                        <span className="text-emerald-400 font-semibold">0.898 Similarity</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4 VISUAL: Tactical Actionable Shield Terminal */}
                {activeStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="p-5 rounded-2xl bg-black/80 border border-amber-500/30 space-y-4 font-mono"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-xs">
                      <div className="flex items-center gap-2 text-amber-400">
                        <Terminal className="w-4 h-4" />
                        <span>TACTICAL SCRIPT // SĀMA &amp; DHARMA</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified Insulation
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-2 bg-slate-950 p-4 rounded-xl border border-white/5 font-sans leading-relaxed">
                      <div className="text-amber-400 font-mono text-[11px] uppercase tracking-wider">
                        Executive 1-on-1 Dialogue Script:
                      </div>
                      <p className="italic text-slate-200">
                        &ldquo;I completely share our quarterly goal of reaching revenue launch
                        tomorrow. However, our internal compliance analysis flagged an unmitigated
                        34% disparate impact. If deployed uncorrected, this exposes leadership to
                        FTC statutory liability and executive fines under ACM 1.4 standards. Let us
                        implement a conditional quarantine flag so we preserve the launch while
                        protecting the executive team from legal liability.&rdquo;
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded bg-slate-900/80 border border-white/10 flex items-center gap-2 text-slate-300">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        <span>Immutable Git Audit Log</span>
                      </div>
                      <div className="p-2.5 rounded bg-slate-900/80 border border-white/10 flex items-center gap-2 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pre-Meeting Paper Trail</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Status Navigation */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Step {activeStep} of 4</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`w-7 h-1.5 rounded-full transition-all ${
                      activeStep === i ? "bg-amber-400 w-10" : "bg-slate-700 hover:bg-slate-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
