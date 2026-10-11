"use client";

import { Check, X, BookOpen, Scale, Award } from "lucide-react";

const COMPARISON_DATA = [
  {
    criterion: "Source Grounding & Provenance",
    generic: "Unverified pre-training weights susceptible to fabricated verse numbers",
    vidura: "Dual-index retrieval: 1890 Ganguli Udyoga Parva folios (BORI concordance) + ACM/IEEE codes",
  },
  {
    criterion: "Conflict De-escalation Strategy",
    generic: "Generic HR platitudes ('escalate immediately', 'refuse directive') that trigger retaliation",
    vidura: "Classical Upāyas (Sāma, Dāna, Bheda, Daṇḍa) framing dissent as executive risk insulation",
  },
  {
    criterion: "Whistleblowing & Paper-Trail Protocol",
    generic: "Abstract ethical commentary without operational documentation steps",
    vidura: "Mantra-Gupti pre-meeting Git commit hashes, timestamped logs, and statutory disclosure memos",
  },
  {
    criterion: "Archival Manuscript Verification",
    generic: "Plain-text chat completion with zero primary document inspection",
    vidura: "Interactive 3D Dual-Folio Codex flipping to exact OCR-verified shloka coordinates",
  },
  {
    criterion: "Evaluation & Telemetry Rubric",
    generic: "Unmeasured conversational output",
    vidura: "4-dimension rubric tracking Faithfulness, Answer Relevance, Context Precision, and Actionability",
  },
  {
    criterion: "Ethical Philosophy Grounding",
    generic: "Single-framework compliance boilerplate",
    vidura: "Dharma-Artha Viveka (Shreyas vs. Preyas) cross-referenced with ACM 1.1-3.7 & IEEE 1.1-7.8",
  },
];

export default function ResearchGrounding() {
  return (
    <section
      id="research"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#262A36]"
    >
      {/* Left-Aligned Section Header */}
      <div className="max-w-3xl mb-14">
        <div className="border-l-2 border-amber-500 pl-3.5 py-0.5 mb-3">
          <span className="text-xs uppercase font-mono tracking-[0.18em] text-amber-400 font-semibold">
            § 02 // Corpus Grounding &amp; Empirical Validation
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F3F4F6] tracking-tight">
          Archival Provenance vs.{" "}
          <span className="text-[#E5C158]">Unverified Chatbots</span>
        </h2>
        <p className="mt-3 text-base text-slate-300 leading-relaxed">
          Why generic language models fail high-stakes engineering ethics disputes, and how Vidura-AI anchors every recommendation in verifiable primary texts.
        </p>
      </div>

      {/* Comparative Evaluation Matrix */}
      <div className="rounded-lg bg-[#0F1117] border border-[#262A36] p-6 sm:p-8 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#262A36] text-xs font-mono uppercase tracking-wider text-slate-300">
                <th className="py-4 px-4 font-semibold">Evaluation Dimension</th>
                <th className="py-4 px-4 font-semibold text-slate-300">
                  Generic Consumer LLMs
                </th>
                <th className="py-4 px-4 font-semibold text-amber-300 bg-[#14161F] border-x border-t border-amber-500/30">
                  Vidura-AI Archival Engine
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E222D] text-sm">
              {COMPARISON_DATA.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-semibold text-[#F3F4F6] max-w-[220px] align-top">
                    {row.criterion}
                  </td>
                  <td className="py-4 px-4 text-slate-300 max-w-[280px] align-top">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-sm bg-red-950/50 border border-red-500/40 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3.5 h-3.5 text-red-400" />
                      </div>
                      <span>{row.generic}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-amber-100 bg-[#14161F] border-x border-amber-500/30 font-medium align-top">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-sm bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span>{row.vidura}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asymmetric 7:5 Corpus Provenance Split (Replaces generic 3-equal-card row) */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Primary 7-Column Philological Ledger */}
        <div className="lg:col-span-7 rounded-lg bg-[#0F1117] border border-amber-500/35 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#262A36] pb-4">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-xl font-bold text-[#F3F4F6]">
                  Primary Manuscript Corpus: Udyoga Parva (Prajāgara Parva)
                </h3>
              </div>
              <span className="text-xs font-mono text-amber-300 px-2.5 py-0.5 rounded-sm bg-[#1A160B] border border-amber-500/30">
                Adhyāyas 33&ndash;40
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Every Sanskrit shloka in Vidura-AI is indexed from the authoritative Bhandarkar Oriental Research Institute (BORI) Critical Edition of the Mahābhārata and mapped to its exact physical page and vertical bounding-box locus inside the 303-page 1890 Kisari Mohan Ganguli archival print (
              <code className="text-xs font-mono text-amber-300 bg-[#050608] px-1.5 py-0.5 rounded-sm border border-[#262A36]">
                public/udyoga_parva.pdf
              </code>
              ).
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-md bg-[#050608] border border-[#262A36]">
                <div className="text-slate-400"> § 33.16</div>
                <div className="text-[#F3F4F6] font-semibold mt-0.5">Folio 111</div>
                <div className="text-amber-400 text-[11px]">Y = 68.5%</div>
              </div>
              <div className="p-3 rounded-md bg-[#050608] border border-[#262A36]">
                <div className="text-slate-400">§ 33.17</div>
                <div className="text-[#F3F4F6] font-semibold mt-0.5">Folio 121</div>
                <div className="text-amber-400 text-[11px]">Y = 20.0%</div>
              </div>
              <div className="p-3 rounded-md bg-[#050608] border border-[#262A36]">
                <div className="text-slate-400">§ 34.29</div>
                <div className="text-[#F3F4F6] font-semibold mt-0.5">Folio 91</div>
                <div className="text-amber-400 text-[11px]">Y = 64.0%</div>
              </div>
              <div className="p-3 rounded-md bg-[#050608] border border-[#262A36]">
                <div className="text-slate-400">§ 33.32</div>
                <div className="text-[#F3F4F6] font-semibold mt-0.5">Folio 83</div>
                <div className="text-amber-400 text-[11px]">Y = 18.2%</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#262A36] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
            <span>OCR-Verified via Windows.Media.Ocr across Folios 79&ndash;135</span>
            <span className="text-amber-400">Zero Synthetic Citations</span>
          </div>
        </div>

        {/* Secondary 5-Column Stacked Statutory & Evaluation Ledger */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="rounded-lg bg-[#0F1117] border border-[#262A36] p-6 space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif text-lg font-bold text-[#F3F4F6]">
                  ACM &amp; IEEE Statutory Index
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">12 Clauses</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Co-indexes the 2018 ACM Code of Ethics (Clauses 1.1, 1.2, 1.3, 1.4, 2.5, 3.1, 3.7) and the IEEE Code of Ethics (Clauses 1.1, 1.3, 1.5, 3.2, 7.8) to anchor every spoken script in enforceable professional standards.
            </p>
          </div>

          <div className="rounded-lg bg-[#0F1117] border border-[#262A36] p-6 space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <h3 className="font-serif text-lg font-bold text-[#F3F4F6]">
                  Supabase Evaluation Ledger
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">4 Rubric Axes</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Records session dilemmas, retrieved shloka coordinates, response latency, and practitioner Likert evaluations across Faithfulness, Answer Relevance, Context Precision, and Tactical Actionability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
