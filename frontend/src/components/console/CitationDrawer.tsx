"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scale, Scroll, ShieldCheck, Database } from "lucide-react";

interface VerseItem {
  id: string;
  source?: string;
  verse_id?: string;
  adhyaya?: number;
  page_number?: number;
  theme?: string;
  text_sanskrit_translit: string;
  text_english: string;
  score?: number;
}

interface EthicsItem {
  id: string;
  source: string;
  sub_parva?: string;
  theme?: string;
  text_sanskrit_translit?: string;
  text_english?: string;
  score?: number;
}

interface CitationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  verses: VerseItem[];
  ethics: EthicsItem[];
  confidenceScore: number;
}

export default function CitationDrawer({
  isOpen,
  onClose,
  verses,
  ethics,
  confidenceScore,
}: CitationDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="citation-drawer-title"
        onClick={onClose}
        className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      >
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl h-full bg-[#0F1117] border-l border-[#262A36] shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#262A36] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-[#050608] border border-amber-500/35 flex items-center justify-center text-amber-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    id="citation-drawer-title"
                    className="font-serif text-lg font-bold text-[#F3F4F6]"
                  >
                    Verified Citation Ledger
                  </h3>
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <span>Dual-Corpus Index</span>
                    <span>&bull;</span>
                    <span className="text-amber-400">
                      Match: {(confidenceScore * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Citation Ledger"
                className="min-h-[44px] min-w-[44px] rounded-md bg-[#050608] hover:bg-[#161922] border border-[#262A36] flex items-center justify-center text-slate-300 hover:text-[#F3F4F6] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Vidura Nīti Section */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                <Scroll className="w-3.5 h-3.5" />
                <span>Mahābhārata &bull; Udyoga Parva (Prajāgara Parva)</span>
              </div>

              {verses.length === 0 ? (
                <div className="p-4 rounded-md bg-[#050608] border border-[#262A36] text-xs font-mono text-slate-400">
                  Select a dilemma preset or submit a case brief to populate archival shloka citations.
                </div>
              ) : (
                verses.map((v, i) => (
                  <div
                    key={v.id || i}
                    className="p-4 rounded-md bg-[#050608] border border-amber-500/30 space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <span className="text-amber-300 font-bold">
                        Adhyāya {v.adhyaya || 33} &bull; § {v.verse_id || "33.16"}{" "}
                        {v.page_number ? `(Folio ${v.page_number})` : ""}
                      </span>
                      {v.score && (
                        <span className="text-emerald-300 text-xs">
                          Cosine: {v.score}
                        </span>
                      )}
                    </div>

                    <p className="font-serif italic text-xs sm:text-sm text-amber-100 leading-relaxed">
                      &ldquo;{v.text_sanskrit_translit}&rdquo;
                    </p>

                    <p className="text-xs text-slate-300 pt-2 border-t border-[#1E222D] leading-relaxed">
                      {v.text_english}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Ethics Standards Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                <Scale className="w-3.5 h-3.5" />
                <span>Statutory Computing Standards (ACM &amp; IEEE)</span>
              </div>

              {ethics.length === 0 ? (
                <div className="p-4 rounded-md bg-[#050608] border border-[#262A36] text-xs font-mono text-slate-300 space-y-1">
                  <div className="text-amber-300 font-semibold">
                    Default Statutory Baseline Active:
                  </div>
                  <div className="text-slate-400">
                    ACM Clauses 1.2 (Avoid Harm), 1.4 (Fairness), 2.5 (Risk Evaluation) &amp; IEEE Clause 1.1 (Public Safety).
                  </div>
                </div>
              ) : (
                ethics.map((e, i) => (
                  <div
                    key={e.id || i}
                    className="p-4 rounded-md bg-[#050608] border border-[#262A36] space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#F3F4F6] font-bold">
                        {e.source} &bull; {e.sub_parva || "Clause"}
                      </span>
                      {e.score && (
                        <span className="text-emerald-300 text-xs">
                          Cosine: {e.score}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {e.text_english || e.text_sanskrit_translit}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="pt-6 border-t border-[#262A36] mt-8 text-xs font-mono text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Verbatim Corpus Grounding</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2 rounded-md bg-amber-500/15 text-amber-200 hover:bg-amber-500/25 border border-amber-500/40 transition-colors cursor-pointer"
            >
              Close Ledger
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
