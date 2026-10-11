# Vidura-AI Design System: Indic Cyber-Sabhā & Archival Statecraft

## 1. Design Direction & Read
- **Archetype**: Archival Statecraft & Fiduciary Governance Console (*Indic Cyber-Sabhā*)
- **Design Read**: An obsidian-and-brass nocturnal council chamber where modern engineering compliance dilemmas are weighed against verbatim 1890 *Udyoga Parva* manuscript folios and statutory ACM/IEEE clauses.
- **Dials**: `Dial: ENERGY 2 / RHYTHM 3 / MOTION 2`
  - **ENERGY 2 (Measured)**: High-stakes whistleblowing and ethics deliberation require calm, unhurried typographic authority rather than hyper-saturated SaaS marketing energy.
  - **RHYTHM 3 (Dynamic)**: Each section uses a distinct structural geometry (Asymmetric 7:5 Split Hero, Interactive 5:7 Case Ledger, Full-Width Comparative Matrix with 7:5 Provenance Split, and 4-Stage Pipeline Specification) so no two adjacent sections repeat the same card layout.
  - **MOTION 2 (Restrained)**: Animation is strictly functional, reserved for physical 3D manuscript leaf turning, drawer transitions, and active streaming indicators, with zero infinite decorative pulse loops on idle elements.

---

## 2. Color System & Contrast Verification (WCAG AA)
Every visual token is selected with a one-line architectural rationale (R-31) and verified against WCAG AA (`4.5:1` body text, `3.0:1` large text and UI components).

| Token Role | Hex | Usage & One-Line Rationale | Contrast Ratio |
| :--- | :--- | :--- | :--- |
| **Primary Canvas** | `#08090C` | Deep obsidian background anchors the nocturnal *Prajāgara* (sleepless night of counsel) setting and prevents eye strain during long reading sessions. | Base surface |
| **Elevated Panel** | `#0F1117` | Solid slate surface separates structured deliberation records and input forms from the canvas without relying on overused backdrop blur. | `1.12:1` vs `#08090C` (bounded by `1px` structural borders) |
| **Recessed Ledger** | `#050608` | Deep ink well for verbatim code blocks, executive memos, and parameter inputs to signal editable or copyable artifacts. | Base recessed surface |
| **Manuscript Vellum** | `#EADBC0` | Authentic aged paper tone for the 3D *Udyoga Parva* codex spread, matching 19th-century Sanskrit-English archival prints. | `11.4:1` with `#2B1A04` ink |
| **Primary Heading Text** | `#F3F4F6` | Crisp warm alabaster for primary serif titles and high-priority data readouts on obsidian and slate surfaces. | `17.6:1` on `#08090C`, `15.7:1` on `#0F1117` (AAA) |
| **Body Prose Text** | `#CBD5E1` | Balanced slate-silver for multi-paragraph ethical analysis, avoiding harsh pure-white halation on dark surfaces. | `12.8:1` on `#08090C`, `11.4:1` on `#0F1117` (AAA) |
| **Metadata & Labels** | `#94A3B8` | Muted architectural slate for monospace clause indices, folio numbers, and table headers while maintaining full AA legibility. | `6.7:1` on `#08090C`, `6.0:1` on `#0F1117` (AA) |
| **Primary Accent (Burnished Gold)** | `#D4AF37` / `#F59E0B` | Single brand accent representing royal *Sabhā* seals, primary interactive triggers, focus rings, and illuminated manuscript verses. | `9.8:1` on `#08090C`, `10.2:1` with `#08090C` text on `#F59E0B` CTA (AAA) |
| **Semantic Status: Verified** | `#34D399` | Signals cryptographically or philologically verified corpus matches and completed evaluations. | `10.1:1` on `#08090C` (AAA) |
| **Semantic Status: Hazard** | `#F87171` | Signals critical statutory or safety violations (ACM 1.2 / IEEE 1.1) and high-retaliation risk parameters. | `6.8:1` on `#08090C` (AA) |

---

## 3. Typography & Hierarchy
- **Display & Headings (`--font-serif`: `Cinzel`)**: Classical inscribed serif proportions evoke royal edicts and canonical Sanskrit *Adhyāya* headings; used for `h1`–`h3` and manuscript headers.
- **Body & Analytical Prose (`--font-sans`: `Plus Jakarta Sans`)**: High-x-height humanist sans-serif ensures effortless legibility across dense tables, spoken dialogue scripts, and compliance evaluations.
- **Telemetry & Statutory Indices (`--font-mono`: `JetBrains Mono`)**: Fixed-width technical type for shloka coordinates (`§ 33.16`), folio numbers (`Folio 111`), cosine similarity scores (`0.942`), and ACM/IEEE clause identifiers.

---

## 4. Surface, Radius, and Dose Caps
- **Glassmorphism Dose Cap (Max 2 Elements)**: `backdrop-filter: blur(12px)` is restricted exclusively to the sticky top navigation bar and modal/drawer overlays. All cards, tables, and form containers use solid `#0F1117` / `#13161F` architectural surfaces with `1px` borders.
- **Glow Dose Cap (Max 1 Element)**: Decorative neon shadows and blurred background orbs are prohibited. Subtle gold illumination (`mark.manuscript-glow`) is reserved strictly for the verified shloka locus inside the 3D Ancient Manuscript Book Viewer.
- **Architectural Border Radius Hierarchy**:
  - `rounded-lg` (`8px`): Primary ledger containers, comparison matrices, and the manuscript binding board.
  - `rounded-md` (`6px`): Form inputs, action buttons, and step triggers.
  - `rounded-sm` (`2px–4px`): Archival clause badges and paper folios.
