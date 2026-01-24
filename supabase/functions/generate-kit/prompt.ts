// Boolean IDE Prompt - JSON Output Version
// Modified from v5.1 to output structured JSON instead of HTML

export const BOOLEAN_IDE_PROMPT = `# Boolean Construction Template v5.1 — JSON Output

**Version:** 5.1 · January 2026 · Sam Vangelos

---

## Your Task

Generate a **complete JSON object** for Boolean sourcing from the job description provided.

**You must:**
1. Follow the taxonomy in Section A
2. Apply the gating rules in Section B
3. Follow the generation workflow in Section C (generate blocks BEFORE archetypes)
4. Output valid JSON matching the schema in Section D

**You must not:**
- Create monolithic parentheticals (always cluster)
- Generate archetypes before completing the Search Library
- Include seniority terms in boolean clusters (use LinkedIn filters instead)
- Generate blocks for leadership/management (use LinkedIn seniority filters)
- Generate blocks for client verticals mentioned in JD (these are context, not candidate skills)
- Generate more than 6 blocks or more than 4 archetypes
- Put benchmarks in Methods or Concepts (benchmarks are always Tools)
- Put generic infrastructure terms in Broad clusters (PyTorch, Docker, Spark catch everyone)
- Let expansion drift into generic terms (every term must be role-relevant)

---

## Section A: Taxonomy

### A.1 Sub-block Types (Proxy Categories)

Every block has exactly 3 sub-blocks:

| Sub-block | What it captures | Example |
|-----------|------------------|---------|
| **Concepts** | Field vocabulary, domain descriptors | "reinforcement learning", "alignment" |
| **Methods** | Techniques, algorithms, processes | "RLHF", "DPO", "PPO" |
| **Tools** | Libraries, frameworks, platforms, benchmarks | "TRL", "SWE-bench", "HumanEval" |

**Critical: Benchmarks are ALWAYS Tools** (SWE-bench, HumanEval, WebArena, MMLU)

### A.2 Cluster Types (Precision Tiers)

Every sub-block has exactly 4 clusters:

| Cluster | What belongs | Precision |
|---------|--------------|-----------|
| **Broad** | High recall within the domain (not generic!) | High recall, low precision |
| **Established** | Mainstream 2+ years | Balanced |
| **Recent** | Last 12-18 months | Cutting-edge signal |
| **Specific** | Implementation-level, niche | High precision, low recall |

**Broad ≠ Generic.** Broad clusters catch people adjacent to THIS role's domain, not all of tech.

---

## Section B: Gating Rules

### B.1 Block Selection
- Floor: 4 blocks
- Ceiling: 6 blocks
- Each block is a core competency required to perform the role
- NO blocks for: leadership/management, client verticals, soft skills

### B.2 Structure
- Every block: exactly 3 sub-blocks (Concepts, Methods, Tools)
- Every sub-block: exactly 4 clusters (Broad, Established, Recent, Specific)
- Every cluster: 8-20 terms (non-negotiable)

### B.3 Cluster Expansion
Apply ALL dimensions to each cluster:
1. Lexical variants (hyphenation, spacing, abbreviations)
2. Synonyms
3. Academic terminology
4. Industry terminology
5. Older terms
6. Emerging terms (for Recent)
7. Domain-specific manifestations
8. Compound terms

### B.4 Archetype Requirements
- 3-4 archetypes
- Each must have: name, summary, recipe (block+cluster combos), WHY explanation
- WHY must explain combinatorial signal (what the combination means that individual clusters don't)

---

## Section C: Generation Workflow

**CRITICAL: Generate blocks FIRST, then archetypes.**

### Step 1: Extract from JD
- Core function
- Technical domain
- Key tools/technologies

### Step 2: Generate Search Library (FIRST)
For each domain:
1. Create Block with title
2. Generate 3 Sub-blocks (Concepts, Methods, Tools)
3. Each Sub-block gets 4 Clusters (Broad, Established, Recent, Specific)
4. Each Cluster: 8-20 terms as a parenthetical Boolean string

### Step 3: Synthesize Archetypes (SECOND)
After ALL blocks are complete:
1. Identify 3-4 distinct personas who could fill this role
2. Map each to specific Block → Sub-block (Cluster) combinations
3. Write WHY explaining the combinatorial signal

---

## Section D: JSON Output Schema

Output a single JSON object matching this exact structure:

\`\`\`json
{
  "version": "5.1",
  "role_title": "string — the role title",
  "role_summary": "string — 2-3 sentence description of the role",
  "role_details": {
    "core_function": "string — what this person does",
    "technical_domain": "string — the technical area",
    "key_deliverables": "string — what they produce",
    "stakeholders": "string — who they work with"
  },
  "archetypes": [
    {
      "name": "string — archetype name (e.g., 'The Lab Post-Training Lead')",
      "summary": "string — one sentence description",
      "recipe": [
        {
          "block": "string — block title",
          "components": "string — e.g., 'Methods (Established) + Tools (Recent)'"
        }
      ],
      "why": "string — explanation of combinatorial signal (2-4 sentences)"
    }
  ],
  "blocks": [
    {
      "number": 1,
      "title": "string — block title",
      "sub_blocks": [
        {
          "type": "Concepts",
          "clusters": [
            {
              "label": "Broad",
              "terms": "string — full Boolean parenthetical with ORs"
            },
            {
              "label": "Established",
              "terms": "string"
            },
            {
              "label": "Recent",
              "terms": "string"
            },
            {
              "label": "Specific",
              "terms": "string"
            }
          ]
        },
        {
          "type": "Methods",
          "clusters": [/* same 4 clusters */]
        },
        {
          "type": "Tools",
          "clusters": [/* same 4 clusters */]
        }
      ]
    }
  ]
}
\`\`\`

**Output requirements:**
- Output ONLY the JSON object, no markdown code fences
- All strings must be properly escaped
- Each "terms" field must be a complete Boolean parenthetical like: ("term1" OR "term2" OR "term3")
- 4-6 blocks, each with exactly 3 sub-blocks, each with exactly 4 clusters
- 3-4 archetypes with complete WHY explanations

---

## Begin

Generate the JSON for the following job description:
`;

export function buildPrompt(jd: string, intake?: string): string {
  let prompt = BOOLEAN_IDE_PROMPT;

  prompt += `\n\n---\n\n## Job Description\n\n${jd}`;

  if (intake) {
    prompt += `\n\n---\n\n## Intake Notes\n\n${intake}`;
  }

  prompt += `\n\n---\n\nGenerate the complete JSON output now. Output only valid JSON, no additional text or markdown.`;

  return prompt;
}
