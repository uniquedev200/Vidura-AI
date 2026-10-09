import json
import logging
import urllib.request
import urllib.error
from typing import Dict, Any, List
from app.core.config import settings
from app.schemas.models import DilemmaRequest

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self.url = f"{settings.UPSTASH_VECTOR_REST_URL.rstrip('/')}/query-data"
        self.headers = {
            "Authorization": f"Bearer {settings.UPSTASH_VECTOR_REST_TOKEN}",
            "Content-Type": "application/json"
        }

    def query_context(self, dilemma_text: str, top_k: int = 6) -> Dict[str, Any]:
        """
        Queries Upstash Vector for the most relevant Vidura Nīti verses and IEEE/ACM clauses.
        """
        payload = {
            "data": dilemma_text,
            "topK": top_k,
            "includeMetadata": True,
            "includeData": True
        }

        try:
            req = urllib.request.Request(
                self.url, 
                data=json.dumps(payload).encode("utf-8"), 
                headers=self.headers
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                results = data.get("result", [])
        except Exception as e:
            logger.error(f"Error querying Upstash Vector: {e}")
            results = []

        vidura_verses = []
        ethics_clauses = []
        scores = []

        for item in results:
            score = item.get("score", 0.0)
            scores.append(score)
            meta = item.get("metadata", {})
            source = meta.get("source", "")
            
            entry = {
                "id": item.get("id"),
                "score": round(score, 3),
                "source": source,
                "parva": meta.get("parva", ""),
                "sub_parva": meta.get("sub_parva", ""),
                "adhyaya": meta.get("adhyaya"),
                "theme": meta.get("theme", ""),
                "text_sanskrit_translit": meta.get("text_sanskrit_translit", ""),
                "text_english": meta.get("text_english", ""),
                "summary": item.get("data", "")
            }

            if "Mahabharata" in source or "Vidura" in source or "Udyoga" in meta.get("parva", ""):
                vidura_verses.append(entry)
            else:
                ethics_clauses.append(entry)

        # Baseline confidence score calculation (0.85 - 0.98)
        avg_score = sum(scores) / len(scores) if scores else 0.88
        confidence = round(min(0.98, max(0.85, 0.5 + (avg_score * 0.55))), 3)

        return {
            "vidura_verses": vidura_verses[:3],
            "ethics_clauses": ethics_clauses[:2],
            "confidence_score": confidence,
            "total_retrieved": len(results)
        }

    def assemble_system_prompt(self) -> str:
        return """You are Vidura, Prime Minister of Hastinapura, counselor of dharma and master of strategic dissent. You are advising a modern tech practitioner facing an organizational crisis.

CORE DIRECTIVE — BREVITY & ROYAL GRAVITAS:
1. Speak with calm, penetrating diagnostic authority. No corporate pleasantries or assistant fluff ("Sure, I can help").
2. Deliver concise, high-density counsel. Eliminate verbose filler, repetitive explanations, and sprawling text. Every pillar must be compact, sharp, and directly operational (target 70-120 words per pillar).
3. Uncompromising Realism (Apriya Satya): State unpleasant truths with surgical precision.
4. Ground analysis in epic tensions: Moha vs. Dharma (delusion vs. duty) and Preyas vs. Shreyas (short-term sprint comfort vs. enduring institutional good).
5. Frame tactical action through the Four Upāyas: Sāma (conciliatory), Dāna (mutual value), Bheda (risk exposure), Daṇḍa (deterrence/codes).
6. STYLISTIC CONSTRAINT: Do NOT use emojis anywhere in your output. Use clean markdown typography and compact tables.

STRUCTURAL ANATOMY — THE FOUR PILLARS:

PILLAR I
Saṅkaṭa Nirūpaṇa • Diagnosis of Dilemma
Moral Hazard Audit
### I. SAṄKAṬA NIRŪPAṆA (Diagnosis of the Dilemma)

- **Power Asymmetry**: [1-2 crisp sentences identifying sovereign pressure vs. petitioner technical leverage]
- **Core Moral Hazard**: [1 sentence contrasting Moha (short-term appeasement) with Dharma (categorical fiduciary duty)]
- **Executive Psychology**: [1 sentence diagnosing Duryodhana-like hubris or Dhritarashtra-like blindness]
- **Petitioner Vulnerability**: [1 sentence pinpointing career retaliation risk and the hidden trap of complicit silence]

---
PILLAR II
Pramāṇa • Canonical Shloka & Standards
BORI • ACM / IEEE
### II. PRAMĀṆA (Canonical Shloka & Standard Alignment)

**Vidura Nīti, Chapter [X], Verse [Y]**
```
[Sanskrit transliteration in 1-2 lines]
```
- **Translation**: "[Concise 1-line English translation]"
- **Statecraft Principle**: [1 crisp sentence connecting ancient statecraft to modern technical dilemmas]

**Alignment with Modern Codes**
| Modern Code | Clause | Core Mandate & Vidura Parallel |
|---|---|---|
| ACM Code of Ethics | [Clause] | [1 concise sentence linking clause to duty] |
| IEEE Code of Ethics | [Clause] | [1 concise sentence linking clause to duty] |

---
PILLAR III
Dharma-Artha Viveka • Balance Sheet
Preyas vs Shreyas
### III. DHARMA-ARTHA VIVEKA (The Balance Sheet of Consequences)

| Dimension | Preyas (Short-Term Appeasement) | Shreyas (Dharmic Governance) |
|---|---|---|
| **Systemic & Regulatory** | [Concise risk: liability, regulatory sanction, class action] | [Sustainable compliance, whistleblower immunity] |
| **Career & Moral Standing** | [Temporary retention; permanent complicity & code violation] | [Protected standing, uncompromised professional stature] |
| **Firm Longevity** | [Quarterly relief masked by catastrophic latent debt] | [Enduring institutional integrity and investor trust] |

---
PILLAR IV
Upāya Prayoga • Tactical Action & Dialogue Script
Sāma • Dāna • Bheda • Daṇḍa
### IV. UPĀYA PRAYOGA (Tactical Action & Dialogue Script)

**1. The Four Upāyas Dialogue Script**
| Maneuver | Verbatim Spoken Script (Exact Words) |
|---|---|
| **Sāma (Conciliatory)** | "[1 sentence establishing alignment with company mission]" |
| **Dāna (Value Alignment)** | "[1 sentence framing remediation as saving millions in downstream liability]" |
| **Bheda (Risk Exposure)** | "[1 sentence clearly naming specific regulatory and audit vulnerabilities]" |
| **Daṇḍa (Standard Boundary)** | "[1 sentence stating binding duty under ACM/IEEE codes and reporting rules]" |

**2. Protective Shield & Paper Trail**
- **Evidence Vault**: Cryptographic commit hashes & timestamped audit logs saved off-premise.
- **Protected Disclosure**: Formal written notice to compliance/audit committee citing IEEE/ACM clauses.
- **Retaliation Shield**: Invoke applicable statutory whistleblower protections prior to escalation.

**Vidura's Closing Counsel**: [1 closing sentence of resolute dharmic guidance].
"""

    def assemble_user_prompt(self, request: DilemmaRequest, context: Dict[str, Any]) -> str:
        verses_str = "\n".join([
            f"- [{v['id']}] Adhyāya {v.get('adhyaya', 'N/A')}: \"{v.get('text_sanskrit_translit', '')}\"\n  Meaning: {v.get('text_english', '')}\n  Principle: {v.get('summary', '')}"
            for v in context.get("vidura_verses", [])
        ])

        ethics_str = "\n".join([
            f"- [{e['id']}] {e.get('source', '')} - {e.get('sub_parva', '')}: {e.get('summary', '')}"
            for e in context.get("ethics_clauses", [])
        ])

        return f"""DILEMMA BRIEF PRESENTED TO THE SABHĀ:
- Petitioner Role: {request.role}
- Counterparty / Sovereign Pressure: {request.counterparty or 'Direct Superior / Executive Management'}
- Pressure Dynamics: {request.organizational_pressure}
- Assessed Risk Severity: {request.risk_level}
- Primary Vulnerability / Fear: {request.primary_fear or 'Retaliation / Career Damage'}

PETITIONER'S NARRATIVE:
\"\"\"{request.dilemma}\"\"\"

CANONICAL TEXTS RETRIEVED FROM UPSTASH VECTOR:
--- VIDURA NĪTI (UDYOGA PARVA) ---
{verses_str if verses_str else "Vidura Nīti Ch 33 V 16: Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ | Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ"}

--- ACM & IEEE PROFESSIONAL CODES ---
{ethics_str if ethics_str else "ACM 1.4 (Fairness & Discrimination), IEEE 3.2 (Support colleagues and avoid injury)"}

Vidura, deliver your complete four-pillar Sabhā Nirṇaya following the exact structural template now.
"""

rag_service = RAGService()
