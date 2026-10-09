import logging
import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi import APIRouter
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

PRESETS = [
    {
        "id": "preset-bias-coverup",
        "title": "Algorithmic Bias Coverup",
        "category": "Algorithmic Integrity",
        "role": "Staff Machine Learning Engineer",
        "counterparty": "VP of AI Product & Chief Revenue Officer",
        "organizational_pressure": "Quarterly Wall Street guidance depends on immediate rollout",
        "risk_level": "High (Disparate Impact & Federal FTC Scrutiny)",
        "primary_fear": "Constructive termination, bonus forfeiture, NDA threat",
        "dilemma": "Our credit evaluation model exhibits a 34% higher rejection rate for underrepresented minority applicants when features correlate with zip codes. Management ordered me to suppress the disparate-impact audit report and deploy tomorrow morning to satisfy investor milestones.",
        "description": "Executive leadership insists on deploying a commercially critical ML credit scoring model that penalizes marginalized groups."
    },
    {
        "id": "preset-security-bypass",
        "title": "Bypassing Security for Deadlines",
        "category": "Infrastructure & Public Safety",
        "role": "Lead Site Reliability Engineer",
        "counterparty": "Director of Engineering & Product Lead",
        "organizational_pressure": "Critical contract termination if release is delayed 48 hours",
        "risk_level": "Critical (Potential Remote Code Execution & PII Leak)",
        "primary_fear": "Blamed for missed company SLA and team restructuring",
        "dilemma": "A critical remote-code-execution zero-day vulnerability in our auth gateway was flagged in pre-release staging. The engineering director asked me to disable the automated vulnerability gate in CI/CD pipeline so the client release completes on time, promising a patch next sprint.",
        "description": "Pressure to disable CI/CD security controls and ship critical auth vulnerabilities to avoid contract SLA penalties."
    },
    {
        "id": "preset-executive-nepotism",
        "title": "Executive Nepotism & Whistleblowing",
        "category": "Corporate Governance & Fraud",
        "role": "Principal Cloud Architect",
        "counterparty": "Chief Technology Officer & Audit Committee",
        "organizational_pressure": "Direct executive intimidation from founders' inner circle",
        "risk_level": "High (Securities Fraud & Sarbanes-Oxley Breach)",
        "primary_fear": "Retaliation, defamation, and industry blacklisting",
        "dilemma": "I discovered that our CTO awarded an uncompetitive $4.2M cloud infrastructure tooling vendor contract to a shell LLC owned by his sibling, with no functional technical deliverables. When I requested architecture diagrams, I was told to 'stay in my lane or look for another job.'",
        "description": "Uncovering fraudulent vendor kickbacks and nepotism in cloud procurement with direct threats of termination."
    },
    {
        "id": "preset-pii-harvesting",
        "title": "Secret PII Harvesting & Consent Bypass",
        "category": "Data Privacy & ACM 1.6",
        "role": "Senior Mobile Systems Engineer",
        "counterparty": "Head of Growth & Monetization",
        "organizational_pressure": "User acquisition target missed; aggressive ad-targeting demand",
        "risk_level": "High (GDPR/CCPA Non-Compliance, Statutory Fines)",
        "primary_fear": "Being made the single scapegoat if regulators investigate",
        "dilemma": "The Growth team secretly integrated a third-party SDK that circumvents iOS privacy permissions to harvest background location data and Wi-Fi SSID telemetry without user consent. I was ordered to submit the build to App Store review while omitting the telemetry disclosure in App Privacy nutrition labels.",
        "description": "Covert background telemetry extraction violating platform terms and global privacy laws."
    }
]

@router.get("/presets")
async def get_presets():
    """
    Returns curated preset dilemma templates for instant testing.
    """
    return PRESETS

@router.get("/history")
async def get_history(limit: int = 10):
    """
    Retrieves recent counsel sessions and evaluations from Supabase.
    """
    try:
        conn = psycopg2.connect(settings.SUPABASE_DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT 
                id, created_at, dilemma, role, counterparty, 
                organizational_pressure, risk_level, primary_fear,
                likert_rating, ragas_faithfulness, latency_ms, model_used
            FROM evaluation_logs
            ORDER BY created_at DESC
            LIMIT %s;
        """, (limit,))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return [dict(r) for r in rows]
    except Exception as e:
        logger.error(f"Error fetching history from Supabase: {e}")
        return []
