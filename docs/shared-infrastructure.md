# Shared Infrastructure Reference

**Turing Recruiting AI Tools — Common Components**
**Owner:** Sam Vangelos
**Last Updated:** January 2026

---

# Overview

This document defines shared infrastructure components across the Turing Recruiting AI tool suite:

| Tool | Purpose | Shared Components Used |
|------|---------|----------------------|
| **Pipeline Tracker** | Pipeline visibility & metrics | Greenhouse sync, candidate/job tables, auth |
| **Rosie** | Resume screening & ranking | Greenhouse API client, rate limiting |
| **TuriCRM** | Talent search & rediscovery | Greenhouse sync, candidate tables, enrichment layer |
| **Search Kit Library** | Boolean sourcing generation | Design system (standalone, no Greenhouse) |
| **Sourcing Copilot** | HM collaboration + DSM learning | Greenhouse sync, candidate tables, auth |

**Principle:** Build once, use everywhere. Each tool adds its own layer on top of shared foundations.

---

# 1. Greenhouse API Client

## Authentication

All tools use the same authentication pattern:

```javascript
const GREENHOUSE_API_KEY = process.env.GREENHOUSE_API_KEY;
const AUTH_HEADER = 'Basic ' + Buffer.from(GREENHOUSE_API_KEY + ':').toString('base64');

const headers = {
  'Authorization': AUTH_HEADER,
  'Content-Type': 'application/json'
};
```

## Base Configuration

```javascript
const GREENHOUSE_CONFIG = {
  baseUrl: 'https://harvest.greenhouse.io/v1',
  maxPerPage: 500,
  rateLimit: {
    maxRequests: 50,
    windowMs: 10000  // 10 seconds
  }
};
```

## Rate Limiting

**Greenhouse limit:** 50 requests per 10 seconds

All tools must implement this rate limiter:

```javascript
class GreenhouseRateLimiter {
  constructor() {
    this.requests = [];
    this.windowMs = 10000;
    this.maxRequests = 50;
  }

  async throttle() {
    const now = Date.now();
    // Remove requests outside window
    this.requests = this.requests.filter(t => now - t < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest) + 100;
      await this.sleep(waitTime);
      return this.throttle(); // Recheck after waiting
    }

    this.requests.push(now);
  }

  async fetch(url, options = {}) {
    await this.throttle();

    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers }
    });

    // Handle 429 Too Many Requests
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After') || '10');
      await this.sleep(retryAfter * 1000);
      return this.fetch(url, options); // Retry
    }

    return response;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const greenhouse = new GreenhouseRateLimiter();
```

## Pagination

All list endpoints use the same pagination pattern:

```javascript
async function fetchAllPages(endpoint, params = {}) {
  const results = [];
  let page = 1;

  while (true) {
    const url = new URL(`${GREENHOUSE_CONFIG.baseUrl}${endpoint}`);
    url.searchParams.set('per_page', GREENHOUSE_CONFIG.maxPerPage);
    url.searchParams.set('page', page);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const response = await greenhouse.fetch(url.toString());
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) break;

    results.push(...data);

    if (data.length < GREENHOUSE_CONFIG.maxPerPage) break;
    page++;
  }

  return results;
}
```

## Common Endpoints

| Endpoint | Used By | Purpose |
|----------|---------|---------|
| `GET /candidates` | TuriCRM | Bulk candidate list |
| `GET /candidates/{id}` | All | Single candidate details |
| `GET /candidates/{id}/attachments` | Rosie, TuriCRM | Resume download |
| `GET /applications` | Pipeline Tracker, TuriCRM | Application list with filters |
| `GET /applications/{id}` | All | Single application details |
| `GET /jobs` | All | Job list |
| `GET /jobs/{id}` | Pipeline Tracker, Rosie | Job details |
| `GET /jobs/{id}/applications` | Rosie | Applicants for specific job |
| `GET /scorecards` | Pipeline Tracker | Interview feedback |
| `GET /applications/{id}/offers` | Pipeline Tracker | Offer data |
| `GET /departments` | Pipeline Tracker | Department list |

---

# 2. Shared Database Schema

## Core Tables (Pipeline Tracker Owns, Others Read)

These tables are created and maintained by Pipeline Tracker's sync process. Other tools can read from them.

### candidates

```sql
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    greenhouse_id BIGINT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    current_company TEXT,
    current_title TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_candidates_greenhouse_id ON candidates(greenhouse_id);
CREATE INDEX idx_candidates_name ON candidates(name);
```

### roles (Jobs)

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    greenhouse_job_id BIGINT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    department TEXT,
    department_id UUID REFERENCES departments(id),
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_roles_greenhouse_job_id ON roles(greenhouse_job_id);
CREATE INDEX idx_roles_status ON roles(status);
```

### pipeline (Applications)

```sql
CREATE TABLE pipeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    greenhouse_application_id BIGINT UNIQUE NOT NULL,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    raw_stage TEXT NOT NULL,
    raw_source TEXT,
    status TEXT,  -- active, rejected, hired
    applied_at TIMESTAMPTZ,
    stage_entered_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    last_synced_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(candidate_id, role_id)
);

CREATE INDEX idx_pipeline_candidate_id ON pipeline(candidate_id);
CREATE INDEX idx_pipeline_role_id ON pipeline(role_id);
CREATE INDEX idx_pipeline_status ON pipeline(status);
CREATE INDEX idx_pipeline_applied_at ON pipeline(applied_at);
```

## Tool-Specific Tables

### Pipeline Tracker Specific

```sql
-- Stage normalization (110 → 7)
CREATE TABLE stage_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_stage TEXT UNIQUE NOT NULL,
    canonical_stage TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Source normalization (391 → 9)
CREATE TABLE source_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    raw_source TEXT UNIQUE NOT NULL,
    canonical_source TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Interview scorecards
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

-- Offers
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

-- Departments (for Phase 3 RBAC)
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    greenhouse_department_id BIGINT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Users (for Phase 3 RBAC)
CREATE TABLE users (
    id UUID PRIMARY KEY,  -- Matches Supabase Auth
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'hiring_manager',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- User-Department mapping
CREATE TABLE user_departments (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (user_id, department_id)
);
```

### TuriCRM Specific

```sql
-- AI-enriched candidate profiles
CREATE TABLE enriched_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,

    -- Extracted fields
    current_title TEXT,
    seniority TEXT,  -- Junior, Mid, Senior, Staff, Principal, Executive
    location TEXT,

    -- JSONB for flexible querying
    skills JSONB,        -- [{name, confidence: 1-5}]
    technologies JSONB,  -- ["React", "AWS"]
    domains JSONB,       -- ["Web Development", "ML"]
    industries JSONB,    -- ["Healthcare", "Fintech"]
    companies JSONB,     -- ["Google", "Stripe"]
    education JSONB,     -- [{degree, institution, field}]
    experience JSONB,    -- {total: X, by_area: {...}}
    certifications JSONB,
    languages JSONB,     -- Spoken languages
    soft_skills JSONB,

    -- Metadata
    raw_enrichment JSONB,  -- Full AI response
    enriched_at TIMESTAMPTZ DEFAULT now(),
    model_version TEXT,

    UNIQUE(candidate_id)
);

-- GIN indexes for JSONB queries
CREATE INDEX idx_enriched_skills ON enriched_profiles USING GIN (skills);
CREATE INDEX idx_enriched_technologies ON enriched_profiles USING GIN (technologies);
CREATE INDEX idx_enriched_industries ON enriched_profiles USING GIN (industries);
CREATE INDEX idx_enriched_companies ON enriched_profiles USING GIN (companies);
CREATE INDEX idx_enriched_seniority ON enriched_profiles(seniority);
```

### Search Kit Library Specific

```sql
-- Generated boolean kits
CREATE TABLE search_kits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_title TEXT NOT NULL,
    company TEXT,
    created_by TEXT NOT NULL,
    input_jd TEXT NOT NULL,
    input_intake TEXT,
    kit_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Email-based favorites
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    search_kit_id UUID NOT NULL REFERENCES search_kits(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_email, search_kit_id)
);
```

### Sourcing Copilot Specific

```sql
-- Sourcing projects
CREATE TABLE searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(id),
    role_title TEXT NOT NULL,
    department TEXT,
    level TEXT,
    status TEXT DEFAULT 'searching',
    criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
    hm_id UUID REFERENCES users(id),
    recruiter_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Candidates presented for a search
CREATE TABLE sourced_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_id UUID NOT NULL REFERENCES searches(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id),
    candidate_snapshot JSONB NOT NULL,
    source TEXT,
    recruiter_notes TEXT,
    model_score NUMERIC(5,2),
    model_signals JSONB,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(search_id, candidate_id)
);

-- HM feedback (training data for DSM)
CREATE TABLE sourcing_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sourced_candidate_id UUID NOT NULL REFERENCES sourced_candidates(id) ON DELETE CASCADE,
    search_id UUID NOT NULL REFERENCES searches(id),
    candidate_id UUID NOT NULL REFERENCES candidates(id),
    candidate_snapshot JSONB NOT NULL,
    reviewer_id UUID NOT NULL REFERENCES users(id),
    rating TEXT NOT NULL,
    positive_signals TEXT,
    negative_signals TEXT,
    review_phase TEXT DEFAULT 'review',
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### Rosie Specific

Rosie is stateless — no persistent tables. Session data lives in memory/browser.

---

# 3. Supabase Configuration

## Project Setup

All tools share a single Supabase project:

| Setting | Value |
|---------|-------|
| Project Name | `turing-recruiting` |
| Region | West US (or closest to team) |
| Database Password | Stored in password manager |

## Environment Variables

```bash
# All tools need these
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=eyJ...      # For client-side (RLS enforced)
SUPABASE_SERVICE_ROLE_KEY=eyJ... # For server-side (bypasses RLS)

# Greenhouse (all tools except Search Kit Library)
GREENHOUSE_API_KEY=...

# Claude API (Search Kit Library, Rosie, TuriCRM)
ANTHROPIC_API_KEY=...
```

## Client Initialization

### Server-Side (Node.js / GitHub Actions)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Bypasses RLS
);
```

### Client-Side (Next.js Browser)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  // RLS enforced
);
```

## Upsert Pattern

All tools use the same upsert pattern for idempotent writes:

```javascript
async function upsertCandidate(candidate) {
  const { data, error } = await supabase
    .from('candidates')
    .upsert({
      greenhouse_id: candidate.id,
      name: `${candidate.first_name} ${candidate.last_name}`.trim(),
      current_company: candidate.company,
      current_title: candidate.title,
      email: candidate.email_addresses?.[0]?.value,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'greenhouse_id'
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}
```

---

# 4. Authentication (Phase 3)

## Supabase Auth + Google SSO

Shared auth configuration for all tools requiring login:

### Provider Setup

1. Supabase Dashboard → Authentication → Providers → Google
2. Google Cloud Console → Create OAuth credentials
3. Authorized redirect: `https://[project-ref].supabase.co/auth/v1/callback`

### Domain Restriction

```sql
-- Trigger to enforce @turing.com emails
CREATE OR REPLACE FUNCTION check_email_domain()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email NOT LIKE '%@turing.com' THEN
    RAISE EXCEPTION 'Only @turing.com email addresses allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_turing_domain
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION check_email_domain();
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
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

### Next.js Middleware

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Protect routes
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}
```

---

# 5. Technology Stack

## Shared Across All Tools

| Layer | Technology | Version |
|-------|------------|---------|
| Database | Supabase (PostgreSQL) | Latest |
| Frontend | Next.js | 14.x (App Router) |
| Hosting | Vercel | — |
| Styling | Tailwind CSS | 3.x |
| Icons | Lucide React | Latest |
| State | React hooks | — |

## Tool-Specific Additions

| Tool | Additional Tech |
|------|-----------------|
| Pipeline Tracker | GitHub Actions (sync), RLS policies |
| Rosie | LLM API (Claude/GPT-4), PDF parsing |
| TuriCRM | LLM API (Claude), JSONB queries, GIN indexes |
| Search Kit Library | LLM API (Claude Opus 4.5), prompt caching |
| Sourcing Copilot | LLM API (Claude), embeddings (future) |

## LLM Configuration

```javascript
// Anthropic Claude (preferred)
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function callClaude(prompt, options = {}) {
  const response = await anthropic.messages.create({
    model: options.model || 'claude-sonnet-4-20250514',
    max_tokens: options.maxTokens || 4000,
    temperature: options.temperature || 0,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.content[0].text;
}
```

---

# 6. Design System

## Shared Visual Language

All tools use the same dark theme for consistency:

```css
:root {
  /* Backgrounds */
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --bg-tertiary: #21262d;

  /* Borders */
  --border-default: #30363d;
  --border-muted: #21262d;

  /* Text */
  --text-primary: #c9d1d9;
  --text-secondary: #8b949e;
  --text-muted: #6e7681;

  /* Accents */
  --accent-green: #238636;
  --accent-blue: #58a6ff;
  --accent-yellow: #d29922;
  --accent-red: #f85149;
  --accent-purple: #a371f7;
  --accent-cyan: #39c5cf;
  --accent-orange: #f0883e;

  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace;
}
```

## Component Patterns

Shared component behaviors:

| Component | Behavior |
|-----------|----------|
| Cards | bg-secondary, border-default, hover:border-accent-blue |
| Buttons (primary) | bg-accent-green, hover:opacity-90 |
| Buttons (secondary) | bg-transparent, border-default |
| Badges (success) | bg-accent-green/20, text-accent-green |
| Badges (warning) | bg-accent-yellow/20, text-accent-yellow |
| Badges (error) | bg-accent-red/20, text-accent-red |

---

# 7. Data Flow Architecture

## How Tools Interact with Shared Data

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              GREENHOUSE ATS                                 │
│                           (Source of Truth)                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌───────────┐   ┌───────────┐   ┌───────────┐
            │  PIPELINE │   │   ROSIE   │   │  TURICRM  │
            │  TRACKER  │   │           │   │           │
            │           │   │ Stateless │   │           │
            │  Syncs:   │   │           │   │  Reads:   │
            │  • Daily  │   │  Reads:   │   │  • From   │
            │  • Full   │   │  • Jobs   │   │    shared │
            │    data   │   │  • Apps   │   │    tables │
            └─────┬─────┘   │  • Resumes│   │           │
                  │         └───────────┘   │  Writes:  │
                  │                         │  • Enriched│
                  ▼                         │    profiles│
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SUPABASE                                       │
│                                                                             │
│  SHARED TABLES (Pipeline Tracker writes, others read):                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                         │
│  │ candidates  │  │    roles    │  │  pipeline   │                         │
│  └─────────────┘  └─────────────┘  └─────────────┘                         │
│                                                                             │
│  PIPELINE TRACKER:    TURICRM:           SEARCH KIT:      SOURCING COPILOT:│
│  ┌─────────────┐     ┌──────────────┐   ┌────────────┐   ┌───────────────┐ │
│  │ scorecards  │     │enriched_     │   │search_kits │   │searches       │ │
│  │ offers      │     │profiles      │   │user_       │   │sourced_       │ │
│  │ stage_      │     └──────────────┘   │favorites   │   │candidates     │ │
│  │ mappings    │                        └────────────┘   │sourcing_      │ │
│  └─────────────┘                                         │feedback       │ │
│                                                          └───────────────┘ │
│  ROSIE: No persistent tables (stateless)                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Sync Responsibilities

| Table | Written By | Read By |
|-------|------------|---------|
| candidates | Pipeline Tracker | TuriCRM, Sourcing Copilot |
| roles | Pipeline Tracker | TuriCRM, Sourcing Copilot |
| pipeline | Pipeline Tracker | TuriCRM, Sourcing Copilot |
| scorecards | Pipeline Tracker | Pipeline Tracker |
| offers | Pipeline Tracker | Pipeline Tracker |
| stage_mappings | Pipeline Tracker | Pipeline Tracker |
| source_mappings | Pipeline Tracker | Pipeline Tracker |
| enriched_profiles | TuriCRM | TuriCRM |
| search_kits | Search Kit Library | Search Kit Library |
| searches | Sourcing Copilot | Sourcing Copilot |
| sourcing_feedback | Sourcing Copilot | Sourcing Copilot |

---

# 8. Error Handling Patterns

## API Errors

```javascript
class GreenhouseError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.status = status;
    this.endpoint = endpoint;
  }
}

async function handleApiResponse(response, endpoint) {
  if (!response.ok) {
    if (response.status === 401) {
      throw new GreenhouseError('Invalid API key', 401, endpoint);
    }
    if (response.status === 404) {
      throw new GreenhouseError('Resource not found', 404, endpoint);
    }
    if (response.status === 429) {
      // Handled by rate limiter, shouldn't reach here
      throw new GreenhouseError('Rate limited', 429, endpoint);
    }
    throw new GreenhouseError(`API error: ${response.statusText}`, response.status, endpoint);
  }
  return response.json();
}
```

## Database Errors

```javascript
async function safeUpsert(table, record, conflictColumn) {
  try {
    const { data, error } = await supabase
      .from(table)
      .upsert(record, { onConflict: conflictColumn })
      .select()
      .single();

    if (error) {
      console.error(`Upsert failed for ${table}:`, error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (e) {
    console.error(`Unexpected error upserting to ${table}:`, e);
    return { success: false, error: e };
  }
}
```

---

# 9. Deployment Patterns

## GitHub Actions (Data Sync)

Used by: Pipeline Tracker, TuriCRM (enrichment)

```yaml
name: Scheduled Sync

on:
  schedule:
    - cron: '0 14 * * *'  # 6:00 AM PT
  workflow_dispatch:

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
```

## Vercel (Frontend)

Used by: All tools

- Auto-deploy from `main` branch
- Preview deployments on PRs
- Environment variables in Vercel dashboard

---

# Appendix: Quick Reference

## Greenhouse API Limits

| Limit | Value |
|-------|-------|
| Rate limit | 50 requests / 10 seconds |
| Max per_page | 500 |
| Timeout | 30 seconds |

## Canonical Stages (Pipeline Tracker)

| Canonical | Maps From (Examples) |
|-----------|---------------------|
| Application Review | "Application Review", "Recruiter Review" |
| Recruiter Screen | "Phone Screen", "HR Connect" |
| HM Screen | "Hiring Manager Review", "Tech Screen" |
| Assessment | "Take Home", "Turing Assessment" |
| Interview Loop | "Onsite", "Final Round", "VOP" |
| Offer | "Offer", "Negotiation" |
| Other | "Reference Check", "On Hold" |

## Canonical Sources (Pipeline Tracker)

| Canonical | Maps From (Examples) |
|-----------|---------------------|
| LinkedIn | "LinkedIn", "LinkedIn (Prospecting)" |
| Gem | "Gem", "GEM" |
| Referral | "Referral", "Employee Referral" |
| Internal | "Internal Applicant" |
| Job Board | "Indeed", "Glassdoor", "BuiltIn" |
| Website | "Jobs page on your website" |
| Agency | "Agencies", "Korn Ferry" |
| Sourcing Tool | "SeekOut", "hireEZ", "Findem" |
| Other | Everything else |

---

*Document version: 1.1*
*Created: January 2026*
*Updated: January 2026 (added Search Kit Library, Sourcing Copilot)*
*Purpose: Single source of truth for shared infrastructure across Recruiting AI tools*
