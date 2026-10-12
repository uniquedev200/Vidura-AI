"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  X,
  RotateCcw,
  Compass,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Configure PDF.js worker safely for Next.js App Router client execution
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

export interface AncientManuscriptBookViewerProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;           // Path to local public/udyoga_parva.pdf
  targetPage: number;       // Exact page returned from Upstash Vector metadata
  highlightText: string;    // Sanskrit/English search snippet to illuminate
  verseId: string;          // e.g. "33.16"
  confidenceScore: number;  // Cosine match e.g. 0.924
  sanskritVerse?: string;   // Optional transliterated Sanskrit shloka for gold-foil illumination
  englishTranslation?: string;
}

export default function AncientManuscriptBookViewer({
  isOpen,
  onClose,
  pdfUrl,
  targetPage = 79,
  highlightText = "Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ",
  verseId = "33.16",
  confidenceScore = 0.924,
  sanskritVerse,
  englishTranslation,
}: AncientManuscriptBookViewerProps) {
  const [numPages, setNumPages] = useState<number>(303);
  // Left folio (Verso) is targetPage - 1 so that Right folio (Recto) displays targetPage (page N)
  const initialLeftPage = Math.max(1, targetPage - 1);
  const [currentPage, setCurrentPage] = useState<number>(initialLeftPage);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [pdfLoaded, setPdfLoaded] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Sync spread whenever modal opens or targetPage updates
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(Math.max(1, targetPage - 1));
    }
  }, [isOpen, targetPage]);

  // Handle Escape key to close codex
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handleTurnPrior();
      if (e.key === "ArrowRight") handleTurnNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const leftFolioPage = currentPage;
  const rightFolioPage = Math.min(numPages, currentPage + 1);
  const isTargetOnSpread =
    leftFolioPage === targetPage || rightFolioPage === targetPage;

  const onDocumentLoadSuccess = ({ numPages: total }: { numPages: number }) => {
    setNumPages(total || 303);
    setPdfLoaded(true);
    setPdfError(null);
  };

  const onDocumentLoadError = (err: Error) => {
    setPdfError(err.message || "Unable to load archival manuscript PDF.");
  };

  const handleTurnPrior = useCallback(() => {
    if (currentPage <= 1 || isFlipping) return;
    setFlipDirection("prev");
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => Math.max(1, prev - 2));
      setIsFlipping(false);
    }, 260);
  }, [currentPage, isFlipping]);

  const handleTurnNext = useCallback(() => {
    if (currentPage + 2 > numPages || isFlipping) return;
    setFlipDirection("next");
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage((prev) => Math.min(Math.max(1, numPages - 1), prev + 2));
      setIsFlipping(false);
    }, 260);
  }, [currentPage, numPages, isFlipping]);

  const handleRealignTarget = useCallback(() => {
    const desiredLeft = Math.max(1, targetPage - 1);
    if (currentPage === desiredLeft) return;
    setFlipDirection(desiredLeft > currentPage ? "next" : "prev");
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(desiredLeft);
      setIsFlipping(false);
    }, 260);
  }, [currentPage, targetPage]);

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(0.75, Number((prev - 0.1).toFixed(2))));
  };

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(1.4, Number((prev + 0.1).toFixed(2))));
  };

  // Extract significant search tokens from highlightText for text layer illumination
  const highlightTokens = useMemo(() => {
    if (!highlightText) return [];
    const cleaned = highlightText
      .replace(/[|॥.,;:"'()[\]]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 4);
    return Array.from(new Set(cleaned)).slice(0, 10);
  }, [highlightText]);

  // Custom Text Renderer that wraps matching substrings in <mark class="manuscript-glow">
  const customTextRenderer = useCallback(
    (textItem: { str: string }) => {
      const str = textItem.str;
      if (!str || !highlightText) return str;

      // Direct full or partial match check
      const escapedFull = highlightText
        .trim()
        .slice(0, 40)
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      if (escapedFull.length > 3) {
        const fullRegex = new RegExp(`(${escapedFull})`, "gi");
        if (fullRegex.test(str)) {
          return str.replace(
            fullRegex,
            '<mark class="manuscript-glow">$1</mark>'
          );
        }
      }

      // Token-level illumination for Sanskrit/English phrases
      for (const token of highlightTokens) {
        const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const tokenRegex = new RegExp(`(${escapedToken})`, "gi");
        if (tokenRegex.test(str)) {
          return str.replace(
            tokenRegex,
            '<mark class="manuscript-glow">$1</mark>'
          );
        }
      }

      return str;
    },
    [highlightText, highlightTokens]
  );

  if (!isOpen) return null;

  const baseFolioWidth = Math.round(370 * zoomScale);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/90 backdrop-blur-md p-3 sm:p-6 overflow-y-auto select-none"
      >
        {/* TOP BAR: Archival Provenance, Verse Badge, Cosine Match Pill, Close Button */}
        <div className="w-full max-w-7xl rounded-2xl bg-[#120d09]/95 border border-[#4a321f] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-20">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-amber-400/90">
                <span>✦ ARCHIVAL CODEX VERIFICATION</span>
                <span>◆</span>
                <span className="text-amber-200/80">
                  BORI Critical Edition • Udyoga Parva
                </span>
              </div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-amber-100 tracking-wide">
                Prajāgara Parva (Vidura Nīti) • Royal Manuscript Inspection
              </h3>
            </div>
          </div>

          {/* Right Badges & Close */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Verse Badge */}
            <div className="px-3 py-1.5 rounded-lg bg-amber-950/70 border border-amber-500/50 text-amber-200 font-serif text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <span className="text-amber-400">§</span>
              <span>Verse {verseId}</span>
            </div>

            {/* Cosine Match Pill */}
            <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Cosine Match: {(confidenceScore * 100).toFixed(1)}% (
                {confidenceScore.toFixed(3)})
              </span>
            </div>

            {/* Close Codex Button */}
            <button
              onClick={onClose}
              title="Close Archival Codex (Esc)"
              className="p-2 rounded-xl bg-[#241811] hover:bg-[#382315] text-amber-200/80 hover:text-amber-100 border border-[#523622] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CENTER STAGE: 3D OPEN DUAL-FOLIO ANCIENT MANUSCRIPT CODEX */}
        <div className="my-auto py-4 w-full flex items-center justify-center perspective-1000 overflow-x-auto">
          {/* Outer Leather / Aged Oak Binding Board */}
          <motion.div
            initial={{ scale: 0.94, rotateX: 6, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative rounded-2xl bg-[#1b120c] border-4 border-[#382315] p-3 sm:p-5 shadow-[0_30px_90px_rgba(0,0,0,0.95),inset_0_0_24px_rgba(0,0,0,0.85)]"
          >
            {/* Brass Corner Fittings (4 Ornate Corner Brackets) */}
            <div className="pointer-events-none absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#c59b27] rounded-tl-xl shadow-[0_0_10px_rgba(197,155,39,0.35)] z-30">
              <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#e6c665]" />
            </div>
            <div className="pointer-events-none absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#c59b27] rounded-tr-xl shadow-[0_0_10px_rgba(197,155,39,0.35)] z-30">
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#e6c665]" />
            </div>
            <div className="pointer-events-none absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#c59b27] rounded-bl-xl shadow-[0_0_10px_rgba(197,155,39,0.35)] z-30">
              <span className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#e6c665]" />
            </div>
            <div className="pointer-events-none absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#c59b27] rounded-br-xl shadow-[0_0_10px_rgba(197,155,39,0.35)] z-30">
              <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#e6c665]" />
            </div>

            {/* Stacked Leaf Thickness Illusion (Aged Vellum Page Block Edges) */}
            <div className="relative rounded-lg bg-gradient-to-r from-[#6e5231] via-[#8a6a43] to-[#6e5231] p-[6px] shadow-[0_12px_35px_rgba(0,0,0,0.8)]">
              {/* Secondary Inner Leaf Stack Layer */}
              <div className="relative rounded bg-gradient-to-b from-[#a8895c] via-[#8a6a43] to-[#5e4527] p-[4px]">
                {/* PDF Document Wrapper */}
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="w-[740px] h-[540px] flex flex-col items-center justify-center bg-[#dfd1b4] text-[#3a2610] font-serif p-12 text-center">
                      <Compass className="w-10 h-10 text-[#8c5a18] animate-spin mb-3" />
                      <p className="text-base font-bold tracking-wider uppercase">
                        Unsealing Royal Archival Manuscript...
                      </p>
                      <p className="text-xs font-mono text-[#5c3e18] mt-1">
                        Retrieving BORI Critical Edition Folio {targetPage} (
                        {pdfUrl})
                      </p>
                    </div>
                  }
                >
                  {/* Dual-Folio Spread with 3D Flip Animation */}
                  <motion.div
                    key={`spread-${leftFolioPage}-${rightFolioPage}`}
                    initial={{
                      rotateY: isFlipping
                        ? flipDirection === "next"
                          ? 12
                          : -12
                        : 0,
                      opacity: 0.88,
                    }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="relative grid grid-cols-1 lg:grid-cols-2 bg-[#e8dabf] rounded-sm overflow-hidden shadow-inner"
                  >
                    {/* ================= LEFT FOLIO (VERSO) ================= */}
                    <div
                      className="relative flex flex-col justify-between bg-[#e6d6b8] text-[#2b1d0c] p-4 sm:p-5 select-text"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 60% 45%, rgba(244,234,212,0.5) 0%, rgba(212,188,144,0.45) 70%, rgba(161,126,80,0.65) 100%)",
                      }}
                    >
                      {/* Aged Edge Shadow along Right Spine Gutter */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/35 via-black/10 to-transparent z-10" />

                      {/* Top Verso Header */}
                      <div className="relative z-10 flex items-center justify-between border-b border-[#8a6a43]/40 pb-2 mb-2 text-[11px] font-serif tracking-widest text-[#4a3214]">
                        <span className="font-mono uppercase text-[10px] text-[#6b4c24]">
                          FOLIO {leftFolioPage} • VERSO
                        </span>
                        <span className="font-bold">॥ उद्योगपर्व • प्रजागर ॥</span>
                      </div>

                      {/* Rendered PDF Page (Verso) */}
                      <div className="relative z-0 flex-1 flex items-center justify-center min-h-[460px] parchment-ink-filter overflow-hidden">
                        {pdfError ? (
                          <div className="p-6 text-center text-xs font-serif text-[#5a3e1b]">
                            <p className="font-bold mb-1">
                              Archival Folio {leftFolioPage}
                            </p>
                            <p className="opacity-80">{pdfError}</p>
                          </div>
                        ) : (
                          <Page
                            pageNumber={leftFolioPage}
                            width={baseFolioWidth}
                            renderTextLayer={true}
                            renderAnnotationLayer={false}
                            customTextRenderer={customTextRenderer}
                            loading={
                              <div className="w-[340px] h-[440px] flex items-center justify-center text-xs font-serif text-[#6b4c24]">
                                Rendering Verso Folio {leftFolioPage}...
                              </div>
                            }
                          />
                        )}
                      </div>

                      {/* Bottom Verso Footer */}
                      <div className="relative z-10 flex items-center justify-between border-t border-[#8a6a43]/35 pt-2 mt-2 text-[10px] font-mono text-[#5c401d]">
                        <span>MAHĀBHĀRATA • BOOK V</span>
                        <span>p. {leftFolioPage}</span>
                      </div>
                    </div>

                    {/* ================= CENTRAL SEWN SPINE & SILK BOOKMARK ================= */}
                    <div className="hidden lg:flex pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-7 z-30 flex-col items-center justify-between py-6">
                      {/* Deep Center Spine Crease */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-[#1a0f07]/90 to-black/45 shadow-[0_0_15px_rgba(0,0,0,0.75)]" />

                      {/* Visible Sewn Binding Thread Stitches */}
                      {[0, 1, 2, 3, 4, 5].map((stitch) => (
                        <div
                          key={stitch}
                          className="relative z-10 w-4 h-[2px] bg-[#c9ab78]/70 rounded-full shadow-sm"
                        />
                      ))}

                      {/* Hanging Crimson Silk Ribbon Bookmark */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-[104%] bg-gradient-to-b from-[#9e1919] via-[#8b1515] to-[#630d0d] shadow-[0_4px_12px_rgba(0,0,0,0.65)] border-x border-[#b82828]/30">
                        {/* Ribbon Gold Trim */}
                        <div className="w-[1px] h-full mx-auto bg-[#d4af37]/30" />
                      </div>
                    </div>

                    {/* ================= RIGHT FOLIO (RECTO / TARGET PAGE) ================= */}
                    <div
                      className="relative flex flex-col justify-between bg-[#eadbc0] text-[#2b1d0c] p-4 sm:p-5 select-text"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 40% 45%, rgba(247,238,218,0.55) 0%, rgba(216,192,148,0.45) 70%, rgba(161,126,80,0.65) 100%)",
                      }}
                    >
                      {/* Aged Edge Shadow along Left Spine Gutter */}
                      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/35 via-black/10 to-transparent z-10" />

                      {/* Top Recto Header */}
                      <div className="relative z-10 flex items-center justify-between border-b border-[#8a6a43]/40 pb-2 mb-2 text-[11px] font-serif tracking-widest text-[#4a3214]">
                        <span className="font-bold">॥ विदुरनीति मन्त्र ॥</span>
                        <span className="font-mono uppercase text-[10px] text-[#6b4c24]">
                          FOLIO {rightFolioPage} • RECTO
                        </span>
                      </div>

                      {/* Rendered PDF Page (Recto) + Gold-Foil Illumination Overlay */}
                      <div className="relative z-0 flex-1 flex items-center justify-center min-h-[460px] parchment-ink-filter overflow-hidden">
                        {pdfError ? (
                          <div className="p-6 text-center text-xs font-serif text-[#5a3e1b]">
                            <p className="font-bold mb-1">
                              Archival Folio {rightFolioPage}
                            </p>
                            <p className="opacity-80">{pdfError}</p>
                          </div>
                        ) : (
                          <Page
                            pageNumber={rightFolioPage}
                            width={baseFolioWidth}
                            renderTextLayer={true}
                            renderAnnotationLayer={false}
                            customTextRenderer={customTextRenderer}
                            loading={
                              <div className="w-[340px] h-[440px] flex items-center justify-center text-xs font-serif text-[#6b4c24]">
                                Rendering Recto Folio {rightFolioPage}...
                              </div>
                            }
                          />
                        )}

                        {/* ACTIVE GOLD-FOIL ILLUMINATION BOX ON TARGET FOLIO */}
                        {isTargetOnSpread && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="absolute inset-x-3 bottom-3 z-20 rounded-lg border-2 border-[#b5801e] bg-gradient-to-br from-[#f8edd2]/95 via-[#f3e1b6]/95 to-[#e8ce92]/95 p-3.5 shadow-[0_0_25px_rgba(201,151,56,0.65),inset_0_1px_2px_rgba(255,255,255,0.6)]"
                          >
                            <div className="flex items-center justify-between border-b border-[#a87424]/40 pb-1.5 mb-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#6e460c] flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-[#9e6610]" />
                                <span>
                                  ✦ ILLUMINATED PRAMĀṆA LOCUS • § {verseId}
                                </span>
                              </span>
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#a87424]/20 text-[#523407] border border-[#a87424]/40">
                                Folio {targetPage} Verified
                              </span>
                            </div>

                            <div className="font-serif text-xs sm:text-[13px] leading-snug text-[#2c1d07] italic mb-1.5">
                              <mark className="manuscript-glow">
                                {sanskritVerse || highlightText}
                              </mark>
                            </div>

                            {englishTranslation && (
                              <p className="text-[11px] font-sans text-[#3d290b] leading-relaxed line-clamp-2">
                                &ldquo;{englishTranslation}&rdquo;
                              </p>
                            )}
                          </motion.div>
                        )}
                      </div>

                      {/* Bottom Recto Footer */}
                      <div className="relative z-10 flex items-center justify-between border-t border-[#8a6a43]/35 pt-2 mt-2 text-[10px] font-mono text-[#5c401d]">
                        <span>
                          {isTargetOnSpread
                            ? `✦ TARGET VERSE § ${verseId} LOCATED`
                            : "UDYOGA PARVA"}
                        </span>
                        <span>p. {rightFolioPage}</span>
                      </div>
                    </div>
                  </motion.div>
                </Document>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM BAR: Folio Spread Tracker, Turn Prior/Next, Re-Align Target Verse, Zoom Controls */}
        <div className="w-full max-w-7xl rounded-2xl bg-[#120d09]/95 border border-[#4a321f] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.85)] z-20">
          {/* Left: Folio Spread Tracker */}
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-[#241811] border border-[#523622] font-mono text-xs text-amber-200">
              Folio {leftFolioPage}&ndash;{rightFolioPage} of {numPages}
            </span>
            {pdfLoaded && (
              <span className="hidden md:inline-block text-xs font-serif italic text-amber-400/80">
                § Target Citation Mapped to Folio {targetPage}
              </span>
            )}
          </div>

          {/* Center: Folio Turning & Target Re-Alignment Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleTurnPrior}
              disabled={currentPage <= 1 || isFlipping}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#241811] hover:bg-[#382315] disabled:opacity-40 border border-[#523622] text-amber-200 text-xs font-serif uppercase tracking-wider transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-amber-400" />
              <span>Turn Prior Folio</span>
            </button>

            <button
              onClick={handleRealignTarget}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-serif uppercase tracking-wider transition-all cursor-pointer ${
                isTargetOnSpread
                  ? "bg-amber-500/20 border-amber-400/60 text-amber-200 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                  : "bg-amber-950/60 hover:bg-amber-900/60 border-amber-500/50 text-amber-300"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Re-Align Target Verse (§ {verseId})</span>
            </button>

            <button
              onClick={handleTurnNext}
              disabled={currentPage + 2 > numPages || isFlipping}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#241811] hover:bg-[#382315] disabled:opacity-40 border border-[#523622] text-amber-200 text-xs font-serif uppercase tracking-wider transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Turn Next Folio</span>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Right: Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoomScale <= 0.75}
              title="Zoom Out Folio"
              className="p-2 rounded-xl bg-[#241811] hover:bg-[#382315] disabled:opacity-40 border border-[#523622] text-amber-200 transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs text-amber-300 min-w-[46px] text-center">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomScale >= 1.4}
              title="Zoom In Folio"
              className="p-2 rounded-xl bg-[#241811] hover:bg-[#382315] disabled:opacity-40 border border-[#523622] text-amber-200 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
