'use client';

import { useState } from 'react';
import { ClusterRowProps } from '@/lib/types';
import { CopyButton } from './CopyButton';

export function ClusterRow({ cluster }: ClusterRowProps) {
  const [expanded, setExpanded] = useState(false);
  const isRecent = cluster.label === 'Recent';

  return (
    <div className="flex items-start gap-3 py-1.5">
      {/* Label */}
      <span className={`text-xs font-medium min-w-[75px] pt-1.5 ${
        isRecent ? 'text-accent-orange' : 'text-text-secondary'
      }`}>
        {cluster.label}
        {isRecent && <span className="ml-1">⚡</span>}
      </span>

      {/* Code box - clickable to expand */}
      <div
        onClick={() => setExpanded(!expanded)}
        className={`flex-1 font-mono text-xs text-accent-cyan bg-bg-primary border border-border-primary rounded px-3 py-2 cursor-pointer hover:border-accent-blue/50 transition-colors ${
          expanded ? '' : 'truncate'
        }`}
        style={expanded ? { whiteSpace: 'pre-wrap', wordBreak: 'break-word' } : {}}
      >
        {cluster.terms}
      </div>

      {/* Copy button */}
      <div className="pt-0.5">
        <CopyButton text={cluster.terms} />
      </div>
    </div>
  );
}
