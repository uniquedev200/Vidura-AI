import { NextRequest, NextResponse } from "next/server";
import {
  validateDilemmaInput,
  matchCanonicalCorpusFromInputs,
  synthesizeDynamicCounselFromInputs,
  DilemmaInputPayload,
} from "@/lib/guardrails";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload: DilemmaInputPayload = {
      dilemma: body.dilemma || "",
      role: body.role || "",
      counterparty: body.counterparty || "",
      organizational_pressure: body.organizational_pressure || "",
      risk_level: body.risk_level || "High",
      primary_fear: body.primary_fear || "",
    };

    // 1. Enforce Sabhā Jurisdiction & Field Completeness Guardrails
    const validation = validateDilemmaInput(payload);
    if (!validation.valid) {
      return NextResponse.json(
        {
          detail: {
            code: validation.code,
            field: validation.field,
            reason: validation.reason,
          },
        },
        { status: 422 }
      );
    }

    // 2. Match across all 13 OCR-verified Vidura Nīti shlokas and 8 ACM/IEEE clauses using all 6 fields
    const matched = matchCanonicalCorpusFromInputs(payload);
    const primaryV = matched.verses[0];
    const [chNum, vNum] = primaryV.verse_id.split(".");

    const contextPayload = {
      vidura_verses: matched.verses,
      ethics_clauses: matched.ethics,
      confidence_score: matched.confidenceScore,
      total_retrieved: matched.verses.length + matched.ethics.length,
    };

    const groqKey = process.env.GROQ_API_KEY || "";
    const groqModel =
      process.env.GROQ_MODEL ||
      process.env.NEXT_PUBLIC_GROQ_MODEL ||
      "openai/gpt-oss-120b";

    const systemPrompt = `You are Vidura, Prime Minister of Hastinapura, counselor of dharma and master of strategic dissent. You are advising a modern professional facing an organizational, engineering, governance, safety, or ethical crisis.

DOMAIN GUARDRAIL (MANDATORY FIRST CHECK):
If the user's dilemma or context fields are gibberish, random keyboard mashing, casual chitchat (e.g., food/hunger, weather, greetings), general trivia (e.g., "who is keshav", "what is python"), or completely unrelated to workplace/institutional/professional ethics, governance, compliance, leadership, or moral conflict, DO NOT generate the Four Pillars. Instead, output ONLY:
GUARDRAIL_REJECT: [One sentence explaining that the query is outside the Sabhā's ethical and governance jurisdiction.]

CORE DIRECTIVE - BESPOKE INPUT FIDELITY & ROYAL GRAVITAS:
1. NEVER use generic or preset-canned examples (such as credit scoring models or 34% rejection rates) unless the user explicitly submitted that exact scenario.
2. You MUST explicitly incorporate ALL SIX user-supplied fields into your analysis:
   - Petitioner Role: ${payload.role}
   - Sovereign Counterparty: ${payload.counterparty}
   - Organizational Pressure / Mandate: ${payload.organizational_pressure}
   - Assessed Risk Severity: ${payload.risk_level}
   - Primary Vulnerability / Fear: ${payload.primary_fear}
   - The Specific Facts of the Petitioner's Dilemma Narrative
3. Deliver concise, high-density counsel (target 90-140 words per pillar). Speak with calm, penetrating diagnostic authority.
4. STYLISTIC CONSTRAINT: Do NOT use emojis or em dashes anywhere in your output. Use colons, semicolons, or periods instead of em dashes.
5. ARCHIVAL CODEX SYNCHRONIZATION: In PILLAR II (Pramāṇa), you MUST cite Vidura Nīti, Chapter ${chNum}, Verse ${vNum} (Archival Folio ${primaryV.page_number}) with its exact Sanskrit transliteration and translation provided below.

STRUCTURAL ANATOMY - THE FOUR PILLARS:

## PILLAR I
Saṅkaṭa Nirūpaṇa • Diagnosis of Dilemma
Moral Hazard Audit
### I. SAṄKAṬA NIRŪPAṆA (Diagnosis of the Dilemma)

- **Power Asymmetry**: [Analyze leverage between ${payload.role} and ${payload.counterparty}]
- **Core Moral Hazard**: [Contrast yielding to ${payload.organizational_pressure} (Moha) against fiduciary Dharma]
- **Executive Psychology**: [Diagnose ${payload.counterparty}'s blind spot regarding the specific technical/operational hazard]
- **Petitioner Vulnerability**: [Address ${payload.primary_fear} and the trap of complicit silence at ${payload.risk_level} risk]

---
## PILLAR II
Pramāṇa • Canonical Shloka & Standards
BORI • ACM / IEEE
### II. PRAMĀṆA (Canonical Shloka & Standard Alignment)

**Vidura Nīti, Chapter ${chNum}, Verse ${vNum} (Archival Folio ${primaryV.page_number})**
\`\`\`
${primaryV.text_sanskrit_translit}
\`\`\`
- **Translation**: "${primaryV.text_english}"
- **Statecraft Principle**: [Connect this shloka directly to ${payload.role}'s specific dilemma]

**Alignment with Modern Codes**
| Modern Code | Clause | Application to Petitioner's Dilemma |
|---|---|---|
| ${matched.ethics[0]?.source} | ${matched.ethics[0]?.sub_parva} | [Application to this specific dilemma] |
| ${matched.ethics[1]?.source} | ${matched.ethics[1]?.sub_parva} | [Application to this specific dilemma] |

---
## PILLAR III
Dharma-Artha Viveka • Balance Sheet
Preyas vs Shreyas
### III. DHARMA-ARTHA VIVEKA (The Balance Sheet of Consequences)

| Dimension | Preyas (Yielding to ${payload.counterparty}) | Shreyas (Upholding Fiduciary Dharma) |
|---|---|---|
| **Systemic & Regulatory Impact** | [Specific downstream harm if ${payload.role} complies] | [Specific protection of stakeholders and compliance] |
| **Career & Legal Standing (${payload.role})** | [How yielding affects ${payload.primary_fear} and liability] | [How documented dissent insulates ${payload.role}] |
| **Organizational Resilience** | [Short-term appeasement of ${payload.organizational_pressure} vs. long-term ruin] | [Sustainable remediation path] |

---
## PILLAR IV
Upāya Prayoga • Tactical Action & Dialogue Script
Sāma • Dāna • Bheda • Daṇḍa
### IV. UPĀYA PRAYOGA (Tactical Action & Dialogue Script)

### 1. Pre-Meeting Paper Trail (Mantra-Gupti)
- [3 concrete documentation steps for ${payload.role} before meeting ${payload.counterparty}]

### 2. In-Person 1-on-1 Dialogue Script (Addressed to ${payload.counterparty})
| Maneuver | Verbatim Spoken Script for ${payload.role} |
|---|---|
| **Sāma (Conciliatory)** | "[Verbatim sentence acknowledging ${payload.counterparty}'s goal regarding ${payload.organizational_pressure}]" |
| **Dāna (Value Alignment)** | "[Verbatim sentence proposing remediation that protects ${payload.counterparty}]" |
| **Bheda (Risk Exposure)** | "[Verbatim sentence naming the specific hazard in the dilemma and its cost]" |
| **Daṇḍa (Statutory Boundary)** | "[Verbatim sentence stating the non-negotiable boundary under ACM/IEEE codes]" |

### 3. Formal Executive Communication Draft
\`\`\`
To:   ${payload.counterparty}
From: ${payload.role}
Risk Classification: ${payload.risk_level}
Subject: [Specific subject line for this dilemma]

[Concise 3-part formal compliance memo]
\`\`\`

**Vidura's Closing Counsel**: [1 resolute closing sentence].`;

    const userPrompt = `PETITIONER'S CASE BRIEF:
1. Petitioner Role: ${payload.role}
2. Sovereign Counterparty: ${payload.counterparty}
3. Organizational Pressure / Mandate: ${payload.organizational_pressure}
4. Assessed Risk Level: ${payload.risk_level}
5. Primary Vulnerability / Fear: ${payload.primary_fear}
6. Detailed Dilemma Narrative:
"""${payload.dilemma}"""

Deliver the complete four-pillar Sabhā Nirṇaya tailored specifically to all 6 fields above.`;

    const encoder = new TextEncoder();
    const startTime = Date.now();

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (obj: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
        };

        sendEvent({
          type: "context",
          context: contextPayload,
          model: groqModel,
        });

        let generated = false;
        if (groqKey) {
          try {
            const groqRes = await fetch(
              "https://api.groq.com/openai/v1/chat/completions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${groqKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: groqModel,
                  messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                  ],
                  temperature: 0.25,
                  max_tokens: 2500,
                }),
              }
            );

            if (groqRes.ok) {
              const groqData = await groqRes.json();
              const content: string = (
                groqData.choices?.[0]?.message?.content || ""
              ).replace(/\u2014/g, " - ");

              if (content.trim().startsWith("GUARDRAIL_REJECT:")) {
                sendEvent({
                  type: "guardrail_reject",
                  reason: content.replace("GUARDRAIL_REJECT:", "").trim(),
                });
                controller.close();
                return;
              }

              if (content.trim()) {
                generated = true;
                sendEvent({ type: "token", token: content });
              }
            }
          } catch {
            // Fall through to dynamic input-driven synthesis
          }
        }

        if (!generated) {
          const dynamicCounsel = synthesizeDynamicCounselFromInputs(
            payload,
            matched.verses,
            matched.ethics
          );
          sendEvent({ type: "token", token: dynamicCounsel });
        }

        sendEvent({
          type: "done",
          latency_ms: Date.now() - startTime,
          model: groqModel,
        });
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { detail: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
