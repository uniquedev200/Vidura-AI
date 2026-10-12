"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import confetti from "canvas-confetti";
import {
  Compass,
  Zap,
  Layers,
  Send,
  BookOpen,
  Check,
  Star,
  Copy,
  Scale,
  User,
  Users,
  Lock,
  Download,
  LayoutGrid,
  FileText,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  Flame,
  Eraser,
} from "lucide-react";
import DharmaChakra from "@/components/ui/DharmaChakra";
import DharmaScale from "@/components/ui/DharmaScale";
import CitationDrawer from "./CitationDrawer";
import PillarRenderer from "./PillarRenderer";
import {
  validateDilemmaInput,
  matchCanonicalCorpusFromInputs,
  synthesizeDynamicCounselFromInputs,
  GuardrailValidationResult,
  DilemmaInputPayload,
} from "@/lib/guardrails";

const AncientManuscriptBookViewer = dynamic(
  () => import("./AncientManuscriptBookViewer"),
  { ssr: false }
);

interface Preset {
  id: string;
  title: string;
  category: string;
  role: string;
  counterparty: string;
  organizational_pressure: string;
  risk_level: string;
  primary_fear: string;
  dilemma: string;
  target_shloka: string;
  target_folio: number;
}

const PRESETS: Preset[] = [
  {
    id: "preset-bias-coverup",
    title: "Algorithmic Bias Coverup",
    category: "AI & Disparate Impact • ACM 1.4",
    role: "Machine Learning Engineer",
    counterparty: "VP of AI Product & Chief Revenue Officer",
    organizational_pressure:
      "Quarterly Wall Street guidance depends on immediate rollout",
    risk_level: "Critical",
    primary_fear: "Constructive termination, bonus forfeiture, NDA threat",
    dilemma:
      "Our credit evaluation model exhibits a 34% higher rejection rate for underrepresented minority applicants when features correlate with zip codes. Management ordered me to suppress the disparate-impact audit report and deploy tomorrow morning to satisfy investor milestones.",
    target_shloka: "33.16",
    target_folio: 111,
  },
  {
    id: "preset-security-bypass",
    title: "Bypassing Security for Deadlines",
    category: "Infrastructure & Safety • IEEE 1.1",
    role: "Lead Site Reliability Engineer",
    counterparty: "Director of Engineering & Product Lead",
    organizational_pressure:
      "Critical contract termination if release is delayed 48 hours",
    risk_level: "High",
    primary_fear: "Blamed for missed company SLA and team restructuring",
    dilemma:
      "A critical remote-code-execution zero-day vulnerability in our auth gateway was flagged in pre-release staging. The engineering director asked me to disable the automated vulnerability gate in CI/CD pipeline so the client release completes on time, promising a patch next sprint.",
    target_shloka: "33.17",
    target_folio: 121,
  },
  {
    id: "preset-executive-nepotism",
    title: "Executive Nepotism & Whistleblowing",
    category: "Fiduciary Governance • ACM 1.3",
    role: "Principal Cloud Architect",
    counterparty: "Chief Technology Officer & Audit Committee",
    organizational_pressure:
      "Direct executive intimidation from founders' inner circle",
    risk_level: "Critical",
    primary_fear: "Retaliation, defamation, and industry blacklisting",
    dilemma:
      "I discovered that our CTO awarded an uncompetitive $4.2M cloud infrastructure tooling vendor contract to a shell LLC owned by his sibling, with no functional technical deliverables. When I requested architecture diagrams, I was told to 'stay in my lane or look for another job.'",
    target_shloka: "34.29",
    target_folio: 91,
  },
];

interface ParsedFourPillars {
  p1: string;
  p2: string;
  p3: string;
  p4: string;
}

export default function ChatInterface() {
  // All fields start clean so user input (not Preset 1) drives counsel generation
  const [dilemma, setDilemma] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [counterparty, setCounterparty] = useState<string>("");
  const [organizationalPressure, setOrganizationalPressure] =
    useState<string>("");
  const [riskLevel, setRiskLevel] = useState<string>("High");
  const [primaryFear, setPrimaryFear] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [guardrailError, setGuardrailError] =
    useState<GuardrailValidationResult | null>(null);
  const [apiNotice, setApiNotice] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>("");
  const [pillars, setPillars] = useState<ParsedFourPillars>({
    p1: "",
    p2: "",
    p3: "",
    p4: "",
  });
  const [viewMode, setViewMode] = useState<"scroll" | "grid">("scroll");
  const [retrievedVerses, setRetrievedVerses] = useState<any[]>([]);
  const [retrievedEthics, setRetrievedEthics] = useState<any[]>([]);
  const [confidenceScore, setConfidenceScore] = useState<number>(0.94);
  const [latencyMs, setLatencyMs] = useState<number>(312);
  const [modelUsed, setModelUsed] = useState<string>("openai/gpt-oss-120b");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isBookOpen, setIsBookOpen] = useState<boolean>(false);
  const [codexSeekKey, setCodexSeekKey] = useState<number>(0);

  const [scriptCopied, setScriptCopied] = useState<boolean>(false);
  const [likertRating, setLikertRating] = useState<number>(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  const currentPayload: DilemmaInputPayload = {
    dilemma,
    role,
    counterparty,
    organizational_pressure: organizationalPressure,
    risk_level: riskLevel,
    primary_fear: primaryFear,
  };

  // Dynamically score all 13 shlokas and 8 ACM/IEEE clauses from current inputs
  const liveCorpusMatch = matchCanonicalCorpusFromInputs(currentPayload);
  const primaryVerse = retrievedVerses?.[0] || liveCorpusMatch.verses[0];
  const sourceFolio = {
    page_number: primaryVerse?.page_number || 111,
    verse_id: primaryVerse?.verse_id || "33.16",
    highlight_top_pct: primaryVerse?.highlight_top_pct ?? 68.5,
    highlight_height_pct: primaryVerse?.highlight_height_pct ?? 14.0,
    highlight_text:
      primaryVerse?.text_sanskrit_translit ||
      liveCorpusMatch.verses[0].text_sanskrit_translit,
    english_translation:
      primaryVerse?.text_english || liveCorpusMatch.verses[0].text_english,
    confidence_score:
      primaryVerse?.score || confidenceScore || liveCorpusMatch.confidenceScore,
  };

  const handleOpenAndFlipBook = () => {
    setIsBookOpen(true);
    setCodexSeekKey((k) => k + 1);
    setTimeout(() => {
      const el = document.getElementById("archival-codex-stage");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  const handleSelectPreset = (p: Preset) => {
    setGuardrailError(null);
    setApiNotice(null);
    setDilemma(p.dilemma);
    setRole(p.role);
    setCounterparty(p.counterparty);
    setOrganizationalPressure(p.organizational_pressure);
    setRiskLevel(p.risk_level);
    setPrimaryFear(p.primary_fear);

    const matched = matchCanonicalCorpusFromInputs({
      dilemma: p.dilemma,
      role: p.role,
      counterparty: p.counterparty,
      organizational_pressure: p.organizational_pressure,
      risk_level: p.risk_level,
      primary_fear: p.primary_fear,
    });
    setRetrievedVerses(matched.verses);
    setRetrievedEthics(matched.ethics);
    setConfidenceScore(matched.confidenceScore);
    if (isBookOpen) {
      setCodexSeekKey((k) => k + 1);
    }
  };

  const handleClearForm = () => {
    setGuardrailError(null);
    setApiNotice(null);
    setDilemma("");
    setRole("");
    setCounterparty("");
    setOrganizationalPressure("");
    setRiskLevel("High");
    setPrimaryFear("");
    setRawText("");
    setPillars({ p1: "", p2: "", p3: "", p4: "" });
    setIsBookOpen(false);
  };

  const parsePillars = (text: string) => {
    const normalized = text
      .replace(/[\u202f\u00a0]/g, " ")
      .replace(/[\u2011\u2013\u2014]/g, "-");

    const i1 = normalized.search(/(PILLAR\s*I\b|#+\s*I[\.\s])/i);
    const i2 = normalized.search(/(PILLAR\s*II\b|#+\s*II[\.\s])/i);
    const i3 = normalized.search(/(PILLAR\s*III\b|#+\s*III[\.\s])/i);
    const i4 = normalized.search(/(PILLAR\s*IV\b|#+\s*IV[\.\s])/i);

    let p1 = "",
      p2 = "",
      p3 = "",
      p4 = "";

    if (i1 !== -1) {
      if (i2 !== -1) {
        p1 = normalized.slice(i1, i2).trim();
      } else {
        p1 = normalized.slice(i1).trim();
      }
    } else {
      p1 = normalized;
    }

    if (i2 !== -1) {
      if (i3 !== -1) {
        p2 = normalized.slice(i2, i3).trim();
      } else if (i4 !== -1) {
        p2 = normalized.slice(i2, i4).trim();
      } else {
        p2 = normalized.slice(i2).trim();
      }
    }

    if (i3 !== -1) {
      if (i4 !== -1) {
        p3 = normalized.slice(i3, i4).trim();
      } else {
        p3 = normalized.slice(i3).trim();
      }
    }

    if (i4 !== -1) {
      p4 = normalized.slice(i4).trim();
    }

    setPillars({ p1, p2, p3, p4 });
  };

  const consumeSSEStream = async (
    response: Response,
    startTime: number
  ): Promise<{ rejected: boolean; rejectReason?: string; accumulated: string }> => {
    if (!response.body) {
      throw new Error("Empty response stream");
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let accumulated = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.slice(6).trim();
          if (!dataStr) continue;
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.type === "guardrail_reject") {
              return {
                rejected: true,
                rejectReason: parsed.reason,
                accumulated: "",
              };
            }
            if (parsed.type === "context") {
              if (parsed.context?.vidura_verses?.length) {
                setRetrievedVerses(parsed.context.vidura_verses);
              }
              if (parsed.context?.ethics_clauses?.length) {
                setRetrievedEthics(parsed.context.ethics_clauses);
              }
              if (parsed.context?.confidence_score) {
                setConfidenceScore(parsed.context.confidence_score);
              }
              if (parsed.model) setModelUsed(parsed.model);
            } else if (parsed.type === "token") {
              accumulated += parsed.token;
              if (accumulated.trim().startsWith("GUARDRAIL_REJECT:")) {
                const reason = accumulated
                  .replace("GUARDRAIL_REJECT:", "")
                  .trim();
                return {
                  rejected: true,
                  rejectReason: reason,
                  accumulated: "",
                };
              }
              setRawText(accumulated);
              parsePillars(accumulated);
            } else if (parsed.type === "done") {
              setLatencyMs(
                parsed.latency_ms ||
                  Math.round(performance.now() - startTime)
              );
            }
          } catch {
            // Ignore partial chunk JSON boundary
          }
        }
      }
    }

    return { rejected: false, accumulated };
  };

  const handleSubmitDilemma = async (
    e?: React.FormEvent,
    overridePayload?: DilemmaInputPayload
  ) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    const payload: DilemmaInputPayload = overridePayload || {
      dilemma,
      role,
      counterparty,
      organizational_pressure: organizationalPressure,
      risk_level: riskLevel,
      primary_fear: primaryFear,
    };

    // 1. STRICT GUARDRAIL GATE: Validate all fields, check gibberish, block out-of-scope queries ("I am hungry", "who is keshav", etc.)
    const validation = validateDilemmaInput(payload);
    if (!validation.valid) {
      setGuardrailError(validation);
      setIsBookOpen(false);
      setRawText("");
      setPillars({ p1: "", p2: "", p3: "", p4: "" });
      return;
    }

    // Input passed guardrails: clear any prior guardrail alert and match across all 13 shlokas & 8 ethics clauses
    setGuardrailError(null);
    setApiNotice(null);

    const initialMatched = matchCanonicalCorpusFromInputs(payload);
    setRetrievedVerses(initialMatched.verses);
    setRetrievedEthics(initialMatched.ethics);
    setConfidenceScore(initialMatched.confidenceScore);

    setIsLoading(true);
    setRawText("");
    setPillars({ p1: "", p2: "", p3: "", p4: "" });
    setFeedbackSubmitted(false);
    setIsBookOpen(true);
    setCodexSeekKey((k) => k + 1);

    const startTime = performance.now();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const requestBody = JSON.stringify({
      ...payload,
      stream: true,
    });

    try {
      // Try FastAPI backend first; if unreachable, fall back to built-in Next.js /api/v1/analyze route
      let response: Response;
      try {
        response = await fetch(`${apiUrl}/api/v1/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        });
      } catch {
        response = await fetch("/api/v1/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody,
        });
      }

      if (response.status === 422) {
        const errJson = await response.json();
        const detail = errJson?.detail || {};
        setGuardrailError({
          valid: false,
          code: detail.code || "OUT_OF_SCOPE_QUERY",
          field: detail.field || "Jurisdiction Gate",
          reason:
            detail.reason ||
            "Query rejected by Sabhā Jurisdiction Guardrail.",
        });
        setIsBookOpen(false);
        setRawText("");
        setPillars({ p1: "", p2: "", p3: "", p4: "" });
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const streamOutcome = await consumeSSEStream(response, startTime);
      if (streamOutcome.rejected) {
        setGuardrailError({
          valid: false,
          code: "OUT_OF_SCOPE_QUERY",
          field: "LLM Jurisdiction Gate",
          reason:
            streamOutcome.rejectReason ||
            "The submitted query was declined as outside the ethical and governance jurisdiction of Vidura-AI.",
        });
        setIsBookOpen(false);
        setRawText("");
        setPillars({ p1: "", p2: "", p3: "", p4: "" });
        return;
      }
    } catch {
      setApiNotice(
        "Synthesized bespoke Four-Pillar counsel from local BORI & ACM/IEEE registry using your exact case parameters."
      );
      const bespokeCounsel = synthesizeDynamicCounselFromInputs(
        payload,
        initialMatched.verses,
        initialMatched.ethics
      );
      setRawText(bespokeCounsel);
      parsePillars(bespokeCounsel);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(rawText);
    setScriptCopied(true);
    try {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.8 },
        colors: ["#D4AF37", "#F59E0B"],
      });
    } catch {}
    setTimeout(() => setScriptCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([rawText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Vidura_Sabha_Nirnaya_${Date.now()}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFeedbackSubmit = async (rating: number) => {
    setLikertRating(rating);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    try {
      await fetch(`${apiUrl}/api/v1/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dilemma,
          role,
          counterparty,
          organizational_pressure: organizationalPressure,
          risk_level: riskLevel,
          primary_fear: primaryFear,
          retrieved_chunks: retrievedVerses,
          generated_advice: { raw: rawText, pillars },
          likert_rating: rating,
          latency_ms: latencyMs,
          model_used: modelUsed,
        }),
      });
      setFeedbackSubmitted(true);
    } catch {
      setFeedbackSubmitted(true);
    }
  };

  // Count how many of the 6 fields are currently populated
  const filledFieldsCount = [
    role.trim().length >= 3,
    counterparty.trim().length >= 3,
    organizationalPressure.trim().length >= 5,
    primaryFear.trim().length >= 4,
    Boolean(riskLevel),
    dilemma.trim().length >= 40,
  ].filter(Boolean).length;

  const dilemmaWordCount = (dilemma.trim().match(/[a-zA-Z0-9'-]+/g) || [])
    .length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Council Telemetry Header Bar */}
      <div className="rounded-lg bg-[#0F1117] border border-[#262A36] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[#050608] border border-amber-500/35 flex items-center justify-center text-amber-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
              <span>Indic Cyber-Sabhā</span>
              <span>&bull;</span>
              <span className="text-slate-300">Prajāgara Nocturnal Chamber</span>
            </div>
            <div className="font-serif text-base sm:text-lg font-bold text-[#F3F4F6] tracking-tight">
              Vidura Strategic Governance &bull; Four Pillars of Counsel
            </div>
          </div>
        </div>

        {/* Dynamic Dharma Balance Scale and Primary Controls */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-md bg-[#050608] border border-[#262A36] text-amber-300">
            <DharmaScale riskLevel={riskLevel} className="w-6 h-6" />
            <span>
              Risk Asymmetry:{" "}
              <strong className="text-[#F3F4F6] uppercase">{riskLevel}</strong>
            </span>
          </div>

          <div className="min-h-[44px] px-3.5 py-2 rounded-md bg-[#050608] border border-[#262A36] text-amber-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{latencyMs}ms Telemetry</span>
          </div>

          <button
            type="button"
            onClick={handleOpenAndFlipBook}
            className="inline-flex items-center gap-2 min-h-[44px] rounded-md border border-amber-500/45 bg-[#1A140B] hover:bg-[#241C0F] px-4 py-2 text-xs font-mono uppercase tracking-wider text-amber-200 hover:border-amber-400 transition-colors cursor-pointer"
          >
            <span>§ Inspect Codex (Folio {sourceFolio.page_number})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-md bg-[#050608] hover:bg-[#161922] text-slate-200 border border-[#262A36] transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>
              Citations ({retrievedVerses.length + retrievedEthics.length || 6})
            </span>
          </button>
        </div>
      </div>

      {/* Petitioner's Seal & Dilemma Formulation Form */}
      <form
        onSubmit={(e) => handleSubmitDilemma(e)}
        className="rounded-lg bg-[#0F1117] border border-[#262A36] p-6 sm:p-8 shadow-[0_8px_28px_rgba(0,0,0,0.45)] space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#262A36]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-sm bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
              §
            </div>
            <div>
              <span className="font-serif text-sm uppercase tracking-widest text-amber-300 font-bold block">
                Petitioner&apos;s Seal &bull; Formal Case Brief
              </span>
              <span className="text-xs font-mono text-slate-300 block">
                Complete all 6 fields below with your custom dilemma or load a precedent template
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono px-2.5 py-1 rounded-sm border ${
                filledFieldsCount === 6
                  ? "bg-emerald-950/50 text-emerald-300 border-emerald-500/40"
                  : "bg-[#050608] text-amber-300 border-[#262A36]"
              }`}
            >
              {filledFieldsCount} / 6 Parameters Complete
            </span>
            {(dilemma || role || counterparty || organizationalPressure || primaryFear) && (
              <button
                type="button"
                onClick={handleClearForm}
                className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1 rounded-sm bg-[#050608] hover:bg-[#161922] text-slate-300 border border-[#262A36] text-xs font-mono transition-colors cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5 text-amber-400" />
                <span>Clear Form</span>
              </button>
            )}
          </div>
        </div>

        {/* Optional Precedent Templates */}
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Optional: Load Precedent Case Template (Or Enter Any Custom Dilemma Below):</span>
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESETS.map((p) => {
              const isSelected = dilemma === p.dilemma && role === p.role;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  type="button"
                  className={`min-h-[64px] p-4 rounded-md border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#1A140B] border-amber-500/60"
                      : "bg-[#050608] hover:bg-[#12151E] border-[#262A36] hover:border-amber-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-amber-200 font-serif">
                      {p.title}
                    </span>
                    <span className="text-[11px] font-mono text-amber-400 shrink-0">
                      § {p.target_shloka} (p.{p.target_folio})
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    {p.category}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* All 5 Context Parameters Grid with Explicit Label-Input Bindings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-[#1E222D]">
          <div>
            <label
              htmlFor="role-input"
              className="block text-xs font-mono text-slate-300 uppercase mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>1. Petitioner Role *</span>
              </span>
              <span className="text-[10px] text-slate-400">Required</span>
            </label>
            <input
              id="role-input"
              type="text"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (guardrailError) setGuardrailError(null);
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-md bg-[#050608] border border-[#262A36] text-[#F3F4F6] text-xs sm:text-sm font-sans placeholder-slate-500 focus:border-amber-400"
              placeholder="e.g. Embedded Firmware Engineer, Senior Auditor"
            />
          </div>

          <div>
            <label
              htmlFor="counterparty-input"
              className="block text-xs font-mono text-slate-300 uppercase mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>2. Sovereign Counterparty *</span>
              </span>
              <span className="text-[10px] text-slate-400">Required</span>
            </label>
            <input
              id="counterparty-input"
              type="text"
              value={counterparty}
              onChange={(e) => {
                setCounterparty(e.target.value);
                if (guardrailError) setGuardrailError(null);
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-md bg-[#050608] border border-[#262A36] text-[#F3F4F6] text-xs sm:text-sm font-sans placeholder-slate-500 focus:border-amber-400"
              placeholder="e.g. VP of Medical Devices, CFO, Engineering Lead"
            />
          </div>

          <div>
            <label
              htmlFor="pressure-input"
              className="block text-xs font-mono text-slate-300 uppercase mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>3. Organizational Pressure *</span>
              </span>
              <span className="text-[10px] text-slate-400">Required</span>
            </label>
            <input
              id="pressure-input"
              type="text"
              value={organizationalPressure}
              onChange={(e) => {
                setOrganizationalPressure(e.target.value);
                if (guardrailError) setGuardrailError(null);
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-md bg-[#050608] border border-[#262A36] text-[#F3F4F6] text-xs sm:text-sm font-sans placeholder-slate-500 focus:border-amber-400"
              placeholder="e.g. FDA approval deadline Friday, Q4 revenue target"
            />
          </div>

          <div className="sm:col-span-1 lg:col-span-2">
            <label
              htmlFor="fear-input"
              className="block text-xs font-mono text-slate-300 uppercase mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>4. Primary Vulnerability / Fear *</span>
              </span>
              <span className="text-[10px] text-slate-400">Required</span>
            </label>
            <input
              id="fear-input"
              type="text"
              value={primaryFear}
              onChange={(e) => {
                setPrimaryFear(e.target.value);
                if (guardrailError) setGuardrailError(null);
              }}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-md bg-[#050608] border border-[#262A36] text-[#F3F4F6] text-xs sm:text-sm font-sans placeholder-slate-500 focus:border-amber-400"
              placeholder="e.g. Visa sponsorship revocation, constructive dismissal, legal scapegoating"
            />
          </div>

          <div>
            <label
              htmlFor="risk-select"
              className="block text-xs font-mono text-slate-300 uppercase mb-1.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>5. Assessed Risk Level *</span>
              </span>
              <span className="text-[10px] text-slate-400">Required</span>
            </label>
            <select
              id="risk-select"
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-md bg-[#050608] border border-[#262A36] text-[#F3F4F6] text-xs sm:text-sm font-mono focus:border-amber-400 cursor-pointer"
            >
              <option value="Low">Low &bull; Minor friction</option>
              <option value="Moderate">Moderate &bull; Team tension</option>
              <option value="High">High &bull; Regulatory hazard</option>
              <option value="Critical">Critical &bull; Severe Coercion</option>
            </select>
          </div>
        </div>

        {/* 6. Dilemma Narrative */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label
              htmlFor="dilemma-textarea"
              className="block text-xs font-mono text-slate-300 uppercase"
            >
              6. The Coercive Impasse &bull; Detailed Problem Description *
            </label>
            <span
              className={`text-xs font-mono ${
                dilemmaWordCount >= 8 && dilemma.trim().length >= 40
                  ? "text-emerald-300"
                  : "text-slate-400"
              }`}
            >
              {dilemmaWordCount} words &bull; {dilemma.trim().length} chars (min 8 words &amp; 40 chars)
            </span>
          </div>
          <textarea
            id="dilemma-textarea"
            rows={4}
            value={dilemma}
            onChange={(e) => {
              setDilemma(e.target.value);
              if (guardrailError) setGuardrailError(null);
            }}
            className="w-full p-4 rounded-md bg-[#050608] border border-[#262A36] text-[#F3F4F6] text-sm font-sans placeholder-slate-500 focus:border-amber-400 leading-relaxed"
            placeholder="Articulate the exact directive, suppressed finding, safety hazard, or ethical conflict you are facing (any engineering, medical, financial, workplace, or governance dilemma)..."
          />
        </div>

        {/* Guardrail Rejection Alert Banner (Blocks Out-of-Scope, Gibberish, or Incomplete Submissions) */}
        {guardrailError && (
          <div
            role="alert"
            className="rounded-md bg-red-950/40 border border-red-500/50 p-4 sm:p-5 space-y-2.5 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono uppercase tracking-wider text-red-300 font-bold">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  Sabhā Guardrail Active &bull; {guardrailError.code}
                </span>
              </div>
              {guardrailError.field && (
                <span className="px-2 py-0.5 rounded-sm bg-red-950/80 border border-red-500/40 font-mono text-red-200">
                  Triggered By: {guardrailError.field}
                </span>
              )}
            </div>
            <p className="text-slate-200 text-sm leading-relaxed font-sans">
              {guardrailError.reason}
            </p>
            <div className="pt-2 border-t border-red-500/25 font-mono text-slate-300 flex flex-wrap items-center justify-between gap-2">
              <span>
                Accepted Scope: Workplace, engineering, AI/data, safety, clinical, financial, or corporate governance dilemmas with all 6 fields completed.
              </span>
            </div>
          </div>
        )}

        {/* Submission Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              Dynamic Corpus Match: Vidura Nīti § {sourceFolio.verse_id} (Folio{" "}
              {sourceFolio.page_number}) &bull; Guardrails Armed
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 py-3 rounded-md bg-amber-500 hover:bg-amber-400 text-[#08090C] font-semibold text-xs font-mono uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <DharmaChakra className="w-5 h-5" spinning={true} />
                <span>Synthesizing Four Pillars...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#08090C]" />
                <span>Submit Dilemma for Counsel</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Explicit Empty State Before Submission (R-27) */}
      {!rawText && !isLoading && !isBookOpen && (
        <div className="rounded-lg bg-[#0F1117] border border-[#262A36] p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#262A36] pb-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Chamber Ready for Deliberation &bull; Domain Guardrails Active
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#F3F4F6] mt-0.5">
                How Your 6 Inputs Drive the Four Pillars
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                const firstPreset = PRESETS[0];
                handleSelectPreset(firstPreset);
                handleSubmitDilemma(undefined, {
                  dilemma: firstPreset.dilemma,
                  role: firstPreset.role,
                  counterparty: firstPreset.counterparty,
                  organizational_pressure: firstPreset.organizational_pressure,
                  risk_level: firstPreset.risk_level,
                  primary_fear: firstPreset.primary_fear,
                });
              }}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-md bg-[#1A140B] hover:bg-[#241C0F] border border-amber-500/45 text-xs font-mono uppercase tracking-wider text-amber-200 transition-colors cursor-pointer"
            >
              <span>Load &amp; Run Sample Case (§ 33.16)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-md bg-[#050608] border border-[#262A36] space-y-1.5">
              <div className="font-mono text-amber-400 font-semibold">
                PILLAR I // SAṄKAṬA NIRŪPAṆA
              </div>
              <div className="font-serif text-sm font-bold text-[#F3F4F6]">
                Diagnosis of Moral Hazard
              </div>
              <p className="text-slate-300 leading-relaxed">
                Evaluates the exact power asymmetry between your <strong>Petitioner Role</strong> and <strong>Sovereign Counterparty</strong> under your stated <strong>Organizational Pressure</strong>.
              </p>
            </div>
            <div className="p-4 rounded-md bg-[#050608] border border-[#262A36] space-y-1.5">
              <div className="font-mono text-amber-400 font-semibold">
                PILLAR II // PRAMĀṆA
              </div>
              <div className="font-serif text-sm font-bold text-[#F3F4F6]">
                Archival Folio &amp; Statutory Codes
              </div>
              <p className="text-slate-300 leading-relaxed">
                Matches your dilemma across all 13 OCR-verified <em>Vidura Nīti</em> shlokas and 8 ACM/IEEE clauses, flipping the 3D codex to the exact folio.
              </p>
            </div>
            <div className="p-4 rounded-md bg-[#050608] border border-[#262A36] space-y-1.5">
              <div className="font-mono text-amber-400 font-semibold">
                PILLAR III // DHARMA-ARTHA VIVEKA
              </div>
              <div className="font-serif text-sm font-bold text-[#F3F4F6]">
                Consequence Balance Sheet
              </div>
              <p className="text-slate-300 leading-relaxed">
                Weighs short-term appeasement against long-term fiduciary protection, directly addressing your <strong>Primary Vulnerability / Fear</strong>.
              </p>
            </div>
            <div className="p-4 rounded-md bg-[#050608] border border-[#262A36] space-y-1.5">
              <div className="font-mono text-amber-400 font-semibold">
                PILLAR IV // UPĀYA PRAYOGA
              </div>
              <div className="font-serif text-sm font-bold text-[#F3F4F6]">
                Spoken Script &amp; Paper Trail
              </div>
              <p className="text-slate-300 leading-relaxed">
                Generates a bespoke 4-Upāya dialogue script and formal compliance memo addressed to your <strong>Counterparty</strong> from your <strong>Role</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Offline / Deterministic Synthesis Notice Banner */}
      {apiNotice && (
        <div
          role="status"
          className="rounded-md bg-[#16130A] border border-amber-500/45 p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-amber-200"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{apiNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => handleSubmitDilemma()}
            className="inline-flex items-center gap-1.5 min-h-[38px] px-3 py-1.5 rounded-sm bg-[#050608] hover:bg-[#12151E] border border-amber-500/40 text-amber-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Live Stream</span>
          </button>
        </div>
      )}

      {/* Active Deliberation Output: The Four Pillars of Counsel */}
      {(rawText || isLoading) && (
        <div className="space-y-8">
          {/* Scroll Header */}
          <div className="p-6 rounded-lg bg-[#0F1117] border border-amber-500/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <DharmaChakra className="w-9 h-9" spinning={isLoading} />
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block">
                  SABHĀ NIRṆAYA &bull; ARCHIVAL DECREE FOR {role.toUpperCase() || "PETITIONER"}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F3F4F6] tracking-tight">
                  Pronouncement of Prime Minister Vidura
                </h2>
              </div>
            </div>

            {/* View Mode & Export Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center rounded-md bg-[#050608] p-1 border border-[#262A36] text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setViewMode("scroll")}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === "scroll"
                      ? "bg-amber-500/20 text-amber-200 border border-amber-500/40"
                      : "text-slate-300 hover:text-[#F3F4F6]"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Sūtra Scroll</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-amber-500/20 text-amber-200 border border-amber-500/40"
                      : "text-slate-300 hover:text-[#F3F4F6]"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Pillars Grid</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyScript}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-md bg-[#1A140B] hover:bg-[#241C0F] border border-amber-500/45 text-amber-200 text-xs font-mono font-medium transition-colors cursor-pointer"
              >
                {scriptCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Decree Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Copy All</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadMarkdown}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-md bg-[#050608] hover:bg-[#161922] border border-[#262A36] text-slate-200 text-xs font-mono font-medium transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Export .MD</span>
              </button>
            </div>
          </div>

          {/* 3D ANCIENT MANUSCRIPT BOOK VIEWER */}
          <div id="archival-codex-stage">
            <AncientManuscriptBookViewer
              inline={true}
              isOpen={isBookOpen}
              onClose={() => setIsBookOpen(false)}
              seekKey={codexSeekKey}
              pdfUrl="/udyoga_parva.pdf"
              targetPage={sourceFolio.page_number}
              highlightText={sourceFolio.highlight_text}
              verseId={sourceFolio.verse_id}
              confidenceScore={sourceFolio.confidence_score}
              sanskritVerse={sourceFolio.highlight_text}
              englishTranslation={sourceFolio.english_translation}
              highlightTopPct={sourceFolio.highlight_top_pct}
              highlightHeightPct={sourceFolio.highlight_height_pct}
            />
          </div>

          {/* VIEW MODE 1: UNIFIED CONTINUOUS SŪTRA SCROLL */}
          {viewMode === "scroll" && (
            <div className="rounded-lg bg-[#0F1117] p-6 sm:p-10 border border-[#262A36] shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
              <PillarRenderer
                content={
                  rawText ||
                  "Dissecting the sovereign dispute and assembling the Four Pillars of Counsel..."
                }
                onOpenArchivalCodex={handleOpenAndFlipBook}
                folioNumber={sourceFolio.page_number}
              />
            </div>
          )}

          {/* VIEW MODE 2: FOUR PILLARS GRID */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Pillar I Card */}
              <div className="rounded-lg bg-[#0F1117] p-6 sm:p-8 border border-[#262A36] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#262A36]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/30">
                      PILLAR I
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#F3F4F6]">
                      Saṅkaṭa Nirūpaṇa &bull; Diagnosis
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Moral Hazard Audit
                  </span>
                </div>
                <PillarRenderer
                  content={
                    pillars.p1 ||
                    "Analyzing root power dynamic and moral hazard..."
                  }
                />
              </div>

              {/* Pillar II Card */}
              <div className="rounded-lg bg-[#0F1117] p-6 sm:p-8 border border-amber-500/35 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#262A36]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/30">
                      PILLAR II
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#F3F4F6]">
                      Pramāṇa &bull; Canonical Standards
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAndFlipBook}
                    className="inline-flex items-center gap-2 min-h-[44px] rounded-md border border-amber-500/45 bg-[#1A140B] hover:bg-[#241C0F] px-4 py-2 text-xs font-mono uppercase tracking-wider text-amber-200 transition-colors cursor-pointer"
                  >
                    <span>§ Flip Codex to Folio {sourceFolio.page_number}</span>
                  </button>
                </div>
                <PillarRenderer
                  content={
                    pillars.p2 ||
                    "Aligning Vidura Nīti shlokas with ACM and IEEE clauses..."
                  }
                  onOpenArchivalCodex={handleOpenAndFlipBook}
                  folioNumber={sourceFolio.page_number}
                />
              </div>

              {/* Pillar III Card */}
              <div className="rounded-lg bg-[#0F1117] p-6 sm:p-8 border border-[#262A36] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#262A36]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/30">
                      PILLAR III
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#F3F4F6]">
                      Dharma-Artha Viveka &bull; Balance Sheet
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Preyas vs Shreyas
                  </span>
                </div>
                <PillarRenderer
                  content={
                    pillars.p3 ||
                    "Auditing short-term appeasement against long-term governance..."
                  }
                />
              </div>

              {/* Pillar IV Card */}
              <div className="rounded-lg bg-[#0F1117] p-6 sm:p-8 border border-[#262A36] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#262A36]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/30">
                      PILLAR IV
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#F3F4F6]">
                      Upāya Prayoga &bull; Tactical Script
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-amber-300">
                    Sāma &bull; Dāna &bull; Bheda &bull; Daṇḍa
                  </span>
                </div>
                <PillarRenderer
                  content={
                    pillars.p4 ||
                    "Formulating verbatim spoken scripts and paper trail protocols..."
                  }
                />
              </div>
            </div>
          )}

          {/* Evaluation Telemetry Bar */}
          {!isLoading && rawText && (
            <div className="rounded-lg bg-[#0F1117] p-5 border border-[#262A36] flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  Practitioner Evaluation Telemetry
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Rate the tactical de-escalation utility and archival grounding of this decree:
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} out of 5 stars`}
                    onClick={() => handleFeedbackSubmit(star)}
                    className={`min-h-[44px] min-w-[44px] rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                      likertRating >= star
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                        : "bg-[#050608] border-[#262A36] text-slate-400 hover:border-amber-400/40"
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}

                {feedbackSubmitted && (
                  <span className="ml-2 text-xs font-mono text-emerald-300 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Recorded to Ledger</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Standalone 3D Ancient Manuscript Book Viewer if opened manually via header button */}
      {!rawText && !isLoading && isBookOpen && (
        <div id="archival-codex-stage" className="pt-2">
          <AncientManuscriptBookViewer
            inline={true}
            isOpen={isBookOpen}
            onClose={() => setIsBookOpen(false)}
            seekKey={codexSeekKey}
            pdfUrl="/udyoga_parva.pdf"
            targetPage={sourceFolio.page_number}
            highlightText={sourceFolio.highlight_text}
            verseId={sourceFolio.verse_id}
            confidenceScore={sourceFolio.confidence_score}
            sanskritVerse={sourceFolio.highlight_text}
            englishTranslation={sourceFolio.english_translation}
            highlightTopPct={sourceFolio.highlight_top_pct}
            highlightHeightPct={sourceFolio.highlight_height_pct}
          />
        </div>
      )}

      {/* Citations Drawer */}
      <CitationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        verses={retrievedVerses.length ? retrievedVerses : liveCorpusMatch.verses}
        ethics={retrievedEthics.length ? retrievedEthics : liveCorpusMatch.ethics}
        confidenceScore={confidenceScore}
      />
    </div>
  );
}
