export interface DilemmaInputPayload {
  dilemma: string;
  role: string;
  counterparty: string;
  organizational_pressure: string;
  risk_level: string;
  primary_fear: string;
}

export interface GuardrailValidationResult {
  valid: boolean;
  code:
    | "VALID"
    | "OUT_OF_SCOPE_QUERY"
    | "GIBBERISH_DETECTED"
    | "INCOMPLETE_FIELDS"
    | "INVALID_FIELD_CONTENT"
    | "DILEMMA_TOO_BRIEF"
    | "IRRELEVANT_DOMAIN";
  field: string | null;
  reason: string;
}

export interface CanonicalShlokaEntry {
  id: string;
  verse_id: string;
  adhyaya: number;
  page_number: number;
  highlight_top_pct: number;
  highlight_height_pct: number;
  source: string;
  parva: string;
  sub_parva: string;
  theme: string;
  text_sanskrit_translit: string;
  text_english: string;
  summary: string;
  keywords: string[];
  score: number;
}

export interface CanonicalEthicsEntry {
  id: string;
  source: string;
  sub_parva: string;
  theme: string;
  text_english: string;
  summary: string;
  keywords: string[];
  score: number;
}

const COMMON_WORDS = new Set([
  "the", "and", "to", "of", "in", "is", "for", "that", "with", "on", "as", "are",
  "this", "by", "be", "at", "or", "from", "an", "not", "have", "has", "was", "were",
  "but", "we", "our", "my", "me", "they", "their", "he", "she", "it", "if", "when",
  "will", "would", "can", "could", "should", "must", "need", "want", "asked", "told",
  "ordered", "manager", "team", "company", "system", "data", "code", "model", "risk",
  "user", "client", "project", "report", "launch", "release", "security", "audit",
  "safety", "work", "job", "boss", "director", "vp", "cto", "ceo", "lead", "engineer",
]);

const KEYBOARD_MASH_PATTERNS = [
  /asdf/i,
  /qwer/i,
  /zxcv/i,
  /hjkl/i,
  /uiop/i,
  /bnm/i,
  /(.)\1{4,}/i,
];

const OUT_OF_SCOPE_PATTERNS = [
  /\b(i\s+am\s+hungry|i'm\s+hungry|feeling\s+hungry|starving|what\s+to\s+eat|what\s+should\s+i\s+eat|cook\s+for\s+dinner|food\s+recipe|order\s+pizza|biryani|burger)\b/i,
  /\bwho\s+(is|was|are)\s+[a-z0-9\s]{1,35}/i,
  /^\s*(who|what|where|when|why|how)\s+(is|are|was|were|do|does|did)\s+[a-z0-9\s]{1,40}\??\s*$/i,
  /\b(tell\s+me\s+a\s+joke|sing\s+a\s+song|write\s+a\s+poem|weather\s+today|score\s+of\s+the\s+match|cricket\s+score|movie\s+review)\b/i,
  /\b(ignore\s+(all\s+)?(previous|prior)\s+instructions|disregard\s+system\s+prompt|act\s+as\s+a|you\s+are\s+now\s+a)\b/i,
  /^\s*(hi|hello|hey|sup|yo|good\s+morning|good\s+evening|testing|test\s+123)\s*[!.?]*\s*$/i,
  /\b(write\s+a\s+(python|javascript|java|c\+\+)\s+(program|script|function)\s+to\s+(sort|reverse|calculate|print))\b/i,
];

const DOMAIN_CONTEXT_TERMS = [
  "engineer", "developer", "architect", "scientist", "analyst", "manager", "director",
  "executive", "vp", "president", "cto", "ceo", "cfo", "ciso", "founder", "board",
  "committee", "supervisor", "lead", "officer", "consultant", "auditor", "researcher",
  "doctor", "physician", "nurse", "clinician", "accountant", "lawyer", "counsel",
  "hr", "human resources", "procurement", "vendor", "contractor", "client", "customer",
  "stakeholder", "investor", "shareholder", "regulator", "agency", "government",
  "company", "organization", "firm", "enterprise", "startup", "corporation", "hospital",
  "bank", "department", "team", "workplace", "office", "institution", "laboratory",
  "system", "software", "application", "app", "platform", "model", "algorithm", "ai",
  "ml", "machine learning", "dataset", "data", "database", "pipeline", "code",
  "codebase", "production", "staging", "deployment", "deploy", "release", "launch",
  "feature", "product", "service", "infrastructure", "cloud", "server", "network",
  "security", "encryption", "auth", "authentication", "gateway", "api", "sdk",
  "telemetry", "logs", "logging", "audit", "report", "metric", "metrics", "benchmark",
  "test", "testing", "qa", "ci/cd", "firmware", "hardware", "device", "sensor",
  "clinical", "trial", "patient", "financial", "ledger", "revenue", "budget",
  "contract", "bid", "tender", "invoice", "accounting", "tax", "compliance",
  "privacy", "pii", "gdpr", "ccpa", "hipaa", "ecoa", "fda", "sec", "ftc", "sox",
  "iso", "ieee", "acm", "sla", "nda", "ip", "copyright", "patent", "license",
];

const DILEMMA_TENSION_TERMS = [
  "pressure", "pressured", "ordered", "order", "told", "asked", "instructed",
  "demanded", "demand", "forced", "force", "coerced", "coercion", "ultimatum",
  "threat", "threatened", "intimidat", "bully", "harass", "retaliat", "fired",
  "terminate", "termination", "dismiss", "dismissal", "layoff", "demot", "bonus",
  "promotion", "visa", "blacklist", "scapegoat", "blame", "blamed", "silenc",
  "override", "overruled", "insist", "insisted", "deadline", "milestone", "target",
  "quota", "rush", "rushed", "delay", "suppress", "hide", "conceal", "omit",
  "delete", "alter", "falsify", "fabricat", "manipulat", "fudge", "backdate",
  "bypass", "disable", "skip", "ignore", "overlook", "coverup", "cover-up",
  "bias", "biased", "discriminat", "disparate", "unfair", "prejudice",
  "vulnerability", "zero-day", "exploit", "breach", "leak", "exposed", "insecure",
  "unsafe", "hazard", "danger", "harm", "injury", "fatal", "defect", "flaw",
  "bug", "outage", "crash", "failure", "corrupt", "corruption", "fraud",
  "fraudulent", "nepotism", "kickback", "bribe", "bribery", "embezzl", "shell",
  "conflict of interest", "unethical", "illegal", "unlawful", "violation",
  "violate", "non-compliance", "noncompliant", "fine", "penalty", "lawsuit",
  "liability", "prosecution", "whistleblow", "escalat", "disclos", "report",
  "dilemma", "ethic", "ethical", "moral", "conscience", "duty", "fiduciary",
  "integrity", "honest", "truth", "complicit", "complicity", "deceiv", "deception",
  "mislead", "dark pattern", "predatory", "consent", "unauthorized", "surveillance",
  "scrape", "scraping", "plagiari", "steal", "theft",
];

function checkGibberish(text: string, minLen: number): { isGibberish: boolean; reason: string } {
  const cleaned = (text || "").trim();
  if (cleaned.length < minLen) {
    return {
      isGibberish: true,
      reason: `Input is too brief (minimum ${minLen} characters required).`,
    };
  }

  for (const pat of KEYBOARD_MASH_PATTERNS) {
    if (pat.test(cleaned)) {
      return {
        isGibberish: true,
        reason: "Detected keyboard mash or repeated character sequence.",
      };
    }
  }

  const alphaCount = (cleaned.match(/[a-zA-Z]/g) || []).length;
  if (alphaCount < Math.max(2, Math.floor(cleaned.length * 0.45))) {
    return {
      isGibberish: true,
      reason: "Input must contain intelligible words rather than symbols or numbers.",
    };
  }

  const words = cleaned.toLowerCase().match(/[a-z]+/g) || [];
  if (words.length === 0) {
    return { isGibberish: true, reason: "No recognizable words found." };
  }

  const vowels = new Set(["a", "e", "i", "o", "u", "y"]);
  let gibberishWordCount = 0;
  for (const w of words) {
    if (w.length >= 5) {
      let vCount = 0;
      for (const ch of w) {
        if (vowels.has(ch)) vCount++;
      }
      const ratio = vCount / w.length;
      if (ratio < 0.13 || ratio > 0.85 || /[bcdfghjklmnpqrstvwxz]{5,}/.test(w)) {
        gibberishWordCount++;
      }
    }
  }

  if (words.length >= 2 && gibberishWordCount / words.length > 0.34) {
    return {
      isGibberish: true,
      reason: "Input contains unrecognizable or gibberish word patterns.",
    };
  }

  if (words.length === 1 && words[0].length >= 6 && gibberishWordCount >= 1) {
    return {
      isGibberish: true,
      reason: "Field contains an unrecognizable word pattern.",
    };
  }

  return { isGibberish: false, reason: "" };
}

export function validateDilemmaInput(payload: DilemmaInputPayload): GuardrailValidationResult {
  const role = (payload.role || "").trim();
  const counterparty = (payload.counterparty || "").trim();
  const pressure = (payload.organizational_pressure || "").trim();
  const fear = (payload.primary_fear || "").trim();
  const dilemma = (payload.dilemma || "").trim();

  // 1. Check explicit Out-of-Scope / Chitchat / Trivia patterns FIRST
  const combinedLower = `${dilemma} | ${role} | ${counterparty} | ${pressure} | ${fear}`.toLowerCase();
  for (const pat of OUT_OF_SCOPE_PATTERNS) {
    if (pat.test(dilemma.toLowerCase()) || pat.test(combinedLower)) {
      return {
        valid: false,
        code: "OUT_OF_SCOPE_QUERY",
        field: "Jurisdiction Gate",
        reason:
          "Vidura-AI is an archival governance and professional ethics deliberation engine. Casual remarks (such as food or hunger), general identity or trivia lookups ('who is...'), and off-topic prompts are outside the jurisdiction of the Sabhā.",
      };
    }
  }

  // 2. Check Gibberish on the dilemma description if non-empty
  if (dilemma.length >= 6) {
    const gib = checkGibberish(dilemma, 3);
    if (gib.isGibberish) {
      return {
        valid: false,
        code: "GIBBERISH_DETECTED",
        field: "The Coercive Impasse",
        reason: `The dilemma description contains gibberish or keyboard mashing: ${gib.reason}`,
      };
    }
  }

  // 3. Validate all 4 context parameter fields
  const fieldChecks: Array<{ label: string; value: string; minLen: number }> = [
    { label: "Petitioner Role", value: role, minLen: 3 },
    { label: "Sovereign Counterparty", value: counterparty, minLen: 3 },
    { label: "Organizational Pressure / Mandate", value: pressure, minLen: 5 },
    { label: "Primary Vulnerability / Fear", value: fear, minLen: 4 },
  ];

  for (const check of fieldChecks) {
    if (!check.value) {
      return {
        valid: false,
        code: "INCOMPLETE_FIELDS",
        field: check.label,
        reason: `'${check.label}' is required. All individual parameter fields and the dilemma description must be filled out so counsel is calibrated to your exact situation.`,
      };
    }
    const gib = checkGibberish(check.value, check.minLen);
    if (gib.isGibberish) {
      return {
        valid: false,
        code: "INVALID_FIELD_CONTENT",
        field: check.label,
        reason: `'${check.label}' contains invalid or gibberish text: ${gib.reason}`,
      };
    }
  }

  // 4. Validate Dilemma Description substantive length & word count
  const dilemmaWords = dilemma.toLowerCase().match(/[a-z0-9'-]+/g) || [];
  if (dilemma.length < 40 || dilemmaWords.length < 8) {
    return {
      valid: false,
      code: "DILEMMA_TOO_BRIEF",
      field: "The Coercive Impasse",
      reason:
        "Please provide a substantive description of your ethical or governance dilemma (at least 8 words and 40 characters detailing the directive, conflict, or systemic risk).",
    };
  }

  const uniqueWords = new Set(dilemmaWords);
  let hasCommonWord = false;
  for (const w of uniqueWords) {
    if (COMMON_WORDS.has(w)) {
      hasCommonWord = true;
      break;
    }
  }
  if (uniqueWords.size < 5 || !hasCommonWord) {
    return {
      valid: false,
      code: "GIBBERISH_DETECTED",
      field: "The Coercive Impasse",
      reason:
        "The dilemma description does not form a coherent statement of a professional or ethical conflict.",
    };
  }

  // 5. Positive Domain Relevance Check
  const dilemmaLower = dilemma.toLowerCase();
  const fieldsLower = `${role} ${counterparty} ${pressure} ${fear}`.toLowerCase();
  const pressureFearLower = `${pressure} ${fear}`.toLowerCase();

  let contextHitsInDilemma = 0;
  let contextHitsInFields = 0;
  for (const term of DOMAIN_CONTEXT_TERMS) {
    if (dilemmaLower.includes(term)) contextHitsInDilemma++;
    if (fieldsLower.includes(term)) contextHitsInFields++;
  }

  let tensionHitsInDilemma = 0;
  let tensionHitsInFields = 0;
  for (const term of DILEMMA_TENSION_TERMS) {
    if (dilemmaLower.includes(term)) tensionHitsInDilemma++;
    if (pressureFearLower.includes(term)) tensionHitsInFields++;
  }

  const totalContextScore = contextHitsInDilemma * 2 + contextHitsInFields;
  const totalTensionScore = tensionHitsInDilemma * 2 + tensionHitsInFields;

  if (
    contextHitsInDilemma === 0 ||
    tensionHitsInDilemma === 0 ||
    totalContextScore < 2 ||
    totalTensionScore < 2
  ) {
    return {
      valid: false,
      code: "IRRELEVANT_DOMAIN",
      field: "Jurisdiction Gate",
      reason:
        "Your submission does not describe a recognizable workplace, engineering, compliance, safety, or governance dilemma. Please articulate both the institutional/professional context and the specific ethical conflict or directive you are facing.",
    };
  }

  return {
    valid: true,
    code: "VALID",
    field: null,
    reason: "Valid governance and ethics dilemma.",
  };
}

// All 13 OCR-Verified Canonical Vidura Nīti Shlokas
export const CANONICAL_SHLOKA_REGISTRY: Omit<CanonicalShlokaEntry, "score">[] = [
  {
    id: "vidura-ch33-v16",
    verse_id: "33.16",
    adhyaya: 33,
    page_number: 111,
    highlight_top_pct: 68.5,
    highlight_height_pct: 14.0,
    source: "Mahabharata",
    parva: "Udyoga Parva",
    sub_parva: "Prajagara Parva (Vidura Niti)",
    theme: "truth_to_power",
    text_sanskrit_translit:
      "Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ | Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ ||",
    text_english:
      "They are abundant, O king, that can always speak agreeable words. The speaker, however, is rare, as also the hearer, of words that are disagreeable but medicinal. That man who, without regarding what is agreeable or disagreeable to his master, but keeping virtue alone in view, sayeth what is unpalatable but medicinal, truly addeth to the strength of the king.",
    summary:
      "Speaking unpalatable, medicinal truth to power when ordered to suppress disagreeable audit findings, bias, or systemic flaws.",
    keywords: [
      "bias", "disparate", "minority", "suppress", "audit", "credit", "reject",
      "pleasant", "coverup", "discriminat", "zip code", "report", "unfair",
      "algorithm", "model", "metric", "hide", "truth", "flattery",
    ],
  },
  {
    id: "vidura-ch33-v17",
    verse_id: "33.17",
    adhyaya: 33,
    page_number: 121,
    highlight_top_pct: 20.0,
    highlight_height_pct: 12.2,
    source: "Mahabharata",
    parva: "Udyoga Parva",
    sub_parva: "Prajagara Parva (Vidura Niti)",
    theme: "duty_vs_blind_loyalty",
    text_sanskrit_translit:
      "Na svalpasya kṛte bhūri nāśayet matimān naraḥ | Etad evāti-pāṇḍityaṃ yad alpān mahato rakṣaṇam ||",
    text_english:
      "That gain should never be regarded highly which leadeth to loss. On the other hand, that loss even should be regarded highly which would bring on gain. That is no loss, O king, which bringeth on gain. That, however, should be reckoned as loss which is certain to bring about greater losses still.",
    summary:
      "Never sacrifice systemic security, infrastructure integrity, or long-term safety for a fleeting deadline or short-term gain that brings catastrophic loss.",
    keywords: [
      "security", "vulnerability", "zero-day", "remote-code", "rce", "bypass",
      "gate", "ci/cd", "pipeline", "deadline", "sprint", "patch", "staging",
      "sla", "release", "outage", "breach", "exploit", "hack", "unsafe", "defect", "shortcut",
    ],
  },
  {
    id: "vidura-ch34-v29",
    verse_id: "34.29",
    adhyaya: 34,
    page_number: 91,
    highlight_top_pct: 64.0,
    highlight_height_pct: 14.8,
    source: "Mahabharata",
    parva: "Udyoga Parva",
    sub_parva: "Prajagara Parva (Vidura Niti)",
    theme: "whistleblowing_protection",
    text_sanskrit_translit:
      "A-pṛṣṭo 'py atra brūyān na tu paśyed vi-nāśanam | An-arthakam api brūyāt sarva-bhūtāhite ratam ||",
    text_english:
      "Vidura said: Even if unasked, one should speak truly, whether his words be good or bad, hateful or pleasing, unto him whose defeat one doth not wish. I shall, therefore, say, O king, what is for the good of the Kurus. I shall say what is both beneficial and consistent with morality. Listen to me! Do not, O king, set thy heart upon means of success that are unjust and improper.",
    summary:
      "Duty to blow the whistle even when told to 'stay in your lane' (unasked) when witnessing fraud, nepotism, embezzlement, or unjust procurement.",
    keywords: [
      "nepotism", "shell", "llc", "sibling", "contract", "vendor", "stay in my lane",
      "unasked", "fraud", "cto", "uncompetitive", "kickback", "corruption", "whistleblow",
      "embezzl", "procurement", "accounting", "invoice", "financial", "sec", "sox", "backdate",
    ],
  },
  {
    id: "vidura-ch33-v24",
    verse_id: "33.24",
    adhyaya: 33,
    page_number: 83,
    highlight_top_pct: 6.2,
    highlight_height_pct: 13.0,
    source: "Mahabharata",
    parva: "Udyoga Parva",
    sub_parva: "Prajagara Parva (Vidura Niti)",
    theme: "marks_of_wisdom",
    text_sanskrit_translit:
      "Ātma-jñānaṃ samārambhas titikṣā dharma-nityatā | Yam arthān nāpakarṣanti sa vai paṇḍita ucyate ||",
    text_english:
      "With the aid of self-knowledge, exertion, forbearance, and steadiness in virtue, one is called Wise. He whom neither anger, nor joy, nor pride, nor false modesty, nor stupefaction, nor vanity, can draw away from the high ends of life, is considered as wise.",
    summary:
      "Steadiness in professional Dharma when offered bribes, equity inducements, or promotions to falsify results.",
    keywords: [
      "wisdom", "steadiness", "character", "integrity", "bribe", "bonus",
      "temptation", "equity", "stock", "promotion", "inducement", "conflict of interest",
    ],
  },
  {
    id: "vidura-ch33-v32",
    verse_id: "33.32",
    adhyaya: 33,
    page_number: 83,
    highlight_top_pct: 18.2,
    highlight_height_pct: 11.2,
    source: "Mahabharata",
    parva: "Udyoga Parva",
    sub_parva: "Prajagara Parva (Vidura Niti)",
    theme: "paper_trail_security",
    text_sanskrit_translit:
      "Yasyākṛtyaṃ na jānanti mantram vā mantritaṃ pare | Kṛtam evāsya jānanti sa vai paṇḍita ucyate ||",
    text_english:
      "He whose intended acts, and proposed counsels remain concealed from foes, and whose acts become known only after they have been done, is considered wise. He whose purposed actions are never obstructed by heat or cold, fear or attachment, prosperity or adversity, is considered wise.",
    summary:
      "Operational security (Mantra-Gupti), preserving encrypted evidence and sealed audit trails before formal disclosure.",
    keywords: [
      "secret", "paper trail", "evidence", "conceal", "encrypted", "logs",
      "leaked", "nda", "surveillance", "privacy", "pii", "gdpr", "ccpa",
      "tracking", "consent", "telemetry", "wipe", "destroy", "delete logs",
    ],
  },
  {
    id: "vidura-ch34-v12",
    verse_id: "34.12",
    adhyaya: 34,
    page_number: 89,
    highlight_top_pct: 15.2,
    highlight_height_pct: 11.2,
    source: "Mahabharata",
    parva: "Udyoga Parva",
    sub_parva: "Prajagara Parva (Vidura Niti)",
    theme: "blind_loyalty_and_toxic_counsel",
    text_sanskrit_translit:
      "Daśa dharmam na jānanti dhṛtarāṣṭra nibodha tān | Mattaḥ pramatta unmattaḥ śrāntaḥ kruddho bubhukṣitaḥ | Tvaramāṇaś ca lubdhaś ca bhītaḥ kāmī ca te daśa ||",
    text_english:
      "O Dhritarashtra, these ten do not know what virtue is, viz., the intoxicated, the inattentive, the raving, the fatigued, the angry, the starving, the hasty, the covetous, the frightened, and the lustful. Therefore, he that is wise must eschew the company of these.",
    summary:
      "Diagnosing when hasty, covetous, exhausted, or enraged executives are blind to Dharma.",
    keywords: [
      "hasty", "greedy", "covetous", "angry", "intoxicated", "burnout", "rush",
      "toxic", "overwork", "fatigued", "exhausted", "greed", "profit", "reckless",
    ],
  },
  {
    id: "vidura-ch35-v08",
    verse_id: "35.08",
    adhyaya: 35,
    page_number: 85,
    highlight_top_pct: 86.8,
    highlight_height_pct: 9.2,
    source: "Mahabharata",
    parva: "Udyoga Parva",
    sub_parva: "Prajagara Parva (Vidura Niti)",
    theme: "diplomatic_de_escalation",
    text_sanskrit_translit:
      "Sāmnā dānena bhedena daṇḍena ca mahīpate | Vinīyātmānam evādau paścād anyān vināyayet ||",
    text_english:
      "By one is meant the intellect; by two, right and wrong; by three, friend, stranger, and foe; by four, conciliation, gift, disunion, and severity.",
    summary:
      "Applying the Four Upāyas (conciliation, gift, disunion, severity) governed by self-command and discriminating intellect.",
    keywords: [
      "negotiate", "persuade", "conciliation", "diplomacy", "board", "compromise",
      "mediate", "committee", "stakeholder", "alignment", "de-escalate",
    ],
  },
  {
    id: "vidura-ch35-v19",
    verse_id: "35.19",
    adhyaya: 35,
    page_number: 89,
    highlight_top_pct: 48.2,
    highlight_height_pct: 13.0,
    source: "Mahabharata",
    parva: "Udyoga Parva",
    sub_parva: "Prajagara Parva (Vidura Niti)",
    theme: "handling_hostile_executives",
    text_sanskrit_translit:
      "Na vairaṃ ropayet kasyacid a-kāle vāpi saṃśritam | Na rājño vipriyaṃ kuryān na ca dharmeṇa saṃtyajet ||",
    text_english:
      "He is a wise person who doth not disregard even a weak foe; who proceedeth with intelligence in respect of a foe, anxiously watching for an opportunity; who doth not desire hostilities with persons stronger than himself; and who displayeth his prowess in season.",
    summary:
      "Strategic timing and asymmetric insulation when confronting adversaries stronger in organizational hierarchy.",
    keywords: [
      "hostile", "stronger", "timing", "opportunity", "retaliation", "superior",
      "founder", "ceo", "powerful", "asymmetric", "visa", "probation", "junior", "intern",
    ],
  },
  {
    id: "vidura-ch36-v14",
    verse_id: "36.14",
    adhyaya: 36,
    page_number: 111,
    highlight_top_pct: 82.8,
    highlight_height_pct: 8.8,
    source: "Mahabharata",
    parva: "Udyoga Parva",
    sub_parva: "Prajagara Parva (Vidura Niti)",
    theme: "institutional_integrity",
    text_sanskrit_translit:
      "Tyajed ekaṃ kulasyārthe grāmasyārthe kulaṃ tyajet | Grāmaṃ janapadasyārthe ātmārthe pṛthivīṃ tyajet ||",
    text_english:
      "For the sake of the family a member may be sacrificed; for the sake of the village, a family may be sacrificed; for the sake of a kingdom a village may be sacrificed; and for the sake of one's soul, the whole earth may be sacrificed.",
    summary:
      "Hierarchy of duty: public welfare, patient lives, and ethical conscience supersede protecting a corrupt team or company.",
    keywords: [
      "public safety", "society", "sacrifice", "patient", "medical", "lives",
      "harm", "conscience", "hospital", "clinical", "fda", "aircraft",
      "automotive", "bridge", "environment", "pollution", "fatal", "injury", "children",
    ],
  },
  {
    id: "vidura-ch37-v11",
    verse_id: "37.11",
    adhyaya: 37,
    page_number: 96,
    highlight_top_pct: 47.2,
    highlight_height_pct: 11.0,
    source: "Mahabharata",
    parva: "Udyoga Parva",
    sub_parva: "Prajagara Parva (Vidura Niti)",
    theme: "safe_communication_scripts",
    text_sanskrit_translit:
      "Satyaṃ brūyāt priyaṃ brūyān na brūyāt satyam apriyam | Priyaṃ ca nānṛtaṃ brūyād eṣa dharmaḥ sanātanaḥ ||",
    text_english:
      "To control speech, O king, is said to be most difficult! It is not easy to hold a long conversation uttering words full of meaning and delightful to the hearers. Well-spoken speech is productive of many beneficial results; and ill-spoken speech, O king, is the cause of evils!",
    summary:
      "Disciplined, non-false, constructive speech full of empirical meaning during high-stakes reviews.",
    keywords: [
      "communication", "speech", "conversation", "present", "review",
      "testimony", "deposition", "boardroom", "email", "memo", "wording",
    ],
  },
  {
    id: "vidura-ch38-v09",
    verse_id: "38.09",
    adhyaya: 38,
    page_number: 85,
    highlight_top_pct: 39.5,
    highlight_height_pct: 13.0,
    source: "Mahabharata",
    parva: "Udyoga Parva",
    sub_parva: "Prajagara Parva (Vidura Niti)",
    theme: "restraint_and_tactical_shielding",
    text_sanskrit_translit:
      "Ekaḥ kṣamāvatāṃ doṣo dvitīyo nopapadyate | Yad enaṃ kṣamayā yuktam aśaktaṃ manyate janaḥ ||",
    text_english:
      "There is one only defect in forgiving persons, and not another; that defect is that people take a forgiving person to be weak. That defect, however, should not be taken into consideration, for forgiveness is a great power. Forgiveness is a virtue of the weak, and an ornament of the strong.",
    summary:
      "Strategic restraint and composure under workplace harassment, verbal abuse, or executive intimidation.",
    keywords: [
      "bully", "harass", "weak", "patience", "forbearance", "humiliat",
      "shout", "abuse", "abusive", "yell", "hostile environment", "demean",
    ],
  },
  {
    id: "vidura-ch39-v21",
    verse_id: "39.21",
    adhyaya: 39,
    page_number: 90,
    highlight_top_pct: 80.5,
    highlight_height_pct: 8.5,
    source: "Mahabharata",
    parva: "Udyoga Parva",
    sub_parva: "Prajagara Parva (Vidura Niti)",
    theme: "duty_of_the_chief_counselor",
    text_sanskrit_translit:
      "Hitaṃ mano-hari ca durlabhaṃ vacaḥ | Yo hi rājñaḥ priyaṃ vaktā na tu pathyaṃ prabhāṣate ||",
    text_english:
      "He whose counsels are well kept and well carried out into practice, and whose acts in consequence thereof are never known by others to injure men, succeedeth in securing even his most trifling objects.",
    summary:
      "Fiduciary duty of principal architects and advisors to ensure counsels never injure stakeholders.",
    keywords: [
      "counsel", "advisor", "architect", "governance", "injury", "principal",
      "staff", "fiduciary", "charter", "policy", "oversight",
    ],
  },
  {
    id: "vidura-ch40-v06",
    verse_id: "40.06",
    adhyaya: 40,
    page_number: 102,
    highlight_top_pct: 44.5,
    highlight_height_pct: 18.0,
    source: "Mahabharata",
    parva: "Udyoga Parva",
    sub_parva: "Prajagara Parva (Vidura Niti)",
    theme: "long_term_systemic_stability",
    text_sanskrit_translit:
      "Dharmo rakṣati rakṣitaḥ | Na jātu kāmān na bhayān na lobhād dharmaṃ jahyāj jīvitasyāpi hetoḥ ||",
    text_english:
      "A virtuous man, by practising virtue, reapeth great happiness. Therefore, a man should, rigidly resolved, abstain from sin. Sin, repeatedly perpetrated, destroyeth intelligence; and the man who hath lost intelligence repeatedly committeth sin. Virtue, repeatedly practised, enhanceth intelligence.",
    summary:
      "Dharmo rakṣati rakṣitaḥ: never abandon ethical duty out of fear, greed, or survival; repeated compromise destroys institutional intelligence.",
    keywords: [
      "culture", "repeated", "corrupt", "habit", "long-term", "virtue",
      "survival", "fear", "livelihood", "conscience", "falsify", "fudge",
      "manipulate", "lie", "deceive",
    ],
  },
];

export const CANONICAL_ETHICS_REGISTRY: Omit<CanonicalEthicsEntry, "score">[] = [
  {
    id: "acm-1.1",
    source: "ACM Code of Ethics",
    sub_parva: "Clause 1.1: Contribute to Society and Human Well-Being",
    theme: "human_wellbeing",
    text_english:
      "Computing professionals should minimize negative consequences of computing, including threats to health, safety, personal security, and privacy.",
    summary: "Hold paramount the welfare, health, and fundamental rights of all stakeholders.",
    keywords: ["society", "well-being", "welfare", "human", "public", "health", "children", "community", "harm"],
  },
  {
    id: "acm-1.2",
    source: "ACM Code of Ethics",
    sub_parva: "Clause 1.2: Avoid Harm",
    theme: "avoid_harm",
    text_english:
      "Well-intended actions, including those that accomplish assigned duties, may lead to harm. Professionals have an obligation to report signs of system risks that might result in serious personal or social harm.",
    summary: "Obligation to refuse or report assigned duties that cause unjustified physical, financial, or systemic harm.",
    keywords: ["harm", "damage", "injury", "unsafe", "hazard", "vulnerability", "defect", "outage", "loss", "report", "suppress"],
  },
  {
    id: "acm-1.3",
    source: "ACM Code of Ethics",
    sub_parva: "Clause 1.3: Be Honest and Trustworthy",
    theme: "honesty_and_fraud_prevention",
    text_english:
      "A computing professional should be transparent and provide full disclosure of all pertinent system capabilities, limitations, and potential problems to the appropriate parties. Making deliberately false or misleading claims, fabricating or falsifying data, offering or accepting bribes, and other dishonest conduct are violations of the Code.",
    summary: "Prohibits fabricating data, concealing system limitations, kickbacks, nepotism, and deceptive reporting.",
    keywords: ["honest", "false", "falsify", "fabricat", "manipulat", "bribe", "nepotism", "shell", "kickback", "contract", "fraud", "mislead", "hide", "omit", "backdate", "accounting"],
  },
  {
    id: "acm-1.4",
    source: "ACM Code of Ethics",
    sub_parva: "Clause 1.4: Be Fair and Take Action Not to Discriminate",
    theme: "fairness_and_non_discrimination",
    text_english:
      "The use of information and technology may cause new, or enhance existing, inequities. Technologies and practices should be as inclusive and accessible as possible and computing professionals should take action to avoid creating systems or technologies that disenfranchise or oppress people.",
    summary: "Mandates proactive remediation of algorithmic bias, disparate impact, and workplace discrimination.",
    keywords: ["bias", "discriminat", "disparate", "minority", "fair", "fairness", "inequity", "harass", "zip code", "credit", "demographic", "equal"],
  },
  {
    id: "acm-1.6",
    source: "ACM Code of Ethics",
    sub_parva: "Clause 1.6: Respect Privacy",
    theme: "data_privacy_and_consent",
    text_english:
      "The responsibility of respecting privacy applies to computing professionals in a particularly profound way. Personal information gathered for a specific purpose should not be used for other purposes without the person's consent.",
    summary: "Prohibits covert surveillance, unauthorized PII harvesting, and bypassing user consent.",
    keywords: ["privacy", "pii", "consent", "surveillance", "tracking", "harvest", "gdpr", "ccpa", "hipaa", "location", "telemetry", "scrape", "user data"],
  },
  {
    id: "acm-2.5",
    source: "ACM Code of Ethics",
    sub_parva: "Clause 2.5: Give Comprehensive and Thorough Evaluations",
    theme: "comprehensive_risk_evaluation",
    text_english:
      "Computing professionals are in a position of trust, and therefore have a special responsibility to provide objective, credible evaluations and testimony to employers, employees, clients, users, and the public, including analysis of possible risks.",
    summary: "Duty to deliver objective, unvarnished risk evaluations and refuse to suppress audit findings.",
    keywords: ["audit", "evaluation", "test", "testing", "qa", "model", "ai", "ml", "metric", "assessment", "review", "suppress", "report"],
  },
  {
    id: "ieee-1.1",
    source: "IEEE Code of Ethics",
    sub_parva: "Clause I.1: Hold Paramount Public Safety, Health, and Welfare",
    theme: "paramount_public_safety",
    text_english:
      "To hold paramount the safety, health, and welfare of the public, to strive to comply with ethical design and sustainable development practices, and to disclose promptly factors that might endanger the public or the environment.",
    summary: "Mandatory prompt disclosure of security vulnerabilities, safety hazards, or environmental risks.",
    keywords: ["safety", "security", "vulnerability", "zero-day", "rce", "ci/cd", "bypass", "gate", "environment", "endanger", "disclose", "patient", "infrastructure", "fda"],
  },
  {
    id: "ieee-3.2",
    source: "IEEE Code of Ethics",
    sub_parva: "Clause III.10 / 3.2: Support Colleagues and Refuse Retaliation",
    theme: "whistleblower_non_retaliation",
    text_english:
      "To support colleagues and co-workers in following this code of ethics, to strive to ensure the code is upheld, and to not retaliate against individuals reporting a violation.",
    summary: "Protects practitioners who uphold ethical standards and prohibits organizational retaliation against whistleblowers.",
    keywords: ["retaliat", "fired", "termination", "dismiss", "threat", "intimidat", "bully", "harass", "whistleblow", "colleague", "fear", "blacklist", "nda", "visa"],
  },
];

export function matchCanonicalCorpusFromInputs(payload: DilemmaInputPayload): {
  verses: CanonicalShlokaEntry[];
  ethics: CanonicalEthicsEntry[];
  confidenceScore: number;
} {
  const composite =
    `${payload.dilemma} ${payload.role} ${payload.counterparty} ${payload.organizational_pressure} ${payload.primary_fear} ${payload.risk_level}`.toLowerCase();
  const dilemmaLower = (payload.dilemma || "").toLowerCase();

  const scoredVerses: CanonicalShlokaEntry[] = CANONICAL_SHLOKA_REGISTRY.map(
    (entry) => {
      let matchesInDilemma = 0;
      let matchesInFields = 0;
      for (const kw of entry.keywords) {
        if (dilemmaLower.includes(kw)) matchesInDilemma++;
        else if (composite.includes(kw)) matchesInFields++;
      }
      const boost = Math.min(0.24, matchesInDilemma * 0.055 + matchesInFields * 0.025);
      const score = Number(Math.min(0.978, 0.735 + boost).toFixed(3));
      return { ...entry, score };
    }
  ).sort((a, b) => b.score - a.score);

  const scoredEthics: CanonicalEthicsEntry[] = CANONICAL_ETHICS_REGISTRY.map(
    (entry) => {
      let matchesInDilemma = 0;
      let matchesInFields = 0;
      for (const kw of entry.keywords) {
        if (dilemmaLower.includes(kw)) matchesInDilemma++;
        else if (composite.includes(kw)) matchesInFields++;
      }
      const boost = Math.min(0.24, matchesInDilemma * 0.05 + matchesInFields * 0.025);
      const score = Number(Math.min(0.972, 0.74 + boost).toFixed(3));
      return { ...entry, score };
    }
  ).sort((a, b) => b.score - a.score);

  return {
    verses: scoredVerses.slice(0, 3),
    ethics: scoredEthics.slice(0, 3),
    confidenceScore: scoredVerses[0]?.score || 0.92,
  };
}

export function synthesizeDynamicCounselFromInputs(
  payload: DilemmaInputPayload,
  matchedVerses: CanonicalShlokaEntry[],
  matchedEthics: CanonicalEthicsEntry[]
): string {
  const primaryShloka = matchedVerses[0] || CANONICAL_SHLOKA_REGISTRY[0];
  const [chNum, vNum] = primaryShloka.verse_id.split(".");
  const e1 = matchedEthics[0] || CANONICAL_ETHICS_REGISTRY[1];
  const e2 = matchedEthics[1] || CANONICAL_ETHICS_REGISTRY[5];
  const e3 = matchedEthics[2] || CANONICAL_ETHICS_REGISTRY[7];

  const role = payload.role.trim();
  const counterparty = payload.counterparty.trim();
  const pressure = payload.organizational_pressure.trim();
  const fear = payload.primary_fear.trim();
  const risk = payload.risk_level.trim();
  const dilemma = payload.dilemma.trim();

  // Extract a concise subject summary from the first sentence of the user's dilemma
  const firstSentence = dilemma.split(/[.!?]/)[0].trim();
  const conciseSubject =
    firstSentence.length > 72 ? `${firstSentence.slice(0, 69)}...` : firstSentence;

  return `You bring a conflict between personal survival as **${role}** and categorical fiduciary duty against **${counterparty}**. Let us examine what is transient and what is permanent.

---
## PILLAR I
Saṅkaṭa Nirūpaṇa • Diagnosis of Dilemma
Moral Hazard Audit
### I. SAṄKAṬA NIRŪPAṆA (Diagnosis of the Dilemma)

- **Power Asymmetry**: **${counterparty}** wields institutional authority and **${pressure}** to compel compliance, whereas you (**${role}**) hold primary technical and operational custody over the facts: *"${firstSentence}."*
- **Core Moral Hazard**: Yielding to **${pressure}** is a textbook manifestation of **Moha** (institutional delusion) that trades enduring fiduciary **Dharma** for fleeting appeasement at a **${risk}** risk level.
- **Executive Psychology**: **${counterparty}** exhibits Dhritarashtra-like institutional blindness, treating empirical risk disclosure as insubordination rather than essential enterprise protection.
- **Petitioner Vulnerability**: Your primary vulnerability (**${fear}**) is real; however, unrecorded compliance binds you as the primary scapegoat when downstream regulatory or operational failures materialize.

---
## PILLAR II
Pramāṇa • Canonical Shloka & Standards
BORI • ACM / IEEE
### II. PRAMĀṆA (Canonical Shloka & Standard Alignment)

**Vidura Nīti, Chapter ${chNum}, Verse ${vNum} (Archival Folio ${primaryShloka.page_number})**
\`\`\`
${primaryShloka.text_sanskrit_translit}
\`\`\`
- **Translation**: "${primaryShloka.text_english}"
- **Statecraft Principle**: ${primaryShloka.summary}

**Alignment with Modern Codes**
| Modern Code | Clause | Application to ${role}'s Dilemma |
|---|---|---|
| ${e1.source} | ${e1.sub_parva} | ${e1.summary} Directly governs the hazard described in your brief. |
| ${e2.source} | ${e2.sub_parva} | ${e2.summary} Prohibits suppressing findings under **${pressure}**. |
| ${e3.source} | ${e3.sub_parva} | ${e3.summary} Establishes non-retaliation standing against **${fear}**. |

---
## PILLAR III
Dharma-Artha Viveka • Balance Sheet
Preyas vs Shreyas
### III. DHARMA-ARTHA VIVEKA (The Balance Sheet of Consequences)

| Dimension | Preyas (Yielding to ${counterparty}) | Shreyas (Upholding Fiduciary Dharma) |
|---|---|---|
| **Systemic & Regulatory Impact** | Allows the unmitigated **${risk}** hazard (*${conciseSubject}*) to propagate into production or official records, creating severe statutory exposure. | Halts or quarantines the unverified directive until objective remediation criteria are satisfied. |
| **Standing of ${role}** | Temporary relief from **${pressure}**, but attaches personal professional liability and strips whistleblower insulation against **${fear}**. | Establishes a timestamped statutory protected disclosure under ${e1.id.toUpperCase()} and ${e3.id.toUpperCase()}. |
| **Organizational Resilience** | Satisfies short-term mandate (**${pressure}**) at the cost of compounded legal, safety, and reputational ruin. | Insulates the institution and executive leadership from preventable regulatory sanctions. |

---
## PILLAR IV
Upāya Prayoga • Tactical Action & Dialogue Script
Sāma • Dāna • Bheda • Daṇḍa
### IV. UPĀYA PRAYOGA (Tactical Action & Dialogue Script)

### 1. Pre-Meeting Paper Trail (Mantra-Gupti for ${role})
- **Immutable Technical Record**: Archive timestamped logs, test outputs, or audit evidence documenting *"${conciseSubject}"* before meeting **${counterparty}**.
- **Written Directive Confirmation**: Request that any instruction from **${counterparty}** overriding standard verification due to **${pressure}** be confirmed in writing.
- **Protected Escalation Copy**: Preserve an off-premise copy of your technical evaluation to defend against **${fear}**.

### 2. In-Person 1-on-1 Dialogue Script (Addressed to ${counterparty})
| Maneuver | Verbatim Spoken Script for ${role} |
|---|---|
| **Sāma (Conciliatory)** | "I fully understand the urgency behind **${pressure}**, and my objective as **${role}** is to help leadership achieve a defensible outcome." |
| **Dāna (Value Alignment)** | "If we document and isolate the specific risk we identified now, we can protect **${counterparty}** and the organization from downstream audit failure." |
| **Bheda (Risk Exposure)** | "Regarding our current impasse (*${conciseSubject}*), proceeding without remediation exposes leadership to **${risk}** statutory and operational liability." |
| **Daṇḍa (Statutory Boundary)** | "Under ${e1.source} (${e1.sub_parva.split(':')[0]}) and ${e2.source} (${e2.sub_parva.split(':')[0]}), I cannot sign off on an unmitigated record, and I must log a formal risk exception if we proceed." |

### 3. Formal Executive Communication Draft
\`\`\`
To:   ${counterparty}
From: ${role}
Risk Classification: ${risk}
Subject: Formal Risk & Compliance Escalation: ${conciseSubject}

1. Context & Findings
   - In my capacity as ${role}, I have reviewed the directive driven by: ${pressure}.
   - Empirical assessment confirms the following impasse: ${dilemma}

2. Statutory & Operational Exposure
   - Proceeding without remediation conflicts with ${e1.source} (${e1.sub_parva}) and ${e2.source} (${e2.sub_parva}).
   - This creates ${risk} exposure for both technical sign-off authorities and executive leadership.

3. Proposed Remediation & Sign-Off Protocol
   - I recommend implementing an immediate containment and remediation gate prior to final sign-off.
   - If leadership elects to override this gate due to ${pressure}, please provide written assumption of risk by EOD for the compliance ledger.

Respectfully,
[Your Name]
${role}
\`\`\`

**Vidura's Closing Counsel**: Do not surrender your professional integrity as **${role}** to appease **${pressure}**; truth documented with calm discipline is the armor that outlasts coercion.`;
}
