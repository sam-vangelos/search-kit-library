'use client';

import { useState } from 'react';
import { ArchetypeAccordionProps } from '@/lib/types';

export function ArchetypeAccordion({ archetype, defaultOpen = false }: ArchetypeAccordionProps) {
  const [expanded, setExpanded] = useState(defaultOpen);

  return (
    <div className="archetype-item mb-2">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2.5 p-3 cursor-pointer"
      >
        <span className={`flex items-center justify-center w-[18px] h-[18px] bg-bg-tertiary border border-border-primary rounded text-accent-blue chevron ${expanded ? 'rotated' : ''}`}>
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
        <span className="text-[13px] font-semibold text-text-primary">{archetype.name}</span>
        <span className="text-xs text-text-secondary ml-1">— {archetype.summary}</span>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pl-10 border-t border-border-primary">
          <div className="mt-3">
            <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-2">
              Recipe
            </div>
            <div className="space-y-2">
              {archetype.recipe.map((item, idx) => (
                <div key={idx} className="recipe-item">
                  <span className="recipe-block">{item.block}</span>
                  <span className="text-text-muted">→</span>
                  <span className="recipe-components">{item.components}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-[10px] font-semibold text-text-muted uppercase tracking-wide mb-2">
              WHY
            </div>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              {archetype.why}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
