'use client';

import { useState } from 'react';
import { ClusterRowProps } from '@/lib/types';
import { CopyButton } from './CopyButton';

function TermsBox({ terms }: { terms: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex items-start gap-2">
      <div
        onClick={() => setExpanded(!expanded)}
        className={`flex-1 font-mono text-xs text-accent-cyan bg-bg-primary border border-border-primary rounded px-3 py-2 cursor-pointer hover:border-accent-blue/50 transition-colors ${
          expanded ? '' : 'truncate'
        }`}
        style={expanded ? { whiteSpace: 'pre-wrap', wordBreak: 'break-word' } : {}}
      >
        {terms}
      </div>
      <CopyButton text={terms} />
    </div>
  );
}

export function ClusterRow({ cluster }: ClusterRowProps) {
  // Grouped format - stack terms without labels
  if (cluster.groups && cluster.groups.length > 0) {
    return (
      <div className="space-y-1.5">
        {cluster.groups.map((group, idx) => (
          <TermsBox key={idx} terms={group.terms} />
        ))}
      </div>
    );
  }

  // Legacy flat format
  return <TermsBox terms={cluster.terms || ''} />;
}
