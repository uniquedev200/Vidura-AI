"use client";

import { Shield, Database, Zap, Server } from "lucide-react";

const PIPELINE_STAGES = [
  {
    stage: "STAGE 01",
    name: "Dilemma Parameterization",
    subsystem: "Next.js 16 App Router Client",
    icon: Shield,
    inputSpec: "Role asymmetry, counterparty rank, organizational pressure, primary fear",
    outputSpec: "Structured JSON dilemma payload with risk-tilt telemetry",
    description:
      "Captures multidimensional coercion parameters alongside the practitioner's narrative brief and computes initial risk asymmetry on the Dharma-Artha scale.",
  },
  {
    stage: "STAGE 02",
    name: "Dual-Index Vector & Keyword Retrieval",
    subsystem: "Upstash Vector + Canonical Shloka Registry",
    icon: Database,
    inputSpec: "Parameterized dilemma query string",
    outputSpec: "Top-K Vidura Nīti shloka with PDF folio & Y-axis locus + ACM/IEEE clauses",
    description:
      "Queries the 1536-dimensional Upstash Vector index and OCR-verified Vidura Nīti registry to resolve the exact manuscript page number and bounding box.",
  },
  {
    stage: "STAGE 03",
    name: "Four-Pillar Sūtra Synthesis",
    subsystem: "FastAPI SSE Stream + Groq LPU Cluster",
    icon: Zap,
    inputSpec: "Retrieved Sanskrit shloka, Ganguli translation, ACM/IEEE clauses",
    outputSpec: "Real-time token stream structured into Pillars I-IV",
    description:
      "Streams the four-pillar deliberation: Saṅkaṭa Nirūpaṇa (diagnosis), Pramāṇa (canonical alignment), Dharma-Artha Viveka (consequence matrix), and Upāya Prayoga (spoken script).",
  },
  {
    stage: "STAGE 04",
    name: "Codex Illumination & Telemetry Audit",
    subsystem: "3D Manuscript Viewer + Supabase PostgreSQL",
    icon: Server,
    inputSpec: "Resolved folio number, OCR bounding box, practitioner Likert rating",
    outputSpec: "Illuminated dual-folio spread + persistent evaluation record",
    description:
      "Riffles the 3D Udyoga Parva codex to the target folio, illuminates the verbatim passage in gold leaf, and logs evaluation telemetry to Supabase.",
  },
];

export default function ArchitectureSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#262A36]">
      {/* Left-Aligned Section Header */}
      <div className="max-w-3xl mb-14">
        <div className="border-l-2 border-amber-500 pl-3.5 py-0.5 mb-3">
          <span className="text-xs uppercase font-mono tracking-[0.18em] text-amber-400 font-semibold">
            § 03 // System Topology &amp; Data Pipeline
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F3F4F6] tracking-tight">
          End-to-End <span className="text-[#E5C158]">Deliberation Architecture</span>
        </h2>
        <p className="mt-3 text-base text-slate-300 leading-relaxed">
          Four deterministic stages connecting practitioner input to archival manuscript verification and streaming tactical synthesis.
        </p>
      </div>

      {/* Architectural Specification Ledger (Distinct horizontal row layout for RHYTHM 3) */}
      <div className="rounded-lg bg-[#0F1117] border border-[#262A36] divide-y divide-[#1E222D] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
        {PIPELINE_STAGES.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.stage}
              className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:bg-white/[0.015] transition-colors"
            >
              {/* Col 1-3: Stage Number & Subsystem */}
              <div className="lg:col-span-3 space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  <IconComponent className="w-4 h-4 text-amber-400" />
                  <span>{item.stage}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#F3F4F6]">
                  {item.name}
                </h3>
                <div className="text-xs font-mono text-slate-400">
                  {item.subsystem}
                </div>
              </div>

              {/* Col 4-8: Architectural Description */}
              <div className="lg:col-span-5 text-sm text-slate-300 leading-relaxed">
                {item.description}
              </div>

              {/* Col 9-12: Input / Output Contract */}
              <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 text-xs font-mono bg-[#050608] p-4 rounded-md border border-[#262A36]">
                <div>
                  <span className="text-slate-400 uppercase">IN: </span>
                  <span className="text-slate-200">{item.inputSpec}</span>
                </div>
                <div className="pt-2 border-t border-[#1E222D]">
                  <span className="text-amber-400 uppercase">OUT: </span>
                  <span className="text-amber-100">{item.outputSpec}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
