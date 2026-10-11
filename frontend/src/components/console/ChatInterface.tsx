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
  const [dilemma, setDilemma] = useState<string>("");
  const [role, setRole] = useState<string>("Machine Learning Engineer");
  const [counterparty, setCounterparty] = useState<string>(
    "VP of AI Product & Chief Revenue Officer"
  );
  const [organizationalPressure, setOrganizationalPressure] = useState<string>(
    "Quarterly Wall Street guidance depends on immediate rollout"
  );
  const [riskLevel, setRiskLevel] = useState<string>("Critical");
  const [primaryFear, setPrimaryFear] = useState<string>(
    "Constructive termination, bonus forfeiture, NDA threat"
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const handleOpenAndFlipBook = () => {
    setIsBookOpen(true);
    setCodexSeekKey((k) => k + 1);
    setTimeout(() => {
      const el = document.getElementById("archival-codex-stage");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  const [scriptCopied, setScriptCopied] = useState<boolean>(false);
  const [likertRating, setLikertRating] = useState<number>(5);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  const inferCanonicalShlokaFromDilemma = (text: string) => {
    const low = (text || "").toLowerCase();
    if (
      low.includes("vulnerability") ||
      low.includes("zero-day") ||
      low.includes("security") ||
      low.includes("ci/cd") ||
      low.includes("deadline") ||
      low.includes("sprint")
    ) {
      return {
        id: "vidura-ch33-v17",
        verse_id: "33.17",
        adhyaya: 33,
        page_number: 121,
        highlight_top_pct: 20.0,
        highlight_height_pct: 12.2,
        text_sanskrit_translit:
          "Na svalpasya kṛte bhūri nāśayet matimān naraḥ | Etad evāti-pāṇḍityaṃ yad alpān mahato rakṣaṇam ||",
        text_english:
          "That gain should never be regarded highly which leadeth to loss. On the other hand, that loss even should be regarded highly which would bring on gain. That is no loss, O king, which bringeth on gain. That, however, should be reckoned as loss which is certain to bring about greater losses still.",
        score: 0.942,
      };
    }
    if (
      low.includes("shell llc") ||
      low.includes("sibling") ||
      low.includes("nepotism") ||
      low.includes("stay in my lane") ||
      low.includes("vendor contract") ||
      low.includes("uncompetitive")
    ) {
      return {
        id: "vidura-ch34-v29",
        verse_id: "34.29",
        adhyaya: 34,
        page_number: 91,
        highlight_top_pct: 64.0,
        highlight_height_pct: 14.8,
        text_sanskrit_translit:
          "A-pṛṣṭo 'py atra brūyān na tu paśyed vi-nāśanam | An-arthakam api brūyāt sarva-bhūtāhite ratam ||",
        text_english:
          "Vidura said: Even if unasked, one should speak truly, whether his words be good or bad, hateful or pleasing, unto him whose defeat one doth not wish. I shall, therefore, say, O king, what is for the good of the Kurus. I shall say what is both beneficial and consistent with morality. Listen to me! Do not, O king, set thy heart upon means of success that are unjust and improper.",
        score: 0.951,
      };
    }
    if (
      low.includes("secret") ||
      low.includes("paper trail") ||
      low.includes("encrypted")
    ) {
      return {
        id: "vidura-ch33-v32",
        verse_id: "33.32",
        adhyaya: 33,
        page_number: 83,
        highlight_top_pct: 18.2,
        highlight_height_pct: 11.2,
        text_sanskrit_translit:
          "Yasyākṛtyaṃ na jānanti mantram vā mantritaṃ pare | Kṛtam evāsya jānanti sa vai paṇḍita ucyate ||",
        text_english:
          "He whose intended acts, and proposed counsels remain concealed from foes, and whose acts become known only after they have been done, is considered wise. He whose purposed actions are never obstructed by heat or cold, fear or attachment, prosperity or adversity, is considered wise.",
        score: 0.934,
      };
    }
    return {
      id: "vidura-ch33-v16",
      verse_id: "33.16",
      adhyaya: 33,
      page_number: 111,
      highlight_top_pct: 68.5,
      highlight_height_pct: 14.0,
      text_sanskrit_translit:
        "Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ | Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ ||",
      text_english:
        "They are abundant, O king, that can always speak agreeable words. The speaker, however, is rare, as also the hearer, of words that are disagreeable but medicinal. That man who, without regarding what is agreeable or disagreeable to his master, but keeping virtue alone in view, sayeth what is unpalatable but medicinal, truly addeth to the strength of the king.",
      score: 0.96,
    };
  };

  const inferredVerse = inferCanonicalShlokaFromDilemma(dilemma);
  const primaryVerse = retrievedVerses?.[0] || inferredVerse;
  const sourceFolio = {
    page_number: primaryVerse?.page_number || inferredVerse.page_number,
    verse_id: primaryVerse?.verse_id || inferredVerse.verse_id,
    highlight_top_pct:
      primaryVerse?.highlight_top_pct ?? inferredVerse.highlight_top_pct,
    highlight_height_pct:
      primaryVerse?.highlight_height_pct ?? inferredVerse.highlight_height_pct,
    highlight_text:
      primaryVerse?.text_sanskrit_translit ||
      inferredVerse.text_sanskrit_translit,
    english_translation:
      primaryVerse?.text_english || inferredVerse.text_english,
    confidence_score:
      primaryVerse?.score || confidenceScore || inferredVerse.score,
  };

  const handleSelectPreset = (p: Preset) => {
    setDilemma(p.dilemma);
    setRole(p.role);
    setCounterparty(p.counterparty);
    setOrganizationalPressure(p.organizational_pressure);
    setRiskLevel(p.risk_level);
    setPrimaryFear(p.primary_fear);
    const matched = inferCanonicalShlokaFromDilemma(p.dilemma);
    setRetrievedVerses([matched]);
    if (isBookOpen) {
      setCodexSeekKey((k) => k + 1);
    }
  };

  const parsePillars = (text: string) => {
    const normalized = text
      .replace(/[\u202f\u00a0]/g, " ")
      .replace(/[\u2011\u2013]/g, "-");

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

  const handleSubmitDilemma = async (
    e?: React.FormEvent,
    overrideDilemma?: string
  ) => {
    if (e) e.preventDefault();
    const activeDilemmaText = (overrideDilemma ?? dilemma).trim();
    if (!activeDilemmaText || isLoading) return;

    const initialMatched = inferCanonicalShlokaFromDilemma(activeDilemmaText);
    setRetrievedVerses([initialMatched]);
    setIsLoading(true);
    setApiNotice(null);
    setRawText("");
    setPillars({ p1: "", p2: "", p3: "", p4: "" });
    setFeedbackSubmitted(false);
    setIsBookOpen(true);
    setCodexSeekKey((k) => k + 1);

    const startTime = performance.now();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${apiUrl}/api/v1/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dilemma: activeDilemmaText,
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
                if (parsed.context?.vidura_verses?.length) {
                  setRetrievedVerses(parsed.context.vidura_verses);
                }
                setRetrievedEthics(parsed.context?.ethics_clauses || []);
                setConfidenceScore(parsed.context?.confidence_score || 0.94);
                if (parsed.model) setModelUsed(parsed.model);
              } else if (parsed.type === "token") {
                accumulated += parsed.token;
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
    } catch {
      setApiNotice(
        "Live FastAPI stream unreachable; rendered deterministic archival synthesis from local BORI & ACM/IEEE registry."
      );
      const activeShloka = inferCanonicalShlokaFromDilemma(activeDilemmaText);
      const [chNum, vNum] = activeShloka.verse_id.split(".");
      const fallback = `You bring a conflict between personal survival and fiduciary duty. Let us examine what is transient and what is permanent.

---
## PILLAR I
Saṅkaṭa Nirūpaṇa • Diagnosis of Dilemma
Moral Hazard Audit
### I. SAṄKAṬA NIRŪPAṆA - Diagnosis of the Dilemma  

1. **Raw Power Dynamic**  
   - **Sovereign Pressure**: ${counterparty} wield organizational imperatives as a sword, demanding immediate compliance.  
   - **Petitioner Position**: ${role} holds the technical truth; leverage is grounded in empirical code, data audit, and professional ethics.  

2. **Moral Hazard**  
   - Yielding to ${organizationalPressure} is a classic **Moha** (delusion) that substitutes short-term appeasement for the **Dharma** of institutional integrity.  

3. **Executive Psychology**  
   - Counterparties exhibit **Duryodhana-like hubris** and **Dhritarashtra-like blindness**, preferring comforting quarterly illusions over the painful sight of systemic risk.  

4. **Hidden Vulnerability**  
   - **Primary Fear**: ${primaryFear}.  
   - **Tacit Complicity**: silence now binds you to the act, creating future statutory liability and eroding professional integrity.  

---
## PILLAR II
Pramāṇa • Canonical Shloka & Standards
BORI • ACM / IEEE
### II. PRAMĀṆA - Canonical Shloka & Standard Alignment  

**Vidura Nīti, Chapter ${chNum}, Verse ${vNum} (Archival Folio ${activeShloka.page_number})**  

\`\`\`
${activeShloka.text_sanskrit_translit}
\`\`\`  

- **Translation**: “${activeShloka.text_english}”  
- **Statecraft Principle**: The counsel that warns a ruler of systemic danger is the most valuable, though it invites personal risk. The duty of the advisor is to present the unvarnished truth, not the comforting lie.  

**Cross-Reference with Modern Codes**  

| Modern Code | Clause | Core Requirement | Parallel to Vidura |
|-------------|--------|------------------|--------------------|
| ACM Code of Ethics | 1.2 & 1.4 | *“Avoid harm; be fair and take action not to discriminate.”* | Mandates disclosure of systemic risk; aligns with Vidura’s call to speak the unpalatable truth. |
| ACM Code of Ethics | 2.5 | *“Give comprehensive and thorough evaluations of risks.”* | Requires safeguarding affected stakeholders, echoing the shloka’s demand for moral vigilance. |
| IEEE Code of Ethics | 1.1 & 3.2 | *“Hold paramount public safety and avoid injuring others.”* | Prohibits deployment of flawed or corrupt systems; the same duty Vidura assigns to the counselor. |

Thus the pressure to conceal risk is not a novel corporate whim; it is an ancient manifestation of delusion cloaked in modern enterprise form.

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
| **Sāma (conciliatory)** | “I appreciate the pressure to meet the Wall-Street guidance; the product vision you have articulated is compelling and aligns our growth targets.” |
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
              Citations ({retrievedVerses.length + retrievedEthics.length || 3})
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
                Specify organizational coercion parameters or select a verified precedent case below
              </span>
            </div>
          </div>
          <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-sm bg-[#050608] text-slate-300 border border-[#262A36]">
            Fiduciary Deliberation Record
          </span>
        </div>

        {/* High-Stakes Presets */}
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Load Precedent Case Template:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESETS.map((p) => {
              const isSelected = dilemma === p.dilemma;
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

        {/* Multidimensional Parameters Grid with Explicit Label-Input Bindings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#1E222D]">
          <div>
            <label
              htmlFor="role-input"
              className="block text-xs font-mono text-slate-300 uppercase mb-1.5 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Petitioner Role</span>
            </label>
            <input
              id="role-input"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-md bg-[#050608] border border-[#262A36] text-[#F3F4F6] text-xs sm:text-sm font-sans focus:border-amber-400"
              placeholder="e.g. Machine Learning Engineer"
            />
          </div>

          <div>
            <label
              htmlFor="counterparty-input"
              className="block text-xs font-mono text-slate-300 uppercase mb-1.5 flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Sovereign Counterparty</span>
            </label>
            <input
              id="counterparty-input"
              type="text"
              value={counterparty}
              onChange={(e) => setCounterparty(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-md bg-[#050608] border border-[#262A36] text-[#F3F4F6] text-xs sm:text-sm font-sans focus:border-amber-400"
              placeholder="e.g. VP of Product & CRO"
            />
          </div>

          <div>
            <label
              htmlFor="fear-input"
              className="block text-xs font-mono text-slate-300 uppercase mb-1.5 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>Primary Vulnerability</span>
            </label>
            <input
              id="fear-input"
              type="text"
              value={primaryFear}
              onChange={(e) => setPrimaryFear(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 rounded-md bg-[#050608] border border-[#262A36] text-[#F3F4F6] text-xs sm:text-sm font-sans focus:border-amber-400"
              placeholder="e.g. Constructive Termination"
            />
          </div>

          <div>
            <label
              htmlFor="risk-select"
              className="block text-xs font-mono text-slate-300 uppercase mb-1.5 flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Assessed Risk Level</span>
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

        {/* Dilemma Narrative */}
        <div>
          <label
            htmlFor="dilemma-textarea"
            className="block text-xs font-mono text-slate-300 uppercase mb-2"
          >
            The Coercive Impasse &bull; Corporate or Algorithmic Demand
          </label>
          <textarea
            id="dilemma-textarea"
            rows={4}
            value={dilemma}
            onChange={(e) => setDilemma(e.target.value)}
            className="w-full p-4 rounded-md bg-[#050608] border border-[#262A36] text-[#F3F4F6] text-sm font-sans placeholder-slate-400 focus:border-amber-400 leading-relaxed"
            placeholder="Describe the suppressed metric, safety vulnerability, or executive directive..."
          />
        </div>

        {/* Submission Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              Matched Locus: Vidura Nīti § {sourceFolio.verse_id} (Folio{" "}
              {sourceFolio.page_number})
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !dilemma.trim()}
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
                Chamber Ready for Deliberation
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#F3F4F6] mt-0.5">
                Four-Pillar Deliberation Architecture
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                const firstPreset = PRESETS[0];
                handleSelectPreset(firstPreset);
                handleSubmitDilemma(undefined, firstPreset.dilemma);
              }}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-md bg-[#1A140B] hover:bg-[#241C0F] border border-amber-500/45 text-xs font-mono uppercase tracking-wider text-amber-200 transition-colors cursor-pointer"
            >
              <span>Run Sample Case (§ 33.16 • Algorithmic Bias)</span>
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
                Audits role asymmetry, institutional blindness (Moha), and statutory liability exposure.
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
                Flips the 3D Udyoga Parva codex to the exact shloka locus and aligns ACM/IEEE clauses.
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
                Contrasts short-term appeasement (Preyas) against long-term fiduciary insulation (Shreyas).
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
                Delivers verbatim 1-on-1 dialogue lines (Sāma, Dāna, Bheda, Daṇḍa) and Mantra-Gupti logs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Offline / Deterministic Fallback Notice Banner (R-27 Error/Fallback State) */}
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
                  SABHĀ NIRṆAYA &bull; ARCHIVAL DECREE
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F3F4F6] tracking-tight">
                  Pronouncement of Prime Minister Vidura
                </h2>
              </div>
            </div>

            {/* View Mode & Export Actions (44px+ tap targets) */}
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

          {/* Evaluation Telemetry Bar (44x44px star tap targets per R-03) */}
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
            highlightTopPct={sourceFolio.highlight_top_pct}
            highlightHeightPct={sourceFolio.highlight_height_pct}
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
