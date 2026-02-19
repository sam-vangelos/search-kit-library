# Search Kit Library

A team-wide boolean sourcing repository where recruiters can generate, browse, search, and favorite role-specific boolean sourcing kits. Transforms the Boolean IDE (a prompt-based generation tool) into a persistent, searchable team resource.

**Live:** [search-kit-library.vercel.app](https://search-kit-library.vercel.app)

---

## What It Does

1. **Generate** — Paste a job description + optional intake notes. Claude Opus 4.5 generates a structured boolean sourcing kit with candidate archetypes, competency blocks, and copy-ready boolean strings.

2. **Browse** — All generated kits live in a searchable library. Search across role titles, companies, creators, block titles, and archetype names.

3. **Favorite** — Email-based favorites persist across devices. No login required — enter your email once and your favorites follow you.

4. **Source** — Expand any kit to see its full hierarchy: archetypes (candidate personas with recipes), blocks (competency domains), and boolean term groups organized by Recall/Precision signals. Copy any boolean string with one click.

5. **Evaluate** — "Evaluate Leads" generates a screening prompt from the kit + JD + intake notes, ready to paste into Claude or ChatGPT for batch candidate evaluation.

---

## Boolean Construction Template v6.0

The generation engine uses a structured methodology:

### Kit Structure

```
Kit
├── Role Summary (core function, technical domain, deliverables, stakeholders)
├── Archetypes (2-4 candidate personas)
│   └── Recipe (which blocks/clusters to combine) + Why
└── Blocks (4-6 competency domains)
    └── Sub-blocks (Concepts, Methods, Tools)
        └── Clusters (Recall, Precision)
            └── Groups (labeled boolean parentheticals)
```

### Recall vs Precision Clusters

| Cluster | Purpose | Example |
|---------|---------|---------|
| **Recall** | Broad anchors — find the cohort | `("RLHF" OR "reinforcement learning from human feedback")` |
| **Precision** | Specific signals — confirm expertise | `("DPO" OR "direct preference optimization")` |

**Usage patterns:**
- Recall alone = "Show me everyone in this space"
- Precision alone = "Show me specialists only"
- Recall AND Precision = "People in this space with specific expertise"

### Signal Test

Every group must pass a signal test:
- **Recall test:** "Does this anchor me to the right population?"
- **Precision test:** "Does this confirm specific expertise that distinguishes specialists?"

### Blacklist (Never Included)

Universal infrastructure (PyTorch, Docker, AWS), generic ML terms (machine learning, transformer), user tools (GitHub Copilot, LangChain), and buzzwords (AI-powered, generative AI) are excluded — they dilute search results.

---

## Architecture

```
search-kit-library/
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Library home — grid of kit cards
│   │   ├── generate/page.tsx            # Generation form
│   │   ├── kit/[id]/page.tsx            # Kit detail view
│   │   └── layout.tsx                   # App layout
│   ├── components/
│   │   ├── KitCard.tsx                  # Kit preview card
│   │   ├── ArchetypeAccordion.tsx       # Collapsible archetype display
│   │   ├── BlockSection.tsx             # Block with nested sub-blocks/clusters
│   │   ├── ClusterRow.tsx               # Term groups with copy buttons
│   │   ├── SearchBar.tsx                # Search input
│   │   ├── FavoriteButton.tsx           # Heart toggle
│   │   ├── CopyButton.tsx              # Copy-to-clipboard with feedback
│   │   ├── EmailPromptModal.tsx         # First-visit email capture
│   │   ├── EvaluateLeadsButton.tsx      # Screening prompt generator
│   │   └── InfoModal.tsx                # Help/guide modal
│   └── lib/
│       ├── supabase.ts                  # Supabase client + data fetchers
│       └── types.ts                     # TypeScript interfaces
├── supabase/
│   └── functions/
│       └── generate-kit/
│           ├── index.ts                 # Edge Function handler
│           └── prompt.ts                # Boolean Construction Template v6.0
```

### Generation Flow

1. User submits JD on `/generate`
2. POST to Supabase Edge Function
3. Edge Function calls Claude Opus 4.5 with Boolean IDE v6.0 prompt (cached)
4. Claude generates JSON matching kit schema (blocks first, then archetypes)
5. Kit stored in Supabase `search_kits` table
6. Redirect to `/kit/[id]`

### Data Layer

- **`search_kits`** — Kit metadata + `kit_data` JSONB column
- **`user_favorites`** — Maps email to kit IDs
- **Auth**: Email-based (localStorage), no OAuth

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| AI | [Claude Opus 4.5](https://docs.anthropic.com/en/docs/about-claude/models) via Supabase Edge Function |
| Backend | [Supabase](https://supabase.com/) (Postgres + Edge Functions) |
| Hosting | [Vercel](https://vercel.com/) |
| UI | [Tailwind CSS](https://tailwindcss.com/) |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project
- An [Anthropic API key](https://console.anthropic.com/) (set in Supabase Edge Function secrets)

### Setup

```bash
git clone https://github.com/sam-vangelos/search-kit-library.git
cd search-kit-library
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

1. Create tables:
```sql
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

CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
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

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Usage

### Generating a Kit

1. Click **Generate New Kit**
2. Fill in role title, your name, job description (required), and optional intake notes / hiring manager / organization
3. Click **Generate Search Kit** — wait 30-60 seconds
4. Redirected to kit detail view

### Using a Kit

1. Browse or search for a kit in the library
2. Review **Archetypes** for recommended search strategies
3. Expand **Search Library** clusters to see boolean groups
4. Click any group to copy the boolean string
5. Paste into LinkedIn Recruiter — combine groups with AND for tighter searches

### Evaluating Leads

1. Open a kit and click **Evaluate Leads**
2. Paste the prompt into ChatGPT or Claude
3. Add candidate profiles below the prompt
4. Get structured scoring: Score/10, Requirements Check, Strengths, Concerns, Verdict

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 6.0 | Feb 2026 | Signal-based generation; Recall/Precision clusters replace Broad/Established/Recent/Specific |
| 5.x | Jan 2026 | Volume-based generation with temporal clusters |

---

Built by [Sam Vangelos](https://github.com/sam-vangelos)
