# TuriCRM: AI-Powered Talent Intelligence

**Product Vision Document — v2.0**
**Owner:** Sam Vangelos
**Last Updated:** January 2026

---

# Executive Summary

TuriCRM is a talent rediscovery platform that transforms historical Greenhouse candidate data into a searchable, AI-enriched database. Natural language queries like "senior ML engineers who worked at FAANG" return ranked results instantly.

**Core Value Proposition:** "Find past candidates for new roles without external sourcing."

**What Makes It Different:** AI-powered structured extraction from resumes, enabling queries that Greenhouse native search can't handle.

---

# Problem Statement

## The Talent Rediscovery Problem

Recruiting teams have valuable candidates sitting in their ATS that they can't find:
- 10,000+ candidates accumulated over years
- Strong candidates who weren't right for *that* role but might be perfect for *this* one
- Silver medalists from past searches
- Candidates who've gained experience since last contact

## Why Greenhouse Search Fails

Greenhouse search is keyword-based and limited:

| Query Type | Can Greenhouse Do It? |
|------------|----------------------|
| "Python developers" | ✓ (keyword match) |
| "Senior Python developers" | ✗ (no seniority extraction) |
| "Python developers with AWS experience" | ✗ (multi-skill intersection) |
| "Engineers who worked at Google" | ✗ (no company extraction) |
| "ML engineers with startup background" | ✗ (no context understanding) |
| "Candidates from healthcare industry" | ✗ (no industry tagging) |

## The Data Extraction Gap

Resumes contain rich structured data — but it's trapped in unstructured PDFs:
- Skills with varying proficiency levels
- Career progression patterns
- Company backgrounds
- Industry experience
- Education credentials

No one has time to manually tag thousands of candidates. AI can.

---

# User Stories

## Primary User: Recruiter / Sourcer

**Story 1: Talent Rediscovery**
> "As a recruiter opening a new ML Engineer role, I want to search our past candidates before paying for LinkedIn Recruiter seats, so I can re-engage qualified people who already know us."

**Story 2: Complex Queries**
> "As a sourcer, I want to find 'senior backend engineers with fintech experience who've worked at startups' — a query Greenhouse can't handle."

**Story 3: Silver Medalist Search**
> "As a recruiter, I want to find candidates who made it to final rounds for similar roles in the past year but weren't selected, because they're already vetted."

## Secondary User: Hiring Manager

**Story 4: Pool Exploration**
> "As a hiring manager, I want to see what our existing talent pool looks like for my role before we start external sourcing, so I can calibrate expectations."

## Tertiary User: Recruiting Leadership

**Story 5: Talent Analytics**
> "As a recruiting leader, I want to understand the composition of our talent pool — seniority distribution, top industries represented, most common skills — so I can identify gaps."

---

# Core Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TURICRM WORKFLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: ENRICHMENT (Background Process — Runs Once, Then Incrementally)
═════════════════════════════════════════════════════════════════════════

┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────────┐
│   GREENHOUSE    │────▶│   ENRICHMENT QUEUE   │────▶│    AI ENRICHMENT    │
│                 │     │                      │     │      (Claude)       │
│ Candidates who: │     │ Candidates with      │     │                     │
│ • Applied       │     │ resumes, not yet     │     │ Extract:            │
│ • Reached Screen│     │ enriched             │     │ • Skills + levels   │
│ • Have resume   │     │                      │     │ • Seniority         │
└─────────────────┘     └──────────────────────┘     │ • Companies         │
                                                     │ • Industries        │
                                                     │ • Education         │
                                                     │ • Technologies      │
                                                     └──────────┬──────────┘
                                                                │
                                                                ▼
                                                     ┌─────────────────────┐
                                                     │  ENRICHED PROFILES  │
                                                     │     (Supabase)      │
                                                     │                     │
                                                     │ Queryable by any    │
                                                     │ extracted field     │
                                                     └─────────────────────┘


PHASE 2: SEARCH (User-Facing — On Demand)
═════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│                           SEARCH INTERFACE                                  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ 🔍  "senior ML engineers with FAANG experience and startup background"│ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  [Seniority: All ▾]  [Industry: All ▾]  [Min Experience: Any ▾]            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        QUERY TRANSLATION (Claude)                           │
│                                                                             │
│  Natural Language:                      Structured Filter:                  │
│  "senior ML engineers with              {                                   │
│   FAANG experience and                    seniority: ["Senior", "Staff"],   │
│   startup background"                     skills: [{name: "ML", min: 3}],   │
│                                           companies: ["Google", "Meta",     │
│                                                       "Apple", "Amazon"],   │
│                                           experience_context: "startup"     │
│                                         }                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SEARCH RESULTS                                    │
│                                                                             │
│  Found 23 candidates matching your criteria                                 │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Jane Chen                                          Senior • 8 yrs  │   │
│  │  ML Engineer → Senior ML Engineer                                   │   │
│  │                                                                     │   │
│  │  Companies: Google (3yr), Stripe (2yr), [Startup] Acme AI (3yr)    │   │
│  │  Skills: Python ●●●●○  PyTorch ●●●●●  AWS ●●●○○                    │   │
│  │  Industries: Tech, Fintech                                          │   │
│  │                                                                     │   │
│  │  Last Active: Applied to "ML Platform Lead" — Oct 2024              │   │
│  │  Stage Reached: Final Interview (not selected — timing)             │   │
│  │                                                                     │   │
│  │  [View in Greenhouse]  [View Resume]  [Add to List]                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Marcus Johnson                                     Senior • 6 yrs  │   │
│  │  ...                                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


PHASE 3: ACTION
═══════════════

• Export candidate list to CSV
• Create Greenhouse prospect list (future)
• Trigger outreach sequence (future integration)
```

---

# Architectural Principles

## 1. Enrich Once, Query Forever

**Principle:** Pay the AI cost upfront during enrichment. Queries against structured data are free and instant.

**Why:**
- $0.05 per candidate one time >> $0.05 per candidate per search
- Structured data enables complex queries
- Sub-second response times for users

**Implication:** Background enrichment pipeline runs nightly/weekly. Search is just database queries.

## 2. Qualified Candidates Only

**Principle:** Don't enrich everyone. Enrich candidates who demonstrated intent or quality.

**Criteria for enrichment:**
- **Active applicants** — They applied, they're interested
- **Reached Recruiter Screen or beyond** — Someone vetted them
- **Have a resume on file** — Can't enrich without data

**Why:**
- Passive sourced leads with LinkedIn PDFs are low-signal
- Reduces enrichment costs by 60-80%
- Higher quality search results

**Implication:** Enrichment pipeline filters by application status/stage before processing.

## 3. Natural Language First, Filters Second

**Principle:** Users type what they want in plain English. AI translates to structured query.

**Why:**
- Recruiters think in concepts ("FAANG experience"), not fields (`companies IN ('Google', 'Meta', ...)`)
- Reduces training burden
- Handles synonyms and variations

**Implication:** Search UI is a text box, not a form with 15 dropdowns. Dropdowns are optional refinements.

## 4. Greenhouse is the System of Record

**Principle:** TuriCRM is a read-only intelligence layer. Greenhouse remains source of truth.

**Why:**
- No data duplication headaches
- Users continue normal Greenhouse workflows
- Actions (outreach, status changes) happen in Greenhouse

**Implication:** Deep links back to Greenhouse for every candidate. No editing candidate data in TuriCRM.

## 5. Confidence-Aware Extraction

**Principle:** Skills aren't binary. Extract with confidence scores.

**Example:**
```
skills: [
  {name: "Python", confidence: 5},     // Mentioned extensively, production use
  {name: "TensorFlow", confidence: 3}, // Mentioned, unclear depth
  {name: "Kubernetes", confidence: 2}  // Listed but no context
]
```

**Why:**
- "Python developers" vs "Expert Python developers" are different searches
- Avoids false positives from keyword stuffing
- Enables nuanced filtering

**Implication:** Enrichment prompt explicitly requests confidence ratings. Search can filter by minimum confidence.

---

# Data Model Concepts

## Candidate Source Data (from Greenhouse)

```
Candidate (Greenhouse)
├── id
├── name, email
├── applications[]
│   ├── job_id, job_title
│   ├── stage (Application Review, Screen, Interview, Offer, etc.)
│   ├── status (active, rejected, hired)
│   └── applied_at, last_activity_at
└── attachments[]
    └── resume (PDF)
```

## Enriched Profile (AI-Generated)

```
EnrichedProfile
├── candidate_id (FK to Greenhouse)
├── current_title: text
├── seniority: enum (Junior, Mid, Senior, Staff, Principal, Executive)
├── location: text
│
├── skills: [{name, confidence: 1-5}]
├── technologies: [text]
├── domains: [text]  // "Web Development", "Machine Learning", "DevOps"
├── industries: [text]  // "Healthcare", "Fintech", "E-commerce"
│
├── companies: [text]
├── experience_years: {total: number, by_area: {area: years}}
│
├── education: [{degree, institution, field}]
├── certifications: [text]
│
├── languages: [text]  // Spoken languages
├── soft_skills: [text]
│
├── greenhouse_context
│   ├── last_application_date
│   ├── highest_stage_reached
│   └── roles_applied_to: [text]
│
├── enrichment_metadata
│   ├── enriched_at: timestamp
│   ├── model_version: text
│   └── confidence_score: number (overall extraction confidence)
│
└── raw_extraction: jsonb (full AI response for debugging)
```

## Search Query Structure

```
SearchQuery
├── natural_language: text (original user input)
├── translated_params
│   ├── seniority_levels: [enum]
│   ├── job_titles: [text]  // Substring match
│   ├── person_names: [text]  // If searching specific person
│   ├── skills: [{name, min_confidence}]
│   ├── technologies: [text]
│   ├── domains: [text]
│   ├── industries: [text]
│   ├── companies: [text]
│   ├── experience_years: {min, max}
│   ├── education: {degree_level, institutions}
│   └── greenhouse_filters
│       ├── min_stage_reached: enum
│       ├── applied_after: date
│       └── roles: [text]
└── ui_overrides  // From dropdown filters
    ├── seniority: enum
    ├── industry: text
    └── limit: number
```

---

# Integration Points

## Greenhouse Harvest API

**Read Operations:**
- `GET /candidates` — Paginated candidate list
- `GET /candidates/{id}` — Candidate details with applications
- `GET /candidates/{id}/attachments` — Resume download
- `GET /applications` — Filter by stage, status, date

**Shared with Pipeline Tracker:**
- Same API authentication
- Same rate limiting logic (50 req/10s)
- Same pagination handling

## Shared Infrastructure Opportunities

> **See [Shared Infrastructure Reference](./shared-infrastructure.md)** for complete implementation details on common components.

| Component | TuriCRM Needs | Pipeline Tracker Has | Share? |
|-----------|---------------|---------------------|--------|
| Greenhouse API client | ✓ | ✓ | **Yes** — identical |
| Rate limiting | ✓ | ✓ | **Yes** — identical |
| Candidate basic info | ✓ | ✓ | **Yes** — same table |
| Application/stage data | ✓ | ✓ | **Yes** — same table |
| Resume text extraction | ✓ | ✗ | No — TuriCRM only |
| AI enrichment | ✓ | ✗ | No — TuriCRM only |
| Stage/source mappings | ✗ | ✓ | No — Pipeline only |

**TuriCRM's Role in Shared Infrastructure:**
- **Uses:** Greenhouse API client, rate limiting, design system, auth (Phase 3)
- **Reads from:** Pipeline Tracker's candidates, roles, pipeline tables
- **Writes to:** enriched_profiles table (TuriCRM-specific)

**Shared Schema:**
```
Pipeline Tracker tables:
├── candidates (basic info)
├── roles (jobs)
├── pipeline (applications)
├── scorecards
└── offers

TuriCRM additions:
├── enriched_profiles (FK to candidates)
└── search_log (audit)
```

---

# Enrichment Pipeline Details

## Candidate Selection Criteria

```sql
-- Candidates eligible for enrichment
SELECT c.* FROM candidates c
JOIN pipeline p ON c.id = p.candidate_id
WHERE
  -- Has a resume we can process
  EXISTS (SELECT 1 FROM attachments WHERE candidate_id = c.id AND type = 'resume')

  -- Not already enriched
  AND NOT EXISTS (SELECT 1 FROM enriched_profiles WHERE candidate_id = c.id)

  -- Meets quality threshold (one of):
  AND (
    -- Applied (active intent)
    p.status = 'active'

    -- OR reached meaningful stage
    OR p.canonical_stage IN ('Recruiter Screen', 'HM Screen', 'Assessment', 'Interview Loop', 'Offer')

    -- OR was hired (obviously qualified)
    OR p.status = 'hired'
  )
```

## Enrichment Prompt Concept

```
Extract structured information from this resume.

Return JSON with these fields:
- current_title: Most recent job title
- seniority_level: Junior | Mid | Senior | Staff | Principal | Executive
- location: City, State/Country if mentioned
- skills: Array of {name, confidence: 1-5} where confidence reflects depth of evidence
- technologies: Specific tools, languages, frameworks
- domains: Technical areas (Web Development, Machine Learning, DevOps, etc.)
- industries: Business sectors (Healthcare, Fintech, E-commerce, etc.)
- companies: List of companies worked at
- experience_years: {total: number, by_area: {area: years}}
- education: Array of {degree, institution, field}
- certifications: Professional certifications
- languages: Spoken languages
- soft_skills: Leadership, communication, etc.

IMPORTANT DISTINCTIONS:
- "skills" = Competencies with proficiency (Python, System Design)
- "technologies" = Specific tools (React, AWS, Docker)
- "domains" = Technical specializations
- "industries" = Business sectors

Confidence scoring:
- 5 = Extensive evidence, production use, years of experience
- 4 = Clear experience, multiple mentions
- 3 = Mentioned with some context
- 2 = Listed but minimal evidence
- 1 = Implied or tangential

Return ONLY valid JSON.
```

## Incremental Processing

**Initial Load:**
- Process all historical candidates meeting criteria
- Batch processing with rate limits
- May take hours/days for large databases

**Ongoing:**
- Nightly job picks up new candidates
- Only processes candidates added/updated since last run
- Tracks `last_enriched_at` watermark

---

# What We Learned (v1 Mistakes to Avoid)

## ❌ Base64 PDFs in Database

**v1:** `resume_data TEXT -- Base64-encoded PDF content`

**Problem:** PostgreSQL isn't blob storage. 10,000 candidates × 700KB = 7GB of text data. Slow queries, expensive storage, pointless (Greenhouse already stores them).

**v2:** Don't store resumes. Fetch from Greenhouse on-demand for enrichment. Or use Supabase Storage (S3) if caching needed.

## ❌ Enriching Everyone

**v1:** Attempted to enrich all candidates in database.

**Problem:** Passive sourced leads with LinkedIn PDF exports are garbage data. Wasted API costs on low-value candidates.

**v2:** Enrich only qualified candidates (applied + reached screen or beyond).

## ❌ Streamlit UI

**v1:** Built dashboard in Streamlit.

**Problem:** No auth, doesn't scale to team use, doesn't match other tools, limited UX.

**v2:** Next.js on Vercel, consistent with Pipeline Tracker and Rosie.

## ❌ AI-Specific Hardcoding

**v1:** Special logic to prioritize AI-related paragraphs, AI keyword detection, `ai_expertise` as a first-class field.

**Problem:** Makes the tool Turing-specific instead of generalizable.

**v2:** Make domain prioritization configurable. `ai_expertise` becomes just another skill with confidence score.

## ❌ Standalone Ingestion Pipeline

**v1:** Separate ingestion script that duplicates Greenhouse sync logic.

**Problem:** Same API calls, same rate limiting, same data — but separate code from Pipeline Tracker.

**v2:** Share Greenhouse sync infrastructure with Pipeline Tracker. TuriCRM adds enrichment layer on top.

## ✓ Keep: Structured Extraction with Confidence

**v1:** Skills with confidence scores, seniority levels, company/industry extraction.

**Why it works:** Enables queries Greenhouse can't do. Confidence scores prevent false positives.

**v2:** Keep this. It's the core value.

## ✓ Keep: Natural Language Query Translation

**v1:** Claude converts "senior Python developers with AWS" → structured filter.

**Why it works:** Intuitive UX. Handles variations and synonyms.

**v2:** Keep this. Consider caching common query patterns.

## ✓ Keep: JSONB Storage for Flexible Querying

**v1:** Skills, technologies, industries as JSONB arrays.

**Why it works:** PostgreSQL JSONB operators enable complex queries without schema changes.

**v2:** Keep this. Add GIN indexes for performance.

---

# Open Questions (Decide During Build)

| Question | Options | Recommendation |
|----------|---------|----------------|
| Enrichment timing | Batch (nightly) vs real-time (on candidate create) | Batch — simpler, cheaper, good enough |
| Resume storage | Don't store vs Supabase Storage vs fetch-on-demand | Fetch from Greenhouse on-demand; cache in Storage if latency issues |
| Search result ranking | Relevance score vs recency vs stage reached | Hybrid: relevance primary, recency tiebreaker |
| Greenhouse write-back | Read-only vs create prospect lists | Read-only for v1; prospect list creation if users request |
| Query caching | None vs cache translated queries | Cache common patterns (e.g., "senior python") for speed |
| Candidate de-duplication | Trust Greenhouse vs merge duplicates | Trust Greenhouse for v1; dedup is a separate project |
| Team access | Single user vs multi-user with same view vs RBAC | Multi-user same view for v1; RBAC if needed |

---

# Cost Estimates

## Enrichment Costs (One-Time + Incremental)

Assumptions:
- 10,000 historical candidates meeting criteria
- Average resume: ~1,500 tokens
- Enrichment prompt + output: ~2,000 tokens per candidate

| Phase | Candidates | Token Estimate | Cost (Claude Sonnet) |
|-------|------------|---------------|----------------------|
| Initial historical load | 10,000 | ~20M tokens | ~$100 |
| Monthly new candidates | ~500 | ~1M tokens | ~$5/month |

## Search Costs (Per Query)

| Operation | Token Estimate | Cost |
|-----------|---------------|------|
| Query translation | ~500 tokens | ~$0.003 |
| Database query | N/A | $0 (just SQL) |
| **Per search** | | **<$0.01** |

## Infrastructure Costs

| Component | Cost |
|-----------|------|
| Supabase (database + auth) | $0-25/month (depends on size) |
| Vercel (hosting) | $0-20/month |
| **Total infrastructure** | **$0-45/month** |

## Total Cost of Ownership

| Scenario | Year 1 Cost |
|----------|-------------|
| 10K candidates, 1K searches/month | ~$160 enrichment + ~$120 search + ~$300 infra = **~$580** |
| 50K candidates, 5K searches/month | ~$500 enrichment + ~$600 search + ~$500 infra = **~$1,600** |

---

# Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Candidates enriched | 80%+ of qualified pool | `enriched / eligible` |
| Search-to-outreach conversion | 20% of searches result in candidate contact | Track in Greenhouse |
| Time to find candidates | <30 seconds for any query | Search latency |
| Query success rate | 90% of queries return relevant results | User feedback |
| Sourcing cost reduction | 15% fewer external sourcing hours | Compare to baseline |

---

# Analytics Dashboard Concepts

## Talent Pool Composition

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TALENT POOL ANALYTICS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SENIORITY DISTRIBUTION          TOP INDUSTRIES                            │
│  ┌────────────────────┐          ┌────────────────────────────────────┐    │
│  │ Executive  ██ 3%   │          │ Technology      ████████████ 45%  │    │
│  │ Principal  ███ 7%  │          │ Fintech         ██████ 22%        │    │
│  │ Staff      █████ 12%│         │ Healthcare      ████ 15%          │    │
│  │ Senior     ████████ 35%│      │ E-commerce      ██ 8%             │    │
│  │ Mid        ██████ 28%│        │ Other           ██ 10%            │    │
│  │ Junior     ███ 15% │          └────────────────────────────────────┘    │
│  └────────────────────┘                                                    │
│                                                                             │
│  TOP SKILLS                      TOP COMPANIES (Alumni)                    │
│  ┌────────────────────────────┐  ┌────────────────────────────────────┐    │
│  │ Python         ████████ 67%│  │ Google          ████ 156           │    │
│  │ JavaScript     ██████ 52%  │  │ Amazon          ███ 134            │    │
│  │ AWS            █████ 45%   │  │ Meta            ███ 98             │    │
│  │ React          ████ 38%    │  │ Microsoft       ██ 87              │    │
│  │ Machine Learning ███ 28%   │  │ Stripe          ██ 45              │    │
│  └────────────────────────────┘  └────────────────────────────────────┘    │
│                                                                             │
│  ENRICHMENT HEALTH                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │ Total Candidates: 12,456                                           │    │
│  │ Eligible for Enrichment: 8,234                                     │    │
│  │ Enriched: 7,891 (95.8%)                                            │    │
│  │ Pending: 343                                                       │    │
│  │ Last Enrichment Run: 6 hours ago                                   │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

*Document version: 2.0*
*Previous version: TuriCRM/TuriBuilder (v1 implementation doc)*
*Purpose: Product vision and architectural principles for rebuild*
*Part of: Turing Recruiting AI Tool Suite*
*Related docs: [Pipeline Tracker](./pipeline-tracker-technical-spec.md), [Rosie](./rosie-resume-screener-spec.md), [Shared Infrastructure](./shared-infrastructure.md)*
