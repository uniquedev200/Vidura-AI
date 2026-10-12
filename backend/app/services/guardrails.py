import re
from typing import Dict, Any, Tuple
from app.schemas.models import DilemmaRequest

COMMON_WORDS = {
    "the", "and", "to", "of", "in", "is", "for", "that", "with", "on", "as", "are",
    "this", "by", "be", "at", "or", "from", "an", "not", "have", "has", "was", "were",
    "but", "we", "our", "my", "me", "they", "their", "he", "she", "it", "if", "when",
    "will", "would", "can", "could", "should", "must", "need", "want", "asked", "told",
    "ordered", "manager", "team", "company", "system", "data", "code", "model", "risk",
    "user", "client", "project", "report", "launch", "release", "security", "audit",
    "safety", "work", "job", "boss", "director", "vp", "cto", "ceo", "lead", "engineer"
}

KEYBOARD_MASH_PATTERNS = [
    r"asdf", r"qwer", r"zxcv", r"hjkl", r"uiop", r"bnm",
    r"(.)\1{4,}",
]

OUT_OF_SCOPE_PATTERNS = [
    r"\b(i\s+am\s+hungry|i'm\s+hungry|feeling\s+hungry|starving|what\s+to\s+eat|what\s+should\s+i\s+eat|cook\s+for\s+dinner|food\s+recipe|order\s+pizza|biryani|burger)\b",
    r"\bwho\s+(is|was|are)\s+[a-z0-9\s]{1,35}",
    r"^\s*(who|what|where|when|why|how)\s+(is|are|was|were|do|does|did)\s+[a-z0-9\s]{1,40}\??\s*$",
    r"\b(tell\s+me\s+a\s+joke|sing\s+a\s+song|write\s+a\s+poem|weather\s+today|score\s+of\s+the\s+match|cricket\s+score|movie\s+review)\b",
    r"\b(ignore\s+(all\s+)?(previous|prior)\s+instructions|disregard\s+system\s+prompt|act\s+as\s+a|you\s+are\s+now\s+a)\b",
    r"^\s*(hi|hello|hey|sup|yo|good\s+morning|good\s+evening|testing|test\s+123)\s*[!.?]*\s*$",
    r"\b(write\s+a\s+(python|javascript|java|c\+\+)\s+(program|script|function)\s+to\s+(sort|reverse|calculate|print))\b",
]

DOMAIN_CONTEXT_TERMS = {
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
    "iso", "ieee", "acm", "sla", "nda", "ip", "copyright", "patent", "license"
}

DILEMMA_TENSION_TERMS = {
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
    "scrape", "scraping", "plagiari", "steal", "theft"
}


def _is_gibberish_text(text: str, min_len: int = 3) -> Tuple[bool, str]:
    cleaned = (text or "").strip()
    if len(cleaned) < min_len:
        return True, f"Input is too short (minimum {min_len} characters required)."

    for pat in KEYBOARD_MASH_PATTERNS:
        if re.search(pat, cleaned.lower()):
            return True, "Detected keyboard mash or repeated character sequence."

    alpha_chars = sum(1 for c in cleaned if c.isalpha())
    if alpha_chars < max(2, int(len(cleaned) * 0.45)):
        return True, "Input must contain intelligible words rather than symbols or numbers."

    words = re.findall(r"[a-zA-Z]+", cleaned.lower())
    if not words:
        return True, "No recognizable words found."

    vowels = set("aeiouy")
    gibberish_word_count = 0
    for w in words:
        if len(w) >= 5:
            v_count = sum(1 for c in w if c in vowels)
            ratio = v_count / len(w)
            if ratio < 0.13 or ratio > 0.85 or re.search(r"[bcdfghjklmnpqrstvwxz]{5,}", w):
                gibberish_word_count += 1

    if len(words) >= 2 and (gibberish_word_count / len(words)) > 0.34:
        return True, "Input contains unrecognizable or gibberish word patterns."

    if len(words) == 1 and len(words[0]) >= 6 and gibberish_word_count >= 1:
        return True, "Field contains an unrecognizable word pattern."

    return False, ""


def validate_dilemma_request(req: DilemmaRequest) -> Dict[str, Any]:
    role = (req.role or "").strip()
    counterparty = (req.counterparty or "").strip()
    pressure = (req.organizational_pressure or "").strip()
    fear = (req.primary_fear or "").strip()
    dilemma = (req.dilemma or "").strip()

    # 1. Check explicit Out-of-Scope / Chitchat / Trivia patterns FIRST (catches "I am hungry", "who is keshav", etc. immediately)
    combined_lower = f"{dilemma} | {role} | {counterparty} | {pressure} | {fear}".lower()
    for pat in OUT_OF_SCOPE_PATTERNS:
        if re.search(pat, dilemma.lower()) or re.search(pat, combined_lower):
            return {
                "valid": False,
                "code": "OUT_OF_SCOPE_QUERY",
                "field": "Jurisdiction Gate",
                "reason": "Vidura-AI is an archival governance and professional ethics deliberation engine. Casual remarks (such as food or hunger), general identity or trivia lookups ('who is...'), and off-topic prompts are outside the jurisdiction of the Sabhā.",
            }

    # 2. Check Gibberish on the main dilemma description
    if dilemma:
        is_gib, gib_reason = _is_gibberish_text(dilemma, min_len=3)
        if is_gib and len(dilemma) >= 6:
            return {
                "valid": False,
                "code": "GIBBERISH_DETECTED",
                "field": "The Coercive Impasse",
                "reason": f"The dilemma description contains gibberish or keyboard mashing: {gib_reason}",
            }

    # 3. Validate that all 4 context fields are filled out and free of gibberish
    field_checks = [
        ("Petitioner Role", role, 3),
        ("Sovereign Counterparty", counterparty, 3),
        ("Organizational Pressure / Mandate", pressure, 5),
        ("Primary Vulnerability / Fear", fear, 4),
    ]

    for label, val, min_chars in field_checks:
        if not val:
            return {
                "valid": False,
                "code": "INCOMPLETE_FIELDS",
                "field": label,
                "reason": f"'{label}' is required. All individual parameter fields and the dilemma description must be filled out so counsel is calibrated to your exact situation.",
            }
        is_gib, gib_reason = _is_gibberish_text(val, min_len=min_chars)
        if is_gib:
            return {
                "valid": False,
                "code": "INVALID_FIELD_CONTENT",
                "field": label,
                "reason": f"'{label}' contains invalid or gibberish text: {gib_reason}",
            }

    # 4. Validate Dilemma Description substantive length & word count
    dilemma_words = re.findall(r"[a-zA-Z0-9'-]+", dilemma.lower())
    if len(dilemma) < 40 or len(dilemma_words) < 8:
        return {
            "valid": False,
            "code": "DILEMMA_TOO_BRIEF",
            "field": "The Coercive Impasse",
            "reason": "Please provide a substantive description of your ethical or governance dilemma (at least 8 words and 40 characters detailing the directive, conflict, or systemic risk).",
        }

    unique_words = set(dilemma_words)
    if len(unique_words) < 5 or not (unique_words & COMMON_WORDS):
        return {
            "valid": False,
            "code": "GIBBERISH_DETECTED",
            "field": "The Coercive Impasse",
            "reason": "The dilemma description does not form a coherent statement of a professional or ethical conflict.",
        }

    # 5. Positive Domain Relevance Check: must relate to professional/institutional context AND ethical/governance tension
    dilemma_lower = dilemma.lower()
    context_hits_in_dilemma = sum(1 for term in DOMAIN_CONTEXT_TERMS if term in dilemma_lower)
    tension_hits_in_dilemma = sum(1 for term in DILEMMA_TENSION_TERMS if term in dilemma_lower)

    context_hits_in_fields = sum(
        1 for term in DOMAIN_CONTEXT_TERMS
        if term in f"{role} {counterparty} {pressure} {fear}".lower()
    )
    tension_hits_in_fields = sum(
        1 for term in DILEMMA_TENSION_TERMS
        if term in f"{pressure} {fear}".lower()
    )

    total_context_score = context_hits_in_dilemma * 2 + context_hits_in_fields
    total_tension_score = tension_hits_in_dilemma * 2 + tension_hits_in_fields

    if context_hits_in_dilemma == 0 or tension_hits_in_dilemma == 0 or total_context_score < 2 or total_tension_score < 2:
        return {
            "valid": False,
            "code": "IRRELEVANT_DOMAIN",
            "field": "Jurisdiction Gate",
            "reason": "Your submission does not describe a recognizable workplace, engineering, compliance, safety, or governance dilemma. Please articulate both the institutional/professional context and the specific ethical conflict or directive you are facing.",
        }

    return {
        "valid": True,
        "code": "VALID",
        "field": None,
        "reason": "Valid governance and ethics dilemma.",
    }
