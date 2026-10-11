"use client";

import Link from "next/link";
import { Compass, ChevronLeft, ShieldCheck } from "lucide-react";
import ChatInterface from "@/components/console/ChatInterface";

export default function ConsolePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-100">
      {/* Sticky Top Header (1 of 2 permitted backdrop-blur elements per R-10) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#08090C]/85 border-b border-[#262A36] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-md bg-[#0F1117] hover:bg-[#161922] border border-[#262A36] hover:border-amber-500/40 text-xs font-mono text-slate-200 hover:text-amber-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Overview</span>
            </Link>

            <div className="h-5 w-[1px] bg-[#262A36] hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md bg-[#0F1117] border border-amber-500/35 flex items-center justify-center text-amber-400">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif text-base font-bold text-[#F3F4F6] tracking-tight block">
                  Vidura-AI Counsel Chamber
                </span>
                <span className="text-[11px] font-mono text-amber-400 uppercase block -mt-0.5">
                  Prajāgara Deliberation Ledger
                </span>
              </div>
            </div>
          </div>

          {/* Static Grounded System Status Indicators (R-19: No endless decorative pulse) */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#0F1117] border border-[#262A36] text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Corpus Ready</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#0F1117] border border-amber-500/30 text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>BORI &amp; ACM/IEEE Indexed</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Counsel Interface */}
      <div className="flex-1">
        <ChatInterface />
      </div>

      {/* Footer */}
      <footer className="border-t border-[#262A36] bg-[#08090C] py-6 px-4 text-center text-xs font-mono text-slate-400">
        Vidura-AI &bull; Archival Governance Engine &bull; Grounded in 1890 Ganguli Udyoga Parva &amp; ACM/IEEE Codes
      </footer>
    </main>
  );
}
