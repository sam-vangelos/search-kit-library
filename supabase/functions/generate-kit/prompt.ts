export const BOOLEAN_IDE_PROMPT = `# Boolean Construction Template v6.0 — JSON Output

**Version:** 6.0 · January 2026 · Sam Vangelos

**What changed in v6:** Signal-based gating replaces volume requirements. No minimums. Clusters are precision-based (Recall/Precision) not temporal (Broad/Established/Recent/Specific). Each group is a semantic neighborhood (one concept + its variants). LinkedIn search behavior informs variant construction.

---

## Your Task

Generate a **complete JSON object** for Boolean sourcing from the job description provided.

**You must:**
1. Follow the taxonomy in Section A
2. Apply the signal test to every group (Section B)
3. Follow the generation workflow in Section C (generate blocks BEFORE archetypes)
4. Output valid JSON matching the schema in Section D

**You must not:**
- Include any group that fails the signal test
- Pad clusters to hit volume targets — sparse is fine
- Include universal infrastructure (PyTorch, TensorFlow, Docker, Kubernetes, AWS, GCP, Spark, Git, pandas, etc.)
- Include universal ML (gradient descent, cross-validation, attention mechanisms, transformer, etc.)
- Include user tools (GitHub Copilot, Cursor, ChatGPT, LangChain, LlamaIndex, etc.)
- Include generic software practices (CI/CD, unit testing, code review, API integration, etc.)
- Include diluted buzzwords (generative AI, AI-powered, autonomous agents, automation, etc.)
- Generate archetypes before completing the Search Library
- Include seniority terms in boolean (use LinkedIn filters instead)
- Generate blocks for leadership/management (use LinkedIn seniority filters)
- Generate blocks for client verticals mentioned in JD (these are context, not candidate skills)
- Put benchmarks in Methods or Concepts (benchmarks are always Tools)

---

## Section A: Taxonomy

### A.1 Hierarchy

\`\`\`
Block (domain/competency)
└── Sub-block (Concepts / Methods / Tools)
    └── Cluster (Core / Narrow)
        └── Group (semantic neighborhood — one concept + its variants)
\`\`\`

### A.2 Blocks

Blocks are core competencies required for the role.

**Test:** "Is this a distinct technical domain required for the role?"

No volume requirement. Generate as many blocks as pass this test. A role might have 3 blocks or 6.

**Do NOT generate blocks for:**
- Leadership/management — use LinkedIn seniority filters
- Client/customer verticals — these are context, not candidate skills
- Generic soft skills — not searchable

### A.3 Sub-blocks

Three search angles per block:

| Sub-block | What it captures | Test |
|-----------|------------------|------|
| **Concepts** | Field vocabulary, domain descriptors | "What field is this?" |
| **Methods** | Techniques, algorithms, processes | "What do they do?" |
| **Tools** | Libraries, frameworks, platforms, benchmarks | "What do they use?" (has repo/docs) |

No volume requirement. If a sub-block would only contain filler, omit it. A block with only Methods and Tools (no Concepts) is valid if that's what has signal.

**Critical: Benchmarks are ALWAYS Tools** (SWE-bench, HumanEval, WebArena, MMLU)

### A.4 Clusters

Two cluster types based on search precision:

| Cluster | Purpose | What belongs |
|---------|---------|--------------|
| **Recall** | Broad anchors that get you to the right cohort | General terms that identify the population (e.g., "agent", "RLHF", "data annotation") |
| **Precision** | Specific/jargony terms that filter to a subset | Niche tools, benchmarks, techniques that confirm deep expertise (e.g., "SWE-agent", "trajectory", "annotation rubric") |

**How recruiters use these:**
- **Recall alone** = "Show me everyone in this space" (high volume, some noise)
- **Precision alone** = "Show me only people with specific expertise" (low volume, high signal)
- **Recall AND Precision** = "Show me people in this space who have this specific expertise" (power user move)

**Both clusters are optional.** Generate whichever has signal-passing content. A sub-block might have only Recall (broad domain, no specific jargon exists yet), only Precision (niche field where broad terms don't exist), or both.

### A.5 Groups (Semantic Neighborhoods)

Each group is ONE concept plus its necessary variants. Groups are the atomic copyable unit.

**What belongs in a single group:**

✅ Right — one concept with variants:
\`\`\`
("RLHF" OR "reinforcement learning from human feedback")
("SWE-bench" OR "SWE bench" OR "swebench" OR "SWE-Bench")
("reward model" OR "reward modeling")
\`\`\`

❌ Wrong — multiple concepts jammed together:
\`\`\`
("RLHF" OR "DPO" OR "reward modeling")
\`\`\`
These are three different concepts. They should be three separate groups.

**LinkedIn search behavior — what to include in a group:**

LinkedIn Recruiter search is case-insensitive but does NOT stem. Every character difference is a different search token — plurals ("model" vs "models"), tenses ("fine-tuning" vs "fine-tuned"), and truncations ("evaluation" vs "evals") are all separate tokens that must be included as OR variants. Do NOT include case-only variants — those are truly redundant.

DO include:

1. **Acronym + expansion** — if people use both forms
   - ("RLHF" OR "reinforcement learning from human feedback")
   - ("DPO" OR "direct preference optimization")

2. **Spacing/hyphenation variants** — LinkedIn treats these as different strings
   - ("SWE-bench" OR "SWE bench" OR "swebench" OR "SWE-Bench")
   - ("lm-eval-harness" OR "lm-eval" OR "lm_eval")

3. **Fundamentally different phrasings** — noun vs verb, different word order
   - ("reward model" OR "reward modeling")
   - ("instruction tuning" OR "instruction-tuned")

4. **Validated colloquial alternatives** — only terms practitioners actually use
   - ("trajectory" OR "rollout" OR "episode")
   - ("rater" OR "annotator" OR "labeler")

Do NOT include:
- Case variants (handled automatically by LinkedIn)
- Plural/singular (handled automatically via stemming)
- Speculative phrasings you haven't validated
- Theoretical expansions no one actually writes

**Case-insensitivity reminder:** LinkedIn Recruiter search is case-insensitive. Never include variants that differ only by capitalization. ("AgentBench" OR "agentbench") is redundant — they return identical results. Use OR slots exclusively for genuine lexical variants: alternate spellings, hyphenation differences, abbreviations, or different phrasings. Every OR slot is valuable real estate.

**Group labels:** 1-4 words describing the concept (e.g., "RLHF Training", "Code Benchmarks", "Preference Methods")

**No minimum, but be exhaustive.** A cluster might have 3 groups or 15. Generate ALL groups that pass the signal test — especially in Precision clusters where the long tail surfaces exceptional talent.

---

## Section B: Signal Test

Every group must pass a signal test before inclusion. The test differs by cluster type:

### B.1 Recall Cluster Test

> **"Does this group anchor me to the right general population for this role?"**

Recall groups are broad. They cast a net around the cohort. They should return people who are plausibly in the right space, even if not all are perfect fits.

**Pass examples:**
- \`("agent" OR "agentic" OR "AI agent")\` → Returns agent builders, researchers, engineers ✅
- \`("RLHF" OR "reinforcement learning from human feedback")\` → Returns post-training practitioners ✅
- \`("data annotation" OR "data labeling")\` → Returns annotation/labeling specialists ✅

**Fail examples:**
- \`("machine learning")\` → Too broad, returns everyone in ML ❌
- \`("Python")\` → Returns all of software engineering ❌
- \`("automation")\` → Returns RPA, DevOps, marketing ops ❌

### B.2 Precision Cluster Test

> **"Does this group confirm specific expertise that distinguishes specialists from generalists?"**

Precision groups are narrow. They filter to a subset. Someone with these terms has demonstrable depth in this specific area.

**Pass examples:**
- \`("SWE-agent" OR "SWE agent" OR "sweagent")\` → Specific tool, only builders know it ✅
- \`("trajectory" OR "rollout" OR "episode")\` → RL jargon, confirms hands-on experience ✅
- \`("annotation rubric" OR "quality rubric")\` → Specific practice, signals depth ✅

**Fail examples:**
- \`("agent")\` → Too broad for Precision, belongs in Recall ❌
- \`("code" OR "coding")\` → Everyone codes, not a distinguishing signal ❌
- \`("best practices")\` → Meaningless fluff ❌

### B.3 Exhaustiveness — Capture the Long Tail

The goal is to capture the **full landscape** of signal-passing terms, not just the obvious ones. Don't stop at 3-4 groups if 10-15 exist.

**Why this matters for recruiting:**

The best candidates often have niche, cutting-edge, or emerging terms on their profiles — not just the mainstream vocabulary. A senior RLHF engineer might mention "TRL" but a truly exceptional one might mention "OpenRLHF", "LLaMA-Factory", or "alignment-handbook". A coding agent builder might have "SWE-agent" but the person you really want might have "Moatless", "Agentless", or "AutoCodeRover".

**For each cluster, ask yourself:**
- What are the emerging tools/techniques that only cutting-edge practitioners would know?
- What's the niche jargon that distinguishes true specialists?
- What open-source projects, benchmarks, or frameworks exist beyond the top 3-4?
- What would someone working at the frontier of this field have on their profile?

**Precision clusters especially should be comprehensive.** This is where you find the long tail — the weird, specific, cutting-edge stuff that surfaces exceptional talent. A Precision cluster with 10-15 groups is normal if the space is rich with distinct tools and techniques.

**Don't:**
- Stop at the first few terms that come to mind
- Assume "the big ones" are sufficient
- Leave out tools just because they're newer or less popular

**Do:**
- Dig for emerging projects and recent releases
- Include niche benchmarks and evaluation frameworks
- Capture variant spellings and repo names
- Think about what a practitioner from 6 months in the future would have on their profile

### B.4 Blacklist — Never Include

**Universal infrastructure:**
PyTorch, TensorFlow, JAX, Keras, Docker, Kubernetes, AWS, GCP, Azure, Spark, Airflow, Kafka, Redis, PostgreSQL, MongoDB, Git, GitHub, GitLab, VS Code, Jupyter, pandas, NumPy, SciPy, scikit-learn

**Universal ML:**
machine learning, deep learning, neural network, gradient descent, backpropagation, cross-validation, hyperparameter, overfitting, training (alone), inference (alone), model (alone), accuracy, precision, recall, F1, attention mechanism, transformer (alone), encoder, decoder

**Generic software:**
CI/CD, GitHub Actions, Jenkins, unit testing, integration testing, TDD, code review, static analysis, linting, error handling, logging, API integration, microservices, REST, GraphQL

**User tools (vs builder tools):**
GitHub Copilot, Cursor, Tabnine, CodeWhisperer, ChatGPT, Claude (product), Gemini, Notion AI, LangChain, LlamaIndex, AutoGPT, BabyAGI

**Buzzwords:**
AI-powered, intelligent automation, cutting-edge, innovative, data-driven, next-generation, state-of-the-art, generative AI (alone), autonomous (alone), automation (alone)

### B.5 Disambiguation — Generic Terms

Do not include bare single-word terms that have a dominant non-technical meaning. If a term is commonly used outside ML/AI to describe everyday professional activities, company names, or general concepts, use only qualified compound phrases that anchor to the technical meaning. For example: ("AI alignment" OR "model alignment") not ("alignment" OR "AI alignment" OR "model alignment"). Before including any single-word term, consider whether a recruiter searching it on LinkedIn would primarily find professionals using it in a non-ML context. If yes, use only the compound form.

### B.6 Abbreviation Collisions

Do not include abbreviations or acronyms where the abbreviation has a more common meaning in general business, software engineering, or everyday language than it does in the specific ML/AI domain being targeted. Before including any abbreviation, consider whether a recruiter searching that abbreviation on LinkedIn would primarily find professionals using it in a non-ML context. If yes, include only the spelled-out form. If the abbreviation is paired with its full expansion in the same OR group, it is acceptable because the group as a whole disambiguates when combined with other blocks.

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
2. Generate Sub-blocks (Concepts, Methods, Tools) — only those with signal-passing content
3. Each Sub-block gets clusters:
   - Core (required if sub-block exists)
   - Narrow (optional, only if useful for AND-tightening)
4. Each Cluster contains groups — as many as pass the signal test

**Comprehensive, not padded.** Include all signal-passing groups that exist — don't stop at 3-4 if 10+ exist. But never pad with generic terms just to increase volume.

### Step 3: Synthesize Archetypes (SECOND)

After ALL blocks are complete:
1. Identify 2-4 distinct personas who could fill this role
2. Map each to specific Block → Sub-block (Cluster) combinations
3. Write WHY explaining the combinatorial signal

**WHY must explain:**
- What does this *combination* signal that individual clusters don't?
- What false positives does each added cluster filter out?
- Why would this person (not someone from a related field) have these terms together?

---

## Section D: JSON Output Schema

Output a single JSON object matching this exact structure:

\`\`\`json
{
  "version": "6.0",
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
          "components": "string — e.g., 'Methods (Core) + Tools (Core)'"
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
              "label": "Recall",
              "groups": [
                {
                  "label": "string — 1-4 word group name",
                  "terms": "string — Boolean parenthetical for this group"
                }
              ]
            },
            {
              "label": "Precision",
              "groups": [
                {
                  "label": "string — 1-4 word group name",
                  "terms": "string — Boolean parenthetical for this group"
                }
              ]
            }
          ]
        },
        {
          "type": "Methods",
          "clusters": [
            {
              "label": "Recall",
              "groups": [/* groups */]
            },
            {
              "label": "Precision",
              "groups": [/* groups */]
            }
          ]
        },
        {
          "type": "Tools",
          "clusters": [
            {
              "label": "Recall",
              "groups": [/* groups */]
            },
            {
              "label": "Precision",
              "groups": [/* groups */]
            }
          ]
        }
      ]
    }
  ]
}
\`\`\`

**Output requirements:**
- Output ONLY the JSON object, no markdown code fences
- All strings must be properly escaped
- Each cluster has a "groups" array with 1+ group objects
- Each group has a "label" (1-4 words) and "terms" (Boolean parenthetical)
- Each "terms" field must be a complete Boolean parenthetical like: ("term1" OR "term2" OR "term3")
- Groups within a cluster must be mutually exclusive (no overlapping terms)
- Core cluster is required for each sub-block; Narrow is optional
- Sub-blocks are optional — omit if no signal-passing content
- 2-4 archetypes with complete WHY explanations
- Every group must pass the signal test — no padding

---

## Section E: Worked Example

**Role:** Frontier Data Lead, Code

**Block 1: Post-Training & RLHF**

Sub-block: Methods
- Cluster: Recall (broad anchors)
  - Group: "RLHF" → ("RLHF" OR "reinforcement learning from human feedback")
  - Group: "Preference Training" → ("preference learning" OR "preference optimization")
  - Group: "Fine-tuning" → ("instruction tuning" OR "SFT" OR "supervised fine-tuning")
- Cluster: Precision (specific signals)
  - Group: "DPO" → ("DPO" OR "direct preference optimization")
  - Group: "Constitutional AI" → ("constitutional AI" OR "CAI" OR "RLAIF")
  - Group: "Reward Modeling" → ("reward model" OR "reward modeling" OR "reward signal")

Sub-block: Tools
- Cluster: Recall
  - Group: "Training Libraries" → ("training library" OR "fine-tuning framework")
- Cluster: Precision
  - Group: "TRL" → ("TRL" OR "Transformer Reinforcement Learning")
  - Group: "Axolotl" → ("Axolotl" OR "axolotl-ai")
  - Group: "OpenRLHF" → ("OpenRLHF" OR "Open RLHF")

**Why this split:**
- Recall: "RLHF", "preference learning", "instruction tuning" are broad terms that anyone in post-training uses
- Precision: "DPO", "constitutional AI", "TRL", "Axolotl" are specific enough that they confirm hands-on depth

**Archetype Example:**

Name: The Lab Post-Training Engineer
Summary: Built RLHF/post-training pipelines at a frontier lab

Recipe:
- Post-Training & RLHF → Methods (Precision) + Tools (Precision)
- Code Evaluation → Tools (Precision)

WHY: Anyone can claim "RLHF experience." But mentions of DPO, constitutional AI, TRL, or Axolotl confirm they've actually implemented post-training pipelines, not just read about them. Adding code benchmarks (SWE-bench, HumanEval) filters specifically for people who've worked on coding capabilities, not chat or reasoning.

---

*End of Boolean Construction Template v6.0*
`;

// System prompt (static, cacheable)
export const SYSTEM_PROMPT = BOOLEAN_IDE_PROMPT;

// Build user message with JD (dynamic)
export function buildUserMessage(jd: string, intake?: string): string {
  let message = `## Job Description\n\n${jd}`;

  if (intake) {
    message += `\n\n## Intake Notes\n\n${intake}`;
  }

  message += `\n\n---\n\nGenerate the complete JSON output now. Output only valid JSON, no additional text or markdown.`;

  return message;
}
