# Sourcing Copilot: Collaborative Sourcing with Institutional Memory

**Product Vision Document — v0.1 (Draft)**
**Owner:** Sam Vangelos
**Status:** Ideation / Parked
**Last Updated:** January 2026

---

# Executive Summary

Sourcing Copilot is an async collaboration tool for recruiters and hiring managers that captures sourcing feedback as training data, building domain-specific models (DSMs) that encode institutional knowledge about candidate quality.

**Core Insight:** Every HM yes/no rating is a labeled example. Every comment ("not senior enough", "wrong domain background") is a feature label. Over time, this feedback accumulates into implicit models of "what good looks like" for specific roles, departments, and levels.

**Core Value Proposition:** "Your sourcing gets smarter with every hire."

**What Makes It Different:** Unlike one-off sourcing, feedback loops back into future searches. Unlike fine-tuning, it's cheap, interpretable, and works with small data.

---

# Problem Statement

## The Sourcing Feedback Black Hole

When a recruiter sources candidates and an HM reviews them:
- HM says yes/no, maybe leaves a comment
- That feedback lives in Slack, email, or Greenhouse notes
- Next time a similar role opens, recruiter starts from scratch
- Institutional knowledge about "what good looks like" never accumulates

## The Calibration Drift Problem

Even within a single search:
- Initial intake captures HM preferences
- Calibration session refines criteria
- But preferences evolve as HM sees real candidates
- Recruiter can't keep up with shifting mental model

## The Analytics Gap

HMs and department leaders have no self-serve visibility into:
- Pipeline health for their roles
- Source effectiveness for their department
- Time-in-stage patterns
- Historical hiring patterns they could learn from

---

# User Stories

## Primary User: Recruiter

**Story 1: Smart Sourcing**
> "As a recruiter opening a new Senior ML Engineer role, I want the system to show me what past HMs liked and disliked for similar roles, so I can source more precisely from day one."

**Story 2: Calibration Capture**
> "As a recruiter in a calibration session, I want to easily capture HM feedback on sample candidates, so the model improves and I don't have to remember everything manually."

**Story 3: Pattern Recognition**
> "As a recruiter, I want to see which candidate attributes correlate with HM approval across my portfolio, so I can refine my sourcing strategy."

## Secondary User: Hiring Manager

**Story 4: Async Review**
> "As an HM, I want to review sourced candidates on my own time with simple yes/no + comments, so I'm not blocked on sync meetings."

**Story 5: Self-Serve Analytics**
> "As an HM, I want to see pipeline status and basic metrics for my open roles without asking recruiting, so I can plan my time."

**Story 6: Preference Persistence**
> "As an HM who hires the same role type repeatedly, I want my past feedback to inform future searches, so recruiters don't have to re-learn my preferences."

## Tertiary User: Department Leader

**Story 7: Department View**
> "As an Engineering Director, I want to see aggregate hiring metrics across my teams, so I can identify bottlenecks and calibrate expectations."

---

# Core Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SOURCING COPILOT WORKFLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: INTAKE
═══════════════
Recruiter creates search from JD + HM conversation

┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│   JD + INTAKE   │────▶│   INITIAL CRITERIA   │────▶│  SEARCH CREATED     │
│   NOTES         │     │                      │     │  Status: Searching  │
│                 │     │ • Must-haves         │     │                     │
│                 │     │ • Nice-to-haves      │     │  DSM: Empty         │
│                 │     │ • Red flags          │     │  (no examples yet)  │
└─────────────────┘     └──────────────────────┘     └─────────────────────┘


PHASE 2: CALIBRATION
════════════════════
HM reviews sample candidates, provides structured feedback

┌─────────────────────────────────────────────────────────────────────────────┐
│                         CALIBRATION SESSION                                 │
│                                                                             │
│  Candidate 1: Jane Chen (ex-Google, 6 YOE)                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [✓ Yes]  [✗ No]  [? Maybe]                                         │   │
│  │                                                                     │   │
│  │  What stood out? (positive)                                         │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ Strong distributed systems background, led a team           │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  Concerns? (negative)                                               │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ Mostly big company experience, might struggle with ambiguity│   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Candidate 2: Marcus Johnson (startup, 4 YOE)                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  [✓ Yes]  [✗ No]  [? Maybe]                                         │   │
│  │  ...                                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  After 5-8 candidates reviewed:                                            │
│  → DSM now has few-shot examples                                           │
│  → Status changes to "Calibrating" → "Reviewing"                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


PHASE 3: REVIEW (Async, Ongoing)
════════════════════════════════
HM reviews candidates on their own time, model improves incrementally

┌─────────────────────────────────────────────────────────────────────────────┐
│                          ASYNC REVIEW QUEUE                                 │
│                                                                             │
│  3 new candidates to review                     [View All] [Settings]      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Sarah Kim                                                          │   │
│  │  Staff Engineer @ Stripe • 8 YOE • ML + Infra                      │   │
│  │                                                                     │   │
│  │  Model Confidence: 87% match                                        │   │
│  │  Key signals: Leadership ✓, Scale experience ✓, Startup exp ✗      │   │
│  │                                                                     │   │
│  │  [✓ Interested]  [✗ Pass]  [View Profile]  [View Resume]           │   │
│  │                                                                     │   │
│  │  Add comment (optional):                                            │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                                                             │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Each rating + comment → stored as training example                        │
│  DSM improves incrementally                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


PHASE 4: INTERVIEWING
═════════════════════
Approved candidates move to interview stage (Greenhouse workflow)

┌─────────────────────────────────────────────────────────────────────────────┐
│  Candidates who receive "Interested" → pushed to Greenhouse pipeline       │
│  Sourcing Copilot hands off; Pipeline Tracker takes over                   │
└─────────────────────────────────────────────────────────────────────────────┘


THE LEARNING LOOP
═════════════════

    ┌────────────────────────────────────────────────────────────────┐
    │                                                                │
    ▼                                                                │
┌────────┐    ┌─────────────┐    ┌────────────┐    ┌─────────────┐  │
│ Source │───▶│ HM Reviews  │───▶│ Store as   │───▶│ Improve DSM │──┘
│Candidates│   │ (yes/no +   │    │ Training   │    │ (retrieve   │
│         │    │  comments)  │    │ Example    │    │  for next   │
└────────┘    └─────────────┘    └────────────┘    │  candidate) │
                                                   └─────────────┘

Over time:
• Role-specific preferences emerge ("for ML roles, HMs prefer...")
• Department patterns surface ("Engineering likes startup exp...")
• Level calibration stabilizes ("Senior means 6+ YOE here...")
• Individual HM preferences persist across searches
```

---

# The Domain-Specific Model (DSM)

## What It Is

A DSM is **not** a fine-tuned model. It's a retrieval + few-shot system:

1. **Example Bank**: Database of past HM feedback (candidate profile + rating + comments)
2. **Retrieval**: When scoring a new candidate, retrieve similar past examples
3. **Few-Shot Prompt**: Inject relevant examples into Claude prompt
4. **Scoring**: Model predicts HM reaction based on patterns in examples

## Why Not Fine-Tuning?

| Aspect | Fine-Tuning | DSM (Few-Shot + Retrieval) |
|--------|-------------|---------------------------|
| Data required | Thousands of examples | Dozens work fine |
| Cost | $1K-$100K+ | Just token costs |
| Iteration speed | Weeks to retrain | Instant (add examples) |
| Interpretability | Black box | Can show which examples influenced decision |
| Maintenance | Model versioning, hosting | Just a database |
| Overfitting risk | High with small/noisy data | Low (examples are context, not weights) |

## DSM Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DSM COMPONENTS                                 │
└─────────────────────────────────────────────────────────────────────────────┘

1. EXAMPLE STORE (Supabase)
───────────────────────────
┌─────────────────────────────────────────────────────────────────────────────┐
│ sourcing_examples                                                           │
│ ├── id                                                                      │
│ ├── search_id (FK)                    -- which search this came from       │
│ ├── candidate_id (FK)                 -- link to candidate profile         │
│ ├── candidate_snapshot: jsonb         -- profile at time of review         │
│ │   ├── title, company, yoe                                                │
│ │   ├── skills, industries                                                 │
│ │   └── education, etc.                                                    │
│ ├── rating: enum                      -- 'yes', 'no', 'maybe'              │
│ ├── positive_signals: text            -- what HM liked                     │
│ ├── negative_signals: text            -- concerns                          │
│ ├── reviewer_id (FK)                  -- which HM                          │
│ ├── review_phase: enum                -- 'calibration', 'review'           │
│ └── created_at                                                              │
└─────────────────────────────────────────────────────────────────────────────┘


2. SEARCH CONTEXT (Supabase)
────────────────────────────
┌─────────────────────────────────────────────────────────────────────────────┐
│ searches                                                                    │
│ ├── id                                                                      │
│ ├── role_id (FK)                      -- link to Pipeline Tracker role    │
│ ├── role_title                                                              │
│ ├── department                                                              │
│ ├── level: enum                       -- Junior, Mid, Senior, Staff, etc.  │
│ ├── status: enum                      -- searching, calibrating, reviewing │
│ ├── criteria: jsonb                   -- structured must-haves, etc.       │
│ ├── hm_id (FK)                        -- primary reviewer                  │
│ ├── recruiter_id (FK)                                                       │
│ └── created_at                                                              │
└─────────────────────────────────────────────────────────────────────────────┘


3. RETRIEVAL LOGIC (Edge Function)
──────────────────────────────────
When scoring a new candidate:

function getRelevantExamples(candidate, search) {
  // 1. Start with examples from THIS search (most relevant)
  let examples = getExamplesForSearch(search.id);

  // 2. If < 5 examples, expand to similar searches
  if (examples.length < 5) {
    examples += getExamplesForSimilarSearches({
      department: search.department,
      level: search.level,
      role_title_similar: search.role_title,
      hm_id: search.hm_id,  // Same HM's preferences
    });
  }

  // 3. Rank by similarity to current candidate
  examples = rankBySimilarity(examples, candidate);

  // 4. Return top N (balance yes/no examples)
  return balancedSample(examples, n=8);
}


4. SCORING PROMPT (Claude)
──────────────────────────
You are helping a recruiter predict whether a hiring manager
will be interested in a candidate.

## Search Context
Role: {search.role_title}
Department: {search.department}
Level: {search.level}
Must-haves: {search.criteria.must_haves}
Nice-to-haves: {search.criteria.nice_to_haves}

## Past Examples from This HM

### Candidate A (APPROVED)
Profile: {example_1.candidate_snapshot}
HM said: "{example_1.positive_signals}"

### Candidate B (REJECTED)
Profile: {example_2.candidate_snapshot}
HM concerns: "{example_2.negative_signals}"

[... more examples ...]

## Candidate to Evaluate
Profile: {new_candidate}

Based on the hiring manager's past feedback patterns, predict:
1. Rating: Yes / No / Maybe
2. Confidence: 0-100%
3. Key positive signals (what would appeal to this HM)
4. Potential concerns (based on past rejections)
5. Recommendation: Present to HM? (yes/no with reasoning)

Return as JSON.
```

---

# Data Model

## Core Tables

```sql
-- Searches (sourcing projects)
CREATE TABLE searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(id),
    role_title TEXT NOT NULL,
    department TEXT,
    level TEXT CHECK (level IN ('Junior', 'Mid', 'Senior', 'Staff', 'Principal', 'Executive')),
    status TEXT DEFAULT 'searching' CHECK (status IN ('searching', 'calibrating', 'reviewing', 'closed')),
    criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
    hm_id UUID REFERENCES users(id),
    recruiter_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sourced candidates (candidates presented for a search)
CREATE TABLE sourced_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_id UUID NOT NULL REFERENCES searches(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id),
    candidate_snapshot JSONB NOT NULL,  -- Profile at time of sourcing
    source TEXT,  -- Where recruiter found them
    recruiter_notes TEXT,
    model_score NUMERIC(5,2),  -- DSM prediction (0-100)
    model_signals JSONB,  -- Predicted positives/negatives
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'interviewing', 'passed')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(search_id, candidate_id)
);

-- HM feedback (training examples)
CREATE TABLE sourcing_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sourced_candidate_id UUID NOT NULL REFERENCES sourced_candidates(id) ON DELETE CASCADE,
    search_id UUID NOT NULL REFERENCES searches(id),
    candidate_id UUID NOT NULL REFERENCES candidates(id),
    candidate_snapshot JSONB NOT NULL,  -- Denormalized for retrieval
    reviewer_id UUID NOT NULL REFERENCES users(id),
    rating TEXT NOT NULL CHECK (rating IN ('yes', 'no', 'maybe')),
    positive_signals TEXT,
    negative_signals TEXT,
    review_phase TEXT DEFAULT 'review' CHECK (review_phase IN ('calibration', 'review')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for retrieval
CREATE INDEX idx_feedback_search ON sourcing_feedback(search_id);
CREATE INDEX idx_feedback_rating ON sourcing_feedback(rating);
CREATE INDEX idx_feedback_reviewer ON sourcing_feedback(reviewer_id);
CREATE INDEX idx_sourced_search ON sourced_candidates(search_id);
CREATE INDEX idx_sourced_status ON sourced_candidates(status);
```

## Relationship to Shared Infrastructure

```
Pipeline Tracker tables (shared):
├── candidates (basic info)
├── roles (jobs)
├── pipeline (applications)
├── users (recruiters, HMs)
└── departments

Sourcing Copilot additions:
├── searches (sourcing projects)
├── sourced_candidates (presented candidates)
└── sourcing_feedback (HM ratings = training data)
```

---

# Dual Interface

## Mission Control (Recruiters)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  MISSION CONTROL                              [Sam Vangelos ▾] [Sign Out]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │    12    │  │   87%    │  │   72%    │  │  4.2d    │                    │
│  │  Active  │  │  HM Resp │  │  Model   │  │ Avg Time │                    │
│  │ Searches │  │   Rate   │  │ Win Rate │  │ to Review│                    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                             │
│  [All Departments ▾]  [All Status ▾]  [Search...]                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ SEARCH                    │STATUS      │PENDING│APPROVED│WIN RATE  │   │
│  ├───────────────────────────┼────────────┼───────┼────────┼──────────┤   │
│  │ Senior ML Engineer        │Reviewing   │   5   │   8    │  73%     │   │
│  │ Engineering • Alex M.     │            │       │        │          │   │
│  ├───────────────────────────┼────────────┼───────┼────────┼──────────┤   │
│  │ Product Designer          │Calibrating │   3   │   2    │  —       │   │
│  │ Design • Jordan K.        │            │       │        │          │   │
│  ├───────────────────────────┼────────────┼───────┼────────┼──────────┤   │
│  │ Backend Engineer          │Searching   │   0   │   0    │  —       │   │
│  │ Engineering • Sam V.      │            │       │        │          │   │
│  └───────────────────────────┴────────────┴───────┴────────┴──────────┘   │
│                                                                             │
│  [+ New Search]                                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Recruiter Capabilities:**
- See all searches across departments
- Create new searches (intake)
- Add candidates to searches
- See model predictions before presenting to HM
- Track HM response rates and patterns
- View aggregate DSM insights

## HM Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  MY HIRING                                    [Alex Martinez ▾] [Sign Out]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ⚡ 5 candidates waiting for your review                            │   │
│  │                                                      [Review Now →] │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  MY OPEN ROLES                                                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Senior ML Engineer                                    REVIEWING    │   │
│  │  8 approved • 12 in pipeline • 2 interviewing                      │   │
│  │  ████████████░░░░ 67% to target                                    │   │
│  │                                                                     │   │
│  │  [View Pipeline]  [Review Candidates]  [Analytics]                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Product Designer                                      CALIBRATING  │   │
│  │  2 approved • 3 pending calibration                                │   │
│  │                                                                     │   │
│  │  [Continue Calibration]                                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  QUICK STATS (My Department)                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                                  │
│  │    3     │  │   47     │  │  18d     │                                  │
│  │  Open    │  │  Active  │  │  Avg     │                                  │
│  │  Roles   │  │  Cands   │  │  TTF     │                                  │
│  └──────────┘  └──────────┘  └──────────┘                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**HM Capabilities:**
- See only their roles/department
- Review candidates async (yes/no + comments)
- Participate in calibration sessions
- View pipeline analytics for their roles
- Self-serve basic reporting

---

# Analytics & Insights

## DSM Insights (Recruiter View)

Over time, patterns emerge from accumulated feedback:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DSM INSIGHTS: Engineering Department                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  WHAT GETS APPROVED                    WHAT GETS REJECTED                  │
│  ┌────────────────────────────┐        ┌────────────────────────────┐      │
│  │ ✓ Startup experience       │        │ ✗ Only big company exp     │      │
│  │ ✓ Led a team (any size)    │        │ ✗ Job hopping (<1yr stints)│      │
│  │ ✓ Open source contributions│        │ ✗ No IC work recently      │      │
│  │ ✓ Distributed systems exp  │        │ ✗ Bootcamp only (for Sr+)  │      │
│  └────────────────────────────┘        └────────────────────────────┘      │
│                                                                             │
│  BY LEVEL                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Junior: YOE matters less, portfolio/projects matter more            │   │
│  │ Senior: 5+ YOE expected, leadership signals important               │   │
│  │ Staff:  8+ YOE, must have shipped systems at scale                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  BY HM                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Alex M.: Prioritizes culture fit, tolerates skill gaps              │   │
│  │ Jordan K.: Very technical bar, less flexible on experience          │   │
│  │ Sam V.: Loves non-traditional backgrounds, career changers          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

These insights are derived from the example bank — they're patterns, not rules.

---

# Technical Implementation

## Technology Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Database | Supabase (PostgreSQL) | Shared with Pipeline Tracker |
| Auth | Supabase Auth + Google SSO | Same as Pipeline Tracker |
| Frontend | Next.js 14 (App Router) | Consistent with other tools |
| Hosting | Vercel | Consistent with other tools |
| AI | Claude API (Sonnet for scoring) | DSM via few-shot |
| Retrieval | PostgreSQL + pgvector (future) | Start simple, add embeddings later |

## MVP Scope

**Phase 1: Basic Collaboration**
- Searches table + CRUD
- Sourced candidates table
- Calibration UI (simple yes/no + comments)
- Review queue for HMs
- No DSM yet — just capture feedback

**Phase 2: DSM v1**
- Retrieve examples for scoring
- Simple similarity (same search, same HM, same department)
- Model predictions shown to recruiter
- Basic confidence scores

**Phase 3: Smart Retrieval**
- Embeddings for candidate profiles
- Semantic similarity for example retrieval
- Cross-search learning
- Insights dashboard

---

# Open Questions

| Question | Options | Notes |
|----------|---------|-------|
| Where does this live? | Standalone app vs module in Pipeline Tracker | Shares infra either way |
| Greenhouse write-back | Read-only vs create prospects | Start read-only |
| Real-time vs async | Slack notifications vs email digest vs pull-only | HMs prefer async |
| Embedding model | OpenAI embeddings vs Voyage vs Claude | For semantic retrieval |
| Calibration UX | Structured form vs freeform vs guided | Structured captures better data |
| Rating scale | Binary (yes/no) vs 3-point vs 5-point | Binary is cleaner for ML |

---

# Relationship to Other Tools

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TURING RECRUITING AI SUITE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐                                                        │
│  │ SEARCH KIT      │  Boolean generation for sourcing                      │
│  │ LIBRARY         │  (standalone, no shared data)                         │
│  └─────────────────┘                                                        │
│           │                                                                 │
│           │ Booleans used for sourcing                                      │
│           ▼                                                                 │
│  ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐     │
│  │ SOURCING        │─────▶│ PIPELINE        │─────▶│ TURICRM         │     │
│  │ COPILOT         │      │ TRACKER         │      │                 │     │
│  │                 │      │                 │      │ Talent          │     │
│  │ • Intake        │      │ • Greenhouse    │      │ rediscovery     │     │
│  │ • Calibration   │      │   sync          │      │ from enriched   │     │
│  │ • HM review     │      │ • Pipeline      │      │ profiles        │     │
│  │ • DSM learning  │      │   visibility    │      │                 │     │
│  │                 │      │ • Analytics     │      │                 │     │
│  └─────────────────┘      └─────────────────┘      └─────────────────┘     │
│           │                       │                        │                │
│           │                       │                        │                │
│           └───────────────────────┴────────────────────────┘                │
│                                   │                                         │
│                                   ▼                                         │
│                    ┌─────────────────────────────┐                          │
│                    │    SHARED INFRASTRUCTURE    │                          │
│                    │                             │                          │
│                    │ • Greenhouse API client     │                          │
│                    │ • Supabase (shared tables)  │                          │
│                    │ • Auth (Google SSO)         │                          │
│                    │ • Design system             │                          │
│                    │ • candidates, roles tables  │                          │
│                    └─────────────────────────────┘                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| HM response time | <48hr to review candidates | Avg time from sourced → reviewed |
| Model accuracy | 70%+ prediction matches HM decision | Compare model score vs actual rating |
| Calibration efficiency | 5-8 examples sufficient for 70% accuracy | Track accuracy vs example count |
| Sourcing precision | 20% improvement in approval rate | Compare pre/post DSM |
| HM satisfaction | NPS >50 for async review experience | Survey |
| Institutional memory | Patterns persist across searches | Cross-search model performance |

---

*Document version: 0.1 (Draft)*
*Status: Ideation / Parked*
*Created: January 2026*
*Purpose: Capture concept for future development*
*Part of: Turing Recruiting AI Tool Suite*
*Related docs: [Pipeline Tracker](./pipeline-tracker-technical-spec.md), [Shared Infrastructure](./shared-infrastructure.md)*
