'use client';

import { useState } from 'react';
import { BlockSectionProps, SubBlock } from '@/lib/types';
import { ClusterRow } from './ClusterRow';

interface SubBlockSectionProps {
  subBlock: SubBlock;
  defaultExpanded?: boolean;
}

function SubBlockSection({ subBlock, defaultExpanded = false }: SubBlockSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="border-l-2 border-border-primary ml-1">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-bg-tertiary/50 transition-colors"
      >
        <span className={`text-text-muted transition-transform ${expanded ? 'rotate-90' : ''}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {subBlock.type}
        </span>
        <span className="text-[11px] text-text-muted font-mono ml-auto">
          {subBlock.clusters.length} clusters
        </span>
      </div>

      {expanded && (
        <div className="pl-6 pr-3 pb-3 space-y-1">
          {subBlock.clusters.map((cluster, idx) => (
            <ClusterRow key={idx} cluster={cluster} />
          ))}
        </div>
      )}
    </div>
  );
}

export function BlockSection({ block }: BlockSectionProps) {
  return (
    <div className="block-container mb-4">
      <div className="block-header">
        <span className="block-number">{block.number}</span>
        <h3 className="text-sm font-semibold text-text-primary">{block.title}</h3>
      </div>

      <div className="py-2">
        {block.sub_blocks.map((subBlock, idx) => (
          <SubBlockSection
            key={idx}
            subBlock={subBlock}
            defaultExpanded={false}
          />
        ))}
      </div>
    </div>
  );
}
