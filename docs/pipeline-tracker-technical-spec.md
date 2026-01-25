# Pipeline Tracker: Complete Technical Product Specification

**Product Name:** Turing Pipeline Tracker
**Owner:** Sam Vangelos, AI Evangelist/Lead — Recruiting @ Turing
**Version:** 1.0
**Last Updated:** January 2026

---

# Executive Summary

## What This Document Is

A comprehensive technical specification for a three-phase recruiting intelligence platform that transforms chaotic Greenhouse ATS data into clean, normalized, role-based dashboards.

## The Three Phases

| Phase | Name | What It Does | Timeline |
|-------|------|--------------|----------|
| **1** | Data Pipeline | Syncs Greenhouse → Supabase, normalizes 110 stages → 7, 391 sources → 9 | 1-2 weeks |
| **2** | Basic Dashboard | Visual kanban, role list, data quality indicators, no auth | 2-3 weeks |
| **3** | Multi-Tenant | Google SSO, RLS, HM dashboard (dept-scoped) + Mission Control (recruiters) | 4-6 weeks |

## Technology Stack

| Layer | Technology |
|-------|------------|
| Database | Supabase (PostgreSQL) |
| Data Sync | GitHub Actions (Node.js) |
| Frontend | Next.js 14 (App Router) |
| Hosting | Vercel |
| Auth | Supabase Auth + Google SSO |
| Source System | Greenhouse Harvest API |

---

# Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [User Personas & Access Model](#2-user-personas--access-model)
3. [Phase 1: Data Pipeline](#3-phase-1-data-pipeline)
4. [Phase 2: Basic Dashboard](#4-phase-2-basic-dashboard)
5. [Phase 3: Multi-Tenant Dual Interface](#5-phase-3-multi-tenant-dual-interface)
6. [Complete Database Schema](#6-complete-database-schema)
7. [API Specifications](#7-api-specifications)
8. [Security & Row Level Security](#8-security--row-level-security)
9. [UI/UX Specifications](#9-uiux-specifications)
10. [Reporting Engine](#10-reporting-engine)
11. [Infrastructure & Deployment](#11-infrastructure--deployment)
12. [Timeline & Milestones](#12-timeline--milestones)
13. [Shared Infrastructure](#13-shared-infrastructure)
14. [Appendices](#14-appendices)

---

# 1. Problem Statement

## Data Chaos in Greenhouse

**Stage Name Proliferation (110 variants → should be 7):**
```
"Application Review" vs "Application review" vs "Recruiter Review"
"Hiring Manager Interview" vs "Hiring Manager interview" vs "HM Interview"
"Round 1 : Product Case by Mayank" vs "Round 1: Product Case" vs "Product Case"
```

**Source Attribution Mess (391 variants → should be 9):**
```
"LinkedIn" vs "linkedin" vs "LinkedIn (Prospecting)" vs "LI Prospecting"
"Indeed" vs "Indeed - Sponsored" vs "Indeed Hiring Platform"
```

## Reporting Limitations

- No clean funnel metrics (passthrough rates, time-in-stage)
- No recruiter-to-recruiter performance comparison
- No visibility into data quality issues
- Manual Excel work required for any analysis
- Hours to pull basic performance metrics

## Access Problem

- HMs have no self-service pipeline visibility
- Either full Greenhouse access or nothing
- Report requests create toil for recruiting ops

## Immediate Need

Sam needs H2 2025 performance metrics for upcoming review:
- Screens conducted
- Passthrough rates
- Source effectiveness
- Offer conversion

---

# 2. User Personas & Access Model

## Personas

### Recruiter (Sam and team)
- Full-cycle recruiters managing multiple requisitions
- Need visibility into ALL roles
- Pull personal performance metrics
- Coordinate with HMs across departments
- **Access:** Full (Mission Control view)

### Hiring Manager
- Engineering/Product/Design managers
- Own 1-5 open requisitions
- Need visibility into THEIR roles only
- Don't want to see other departments
- **Access:** Department-scoped (Kanban view)

### Leader (Director/VP)
- Department heads
- Multiple teams, multiple requisitions
- Aggregate view of department hiring
- **Access:** Department-scoped (Kanban view)

## Access Matrix

| Capability | Recruiter | HM | Leader |
|------------|-----------|-----|--------|
| View all roles | ✓ | ✗ | ✗ |
| View own department roles | ✓ | ✓ | ✓ |
| Mission Control view | ✓ | ✗ | ✗ |
| Kanban board | ✓ | ✓ | ✓ |
| All pipeline metrics | ✓ | ✗ | ✗ |
| Department metrics | ✓ | ✓ | ✓ |
| Recruiter activity reports | ✓ | ✗ | ✗ |
| Export CSV/PDF | ✓ | ✓ | ✓ |
| Manage mappings | ✓ | ✗ | ✗ |

---

# 3. Phase 1: Data Pipeline

## Objectives

1. Extract Sam's H2 2025 scorecard data from Greenhouse
2. Fetch related applications, candidates, jobs, offers
3. Normalize stages (110 → 7) and sources (391 → 9)
4. Store in Supabase with proper relationships
5. Create queryable views
6. Automate daily sync via GitHub Actions

## Architecture Diagram

```
┌─────────────────┐     ┌──────────────────────────┐     ┌─────────────────┐
│   GREENHOUSE    │     │      GITHUB ACTIONS      │     │    SUPABASE     │
│   HARVEST API   │────▶│                          │────▶│                 │
│                 │     │  Workflow: daily 6am PT  │     │  TABLES:        │
│  Endpoints:     │     │                          │     │  • candidates   │
│  /scorecards    │     │  1. Fetch scorecards     │     │  • roles        │
│  /applications  │     │  2. Filter to Sam's      │     │  • pipeline     │
│  /candidates    │     │  3. Fetch applications   │     │  • scorecards   │
│  /jobs          │     │  4. Fetch candidates     │     │  • offers       │
│  /offers        │     │  5. Fetch jobs           │     │  • stage_mappings│
│                 │     │  6. Fetch offers         │     │  • source_mappings│
│                 │     │  7. Upsert all to DB     │     │                 │
└─────────────────┘     └──────────────────────────┘     │  VIEWS:         │
                                                        │  • pipeline_view│
                                                        │  • sam_h2_summary│
                                                        │  • data_quality │
                                                        └─────────────────┘
```

## Data Flow Sequence

```
Step 1: FETCH SCORECARDS
────────────────────────
GET /v1/scorecards?created_after=2025-07-01&per_page=500

Filter locally: submitted_by.id === 5085047004 (Sam)

Output: Scorecard records + unique application_ids


Step 2: FETCH APPLICATIONS
──────────────────────────
For each unique application_id:
  GET /v1/applications/{id}

Output: Application details
Extract: candidate_id, job_id


Step 3: FETCH CANDIDATES (deduplicated)
───────────────────────────────────────
For each unique candidate_id:
  GET /v1/candidates/{id}

Output: Candidate profiles


Step 4: FETCH JOBS (deduplicated)
─────────────────────────────────
For each unique job_id:
  GET /v1/jobs/{id}

Output: Job details with department


Step 5: FETCH OFFERS
────────────────────
For each application_id:
  GET /v1/applications/{id}/offers

Output: Offer records (may be empty)


Step 6: UPSERT TO SUPABASE
──────────────────────────
Order (foreign key dependencies):
1. candidates (no deps)
2. roles (no deps)
3. pipeline (deps: candidates, roles)
4. scorecards (deps: pipeline)
5. offers (deps: pipeline)
6. sync_log (metadata)
```

## Rate Limiting

Greenhouse limit: **50 requests per 10 seconds**

```javascript
const RATE_LIMIT = {
  maxRequests: 50,
  windowMs: 10000,
  currentCount: 0,
  windowStart: Date.now()
};

async function rateLimitedFetch(url) {
  const now = Date.now();

  // Reset window if expired
  if (now - RATE_LIMIT.windowStart >= RATE_LIMIT.windowMs) {
    RATE_LIMIT.currentCount = 0;
    RATE_LIMIT.windowStart = now;
  }

  // Wait if at limit
  if (RATE_LIMIT.currentCount >= RATE_LIMIT.maxRequests) {
    const waitTime = RATE_LIMIT.windowMs - (now - RATE_LIMIT.windowStart) + 100;
    await sleep(waitTime);
    RATE_LIMIT.currentCount = 0;
    RATE_LIMIT.windowStart = Date.now();
  }

  RATE_LIMIT.currentCount++;

  const response = await fetch(url, { headers: { Authorization: AUTH } });

  // Handle 429
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '10');
    await sleep(retryAfter * 1000);
    return rateLimitedFetch(url);
  }

  return response;
}
```

## Canonical Stage Mappings (110 → 7)

| Canonical Stage | Description | Example Raw Stages |
|-----------------|-------------|-------------------|
| **Application Review** | Initial triage | "Application Review", "Recruiter Review", "Hiring Manager Application Review" |
| **Recruiter Screen** | Phone screens | "Recruiter Phone Screen", "Phone Interview", "HR Connect", "Preliminary Screening Call" |
| **HM Screen** | HM initial evaluation | "Hiring Manager Review", "Manager/Tech Screen", "Technical Interview" |
| **Assessment** | Tests, take-homes | "Turing Assessment", "Take Home Test", "Product Case" |
| **Interview Loop** | Full rounds | "Hiring Manager Interview", "VOP", "Onsite Interviews", "Round 1: Product", "Executive Interview" |
| **Offer** | Offer through acceptance | "Offer", "Negotiation", "Compensation discussion" |
| **Other** | Misc | "Reference Check", "Document Submission", "On Hold" |

## Canonical Source Mappings (391 → 9)

| Canonical Source | Description | Example Raw Sources |
|------------------|-------------|-------------------|
| **LinkedIn** | All LinkedIn | "LinkedIn", "LinkedIn (Prospecting)", "LI Prospecting" |
| **Gem** | Gem platform | "Gem", "GEM" |
| **Referral** | Employee referrals | "Referral", "EmployeeReferrals.com" |
| **Internal** | Internal applicants | "Internal Applicant", "Talent Rediscovery" |
| **Job Board** | External boards | "Indeed", "Glassdoor", "BuiltIn", "Wellfound", "Dice" |
| **Website** | Career site | "Jobs page on your website", "MyGreenhouse" |
| **Agency** | Agencies | "Agencies", "Korn Ferry", "Daversa Partners" |
| **Sourcing Tool** | Sourcing platforms | "SeekOut", "hireEZ", "Findem", "Eightfold" |
| **Other** | Everything else | "Other", "Company marketing", "Job fairs" |

## GitHub Actions Workflow

```yaml
name: Greenhouse Sync

on:
  schedule:
    - cron: '0 14 * * *'  # 6:00 AM PT daily
  workflow_dispatch:
    inputs:
      full_sync:
        description: 'Full sync (ignore last sync)'
        default: 'false'
        type: choice
        options: ['false', 'true']

jobs:
  sync:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - name: Run sync
        env:
          GREENHOUSE_API_KEY: ${{ secrets.GREENHOUSE_API_KEY }}
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: npm run sync
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: sync-log-${{ github.run_id }}
          path: sync-log.json
          retention-days: 7
```

## Phase 1 Deliverables

| Deliverable | Validation |
|-------------|------------|
| Supabase project created | Can connect via SQL Editor |
| 8 tables created | Tables visible in Table Editor |
| Stage mappings populated (110) | `SELECT COUNT(*) FROM stage_mappings` = 100+ |
| Source mappings populated (391) | `SELECT COUNT(*) FROM source_mappings` = 200+ |
| GitHub repo with workflow | Repo exists, workflow visible |
| GitHub secrets configured | 3 secrets present |
| Initial sync successful | `SELECT * FROM data_quality` shows counts |
| Views working | `SELECT * FROM sam_h2_summary` returns data |

---

# 4. Phase 2: Basic Dashboard

## Objectives

1. Visual pipeline view (kanban by canonical stage)
2. Role list with counts and health indicators
3. Data quality visibility (unmapped, stale)
4. Filtering by role, stage, source, date
5. Click-through to Greenhouse profiles
6. Manual sync trigger

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Default view, first role selected |
| `/role/[id]` | Role Detail | Kanban for specific role |
| `/data-quality` | Data Quality | Unmapped stages/sources list |

## Component Architecture

```
App
├── Layout
│   ├── Sidebar
│   │   ├── Logo
│   │   ├── RoleList
│   │   │   └── RoleCard (× n)
│   │   └── SyncStatus
│   │
│   └── MainContent
│       ├── Header
│       │   ├── RoleTitle
│       │   └── DataQualityBar
│       │
│       ├── FilterBar
│       │   ├── StageFilter
│       │   ├── SourceFilter
│       │   └── DateRangeFilter
│       │
│       └── KanbanBoard
│           └── StageColumn (× 7 + Unmapped)
│               └── CandidateCard (× n)
```

## Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TURING PIPELINE TRACKER                    Last sync: 2h ago [↻]       │
├────────────────┬────────────────────────────────────────────────────────┤
│ ROLES          │ ⚠ 12 unmapped stages  ⚠ 8 stale candidates            │
│                │                                                        │
│ ┌────────────┐ │ [All Stages ▾] [All Sources ▾] [Last 30d ▾]           │
│ │ Sr PM      │ │                                                        │
│ │ 24 │ 2⚠   │ │ App     │ Recruiter│ HM     │ Interview│ Offer        │
│ └────────────┘ │ Review  │ Screen   │ Screen │ Loop     │              │
│ ┌────────────┐ │  (12)   │   (8)    │  (3)   │   (1)    │  (0)         │
│ │ ML Eng     │ │ ┌─────┐ │ ┌─────┐  │ ┌─────┐│ ┌─────┐  │              │
│ │ 18 │ 1⚠   │ │ │Jane │ │ │Alex │  │ │Chris││ │Dana │  │              │
│ └────────────┘ │ │Acme │ │ │Beta │  │ │Gamma││ │Delta│  │              │
│ ┌────────────┐ │ │ 3d  │ │ │ 7d⚠│  │ │ 2d  ││ │ 1d  │  │              │
│ │ Data Sci   │ │ │ LI  │ │ │ Ref │  │ │ Job ││ │ LI  │  │              │
│ │ 12 │ 0⚠   │ │ └─────┘ │ └─────┘  │ └─────┘│ └─────┘  │              │
│ └────────────┘ │ ┌─────┐ │ ┌─────┐  │        │          │              │
│                │ │Bob  │ │ │Eve  │  │        │          │              │
│                │ └─────┘ │ └─────┘  │        │          │              │
│                │                                                        │
│                │ [Unmapped (4)] ← Red column for unmapped stages        │
└────────────────┴────────────────────────────────────────────────────────┘
```

## CandidateCard Component

```typescript
interface CandidateCardProps {
  id: string;
  name: string;
  company: string | null;
  rawStage: string;
  canonicalSource: string | null;
  daysInStage: number;
  greenhouseUrl: string;
}

// Days badge colors:
// 0-3 days: green
// 4-7 days: yellow
// 8+ days: red
```

## Data Fetching

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// queries/roles.ts
export async function getRoles() {
  const { data, error } = await supabase
    .from('role_summary')
    .select('*')
    .order('total_candidates', { ascending: false });
  return data;
}

// queries/pipeline.ts
export async function getPipelineByRole(roleId: string) {
  const { data, error } = await supabase
    .from('pipeline_view')
    .select('*')
    .eq('role_id', roleId)
    .order('applied_at', { ascending: false });
  return data;
}
```

## Phase 2 Deliverables

| Deliverable | Validation |
|-------------|------------|
| Next.js project created | `npm run dev` works |
| Supabase client connected | Can fetch data |
| Sidebar with role list | Roles appear, selection works |
| Kanban board | Candidates in correct stages |
| Data quality bar | Unmapped/stale counts shown |
| Filtering | Stage/source/date filters work |
| Greenhouse links | Click opens profile |
| Vercel deployment | App live at URL |

---

# 5. Phase 3: Multi-Tenant Dual Interface

## Objectives

1. Add authentication (Google SSO, @turing.com only)
2. Implement role-based access (recruiter, hiring_manager, leader)
3. Create dual interfaces:
   - **HM Dashboard:** Department-scoped kanban
   - **Mission Control:** All-roles aggregate (recruiters only)
4. Add reporting with export (CSV, PDF)
5. Implement audit logging

## Authentication Flow

```
User visits app
      │
      ▼
┌─────────────┐     No      ┌─────────────────┐
│ Authenticated?│───────────▶│   /login        │
└─────────────┘             │ [Sign in Google]│
      │ Yes                 └────────┬────────┘
      │                              │
      ▼                              ▼
┌─────────────┐             ┌─────────────────┐
│ Check role  │             │ Google OAuth    │
└─────────────┘             │ @turing.com only│
      │                     └────────┬────────┘
      │                              │
      ├── recruiter ─────────────────┼──▶ /mission-control
      │                              │
      └── hm/leader ─────────────────┴──▶ /dashboard
```

## Supabase Auth Setup

### Enable Google Provider
1. Supabase → Authentication → Providers → Google
2. Configure OAuth in Google Cloud Console
3. Set redirect: `https://[project].supabase.co/auth/v1/callback`

### Domain Restriction
```sql
CREATE OR REPLACE FUNCTION check_email_domain()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email NOT LIKE '%@turing.com' THEN
    RAISE EXCEPTION 'Only @turing.com allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_turing_domain
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION check_email_domain();
```

### Auto-Create User Record
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'hiring_manager'  -- Default role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Row Level Security Policies

```sql
-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- ROLES TABLE
-- Recruiters see all
CREATE POLICY "recruiters_see_all_roles" ON roles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'recruiter'
  ));

-- HMs/Leaders see their departments
CREATE POLICY "dept_users_see_own_roles" ON roles FOR SELECT
  USING (department_id IN (
    SELECT department_id FROM user_departments WHERE user_id = auth.uid()
  ));

-- PIPELINE TABLE
-- Follows role visibility
CREATE POLICY "pipeline_follows_roles" ON pipeline FOR SELECT
  USING (role_id IN (SELECT id FROM roles));

-- CANDIDATES TABLE
-- Visible if any application visible
CREATE POLICY "candidates_via_pipeline" ON candidates FOR SELECT
  USING (id IN (SELECT candidate_id FROM pipeline));

-- SCORECARDS TABLE
-- Recruiters see all
CREATE POLICY "recruiters_see_all_scorecards" ON scorecards FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'recruiter'
  ));

-- Others via pipeline
CREATE POLICY "scorecards_via_pipeline" ON scorecards FOR SELECT
  USING (application_id IN (SELECT id FROM pipeline));

-- OFFERS TABLE (same pattern)
CREATE POLICY "recruiters_see_all_offers" ON offers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'recruiter'
  ));

CREATE POLICY "offers_via_pipeline" ON offers FOR SELECT
  USING (application_id IN (SELECT id FROM pipeline));
```

## HM Dashboard Interface

```
┌─────────────────────────────────────────────────────────────────────────┐
│  TURING PIPELINE TRACKER            [Sam Vangelos ▾] [Sign Out]         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  MY ROLES                           PIPELINE VIEW                       │
│                                                                         │
│  ┌─────────────────┐                ┌─────────────────────────────────┐ │
│  │ ▸ Engineering   │                │  Senior ML Engineer             │ │
│  │   • Sr ML Eng ◀─┼── selected     │  Engineering • 24 candidates    │ │
│  │   • Platform    │                │                                 │ │
│  │                 │                │  [Filter: Stage ▾] [Source ▾]   │ │
│  │ ▸ Product       │                │                                 │ │
│  │   • Sr PM       │                │  ┌──────┬──────┬──────┬──────┐  │ │
│  └─────────────────┘                │  │App   │Screen│Intv  │Offer │  │ │
│                                     │  │Review│      │Loop  │      │  │ │
│  DEPT SUMMARY                       │  ├──────┼──────┼──────┼──────┤  │ │
│  Open roles: 3                      │  │ ▢ ▢  │ ▢ ▢  │ ▢    │      │  │ │
│  Active cands: 47                   │  │ ▢    │ ▢    │      │      │  │ │
│  Avg time: 4.2d                     │  └──────┴──────┴──────┴──────┘  │ │
│                                     └─────────────────────────────────┘ │
│  [Export Dept Report]               [Export Role Report]                │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key characteristics:**
- Role list filtered to user's departments only
- Department-level summary stats
- Export scoped to visible data

## Mission Control Interface (Recruiters Only)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  MISSION CONTROL                    [Sam Vangelos ▾] [Sign Out]         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│  │   171    │  │   90%    │  │   78%    │  │  12 wks  │                │
│  │  Leads   │  │ Response │  │ Win Rate │  │ Avg TTF  │                │
│  │ Presented│  │   Rate   │  │          │  │          │                │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                │
│                                                                         │
│  [All Departments ▾]  [All Recruiters ▾]  [Search roles...]            │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ROLE                          │ CAND │ RESP │ WIN  │ STATUS     │   │
│  ├───────────────────────────────┼──────┼──────┼──────┼────────────┤   │
│  │ Backend Infrastructure Eng    │   8  │ 89%  │ 72%  │ Searching  │   │
│  │ Engineering • Sam V.          │      │      │      │            │   │
│  ├───────────────────────────────┼──────┼──────┼──────┼────────────┤   │
│  │ Prompt Engineering Specialist │   5  │ 94%  │ 81%  │ Calibrating│   │
│  │ AI/ML • Jordan K.             │      │      │      │            │   │
│  ├───────────────────────────────┼──────┼──────┼──────┼────────────┤   │
│  │ AI Product Designer           │   9  │ 91%  │ 84%  │ Interviewing│  │
│  │ Design • Alex M.              │      │      │      │            │   │
│  └───────────────────────────────┴──────┴──────┴──────┴────────────┘   │
│                                                                         │
│  [Export All] [My Activity Report] [Source Analysis]                    │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key characteristics:**
- All roles across all departments
- Aggregate metrics at top
- Filterable grid
- Recruiter-specific reports

## Phase 3 Deliverables

| Deliverable | Validation |
|-------------|------------|
| Supabase Auth configured | Can sign in with @turing.com |
| Domain restriction working | @gmail.com rejected |
| User table with triggers | New users auto-created |
| Department tables | Departments synced from GH |
| User-department junction | Assignments work |
| RLS policies | HM can't see other depts |
| HM Dashboard | Department-scoped view |
| Mission Control | All roles visible to recruiters |
| Reporting engine | CSV export works |
| Audit logging | report_log populated |

---

# 6. Complete Database Schema

## Entity Relationship Diagram

```
PHASE 1 TABLES
══════════════

stage_mappings                    source_mappings
┌─────────────────────┐           ┌─────────────────────┐
│ id (UUID, PK)       │           │ id (UUID, PK)       │
│ raw_stage (UNIQUE)  │           │ raw_source (UNIQUE) │
│ canonical_stage     │           │ canonical_source    │
│ created_at          │           │ created_at          │
└─────────────────────┘           └─────────────────────┘


candidates                        roles
┌─────────────────────┐           ┌─────────────────────┐
│ id (UUID, PK)       │           │ id (UUID, PK)       │
│ greenhouse_id (UQ)  │           │ greenhouse_job_id(UQ)│
│ name                │           │ title               │
│ current_company     │           │ department          │
│ current_title       │           │ department_id (FK)──┼──┐ Phase 3
│ created_at          │           │ status              │  │
│ updated_at          │           │ created_at          │  │
└─────────┬───────────┘           │ updated_at          │  │
          │                       └─────────┬───────────┘  │
          │                                 │              │
          ▼                                 ▼              │
┌─────────────────────────────────────────────┐           │
│                  pipeline                    │           │
├─────────────────────────────────────────────┤           │
│ id (UUID, PK)                               │           │
│ greenhouse_application_id (UQ)              │           │
│ candidate_id (FK) ───────────▶ candidates   │           │
│ role_id (FK) ────────────────▶ roles        │           │
│ raw_stage, raw_source, status               │           │
│ applied_at, stage_entered_at, rejected_at   │           │
│ last_synced_at                              │           │
└─────────────────┬───────────────────────────┘           │
                  │                                       │
      ┌───────────┴───────────┐                           │
      ▼                       ▼                           │
┌───────────────┐       ┌───────────────┐                 │
│  scorecards   │       │    offers     │                 │
├───────────────┤       ├───────────────┤                 │
│ id (UUID, PK) │       │ id (UUID, PK) │                 │
│ gh_scorecard_id│      │ gh_offer_id   │                 │
│ application_id│       │ application_id│                 │
│ submitted_by_id│      │ status        │                 │
│ submitted_at  │       │ created_at    │                 │
│ overall_rec   │       │ sent_at       │                 │
│ interview_name│       │ resolved_at   │                 │
└───────────────┘       └───────────────┘                 │
                                                          │
                                                          │
PHASE 3 TABLES                                            │
══════════════                                            │
                                                          │
┌─────────────────────┐                                   │
│    departments      │◀──────────────────────────────────┘
├─────────────────────┤
│ id (UUID, PK)       │
│ name                │
│ greenhouse_dept_id  │
└─────────┬───────────┘
          │
          │
┌─────────┴───────────┐       ┌─────────────────────┐
│       users         │       │  user_departments   │
├─────────────────────┤       ├─────────────────────┤
│ id (UUID, PK)       │◀──────│ user_id (FK, PK)    │
│ email (UNIQUE)      │       │ department_id(FK,PK)│
│ name                │       └─────────────────────┘
│ role (enum)         │
│ created_at          │       ┌─────────────────────┐
│ updated_at          │       │    report_log       │
└─────────────────────┘       ├─────────────────────┤
                              │ id (UUID, PK)       │
                              │ user_id (FK)        │
                              │ report_type         │
                              │ filters (JSONB)     │
                              │ row_count           │
                              │ created_at          │
                              └─────────────────────┘
```

## Complete SQL

```sql
-- ============================================
-- PHASE 1: CORE TABLES
-- ============================================

CREATE TABLE stage_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_stage TEXT UNIQUE NOT NULL,
    canonical_stage TEXT NOT NULL CHECK (canonical_stage IN (
        'Application Review', 'Recruiter Screen', 'HM Screen',
        'Assessment', 'Interview Loop', 'Offer', 'Other'
    )),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE source_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_source TEXT UNIQUE NOT NULL,
    canonical_source TEXT NOT NULL CHECK (canonical_source IN (
        'LinkedIn', 'Gem', 'Referral', 'Internal', 'Job Board',
        'Website', 'Agency', 'Sourcing Tool', 'Other'
    )),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    greenhouse_id BIGINT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    current_company TEXT,
    current_title TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    greenhouse_job_id BIGINT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    department TEXT,
    department_id UUID,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pipeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    greenhouse_application_id BIGINT UNIQUE NOT NULL,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    raw_stage TEXT NOT NULL,
    raw_source TEXT,
    status TEXT,
    applied_at TIMESTAMPTZ,
    stage_entered_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    last_synced_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(candidate_id, role_id)
);

CREATE TABLE scorecards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    greenhouse_scorecard_id BIGINT UNIQUE NOT NULL,
    greenhouse_application_id BIGINT NOT NULL,
    application_id UUID REFERENCES pipeline(id) ON DELETE CASCADE,
    submitted_by_id BIGINT NOT NULL,
    submitted_at TIMESTAMPTZ,
    overall_recommendation TEXT,
    interview_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    greenhouse_offer_id BIGINT UNIQUE NOT NULL,
    greenhouse_application_id BIGINT NOT NULL,
    application_id UUID REFERENCES pipeline(id) ON DELETE CASCADE,
    status TEXT,
    created_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    starts_at TIMESTAMPTZ
);

CREATE TABLE sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sync_type TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,
    records_processed INT DEFAULT 0,
    records_created INT DEFAULT 0,
    records_updated INT DEFAULT 0,
    errors JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'running'
);

-- Indexes
CREATE INDEX idx_pipeline_candidate ON pipeline(candidate_id);
CREATE INDEX idx_pipeline_role ON pipeline(role_id);
CREATE INDEX idx_pipeline_stage ON pipeline(raw_stage);
CREATE INDEX idx_pipeline_applied ON pipeline(applied_at);
CREATE INDEX idx_scorecards_submitted_by ON scorecards(submitted_by_id);
CREATE INDEX idx_scorecards_submitted_at ON scorecards(submitted_at);

-- ============================================
-- PHASE 3: MULTI-TENANT TABLES
-- ============================================

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    greenhouse_department_id BIGINT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'hiring_manager'
        CHECK (role IN ('recruiter', 'hiring_manager', 'leader')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_departments (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, department_id)
);

CREATE TABLE report_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    report_type TEXT NOT NULL,
    filters JSONB NOT NULL DEFAULT '{}'::jsonb,
    row_count INT,
    format TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE roles ADD CONSTRAINT fk_roles_department
    FOREIGN KEY (department_id) REFERENCES departments(id);

-- ============================================
-- VIEWS
-- ============================================

CREATE OR REPLACE VIEW pipeline_view AS
SELECT
    p.id,
    p.greenhouse_application_id,
    c.id AS candidate_id,
    c.name AS candidate_name,
    c.current_company,
    r.id AS role_id,
    r.title AS role_title,
    r.department,
    p.raw_stage,
    COALESCE(sm.canonical_stage, 'Unmapped') AS canonical_stage,
    p.raw_source,
    COALESCE(src.canonical_source, 'Other') AS canonical_source,
    p.status AS application_status,
    p.applied_at,
    p.stage_entered_at,
    EXTRACT(DAY FROM (now() - p.stage_entered_at))::INT AS days_in_stage,
    'https://app.greenhouse.io/people/' || c.greenhouse_id AS greenhouse_url
FROM pipeline p
LEFT JOIN candidates c ON p.candidate_id = c.id
LEFT JOIN roles r ON p.role_id = r.id
LEFT JOIN stage_mappings sm ON LOWER(TRIM(p.raw_stage)) = LOWER(TRIM(sm.raw_stage))
LEFT JOIN source_mappings src ON LOWER(TRIM(p.raw_source)) = LOWER(TRIM(src.raw_source));

CREATE OR REPLACE VIEW data_quality AS
SELECT
    (SELECT COUNT(*) FROM pipeline WHERE raw_stage NOT IN
        (SELECT raw_stage FROM stage_mappings)) AS unmapped_stage_count,
    (SELECT COUNT(*) FROM pipeline WHERE raw_source NOT IN
        (SELECT raw_source FROM source_mappings)) AS unmapped_source_count,
    (SELECT COUNT(*) FROM pipeline_view WHERE days_in_stage > 14) AS stale_count,
    (SELECT COUNT(*) FROM pipeline) AS total_pipeline,
    (SELECT COUNT(*) FROM candidates) AS total_candidates,
    (SELECT COUNT(*) FROM roles) AS total_roles,
    (SELECT COUNT(*) FROM scorecards) AS total_scorecards;

CREATE OR REPLACE VIEW sam_h2_summary AS
SELECT
    COUNT(*) AS total_screens,
    COUNT(DISTINCT greenhouse_application_id) AS unique_applications,
    COUNT(*) FILTER (WHERE overall_recommendation IN ('yes', 'strong_yes')) AS passed,
    COUNT(*) FILTER (WHERE overall_recommendation IN ('no', 'definitely_not')) AS rejected,
    ROUND(100.0 * COUNT(*) FILTER (WHERE overall_recommendation IN ('yes', 'strong_yes'))
        / NULLIF(COUNT(*), 0), 1) AS passthrough_rate
FROM scorecards
WHERE submitted_by_id = 5085047004
AND submitted_at >= '2025-07-01';
```

---

# 7. API Specifications

## Greenhouse Harvest API

**Base URL:** `https://harvest.greenhouse.io/v1`

**Authentication:**
```
Authorization: Basic {base64(api_key + ':')}
```

**Rate Limit:** 50 requests / 10 seconds

### Endpoints

| Endpoint | Method | Key Params |
|----------|--------|------------|
| `/scorecards` | GET | `created_after`, `per_page`, `page` |
| `/applications/{id}` | GET | — |
| `/candidates/{id}` | GET | — |
| `/jobs/{id}` | GET | — |
| `/applications/{id}/offers` | GET | — |
| `/departments` | GET | `per_page`, `page` |

## Supabase Queries

```typescript
// Role list
const { data: roles } = await supabase
  .from('role_summary')
  .select('*')
  .order('total_candidates', { ascending: false });

// Pipeline for role (RLS applied)
const { data } = await supabase
  .from('pipeline_view')
  .select('*')
  .eq('role_id', roleId);

// Upsert pattern
const { data, error } = await supabase
  .from('candidates')
  .upsert(record, { onConflict: 'greenhouse_id' })
  .select('id')
  .single();
```

---

# 8. Security & Row Level Security

## Authentication

| Mechanism | Implementation |
|-----------|----------------|
| Provider | Supabase Auth + Google OAuth |
| Domain | @turing.com only |
| Session | JWT via Supabase client |

## Authorization via RLS

| Table | Recruiter | HM/Leader |
|-------|-----------|-----------|
| roles | All | Own department |
| pipeline | All | Via role access |
| candidates | All | Via pipeline access |
| scorecards | All | Via pipeline access |
| offers | All | Via pipeline access |
| report_log | All | Own only |

## Secrets Management

| Secret | Location | Purpose |
|--------|----------|---------|
| GREENHOUSE_API_KEY | GitHub Secrets | API auth |
| SUPABASE_URL | GitHub + Vercel | DB connection |
| SUPABASE_SERVICE_ROLE_KEY | GitHub + Vercel (server) | Full DB access |
| SUPABASE_ANON_KEY | Vercel (public) | Client queries (RLS) |

---

# 9. UI/UX Specifications

## Design System

```css
/* Colors */
--bg-primary: #0d1117;
--bg-secondary: #161b22;
--border: #30363d;
--text-primary: #c9d1d9;
--text-muted: #8b949e;
--accent-green: #238636;
--accent-yellow: #d29922;
--accent-red: #f85149;
--accent-blue: #58a6ff;

/* Typography */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial;

/* Spacing */
--space-1: 4px;
--space-2: 8px;
--space-4: 16px;
--space-6: 24px;
```

## Component States

**CandidateCard:**
- Default: bg-secondary, border-default
- Hover: border-accent-blue
- Stale (>7d): border-accent-yellow
- Very stale (>14d): border-accent-red

**Days Badge:**
- 0-3 days: green
- 4-7 days: yellow
- 8+ days: red

---

# 10. Reporting Engine

## Pre-Built Reports

| Report | Available To | Description |
|--------|--------------|-------------|
| Pipeline Snapshot | All | Current candidates by stage |
| Source Effectiveness | All | Conversion rates by source |
| Time-in-Stage | All | Avg days per stage |
| Recruiter Activity | Recruiters | Screens, passthrough |
| Department Summary | HMs/Leaders | Dept aggregate |

## Export Formats

- **CSV:** Direct download
- **PDF:** Future (react-pdf or puppeteer)

## Audit Logging

```sql
INSERT INTO report_log (user_id, report_type, filters, row_count, format)
VALUES (auth.uid(), 'pipeline_snapshot', '{"role_ids": [...]}', 47, 'csv');
```

---

# 11. Infrastructure & Deployment

## Architecture

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   GITHUB    │     │    SUPABASE     │     │     VERCEL      │
│             │     │                 │     │                 │
│ Repository  │     │ • PostgreSQL    │◀────│ • Next.js 14    │
│ • Sync code │────▶│ • Auth          │     │ • Auto-deploy   │
│ • Actions   │     │ • RLS           │     │ • Edge          │
│ • Secrets   │     │                 │     │                 │
└─────────────┘     └─────────────────┘     └─────────────────┘
```

## Deployment

**Frontend (Vercel):**
- Push to main → auto-deploy
- Preview deployments on PR

**Data Sync (GitHub Actions):**
- Scheduled: Daily 6am PT
- Manual: workflow_dispatch

## Cost

| Service | Tier | Cost |
|---------|------|------|
| Supabase | Free | $0 |
| Vercel | Hobby | $0 |
| GitHub Actions | Free | $0 |
| **Total** | | **$0** |

---

# 12. Timeline & Milestones

| Phase | Weeks | Milestone |
|-------|-------|-----------|
| **1** | 1-2 | Sam can query H2 metrics via SQL |
| **2** | 3-5 | Recruiting team has visual pipeline |
| **3** | 6-10 | Org-wide tool with role-based access |

## Phase 1 Tasks (Weeks 1-2)
- [x] Supabase project setup
- [x] Schema creation
- [x] Stage mappings (110)
- [x] Source mappings (391)
- [ ] GitHub Actions workflow
- [ ] Sync script
- [ ] Initial sync
- [ ] Validation

## Phase 2 Tasks (Weeks 3-5)
- [ ] Next.js setup
- [ ] Supabase client
- [ ] Role list component
- [ ] Kanban board
- [ ] Filtering
- [ ] Data quality bar
- [ ] Vercel deployment

## Phase 3 Tasks (Weeks 6-10)
- [ ] Supabase Auth + Google SSO
- [ ] Domain restriction
- [ ] User/department tables
- [ ] RLS policies
- [ ] HM Dashboard
- [ ] Mission Control
- [ ] Reporting engine
- [ ] Audit logging

---

# 13. Shared Infrastructure

This tool is part of the Turing Recruiting AI suite. See **[Shared Infrastructure Reference](./shared-infrastructure.md)** for common components including:

- Greenhouse API client (auth, rate limiting, pagination)
- Shared database tables (candidates, roles, pipeline)
- Supabase configuration
- Authentication setup
- Design system

**Pipeline Tracker's Role in Shared Infrastructure:**
- **Owns:** Greenhouse sync process, candidate/role/pipeline tables, stage/source mappings
- **Provides to other tools:** Normalized candidate and application data
- **Rosie** reads from Greenhouse directly (stateless) but uses same API patterns
- **TuriCRM** reads from Pipeline Tracker's tables and adds enriched_profiles layer

---

# 14. Appendices

## A. File Structure

```
recruiting-intelligence/          # Data sync repo
├── .github/workflows/
│   └── greenhouse-sync.yml
├── src/
│   └── index.js
├── sql/
│   ├── schema.sql
│   ├── stage-mappings.sql
│   ├── source-mappings.sql
│   └── views.sql
├── package.json
└── README.md

pipeline-tracker/                 # Dashboard repo
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/page.tsx
│   ├── mission-control/page.tsx
│   ├── role/[id]/page.tsx
│   └── login/page.tsx
├── components/
│   ├── RoleList.tsx
│   ├── KanbanBoard.tsx
│   ├── CandidateCard.tsx
│   └── ...
├── lib/
│   ├── supabase.ts
│   └── queries.ts
├── middleware.ts
└── package.json
```

## B. Key Decisions

| Decision | Rationale |
|----------|-----------|
| Scorecards as primary source | Filters to actual screens, not just touched candidates |
| GitHub Actions over Edge Functions | Handles >60s sync without timeout |
| 7 canonical stages | Balances detail with simplicity |
| 9 canonical sources | Covers major channels |
| RLS over app-level auth | Simpler, database-enforced |
| Dark theme | Matches Boolean IDE aesthetic |

## C. Open Questions

| Question | Status |
|----------|--------|
| User provisioning workflow | Manual SQL for MVP |
| PDF generation library | TBD |
| Real-time updates | Deferred |
| Custom domain | Deferred |

---

*Document version: 1.0*
*Created: January 2026*
*Author: Sam Vangelos + Claude*
*Part of: Turing Recruiting AI Tool Suite*
*Related docs: [Rosie](./rosie-resume-screener-spec.md), [TuriCRM](./turicrm-talent-intelligence-spec.md), [Shared Infrastructure](./shared-infrastructure.md)*
