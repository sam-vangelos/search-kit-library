# Rosie: AI-Powered Resume Screening

**Product Vision Document — v2.0**
**Owner:** Sam Vangelos
**Last Updated:** January 2026

---

# Executive Summary

Rosie is a stateless batch screening tool that ranks large applicant pools against job requirements in minutes. The core workflow: import candidates → score against JD + intake context → triage into tiers → reject/advance → done.

**Core Value Proposition:** "Rank 200+ candidates in minutes, not hours."

**What Makes It Different:** Ideal candidate calibration — upload 2-5 resumes of your best hires to teach the AI what "good" looks like for this specific role.

---

# Problem Statement

## The Recruiter's Screening Problem

For every open role, recruiters face:
- 100-500 applicants (more for popular roles)
- 80-95% are unqualified
- Manual screening takes 2-4 hours per role
- Fatigue leads to inconsistent evaluation
- Good candidates get buried in the pile

## The Hiring Manager Calibration Problem

HMs have a mental model of their "ideal candidate" that's hard to articulate:
- The JD says "5+ years Python" but they'd take 3 years with ML experience
- They want "startup mentality" but that's not in the requirements
- Previous great hires had patterns that aren't captured anywhere

## Why Greenhouse Native Tools Don't Solve This

- Greenhouse search is keyword-based (no semantic understanding)
- No scoring or ranking capability
- No way to incorporate HM preferences beyond the JD
- Bulk reject requires manual review first

---

# User Stories

## Primary User: Recruiter

**Story 1: Bulk Screening**
> "As a recruiter with 200 applicants for an ML Engineer role, I want to identify the top 20 candidates in under 10 minutes so I can focus my time on outreach and interviews, not resume reading."

**Story 2: Calibrated Screening**
> "As a recruiter, I want to upload resumes from our 3 best ML hires so the AI understands what 'good' looks like at our company, not just generic qualifications."

**Story 3: Intake-Informed Screening**
> "As a recruiter, I want to include my intake notes alongside the JD so candidates are scored against what the HM actually wants, not just what's posted."

## Secondary User: Hiring Manager

**Story 4: Transparent Reasoning**
> "As a hiring manager reviewing the shortlist, I want to see WHY each candidate scored high or low so I can trust the AI's recommendations and catch any misalignment."

---

# Core Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ROSIE WORKFLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

STEP 1: INPUT REQUIREMENTS
──────────────────────────
┌─────────────────────┐    ┌─────────────────────┐
│   Job Description   │ +  │    Intake Notes     │  (optional)
│   (paste or upload) │    │  (HM preferences)   │
└─────────────────────┘    └─────────────────────┘
           │                         │
           └────────────┬────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYNTHESIZED SCORING RUBRIC                               │
│                                                                             │
│  Must-Haves:        Nice-to-Haves:         Hidden Preferences:              │
│  • Python (5+ yrs)  • AWS experience       • Startup background             │
│  • ML frameworks    • Leadership exp       • Fast-paced environment fit     │
│  • CS degree        • Publications         • (from intake notes)            │
└─────────────────────────────────────────────────────────────────────────────┘


STEP 2: CALIBRATION (Optional)
──────────────────────────────
┌─────────────────────┐
│  Ideal Candidate    │
│  Resumes (2-5)      │
│                     │
│  "Our best hires    │
│   in similar roles" │
└─────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    IDEAL CANDIDATE PATTERNS                                 │
│                                                                             │
│  Common Skills:     Career Patterns:       Achievement Signals:             │
│  • Python + PyTorch • FAANG → Startup      • "Led team of X"               │
│  • System design    • IC → Tech Lead       • "Shipped product to Y users"  │
│  • ML pipelines     • Research → Applied   • "Reduced latency by Z%"       │
└─────────────────────────────────────────────────────────────────────────────┘


STEP 3: CANDIDATE IMPORT
────────────────────────
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GREENHOUSE BULK IMPORT                              │
│                                                                             │
│  1. Select job from dropdown                                                │
│  2. System fetches all applicants + resumes                                 │
│  3. Filters to "Application Review" stage (unscreened)                      │
│  4. Displays count: "247 candidates ready to screen"                        │
│                                                                             │
│  [Import & Score All]                                                       │
└─────────────────────────────────────────────────────────────────────────────┘


STEP 4: AI SCORING
──────────────────
For each candidate (batched, parallelized):

┌─────────────────────┐
│  Resume Text        │
│  +                  │
│  Scoring Rubric     │
│  +                  │
│  Ideal Patterns     │
└─────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CANDIDATE SCORE                                     │
│                                                                             │
│  Overall: 8.4 / 10                              Tier: STRONG                │
│                                                                             │
│  Dimensions:                                                                │
│  ├── Technical Skills:    9/10  "Strong Python, PyTorch, system design"    │
│  ├── Experience Level:    8/10  "6 years, but only 2 in ML"                │
│  ├── Role Alignment:      8/10  "Matches must-haves, missing AWS"          │
│  └── Growth Potential:    8/10  "Clear progression, recent learning"       │
│                                                                             │
│  Key Strengths:                                                             │
│  • Led ML platform team at Series B startup (matches ideal pattern)        │
│  • Published research on transformer efficiency                             │
│                                                                             │
│  Key Gaps:                                                                  │
│  • No AWS experience (nice-to-have)                                         │
│  • Shorter ML-specific tenure than ideal                                    │
└─────────────────────────────────────────────────────────────────────────────┘


STEP 5: TRIAGE & ACTION
───────────────────────
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TIER-BASED RESULTS                                  │
│                                                                             │
│  TOP TIER (9-10)         │ 12 candidates  │ [Advance All to Screen]        │
│  ████████████████████    │                │                                 │
│                          │                │                                 │
│  STRONG (8-8.9)          │ 28 candidates  │ [Review Individually]          │
│  ██████████████          │                │                                 │
│                          │                │                                 │
│  MODERATE (7-7.9)        │ 45 candidates  │ [Review or Reject]             │
│                          │                │                                 │
│  BELOW THRESHOLD (<7)    │ 162 candidates │ [Bulk Reject]                  │
│  ███                     │                │                                 │
│                                                                             │
│  Actions:                                                                   │
│  • Bulk advance top tiers in Greenhouse                                     │
│  • Bulk reject below threshold                                              │
│  • Export shortlist to CSV                                                  │
└─────────────────────────────────────────────────────────────────────────────┘


STEP 6: DONE
────────────
Session complete. No data persisted. Start fresh next time.
```

---

# Architectural Principles

## 1. Stateless Batch Processing

**Principle:** Each screening session is self-contained. Import → Score → Act → Done.

**Why:**
- Simpler architecture (no user accounts, no project management)
- Faster to build and maintain
- No stale data concerns
- Users don't need to "manage" anything

**Implication:** No persistent database for candidates. Ephemeral storage (if needed) expires after session.

## 2. Greenhouse as Source of Truth

**Principle:** Candidates and resumes come from Greenhouse, not manual uploads.

**Why:**
- That's where the applicants actually are
- Resumes are already stored there
- Actions (advance/reject) happen there
- Eliminates duplicate data entry

**Implication:** Manual upload is a secondary flow (for edge cases), not the primary UX.

## 3. Single-Pass Scoring

**Principle:** One AI call per candidate that does everything — parse resume + apply rubric + generate score.

**Why:**
- Faster (1 call vs 2-3)
- Cheaper (fewer tokens overall)
- More coherent (AI sees full context)

**Implication:** No separate "parsing" step. The scoring prompt includes the raw resume text.

## 4. Rubric-Based Consistency

**Principle:** Extract a scoring rubric FIRST, then score all candidates against that rubric.

**Why:**
- Consistent evaluation across 200+ candidates
- Transparent criteria (user can review/edit)
- JD + Intake synthesis happens once, not 200 times

**Implication:** Two-phase process: (1) Analyze requirements → Rubric, (2) Score candidates → Rubric.

## 5. Calibration Through Examples

**Principle:** Ideal candidate resumes are optional but powerful.

**Why:**
- Few-shot learning improves accuracy
- Captures tacit preferences HMs can't articulate
- "Candidates scoring 9-10 should look like these people"

**Implication:** Ideal pattern extraction is a separate (optional) step that enhances the rubric.

---

# Data Model Concepts

## Ephemeral Session Data

```
Session
├── job_description: text
├── intake_notes: text (optional)
├── scoring_rubric: structured (AI-generated)
├── ideal_patterns: structured (optional, AI-generated)
└── candidates[]
    ├── greenhouse_id
    ├── name
    ├── resume_text (fetched from Greenhouse, not stored)
    ├── scores: {technical, experience, alignment, growth}
    ├── overall_score: number
    ├── tier: enum (top, strong, moderate, below)
    └── reasoning: text
```

## Scoring Rubric Structure

```
Rubric
├── must_haves[]
│   ├── requirement: text
│   ├── weight: number
│   └── flexibility: text (from intake)
├── nice_to_haves[]
│   ├── requirement: text
│   └── weight: number
├── hidden_preferences[]  (from intake)
│   ├── preference: text
│   └── source: "intake notes"
└── seniority_target: enum
```

## Ideal Candidate Patterns Structure

```
IdealPatterns
├── common_skills[]
│   ├── skill: text
│   └── frequency: "all" | "most" | "some"
├── career_patterns[]
│   ├── pattern: text (e.g., "FAANG → Startup")
│   └── frequency
├── achievement_signals[]
│   ├── signal: text
│   └── examples: text[]
└── education_patterns[]
```

---

# Integration Points

## Greenhouse Harvest API

**Read Operations:**
- `GET /jobs` — List open jobs for selection
- `GET /jobs/{id}/applications` — Get all applicants for a job
- `GET /candidates/{id}` — Get candidate details
- `GET /candidates/{id}/attachments` — Get resume attachment

**Write Operations (Optional — requires additional permissions):**
- `POST /applications/{id}/advance` — Move to next stage
- `POST /applications/{id}/reject` — Reject with reason

**Rate Limits:** 50 requests / 10 seconds (same as Pipeline Tracker)

## Shared Infrastructure Opportunities

> **See [Shared Infrastructure Reference](./shared-infrastructure.md)** for complete implementation details on common components.

| Component | Rosie Needs | Pipeline Tracker Has | Share? |
|-----------|-------------|---------------------|--------|
| Greenhouse auth/client | ✓ | ✓ | **Yes** — same API wrapper |
| Rate limiting logic | ✓ | ✓ | **Yes** — same utility |
| Candidate basic info | ✓ | ✓ | No — Rosie is stateless, reads from GH directly |
| Resume text extraction | ✓ | ✗ | No — Rosie-specific |
| Scoring engine | ✓ | ✗ | No — Rosie-specific |

**Rosie's Role in Shared Infrastructure:**
- **Uses:** Greenhouse API client, rate limiting patterns, design system
- **Does NOT use:** Shared database tables (stateless architecture)
- **Reads from:** Greenhouse directly (not Pipeline Tracker's tables)

---

# What We Learned (v1 Mistakes to Avoid)

## ❌ Overbuilt Persistence

**v1:** Full database with Projects, Candidates, Ideal Candidates tables, file storage.

**Problem:** Added complexity without value. Users don't revisit old screening sessions.

**v2:** Stateless. Session data lives in memory/browser. Nothing persists after workflow completes.

## ❌ Separate Parse + Score Calls

**v1:** Parse resume (API call 1) → Store parsed data → Score candidate (API call 2).

**Problem:** 2x latency, 2x cost, intermediate state to manage.

**v2:** Single prompt: "Here's the JD, here's the resume, score it."

## ❌ Manual Upload as Primary Flow

**v1:** Drag-and-drop resume upload was the main UX.

**Problem:** Real value is screening Greenhouse applicants at scale. Manual upload is a demo.

**v2:** Greenhouse bulk import is the primary flow. Manual upload is secondary/fallback.

## ❌ Storing PDFs in Database

**v1:** Base64-encoded PDFs in a TEXT column.

**Problem:** Expensive, slow, unnecessary (Greenhouse already stores them).

**v2:** Fetch from Greenhouse on-demand. Don't store locally.

## ✓ Keep: Ideal Candidate Calibration

**v1:** Upload ideal resumes to extract patterns.

**Why it works:** Few-shot learning improves scoring accuracy. Captures tacit HM preferences.

**v2:** Keep this. Make it more prominent in UX.

## ✓ Keep: Tier-Based Output

**v1:** Top Tier / Strong / Moderate / Below Threshold.

**Why it works:** Recruiters need buckets for action, not precise scores.

**v2:** Keep this. Add bulk actions per tier.

## ✓ Keep: Multi-Dimensional Scoring with Reasoning

**v1:** Technical, Experience, Alignment, Growth + explanation.

**Why it works:** Transparency builds trust. HMs can validate AI reasoning.

**v2:** Keep this. Consider making dimensions configurable.

---

# Open Questions (Decide During Build)

| Question | Options | Recommendation |
|----------|---------|----------------|
| LLM choice | Claude vs GPT-4 vs flexible | Start with Claude for consistency with other tools; abstract LLM calls for future flexibility |
| Greenhouse write-back | Read-only vs advance/reject integration | Start read-only; add write-back if users request |
| Rubric editing | AI-generated only vs user-editable | AI-generated with optional user edit before scoring |
| Batch size | Score all at once vs chunked with progress | Chunked with progress bar (better UX for 200+ candidates) |
| Threshold customization | Fixed tiers vs user-defined cutoffs | Fixed tiers for v1; consider customization later |
| Export format | CSV only vs CSV + PDF report | CSV first; PDF if users need shareable reports |
| Auth | None vs optional vs required | None for v1 (stateless tool); add if org wants audit trail |

---

# Cost Estimates

## Per-Screening-Session Costs

Assumptions:
- 200 candidates per job
- Average resume: ~800 tokens
- JD + Intake: ~500 tokens
- Scoring output: ~300 tokens per candidate

| Operation | Token Estimate | Cost (Claude Sonnet) |
|-----------|---------------|----------------------|
| Rubric generation (1×) | ~2,000 tokens | ~$0.01 |
| Ideal pattern extraction (3 resumes) | ~4,000 tokens | ~$0.02 |
| Candidate scoring (200×) | ~320,000 tokens | ~$1.60 |
| **Total per session** | | **~$1.63** |

## At Scale

| Volume | Cost per Month |
|--------|----------------|
| 10 roles/month (2,000 candidates) | ~$16 |
| 50 roles/month (10,000 candidates) | ~$80 |
| 100 roles/month (20,000 candidates) | ~$160 |

## Infrastructure Costs

| Component | Cost |
|-----------|------|
| Vercel (hosting) | $0 (hobby) to $20 (pro) |
| Supabase (if any persistence needed) | $0 (free tier sufficient) |
| **Total infrastructure** | **$0-20/month** |

---

# Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Time to shortlist | <10 min for 200 candidates | Session timer |
| Screening accuracy | Top tier candidates get offers at 2x rate of manual screening | Track outcomes in Greenhouse |
| Recruiter adoption | 80% of screens use Rosie | Usage analytics |
| HM trust | 90% of HMs approve Rosie shortlists without major changes | Feedback survey |

---

*Document version: 2.0*
*Previous version: Rosie the Resume Ranker (v1 implementation doc)*
*Purpose: Product vision and architectural principles for rebuild*
*Part of: Turing Recruiting AI Tool Suite*
*Related docs: [Pipeline Tracker](./pipeline-tracker-technical-spec.md), [TuriCRM](./turicrm-talent-intelligence-spec.md), [Shared Infrastructure](./shared-infrastructure.md)*
