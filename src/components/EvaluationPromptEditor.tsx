'use client';

import { useState } from 'react';
import { SearchKit } from '@/lib/types';

interface EvaluationPromptEditorProps {
  kitId: string;
  roleTitle: string;
  company?: string | null;
  inputJd: string;
  inputIntake?: string | null;
  kitData: SearchKit;
  evaluationPrompt: string | null;
  onSave: (prompt: string | null) => Promise<void>;
}

// Auto-generate prompt for preview (same logic as EvaluateLeadsButton)
function generateDefaultPrompt(
  roleTitle: string,
  company: string | null | undefined,
  inputJd: string,
  inputIntake: string | null | undefined,
  kitData: SearchKit
): string {
  const roleContext = kitData.role_details
    ? [
        kitData.role_details.core_function && `- Core Function: ${kitData.role_details.core_function}`,
        kitData.role_details.technical_domain && `- Technical Domain: ${kitData.role_details.technical_domain}`,
        kitData.role_details.key_deliverables && `- Key Deliverables: ${kitData.role_details.key_deliverables}`,
        kitData.role_details.stakeholders && `- Stakeholders: ${kitData.role_details.stakeholders}`,
      ].filter(Boolean).join('\n')
    : '';

  const competencyDomains = kitData.blocks
    ?.map(b => `- ${b.title}`)
    .join('\n') || '';

  const hasIntake = inputIntake && inputIntake.trim().length > 0;

  const requirementsSection = hasIntake
    ? `### Hiring Manager Requirements (PRIMARY - weight these heavily)
${inputIntake}

### Job Description (secondary context)
${inputJd}`
    : `### Job Description
${inputJd}`;

  return `You are evaluating candidates for: **${roleTitle}**${company ? ` at ${company}` : ''}

## Role Overview
${kitData.role_summary}

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

export function EvaluationPromptEditor({
  kitId,
  roleTitle,
  company,
  inputJd,
  inputIntake,
  kitData,
  evaluationPrompt,
  onSave,
}: EvaluationPromptEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editValue, setEditValue] = useState(evaluationPrompt || '');
  const [isSaving, setIsSaving] = useState(false);

  const hasCustomPrompt = Boolean(evaluationPrompt);
  const defaultPrompt = generateDefaultPrompt(roleTitle, company, inputJd, inputIntake, kitData);
  const displayPrompt = evaluationPrompt || defaultPrompt;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editValue.trim() || null);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(evaluationPrompt || '');
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setEditValue(evaluationPrompt || defaultPrompt);
    setIsEditing(true);
    setIsExpanded(true);
  };

  const handleRevertToDefault = async () => {
    setIsSaving(true);
    try {
      await onSave(null);
      setEditValue('');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to revert:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="ref-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text-primary">Evaluation Prompt</h3>
          {hasCustomPrompt ? (
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-accent-green/15 text-accent-green border border-accent-green/30 rounded">
              Custom
            </span>
          ) : (
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-bg-tertiary text-text-muted border border-border-primary rounded">
              Auto-generated
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                {isExpanded ? 'Collapse' : 'Preview'}
              </button>
              <button
                onClick={handleStartEdit}
                className="text-xs text-accent-blue hover:text-accent-blue/80 transition-colors"
              >
                {hasCustomPrompt ? 'Edit' : 'Customize'}
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-full h-[400px] px-3 py-2 text-xs font-mono bg-bg-primary border border-border-primary rounded-md text-text-primary focus:outline-none focus:border-accent-blue resize-y"
            placeholder="Enter your custom evaluation prompt..."
          />
          <div className="flex items-center justify-between">
            <div>
              {hasCustomPrompt && (
                <button
                  onClick={handleRevertToDefault}
                  disabled={isSaving}
                  className="text-xs text-accent-orange hover:text-accent-orange/80 transition-colors disabled:opacity-50"
                >
                  Revert to auto-generated
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-1.5 text-xs font-medium bg-accent-blue text-bg-primary rounded hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      ) : isExpanded ? (
        <div className="bg-bg-primary border border-border-primary rounded-md p-3 max-h-[300px] overflow-y-auto">
          <pre className="text-xs font-mono text-text-secondary whitespace-pre-wrap">
            {displayPrompt}
          </pre>
        </div>
      ) : (
        <p className="text-xs text-text-muted">
          {hasCustomPrompt
            ? 'Using hand-crafted evaluation prompt for this role.'
            : 'Using auto-generated prompt based on JD and intake notes. Click "Customize" to create a tailored evaluation framework.'}
        </p>
      )}
    </div>
  );
}
