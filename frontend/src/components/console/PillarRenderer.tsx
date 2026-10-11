"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, Terminal, BookOpen } from "lucide-react";

interface PillarRendererProps {
  content: string;
  onOpenArchivalCodex?: () => void;
  folioNumber?: number;
}

export default function PillarRenderer({
  content,
  onOpenArchivalCodex,
  folioNumber = 111,
}: PillarRendererProps) {
  const [copiedCodeText, setCopiedCodeText] = useState<string | null>(null);

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeText(codeText);
    setTimeout(() => setCopiedCodeText(null), 2000);
  };

  return (
    <div className="prose prose-invert prose-amber max-w-none font-sans text-slate-200 text-sm leading-relaxed space-y-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#F3F4F6] border-b border-amber-500/30 pb-3 mt-8 mb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => {
            const headingStr = String(children);
            const isPillar =
              headingStr.includes("PILLAR") ||
              headingStr.includes("I.") ||
              headingStr.includes("II.") ||
              headingStr.includes("III.") ||
              headingStr.includes("IV.");
            const isPillarTwo =
              headingStr.includes("II.") ||
              headingStr.toUpperCase().includes("PRAMĀṆA") ||
              headingStr.toUpperCase().includes("PRAMANA");
            return (
              <div className="mt-8 mb-4 pt-4 border-t border-[#262A36] flex flex-wrap items-center justify-between gap-3">
                <div>
                  {isPillar && (
                    <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>SABHĀ SŪTRA DELIBERATION</span>
                    </div>
                  )}
                  <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-amber-200 flex items-center gap-2">
                    {children}
                  </h2>
                </div>
                {isPillarTwo && onOpenArchivalCodex && (
                  <button
                    type="button"
                    onClick={onOpenArchivalCodex}
                    className="inline-flex items-center gap-2 min-h-[44px] rounded-md border border-amber-500/45 bg-[#1A140B] hover:bg-[#241C0F] px-4 py-2 text-xs font-mono uppercase tracking-wider text-amber-200 hover:border-amber-400 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Inspect Folio {folioNumber} in Codex</span>
                  </button>
                )}
              </div>
            );
          },
          h3: ({ children }) => {
            const headingStr = String(children);
            const isPillarTwo =
              headingStr.includes("II.") ||
              headingStr.toUpperCase().includes("PRAMĀṆA") ||
              headingStr.toUpperCase().includes("PRAMANA");
            return (
              <div className="mt-6 mb-3 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-lg font-semibold text-[#F3F4F6] flex items-center gap-2">
                  <span className="text-amber-400 font-mono text-xs">§</span>
                  <span>{children}</span>
                </h3>
                {isPillarTwo && onOpenArchivalCodex && (
                  <button
                    type="button"
                    onClick={onOpenArchivalCodex}
                    className="inline-flex items-center gap-2 min-h-[44px] rounded-md border border-amber-500/45 bg-[#1A140B] hover:bg-[#241C0F] px-4 py-2 text-xs font-mono uppercase tracking-wider text-amber-200 hover:border-amber-400 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Inspect Folio {folioNumber} in Codex</span>
                  </button>
                )}
              </div>
            );
          },
          h4: ({ children }) => (
            <h4 className="font-mono text-xs uppercase tracking-wider text-amber-300 font-semibold mt-4 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-slate-300 leading-relaxed my-3 text-sm sm:text-base">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-amber-200">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="p-4 rounded-md bg-[#050608] border-l-4 border-amber-500 font-serif italic text-amber-100 my-4">
              {children}
            </blockquote>
          ),
          hr: () => (
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#262A36]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0F1117] px-3 font-mono text-xs text-amber-400">
                  § ◆ §
                </span>
              </div>
            </div>
          ),
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-lg border border-[#262A36] bg-[#050608]">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-[#262A36] bg-[#12151E] text-amber-300 font-mono uppercase tracking-wider text-xs">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[#1E222D] font-sans text-slate-300">
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
          code: ({ children, ...props }) => {
            const codeString = String(children).replace(/\n$/, "");
            const isMultiline = codeString.includes("\n");
            const isCopied = copiedCodeText === codeString;

            if (!isMultiline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-sm bg-[#050608] border border-[#262A36] text-amber-300 font-mono text-xs"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="relative my-5 rounded-lg bg-[#050608] border border-[#262A36] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#262A36] bg-[#0B0D13] text-xs font-mono text-slate-300">
                  <div className="flex items-center gap-2 text-amber-300 font-medium">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>VERBATIM ARTIFACT &bull; RECORD PROTOCOL</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(codeString)}
                    type="button"
                    className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1 rounded-sm bg-[#141822] hover:bg-[#1E2433] border border-[#262A36] text-slate-200 hover:text-[#F3F4F6] transition-colors cursor-pointer text-xs"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copy Artifact</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto font-mono text-xs text-amber-100 leading-relaxed bg-[#050608]">
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
