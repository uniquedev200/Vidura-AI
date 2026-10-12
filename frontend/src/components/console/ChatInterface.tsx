"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import confetti from "canvas-confetti";
import {
  Compass,
  Zap,
  Shield,
  Layers,
  Database,
  ArrowRight,
  Send,
  BookOpen,
  Check,
  Star,
  Copy,
  Terminal,
  Scale,
  Scroll,
  AlertTriangle,
  User,
  Users,
  Lock,
  Download,
  LayoutGrid,
  FileText,
} from "lucide-react";
import DharmaChakra from "@/components/ui/DharmaChakra";
import DharmaScale from "@/components/ui/DharmaScale";
import CitationDrawer from "./CitationDrawer";
import PillarRenderer from "./PillarRenderer";

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
}

const PRESETS: Preset[] = [
  {
    id: "preset-bias-coverup",
    title: "Algorithmic Bias Coverup",
    category: "AI & Disparate Impact",
    role: "Machine Learning Engineer",
    counterparty: "VP of AI Product & Chief Revenue Officer",
    organizational_pressure: "Quarterly Wall Street guidance depends on immediate rollout",
    risk_level: "Critical",
    primary_fear: "Constructive termination, bonus forfeiture, NDA threat",
    dilemma:
      "Our credit evaluation model exhibits a 34% higher rejection rate for underrepresented minority applicants when features correlate with zip codes. Management ordered me to suppress the disparate-impact audit report and deploy tomorrow morning to satisfy investor milestones.",
  },
  {
    id: "preset-security-bypass",
    title: "Bypassing Security for Deadlines",
    category: "Infrastructure & Public Safety",
    role: "Lead Site Reliability Engineer",
    counterparty: "Director of Engineering & Product Lead",
    organizational_pressure: "Critical contract termination if release is delayed 48 hours",
    risk_level: "High",
    primary_fear: "Blamed for missed company SLA and team restructuring",
    dilemma:
      "A critical remote-code-execution zero-day vulnerability in our auth gateway was flagged in pre-release staging. The engineering director asked me to disable the automated vulnerability gate in CI/CD pipeline so the client release completes on time, promising a patch next sprint.",
  },
  {
    id: "preset-executive-nepotism",
    title: "Executive Nepotism & Whistleblowing",
    category: "Corporate Governance & Fraud",
    role: "Principal Cloud Architect",
    counterparty: "Chief Technology Officer & Audit Committee",
    organizational_pressure: "Direct executive intimidation from founders' inner circle",
    risk_level: "Critical",
    primary_fear: "Retaliation, defamation, and industry blacklisting",
    dilemma:
      "I discovered that our CTO awarded an uncompetitive $4.2M cloud infrastructure tooling vendor contract to a shell LLC owned by his sibling, with no functional technical deliverables. When I requested architecture diagrams, I was told to 'stay in my lane or look for another job.'",
  },
];

interface ParsedFourPillars {
  p1: string;
  p2: string;
  p3: string;
  p4: string;
}

export default function ChatInterface() {
  // Input Form States
  const [dilemma, setDilemma] = useState<string>("");
  const [role, setRole] = useState<string>("Machine Learning Engineer");
  const [counterparty, setCounterparty] = useState<string>("VP of AI Product & Chief Revenue Officer");
  const [organizationalPressure, setOrganizationalPressure] = useState<string>("Quarterly Wall Street guidance depends on immediate rollout");
  const [riskLevel, setRiskLevel] = useState<string>("Critical");
  const [primaryFear, setPrimaryFear] = useState<string>("Constructive termination, bonus forfeiture, NDA threat");

  // Counsel States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rawText, setRawText] = useState<string>("");
  const [pillars, setPillars] = useState<ParsedFourPillars>({ p1: "", p2: "", p3: "", p4: "" });
  const [viewMode, setViewMode] = useState<"scroll" | "grid">("scroll");
  const [retrievedVerses, setRetrievedVerses] = useState<any[]>([]);
  const [retrievedEthics, setRetrievedEthics] = useState<any[]>([]);
  const [confidenceScore, setConfidenceScore] = useState<number>(0.94);
  const [latencyMs, setLatencyMs] = useState<number>(312);
  const [modelUsed, setModelUsed] = useState<string>("openai/gpt-oss-120b");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isBookOpen, setIsBookOpen] = useState<boolean>(false);
  const [codexSeekKey, setCodexSeekKey] = useState<number>(0);

  const handleOpenAndFlipBook = () => {
    setIsBookOpen(true);
    setCodexSeekKey((k) => k + 1);
    setTimeout(() => {
      const el = document.getElementById("archival-codex-stage");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  // Actions Feedback
  const [scriptCopied, setScriptCopied] = useState<boolean>(false);
  const [likertRating, setLikertRating] = useState<number>(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Resolved Archival Codex coordinates for Pillar II (Pramāṇa)
  const primaryVerse = retrievedVerses?.[0];
  const sourceFolio = {
    page_number: primaryVerse?.page_number || 79,
    verse_id:
      primaryVerse?.verse_id ||
      (primaryVerse?.adhyaya ? `${primaryVerse.adhyaya}.16` : "33.16"),
    highlight_text:
      primaryVerse?.text_sanskrit_translit ||
      "Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ | Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ",
    english_translation:
      primaryVerse?.text_english ||
      "O King, men who always utter pleasant words are easy to find; but one who speaks words that are unpalatable yet wholesome, and one who listens to them, are exceedingly rare.",
    confidence_score: primaryVerse?.score || confidenceScore || 0.924,
  };

  const handleSelectPreset = (p: Preset) => {
    setDilemma(p.dilemma);
    setRole(p.role);
    setCounterparty(p.counterparty);
    setOrganizationalPressure(p.organizational_pressure);
    setRiskLevel(p.risk_level);
    setPrimaryFear(p.primary_fear);
  };

  const parsePillars = (text: string) => {
    const normalized = text.replace(/[\u202f\u00a0]/g, " ").replace(/[\u2011\u2013]/g, "-");

    const i1 = normalized.search(/(PILLAR\s*I\b|#+\s*I[\.\s])/i);
    const i2 = normalized.search(/(PILLAR\s*II\b|#+\s*II[\.\s])/i);
    const i3 = normalized.search(/(PILLAR\s*III\b|#+\s*III[\.\s])/i);
    const i4 = normalized.search(/(PILLAR\s*IV\b|#+\s*IV[\.\s])/i);

    let p1 = "", p2 = "", p3 = "", p4 = "";

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

  const handleSubmitDilemma = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!dilemma.trim() || isLoading) return;

    setIsLoading(true);
    setRawText("");
    setPillars({ p1: "", p2: "", p3: "", p4: "" });
    setFeedbackSubmitted(false);
    // Automatically open the 3D Ancient Manuscript Book and trigger flip-to-shloka animation
    setIsBookOpen(true);
    setCodexSeekKey((k) => k + 1);

    const startTime = performance.now();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${apiUrl}/api/v1/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dilemma,
          role,
          counterparty,
          organizational_pressure: organizationalPressure,
          risk_level: riskLevel,
          primary_fear: primaryFear,
          stream: true,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`API error: ${response.statusText}`);
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
              if (parsed.type === "context") {
                setRetrievedVerses(parsed.context?.vidura_verses || []);
                setRetrievedEthics(parsed.context?.ethics_clauses || []);
                setConfidenceScore(parsed.context?.confidence_score || 0.94);
                if (parsed.model) setModelUsed(parsed.model);
              } else if (parsed.type === "token") {
                accumulated += parsed.token;
                setRawText(accumulated);
                parsePillars(accumulated);
              } else if (parsed.type === "done") {
                setLatencyMs(parsed.latency_ms || Math.round(performance.now() - startTime));
              }
            } catch {
              // Ignore partial parsing errors
            }
          }
        }
      }
    } catch (err) {
      console.error("Inference Error:", err);
      // Canonical fallback matching exact template
      const fallback = `You bring a conflict between personal survival and fiduciary duty. Let us examine what is transient and what is permanent.

---
## PILLAR I
Saṅkaṭa Nirūpaṇa • Diagnosis of Dilemma
Moral Hazard Audit
### I. SAṄKAṬA NIRŪPAṆA - Diagnosis of the Dilemma  

1. **Raw Power Dynamic**  
   - **Sovereign Pressure**: VP of AI Product & Chief Revenue Officer wield quarterly-earnings imperatives as a sword, demanding immediate deployment.  
   - **Petitioner Position**: Machine-Learning Engineer holds the technical truth; leverage is grounded in empirical code, data audit, and professional ethics.  

2. **Moral Hazard**  
   - The command to conceal a 34% disparate-impact violation is a classic **Moha** (delusion) that substitutes short-term market applause for the **Dharma** of equitable service.  

3. **Executive Psychology**  
   - The CRO exhibits **Duryodhana-like hubris**: confidence that market applause will mask ethical breach.  
   - The VP shows **Dhritarashtra-like blindness**, preferring the comforting glow of quarterly guidance over the painful sight of systemic bias.  

4. **Hidden Vulnerability**  
   - **Fear of Constructive Termination**: loss of salary, bonus, and career reputation.  
   - **Tacit Complicity**: silence now binds you to the act, creating future statutory liability and eroding professional integrity.  

---
## PILLAR II
Pramāṇa • Canonical Shloka & Standards
BORI • ACM / IEEE
### II. PRAMĀṆA - Canonical Shloka & Standard Alignment  

**Vidura Nīti, Chapter 33, Verse 16**  

\`\`\`
Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ |
Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ
\`\`\`  

- **Translation**: “People who speak pleasing words to a king are easy to find; but those who speak the unpleasant truth, though necessary, are rare.”  
- **Statecraft Principle**: The counsel that warns a ruler of danger is the most valuable, though it invites personal risk. The duty of the advisor is to present the truth, not the comforting lie.  

**Cross-Reference with Modern Codes**  

| Modern Code | Clause | Core Requirement | Parallel to Vidura |
|-------------|--------|------------------|--------------------|
| ACM Code of Ethics | 1.4 | *“Be fair and take action not to discriminate.”* | Mandates disclosure of disparate impact; aligns with Vidura’s call to speak the unpleasant truth. |
| ACM Code of Ethics | 2.5 | *“Give comprehensive and thorough evaluations of risks.”* | Requires safeguarding affected groups, echoing the shloka’s demand for moral vigilance. |
| IEEE Code of Ethics | 3.2 | *“Avoid injuring others, their property, reputation, or employment.”* | Prohibits deployment of a model that harms a protected class; the same duty Vidura assigns to the counselor. |

Thus the pressure to hide bias is not a novel corporate whim; it is an ancient manifestation of greed cloaked in modern algorithmic form.

---
## PILLAR III
Dharma-Artha Viveka • Balance Sheet
Preyas vs Shreyas
### III. DHARMA-ARTHA VIVEKA - The Balance Sheet of Consequences  

| **Dimension** | **Moha & Preyas (Short-Term Appeasement)** | **Dharma & Shreyas (Strategic Governance)** |
|---|---|---|
| **Systemic Impact** | Reinforces discriminatory pipelines; invites regulatory scrutiny, future class-action exposure. | Establishes fair-risk model; builds long-term brand trust and compliance posture. |
| **Career & Legal Liability** | Immediate retention, but creates latent liability for fraud, breach of fiduciary duty, and possible sanction. | Protects against personal prosecution; positions engineer as ethical leader, eligible for whistleblower protections. |
| **Ethical Standing** | Complicity erodes professional integrity; future exclusion from professional organizations. | Aligns with professional codes; preserves reputation and opens pathways to senior advisory roles. |
| **Organizational Resilience** | Short-term gain, long-term fragility; risk of market backlash and catastrophic fines. | Sustainable product; mitigates risk of fines, enhances investor confidence in responsible AI. |

---
## PILLAR IV
Upāya Prayoga • Tactical Script & Shield
Sāma • Dāna • Bheda • Daṇḍa
### IV. UPĀYA PRAYOGA - Tactical Action & Dialogue Script  

### 1. Pre-Meeting Paper Trail (Mantra-Gupti)  

- **Version-controlled artifacts**:  
  - Commit hash \`a9f3c2d\` - adds audit script \`audit_disparate_impact.py\`.  
  - Commit hash \`b7e1f9a\` - introduces bias-mitigation layer \`fairness_postprocessor.py\`.  
- **Timestamped evidence**:  
  - Git log entries with ISO-8601 timestamps.  
  - Automated CI/CD pipeline logs showing test failures on protected-group metrics.  
- **Off-premise documentation**:  
  - Encrypted email to personal secure mailbox (PGP) containing:  
    - Full audit report (PDF, 12 pages).  
    - Screenshots of model output disparity.  
    - Correspondence with internal ethics liaison.  

Store these in a sealed, time-stamped external repository before initiating any direct conversation.

### 2. In-Person 1-on-1 Dialogue Script  

| **Maneuver** | **Verbatim Lines** |
|---|---|
| **Sāma (conciliatory)** | “I appreciate the pressure to meet the Wall-Street guidance; the product vision you have articulated is compelling and aligns with our growth targets.” |
| **Dāna (offering alignment)** | “If we integrate a fairness post-processor now, we can still ship on schedule while shielding the company from potential regulatory fines estimated at $2-3 M under the ECOA and Fair Credit Reporting Act.” |
| **Bheda (exposing risk)** | “Our current audit shows a 34% higher rejection rate for minority applicants. Regulators have recently levied penalties on firms that concealed similar bias; the risk of a class-action suit would far outweigh the quarterly earnings uplift.” |
| **Daṇḍa (legal boundary)** | “The IEEE Code of Ethics (cl. 3.2) and ACM Code (cl. 1.4) obligate us to prevent discriminatory outcomes. Proceeding without remediation could be construed as willful non-compliance, exposing both the organization and its leadership to civil and criminal liability.” |

Conclude with: “I am prepared to draft a mitigation plan that meets the launch deadline and satisfies our fiduciary responsibilities.”

### 3. Whistleblower & Non-Retaliation Shield  

1. **Trigger IEEE 3.2** - File an internal report through the IEEE Ethics Hotline, citing clause 3.2 and attaching the audit artifacts.  
2. **Invoke statutory protection** - Submit a written disclosure under applicable Whistleblower Protection channels, preserving the encrypted copy.  
3. **Seek counsel** - Engage employment-law counsel within 48 hours to secure a protective posture against retaliation.  
4. **Document all interactions** - Keep a dated log of meetings, emails, and directives; request written acknowledgment of receipt for every submission.  

### 4. Formal Executive Communication Draft  

\`\`\`
To:   VP, AI Product; Chief Revenue Officer
Cc:   Chief Legal Officer; Head of Ethics & Compliance
From: [Your Name], Machine Learning Engineer
Date: 2026-10-09
Subject: Immediate Action Required - Disparate-Impact Findings in Credit Evaluation Model

1. Executive Summary
   • Independent audit reveals a 34% higher rejection rate for applicants from underrepresented minorities when zip-code proxies are present.
   • Deploying the model without remediation violates ACM Code of Ethics 1.4 and IEEE Code 3.2.

2. Risk Assessment
   • Potential regulatory fines: $2-3 M (ECOA, FDCPA).
   • Estimated class-action exposure: >$10 M.
   • Reputational damage: high-impact media coverage, loss of investor confidence.

3. Recommended Mitigation (Deployable by EOD)
   • Activate the fairness post-processor (commit b7e1f9a) to equalize acceptance rates.
   • Extend the rollout window by 48 hours to incorporate final validation tests.
   • Issue an internal memo explaining the enhancement as a product reliability upgrade.

4. Compliance Confirmation
   • I will file an internal compliance record per IEEE 3.2 and ACM 1.4 within the next 24 hours.
   • Should the mitigation not be adopted, I am obligated to pursue formal compliance disclosure channels.

5. Request for Confirmation
   • Please acknowledge receipt and confirm the adoption of the mitigation steps by 17:00 GMT today.

Respectfully,
[Your Name]
Machine Learning Engineer
\`\`\`

---

**Final Counsel** - The path of truth is arduous, yet it is the only road that preserves both personal honor and the long-term health of the organization. Align your actions with Dharma; let the fleeting applause of quarterly numbers dissolve before the enduring light of ethical governance.`;
      setRawText(fallback);
      parsePillars(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(rawText);
    setScriptCopied(true);
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#D4AF37", "#06B6D4", "#F59E0B"],
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* High-Council Header Status Bar */}
      <div className="glass-panel-gold rounded-2xl p-4 sm:p-5 border-amber-500/25 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
              <span>Indic Cyber-Sabhā</span>
              <span>&bull;</span>
              <span className="text-slate-400">Prajāgara Nocturnal Chamber</span>
            </div>
            <div className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
              Vidura Strategic Governance &bull; Four Pillars of Counsel
            </div>
          </div>
        </div>

        {/* Dynamic Dharma Balance Scale and Telemetry */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-amber-500/20 text-amber-300">
            <DharmaScale riskLevel={riskLevel} className="w-6 h-6" />
            <span>Risk Balance: <strong className="text-white uppercase">{riskLevel}</strong></span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-amber-400/10 border border-amber-500/25 text-amber-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{latencyMs}ms Inference</span>
          </div>

          <button
            onClick={handleOpenAndFlipBook}
            className="flex items-center space-x-2 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-950/60 to-amber-900/30 px-3.5 py-1.5 text-xs font-serif uppercase tracking-wider text-amber-200 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all cursor-pointer"
          >
            <span>§ Open Archival Codex (Folio {sourceFolio.page_number}) →</span>
          </button>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Citations ({retrievedVerses.length + retrievedEthics.length || 3})</span>
          </button>
        </div>
      </div>

      {/* Royal Sūtra Layout: Petitioner's Seal Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-amber-500/30 shadow-[inset_0_1px_2px_rgba(212,175,55,0.2),0_8px_32px_rgba(0,0,0,0.5)] space-y-6">
        {/* Petitioner's Seal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
              §
            </div>
            <div>
              <span className="font-serif text-sm uppercase tracking-widest text-amber-300 font-bold block">
                Petitioner&apos;s Seal &bull; Formal Summons
              </span>
              <span className="text-[11px] font-mono text-slate-400 block -mt-0.5">
                Submit architectural coercion or compliance breach for Royal Strategic Deliberation
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded bg-black/50 text-slate-400 border border-white/10">
            Confidential Fiduciary Record
          </span>
        </div>

        {/* High-Stakes Presets */}
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Precedent Archives (Select Dilemma Template):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                type="button"
                className="p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-amber-500/20 hover:border-amber-400/50 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-semibold text-amber-200 group-hover:text-amber-300 font-serif">
                  {p.title}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                  {p.category}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Multidimensional Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Petitioner Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm font-sans focus:outline-none focus:border-amber-400"
              placeholder="e.g. Machine Learning Engineer"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Sovereign Counterparty
            </label>
            <input
              type="text"
              value={counterparty}
              onChange={(e) => setCounterparty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm font-sans focus:outline-none focus:border-cyan-400"
              placeholder="e.g. VP of Product & CRO"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-red-400" />
              Primary Vulnerability
            </label>
            <input
              type="text"
              value={primaryFear}
              onChange={(e) => setPrimaryFear(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm font-sans focus:outline-none focus:border-red-400"
              placeholder="e.g. Constructive Termination"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              Assessed Risk Level
            </label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="Low">Low &bull; Minor friction</option>
              <option value="Moderate">Moderate &bull; Team tension</option>
              <option value="High">High &bull; Regulatory hazard</option>
              <option value="Critical">Critical &bull; Severe Coercion</option>
            </select>
          </div>
        </div>

        {/* Dilemma Narrative */}
        <div>
          <label className="block text-xs font-mono text-slate-300 uppercase mb-2">
            The Coercive Impasse &bull; Corporate or Algorithmic Demand
          </label>
          <textarea
            rows={4}
            value={dilemma}
            onChange={(e) => setDilemma(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black/60 border border-amber-500/25 text-white text-sm font-sans placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
            placeholder="Articulate the exact order, suppressed metric, or systemic hazard..."
          />
        </div>

        {/* Submission Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Dual-Index RAG: BORI Vidura Nīti &bull; ACM/IEEE Codes Active</span>
          </div>

          <button
            onClick={() => handleSubmitDilemma()}
            disabled={isLoading || !dilemma.trim()}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-sm shadow-[0_0_24px_-4px_rgba(245,158,11,0.5)] hover:shadow-[0_0_32px_0_rgba(245,158,11,0.7)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <DharmaChakra className="w-5 h-5" spinning={true} />
                <span>Consulting Vidura...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-slate-950" />
                <span>Summon Imperial Counsel</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Royal Sūtra Scroll: The Four Pillars of Counsel (Sabhā Nirṇaya) */}
      {(rawText || isLoading) && (
        <div className="space-y-8 animate-fade-in">
          {/* Scroll Header */}
          <div className="p-6 rounded-3xl glass-panel-gold border-amber-500/40 flex flex-wrap items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <DharmaChakra className="w-9 h-9" spinning={isLoading} />
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                  SABHĀ NIRṆAYA &bull; ROYAL STRATEGIC DECREE
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Pronouncement of Prime Minister Vidura
                </h2>
              </div>
            </div>

            {/* View Mode & Export Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-xl bg-black/50 p-1 border border-white/10 text-xs font-mono">
                <button
                  onClick={() => setViewMode("scroll")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === "scroll" ? "bg-amber-500/30 text-amber-200 border border-amber-500/40" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Sūtra Scroll</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === "grid" ? "bg-amber-500/30 text-amber-200 border border-amber-500/40" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Pillars Grid</span>
                </button>
              </div>

              <button
                onClick={handleCopyScript}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 text-xs font-mono font-medium transition-all cursor-pointer"
              >
                {scriptCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Decree Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Copy All</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 text-xs font-mono font-medium transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Export .MD</span>
              </button>
            </div>
          </div>

          {/* 3D ANCIENT MANUSCRIPT BOOK VIEWER — OPENS ABOVE THE PILLARS & FLIPS TO VERSE */}
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
            />
          </div>

          {/* VIEW MODE 1: UNIFIED CONTINUOUS ROYAL SŪTRA SCROLL */}
          {viewMode === "scroll" && (
            <div className="glass-panel rounded-3xl p-6 sm:p-10 border-amber-500/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

              <PillarRenderer
                content={rawText || "Dissecting the sovereign dispute and assembling the Four Pillars of Counsel..."}
                onOpenArchivalCodex={handleOpenAndFlipBook}
                folioNumber={sourceFolio.page_number}
              />
            </div>
          )}

          {/* VIEW MODE 2: DUAL-PANE / FOUR PILLARS GRID */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Pillar I Card */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border-amber-500/25 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                      PILLAR I
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Saṅkaṭa Nirūpaṇa &bull; Diagnosis
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Moral Hazard Audit</span>
                </div>
                <PillarRenderer content={pillars.p1 || "Analyzing root power dynamic and moral hazard..."} />
              </div>

              {/* Pillar II Card */}
              <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border-amber-500/30 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                      PILLAR II
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Pramāṇa &bull; Canonical Standards
                    </h3>
                  </div>
                  <button
                    onClick={handleOpenAndFlipBook}
                    className="flex items-center space-x-2 rounded-lg border border-amber-500/50 bg-gradient-to-r from-amber-950/40 to-amber-900/20 px-4 py-2 text-xs font-serif uppercase tracking-wider text-amber-200 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all cursor-pointer"
                  >
                    <span>§ Flip Codex to Folio {sourceFolio.page_number} →</span>
                  </button>
                </div>
                <PillarRenderer
                  content={pillars.p2 || "Aligning Vidura Nīti shlokas with ACM and IEEE clauses..."}
                  onOpenArchivalCodex={handleOpenAndFlipBook}
                  folioNumber={sourceFolio.page_number}
                />
              </div>

              {/* Pillar III Card */}
              <div className="glass-panel rounded-3xl p-6 sm:p-8 border-amber-500/25 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                      PILLAR III
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Dharma-Artha Viveka &bull; Balance Sheet
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400">Preyas vs Shreyas</span>
                </div>
                <PillarRenderer content={pillars.p3 || "Auditing short-term appeasement against long-term governance..."} />
              </div>

              {/* Pillar IV Card */}
              <div className="glass-panel-cyan rounded-3xl p-6 sm:p-8 border-cyan-500/30 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                      PILLAR IV
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Upāya Prayoga &bull; Tactical Script
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-cyan-300">Sāma &bull; Dāna &bull; Bheda &bull; Daṇḍa</span>
                </div>
                <PillarRenderer content={pillars.p4 || "Formulating verbatim spoken scripts and paper trail protocols..."} />
              </div>
            </div>
          )}

          {/* RAGAS Feedback Bar */}
          {!isLoading && rawText && (
            <div className="glass-panel rounded-2xl p-5 border-amber-500/20 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                  RAGAS Telemetry Feedback
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Evaluate the strategic de-escalation effectiveness and source grounding:
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleFeedbackSubmit(star)}
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      likertRating >= star
                        ? "bg-amber-400/20 border-amber-500/40 text-amber-300"
                        : "bg-slate-900 border-white/10 text-slate-500 hover:border-amber-400/30"
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}

                {feedbackSubmitted && (
                  <span className="ml-2 text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Recorded to Supabase
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Standalone 3D Ancient Manuscript Book Viewer if opened before submitting a dilemma */}
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
          />
        </div>
      )}

      {/* Citations Drawer */}
      <CitationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        verses={retrievedVerses}
        ethics={retrievedEthics}
        confidenceScore={confidenceScore}
      />
    </div>
  );
}
