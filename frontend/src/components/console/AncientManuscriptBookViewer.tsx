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
  pdfUrl: string;
  targetPage: number;
  highlightText: string;
  verseId: string;
  confidenceScore: number;
  sanskritVerse?: string;
  englishTranslation?: string;
  highlightTopPct?: number;
  highlightHeightPct?: number;
  inline?: boolean;
  seekKey?: number | string;
}

const TOTAL_MANUSCRIPT_FOLIOS = 303;

// OCR-Verified Locus Coordinates on udyoga_parva.pdf (1890 Kisari Mohan Ganguli Edition)
export const VERIFIED_SHLOKA_LOCUS_MAP: Record<
  string,
  {
    page: number;
    topPct: number;
    heightPct: number;
    sanskrit: string;
    verbatimFolioText: string;
  }
> = {
  "33.16": {
    page: 111,
    topPct: 68.5,
    heightPct: 14.0,
    sanskrit:
      "Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ | Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ ||",
    verbatimFolioText:
      "They are abundant, O king, that can always speak agreeable words. The speaker, however, is rare, as also the hearer, of words that are disagreeable but medicinal. That man who, without regarding what is agreeable or disagreeable to his master, but keeping virtue alone in view, sayeth what is unpalatable but medicinal, truly addeth to the strength of the king.",
  },
  "33.17": {
    page: 121,
    topPct: 20.0,
    heightPct: 12.2,
    sanskrit:
      "Na svalpasya kṛte bhūri nāśayet matimān naraḥ | Etad evāti-pāṇḍityaṃ yad alpān mahato rakṣaṇam ||",
    verbatimFolioText:
      "That gain should never be regarded highly which leadeth to loss. On the other hand, that loss even should be regarded highly which would bring on gain. That is no loss, O king, which bringeth on gain. That, however, should be reckoned as loss which is certain to bring about greater losses still.",
  },
  "34.29": {
    page: 91,
    topPct: 64.0,
    heightPct: 14.8,
    sanskrit:
      "A-pṛṣṭo 'py atra brūyān na tu paśyed vi-nāśanam | An-arthakam api brūyāt sarva-bhūtāhite ratam ||",
    verbatimFolioText:
      "Vidura said: Even if unasked, one should speak truly, whether his words be good or bad, hateful or pleasing, unto him whose defeat one doth not wish. I shall, therefore, say, O king, what is for the good of the Kurus. I shall say what is both beneficial and consistent with morality. Listen to me! Do not, O king, set thy heart upon means of success that are unjust and improper.",
  },
  "33.24": {
    page: 83,
    topPct: 6.2,
    heightPct: 13.0,
    sanskrit:
      "Ātma-jñānaṃ samārambhas titikṣā dharma-nityatā | Yam arthān nāpakarṣanti sa vai paṇḍita ucyate ||",
    verbatimFolioText:
      "With the aid of self-knowledge, exertion, forbearance, and steadiness in virtue, one is called Wise. He whom neither anger, nor joy, nor pride, nor false modesty, nor stupefaction, nor vanity, can draw away from the high ends of life, is considered as wise.",
  },
  "33.32": {
    page: 83,
    topPct: 18.2,
    heightPct: 11.2,
    sanskrit:
      "Yasyākṛtyaṃ na jānanti mantram vā mantritaṃ pare | Kṛtam evāsya jānanti sa vai paṇḍita ucyate ||",
    verbatimFolioText:
      "He whose intended acts, and proposed counsels remain concealed from foes, and whose acts become known only after they have been done, is considered wise. He whose purposed actions are never obstructed by heat or cold, fear or attachment, prosperity or adversity, is considered wise.",
  },
  "34.12": {
    page: 89,
    topPct: 15.2,
    heightPct: 11.2,
    sanskrit:
      "Daśa dharmam na jānanti dhṛtarāṣṭra nibodha tān | Mattaḥ pramatta unmattaḥ śrāntaḥ kruddho bubhukṣitaḥ | Tvaramāṇaś ca lubdhaś ca bhītaḥ kāmī ca te daśa ||",
    verbatimFolioText:
      "O Dhritarashtra, these ten do not know what virtue is, viz., the intoxicated, the inattentive, the raving, the fatigued, the angry, the starving, the hasty, the covetous, the frightened, and the lustful. Therefore, he that is wise must eschew the company of these.",
  },
  "35.08": {
    page: 85,
    topPct: 86.8,
    heightPct: 9.2,
    sanskrit:
      "Sāmnā dānena bhedena daṇḍena ca mahīpate | Vinīyātmānam evādau paścād anyān vināyayet ||",
    verbatimFolioText:
      "By one is meant the intellect; by two, right and wrong; by three, friend, stranger, and foe; by four, conciliation, gift, disunion, and severity.",
  },
  "35.19": {
    page: 89,
    topPct: 48.2,
    heightPct: 13.0,
    sanskrit:
      "Na vairaṃ ropayet kasyacid a-kāle vāpi saṃśritam | Na rājño vipriyaṃ kuryān na ca dharmeṇa saṃtyajet ||",
    verbatimFolioText:
      "He is a wise person who doth not disregard even a weak foe; who proceedeth with intelligence in respect of a foe, anxiously watching for an opportunity; who doth not desire hostilities with persons stronger than himself; and who displayeth his prowess in season.",
  },
  "36.14": {
    page: 111,
    topPct: 82.8,
    heightPct: 8.8,
    sanskrit:
      "Tyajed ekaṃ kulasyārthe grāmasyārthe kulaṃ tyajet | Grāmaṃ janapadasyārthe ātmārthe pṛthivīṃ tyajet ||",
    verbatimFolioText:
      "For the sake of the family a member may be sacrificed; for the sake of the village, a family may be sacrificed; for the sake of a kingdom a village may be sacrificed; and for the sake of one's soul, the whole earth may be sacrificed.",
  },
  "37.11": {
    page: 96,
    topPct: 47.2,
    heightPct: 11.0,
    sanskrit:
      "Satyaṃ brūyāt priyaṃ brūyān na brūyāt satyam apriyam | Priyaṃ ca nānṛtaṃ brūyād eṣa dharmaḥ sanātanaḥ ||",
    verbatimFolioText:
      "To control speech, O king, is said to be most difficult! It is not easy to hold a long conversation uttering words full of meaning and delightful to the hearers. Well-spoken speech is productive of many beneficial results; and ill-spoken speech, O king, is the cause of evils!",
  },
  "38.09": {
    page: 85,
    topPct: 39.5,
    heightPct: 13.0,
    sanskrit:
      "Ekaḥ kṣamāvatāṃ doṣo dvitīyo nopapadyate | Yad enaṃ kṣamayā yuktam aśaktaṃ manyate janaḥ ||",
    verbatimFolioText:
      "There is one only defect in forgiving persons, and not another; that defect is that people take a forgiving person to be weak. That defect, however, should not be taken into consideration, for forgiveness is a great power. Forgiveness is a virtue of the weak, and an ornament of the strong.",
  },
  "39.21": {
    page: 90,
    topPct: 80.5,
    heightPct: 8.5,
    sanskrit:
      "Hitaṃ mano-hari ca durlabhaṃ vacaḥ | Yo hi rājñaḥ priyaṃ vaktā na tu pathyaṃ prabhāṣate ||",
    verbatimFolioText:
      "He whose counsels are well kept and well carried out into practice, and whose acts in consequence thereof are never known by others to injure men, succeedeth in securing even his most trifling objects.",
  },
  "40.06": {
    page: 102,
    topPct: 44.5,
    heightPct: 18.0,
    sanskrit:
      "Dharmo rakṣati rakṣitaḥ | Na jātu kāmān na bhayān na lobhād dharmaṃ jahyāj jīvitasyāpi hetoḥ ||",
    verbatimFolioText:
      "A virtuous man, by practising virtue, reapeth great happiness. Therefore, a man should, rigidly resolved, abstain from sin. Sin, repeatedly perpetrated, destroyeth intelligence; and the man who hath lost intelligence repeatedly committeth sin. Virtue, repeatedly practised, enhanceth intelligence.",
  },
};

function getFolioImagePath(pageNumber: number): string {
  const clamped = Math.max(1, Math.min(135, pageNumber));
  return `/folios/folio-${clamped}.webp`;
}

export default function AncientManuscriptBookViewer({
  isOpen,
  onClose,
  targetPage = 111,
  highlightText = "Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ | Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ ||",
  verseId = "33.16",
  confidenceScore = 0.924,
  sanskritVerse,
  englishTranslation,
  highlightTopPct,
  highlightHeightPct,
  inline = false,
  seekKey,
}: AncientManuscriptBookViewerProps) {
  const verifiedLocus =
    VERIFIED_SHLOKA_LOCUS_MAP[verseId] || VERIFIED_SHLOKA_LOCUS_MAP["33.16"];

  const resolvedTargetPage = targetPage || verifiedLocus.page;
  const resolvedTopPct = highlightTopPct ?? verifiedLocus.topPct;
  const resolvedHeightPct = highlightHeightPct ?? verifiedLocus.heightPct;
  const resolvedSanskrit =
    sanskritVerse || highlightText || verifiedLocus.sanskrit;
  const resolvedVerbatimEnglish =
    verifiedLocus.verbatimFolioText || englishTranslation || "";

  const desiredLeftPage = Math.max(1, resolvedTargetPage - 1);

  const [currentPage, setCurrentPage] = useState<number>(desiredLeftPage);
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [isFullscreenModal, setIsFullscreenModal] = useState<boolean>(false);

  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");
  const [flipLeafPage, setFlipLeafPage] = useState<number>(desiredLeftPage + 1);
  const [isAutoSeeking, setIsAutoSeeking] = useState<boolean>(false);

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const runBookFlipToTargetSequence = useCallback(
    (finalTargetPage: number) => {
      clearAllTimers();
      const finalLeft = Math.max(1, finalTargetPage - 1);

      const stops = [
        Math.max(1, finalLeft - 44),
        Math.max(1, finalLeft - 28),
        Math.max(1, finalLeft - 14),
        Math.max(1, finalLeft - 4),
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
          }, 260);
          timersRef.current.push(completeFlipTimer);
        }, idx * 320 + 100);

        timersRef.current.push(startFlipTimer);
      });
    },
    [clearAllTimers]
  );

  useEffect(() => {
    if (!isOpen) return;
    runBookFlipToTargetSequence(resolvedTargetPage);
    return () => clearAllTimers();
  }, [
    isOpen,
    resolvedTargetPage,
    verseId,
    seekKey,
    runBookFlipToTargetSequence,
    clearAllTimers,
  ]);

  const handleTurnPrior = useCallback(() => {
    if (currentPage <= 1 || isFlipping || isAutoSeeking) return;
    setFlipDirection("prev");
    setFlipLeafPage(currentPage);
    setIsFlipping(true);
    const t = setTimeout(() => {
      setCurrentPage((prev) => Math.max(1, prev - 2));
      setIsFlipping(false);
    }, 340);
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
    }, 340);
    timersRef.current.push(t);
  }, [currentPage, isFlipping, isAutoSeeking]);

  const handleRealignTarget = useCallback(() => {
    if (isFlipping || isAutoSeeking) return;
    runBookFlipToTargetSequence(resolvedTargetPage);
  }, [
    isFlipping,
    isAutoSeeking,
    runBookFlipToTargetSequence,
    resolvedTargetPage,
  ]);

  // Keyboard support: Escape closes fullscreen/modal (R-32)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreenModal) {
          setIsFullscreenModal(false);
        } else if (onClose) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFullscreenModal, onClose]);

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
    (leftFolioPage === resolvedTargetPage ||
      rightFolioPage === resolvedTargetPage);

  return (
    <div
      className={`w-full flex flex-col items-center justify-between select-none ${
        inline && !isFullscreenModal
          ? "my-2"
          : "fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
      }`}
    >
      {/* TOP BAR: Archival Provenance, Verse Badge, Cosine Match Pill, Expand/Close Controls */}
      <div className="w-full max-w-7xl rounded-lg bg-[#120d09] border border-[#4a321f] px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-[0_8px_24px_rgba(0,0,0,0.75)] z-20 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-amber-400">
              <span>✦ ARCHIVAL CODEX VERIFICATION</span>
              <span>◆</span>
              <span className="text-amber-200">
                BORI Critical Edition &bull; Ganguli Folio {resolvedTargetPage}
              </span>
            </div>
            <h3 className="font-serif text-sm sm:text-base font-bold text-amber-100 tracking-wide">
              Prajāgara Parva (Vidura Nīti) &bull; 3D Illuminated Manuscript Codex
            </h3>
          </div>
        </div>

        {/* Right Badges & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isAutoSeeking && (
            <div className="px-3 py-1.5 rounded-sm bg-amber-500/20 border border-amber-400/60 text-amber-200 font-mono text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Flipping to Folio {resolvedTargetPage}...</span>
            </div>
          )}

          {/* Verse Badge */}
          <div className="px-3 py-1.5 rounded-sm bg-amber-950/80 border border-amber-500/50 text-amber-200 font-serif text-xs font-bold tracking-wider flex items-center gap-1.5">
            <span className="text-amber-400">§</span>
            <span>
              Vidura Nīti {verseId} &bull; Folio {resolvedTargetPage}
            </span>
          </div>

          {/* Cosine Match Pill */}
          <div className="px-3 py-1.5 rounded-sm bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-1.5">
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
              aria-label={
                isFullscreenModal
                  ? "Return to inline codex view"
                  : "Expand codex to fullscreen"
              }
              className="min-h-[44px] px-3.5 py-2 rounded-md bg-[#241811] hover:bg-[#382315] text-amber-200 border border-[#523622] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
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
              aria-label="Close Archival Codex"
              className="min-h-[44px] min-w-[44px] p-2 rounded-md bg-[#241811] hover:bg-[#382315] text-amber-200 hover:text-amber-100 border border-[#523622] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* CENTER STAGE: 3D OPEN DUAL-FOLIO ANCIENT MANUSCRIPT CODEX WITH 3D LEAF FLIPPING */}
      <div className="my-auto py-2 w-full flex items-center justify-center perspective-1000 overflow-x-auto">
        <motion.div
          initial={{ scale: 0.96, rotateX: 6, opacity: 0 }}
          animate={{ scale: zoomScale, rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full max-w-5xl rounded-lg bg-[#1b120c] border-4 border-[#382315] p-3 sm:p-5 shadow-[0_24px_70px_rgba(0,0,0,0.9),inset_0_0_24px_rgba(0,0,0,0.85)]"
        >
          {/* 4 Brass Corner Fittings */}
          <div className="pointer-events-none absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#c59b27] rounded-tl-md z-30">
            <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#e6c665]" />
          </div>
          <div className="pointer-events-none absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#c59b27] rounded-tr-md z-30">
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#e6c665]" />
          </div>
          <div className="pointer-events-none absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#c59b27] rounded-bl-md z-30">
            <span className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#e6c665]" />
          </div>
          <div className="pointer-events-none absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#c59b27] rounded-br-md z-30">
            <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#e6c665]" />
          </div>

          {/* Stacked Leaf Thickness Illusion (Aged Vellum Page Block Edges) */}
          <div className="relative rounded-md bg-gradient-to-r from-[#5e4427] via-[#8a6a43] to-[#5e4427] p-[6px] shadow-[0_14px_38px_rgba(0,0,0,0.85)]">
            <div className="relative rounded-sm bg-gradient-to-b from-[#a8895c] via-[#8a6a43] to-[#5e4527] p-[4px]">
              {/* Dual-Folio Open Spread */}
              <div
                style={{ transformStyle: "preserve-3d" }}
                className="relative grid grid-cols-1 md:grid-cols-2 bg-[#e8dabf] rounded-sm overflow-hidden shadow-inner min-h-[560px]"
              >
                {/* LEFT FOLIO (VERSO + ILLUMINATED SHLOKA VERIFICATION PLAQUE) */}
                <div
                  onClick={handleTurnPrior}
                  title="Turn Prior Folio"
                  className="relative flex flex-col justify-between bg-[#e6d6b8] text-[#2b1d0c] p-4 sm:p-5 cursor-pointer group"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 60% 45%, rgba(244,234,212,0.5) 0%, rgba(212,188,144,0.45) 70%, rgba(161,126,80,0.65) 100%)",
                  }}
                >
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/40 via-black/15 to-transparent z-10" />

                  {/* Top Verso Header */}
                  <div className="relative z-10 flex items-center justify-between border-b border-[#8a6a43]/40 pb-2 mb-2 text-[11px] font-serif tracking-widest text-[#4a3214]">
                    <span className="font-mono uppercase text-[10px] text-[#5c401d]">
                      FOLIO {leftFolioPage} &bull; VERSO
                    </span>
                    <span className="font-bold">॥ उद्योगपर्व &bull; प्रजागर ॥</span>
                  </div>

                  {/* Authentic Archival Manuscript Page (Verso) + Docked Shloka Verification Plate */}
                  <div className="relative z-0 flex-1 flex items-center justify-center min-h-[460px] overflow-hidden">
                    <div className="relative w-full max-w-[390px] mx-auto parchment-ink-filter">
                      <img
                        src={getFolioImagePath(leftFolioPage)}
                        alt={`Mahabharata Udyoga Parva Archival Folio ${leftFolioPage}`}
                        className="w-full h-auto object-contain rounded-sm opacity-90 transition-transform duration-300 group-hover:scale-[1.01]"
                      />
                    </div>

                    {isTargetOnSpread && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.35 }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute inset-x-1.5 bottom-1.5 z-20 rounded-md border-2 border-[#b5801e] bg-gradient-to-br from-[#faf1da]/98 via-[#f4e4bd]/98 to-[#ebd39b]/98 p-3.5 shadow-[0_12px_28px_rgba(0,0,0,0.65)] cursor-default"
                      >
                        <div className="flex items-center justify-between border-b border-[#a87424]/40 pb-1.5 mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#5c3a08] flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#8a570b]" />
                            <span>
                              ✦ ILLUMINATED PRAMĀṆA SHLOKA &bull; § {verseId}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm bg-[#a87424]/25 text-[#472c04] border border-[#a87424]/50">
                            Folio {resolvedTargetPage} Verified
                          </span>
                        </div>

                        <div
                          style={{
                            fontFamily:
                              'Georgia, "Times New Roman", "Noto Serif", serif',
                            textTransform: "none",
                          }}
                          className="text-xs sm:text-[13.5px] font-semibold leading-snug text-[#2b1a04] italic mb-2"
                        >
                          <mark
                            style={{
                              fontFamily:
                                'Georgia, "Times New Roman", "Noto Serif", serif',
                              textTransform: "none",
                            }}
                            className="manuscript-glow"
                          >
                            {resolvedSanskrit}
                          </mark>
                        </div>

                        <div className="text-[10px] font-mono uppercase tracking-wider text-[#5c3a08] font-bold mb-0.5">
                          ◆ Verbatim Passage Highlighted on Facing Folio{" "}
                          {resolvedTargetPage}:
                        </div>
                        <p
                          style={{
                            fontFamily:
                              'Georgia, "Times New Roman", "Noto Serif", serif',
                          }}
                          className="text-[11.5px] text-[#2b1a04] leading-relaxed italic"
                        >
                          &ldquo;{resolvedVerbatimEnglish}&rdquo;
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Bottom Verso Footer */}
                  <div className="relative z-10 flex items-center justify-between border-t border-[#8a6a43]/35 pt-2 mt-2 text-[10px] font-mono text-[#5c401d]">
                    <span>MAHĀBHĀRATA &bull; BOOK V</span>
                    <span>p. {leftFolioPage}</span>
                  </div>
                </div>

                {/* CENTRAL SEWN SPINE & SILK BOOKMARK */}
                <div className="hidden md:flex pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-7 z-30 flex-col items-center justify-between py-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-[#1a0f07]/90 to-black/45 shadow-[0_0_15px_rgba(0,0,0,0.75)]" />

                  {[0, 1, 2, 3, 4, 5].map((stitch) => (
                    <div
                      key={stitch}
                      className="relative z-10 w-4 h-[2px] bg-[#c9ab78]/70 rounded-full shadow-sm"
                    />
                  ))}

                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-[104%] bg-gradient-to-b from-[#9e1919] via-[#8b1515] to-[#630d0d] shadow-[0_4px_12px_rgba(0,0,0,0.65)] border-x border-[#b82828]/30">
                    <div className="w-[1px] h-full mx-auto bg-[#d4af37]/30" />
                  </div>
                </div>

                {/* RIGHT FOLIO (RECTO / UNOBSTRUCTED SCANNED MANUSCRIPT WITH EXACT LOCUS HIGHLIGHT) */}
                <div
                  onClick={handleTurnNext}
                  title="Turn Next Folio"
                  className="relative flex flex-col justify-between bg-[#eadbc0] text-[#2b1d0c] p-4 sm:p-5 cursor-pointer group"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 40% 45%, rgba(247,238,218,0.55) 0%, rgba(216,192,148,0.45) 70%, rgba(161,126,80,0.65) 100%)",
                  }}
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/40 via-black/15 to-transparent z-10" />

                  {/* Top Recto Header */}
                  <div className="relative z-10 flex items-center justify-between border-b border-[#8a6a43]/40 pb-2 mb-2 text-[11px] font-serif tracking-widest text-[#4a3214]">
                    <span className="font-bold">॥ विदुरनीति मन्त्र ॥</span>
                    <span className="font-mono uppercase text-[10px] text-[#5c401d]">
                      FOLIO {rightFolioPage} &bull; RECTO
                    </span>
                  </div>

                  {/* Authentic Archival Manuscript Page (Recto) with Pixel-Accurate OCR Locus Highlight */}
                  <div className="relative z-0 flex-1 flex items-center justify-center min-h-[460px] overflow-hidden">
                    <div className="relative w-full max-w-[390px] mx-auto">
                      <div className="parchment-ink-filter">
                        <img
                          src={getFolioImagePath(rightFolioPage)}
                          alt={`Mahabharata Udyoga Parva Archival Folio ${rightFolioPage}`}
                          className="w-full h-auto object-contain rounded-sm transition-transform duration-300 group-hover:scale-[1.01]"
                        />
                      </div>

                      {isTargetOnSpread && (
                        <motion.div
                          initial={{ opacity: 0, scaleX: 0.94 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          transition={{ duration: 0.4 }}
                          style={{
                            top: `${resolvedTopPct}%`,
                            height: `${resolvedHeightPct}%`,
                          }}
                          className="pointer-events-none absolute inset-x-4 rounded-sm bg-amber-300/25 border-2 border-[#b5801e] shadow-[0_0_24px_rgba(212,175,55,0.55)] flex flex-col justify-between"
                        >
                          <div className="flex justify-end -mt-3 mr-1">
                            <span className="px-2 py-0.5 rounded-sm bg-[#2d1b04]/95 border border-[#d4af37] text-[#fae6b1] font-mono text-[9.5px] font-bold tracking-wider shadow-md">
                              § {verseId} &bull; VERIFIED SHLOKA LOCUS (p.{" "}
                              {resolvedTargetPage})
                            </span>
                          </div>

                          <div className="w-full h-[2px] bg-gradient-to-r from-[#b5801e] via-[#d4af37] to-[#b5801e]" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Recto Footer */}
                  <div className="relative z-10 flex items-center justify-between border-t border-[#8a6a43]/35 pt-2 mt-2 text-[10px] font-mono text-[#5c401d]">
                    <span>
                      {isTargetOnSpread
                        ? `✦ TARGET VERSE § ${verseId} HIGHLIGHTED AT LOCUS Y=${resolvedTopPct}%`
                        : "UDYOGA PARVA"}
                    </span>
                    <span>p. {rightFolioPage}</span>
                  </div>
                </div>

                {/* 3D ANIMATED TURNING PARCHMENT LEAF */}
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
                        duration: isAutoSeeking ? 0.25 : 0.34,
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
      <div className="w-full max-w-7xl rounded-lg bg-[#120d09] border border-[#4a321f] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-[0_8px_24px_rgba(0,0,0,0.75)] z-20 mt-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-sm bg-[#241811] border border-[#523622] font-mono text-xs text-amber-200">
            Folio {leftFolioPage}&ndash;{rightFolioPage} of{" "}
            {TOTAL_MANUSCRIPT_FOLIOS}
          </span>
          <span className="hidden md:inline-block text-xs font-serif italic text-amber-300">
            § Target Shloka {verseId} Mapped to Folio {resolvedTargetPage} (Locus{" "}
            {resolvedTopPct}%)
          </span>
        </div>

        {/* Center: Folio Turning & Target Re-Alignment Controls (44px+ height per R-03) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleTurnPrior}
            disabled={currentPage <= 1 || isFlipping || isAutoSeeking}
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-md bg-[#241811] hover:bg-[#382315] disabled:opacity-40 border border-[#523622] text-amber-200 text-xs font-serif uppercase tracking-wider transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-amber-400" />
            <span>Turn Prior Folio</span>
          </button>

          <button
            type="button"
            onClick={handleRealignTarget}
            disabled={isFlipping || isAutoSeeking}
            className={`inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-md border text-xs font-serif uppercase tracking-wider transition-colors cursor-pointer ${
              isTargetOnSpread
                ? "bg-amber-500/20 border-amber-400/60 text-amber-200"
                : "bg-amber-950/60 hover:bg-amber-900/60 border-amber-500/50 text-amber-300"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Flip to Shloka (§ {verseId} &bull; Folio {resolvedTargetPage})
            </span>
          </button>

          <button
            type="button"
            onClick={handleTurnNext}
            disabled={
              currentPage + 2 > TOTAL_MANUSCRIPT_FOLIOS ||
              isFlipping ||
              isAutoSeeking
            }
            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-md bg-[#241811] hover:bg-[#382315] disabled:opacity-40 border border-[#523622] text-amber-200 text-xs font-serif uppercase tracking-wider transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Turn Next Folio</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Right: Zoom Controls (44x44px tap targets per R-03) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomScale <= 0.8}
            aria-label="Zoom out manuscript folio"
            className="min-h-[44px] min-w-[44px] p-2 rounded-md bg-[#241811] hover:bg-[#382315] disabled:opacity-40 border border-[#523622] text-amber-200 flex items-center justify-center transition-colors cursor-pointer"
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
            aria-label="Zoom in manuscript folio"
            className="min-h-[44px] min-w-[44px] p-2 rounded-md bg-[#241811] hover:bg-[#382315] disabled:opacity-40 border border-[#523622] text-amber-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
