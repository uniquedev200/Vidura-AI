"use client";

import Link from "next/link";
import { BookOpen, Compass, Scroll, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column (7 Cols): Editorial Thesis & Primary Controls */}
        <div className="lg:col-span-7 text-left space-y-6">
          <div className="border-l-2 border-amber-500 pl-3.5 py-0.5">
            <span className="text-xs uppercase tracking-[0.18em] text-amber-400 font-mono font-semibold">
              Udyoga Parva &bull; Adhyāyas 33&ndash;40 &bull; Prajāgara Parva
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F3F4F6] leading-[1.12]">
            When Fiduciary Duty Collides With{" "}
            <span className="text-[#E5C158] italic font-normal">
              Sovereign Authority.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            An archival decision-support engine for engineers facing executive coercion, suppressed safety audits, or disparate-impact launches. Vidura-AI cross-references the 1890{" "}
            <span className="text-amber-200 font-serif italic">Udyoga Parva</span>{" "}
            manuscript codex with statutory{" "}
            <span className="text-[#F3F4F6] font-medium">
              ACM and IEEE Codes of Ethics
            </span>{" "}
            to formulate spoken de-escalation scripts and verifiable paper trails.
          </p>

          {/* Action Controls (44px+ height, specific labels, zero decorative arrows) */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/console"
              className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 py-3.5 rounded-md bg-amber-500 hover:bg-amber-400 text-[#08090C] font-semibold text-sm font-mono uppercase tracking-wider transition-colors"
            >
              <Compass className="w-4 h-4 text-[#08090C]" />
              <span>Consult the Sabhā</span>
            </Link>

            <a
              href="#research"
              className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-6 py-3.5 rounded-md bg-[#0F1117] hover:bg-[#161922] border border-[#262A36] hover:border-amber-500/40 text-slate-200 font-mono text-xs uppercase tracking-wider transition-colors"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Examine Corpus Grounding</span>
            </a>
          </div>

          {/* Grounded Corpus Specification Strip */}
          <div className="pt-6 border-t border-[#262A36] grid grid-cols-3 gap-6">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F3F4F6]">
                303
              </div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mt-1">
                Archival Folios
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                1890 Ganguli Udyoga Parva
              </div>
            </div>

            <div className="border-l border-[#262A36] pl-6">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F3F4F6]">
                13
              </div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mt-1">
                OCR Shloka Loci
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Adhyāyas 33&ndash;40 Verified
              </div>
            </div>

            <div className="border-l border-[#262A36] pl-6">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F3F4F6]">
                12
              </div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mt-1">
                Statutory Clauses
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                ACM 2018 &amp; IEEE Codes
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 Cols): Live Archival Specimen Dossier */}
        <div className="lg:col-span-5">
          <div className="rounded-lg bg-[#0F1117] border border-amber-500/35 p-6 space-y-5 shadow-[0_8px_28px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#262A36]">
              <div className="flex items-center gap-2">
                <Scroll className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
                  Specimen Locus &bull; § 33.16
                </span>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-sm bg-[#1A160B] text-amber-300 border border-amber-500/30">
                Folio 111 &bull; Y=68.5%
              </span>
            </div>

            {/* Canonical Sanskrit IAST */}
            <div className="p-4 rounded-md bg-[#050608] border border-[#262A36] space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Canonical Sanskrit Transliteration (BORI Critical Edition)
              </div>
              <p className="font-serif italic text-sm text-amber-200 leading-relaxed">
                &ldquo;Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ |
                <br />
                Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ ||&rdquo;
              </p>
            </div>

            {/* Verbatim Printed Translation on Folio 111 */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400">
                Verbatim 1890 Folio 111 Translation
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif italic bg-[#13161F] p-3.5 rounded-md border border-[#262A36]">
                &ldquo;They are abundant, O king, that can always speak agreeable words. The speaker, however, is rare, as also the hearer, of words that are disagreeable but medicinal.&rdquo;
              </p>
            </div>

            {/* Statutory Cross-Reference */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs font-mono">
              <div className="p-3 rounded-md bg-[#050608] border border-[#262A36]">
                <div className="text-slate-400 text-[11px]">STATUTORY PARALLEL</div>
                <div className="text-[#F3F4F6] font-semibold mt-0.5">
                  ACM Clauses 1.2 &amp; 2.5
                </div>
                <div className="text-amber-400 text-[11px] mt-0.5">
                  Disclose Systemic Harm
                </div>
              </div>
              <div className="p-3 rounded-md bg-[#050608] border border-[#262A36]">
                <div className="text-slate-400 text-[11px]">TACTICAL DOCTRINE</div>
                <div className="text-[#F3F4F6] font-semibold mt-0.5">
                  Pathya-Vacana
                </div>
                <div className="text-emerald-400 text-[11px] mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Medicinal Dissent</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#262A36] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                3D Dual-Folio Manuscript Viewer Ready
              </span>
              <Link
                href="/console"
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 py-1"
              >
                Inspect Folio 111 in Chamber
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
