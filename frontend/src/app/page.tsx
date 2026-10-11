"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Menu, X } from "lucide-react";
import Hero from "@/components/landing/Hero";
import StickyScrollStory from "@/components/landing/StickyScrollStory";
import ResearchGrounding from "@/components/landing/ResearchGrounding";
import ArchitectureSection from "@/components/landing/ArchitectureSection";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-100">
      {/* Sticky Top Header (1 of 2 permitted backdrop-blur elements per R-10) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#08090C]/85 border-b border-[#262A36] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-md bg-[#12151E] border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-[#F3F4F6] block">
                VIDURA<span className="text-amber-400">&bull;AI</span>
              </span>
              <span className="text-[11px] font-mono tracking-widest text-slate-300 uppercase block -mt-0.5">
                Archival Statecraft &amp; Governance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-8 text-xs font-mono text-slate-300"
          >
            <a
              href="#narrative"
              className="py-2 hover:text-amber-300 transition-colors"
            >
              01. CASE PRECEDENT
            </a>
            <a
              href="#research"
              className="py-2 hover:text-amber-300 transition-colors"
            >
              02. CORPUS GROUNDING
            </a>
            <a
              href="#architecture"
              className="py-2 hover:text-amber-300 transition-colors"
            >
              03. SYSTEM TOPOLOGY
            </a>
          </nav>

          {/* Primary Action & Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            <Link
              href="/console"
              className="hidden sm:inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-md bg-amber-500 hover:bg-amber-400 text-[#08090C] font-semibold text-xs font-mono uppercase tracking-wider transition-colors"
            >
              Consult the Sabhā
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="md:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md bg-[#0F1117] border border-[#262A36] text-slate-200 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Navigation Drawer (R-03) */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="md:hidden border-t border-[#262A36] bg-[#0B0D13] py-4 px-2 space-y-1 font-mono text-xs"
          >
            <a
              href="#narrative"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-md text-slate-200 hover:bg-[#141824] hover:text-amber-300 transition-colors"
            >
              01. Case Precedent
            </a>
            <a
              href="#research"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-md text-slate-200 hover:bg-[#141824] hover:text-amber-300 transition-colors"
            >
              02. Corpus Grounding
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center min-h-[44px] px-3 rounded-md text-slate-200 hover:bg-[#141824] hover:text-amber-300 transition-colors"
            >
              03. System Topology
            </a>
            <div className="pt-2">
              <Link
                href="/console"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center min-h-[44px] w-full px-4 py-2.5 rounded-md bg-amber-500 hover:bg-amber-400 text-[#08090C] font-semibold uppercase tracking-wider transition-colors"
              >
                Consult the Sabhā
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Asymmetric Split Editorial Hero */}
      <Hero />

      {/* Section 01: Interactive Case Precedent Ledger */}
      <div id="narrative">
        <StickyScrollStory />
      </div>

      {/* Section 02: Empirical Corpus Grounding & Comparative Matrix */}
      <ResearchGrounding />

      {/* Section 03: Four-Stage System Topology */}
      <div id="architecture">
        <ArchitectureSection />
      </div>

      {/* Architectural Footer */}
      <footer className="border-t border-[#262A36] bg-[#08090C] py-14 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#0F1117] border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[#F3F4F6] font-bold font-serif tracking-wide">
                VIDURA-AI ARCHIVAL GOVERNANCE
              </div>
              <div className="text-slate-400 mt-0.5">
                BORI Critical Edition &bull; 1890 Ganguli Udyoga Parva &bull; ACM &amp; IEEE Codes
              </div>
            </div>
          </div>

          <div className="text-left md:text-right space-y-1 text-slate-400">
            <div>FastAPI SSE &bull; Upstash Vector &bull; Groq LPU &bull; Supabase PostgreSQL</div>
            <div>
              &copy; 2026 Vidura-AI Governance Systems. Verbatim Archival Provenance.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
