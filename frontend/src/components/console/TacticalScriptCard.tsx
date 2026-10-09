"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import {
  Shield,
  Terminal,
  Copy,
  Check,
  FileText,
  MessageSquare,
  Lock,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface TacticalScriptCardProps {
  section2Text: string;
}

export default function TacticalScriptCard({ section2Text }: TacticalScriptCardProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(section2Text);
    setCopied(true);

    // Subtle celebratory confetti effect
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#D4AF37", "#06B6D4", "#F59E0B"],
      });
    } catch {
      // Ignore if window context issues
    }

    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="glass-panel-cyan rounded-3xl p-6 sm:p-8 border-cyan-500/25 shadow-2xl flex flex-col justify-between relative overflow-hidden">
      {/* Decorative ambient corner glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        {/* Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-cyan-500/20 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                CARD 02 &bull; TACTICAL EXECUTION
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                Diplomatic Dialogue &amp; Shield
              </h3>
            </div>
          </div>

          {/* Copy Action Button */}
          <button
            onClick={handleCopyScript}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-200 text-xs font-mono font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Script Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy Full Script</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Tactical Pillars Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono text-xs font-bold shrink-0">
              01
            </div>
            <div>
              <div className="text-xs font-mono text-amber-300 uppercase font-semibold">
                Paper Trail
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Timestamped Git commits, Jira flags &amp; offline PDF exports
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold shrink-0">
              02
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-300 uppercase font-semibold">
                Sāma &amp; Bheda
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Conciliatory framing: protect leadership from regulatory fines
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-xs font-bold shrink-0">
              03
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-300 uppercase font-semibold">
                Whistleblower Shield
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                IEEE 3.2 non-retaliation &amp; external compliance safeguards
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Script Execution Output */}
        <div className="p-5 rounded-2xl bg-black/60 border border-cyan-500/20 font-mono text-xs leading-relaxed space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>DIPLOMATIC PROTOCOL &bull; VERBATIM DIALOGUE</span>
            </div>
            <span className="text-slate-500 font-mono">Calibrated For 1-on-1 Counsel</span>
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-slate-200 font-sans leading-relaxed text-xs sm:text-sm whitespace-pre-wrap">
            {section2Text || "Generating calibrated tactical execution scripts and safe dialogue phrasing..."}
          </div>
        </div>
      </div>
    </div>
  );
}
