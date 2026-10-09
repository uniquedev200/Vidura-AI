"use client";

import Link from "next/link";
import { Compass, ChevronLeft, ShieldCheck, Zap } from "lucide-react";
import ChatInterface from "@/components/console/ChatInterface";

export default function ConsolePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#08090C]/85 border-b border-amber-500/15 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
          {/* Back to Home & Brand */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </Link>

            <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif text-base font-bold text-white tracking-tight">
                  Vidura-AI Counsel Chamber
                </span>
                <span className="text-[10px] font-mono text-amber-400/80 uppercase block -mt-0.5">
                  Indic Cyber-Sabhā Mode
                </span>
              </div>
            </div>
          </div>

          {/* System Status Indicators */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Engine Online</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Dharmic Alignment: Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Counsel Interface */}
      <div className="flex-1">
        <ChatInterface />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#08090C]/90 py-6 px-4 text-center text-xs font-mono text-slate-500">
        Vidura-AI &bull; Enterprise Moral Governance Engine &bull; All Sessions Cryptographically Grounded
      </footer>
    </main>
  );
}
