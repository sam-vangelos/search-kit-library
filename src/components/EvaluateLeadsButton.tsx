'use client';

import { useState } from 'react';
import { SearchKit } from '@/lib/types';

interface EvaluateLeadsButtonProps {
  kit: {
    role_title: string;
    company?: string;
    kit_data: SearchKit;
  };
}

function generateScreeningPrompt(kit: EvaluateLeadsButtonProps['kit']): string {
  const { role_title, company, kit_data } = kit;

  // Build context from role details
  const roleContext = kit_data.role_details
    ? [
        kit_data.role_details.core_function && `Core Function: ${kit_data.role_details.core_function}`,
        kit_data.role_details.technical_domain && `Technical Domain: ${kit_data.role_details.technical_domain}`,
        kit_data.role_details.key_deliverables && `Key Deliverables: ${kit_data.role_details.key_deliverables}`,
      ].filter(Boolean).join('\n')
    : '';

  // Build archetype summaries
  const archetypeSummary = kit_data.archetypes
    ?.map(a => `- ${a.name}: ${a.description}`)
    .join('\n') || '';

  // Extract key competencies from blocks
  const competencies = kit_data.blocks
    ?.map(b => b.name)
    .join(', ') || '';

  return `You are a technical recruiter evaluating candidates for: ${role_title}${company ? ` at ${company}` : ''}.

## Role Context
${kit_data.role_summary}

${roleContext ? `${roleContext}\n` : ''}
## Ideal Candidate Profiles
${archetypeSummary}

## Key Competencies to Evaluate
${competencies}

## Your Task
I will paste LinkedIn profile(s) or resume(s) below. For each candidate:

1. **Fit Score** (1-10): How well does this person match the role?
2. **Strengths**: What makes them a good fit? (2-3 bullets)
3. **Gaps**: What's missing or concerning? (2-3 bullets)
4. **Archetype Match**: Which ideal profile do they most resemble?
5. **Verdict**: STRONG FIT / WORTH SCREENING / PASS

Be direct and specific. Reference actual details from their profile.

---

CANDIDATE PROFILE(S):

[Paste resume or LinkedIn profile text here]`;
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
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary bg-bg-tertiary hover:bg-bg-secondary border border-border-primary rounded-md transition-colors"
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
