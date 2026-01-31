// Boolean IDE Prompt - JSON Output Version
// v6.0: Signal-based gating replaces volume requirements

export const BOOLEAN_IDE_PROMPT = `# Boolean Construction Template v6.0 — JSON Output

**Version:** 6.0 · January 2026 · Sam Vangelos

**What changed in v6:** Signal-based gating replaces volume requirements. No minimums. Clusters are functional (Core/Narrow) not temporal (Broad/Established/Recent/Specific). Each group is a semantic neighborhood (one concept + its variants). LinkedIn search behavior informs variant construction.

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

Two cluster types based on function:

| Cluster | Purpose |
|---------|---------|
| **Core** | Groups that find the right people when searched alone |
| **Narrow** | Groups you AND with Core to tighten results |

**Core is required** if the sub-block exists.

**Narrow is optional.** Only include if there's a genuine use case for AND-tightening. Don't generate Narrow just to have it.

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

LinkedIn automatically handles case insensitivity and basic stemming (plural/singular). Do NOT include redundant variants.

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

**Group labels:** 1-4 words describing the concept (e.g., "RLHF Training", "Code Benchmarks", "Preference Methods")

**No volume requirement.** A cluster might have 1 group or 8. Generate what passes the signal test.

---

## Section B: Signal Test

Every group must pass this test before inclusion:

> **"If I search LinkedIn for ONLY this group's terms, do the results contain mostly plausible candidates for this specific role?"**

### B.1 Applying the Test

For each group you generate, mentally run the LinkedIn search.

**Pass examples:**
- \`("RLHF" OR "reinforcement learning from human feedback")\` → Results: ML researchers, post-training engineers ✅
- \`("SWE-bench" OR "SWE bench")\` → Results: Coding eval researchers ✅
- \`("Aider" OR "OpenHands" OR "SWE-agent")\` → Results: Coding agent builders ✅

**Fail examples:**
- \`("PyTorch" OR "TensorFlow")\` → Results: 500k+ ML practitioners, students ❌
- \`("data pipeline" OR "ETL")\` → Results: Data engineers, analytics engineers ❌
- \`("automation")\` → Results: RPA, DevOps, marketing ops ❌

### B.2 Blacklist — Never Include

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

### B.3 Narrow Clusters

Narrow groups tighten Core results via AND.

**Include Narrow when:**
- Core groups are slightly broader than ideal but still valuable
- There's a natural domain qualifier that makes results more precise
- Archetypes need a way to specify sub-populations

**Example:**
\`\`\`
Core: ("reward model" OR "reward modeling")
Narrow: ("code" OR "coding" OR "software")

Usage: ("reward model") AND ("code" OR "coding")
→ Finds reward modeling people who work on code specifically
\`\`\`

**Do NOT include Narrow if:**
- Core is already specific enough
- The narrowing would be so restrictive it returns no one
- You're just generating it to fill space

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

**Quality over quantity.** A sub-block with 2 high-signal groups is better than one with 10 groups padded with generic terms.

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
              "label": "Core",
              "groups": [
                {
                  "label": "string — 1-4 word group name",
                  "terms": "string — Boolean parenthetical for this group"
                }
              ]
            },
            {
              "label": "Narrow",
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
              "label": "Core",
              "groups": [/* groups */]
            }
            // Narrow cluster is optional — omit if not needed
          ]
        },
        {
          "type": "Tools",
          "clusters": [
            {
              "label": "Core",
              "groups": [/* groups */]
            }
            // Narrow cluster is optional — omit if not needed
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
- Cluster: Core
  - Group: "RLHF Training" → ("RLHF" OR "reinforcement learning from human feedback")
  - Group: "DPO" → ("DPO" OR "direct preference optimization")
  - Group: "Reward Modeling" → ("reward model" OR "reward modeling")
  - Group: "PPO" → ("PPO" OR "proximal policy optimization")
  - Group: "Instruction Tuning" → ("instruction tuning" OR "instruction-tuned" OR "SFT" OR "supervised fine-tuning")
- Cluster: Narrow
  - Group: "Code Domain" → ("code" OR "coding" OR "software")

Sub-block: Tools
- Cluster: Core
  - Group: "TRL" → ("TRL" OR "Transformer Reinforcement Learning")
  - Group: "Axolotl" → ("Axolotl" OR "axolotl-ai")
  - Group: "LLaMA-Factory" → ("LLaMA-Factory" OR "LLaMA Factory" OR "llamafactory")

**What's NOT here:**
- PyTorch, DeepSpeed (universal infrastructure)
- gradient descent, Adam optimizer (universal ML)
- "training pipeline" (too generic)

**Archetype Example:**

Name: The Lab Post-Training Engineer
Summary: Built RLHF/post-training pipelines at a frontier lab

Recipe:
- Post-Training & RLHF → Methods (Core) + Tools (Core)
- Code Evaluation → Tools (Core)

WHY: RLHF + SWE-bench is a narrow intersection. Most RLHF work is chat/reasoning/safety — adding code benchmarks filters to the small population doing post-training specifically for coding capabilities. The tools (TRL, Axolotl) confirm hands-on implementation, not just research familiarity.

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
