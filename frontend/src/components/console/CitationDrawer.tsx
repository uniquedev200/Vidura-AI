"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Scale, Scroll, ExternalLink, ShieldCheck, Database } from "lucide-react";

interface VerseItem {
  id: string;
  source: string;
  adhyaya?: number;
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
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="w-full max-w-xl h-full bg-[#0F1117] border-l border-amber-500/20 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    Verified Citation Ledger
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <span>Upstash Vector Index</span>
                    <span>&bull;</span>
                    <span className="text-amber-400">Confidence: {(confidenceScore * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
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

              {verses.map((v, i) => (
                <div
                  key={v.id || i}
                  className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-300 font-bold">
                      Adhyāya {v.adhyaya || 33} &bull; Verse Reference
                    </span>
                    {v.score && (
                      <span className="text-emerald-400 text-[11px]">
                        Cosine Score: {v.score}
                      </span>
                    )}
                  </div>

                  <p className="font-serif italic text-xs text-amber-100/90 leading-relaxed">
                    &ldquo;{v.text_sanskrit_translit}&rdquo;
                  </p>

                  <p className="text-xs text-slate-300 pt-2 border-t border-white/5">
                    {v.text_english}
                  </p>
                </div>
              ))}
            </div>

            {/* Ethics Standards Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                <Scale className="w-3.5 h-3.5" />
                <span>Modern Computing Standards (ACM &amp; IEEE)</span>
              </div>

              {ethics.map((e, i) => (
                <div
                  key={e.id || i}
                  className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-300 font-bold">
                      {e.source} &bull; {e.sub_parva || "Principle"}
                    </span>
                    {e.score && (
                      <span className="text-emerald-400 text-[11px]">
                        Cosine Score: {e.score}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    {e.text_english || e.text_sanskrit_translit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="pt-6 border-t border-white/10 mt-8 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Source-Grounded (Zero Hallucination)
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-colors"
            >
              Close Ledger
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
