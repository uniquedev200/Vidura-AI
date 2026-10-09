"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Terminal, Scroll, Scale, Shield, AlertTriangle } from "lucide-react";

interface PillarRendererProps {
  content: string;
}

export default function PillarRenderer({ content }: PillarRendererProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (codeText: string, idx: number) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="prose prose-invert prose-amber max-w-none font-sans text-slate-200 text-sm leading-relaxed space-y-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white border-b border-amber-500/30 pb-3 mt-8 mb-4 gold-gradient-text">
              {children}
            </h1>
          ),
          h2: ({ children }) => {
            const headingStr = String(children);
            const isPillar = headingStr.includes("PILLAR") || headingStr.includes("I.") || headingStr.includes("II.") || headingStr.includes("III.") || headingStr.includes("IV.");
            return (
              <div className="mt-8 mb-4 pt-4 border-t border-amber-500/20">
                {isPillar && (
                  <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>IMPERIAL SŪTRA DELIBERATION</span>
                  </div>
                )}
                <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-amber-200 flex items-center gap-2">
                  {children}
                </h2>
              </div>
            );
          },
          h3: ({ children }) => (
            <h3 className="font-serif text-lg font-semibold text-white mt-6 mb-3 flex items-center gap-2">
              <span className="text-amber-400 font-mono text-xs">§</span>
              <span>{children}</span>
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-mono text-xs uppercase tracking-wider text-amber-300 font-semibold mt-4 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-slate-300 leading-relaxed my-3 font-light text-sm sm:text-base">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-amber-200">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="p-4 rounded-xl bg-black/40 border-l-4 border-amber-500/60 font-serif italic text-amber-100 my-4">
              {children}
            </blockquote>
          ),
          hr: () => (
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-amber-500/20" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#08090C] px-3 font-mono text-xs text-amber-400">§ ◆ §</span>
              </div>
            </div>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-2xl border border-amber-500/25 bg-slate-950/70 shadow-lg">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono uppercase tracking-wider text-xs">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-white/5 font-sans text-slate-300">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-white/[0.02] transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="py-3.5 px-4 font-semibold text-amber-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="py-3 px-4 leading-relaxed align-top">
              {children}
            </td>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 space-y-1.5 my-3 text-slate-300 marker:text-amber-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 space-y-1.5 my-3 text-slate-300 marker:text-amber-400 font-mono">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-1 text-sm">{children}</li>
          ),
          code: ({ className, children, ...props }) => {
            const codeString = String(children).replace(/\n$/, "");
            const isMultiline = codeString.includes("\n");

            if (!isMultiline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-black/60 border border-amber-500/25 text-amber-300 font-mono text-xs"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="relative my-5 rounded-2xl bg-black/80 border border-amber-500/30 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-slate-950 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2 text-amber-300 font-medium">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>CANONICAL ARTIFACT &bull; VERBATIM PROTOCOL</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(codeString, Math.random())}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                  >
                    <Copy className="w-3 h-3 text-amber-400" />
                    <span>Copy Text</span>
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto font-mono text-xs text-amber-100 leading-relaxed bg-black/60">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
