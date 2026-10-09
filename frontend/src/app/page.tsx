"use client";

import Link from "next/link";
import { Compass, Shield, BookOpen, Layers, ArrowRight } from "lucide-react";
import Hero from "@/components/landing/Hero";
import StickyScrollStory from "@/components/landing/StickyScrollStory";
import ResearchGrounding from "@/components/landing/ResearchGrounding";
import ArchitectureSection from "@/components/landing/ArchitectureSection";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#08090C]/60 border-b border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-[1px]">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-amber-400 group-hover:text-amber-300 transition-colors">
                <Compass className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-white block">
                VIDURA<span className="text-amber-400">&bull;AI</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block -mt-1">
                Moral Governance Platform
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-slate-300">
            <a href="#narrative" className="hover:text-amber-300 transition-colors">
              NARRATIVE
            </a>
            <a href="#research" className="hover:text-amber-300 transition-colors">
              RESEARCH GROUNDING
            </a>
            <a href="#architecture" className="hover:text-amber-300 transition-colors">
              SYSTEM ARCHITECTURE
            </a>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <Link
              href="/console"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs font-mono transition-all duration-200 hover:scale-[1.02] shadow-[0_0_20px_-4px_rgba(245,158,11,0.5)]"
            >
              <span>ENTER CHAMBER</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero />

      {/* Sticky Scroll Narrative Story */}
      <div id="narrative">
        <StickyScrollStory />
      </div>

      {/* Research & Benchmarks Section */}
      <ResearchGrounding />

      {/* System Architecture Section */}
      <div id="architecture">
        <ArchitectureSection />
      </div>

      {/* Enterprise Footer */}
      <footer className="border-t border-white/10 bg-[#08090C]/70 py-16 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-300 font-bold font-serif">VIDURA-AI RESEARCH</div>
              <div>Grounded in BORI Critical Edition &bull; ACM / IEEE Standards</div>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <div>Groq Cloud &bull; Upstash Vector &bull; Supabase PostgreSQL</div>
            <div className="text-slate-600">
              &copy; 2026 Vidura-AI Governance Systems. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
