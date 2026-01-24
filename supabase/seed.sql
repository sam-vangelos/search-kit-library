-- Seed data for Search Kit Library
-- Run this after creating the tables in 001_initial_schema.sql

INSERT INTO search_kits (
  id,
  role_title,
  company,
  created_by,
  input_jd,
  input_intake,
  kit_data
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Frontier Data Lead – RL',
  'Turing',
  'Sam Vangelos',
  'Frontier Data Lead – RL: End-to-end ownership of RL environment projects for frontier AI labs, spanning environment design, task generation, reward/verifier design, quality assurance, and client delivery.',
  NULL,
  '{
    "version": "5.1",
    "role_title": "Frontier Data Lead – RL",
    "role_summary": "End-to-end ownership of RL environment projects for frontier AI labs, spanning environment design, task generation, reward/verifier design, quality assurance, and client delivery.",
    "role_details": {
      "core_function": "Own end-to-end RL environment projects for frontier AI labs, delivering environments that improve model capabilities through post-training.",
      "technical_domain": "RL environments for software engineering agents, UI/browser-use agents, and MCP-based function-calling agents across enterprise domains.",
      "key_deliverables": "Environment code, database schemas, seed data, task curricula, verifiers/reward functions, agent trajectories, and eval reports.",
      "stakeholders": "Researchers at OpenAI, Anthropic, Google DeepMind, Microsoft AI, Amazon, Apple. Internal teams of engineers, SMEs, and data ops."
    },
    "archetypes": [
      {
        "name": "The Lab Post-Training Lead",
        "summary": "Built RLHF/DPO pipelines at a frontier lab or major tech company",
        "recipe": [
          { "block": "RL & Post-Training", "components": "Methods (Established) + Tools (Recent)" },
          { "block": "Evaluation & Verification", "components": "Methods (Specific) + Tools (Established)" }
        ],
        "why": "This person built RL training pipelines, not just used them. Methods (Established) catches core RLHF/DPO vocabulary — anyone doing post-training uses these terms. Tools (Recent) filters for hands-on work with current infrastructure; mentions of OpenRLHF, Axolotl, or vLLM mean they are building pipelines, not just reading papers. Evaluation (Methods Specific) adds reward modeling and verifier design signal — without this, you would catch fine-tuning practitioners who lack the measurement rigor this role requires."
      },
      {
        "name": "The Agent Environment Builder",
        "summary": "Designed sandboxes, harnesses, or simulation infra for agent evaluation",
        "recipe": [
          { "block": "Agent Systems", "components": "Methods (Established) + Tools (Recent)" },
          { "block": "Environment Design", "components": "Methods (Specific) + Tools (Established)" }
        ],
        "why": "Agent Systems (Established) alone catches anyone who has touched LangChain. Adding Environment Design (Methods Specific) filters for people who build agent sandboxes, not just deploy agents. Terms like task harness, environment reset, and episode boundary signal someone who understands the infrastructure needed to train agents."
      },
      {
        "name": "The Eval Infrastructure Engineer",
        "summary": "Built model evaluation pipelines, benchmarks, or leaderboard infrastructure",
        "recipe": [
          { "block": "Evaluation & Verification", "components": "Methods (Established) + Tools (Recent)" },
          { "block": "Data Operations", "components": "Methods (Specific) + Concepts (Established)" }
        ],
        "why": "Evaluation (Methods Established) catches anyone familiar with LLM eval vocabulary, but Tools (Recent) filters for people running evals at scale — mentions of lm-evaluation-harness or Inspect AI signal operational experience."
      },
      {
        "name": "The Data Platform Tech Lead",
        "summary": "Led annotation/data teams and built ML data infrastructure at scale",
        "recipe": [
          { "block": "Data Operations", "components": "Methods (Established) + Tools (Established)" },
          { "block": "RL & Post-Training", "components": "Concepts (Broad) + Methods (Established)" }
        ],
        "why": "Data Operations (Established) catches people who have built annotation pipelines, but alone returns general ML data engineers. Adding RL & Post-Training ensures they understand the training context."
      }
    ],
    "blocks": [
      {
        "number": 1,
        "title": "RL & Post-Training",
        "sub_blocks": [
          {
            "type": "Concepts",
            "clusters": [
              { "label": "Broad", "terms": "(\"reinforcement learning\" OR \"RL training\" OR \"RL systems\")" },
              { "label": "Established", "terms": "(\"post-training\" OR \"alignment training\" OR \"model alignment\")" },
              { "label": "Recent", "terms": "(\"constitutional AI\" OR \"RLAIF\" OR \"scalable oversight\")" },
              { "label": "Specific", "terms": "(\"preference optimization\" OR \"reward hacking mitigation\")" }
            ]
          },
          {
            "type": "Methods",
            "clusters": [
              { "label": "Broad", "terms": "(\"policy optimization\" OR \"reward modeling\")" },
              { "label": "Established", "terms": "(\"RLHF\" OR \"PPO\" OR \"DPO\")" },
              { "label": "Recent", "terms": "(\"IPO\" OR \"KTO\" OR \"GRPO\")" },
              { "label": "Specific", "terms": "(\"GAE\" OR \"TRPO\" OR \"entropy regularization\")" }
            ]
          },
          {
            "type": "Tools",
            "clusters": [
              { "label": "Broad", "terms": "(\"Hugging Face\" OR \"PEFT\" OR \"LoRA\")" },
              { "label": "Established", "terms": "(\"TRL\" OR \"Axolotl\" OR \"vLLM\")" },
              { "label": "Recent", "terms": "(\"OpenRLHF\" OR \"veRL\" OR \"torchtune\")" },
              { "label": "Specific", "terms": "(\"Ray RLlib\" OR \"Stable Baselines\")" }
            ]
          }
        ]
      }
    ]
  }'::jsonb
);

-- Note: The full kit_data JSON in the seed-data/frontier-data-lead-rl.json file
-- contains all 5 blocks with complete cluster data. The above is abbreviated
-- for readability. Use the full JSON file for production seeding.
