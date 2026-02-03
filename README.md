# Search Kit Library

A boolean sourcing kit generator and library for technical recruiters. Built with Next.js 14, Supabase, and Claude API.

**Live:** [search-kit-library.vercel.app](https://search-kit-library.vercel.app)

---

## What It Does

Search Kit Library generates role-specific boolean search strings for LinkedIn Recruiter. Paste a job description, and Claude produces a structured library of search terms organized by:

- **Blocks** - Core competency domains (e.g., "Post-Training & RLHF", "Code Evaluation")
- **Sub-blocks** - Search angles: Concepts, Methods, Tools
- **Clusters** - Precision levels: Recall (broad) and Precision (specific)
- **Groups** - Semantic neighborhoods: one concept + its variants as a copyable boolean

Recruiters copy individual groups or combine them with AND operators to build targeted searches.

---

## Features

### Kit Generation
- Paste job description + optional intake notes
- Claude (Opus 4.5) generates complete boolean library in 30-60 seconds
- Powered by **Boolean Construction Template v6.0** - signal-based generation with Recall/Precision clusters

### Kit Library
- Browse all generated kits
- Search by role title, company, creator, or keywords
- Favorite kits (synced via email across devices)

### Kit Detail View
- Role summary with core function, technical domain, key deliverables, stakeholders
- **Archetypes** - Candidate personas with recommended block combinations and rationale
- **Search Library** - All blocks with collapsible Recall/Precision clusters
- One-click copy for any group or cluster

### Lead Evaluation
- **Evaluate Leads** button generates a screening prompt
- Copy into ChatGPT/Claude with candidate profiles for structured scoring
- Custom evaluation prompts supported per kit

---

## Boolean Construction Template v6.0

The generation engine uses a structured methodology:

### Taxonomy
```
Block (domain/competency)
└── Sub-block (Concepts / Methods / Tools)
    └── Cluster (Recall / Precision)
        └── Group (semantic neighborhood)
```

### Recall vs Precision Clusters

| Cluster | Purpose | Example |
|---------|---------|---------|
| **Recall** | Broad anchors - find the cohort | `("RLHF" OR "reinforcement learning from human feedback")` |
| **Precision** | Specific signals - confirm expertise | `("DPO" OR "direct preference optimization")` |

**Usage patterns:**
- Recall alone = "Show me everyone in this space"
- Precision alone = "Show me specialists only"
- Recall AND Precision = "People in this space with specific expertise"

### Signal Test

Every group must pass a signal test:
- **Recall test:** "Does this anchor me to the right population?"
- **Precision test:** "Does this confirm specific expertise that distinguishes specialists?"

### Blacklist (Never Included)

Universal infrastructure (PyTorch, Docker, AWS), generic ML terms (machine learning, transformer), user tools (GitHub Copilot, LangChain), and buzzwords (AI-powered, generative AI) are excluded - they dilute search results.

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **AI:** Claude API (Opus 4.5) with prompt caching
- **Deployment:** Vercel (frontend), Supabase (backend)

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Library home - browse/search kits
│   ├── generate/page.tsx     # Generate new kit form
│   ├── kit/[id]/page.tsx     # Kit detail view
│   └── layout.tsx            # Root layout
├── components/
│   ├── ArchetypeAccordion.tsx
│   ├── BlockSection.tsx
│   ├── ClusterRow.tsx
│   ├── CopyButton.tsx
│   ├── EmailPromptModal.tsx
│   ├── EvaluateLeadsButton.tsx
│   ├── FavoriteButton.tsx
│   ├── InfoModal.tsx
│   ├── KitCard.tsx
│   └── SearchBar.tsx
└── lib/
    ├── supabase.ts           # Supabase client + queries
    └── types.ts              # TypeScript interfaces

supabase/functions/
└── generate-kit/
    ├── index.ts              # Edge function handler
    └── prompt.ts             # Boolean Template v6.0
```

---

## Local Development

### Prerequisites

- Node.js 18+
- Supabase CLI
- Anthropic API key

### Setup

1. Clone and install:
```bash
git clone <repo-url>
cd search-kit-library
npm install
```

2. Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

3. Start development server:
```bash
npm run dev
```

### Supabase Setup

1. Create tables:
```sql
-- Search kits
CREATE TABLE search_kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_title TEXT NOT NULL,
  company TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT NOT NULL,
  input_jd TEXT NOT NULL,
  input_intake TEXT,
  kit_data JSONB NOT NULL,
  evaluation_prompt TEXT
);

-- User favorites
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,  -- email address
  search_kit_id UUID REFERENCES search_kits(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, search_kit_id)
);
```

2. Set Edge Function secrets:
```bash
supabase secrets set ANTHROPIC_API_KEY=your_key
```

3. Deploy Edge Function:
```bash
supabase functions deploy generate-kit
```

---

## Deployment

### Vercel (Frontend)

1. Connect repo to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

### Supabase (Edge Function)

```bash
supabase functions deploy generate-kit
```

---

## Usage Guide

### Generating a Kit

1. Click **Generate New Kit**
2. Fill in:
   - **Role Title** (required) - e.g., "Frontier Data Lead - RL"
   - **Your Name** (required)
   - **Hiring Manager** (optional)
   - **Organization** (optional) - TA2, TI, Finance, People, Marketing, Delivery, Fulfillment, Legal, R&D
   - **Job Description** (required, 100+ characters)
   - **Intake Notes** (optional) - HM must-haves, nice-to-haves
3. Click **Generate Search Kit**
4. Wait 30-60 seconds for Claude to generate

### Using a Kit

1. Browse or search for a kit
2. Open kit detail view
3. Review **Archetypes** for recommended search strategies
4. In **Search Library**, expand clusters to see groups
5. Click any group to copy the boolean
6. Paste into LinkedIn Recruiter
7. Combine groups with AND for tighter searches

### Evaluating Leads

1. Open a kit
2. Click **Evaluate Leads**
3. Paste the prompt into ChatGPT or Claude
4. Add candidate profiles below the prompt
5. Get structured scoring: Score/10, Requirements Check, Strengths, Concerns, Verdict

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 6.0 | Feb 2026 | Signal-based generation; Recall/Precision clusters replace Broad/Established/Recent/Specific |
| 5.x | Jan 2026 | Volume-based generation with temporal clusters |

---

## Author

Sam Vangelos

---

## License

Internal use - Turing
