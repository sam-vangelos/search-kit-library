# Search Kit Library — Architecture Scaffold v2

## Task

Design and document the complete architecture for an interactive Search Kit Library: a team-wide tool where recruiters can generate, browse, search, and favorite role-specific boolean sourcing kits. 

**Output:** A comprehensive architecture document that serves as the build roadmap, with v0-compatible code snippets and step-by-step instructions a non-engineer can follow.

---

## Glossary (Plain-English Definitions)

| Term | What It Means | Why It Matters |
|------|---------------|----------------|
| **Supabase** | A backend service that stores your data (like a spreadsheet in the cloud) and runs server-side code | Stores all Search Kits and favorites |
| **Edge Function** | A small program that runs on Supabase's servers, not in the user's browser | Keeps your Anthropic API key secret; handles kit generation |
| **API** | A way for two programs to talk to each other | Your frontend asks Supabase for data; Supabase asks Claude to generate kits |
| **JSON** | A structured text format for data, like a organized list | How Search Kits are stored — makes them searchable and renderable |
| **JSONB** | Supabase's way of storing JSON that you can search inside | Lets you find kits containing specific terms |
| **UUID** | A unique random ID like `a1b2c3d4-e5f6-...` | Identifies each kit and user without needing usernames |
| **localStorage** | Browser storage that persists after you close the tab | Remembers who you are for favorites, without login |
| **Component** | A reusable UI building block in React/v0 | `KitCard`, `SearchBar`, `ClusterRow` are components |
| **Props** | Data you pass into a component | A `KitCard` receives the kit's title, date, etc. as props |
| **State** | Data that can change and triggers UI updates | "Is this kit favorited?" is state |

---

## Locked Decisions (Do Not Revisit)

These are final. The architecture document should implement these, not question them.

| Decision | Value | Why |
|----------|-------|-----|
| Frontend | v0 → auto-deploys to Vercel | Sam's comfort zone |
| Backend | Supabase (database + Edge Functions) | Sam's comfort zone |
| Version control | GitHub | Sam's comfort zone |
| Data format | JSON source of truth, rendered to React components on display | Flexible, searchable, no duplication |
| Auth model | None — internal tool with obscure URL | Simplicity; upgrade to Vercel domain allowlist later if needed |
| User identity | localStorage UUID (generated on first visit) | No friction, persists across sessions |
| Visibility | Public library — all kits visible to all users | Team resource, not personal silos |
| User actions | Generate, browse, search, favorite | No editing or deleting kits (immutable library) |
| Search approach | Client-side filtering | Fine for <500 kits; no backend complexity |
| LLM | Claude Opus 4.5 via Anthropic API | Best quality for boolean generation |
| API security | Supabase Edge Function proxies Claude calls | Keeps API key server-side |
| Naming | Individual outputs = "Search Kit" | Decided |

---

## Build Phases

The architecture document should organize deliverables into these phases so Sam can ship incrementally.

### Phase 1: Static Library (Week 1)
**Goal:** Display existing Search Kits in a browsable interface

- Supabase tables created (`search_kits`, `user_favorites`)
- Seed database with 1 kit (Frontier Data Lead – RL, manually converted to JSON)
- v0 frontend: Library view with kit cards, Kit Detail view
- No generation, no favorites yet — just read-only display
- **Milestone:** Can browse and view the seeded kit at a Vercel URL

### Phase 2: Generation (Week 2)
**Goal:** Users can create new Search Kits from JDs

- Supabase Edge Function for `/generate-kit`
- Claude API integration with Boolean IDE prompt
- v0 frontend: Generate page with form + loading state
- **Milestone:** Can paste a JD, click Generate, and see the new kit in the library

### Phase 3: Favorites (Week 3)
**Goal:** Users can save kits to their personal favorites

- localStorage UUID implementation
- Supabase queries for favorites
- v0 frontend: Favorite button, favorites filter/view
- **Milestone:** Can favorite a kit, refresh the page, and still see it favorited

---

## System Components to Design

### 1. Data Model (Supabase)

Provide copy-pasteable SQL for:

**`search_kits` table**
```sql
-- Claude: Generate this complete CREATE TABLE statement
-- Columns needed:
--   id (uuid, primary key, auto-generated)
--   role_title (text, required) — e.g., "Frontier Data Lead – RL"
--   company (text, optional) — e.g., "Turing"
--   created_at (timestamp, auto-generated)
--   created_by (text, required) — name or email of whoever generated it
--   input_jd (text, required) — the raw job description
--   input_intake (text, optional) — intake notes
--   kit_data (jsonb, required) — the structured Search Kit
```

**`user_favorites` table**
```sql
-- Claude: Generate this complete CREATE TABLE statement
-- Columns needed:
--   id (uuid, primary key, auto-generated)
--   user_id (text, required) — localStorage UUID
--   search_kit_id (uuid, foreign key to search_kits)
--   created_at (timestamp, auto-generated)
-- Constraint: user can't favorite the same kit twice
```

---

### 2. JSON Schema for `kit_data`

Provide a TypeScript interface that matches this structure:

```typescript
// Claude: Validate this against the HTML output and fix any mismatches

interface SearchKit {
  version: string;              // "5.1"
  role_title: string;           // "Frontier Data Lead – RL"
  role_summary: string;         // 2-3 sentence description
  
  archetypes: Archetype[];      // 3-4 archetypes
  blocks: Block[];              // 4-6 blocks
}

interface Archetype {
  name: string;                 // "The Lab Post-Training Lead"
  summary: string;              // One sentence
  recipe: RecipeItem[];         // Which blocks/clusters to combine
  why: string;                  // Explanation of combinatorial signal
}

interface RecipeItem {
  block: string;                // "RL & Post-Training"
  components: string;           // "Methods (Established) + Tools (Recent)"
}

interface Block {
  number: number;               // 1, 2, 3...
  title: string;                // "RL & Post-Training"
  sub_blocks: SubBlock[];       // Always exactly 3: Concepts, Methods, Tools
}

interface SubBlock {
  type: "Concepts" | "Methods" | "Tools";
  clusters: Cluster[];          // Always exactly 4: Broad, Established, Recent, Specific
}

interface Cluster {
  label: "Broad" | "Established" | "Recent" | "Specific";
  terms: string;                // The full boolean string with ORs
}
```

---

### 3. Supabase Edge Function: `/generate-kit`

**What it does:**
1. Receives: `{ jd: string, intake?: string, created_by: string }`
2. Builds prompt: Injects JD + intake into the Boolean IDE template
3. Calls Claude: Opus 4.5 with the prompt
4. Parses response: Extracts JSON from Claude's output (see below)
5. Stores: Inserts into `search_kits` table
6. Returns: The complete kit JSON

**Critical instruction for Claude:** The Boolean IDE currently outputs HTML. For this system, modify the IDE prompt to output JSON matching the `SearchKit` interface above. Provide the modified prompt with clear markers showing what changed.

**Provide:**
- Complete Edge Function code in TypeScript (Deno runtime)
- The modified Boolean IDE prompt that outputs JSON instead of HTML
- Error handling for: Claude API failures, malformed responses, Supabase insert failures

---

### 4. Frontend Architecture (v0/React)

**Provide v0-compatible React code** for each component. Code should be copy-pasteable into v0.

#### Pages

| Page | Route | Description |
|------|-------|-------------|
| Library | `/` | Grid of kit cards with search bar |
| Kit Detail | `/kit/[id]` | Full Search Kit display |
| Generate | `/generate` | Form to create new kit |

#### Components (with props)

```typescript
// Claude: Provide complete v0-compatible code for each

// Displays a single kit in the library grid
KitCard: {
  kit: SearchKit & { id: string; created_at: string; created_by: string };
  isFavorited: boolean;
  onFavoriteToggle: () => void;
}

// Search and filter controls
SearchBar: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Heart icon button
FavoriteButton: {
  isFavorited: boolean;
  onClick: () => void;
}

// Expandable archetype display
ArchetypeAccordion: {
  archetype: Archetype;
  defaultOpen?: boolean;
}

// Renders a complete block with sub-blocks
BlockSection: {
  block: Block;
}

// Single cluster row with copy button
ClusterRow: {
  cluster: Cluster;
}

// Copy button with feedback
CopyButton: {
  text: string;  // What to copy
}
```

#### State Management

| State | Where It Lives | How It's Set |
|-------|----------------|--------------|
| All kits | Fetched from Supabase on page load, cached in React state | `useEffect` on mount |
| Search query | React state (`useState`) | User types in SearchBar |
| Filtered kits | Derived (computed from all kits + search query) | `useMemo` or inline filter |
| User's favorites | Fetched from Supabase using localStorage UUID | `useEffect` on mount |
| Current user ID | localStorage | Generated on first visit if missing |

---

### 5. API Routes

| Route | Method | When Called | Input | Output |
|-------|--------|-------------|-------|--------|
| Supabase: `search_kits` table | SELECT | Library page loads | — | All kits |
| Supabase: `search_kits` table | SELECT | Kit Detail page loads | `id` | Single kit |
| Supabase: `user_favorites` table | SELECT | Library page loads | `user_id` | User's favorite kit IDs |
| Supabase: `user_favorites` table | INSERT | User clicks favorite | `{ user_id, search_kit_id }` | Created favorite |
| Supabase: `user_favorites` table | DELETE | User unfavorites | `{ user_id, search_kit_id }` | Success |
| Edge Function: `/generate-kit` | POST | User submits generate form | `{ jd, intake?, created_by }` | Created kit |

**Note:** Most operations use Supabase's auto-generated REST API (no custom Edge Functions needed). Only `/generate-kit` needs a custom function because it calls Claude.

---

### 6. UX/UI Specification

#### Site Map

```
Search Kit Library
│
├── / (Library)
│   ├── Header: "Search Kit Library" + "Generate New" button
│   ├── SearchBar
│   ├── Filter tabs: "All Kits" | "My Favorites"
│   ├── Kit grid (3 columns desktop, 2 tablet, 1 mobile)
│   └── Empty states (no kits / no results / no favorites)
│
├── /kit/[id] (Kit Detail)
│   ├── Back button → Library
│   ├── Header: role title + metadata (company, date, creator)
│   ├── Favorite button
│   ├── Role Summary
│   ├── Archetypes section (collapsible accordion)
│   └── Search Library blocks (collapsible hierarchy)
│
└── /generate (Generate)
    ├── Header: "Generate Search Kit"
    ├── Form:
    │   ├── JD textarea (required, large)
    │   ├── Intake notes textarea (optional, smaller)
    │   └── Your name/email input (required, for created_by)
    ├── "Generate" button
    ├── Loading state (15-30 seconds expected)
    └── Error state with retry
```

#### Key Screens — Detailed Specs

**Library (Default Landing)**
- Header: App title left, "Generate New Kit" button right (accent color)
- Search bar: Full width below header, placeholder "Search by role, company, or terms..."
- Filter tabs: Immediately below search, "All Kits" selected by default
- Grid: Cards with 16px gap
- Card content: Role title (bold), company (muted, if present), "Created [date] by [name]", favorite heart icon top-right
- Card click: Navigate to `/kit/[id]`
- Empty state (no kits): Illustration + "No Search Kits yet. Be the first to create one." + CTA button

**Kit Detail**
- Sticky header with role title + favorite button
- Visual design: **Must match existing HTML output exactly** — port all CSS from Boolean IDE
- Archetypes: Collapsed by default, click to expand, show recipe + WHY
- Blocks: Expanded by default, sub-blocks collapsed if >1 per block
- Cluster rows: Truncated by default (single line), click to expand full boolean
- Copy button: On every cluster row, shows checkmark for 1.5s after click

**Generate**
- Simple centered form, max-width 600px
- JD textarea: 12 rows minimum, label "Job Description *"
- Intake textarea: 4 rows, label "Intake Notes (optional)"
- Name input: Single line, label "Your Name *", persisted to localStorage for next time
- Generate button: Full width, disabled while loading
- Loading: Button shows spinner + "Generating... (this takes 15-30 seconds)"
- Success: Redirect to `/kit/[new-id]`
- Error: Red banner above form with error message + "Try Again" button

#### Interaction Specifications

| Interaction | Behavior |
|-------------|----------|
| Copy cluster | Click copy icon → icon becomes checkmark → "Copied!" toast (1.5s) → icon resets |
| Favorite | Click heart → optimistic fill → save to Supabase → if error, unfill + show error toast |
| Search | Debounce 300ms → filter kit cards client-side → no loading spinner (instant) |
| Expand archetype | Click header → smooth height animation → chevron rotates |
| Expand cluster | Click row → row expands to show full boolean string (wraps) |

#### Error States

| Error | Display | Recovery |
|-------|---------|----------|
| Failed to load kits | "Couldn't load Search Kits. Check your connection." | "Retry" button |
| Failed to generate | "Generation failed: [error]. Your JD wasn't saved." | "Try Again" button, form preserved |
| Failed to favorite | Toast: "Couldn't save favorite" | Heart unfills, can retry |
| Kit not found | "This Search Kit doesn't exist or was removed." | "Back to Library" link |

#### Responsive Breakpoints

| Breakpoint | Layout Changes |
|------------|----------------|
| Desktop (>1024px) | 3-column grid, sidebar nav possible |
| Tablet (768-1024px) | 2-column grid, collapsible nav |
| Mobile (<768px) | 1-column grid, hamburger menu or bottom nav |

#### Visual Design

- **Port existing CSS:** Copy color variables, typography, component styles from Boolean IDE
- **Dark theme only:** Match `--bg-primary: #0d1117` etc.
- **Fonts:** Outfit for UI, JetBrains Mono for code/booleans
- **Consistency:** Kit Detail page should be visually identical to standalone HTML output

---

### 7. Security & Access Control

**For MVP (Phase 1-3):** Obscure URL only. The Vercel deployment URL is not guessable; just don't share it publicly.

**Future upgrade (when sharing broadly):** Enable Vercel Deployment Protection (requires Vercel Pro, $20/mo):
1. Vercel Dashboard → Project Settings → Deployment Protection
2. Enable "Vercel Authentication"
3. Restrict to `@turing.com` domain
4. Team members sign in with Google, Vercel validates email domain

No code changes required for upgrade.

---

### 8. Migration: Seeding the First Kit

The existing `Frontier_Data_Lead_RL_Search_Library.html` needs to be converted to JSON to seed the database.

**Provide:**
1. The manually-created JSON for this kit (extracted from the HTML)
2. A SQL INSERT statement to seed the database
3. Instructions for running the seed

---

## Output Format

Deliver a single architecture document organized as:

### Part 1: Data Layer (Phase 1)
- Complete SQL for both tables (copy-paste into Supabase SQL editor)
- TypeScript interfaces for all data types
- Seed data JSON + INSERT statement for Frontier Data Lead kit

### Part 2: Edge Function (Phase 2)
- Complete TypeScript code for `/generate-kit`
- Modified Boolean IDE prompt (JSON output version)
- Step-by-step deployment instructions for Supabase Edge Functions

### Part 3: Frontend Components (Phase 1-3)
- v0-compatible React code for every component listed
- Organized by phase (which components needed for each phase)
- Include all CSS (ported from Boolean IDE)

### Part 4: Integration Guide
- How frontend calls Supabase (code snippets)
- How frontend calls Edge Function (code snippets)
- localStorage implementation for user ID

### Part 5: Deployment Checklist
Numbered steps from zero to "team can use it":

1. Create Supabase project
2. Run SQL to create tables
3. Run SQL to seed first kit
4. Create v0 project
5. Build Phase 1 components
6. Deploy to Vercel
7. Test Library + Kit Detail views
8. Create Edge Function
9. Add Anthropic API key to Supabase secrets
10. Deploy Edge Function
11. Build Phase 2 components (Generate page)
12. Test generation end-to-end
13. Build Phase 3 components (Favorites)
14. Test favorites end-to-end
15. Share URL with team

### Part 6: Open Questions
Only include questions where Sam's input is genuinely needed — not implementation details.

---

## Reference Files

Attached to this conversation:

- **Boolean IDE** (`Boolean_IDE.md`) — The prompt template that generates Search Kits. Contains CSS (Section A), HTML patterns (Section B), and generation rules (Sections C-F).
- **Example Output** (`Frontier_Data_Lead_RL_Search_Library.html`) — A complete generated Search Kit showing the exact structure.

---

## Constraints (Hard Rules)

- **No feature creep:** Only generate, browse, search, favorite
- **No auth complexity:** No login, no user accounts
- **No editing:** Kits are immutable once generated
- **No backend complexity:** Client-side search, simple Supabase queries
- **Preserve fidelity:** Kit Detail view must visually match the existing HTML output
- **v0-compatible code:** All React components should paste directly into v0
- **Scale assumptions:** 10-50 kits year one, up to 500 eventually; 10-20 concurrent users max

---

## Begin

Start with Part 1: Data Layer. Provide complete, copy-pasteable SQL and seed data.
