"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  X,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Maximize2,
  Minimize2,
} from "lucide-react";

export interface AncientManuscriptBookViewerProps {
  isOpen: boolean;
  onClose?: () => void;
  pdfUrl: string;           // Path to local public/udyoga_parva.pdf
  targetPage: number;       // Exact page returned from Upstash Vector metadata
  highlightText: string;    // Sanskrit/English search snippet to illuminate
  verseId: string;          // e.g. "33.16"
  confidenceScore: number;  // Cosine match e.g. 0.924
  sanskritVerse?: string;   // Transliterated Sanskrit shloka
  englishTranslation?: string;
  inline?: boolean;         // Render directly above/below the pillars on the page
  seekKey?: number | string; // Triggers automatic multi-page flip animation when counsel is generated
}

const TOTAL_MANUSCRIPT_FOLIOS = 303;

function getFolioImagePath(pageNumber: number): string {
  const clamped = Math.max(1, Math.min(112, pageNumber));
  return `/folios/folio-${clamped}.webp`;
}

export default function AncientManuscriptBookViewer({
  isOpen,
  onClose,
  targetPage = 79,
  highlightText = "Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ | Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ",
  verseId = "33.16",
  confidenceScore = 0.924,
  sanskritVerse,
  englishTranslation,
  inline = false,
  seekKey,
}: AncientManuscriptBookViewerProps) {
  // Left folio (Verso) is targetPage - 1 so Right folio (Recto) lands on targetPage
  const desiredLeftPage = Math.max(1, targetPage - 1);

  const [currentPage, setCurrentPage] = useState<number>(desiredLeftPage);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [isFullscreenModal, setIsFullscreenModal] = useState<boolean>(false);

  // 3D Page-Flipping Physics State
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [flipLeafPage, setFlipLeafPage] = useState<number>(desiredLeftPage + 1);
  const [isAutoSeeking, setIsAutoSeeking] = useState<boolean>(false);

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  // Multi-folio 3D book-flipping sequence that riffles through the codex to land on targetPage
  const runBookFlipToTargetSequence = useCallback(
    (finalTargetPage: number) => {
      clearAllTimers();
      const finalLeft = Math.max(1, finalTargetPage - 1);

      // Build intermediate spreads that visually riffle forward to the target shloka page
      const stops = [
        Math.max(1, finalLeft - 48),
        Math.max(1, finalLeft - 32),
        Math.max(1, finalLeft - 18),
        Math.max(1, finalLeft - 6),
        finalLeft,
      ];

      setIsAutoSeeking(true);
      setCurrentPage(stops[0]);

      stops.slice(1).forEach((nextSpreadLeft, idx) => {
        const startFlipTimer = setTimeout(() => {
          setFlipDirection("next");
          setFlipLeafPage(nextSpreadLeft);
          setIsFlipping(true);

          const completeFlipTimer = setTimeout(() => {
            setCurrentPage(nextSpreadLeft);
            setIsFlipping(false);
            if (idx === stops.length - 2) {
              setIsAutoSeeking(false);
            }
          }, 280);
          timersRef.current.push(completeFlipTimer);
        }, idx * 340 + 120);

        timersRef.current.push(startFlipTimer);
      });
    },
    [clearAllTimers]
  );

  // Trigger multi-page flip animation whenever modal opens, seekKey changes, or targetPage changes
  useEffect(() => {
    if (!isOpen) return;
    runBookFlipToTargetSequence(targetPage);
    return () => clearAllTimers();
  }, [isOpen, targetPage, seekKey, runBookFlipToTargetSequence, clearAllTimers]);

  const handleTurnPrior = useCallback(() => {
    if (currentPage <= 1 || isFlipping || isAutoSeeking) return;
    setFlipDirection("prev");
    setFlipLeafPage(currentPage);
    setIsFlipping(true);
    const t = setTimeout(() => {
      setCurrentPage((prev) => Math.max(1, prev - 2));
      setIsFlipping(false);
    }, 360);
    timersRef.current.push(t);
  }, [currentPage, isFlipping, isAutoSeeking]);

  const handleTurnNext = useCallback(() => {
    if (
      currentPage + 2 > TOTAL_MANUSCRIPT_FOLIOS ||
      isFlipping ||
      isAutoSeeking
    )
      return;
    setFlipDirection("next");
    setFlipLeafPage(currentPage + 1);
    setIsFlipping(true);
    const t = setTimeout(() => {
      setCurrentPage((prev) =>
        Math.min(TOTAL_MANUSCRIPT_FOLIOS - 1, prev + 2)
      );
      setIsFlipping(false);
    }, 360);
    timersRef.current.push(t);
  }, [currentPage, isFlipping, isAutoSeeking]);

  const handleRealignTarget = useCallback(() => {
    if (isFlipping || isAutoSeeking) return;
    runBookFlipToTargetSequence(targetPage);
  }, [isFlipping, isAutoSeeking, runBookFlipToTargetSequence, targetPage]);

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(0.8, Number((prev - 0.1).toFixed(2))));
  };

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(1.3, Number((prev + 0.1).toFixed(2))));
  };

  if (!isOpen) return null;

  const leftFolioPage = currentPage;
  const rightFolioPage = Math.min(TOTAL_MANUSCRIPT_FOLIOS, currentPage + 1);
  const isTargetOnSpread =
    !isAutoSeeking &&
    (leftFolioPage === targetPage || rightFolioPage === targetPage);

  const codexContent = (
    <div
      className={`w-full flex flex-col items-center justify-between select-none ${
        inline && !isFullscreenModal
          ? "my-2"
          : "fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
      }`}
    >
      {/* TOP BAR: Archival Provenance, Verse Badge, Cosine Match Pill, Expand/Close Controls */}
      <div className="w-full max-w-7xl rounded-2xl bg-[#120d09]/95 border border-[#4a321f] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-20 mb-4">
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
              Prajāgara Parva (Vidura Nīti) • 3D Illuminated Manuscript Codex
            </h3>
          </div>
        </div>

        {/* Right Badges & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isAutoSeeking && (
            <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/60 text-amber-200 font-mono text-xs flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Flipping to Folio {targetPage}...</span>
            </div>
          )}

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

          {/* Toggle Fullscreen Modal when in inline mode */}
          {inline && (
            <button
              type="button"
              onClick={() => setIsFullscreenModal((prev) => !prev)}
              title={
                isFullscreenModal
                  ? "Exit Fullscreen Codex"
                  : "Expand Fullscreen Codex"
              }
              className="px-3 py-1.5 rounded-xl bg-[#241811] hover:bg-[#382315] text-amber-200 border border-[#523622] text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isFullscreenModal ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inline View</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Expand Codex</span>
                </>
              )}
            </button>
          )}

          {/* Close Button */}
          {(onClose || isFullscreenModal) && (
            <button
              type="button"
              onClick={() => {
                if (isFullscreenModal) setIsFullscreenModal(false);
                else if (onClose) onClose();
              }}
              title="Close Archival Codex"
              className="p-2 rounded-xl bg-[#241811] hover:bg-[#382315] text-amber-200/80 hover:text-amber-100 border border-[#523622] transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* CENTER STAGE: 3D OPEN DUAL-FOLIO ANCIENT MANUSCRIPT CODEX WITH 3D LEAF FLIPPING */}
      <div className="my-auto py-2 w-full flex items-center justify-center perspective-1000 overflow-x-auto">
        <motion.div
          initial={{ scale: 0.95, rotateX: 8, opacity: 0 }}
          animate={{ scale: zoomScale, rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full max-w-5xl rounded-2xl bg-[#1b120c] border-4 border-[#382315] p-3 sm:p-5 shadow-[0_30px_90px_rgba(0,0,0,0.95),inset_0_0_24px_rgba(0,0,0,0.85)]"
        >
          {/* 4 Ornate Brass Corner Fittings */}
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
          <div className="relative rounded-lg bg-gradient-to-r from-[#5e4427] via-[#8a6a43] to-[#5e4427] p-[6px] shadow-[0_14px_38px_rgba(0,0,0,0.85)]">
            <div className="relative rounded bg-gradient-to-b from-[#a8895c] via-[#8a6a43] to-[#5e4527] p-[4px]">
              {/* Dual-Folio Open Spread */}
              <div
                style={{ transformStyle: "preserve-3d" }}
                className="relative grid grid-cols-1 md:grid-cols-2 bg-[#e8dabf] rounded-sm overflow-hidden shadow-inner min-h-[540px]"
              >
                {/* ================= LEFT FOLIO (VERSO) ================= */}
                <div
                  onClick={handleTurnPrior}
                  title="Click to Turn Prior Folio"
                  className="relative flex flex-col justify-between bg-[#e6d6b8] text-[#2b1d0c] p-4 sm:p-5 cursor-pointer group"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 60% 45%, rgba(244,234,212,0.5) 0%, rgba(212,188,144,0.45) 70%, rgba(161,126,80,0.65) 100%)",
                  }}
                >
                  {/* Aged Edge Shadow along Right Spine Gutter */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/40 via-black/15 to-transparent z-10" />

                  {/* Top Verso Header */}
                  <div className="relative z-10 flex items-center justify-between border-b border-[#8a6a43]/40 pb-2 mb-2 text-[11px] font-serif tracking-widest text-[#4a3214]">
                    <span className="font-mono uppercase text-[10px] text-[#6b4c24]">
                      FOLIO {leftFolioPage} • VERSO
                    </span>
                    <span className="font-bold">॥ उद्योगपर्व • प्रजागर ॥</span>
                  </div>

                  {/* Authentic Archival Manuscript Page (Verso) */}
                  <div className="relative z-0 flex-1 flex items-center justify-center min-h-[450px] parchment-ink-filter overflow-hidden">
                    <img
                      src={getFolioImagePath(leftFolioPage)}
                      alt={`Mahabharata Udyoga Parva Archival Folio ${leftFolioPage}`}
                      className="w-full max-w-[390px] h-auto object-contain rounded-sm transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                  </div>

                  {/* Bottom Verso Footer */}
                  <div className="relative z-10 flex items-center justify-between border-t border-[#8a6a43]/35 pt-2 mt-2 text-[10px] font-mono text-[#5c401d]">
                    <span>MAHĀBHĀRATA • BOOK V</span>
                    <span>p. {leftFolioPage}</span>
                  </div>
                </div>

                {/* ================= CENTRAL SEWN SPINE & SILK BOOKMARK ================= */}
                <div className="hidden md:flex pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-7 z-30 flex-col items-center justify-between py-6">
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
                    <div className="w-[1px] h-full mx-auto bg-[#d4af37]/30" />
                  </div>
                </div>

                {/* ================= RIGHT FOLIO (RECTO / TARGET SHLOKA PAGE) ================= */}
                <div
                  onClick={handleTurnNext}
                  title="Click to Turn Next Folio"
                  className="relative flex flex-col justify-between bg-[#eadbc0] text-[#2b1d0c] p-4 sm:p-5 cursor-pointer group"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 40% 45%, rgba(247,238,218,0.55) 0%, rgba(216,192,148,0.45) 70%, rgba(161,126,80,0.65) 100%)",
                  }}
                >
                  {/* Aged Edge Shadow along Left Spine Gutter */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/40 via-black/15 to-transparent z-10" />

                  {/* Top Recto Header */}
                  <div className="relative z-10 flex items-center justify-between border-b border-[#8a6a43]/40 pb-2 mb-2 text-[11px] font-serif tracking-widest text-[#4a3214]">
                    <span className="font-bold">॥ विदुरनीति मन्त्र ॥</span>
                    <span className="font-mono uppercase text-[10px] text-[#6b4c24]">
                      FOLIO {rightFolioPage} • RECTO
                    </span>
                  </div>

                  {/* Authentic Archival Manuscript Page (Recto) + Gold-Foil Verse Illumination */}
                  <div className="relative z-0 flex-1 flex items-center justify-center min-h-[450px] parchment-ink-filter overflow-hidden">
                    <img
                      src={getFolioImagePath(rightFolioPage)}
                      alt={`Mahabharata Udyoga Parva Archival Folio ${rightFolioPage}`}
                      className="w-full max-w-[390px] h-auto object-contain rounded-sm transition-transform duration-300 group-hover:scale-[1.01]"
                    />

                    {/* Gold-Leaf Passage Highlight Band directly over the manuscript text */}
                    {isTargetOnSpread && (
                      <motion.div
                        initial={{ opacity: 0, scaleX: 0.85 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.45 }}
                        className="pointer-events-none absolute top-[26%] inset-x-6 h-20 rounded bg-amber-400/25 border-y-2 border-[#b5801e] shadow-[0_0_25px_rgba(212,175,55,0.55)] flex items-start justify-end p-1.5"
                      >
                        <span className="px-2 py-0.5 rounded bg-[#3a2408]/90 text-[#f7e2a8] font-mono text-[10px] font-bold tracking-wider shadow">
                          § {verseId} • SHLOKA LOCUS
                        </span>
                      </motion.div>
                    )}

                    {/* ACTIVE GOLD-FOIL ILLUMINATED SHLOKA CALLOUT BOX ON TARGET FOLIO */}
                    {isTargetOnSpread && (
                      <motion.div
                        initial={{ opacity: 0, y: 14, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-x-2 bottom-2 z-20 rounded-xl border-2 border-[#b5801e] bg-gradient-to-br from-[#f8edd2]/98 via-[#f3e1b6]/98 to-[#e8ce92]/98 p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_25px_rgba(201,151,56,0.7),inset_0_1px_2px_rgba(255,255,255,0.7)] cursor-default"
                      >
                        <div className="flex items-center justify-between border-b border-[#a87424]/40 pb-1.5 mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#6e460c] flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#9e6610]" />
                            <span>
                              ✦ ILLUMINATED PRAMĀṆA SHLOKA • § {verseId}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#a87424]/25 text-[#472c04] border border-[#a87424]/50">
                            Folio {targetPage} Verified
                          </span>
                        </div>

                        <div className="font-serif text-xs sm:text-[13px] leading-snug text-[#2c1d07] italic mb-1.5">
                          <mark className="manuscript-glow">
                            {sanskritVerse || highlightText}
                          </mark>
                        </div>

                        {englishTranslation && (
                          <p className="text-[11px] font-sans text-[#3d290b] leading-relaxed">
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
                        ? `✦ TARGET VERSE § ${verseId} ILLUMINATED`
                        : "UDYOGA PARVA"}
                    </span>
                    <span>p. {rightFolioPage}</span>
                  </div>
                </div>

                {/* ================= 3D ANIMATED TURNING PARCHMENT LEAF ================= */}
                <AnimatePresence>
                  {isFlipping && (
                    <motion.div
                      key={`flip-leaf-${flipLeafPage}-${flipDirection}`}
                      initial={{
                        rotateY: flipDirection === "next" ? 0 : -180,
                      }}
                      animate={{
                        rotateY: flipDirection === "next" ? -180 : 0,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: isAutoSeeking ? 0.27 : 0.36,
                        ease: "easeInOut",
                      }}
                      style={{
                        transformOrigin: "left center",
                        transformStyle: "preserve-3d",
                      }}
                      className="hidden md:flex pointer-events-none absolute top-0 bottom-0 left-1/2 right-0 z-40 flex-col justify-between bg-[#e4d3b2] border-l border-[#8a6a43] p-5 shadow-[-20px_0_40px_rgba(0,0,0,0.55)]"
                    >
                      <div className="flex items-center justify-between border-b border-[#8a6a43]/40 pb-2 text-[10px] font-serif text-[#4a3214]">
                        <span>॥ विदुरनीति मन्त्र ॥</span>
                        <span className="font-mono">FOLIO {flipLeafPage}</span>
                      </div>
                      <div className="flex-1 flex items-center justify-center parchment-ink-filter overflow-hidden">
                        <img
                          src={getFolioImagePath(flipLeafPage)}
                          alt={`Turning Folio ${flipLeafPage}`}
                          className="w-full max-w-[360px] h-auto object-contain opacity-90"
                        />
                      </div>
                      <div className="border-t border-[#8a6a43]/35 pt-2 text-[10px] font-mono text-[#5c401d] flex justify-between">
                        <span>TURNING FOLIO...</span>
                        <span>p. {flipLeafPage}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM BAR: Folio Spread Tracker, Turn Prior/Next, Re-Align Target Verse, Zoom Controls */}
      <div className="w-full max-w-7xl rounded-2xl bg-[#120d09]/95 border border-[#4a321f] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.85)] z-20 mt-4">
        {/* Left: Folio Spread Tracker */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-[#241811] border border-[#523622] font-mono text-xs text-amber-200">
            Folio {leftFolioPage}&ndash;{rightFolioPage} of{" "}
            {TOTAL_MANUSCRIPT_FOLIOS}
          </span>
          <span className="hidden md:inline-block text-xs font-serif italic text-amber-400/80">
            § Target Shloka Mapped to Folio {targetPage} (Click folios or
            buttons to flip pages)
          </span>
        </div>

        {/* Center: Folio Turning & Target Re-Alignment Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleTurnPrior}
            disabled={currentPage <= 1 || isFlipping || isAutoSeeking}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#241811] hover:bg-[#382315] disabled:opacity-40 border border-[#523622] text-amber-200 text-xs font-serif uppercase tracking-wider transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-amber-400" />
            <span>Turn Prior Folio</span>
          </button>

          <button
            type="button"
            onClick={handleRealignTarget}
            disabled={isFlipping || isAutoSeeking}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-serif uppercase tracking-wider transition-all cursor-pointer ${
              isTargetOnSpread
                ? "bg-amber-500/20 border-amber-400/60 text-amber-200 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                : "bg-amber-950/60 hover:bg-amber-900/60 border-amber-500/50 text-amber-300"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Flip to Shloka (§ {verseId} • Folio {targetPage})</span>
          </button>

          <button
            type="button"
            onClick={handleTurnNext}
            disabled={
              currentPage + 2 > TOTAL_MANUSCRIPT_FOLIOS ||
              isFlipping ||
              isAutoSeeking
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#241811] hover:bg-[#382315] disabled:opacity-40 border border-[#523622] text-amber-200 text-xs font-serif uppercase tracking-wider transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Turn Next Folio</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Right: Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomScale <= 0.8}
            title="Zoom Out Folio"
            className="p-2 rounded-xl bg-[#241811] hover:bg-[#382315] disabled:opacity-40 border border-[#523622] text-amber-200 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-amber-300 min-w-[46px] text-center">
            {Math.round(zoomScale * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomScale >= 1.3}
            title="Zoom In Folio"
            className="p-2 rounded-xl bg-[#241811] hover:bg-[#382315] disabled:opacity-40 border border-[#523622] text-amber-200 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return codexContent;
}
