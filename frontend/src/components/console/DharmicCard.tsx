"use client";

import { Scroll, Scale, ShieldAlert, BookOpen, ExternalLink, Sparkles, AlertCircle } from "lucide-react";

interface VerseItem {
  id: string;
  source: string;
  adhyaya?: number;
  theme?: string;
  text_sanskrit_translit: string;
  text_english: string;
}

interface EthicsItem {
  id: string;
  source: string;
  sub_parva?: string;
  theme?: string;
  text_sanskrit_translit?: string;
  text_english?: string;
}

interface DharmicCardProps {
  verses?: VerseItem[];
  ethics?: EthicsItem[];
  section1Text: string;
}

export default function DharmicCard({ verses = [], ethics = [], section1Text }: DharmicCardProps) {
  const primaryVerse = verses[0] || {
    id: "vidura-ch33-v16",
    adhyaya: 33,
    text_sanskrit_translit: "Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ | Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ ||",
    text_english: "O King, counselors who speak only pleasing falsehoods are plentiful. But rare is the counselor who speaks an unpalatable yet wholesome truth, and rarer still is the sovereign who heeds it."
  };

  return (
    <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border-amber-500/25 shadow-2xl flex flex-col justify-between relative overflow-hidden">
      {/* Decorative ambient corner glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-500/20 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scroll className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                CARD 01 &bull; STRATEGIC AUDIT
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                Dharmic Foundation &amp; Governance
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              BORI Critical Edition
            </span>
          </div>
        </div>

        {/* Highlighted Canonical Sanskrit Shloka Box */}
        <div className="p-5 rounded-2xl bg-black/50 border border-amber-500/30 mb-6 relative">
          <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
            <span className="flex items-center gap-1.5 font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              Vidura Nīti &bull; Adhyāya {primaryVerse.adhyaya || 33}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Mahābhārata Udyoga Parva</span>
          </div>

          <p className="font-serif italic text-sm sm:text-base text-amber-200 leading-relaxed tracking-wide my-2">
            &ldquo;{primaryVerse.text_sanskrit_translit}&rdquo;
          </p>

          <p className="text-xs font-sans text-slate-300 leading-relaxed mt-2 pt-2 border-t border-white/5">
            <span className="text-amber-400 font-semibold font-mono text-[11px] uppercase tracking-wider">
              Translation:{" "}
            </span>
            {primaryVerse.text_english}
          </p>
        </div>

        {/* Cross-Referenced Ethics Chips */}
        <div className="mb-6">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            Cross-Referenced Compliance Standards:
          </div>
          <div className="flex flex-wrap gap-2">
            {ethics.length > 0 ? (
              ethics.map((e, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 font-mono flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{e.source || "ACM Code of Ethics"} &bull; {e.sub_parva || "Clause 1.2"}</span>
                </div>
              ))
            ) : (
              <>
                <div className="px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>ACM Code of Ethics &bull; Clause 1.2 (Avoid Harm &amp; Whistleblowing)</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>IEEE Code of Ethics &bull; Clause 1.1 (Public Safety Paramountcy)</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Risk Breakdown: Personal Bias / Moha vs Organizational Duty / Dharma */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20">
            <div className="flex items-center gap-1.5 text-red-400 text-xs font-mono uppercase font-semibold mb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Blind Loyalty (Moha)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Appeasing immediate executive demands to preserve comfort. Results in complicity, regulatory fines, and eventual scapegoating.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/25">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-mono uppercase font-semibold mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Righteous Duty (Dharma)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Fiduciary defense of public safety and enterprise solvency. Dissent delivered with tactical calibration that insulates career standing.
            </p>
          </div>
        </div>

        {/* Section 1 Detailed Strategic Counsel Output */}
        <div className="prose prose-invert prose-sm max-w-none text-slate-200 bg-slate-950/60 p-5 rounded-2xl border border-white/5 font-sans leading-relaxed text-xs sm:text-sm whitespace-pre-wrap">
          {section1Text || "Analyzing organizational power dynamics and retrieving canonical Vidura Nīti shlokas..."}
        </div>
      </div>
    </div>
  );
}
