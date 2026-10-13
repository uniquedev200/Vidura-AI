"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Scroll,
  Network,
  Terminal,
  CheckCircle2,
  Shield,
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
    badge: "Stage 01: Coercive Impasse",
    title: "Executive Duress & Algorithmic Hazard",
    headline: "The Engineer's Crossroad in High-Velocity Systems",
    description:
      "A senior engineer discovers a 34% disparate-impact rejection rate or an unpatched critical authentication flaw 24 hours before public launch. Executive leadership issues an ultimatum: suppress the audit report or face immediate constructive dismissal.",
    meta: "ACM 1.2 & 1.4 / IEEE 1.1 Conflict",
  },
  {
    id: 2,
    badge: "Stage 02: Archival Precedent",
    title: "Vidura Nīti: The Architecture of Dissent",
    headline: "King Dhritarashtra's Sleepless Night in Udyoga Parva",
    description:
      "In the Prajāgara Parva of the Mahābhārata (Adhyāyas 33-40), Prime Minister Vidura confronted a sovereign gripped by institutional blindness. Vidura articulated a systematic doctrine for delivering unpalatable, medicinal truth without triggering self-destruction.",
    quote:
      "Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ | Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ ||",
    meta: "Udyoga Parva • Chapter 33, Verse 16 • Folio 111",
  },
  {
    id: 3,
    badge: "Stage 03: Dual-Index Retrieval",
    title: "Semantic & Statutory Co-Indexing",
    headline: "Archival Folio Loci + ACM/IEEE Cross-Referencing",
    description:
      "Vidura-AI retrieves the highest-matching shloka from the 13 OCR-verified Vidura Nīti loci alongside the 12 indexed ACM and IEEE ethics clauses, binding ancient statecraft directly to modern statutory whistleblower duties.",
    meta: "13 Archival Shloka Loci • 12 Statutory Clauses",
  },
  {
    id: 4,
    badge: "Stage 04: Four-Pillar Decree",
    title: "Calibrated Diplomacy & Whistleblower Armor",
    headline: "Sāma, Dāna, Bheda, Daṇḍa Applied to Executive 1-on-1s",
    description:
      "Rather than emotional defiance or passive complicity, the engineer receives verbatim spoken dialogue scripts and immutable paper-trail protocols. Dissent is framed as insulating executive leadership from regulatory liability.",
    meta: "4 Classical Upāyas • Verbatim Executive Memo",
  },
];

export default function StickyScrollStory() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isManualScrollRef = useRef<boolean>(false);
  const manualScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectAndScrollToStage = useCallback((stepId: number) => {
    setActiveStep(stepId);
    const targetEl = stepRefs.current[stepId - 1];
    if (!targetEl || typeof window === "undefined") return;

    isManualScrollRef.current = true;
    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }

    const rect = targetEl.getBoundingClientRect();
    const stickyTopOffset = 128;
    const targetScrollY = window.scrollY + rect.top - stickyTopOffset;

    window.scrollTo({
      top: Math.max(0, targetScrollY),
      behavior: "smooth",
    });

    manualScrollTimeoutRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 650);
  }, []);

  useEffect(() => {
    let rafId: number | null = null;

    const updateActiveStepOnScroll = () => {
      if (isManualScrollRef.current) return;

      const viewportTriggerY = window.innerHeight * 0.42;
      let closestStepId = 1;
      let minDistance = Number.POSITIVE_INFINITY;

      STEPS.forEach((step, idx) => {
        const el = stepRefs.current[idx];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cardCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenterY - viewportTriggerY);

        if (distance < minDistance) {
          minDistance = distance;
          closestStepId = step.id;
        }
      });

      setActiveStep((prev) => (prev !== closestStepId ? closestStepId : prev));
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        updateActiveStepOnScroll();
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateActiveStepOnScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      if (manualScrollTimeoutRef.current) {
        clearTimeout(manualScrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#262A36]">
      {/* Architectural Left-Aligned Section Header */}
      <div className="max-w-3xl mb-14">
        <div className="border-l-2 border-amber-500 pl-3.5 py-0.5 mb-3">
          <span className="text-xs uppercase font-mono tracking-[0.18em] text-amber-400 font-semibold">
            § 01 // Case Precedent &amp; Deliberation Flow
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F3F4F6] tracking-tight">
          From Kuru Court to{" "}
          <span className="text-[#E5C158]">Enterprise Governance</span>
        </h2>
        <p className="mt-3 text-base text-slate-300 leading-relaxed">
          Scroll through the four deliberation stages on the left to inspect how the Sabhā Verification Ledger resolves coercive engineering mandates on the right.
        </p>
      </div>

      {/* 5:7 Asymmetric Interactive Case Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 Cols): Scroll-Tracked Stage Cards */}
        <div className="lg:col-span-5 space-y-8 lg:space-y-24 lg:pb-32">
          {STEPS.map((step, index) => {
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                type="button"
                onClick={() => selectAndScrollToStage(step.id)}
                className={`w-full text-left rounded-lg p-6 sm:p-7 transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? "bg-[#12151E] border-amber-500/60 shadow-[0_8px_28px_rgba(0,0,0,0.5)]"
                    : "bg-[#0B0D13] border-[#1E222D] opacity-75 hover:opacity-100 hover:border-amber-500/30 hover:bg-[#0F1117]"
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`text-xs font-mono font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-sm ${
                      isActive
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-[#141822] text-slate-300 border border-[#262A36]"
                    }`}
                  >
                    {step.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    0{step.id} / 04
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#F3F4F6] tracking-tight">
                  {step.title}
                </h3>
                <div className="text-xs font-mono text-amber-300 mt-1 mb-2.5">
                  {step.headline}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {step.description}
                </p>

                {step.quote && (
                  <div className="mt-3.5 p-3 rounded-md bg-[#050608] border border-amber-500/25 font-serif text-xs italic text-amber-200">
                    &ldquo;{step.quote}&rdquo;
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-[#1E222D] flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{step.meta}</span>
                  <span className={isActive ? "text-amber-400 font-semibold" : "text-slate-400"}>
                    {isActive ? "Active in Sabhā Ledger" : "Scroll or Click"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column (7 Cols): Sticky Deliberation Viewport */}
        <div className="lg:col-span-7 lg:sticky lg:top-28 self-start">
          <div className="rounded-lg bg-[#0F1117] border border-[#262A36] p-6 sm:p-8 min-h-[520px] flex flex-col justify-between shadow-[0_12px_36px_rgba(0,0,0,0.55)]">
            {/* Viewport Top Telemetry Header + Stage Progress Bar */}
            <div className="space-y-3 pb-4 border-b border-[#262A36]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[#F3F4F6] font-semibold tracking-wide">
                    DELIBERATION STAGE 0{activeStep} // {STEPS[activeStep - 1]?.badge.split(": ")[1]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span>SABHĀ VERIFICATION LEDGER</span>
                </div>
              </div>
              <div className="w-full h-1 bg-[#161922] rounded-sm overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${(activeStep / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Dynamic Stage Inspection Panel */}
            <div className="my-auto py-6">
              <AnimatePresence mode="wait">
                {activeStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-md bg-red-950/30 border border-red-500/40 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-red-200">
                          Statutory &amp; Fiduciary Conflict Flagged
                        </div>
                        <div className="text-xs text-slate-300 mt-1">
                          Direct collision between executive launch ultimatum and ACM 1.4 Non-Discrimination mandate.
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-4 rounded-md bg-[#050608] border border-[#262A36]">
                        <div className="text-slate-400 uppercase">Technical Finding</div>
                        <div className="text-[#F3F4F6] font-semibold mt-1">
                          Credit Evaluation ML Pipeline
                        </div>
                        <div className="text-amber-400 text-[11px] mt-0.5">
                          34% Disparate Rejection Rate
                        </div>
                      </div>

                      <div className="p-4 rounded-md bg-[#050608] border border-[#262A36]">
                        <div className="text-slate-400 uppercase">Sovereign Ultimatum</div>
                        <div className="text-red-300 font-semibold mt-1">
                          Suppress Disparate-Impact Audit
                        </div>
                        <div className="text-slate-300 text-[11px] mt-0.5">
                          Deploy Unmodified at 09:00 UTC
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-md bg-[#050608] border border-[#262A36]">
                      <div className="text-xs uppercase font-mono text-slate-300 mb-3 flex items-center justify-between">
                        <span>Game-Theoretic Outcome Matrix</span>
                        <span className="text-amber-400">Asymmetric Power</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="p-3 rounded-sm bg-[#0F1117] border border-red-500/25 text-slate-300 flex items-center justify-between gap-2">
                          <span>Path A: Silent Appeasement (Moha)</span>
                          <span className="text-red-300 font-mono">Statutory &amp; Civil Liability</span>
                        </div>
                        <div className="p-3 rounded-sm bg-[#0F1117] border border-amber-500/25 text-slate-300 flex items-center justify-between gap-2">
                          <span>Path B: Unshielded Confrontation</span>
                          <span className="text-amber-300 font-mono">Immediate Retaliation</span>
                        </div>
                        <div className="p-3 rounded-sm bg-[#16130A] border border-amber-500/45 text-amber-100 flex items-center justify-between gap-2 font-semibold">
                          <span>Path C: Vidura Upāya Protocol</span>
                          <span className="text-emerald-300 font-mono">Documented Fiduciary Shield</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="p-6 rounded-md bg-[#050608] border border-amber-500/35 space-y-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#262A36] pb-3">
                      <div className="flex items-center gap-2">
                        <Scroll className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">
                          BORI Critical Edition &bull; Udyoga Parva 33.16
                        </span>
                      </div>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-sm bg-amber-500/15 text-amber-200 border border-amber-500/35">
                        Archival Folio 111
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm sm:text-base font-serif italic text-amber-200 tracking-wide leading-relaxed">
                        &ldquo;Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ |
                        <br />
                        Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ ||&rdquo;
                      </div>

                      <div className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed bg-[#0F1117] p-4 rounded-md border border-[#262A36]">
                        <span className="text-amber-400 font-semibold">
                          1890 Ganguli Folio 111 Translation:{" "}
                        </span>
                        They are abundant, O king, that can always speak agreeable words. The speaker, however, is rare, as also the hearer, of words that are disagreeable but medicinal.
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-md bg-[#0F1117] border border-[#262A36]">
                        <span className="text-slate-400">STATECRAFT DOCTRINE</span>
                        <div className="text-amber-300 font-semibold mt-1">
                          Pathya-Vacana (Medicinal Counsel)
                        </div>
                      </div>
                      <div className="p-3 rounded-md bg-[#0F1117] border border-[#262A36]">
                        <span className="text-slate-400">MODERN COMPLIANCE MAPPING</span>
                        <div className="text-[#F3F4F6] font-semibold mt-1">
                          Mandatory Risk Escalation (ACM 2.5)
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-md bg-[#050608] border border-[#262A36]">
                      <div className="flex items-center justify-between text-xs font-mono text-amber-300 mb-2">
                        <span className="flex items-center gap-1.5">
                          <Network className="w-4 h-4 text-amber-400" />
                          DUAL-CORPUS VECTOR RETRIEVAL
                        </span>
                        <span className="text-[#F3F4F6] font-bold">COSINE RANKING</span>
                      </div>
                      <div className="h-2 rounded-sm bg-[#161922] overflow-hidden">
                        <div className="h-full bg-amber-500 w-[93%]" />
                      </div>
                      <div className="flex justify-between text-xs font-mono text-slate-400 mt-2">
                        <span>Top Archival &amp; Statutory Alignment</span>
                        <span className="text-amber-300 font-semibold">0.932 Similarity</span>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs font-mono">
                      <div className="p-3.5 rounded-md bg-[#050608] border border-amber-500/30 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="text-amber-200">
                            vidura-ch33-v16 (Folio 111 • Medicinal Truth)
                          </span>
                        </div>
                        <span className="text-emerald-300 font-semibold">0.932</span>
                      </div>

                      <div className="p-3.5 rounded-md bg-[#050608] border border-[#262A36] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="text-slate-200">
                            acm-clause-1.4 (Be Fair &amp; Non-Discriminatory)
                          </span>
                        </div>
                        <span className="text-emerald-300 font-semibold">0.915</span>
                      </div>

                      <div className="p-3.5 rounded-md bg-[#050608] border border-[#262A36] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="text-slate-200">
                            ieee-clause-1.1 (Paramount Public Safety)
                          </span>
                        </div>
                        <span className="text-emerald-300 font-semibold">0.898</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="p-5 rounded-md bg-[#050608] border border-amber-500/35 space-y-4 font-mono"
                  >
                    <div className="flex items-center justify-between border-b border-[#262A36] pb-3 text-xs">
                      <div className="flex items-center gap-2 text-amber-400">
                        <Terminal className="w-4 h-4" />
                        <span>PILLAR IV // UPĀYA PRAYOGA SCRIPT</span>
                      </div>
                      <span className="text-xs text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Fiduciary Insulation</span>
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-200 space-y-2 bg-[#0F1117] p-4 rounded-md border border-[#262A36] font-sans leading-relaxed">
                      <div className="text-amber-400 font-mono text-xs uppercase tracking-wider">
                        Executive 1-on-1 Spoken Protocol (Sāma + Bheda):
                      </div>
                      <p className="italic text-slate-200">
                        &ldquo;I share our target of meeting tomorrow&apos;s release milestone. However, our pre-deployment audit flagged a 34% disparate rejection rate on zip-code proxies. Deploying without the fairness post-processor exposes executive leadership to personal statutory liability under ECOA and ACM 1.4. Enabling the post-processor flag today preserves our launch schedule while insulating leadership from regulatory penalties.&rdquo;
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-md bg-[#0F1117] border border-[#262A36] flex items-center gap-2 text-slate-300">
                        <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Mantra-Gupti Git Hash Log</span>
                      </div>
                      <div className="p-3 rounded-md bg-[#0F1117] border border-[#262A36] flex items-center gap-2 text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>IEEE 7.8 Compliance Record</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accessible Stage Selector Footer (44x44px minimum tap targets per R-03) */}
            <div className="pt-4 border-t border-[#262A36] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Stage 0{activeStep} of 04</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectAndScrollToStage(i)}
                    aria-label={`Select deliberation stage ${i}`}
                    aria-pressed={activeStep === i}
                    className={`min-h-[44px] min-w-[44px] px-3 rounded-md font-mono text-xs font-semibold transition-colors cursor-pointer border ${
                      activeStep === i
                        ? "bg-amber-500 text-[#08090C] border-amber-400"
                        : "bg-[#050608] text-slate-300 border-[#262A36] hover:border-amber-500/40"
                    }`}
                  >
                    0{i}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
