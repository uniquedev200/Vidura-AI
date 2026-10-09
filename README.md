# VIDURA-AI: ENTERPRISE MORAL GOVERNANCE & STRATEGIC DISSENT PLATFORM

Source-grounded decision-support engine bridging 3,000-year-old game-theoretic statecraft (*Vidura Nīti* from the Mahābhārata’s *Udyoga Parva*, Chapters 33–40) with modern engineering compliance standards (ACM & IEEE Codes of Ethics).

---

## Architecture Overview

```
                                [ Next.js 14+ Frontend ]
                          "Indic Cyber-Sabhā" Glassmorphic UI
                       /                                        \
  Landing Page (Sticky Scroll)                          Counsel Chamber (/console)
                       \                                        /
                                [ FastAPI Backend ]
                       /                 |                \
         [ Upstash Vector ]        [ Groq Cloud ]     [ Supabase PostgreSQL ]
      text-embedding-3-small     Sub-500ms Streaming    evaluation_logs & Telemetry
      BORI Vidura Nīti + ACM       Dual-Section SSE        RAGAS Benchmark Tracking
```

* **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide React, Canvas Confetti.
* **Backend:** FastAPI (Python 3.11+), Pydantic v2, Uvicorn, PyMuPDF, Tiktoken.
* **Vector Database & RAG:** Upstash Vector (`text-embedding-3-small`) co-indexing the verified BORI Critical Edition of *Vidura Nīti* with the ACM Code of Ethics and IEEE Code of Ethics.
* **LLM Engine:** Groq Cloud API streaming calibrated strategic counsel in the authoritative persona of Prime Minister Vidura.
* **Database & Telemetry:** Supabase (PostgreSQL 17) recording consultation telemetry, Likert evaluations, and RAGAS benchmark scores.

---

## Repository Structure

```text
vidura-ai/
├── backend/                  # FastAPI Application (Deploy on Render)
│   ├── app/
│   │   ├── api/              # Endpoints: /analyze, /evaluate, /history
│   │   ├── core/             # Configuration & Pydantic settings
│   │   ├── services/         # Ingest, RAG, & Groq client
│   │   ├── schemas/          # Data schemas
│   │   └── main.py           # FastAPI entrypoint
│   ├── data/                 # Source texts (Vidura Nīti, ACM booklet)
│   ├── Procfile              # Render deployment start command
│   ├── render.yaml           # Service configuration
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Environment variables template
├── frontend/                 # Next.js App Router (Deploy on Vercel)
│   ├── public/assets/        # High-res background image
│   ├── src/
│   │   ├── app/              # Routes: / (Landing) & /console (Counsel)
│   │   ├── components/
│   │   │   ├── landing/      # Hero, StickyScrollStory, ResearchGrounding
│   │   │   ├── console/      # ChatInterface, PillarRenderer, Citations
│   │   │   └── ui/           # DharmaChakra, DharmaScale
│   │   └── globals.css       # Indic Cyber-Sabhā theme styles
│   ├── package.json          # Node dependencies
│   └── .env.example          # Environment variables template
├── render.yaml               # Root Render blueprint
├── DEPLOYMENT.md             # Render & Vercel deployment instructions
└── .gitignore
```

---

## Deployment Quickstart

See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions.

* **Backend on Render:** Set Root Directory to `backend`, Build Command `pip install -r requirements.txt`, Start Command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
* **Frontend on Vercel:** Set Root Directory to `frontend`, Preset `Next.js`, environment variable `NEXT_PUBLIC_API_URL` pointing to the Render backend.

---

## Design System: "Indic Cyber-Sabhā"

* **Strict Zero-Emoji Enforcement:** Built exclusively with stylized Lucide icons, bespoke SVGs (`DharmaChakra`, `DharmaScale`), and typographic ornaments.
* **Color Palette:** Deep Obsidian Black (`#08090C`), Slate Void (`#0F1117`), Dark Indigo (`#141624`), Burnished Royal Gold (`#D4AF37`, `#F59E0B`), Mystic Amber (`#D97706`), Ethereal Cyan/Teal (`#06B6D4`, `#14B8A6`).
* **Dynamic Dharma Scale:** Mechanically tilts based on the assessed organizational risk severity.
