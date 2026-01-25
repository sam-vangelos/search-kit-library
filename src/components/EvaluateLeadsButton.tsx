'use client';

import { useState } from 'react';
import { SearchKit } from '@/lib/types';

interface EvaluateLeadsButtonProps {
  kit: {
    role_title: string;
    company?: string | null;
    input_jd: string;
    input_intake?: string | null;
    kit_data: SearchKit;
  };
}

function generateScreeningPrompt(kit: EvaluateLeadsButtonProps['kit']): string {
  const { role_title, company, input_jd, input_intake, kit_data } = kit;

  // Build role context from kit_data
  const roleContext = kit_data.role_details
    ? [
        kit_data.role_details.core_function && `- Core Function: ${kit_data.role_details.core_function}`,
        kit_data.role_details.technical_domain && `- Technical Domain: ${kit_data.role_details.technical_domain}`,
        kit_data.role_details.key_deliverables && `- Key Deliverables: ${kit_data.role_details.key_deliverables}`,
        kit_data.role_details.stakeholders && `- Stakeholders: ${kit_data.role_details.stakeholders}`,
      ].filter(Boolean).join('\n')
    : '';

  // Extract competency domains from blocks
  const competencyDomains = kit_data.blocks
    ?.map(b => `- ${b.title}`)
    .join('\n') || '';

  // Build the requirements section - intake notes weighted heavier when present
  const hasIntake = input_intake && input_intake.trim().length > 0;

  const requirementsSection = hasIntake
    ? `### Hiring Manager Requirements (PRIMARY - weight these heavily)
${input_intake}

### Job Description (secondary context)
${input_jd}`
    : `### Job Description
${input_jd}`;

  return `You are evaluating candidates for: **${role_title}**${company ? ` at ${company}` : ''}

## Role Overview
${kit_data.role_summary}

${roleContext ? `${roleContext}\n` : ''}
## Requirements to Evaluate Against

${requirementsSection}

### Core Competency Domains
${competencyDomains}

---

## Evaluation Instructions

**Your job:** Determine if this candidate should advance to recruiter screen.
${hasIntake ? '\n**IMPORTANT:** The Hiring Manager Requirements above reflect what the HM actually wants. Weight these MORE heavily than the formal job description when there are differences.\n' : ''}
### Scoring Rubric (be rigorous)
| Score | Meaning |
|-------|---------|
| 9-10 | Exceptional. Hits all must-haves + multiple nice-to-haves. Fast-track. |
| 7-8 | Strong. Hits most must-haves, minor gaps. Worth screening. |
| 5-6 | Partial. Missing key requirements but has transferable experience. |
| 3-4 | Weak. Significant gaps in core requirements. |
| 1-2 | Poor. Wrong background entirely. |

### For Each Candidate, Provide:

**1. SCORE: [X/10]**

**2. REQUIREMENTS CHECK**
| Requirement | Status | Evidence |
|-------------|--------|----------|
| [requirement 1] | ✓ / ~ / ✗ | [specific evidence from profile] |
| [requirement 2] | ✓ / ~ / ✗ | [specific evidence from profile] |
(Cover the key requirements from ${hasIntake ? 'HM notes and ' : ''}JD)

**3. STRENGTHS** (2-3 bullets)
What specifically qualifies them? Cite their experience.

**4. CONCERNS** (2-3 bullets)
What's missing or raises flags? Be specific.

**5. VERDICT: ADVANCE / MAYBE / PASS**

**6. SUMMARY**
One sentence: "[Name] is a [verdict] because [core reason]."

---

## Rules

- Cite specific evidence. No vague assessments.
- "Unable to assess" if profile doesn't mention a requirement.
- Weight recent experience (last 3-5 years) over older roles.
- Missing a critical must-have = PASS, regardless of score.
${hasIntake ? '- When JD and HM notes conflict, defer to HM notes.' : ''}

---

PASTE CANDIDATE PROFILE(S) BELOW:

`;
}

export function EvaluateLeadsButton({ kit }: EvaluateLeadsButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const prompt = generateScreeningPrompt(kit);
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-accent-blue hover:text-white bg-accent-blue/10 hover:bg-accent-blue border border-accent-blue/30 hover:border-accent-blue rounded-md transition-all"
      >
        {copied ? (
          <>
            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Copied!</span>
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span>Evaluate Leads</span>
          </>
        )}
      </button>

      {/* Tooltip */}
      {!copied && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-text-primary bg-bg-secondary border border-border-primary rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Copy & paste into ChatGPT
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-bg-secondary" />
        </div>
      )}
    </div>
  );
}
