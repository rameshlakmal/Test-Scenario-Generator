<div align="center">

<br/>

<img src="https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge&labelColor=1a1a2e" alt="AI Powered"/>

# AI Test Case Generator

### From requirements to production-ready test cases — in seconds, not hours.

<br/>

[![Node.js](https://img.shields.io/badge/Node.js_18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MUI](https://img.shields.io/badge/MUI_6-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

<br/>

**OpenAI** &nbsp;·&nbsp; **Anthropic Claude** &nbsp;·&nbsp; **Google Gemini** &nbsp;·&nbsp; **Jira Import** &nbsp;·&nbsp; **AIO Tests Export**

---

**12 QA techniques** &nbsp;&nbsp;|&nbsp;&nbsp; **Parallel AI generation** &nbsp;&nbsp;|&nbsp;&nbsp; **Smart deduplication** &nbsp;&nbsp;|&nbsp;&nbsp; **Visual technique diagrams**

<br/>

</div>

## Overview

A skills-driven test case generation platform that uses AI to analyze software requirements and produce structured, high-quality test scenarios. It mirrors how a senior QA engineer thinks — analyze first, then apply the right testing techniques.

<br/>

<div align="center">

### 3-Step Wizard Flow

</div>

```
    ╔══════════════════════╗       ╔══════════════════════╗       ╔══════════════════════╗
    ║                      ║       ║                      ║       ║                      ║
    ║   1. REQUIREMENTS    ║ ────► ║     2. ANALYZE       ║ ────► ║     3. RESULTS       ║
    ║                      ║       ║                      ║       ║                      ║
    ╠══════════════════════╣       ╠══════════════════════╣       ╠══════════════════════╣
    ║                      ║       ║                      ║       ║                      ║
    ║  • Paste text        ║       ║  • AI analyzes req   ║       ║  • Structured test   ║
    ║  • Upload file       ║       ║  • Extracts testable ║       ║    cases with steps  ║
    ║    (PDF/DOCX/MD/TXT) ║       ║    elements          ║       ║  • Technique diagrams║
    ║  • Import from Jira  ║       ║  • Recommends QA     ║       ║  • Filter & search   ║
    ║  • Select AI provider║       ║    techniques        ║       ║  • Export JSON/CSV   ║
    ║  • Clarify (optional)║       ║  • Toggle techniques ║       ║  • Push to AIO Tests ║
    ║                      ║       ║  • Select diagrams   ║       ║                      ║
    ╚══════════════════════╝       ╚══════════════════════╝       ╚══════════════════════╝
```

---

## How It Works — The AI Pipeline

The generator uses a multi-stage pipeline with parallel LLM calls for maximum coverage and quality.

```
  ┌─────────────────────────────────────────────────────────────────────────────────────┐
  │                              AI TEST GENERATION PIPELINE                             │
  └─────────────────────────────────────────────────────────────────────────────────────┘

  STAGE 1 — ANALYZE                          STAGE 2 — GENERATE (Parallel)
  ┌─────────────────────────┐                ┌─────────────────────────────────────────┐
  │                         │                │                                         │
  │  POST /api/analyze      │                │  POST /api/generate-tests               │
  │                         │                │                                         │
  │  ┌───────────────────┐  │                │  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
  │  │ Extract testable  │  │                │  │Boundary │ │ State   │ │ Error   │   │
  │  │ elements (inputs, │  │    ┌──────┐    │  │ Value   │ │Transiti-│ │Guessing │   │
  │  │ states, rules,    │──┼──►│ Pick │───►│  │Analysis │ │  on     │ │Heurist- │   │
  │  │ boundaries)       │  │    │Skills│    │  │         │ │         │ │  ics    │   │
  │  └───────────────────┘  │    └──────┘    │  └────┬────┘ └────┬────┘ └────┬────┘   │
  │                         │                │       │           │           │         │
  │  ┌───────────────────┐  │                │       └───────────┼───────────┘         │
  │  │ Recommend skills  │  │                │                   ▼                     │
  │  │ with confidence   │  │                │          ┌─────────────────┐             │
  │  │ (high/med/low)    │  │                │          │  MERGE + DEDUP  │             │
  │  └───────────────────┘  │                │          │                 │             │
  │                         │                │          │  Weighted Jaccard│             │
  │  ┌───────────────────┐  │                │          │  (threshold 60%)│             │
  │  │ Assess complexity │  │                │          └────────┬────────┘             │
  │  │ (simple/moderate/ │  │                │                   │                     │
  │  │  complex)         │  │                │                   ▼                     │
  │  └───────────────────┘  │                │         ┌──────────────────┐             │
  │                         │                │         │  FINAL TEST SUITE│             │
  └─────────────────────────┘                │         └──────────────────┘             │
                                             └─────────────────────────────────────────┘

  DEDUP WEIGHTS:  Title 40%  ·  Steps 40%  ·  Expected Result 20%
  CONCURRENCY:    Max 3 parallel LLM calls
```

---

## Features at a Glance

```
  ┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
  │  🤖 MULTI-PROVIDER AI    │  │  📋 12 QA SKILL PLAYBOOKS│  │  📊 TECHNIQUE DIAGRAMS   │
  │                          │  │                          │  │                          │
  │  Switch between OpenAI,  │  │  Expert-curated markdown │  │  Mermaid.js visuals show │
  │  Claude, or Gemini from  │  │  guides that teach the   │  │  how each technique      │
  │  a single dropdown.      │  │  AI how to test.         │  │  applies to your input.  │
  ├──────────────────────────┤  ├──────────────────────────┤  ├──────────────────────────┤
  │  🔄 JIRA IMPORT          │  │  ⚡ PARALLEL GENERATION  │  │  🧹 SMART DEDUP          │
  │                          │  │                          │  │                          │
  │  Browse projects, epics, │  │  Each skill runs as a    │  │  Weighted Jaccard removes│
  │  sprints — pull stories  │  │  focused LLM call for    │  │  near-duplicate cases    │
  │  directly into the tool. │  │  deeper, richer output.  │  │  across techniques.      │
  ├──────────────────────────┤  ├──────────────────────────┤  ├──────────────────────────┤
  │  📤 AIO TESTS EXPORT     │  │  📎 FILE UPLOAD          │  │  🔒 SECURE BY DEFAULT    │
  │                          │  │                          │  │                          │
  │  Push test cases with    │  │  PDF, DOCX, Markdown,    │  │  JWT auth, Helmet, rate  │
  │  folders, priorities,    │  │  TXT, HTML — parsed      │  │  limiting, CORS control. │
  │  and coverage tags.      │  │  server-side.            │  │                          │
  └──────────────────────────┘  └──────────────────────────┘  └──────────────────────────┘
```

---

## QA Skills Library

12 expert playbooks in `skills/` that guide the AI like a test design handbook:

| # | Skill | What It Targets |
|---|-------|----------------|
| 1 | **Equivalence Partitioning** | Input domain classes — valid & invalid partitions |
| 2 | **Boundary Value Analysis** | Off-by-one, limits, edges of input ranges |
| 3 | **Decision Tables** | Complex business rules with multiple conditions |
| 4 | **State Transition** | Stateful workflows, lifecycle transitions |
| 5 | **Pairwise / Combinatorial** | Multi-parameter interactions, config combinations |
| 6 | **Error Guessing & Heuristics** | Common failure modes, past-bug patterns |
| 7 | **Risk-Based Prioritization** | High-impact, high-likelihood scenarios first |
| 8 | **Requirements Traceability** | Full requirement-to-test coverage mapping |
| 9 | **Feature Decomposition** | Breaking features into atomic testable units |
| 10 | **Functional Core** | Core happy-path and business logic validation |
| 11 | **Non-Functional Baseline** | Performance, security, usability baselines |
| 12 | **General Fallback** | Catch-all baseline — always included |

---

## Test Depth Modes

Control breadth vs. speed:

```
  ┌──────────────────────────────────────────────────────────────────────┐
  │                                                                      │
  │   SMOKE ─────────────── STANDARD ─────────────── DEEP               │
  │   Max 30 cases          Max 120 cases            Max 220 cases      │
  │   Quick sanity,         Sprint-level             Full regression,   │
  │   CI gates              coverage                 compliance audits  │
  │                                                                      │
  └──────────────────────────────────────────────────────────────────────┘
```

---

## Test Case Output

Each generated test case is structured and atomic:

```json
{
  "id": "TC-001",
  "title": "Verify that login fails with invalid password",
  "type": "negative",
  "priority": "P0",
  "preconditions": ["User has a registered account"],
  "steps": [
    "Navigate to login page",
    "Enter valid email",
    "Enter invalid password",
    "Click Sign In"
  ],
  "expected": [
    "Error message: 'Invalid credentials'",
    "User remains on login page"
  ],
  "coverageTags": ["authentication", "boundary-value-analysis"],
  "requirementRefs": ["REQ-001"]
}
```

**Types:** `functional` · `negative` · `boundary` · `security` · `accessibility` · `performance` · `usability` · `compatibility` · `resilience`

**Priorities:** `P0` Critical · `P1` High · `P2` Medium · `P3` Low

---

## Technique Diagrams

Optional Mermaid.js diagrams visualize how each technique applies to your requirement:

| Technique | Diagram Type | Visualization |
|-----------|-------------|---------------|
| State Transition | `stateDiagram-v2` | State machines with transitions |
| Decision Tables | `flowchart TD` | Decision flows with condition branches |
| Equivalence Partitioning | `flowchart LR` | Partition ranges and classes |
| Boundary Value Analysis | `flowchart LR` | Boundary points on value ranges |
| Pairwise / Combinatorial | `flowchart TD` | Combination trees |
| Feature Decomposition | `mindmap` | Feature hierarchy maps |

Diagrams are opt-in per technique — no extra tokens consumed when not selected.

---

## Available AI Models

Selectable from the UI dropdown:

| Provider | Default Model | Other Options |
|----------|--------------|---------------|
| **OpenAI** | GPT-4.1 | GPT-4.1 Mini, GPT-4.1 Nano, GPT-4o, GPT-4o Mini |
| **Anthropic** | Claude Sonnet 4.5 | Claude Haiku 3.5 |
| **Gemini** | Gemini 2.5 Flash | Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash |

---

## Quick Start

### Prerequisites

- **Node.js 18+** (20+ recommended)
- An API key for at least one provider:
  [OpenAI](https://platform.openai.com/api-keys) · [Anthropic](https://console.anthropic.com/settings/keys) · [Google AI Studio](https://aistudio.google.com/apikey)

### Install & Run

```bash
# Clone
git clone https://github.com/rameshlakmal/Test-Scenario-Generator.git
cd Test-Scenario-Generator

# Install dependencies
npm install && cd client && npm install && cd ..

# Configure
cp .env.example .env
# Edit .env — add at least one API key

# Start (server + client with hot reload)
npm run dev
```

Open **http://localhost:5173** and start generating.

---

## Configuration

All settings live in `.env`:

| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_PROVIDER` | `openai` | Active provider: `openai`, `anthropic`, or `gemini` |
| `OPENAI_API_KEY` | — | OpenAI API key |
| `ANTHROPIC_API_KEY` | — | Anthropic API key |
| `GEMINI_API_KEY` | — | Google Gemini API key |
| `PORT` | `3001` | Server port |
| `MAX_UPLOAD_MB` | `2` | Max file upload size (MB) |
| `MAX_TEST_CASES` | `160` | Hard cap on generated test cases |
| `LLM_TIMEOUT_MS` | `45000` | LLM request timeout (ms) |
| `RATE_LIMIT_PER_MINUTE` | `90` | API rate limit per minute |
| `CORS_ORIGINS` | `localhost:5173` | Allowed origins (comma-separated or `*`) |

<details>
<summary><strong>Jira Integration (Optional)</strong></summary>

```env
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=you@company.com
JIRA_API_TOKEN=your-token
```

Enables the **Import from Jira** tab in Step 1 — browse projects, epics, sprints, and pull user stories directly.

</details>

<details>
<summary><strong>AIO Tests Export (Optional)</strong></summary>

```env
AIO_BASE_URL=https://tcms.aiojiraapps.com/aio-tcms
AIO_TOKEN=your-token
```

Push generated test cases to [AIO Tests](https://marketplace.atlassian.com/apps/1222843) with auto-created folder hierarchies, priority mapping, and coverage tags.

</details>

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/skills` | List loaded QA skills |
| `POST` | `/api/preflight` | Identify ambiguities before generation |
| `POST` | `/api/analyze` | Analyze requirement, recommend techniques |
| `POST` | `/api/generate-tests` | Generate test suite (per-skill parallel) |
| `GET` | `/api/jira/projects` | List Jira projects |
| `GET` | `/api/jira/stories` | Search stories with filters |
| `POST` | `/api/jira/story-details` | Fetch full story details |
| `POST` | `/api/aio/push` | Export test cases to AIO Tests |

> All routes except `/api/health` and `/api/auth/*` require JWT authentication.

---

## Project Structure

```
test-generator/
│
├── server/                         ← Express.js backend (CommonJS)
│   ├── index.js                    # Routes, orchestration, main entry
│   ├── prompt.js                   # Prompt builders (analysis, per-skill, legacy, preflight)
│   ├── schema.js                   # JSON schemas for validation (Ajv)
│   ├── util.js                     # JSON parsing, dedup, suite merging
│   ├── selectSkills.js             # Keyword-based skill selection (fallback)
│   ├── skills.js                   # Skill loader (parses markdown playbooks)
│   ├── auth.js                     # JWT authentication routes
│   ├── authMiddleware.js           # Route protection middleware
│   ├── jira.js                     # Jira Cloud API integration
│   ├── aio.js                      # AIO Tests export
│   └── llm/
│       ├── index.js                # Provider router
│       ├── openai.js               # OpenAI adapter
│       ├── anthropic.js            # Anthropic Claude adapter
│       └── gemini.js               # Google Gemini adapter
│
├── client/                         ← React + Vite SPA (ESM)
│   └── src/
│       ├── App.jsx                 # Main shell, state, stepper orchestration
│       ├── StepRequirements.jsx    # Step 1: input, provider, Jira import
│       ├── StepAnalyze.jsx         # Step 2: analysis, technique selection
│       ├── StepResults.jsx         # Step 3: results, filters, export
│       ├── DiagramDialog.jsx       # Fullscreen Mermaid diagram viewer
│       ├── MermaidDiagram.jsx      # Mermaid.js renderer
│       ├── helpers.jsx             # Shared utility components
│       └── theme.js                # Theme constants, model options
│
├── skills/                         ← 12 QA technique playbooks (.md)
│   ├── boundary-value-analysis.md
│   ├── equivalence-partitioning.md
│   ├── decision-tables.md
│   ├── state-transition.md
│   └── ...
│
├── web/                            ← Static files served by Express
├── .env.example                    # Environment variable template
└── package.json
```

---

## Deployment

<details>
<summary><strong>Production Build</strong></summary>

```bash
cd client && npm run build && cp -r dist/* ../web/ && cd ..
node server/index.js
```

Everything served from `http://localhost:3001`.

</details>

<details>
<summary><strong>PM2 (VPS)</strong></summary>

```bash
npm install -g pm2
pm2 start server/index.js --name test-generator
pm2 save && pm2 startup
```

</details>

<details>
<summary><strong>Cloud Platforms (Railway, Render, Fly.io)</strong></summary>

- **Build:** `cd client && npm install && npm run build && cp -r dist/* ../web/ && cd .. && npm install`
- **Start:** `node server/index.js`
- **Env vars:** Set via platform dashboard

</details>

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Express.js 5, Node.js 18+, Ajv, JWT, Helmet |
| **Frontend** | React 19, Material UI 6, Vite 7 |
| **Diagrams** | Mermaid.js 11 |
| **AI Providers** | OpenAI, Anthropic Claude, Google Gemini |
| **Integrations** | Jira Cloud REST API, AIO Tests TCMS |
| **File Parsing** | pdf-parse, mammoth (DOCX), cheerio (HTML) |
| **Theme** | MUI dark theme with violet accent (`#a78bfa`) |

---

<div align="center">

<br/>

**Built so QA engineers can focus on thinking, not typing.**

<br/>

*Star the repo if this saves you time.*

</div>
