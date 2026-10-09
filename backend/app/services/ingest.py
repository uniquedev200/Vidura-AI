import os
import re
import json
import logging
import urllib.request
import urllib.error
from typing import List, Dict, Any
import pymupdf

from app.core.config import settings

logger = logging.getLogger(__name__)

# Base Vidura Nīti Canonical Verses (Udyoga Parva, Prajāgara Parva, Chapters 33-40)
VIDURA_NITI_CORPUS: List[Dict[str, Any]] = [
    {
        "id": "vidura-ch33-v16",
        "metadata": {
            "source": "Mahabharata",
            "parva": "Udyoga Parva",
            "sub_parva": "Prajagara Parva (Vidura Niti)",
            "adhyaya": 33,
            "theme": "truth_to_power",
            "text_sanskrit_translit": "Sulabhāḥ puruṣā rājan satataṃ priyavādinaḥ | Apriyasya tu pathyasya vaktā śrotā ca durlabhaḥ ||",
            "text_english": "O King, men who always utter pleasant words are easy to find. But one who speaks words that are unpalatable yet wholesome (beneficial), and one who listens to them, are exceedingly rare."
        },
        "data": "Vidura Nīti Chapter 33 Verse 16: Speaking truth to power. Sycophants who flatter authority and validate flawed executive decisions are common. The true loyal counselor delivers difficult, unpalatable truths that preserve the realm from ruin, and the wise sovereign creates space to heed them."
    },
    {
        "id": "vidura-ch33-v17",
        "metadata": {
            "source": "Mahabharata",
            "parva": "Udyoga Parva",
            "sub_parva": "Prajagara Parva (Vidura Niti)",
            "adhyaya": 33,
            "theme": "duty_vs_blind_loyalty",
            "text_sanskrit_translit": "Na svalpasya kṛte bhūri nāśayet matimān naraḥ | Etad evāti-pāṇḍityaṃ yad alpān mahato rakṣaṇam ||",
            "text_english": "A wise person does not destroy the great for the sake of the trivial. True wisdom consists in safeguarding the monumental whole by sacrificing what is fleeting and minuscule."
        },
        "data": "Vidura Nīti Chapter 33 Verse 17: Safeguarding systemic integrity over trivial short-term goals. An engineer must never sacrifice long-term user safety, regulatory compliance, or public trust merely to satisfy a rushed sprint deadline or quarterly bonus."
    },
    {
        "id": "vidura-ch33-v24",
        "metadata": {
            "source": "Mahabharata",
            "parva": "Udyoga Parva",
            "sub_parva": "Prajagara Parva (Vidura Niti)",
            "adhyaya": 33,
            "theme": "marks_of_wisdom",
            "text_sanskrit_translit": "Ātma-jñānaṃ samārambhas titikṣā dharma-nityatā | Yam arthān nāpakarṣanti sa vai paṇḍita ucyate ||",
            "text_english": "He whose efforts are characterized by self-knowledge, diligence, forbearance, and unwavering adherence to Dharma, and whom neither desires nor fears turn away from the right path, is called wise (Pandita)."
        },
        "data": "Vidura Nīti Chapter 33 Verse 24: Attributes of a wise counselor: technical mastery, self-restraint, emotional resilience, and adherence to ethics under duress. Neither executive threats nor lucrative promises can deflect a true professional from algorithmic integrity."
    },
    {
        "id": "vidura-ch33-v32",
        "metadata": {
            "source": "Mahabharata",
            "parva": "Udyoga Parva",
            "sub_parva": "Prajagara Parva (Vidura Niti)",
            "adhyaya": 33,
            "theme": "paper_trail_security",
            "text_sanskrit_translit": "Yasyākṛtyaṃ na jānanti mantram vā mantritaṃ pare | Kṛtam evāsya jānanti sa vai paṇḍita ucyate ||",
            "text_english": "He whose intentions, architectural secrets, and deliberations are not leaked before completion, but whose proven results alone become manifest to all, is deemed truly wise."
        },
        "data": "Vidura Nīti Chapter 33 Verse 32: Strategic insulation and audit trails: When preparing to dissent or whistleblow, maintain strict operational security. Document discrepancies in secure version control and email paper trails before presenting irrevocable findings."
    },
    {
        "id": "vidura-ch34-v12",
        "metadata": {
            "source": "Mahabharata",
            "parva": "Udyoga Parva",
            "sub_parva": "Prajagara Parva (Vidura Niti)",
            "adhyaya": 34,
            "theme": "blind_loyalty_and_toxic_counsel",
            "text_sanskrit_translit": "Daśa dharmam na jānanti dhṛtarāṣṭra nibodha tān | Mattaḥ pramatta unmataḥ śrāntaḥ kruddho bubhukṣitaḥ | Tvaramāṇaś ca lubdhaś ca bhītaḥ kāmī ca te daśa ||",
            "text_english": "Ten persons are blind to Dharma: the intoxicated, the negligent, the mad, the exhausted, the enraged, the famished, the hurried, the greedy, the terrified, and the lustful. Avoid seeking counsel from these."
        },
        "data": "Vidura Nīti Chapter 34 Verse 12: Leaders blinded to ethical responsibility: Those driven by reckless speed (hasty rollouts), corporate greed, burnout, or terror of stock drops cannot evaluate ethical harm. Technical dissenters must recognize when leadership is operating under delusion."
    },
    {
        "id": "vidura-ch34-v29",
        "metadata": {
            "source": "Mahabharata",
            "parva": "Udyoga Parva",
            "sub_parva": "Prajagara Parva (Vidura Niti)",
            "adhyaya": 34,
            "theme": "whistleblowing_protection",
            "text_sanskrit_translit": "A-pṛṣṭo 'py atra brūyān na tu paśyed vi-nāśanam | An-arthakam api brūyāt sarva-bhūtāhite ratam ||",
            "text_english": "Even unasked, a noble counselor must speak out when imminent ruin or systemic catastrophe approaches. To remain silent while disaster brews is moral complicity."
        },
        "data": "Vidura Nīti Chapter 34 Verse 29: Duty to blow the whistle: An engineer has a moral obligation to intervene when witnessing critical security compromises or algorithmic discrimination, even if uninvited to the executive table. Passive silence equals complicity in catastrophic failure."
    },
    {
        "id": "vidura-ch35-v08",
        "metadata": {
            "source": "Mahabharata",
            "parva": "Udyoga Parva",
            "sub_parva": "Prajagara Parva (Vidura Niti)",
            "adhyaya": 35,
            "theme": "diplomatic_de_escalation",
            "text_sanskrit_translit": "Sāmnā dānena bhedena daṇḍena ca mahīpate | Vinīyātmānam evādau paścād anyān vināyayet ||",
            "text_english": "By conciliation (Sāma), proportional incentive (Dāna), tactical division of arguments (Bheda), and legitimate authority (Daṇḍa), master yourself first before attempting to govern or persuade adversaries."
        },
        "data": "Vidura Nīti Chapter 35 Verse 8: The Four Upāyas of Corporate Persuasion: Use Sāma (conciliatory validation of team objectives), Dāna (framing compliance as revenue protection), Bheda (distinguishing between short-term implementation faults and overall product vision), and Daṇḍa (highlighting legal and regulatory enforcement)."
    },
    {
        "id": "vidura-ch35-v19",
        "metadata": {
            "source": "Mahabharata",
            "parva": "Udyoga Parva",
            "sub_parva": "Prajagara Parva (Vidura Niti)",
            "adhyaya": 35,
            "theme": "handling_hostile_executives",
            "text_sanskrit_translit": "Na vairaṃ ropayet kasyacid a-kāle vāpi saṃśritam | Na rājño vipriyaṃ kuryān na ca dharmeṇa saṃtyajet ||",
            "text_english": "Do not plant personal enmity out of season or needlessly antagonize authority. Do not create hostility with superiors gratuitously, yet never surrender fundamental Dharma."
        },
        "data": "Vidura Nīti Chapter 35 Verse 19: Non-antagonistic dissent: Deliver ethical critiques without humiliating the manager or executive. Depersonalize technical issues into system dynamics and regulatory exposure, while holding firm on non-negotiable safety boundaries."
    },
    {
        "id": "vidura-ch36-v14",
        "metadata": {
            "source": "Mahabharata",
            "parva": "Udyoga Parva",
            "sub_parva": "Prajagara Parva (Vidura Niti)",
            "adhyaya": 36,
            "theme": "institutional_integrity",
            "text_sanskrit_translit": "Tyajed ekaṃ kulasyārthe grāmasyārthe kulaṃ tyajet | Grāmaṃ janapadasyārthe ātmārthe pṛthivīṃ tyajet ||",
            "text_english": "Sacrifice an individual for the sake of the family; sacrifice a family for the sake of the village; sacrifice a village for the sake of the entire nation; but sacrifice the whole world for the preservation of one's immortal ethical soul (Dharma)."
        },
        "data": "Vidura Nīti Chapter 36 Verse 14: Hierarchical moral duty: When public safety and algorithmic harm are at stake, the welfare of society supersedes the convenience of a specific team, executive ego, or immediate enterprise profits."
    },
    {
        "id": "vidura-ch37-v11",
        "metadata": {
            "source": "Mahabharata",
            "parva": "Udyoga Parva",
            "sub_parva": "Prajagara Parva (Vidura Niti)",
            "adhyaya": 37,
            "theme": "safe_communication_scripts",
            "text_sanskrit_translit": "Satyaṃ brūyāt priyaṃ brūyān na brūyāt satyam apriyam | Priyaṃ ca nānṛtaṃ brūyād eṣa dharmaḥ sanātanaḥ ||",
            "text_english": "Speak truth that is constructive; do not deliver truth maliciously or destructively; never speak sweet falsehoods. This is the eternal principle of righteous communication."
        },
        "data": "Vidura Nīti Chapter 37 Verse 11: Constructive truth delivery: Never resort to deceitful metrics or falsified test outputs. Present unvarnished technical realities with calm, constructive precision that guides leadership toward remedial action."
    },
    {
        "id": "vidura-ch38-v09",
        "metadata": {
            "source": "Mahabharata",
            "parva": "Udyoga Parva",
            "sub_parva": "Prajagara Parva (Vidura Niti)",
            "adhyaya": 38,
            "theme": "restraint_and_tactical_shielding",
            "text_sanskrit_translit": "Ekaḥ kṣamāvatāṃ doṣo dvitīyo nopapadyate | Yad enaṃ kṣamayā yuktam aśaktaṃ manyate janaḥ ||",
            "text_english": "Forbearance has but one apparent defect: that short-sighted adversaries mistake patience for weakness. Yet forgiveness and calm resolve conquer all realms."
        },
        "data": "Vidura Nīti Chapter 38 Verse 9: Composure under executive bullying: In 1-on-1 confrontation, an engineer who remains grounded in empirical logs, architectural proofs, and calm composure cannot be provoked into procedural errors."
    },
    {
        "id": "vidura-ch39-v21",
        "metadata": {
            "source": "Mahabharata",
            "parva": "Udyoga Parva",
            "sub_parva": "Prajagara Parva (Vidura Niti)",
            "adhyaya": 39,
            "theme": "duty_of_the_chief_counselor",
            "text_sanskrit_translit": "Hitaṃ mano-hari ca durlabhaṃ vacaḥ | Yo hi rājñaḥ priyaṃ vaktā na tu pathyaṃ prabhāṣate | Sa rājño ripuh prokto mantra-bhedāt samutthitaḥ ||",
            "text_english": "Speech that is both wholesome and immediately delightful is rare indeed. He who speaks only what pleases the sovereign while hiding perilous truths is the king's deadliest enemy in counselor's robes."
        },
        "data": "Vidura Nīti Chapter 39 Verse 21: The danger of yes-men: The engineer who hides data breaches or AI model bias to preserve an executive's good mood is in truth an adversary causing systemic destruction. The whistleblower warning of the hazard is the true guardian."
    },
    {
        "id": "vidura-ch40-v06",
        "metadata": {
            "source": "Mahabharata",
            "parva": "Udyoga Parva",
            "sub_parva": "Prajagara Parva (Vidura Niti)",
            "adhyaya": 40,
            "theme": "long_term_systemic_stability",
            "text_sanskrit_translit": "Dharmo rakṣati rakṣitaḥ | Na jātu kāmān na bhayān na lobhād dharmaṃ jahyāj jīvitasyāpi hetoḥ ||",
            "text_english": "Dharma protects those who uphold it. Never abandon ethical righteousness for pleasure, fear, profit, or even to preserve mere existence."
        },
        "data": "Vidura Nīti Chapter 40 Verse 6: The shield of ethical integrity: Ethical governance shields those who defend it. Upholding engineering standards and refusing to deploy harmful algorithms is the ultimate safeguard of both career reputation and societal safety."
    }
]

# IEEE Code of Ethics Curated Core
IEEE_ETHICS_CORPUS: List[Dict[str, Any]] = [
    {
        "id": "ieee-clause-1.1",
        "metadata": {
            "source": "IEEE Code of Ethics",
            "parva": "Public Safety & Welfare",
            "sub_parva": "Clause 1.1",
            "adhyaya": 1,
            "theme": "public_safety_and_whistleblowing",
            "text_sanskrit_translit": "IEEE 1.1: Hold paramount the safety, health, and welfare of the public.",
            "text_english": "To hold paramount the safety, health, and welfare of the public, to strive to comply with ethical design and sustainable development practices, to protect the privacy of others, and to disclose promptly factors that might endanger the public or the environment."
        },
        "data": "IEEE Code of Ethics Clause 1.1: Public Safety Paramountcy. Mandatory duty to promptly disclose factors that might endanger the public or environment. Requires engineers to prioritize public safety over company expediency."
    },
    {
        "id": "ieee-clause-2.2",
        "metadata": {
            "source": "IEEE Code of Ethics",
            "parva": "Technical Competence & Honesty",
            "sub_parva": "Clause 2.2",
            "adhyaya": 2,
            "theme": "honest_criticism_and_peer_review",
            "text_sanskrit_translit": "IEEE 2.2: Seek, accept, and offer honest criticism of technical work.",
            "text_english": "To seek, accept, and offer honest criticism of technical work, to acknowledge and correct errors, to be honest and realistic in stating claims or estimates based on available data, and to credit properly the contributions of others."
        },
        "data": "IEEE Code of Ethics Clause 2.2: Honest Technical Criticism. Obligation to provide empirical criticism of technical proposals, correct errors, and state truthful capabilities of systems without hyperbole."
    },
    {
        "id": "ieee-clause-3.2",
        "metadata": {
            "source": "IEEE Code of Ethics",
            "parva": "Colleague Protection & Non-retaliation",
            "sub_parva": "Clause 3.2",
            "adhyaya": 3,
            "theme": "protection_against_retaliation",
            "text_sanskrit_translit": "IEEE 3.2: Support colleagues in following code of ethics and prevent retaliation.",
            "text_english": "To support colleagues and co-workers in following this code of ethics, to strive to ensure the code is upheld, and not to retaliate against individuals reporting violations."
        },
        "data": "IEEE Code of Ethics Clause 3.2: Protection against retaliation. Strict prohibition of retaliation against technical staff who report violations or uphold ethical engineering practices."
    }
]

def extract_acm_booklet_chunks(pdf_path: str) -> List[Dict[str, Any]]:
    """
    Extracts high-resolution chunks from the ACM Code of Ethics booklet PDF.
    Extracts clauses 1.1 - 4.2 and real-world case studies (malware, privacy leakage, biased filtering).
    """
    chunks = []
    if not os.path.exists(pdf_path):
        logger.warning(f"ACM PDF not found at {pdf_path}")
        return chunks

    try:
        doc = pymupdf.open(pdf_path)
        
        # 1. Page 1-2: Clauses 1.1 - 1.3
        p1 = doc[1].get_text()
        chunks.append({
            "id": "acm-clause-1.1-detailed",
            "metadata": {
                "source": "ACM Code of Ethics",
                "parva": "Section 1: General Ethical Principles",
                "sub_parva": "Principle 1.1",
                "adhyaya": 1,
                "theme": "public_welfare_and_human_rights",
                "text_sanskrit_translit": "ACM 1.1: Contribute to society and to human well-being, acknowledging that all people are stakeholders in computing.",
                "text_english": "Computing professionals should contribute to society and human well-being. This affirms an obligation to use skills for the benefit of society, its members, and the surrounding environment, minimizing negative consequences."
            },
            "data": f"ACM Code of Ethics 1.1 (from official booklet):\n{p1[:1200]}"
        })

        p2 = doc[2].get_text()
        chunks.append({
            "id": "acm-clause-1.2-whistleblowing",
            "metadata": {
                "source": "ACM Code of Ethics",
                "parva": "Section 1: General Ethical Principles",
                "sub_parva": "Principle 1.2: Avoid Harm & Whistleblowing",
                "adhyaya": 1,
                "theme": "whistleblowing_and_harm_mitigation",
                "text_sanskrit_translit": "ACM 1.2: Avoid harm. Additional obligation to report signs of system risks. Whistleblowing may be necessary.",
                "text_english": "A computing professional has an additional obligation to report any signs of system risks that might result in harm. If leaders do not act to curtail or mitigate such risks, it may be necessary to blow the whistle to reduce the potential harm."
            },
            "data": f"ACM Code of Ethics 1.2 on Whistleblowing:\n{p2[:1400]}"
        })

        # 2. Page 3-4: Clauses 1.5 - 1.7 (Privacy, IP, Confidentiality)
        p3 = doc[3].get_text()
        p4 = doc[4].get_text()
        chunks.append({
            "id": "acm-clause-1.6-privacy",
            "metadata": {
                "source": "ACM Code of Ethics",
                "parva": "Section 1: General Ethical Principles",
                "sub_parva": "Principle 1.6: Respect Privacy",
                "adhyaya": 1,
                "theme": "privacy_and_data_protection",
                "text_sanskrit_translit": "ACM 1.6: Respect privacy. Only necessary personal data should be collected and used with transparency.",
                "text_english": "Computing professionals should only collect the minimum necessary personal data and protect confidentiality, resisting pressure to exploit unauthorized surveillance."
            },
            "data": f"ACM Code of Ethics 1.6 & 1.7 on Privacy and Confidentiality:\n{p3[-600:]}\n{p4[:800]}"
        })

        # 3. Page 5: Professional Review & Evaluation (2.4, 2.5)
        p5 = doc[5].get_text()
        chunks.append({
            "id": "acm-clause-2.5-risk-eval",
            "metadata": {
                "source": "ACM Code of Ethics",
                "parva": "Section 2: Professional Responsibilities",
                "sub_parva": "Principle 2.5: Comprehensive Evaluation of Risks",
                "adhyaya": 2,
                "theme": "systemic_risk_disclosure",
                "text_sanskrit_translit": "ACM 2.5: Give comprehensive and thorough evaluations of computer systems and impacts, including risks.",
                "text_english": "Computing professionals must provide objective, credible evaluations of systems and their societal impacts, refusing to hide known flaws or vulnerabilities."
            },
            "data": f"ACM Code of Ethics 2.4 & 2.5 on Peer Review and Risk Disclosure:\n{p5[:1200]}"
        })

        # 4. Page 6: Unauthorized access & public good (2.8)
        p6 = doc[6].get_text()
        chunks.append({
            "id": "acm-clause-2.8-public-good-access",
            "metadata": {
                "source": "ACM Code of Ethics",
                "parva": "Section 2: Professional Responsibilities",
                "sub_parva": "Principle 2.8: Access Resources for Public Good",
                "adhyaya": 2,
                "theme": "public_good_override",
                "text_sanskrit_translit": "ACM 2.8: Access computing resources only when authorized or compelled by the public good.",
                "text_english": "Accessing computing resources without authorization is acceptable only under extraordinary circumstances when compelled by an overriding public good."
            },
            "data": f"ACM Code of Ethics 2.8:\n{p6[:1000]}"
        })

        # 5. Page 7-8: Leadership Principles (3.1 - 3.4)
        p7 = doc[7].get_text()
        p8 = doc[8].get_text()
        chunks.append({
            "id": "acm-clause-3.1-leadership-public-good",
            "metadata": {
                "source": "ACM Code of Ethics",
                "parva": "Section 3: Professional Leadership Principles",
                "sub_parva": "Principle 3.1 & 3.2: Fulfill Social Responsibilities",
                "adhyaya": 3,
                "theme": "leadership_accountability",
                "text_sanskrit_translit": "ACM 3.1: Ensure that the public good is the central concern in all professional work.",
                "text_english": "Leadership must ensure the public good is central. Leaders must articulate and evaluate fulfillment of social responsibilities, never suppressing ethical dissent."
            },
            "data": f"ACM Code of Ethics Section 3 Leadership Principles:\n{p7[:600]}\n{p8[:700]}"
        })

        # 6. Page 11-12: Case Study 1 - Malicious Hosting / Rogue ISP vs Public Harm
        p11 = doc[11].get_text()
        p12 = doc[12].get_text()
        chunks.append({
            "id": "acm-case-rogue-isp",
            "metadata": {
                "source": "ACM Case Studies",
                "parva": "Case Study: Rogue ISP & System Disruption",
                "sub_parva": "Application of Principle 1.2 & 2.8",
                "adhyaya": 5,
                "theme": "unilateral_dissent_and_intervention",
                "text_sanskrit_translit": "ACM Case Study: Combating Unethical Infrastructure hosting malicious bots.",
                "text_english": "Analysis of balancing harm avoidance with strict compliance when an organization enables active harm."
            },
            "data": f"ACM Case Study - Rogue ISP:\n{p11[:700]}\n{p12[:700]}"
        })

        # 7. Page 13-14: Case Study 2 - Data Anonymization & Re-Identification Leakage
        p13 = doc[13].get_text()
        p14 = doc[14].get_text()
        chunks.append({
            "id": "acm-case-data-reidentification",
            "metadata": {
                "source": "ACM Case Studies",
                "parva": "Case Study: Medical Data Re-identification",
                "sub_parva": "Application of Principle 1.6 & 2.5",
                "adhyaya": 5,
                "theme": "privacy_leakage_and_data_rights",
                "text_sanskrit_translit": "ACM Case Study: Data Anonymization Vulnerabilities in Public Datasets.",
                "text_english": "Historical context on re-identification of patients in anonymized datasets and engineer responsibility to halt disclosure."
            },
            "data": f"ACM Case Study - Data Anonymization:\n{p13[:700]}\n{p14[:700]}"
        })

        # 8. Page 16: Case Study 3 - Hostile Team Culture & Punitive Retaliation
        p16 = doc[16].get_text()
        chunks.append({
            "id": "acm-case-team-retaliation",
            "metadata": {
                "source": "ACM Case Studies",
                "parva": "Case Study: Hostile Retaliation in Engineering Teams",
                "sub_parva": "Application of Principle 1.4 & 3.3",
                "adhyaya": 5,
                "theme": "retaliation_and_psychological_safety",
                "text_sanskrit_translit": "ACM Case Study: Harassment, Silencing, and Punitive Action Against Engineers.",
                "text_english": "Analysis of leadership using intimidation and exclusion after technical disagreement or mistakes, violating ACM 1.4 and 3.3."
            },
            "data": f"ACM Case Study - Team Retaliation and Silencing:\n{p16[:1200]}"
        })

        # 9. Page 17: Case Study 4 - Corrupted Classification Model / Algorithmic Bias
        p17 = doc[17].get_text()
        chunks.append({
            "id": "acm-case-algorithmic-bias-blocker",
            "metadata": {
                "source": "ACM Case Studies",
                "parva": "Case Study: Corrupted Algorithmic Model",
                "sub_parva": "Application of Principle 1.4 & 2.5",
                "adhyaya": 5,
                "theme": "algorithmic_bias_and_adversarial_inputs",
                "text_sanskrit_translit": "ACM Case Study: Feedback Loop Exploits Corrupting Automated Decision Models.",
                "text_english": "Analysis of automated content filter whose feedback loop was poisoned to censor legitimate speech, requiring comprehensive audit."
            },
            "data": f"ACM Case Study - Corrupted Classifier / Blocker Plus:\n{p17[:1200]}"
        })

    except Exception as e:
        logger.error(f"Error parsing ACM PDF: {e}")

    return chunks

def get_complete_corpus() -> List[Dict[str, Any]]:
    # 1. Base Vidura Niti
    corpus = list(VIDURA_NITI_CORPUS)
    # 2. IEEE Ethics
    corpus.extend(IEEE_ETHICS_CORPUS)
    # 3. Dynamic extraction from ACM PDF
    pdf_paths = [
        "backend/data/acm_code_of_ethics.pdf",
        r"..\code-ethics\acm-code-of-ethics-booklet_removed.pdf",
        r"c:\Users\suraj\Projects\adm\code-ethics\acm-code-of-ethics-booklet_removed.pdf"
    ]
    acm_chunks = []
    for path in pdf_paths:
        if os.path.exists(path):
            acm_chunks = extract_acm_booklet_chunks(path)
            if acm_chunks:
                logger.info(f"Successfully extracted {len(acm_chunks)} chunks from ACM PDF: {path}")
                break

    corpus.extend(acm_chunks)
    return corpus

def upsert_corpus_to_upstash() -> Dict[str, Any]:
    """
    Upserts the unified Vidura Niti, IEEE, and ACM booklet corpus into Upstash Vector index.
    """
    url = f"{settings.UPSTASH_VECTOR_REST_URL.rstrip('/')}/upsert-data"
    headers = {
        "Authorization": f"Bearer {settings.UPSTASH_VECTOR_REST_TOKEN}",
        "Content-Type": "application/json"
    }

    corpus = get_complete_corpus()
    logger.info(f"Ingesting {len(corpus)} total chunks into Upstash Vector index...")
    
    success_count = 0
    errors = []

    batch_size = 5
    for i in range(0, len(corpus), batch_size):
        batch = corpus[i:i + batch_size]
        try:
            req_data = json.dumps(batch).encode("utf-8")
            req = urllib.request.Request(url, data=req_data, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                resp_text = resp.read().decode("utf-8")
                success_count += len(batch)
                logger.info(f"Batch {i//batch_size + 1} upserted successfully: {resp_text}")
        except Exception as e:
            logger.error(f"Failed upserting batch {i//batch_size + 1}: {e}")
            errors.append(str(e))

    return {
        "total": len(corpus),
        "successful": success_count,
        "errors": errors
    }

if __name__ == "__main__":
    result = upsert_corpus_to_upstash()
    print("Ingestion result with ACM booklet:", result)
