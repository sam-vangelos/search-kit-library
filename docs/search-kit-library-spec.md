# Search Kit Library: Team Boolean Sourcing Repository

**Product Vision Document — v2.0**
**Owner:** Sam Vangelos
**Last Updated:** January 2026

---

# Executive Summary

Search Kit Library is an internal tool where recruiters can generate, browse, search, and favorite role-specific boolean sourcing kits. It transforms the Boolean IDE (a prompt-based generation tool) into a persistent, searchable team resource.

**Core Value Proposition:** "Generate once, reuse forever. Stop rebuilding boolean strings from scratch."

**What Makes It Different:** AI-generated boolean kits organized by archetype patterns, stored as a team-wide library instead of individual files.

**Live URL:** https://search-kit-library.vercel.app

---

# Problem Statement

## The Boolean Rebuilding Problem

Every time a recruiter opens a new req:
- They build boolean strings from scratch (30-60 minutes)
- They forget what worked on similar roles last quarter
- They don't know what their teammates have already built
- Institutional knowledge lives in personal files or gets lost

## The Knowledge Sharing Gap

Boolean sourcing expertise is siloed:
- Senior sourcers have sophisticated strings they never share
- New hires reinvent the wheel repeatedly
- No way to learn from what's working across the team
- "What booleans did we use for the last ML Engineer role?" → Nobody knows

## Why Existing Tools Don't Solve This

| Tool | Limitation |
|------|------------|
| Google Docs/Sheets | Hard to search, no structure, messy over time |
| Notion | Still manual, no generation, no archetype organization |
| LinkedIn Saved Searches | Per-user, can't share, no boolean visibility |
| Boolean IDE (current) | Generates great output but no storage, no team access |

---

# User Stories

## Primary User: Sourcer

**Story 1: Reuse Existing Kit**
> "As a sourcer opening a new Backend Engineer req, I want to search if anyone on my team has already built a boolean kit for a similar role, so I can start from their work instead of from zero."

**Story 2: Generate New Kit**
> "As a sourcer with a new JD and intake notes, I want to generate a complete boolean sourcing kit with archetypes and organized clusters, so I have a systematic approach to the search."

**Story 3: Quick Copy**
> "As a sourcer actively sourcing, I want to click one button to copy a boolean cluster to my clipboard, so I can paste it directly into LinkedIn Recruiter."

## Secondary User: Recruiting Team Member

**Story 4: Browse for Inspiration**
> "As a recruiter who doesn't usually source, I want to browse existing kits to understand what boolean sourcing looks like, so I can help in a pinch or give better feedback to my sourcing partner."

**Story 5: Favorite Kits**
> "As a team member who works on recurring role types (e.g., always hiring ML Engineers), I want to favorite the kits I use most often, so I can find them instantly without searching."

---

# Core Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SEARCH KIT LIBRARY WORKFLOW                           │
└─────────────────────────────────────────────────────────────────────────────┘

FLOW 1: FIND EXISTING KIT
═════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│                              LIBRARY VIEW                                   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔍  "ML engineer reinforcement learning"                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  [All Kits]  [♡ My Favorites]                                              │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │ Frontier Data   │  │ ML Platform     │  │ Applied ML      │            │
│  │ Lead — RL       │  │ Engineer        │  │ Scientist       │            │
│  │                 │  │                 │  │                 │            │
│  │ 4 archetypes    │  │ 3 archetypes    │  │ 5 archetypes    │            │
│  │ Created: Jan 15 │  │ Created: Jan 10 │  │ Created: Dec 20 │            │
│  │ ♡               │  │ ♡               │  │ ○               │            │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼  Click kit
┌─────────────────────────────────────────────────────────────────────────────┐
│                              KIT DETAIL VIEW                                │
│                                                                             │
│  Frontier Data Lead — RL                                     [♡ Favorite]  │
│  Created by: Sam V. • Jan 15, 2026                                         │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ARCHETYPES                                                      [−] │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │ ▸ The Research-to-Production Bridge                                 │   │
│  │ ▸ The Simulation & Environment Builder                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ BLOCK 1: Core RL & Decision Making                              [−] │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  ▸ Concepts                                                         │   │
│  │  ▸ Methods                                                          │   │
│  │  ▸ Tools                                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Expanded Sub-block Example:                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ▾ Concepts                                                         │   │
│  │    ▸ Broad                                                          │   │
│  │    ▸ Established                                                    │   │
│  │    ▸ Recent                                                         │   │
│  │    ▾ Specific                                                       │   │
│  │      ┌─────────────────────────────────────────────────────────┐   │   │
│  │      │ ("PPO" OR "proximal policy optimization")         [Copy]│   │   │
│  │      └─────────────────────────────────────────────────────────┘   │   │
│  │      ┌─────────────────────────────────────────────────────────┐   │   │
│  │      │ ("TRPO" OR "trust region policy optimization")   [Copy]│   │   │
│  │      └─────────────────────────────────────────────────────────┘   │   │
│  │      ┌─────────────────────────────────────────────────────────┐   │   │
│  │      │ ("SAC" OR "soft actor-critic")                   [Copy]│   │   │
│  │      └─────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


FLOW 2: GENERATE NEW KIT
════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│                              GENERATE VIEW                                  │
│                                                                             │
│  Create New Search Kit                                                      │
│                                                                             │
│  Job Description *                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ [Paste JD here...]                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Intake Notes (optional)                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ [Add context from HM conversation...]                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Your Name *                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Sam Vangelos                                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                                    [Generate Search Kit]                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼  Submit
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LOADING STATE                                  │
│                                                                             │
│                         ◐ Generating your Search Kit...                     │
│                                                                             │
│                         Claude is analyzing your JD and building            │
│                         archetype-based boolean clusters.                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼  Complete
                              Redirect to Kit Detail
```

---

# Architectural Principles

## 1. JSON Storage, Dynamic Rendering

**Principle:** Store kits as structured JSON, render to HTML on demand.

**Why:**
- Enables search across kit contents (archetypes, clusters, terms)
- Future-proofs for format changes
- Smaller storage footprint than HTML
- Can render to different formats (web, PDF, etc.)

**Implication:** `kit_data` column is JSONB. React components traverse and render.

## 2. Email-Based Identity (No Auth)

**Principle:** Internal tool with no login. User identity via email address entered at generation time.

**Why:**
- Minimal friction for internal team
- Favorites work across devices (tied to email, not browser)
- No auth infrastructure to maintain
- Acceptable risk for internal, non-sensitive data

**Implication:** User enters email when generating or favoriting. Stored in `user_favorites.user_email`.

## 3. Generation via Edge Function

**Principle:** Claude API calls happen server-side, not in browser.

**Why:**
- API key stays secure
- Can handle prompt injection in JD input
- Consistent generation environment
- Rate limiting possible if needed

**Implication:** Supabase Edge Function wraps Claude API with prompt caching.

## 4. Read-Heavy, Write-Light

**Principle:** Optimize for browsing and searching, not for editing.

**Why:**
- Kits are generated once, read many times
- No edit/delete functionality (intentional — keeps library clean)
- Search and filter are the primary interactions

**Implication:** Client-side search for v1 (simpler). Move to Postgres full-text if scale demands.

## 5. Visual Consistency with Boolean IDE Output

**Principle:** Kit detail view should look identical to standalone HTML output.

**Why:**
- Users already know the format
- Validated UX from existing tool
- Dark theme matches team aesthetic

**Implication:** Port CSS from Boolean IDE. Component structure mirrors HTML structure.

## 6. Grouped Terms for Composability

**Principle:** Each specificity level contains 2-4 semantic groups, each as a separate copyable unit.

**Why:**
- Enables mix-and-match: grab just the concept groups you need
- Easier to scan than one giant parenthetical
- Modular editing: swap out one group without touching others
- Terms within groups are self-documenting (no labels needed in UI)

**Implication:** Clusters have a `groups` array. UI renders stacked text boxes without group labels.

---

# Data Model

## search_kits Table

```
SearchKit
├── id: uuid (PK)
├── role_title: text                    -- "Frontier Data Lead — RL"
├── company: text (nullable)            -- Optional context
├── created_at: timestamptz
├── created_by: text                    -- User name/email who generated
├── input_jd: text                      -- Raw job description input
├── input_intake: text (nullable)       -- Intake notes if provided
└── kit_data: jsonb                     -- Structured kit (see schema below)
```

## user_favorites Table

```
UserFavorite
├── id: uuid (PK)
├── user_email: text                    -- User's email address
├── search_kit_id: uuid (FK)
├── created_at: timestamptz
└── UNIQUE(user_email, search_kit_id)
```

## kit_data JSON Schema

```typescript
interface TermGroup {
  label: string;        // 1-4 word group name (not displayed in UI)
  terms: string;        // Boolean parenthetical: ("term1" OR "term2")
}

interface Cluster {
  label: "Broad" | "Established" | "Recent" | "Specific";
  groups: TermGroup[];  // 2-4 semantic groups per cluster
  terms?: string;       // Legacy: single string (deprecated)
}

interface SubBlock {
  type: "Concepts" | "Methods" | "Tools";
  clusters: Cluster[];  // Always 4: Broad, Established, Recent, Specific
}

interface Block {
  number: number;       // 1, 2, 3...
  title: string;        // "Core RL & Decision Making"
  sub_blocks: SubBlock[];
}

interface Archetype {
  name: string;         // "The Research-to-Production Bridge"
  summary: string;      // Brief description
  recipe: Array<{
    block: string;      // "Block 1"
    components: string; // "Methods (Established) + Tools (Recent)"
  }>;
  why: string;          // Why this archetype matters
}

interface SearchKit {
  version: "5.1";
  role_title: string;
  role_summary: string;
  role_details: {
    core_function: string;
    technical_domain: string;
    key_deliverables: string;
    stakeholders: string;
  };
  archetypes: Archetype[];  // 3-4 archetypes
  blocks: Block[];          // 4-6 blocks
}
```

---

# Integration Points

## Claude API (via Supabase Edge Function)

**Model:** Claude Opus 4.5 (`claude-opus-4-5-20251101`)

**Prompt Caching:** Enabled via `anthropic-beta: prompt-caching-2024-07-31` header. System prompt marked with `cache_control: { type: 'ephemeral' }`.

**Output:** Claude generates JSON directly (no HTML parsing needed)

**Max Tokens:** 16,000

**Cost:** ~$0.50-1.00 per kit generation (Opus pricing, reduced by prompt caching on repeat generations)

## Supabase

**Project:** `bnxshcanjdnpfjktvkvl`

**Tables:** `search_kits`, `user_favorites`

**Edge Function:** `generate-kit`

---

# Edge Function: /generate-kit

## Request
```typescript
POST /generate-kit
{
  role_title: string;     // Required: Role title
  input_jd: string;       // Required: Job description text
  input_intake?: string;  // Optional: Intake notes
  created_by: string;     // Required: User name/email
  company?: string;       // Optional: Company name
}
```

## Response
```typescript
{
  success: true;
  kit: SearchKit;         // The generated kit with id
}
```

## Implementation Flow

```
1. RECEIVE REQUEST
   └─▶ Validate inputs (role_title, input_jd, created_by required)

2. CONSTRUCT PROMPT
   └─▶ System prompt: Boolean IDE template v5.1 (cached)
   └─▶ User message: JD + intake notes

3. CALL CLAUDE
   └─▶ Model: claude-opus-4-5-20251101
   └─▶ Max tokens: 16000
   └─▶ Prompt caching enabled for system prompt

4. PARSE RESPONSE
   └─▶ Claude outputs JSON directly
   └─▶ Strip markdown code fences if present
   └─▶ Find balanced braces to extract JSON object
   └─▶ Validate structure (blocks array required)

5. STORE IN DATABASE
   └─▶ Insert into search_kits table
   └─▶ Return generated kit with id

6. RETURN TO CLIENT
   └─▶ { success: true, kit: SearchKit }
```

---

# Component Architecture

```
App
├── Layout
│   ├── Header (logo, nav, info modal trigger)
│   └── Main
│
├── Pages
│   ├── Library (default)
│   │   ├── SearchBar (max-width 400px, left-aligned)
│   │   ├── ViewToggle (All / Favorites)
│   │   └── KitGrid
│   │       └── KitCard (× n, fixed 140px height)
│   │
│   ├── KitDetail
│   │   ├── KitHeader (title, metadata, favorite button)
│   │   ├── ArchetypeSection
│   │   │   └── ArchetypeAccordion (× n, collapsed by default)
│   │   └── BlockSection (× n)
│   │       └── SubBlockSection (× n, collapsible)
│   │           └── CollapsibleCluster (× n, collapsed by default)
│   │               └── ClusterRow
│   │                   └── TermsBox (× n, stacked, with copy button)
│   │
│   └── Generate
│       ├── JdInput (textarea)
│       ├── IntakeInput (textarea)
│       ├── NameInput (text)
│       ├── SubmitButton
│       └── LoadingState
│
└── Shared
    ├── FavoriteButton
    ├── CopyButton
    ├── InfoModal (glossary/help)
    └── EmptyState
```

## Key Component States

| Component | States |
|-----------|--------|
| KitCard | default, hover, favorited |
| FavoriteButton | unfavorited (○), favorited (♡), loading |
| CopyButton | default, copied (checkmark, 1.5s) |
| TermsBox | collapsed (truncated), expanded (full text) |
| CollapsibleCluster | collapsed (default), expanded |
| SubBlockSection | collapsed (default), expanded |
| ArchetypeAccordion | collapsed (default), expanded |
| Generate form | idle, loading, error, success |

## UI Hierarchy (Collapsed by Default)

```
Block 1: Post-Training & RL Fine-tuning
  ▸ Concepts (3 clusters)
  ▸ Methods (3 clusters)
  ▸ Tools (3 clusters)

Expanded:
Block 1: Post-Training & RL Fine-tuning
  ▾ Concepts
    ▸ Broad
    ▸ Established
    ▸ Recent
    ▾ Specific
      ┌────────────────────────────────────┐
      │ ("PPO" OR "proximal policy...")    │ [Copy]
      └────────────────────────────────────┘
      ┌────────────────────────────────────┐
      │ ("TRPO" OR "trust region...")      │ [Copy]
      └────────────────────────────────────┘
```

---

# Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Edge Functions | Supabase Edge Functions (Deno) |
| AI | Claude Opus 4.5 via Anthropic API |
| Hosting | Vercel |

---

# Cost Estimates

## Per-Kit Generation Costs

| Operation | Token Estimate | Cost (Claude Opus) |
|-----------|---------------|-------------------|
| Prompt (system + JD) | ~8,000 tokens input | ~$0.40 |
| Output (full kit JSON) | ~6,000 tokens output | ~$0.60 |
| **Total per kit** | | **~$1.00** |

*Note: Prompt caching reduces input costs on subsequent generations.*

## At Scale

| Volume | Cost per Year |
|--------|---------------|
| 50 kits/year | ~$50 |
| 200 kits/year | ~$200 |
| 500 kits/year | ~$500 |

## Infrastructure Costs

| Component | Cost |
|-----------|------|
| Supabase (database) | $0 (free tier) |
| Vercel (hosting) | $0 (hobby tier) |
| **Total infrastructure** | **$0/month** |

---

# Deployment Status

**Status:** Live

**URL:** https://search-kit-library.vercel.app

**Supabase Project:** `bnxshcanjdnpfjktvkvl`

### Completed
- [x] Create `search_kits` table
- [x] Create `user_favorites` table
- [x] Deploy Edge Function `/generate-kit`
- [x] Add `ANTHROPIC_API_KEY` to Edge Function secrets
- [x] Connect Vercel to GitHub repo
- [x] Add environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- [x] Auto-deploy from `main` branch

---

# Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Kits generated | 20+ in first month | Count in database |
| Kit reuse | 50% of sourcing sessions start with library search | Self-reported / survey |
| Time to first string | <2 minutes from library visit to copied string | Observation |
| Team coverage | 80% of sourcers have used library | Distinct `created_by` count |

---

# Key Decisions

| Decision | Date | Context |
|----------|------|---------|
| Grouped parentheticals over monolithic strings | Jan 2026 | Better composability - users can copy individual concept clusters |
| Remove group labels from UI | Jan 2026 | Terms are self-documenting, labels added clutter |
| Use Opus 4.5 with prompt caching | Jan 2026 | Quality + speed for generation |
| Email-based favorites (not localStorage UUID) | Jan 2026 | Works across devices |
| Specificity levels collapsed by default | Jan 2026 | Reduce visual noise, expand on demand |
| Claude outputs JSON directly | Jan 2026 | Simpler than HTML parsing, more reliable |

---

*Document version: 2.0*
*Created: January 2026*
*Purpose: Product vision and architectural principles*
