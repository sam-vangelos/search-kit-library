'use client';

import { useState } from 'react';
import { BlockSectionProps, SubBlock, Cluster } from '@/lib/types';
import { ClusterRow } from './ClusterRow';

function stripOuterParens(terms: string): string {
  const trimmed = terms.trim();
  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function buildCopyAllText(cluster: Cluster): string {
  if (cluster.groups && cluster.groups.length > 0) {
    const inner = cluster.groups.map(g => stripOuterParens(g.terms)).join(' OR ');
    return `(${inner})`;
  }
  return cluster.terms ?? '';
}

function CopyAllButton({ cluster }: { cluster: Cluster }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(buildCopyAllText(cluster));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-[10px] px-1.5 py-0.5 rounded transition-all ${
        copied
          ? 'text-accent-green'
          : 'text-text-muted hover:text-text-secondary'
      }`}
      title="Copy all groups as a single OR parenthetical"
    >
      {copied ? 'Copied!' : 'Copy All'}
    </button>
  );
}

interface CollapsibleClusterProps {
  cluster: Cluster;
  defaultExpanded?: boolean;
}

function CollapsibleCluster({ cluster, defaultExpanded = false }: CollapsibleClusterProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const groupCount = cluster.groups?.length ?? 0;

  return (
    <div>
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 py-1 px-1 cursor-pointer hover:bg-bg-tertiary/50 rounded transition-colors"
      >
        <span className={`text-text-muted transition-transform ${expanded ? 'rotate-90' : ''}`}>
          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
        <span className={`text-xs font-medium ${
          cluster.label === 'Precision' ? 'text-accent-orange' : 'text-text-secondary'
        }`}>
          {cluster.label}
        </span>
        {groupCount >= 2 && (
          <span className="ml-auto">
            <CopyAllButton cluster={cluster} />
          </span>
        )}
      </div>

      {expanded && (
        <div className="pl-4 pr-1 pb-1 pt-1">
          <ClusterRow cluster={cluster} />
        </div>
      )}
    </div>
  );
}

interface SubBlockSectionProps {
  subBlock: SubBlock;
  defaultExpanded?: boolean;
}

function SubBlockSection({ subBlock, defaultExpanded = false }: SubBlockSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div>
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 py-1.5 px-2 cursor-pointer hover:bg-bg-tertiary/50 rounded transition-colors"
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
          {subBlock.clusters.length} {subBlock.clusters.length === 1 ? 'cluster' : 'clusters'}
        </span>
      </div>

      {expanded && (
        <div className="pl-5 pr-2 pb-1 space-y-0.5">
          {subBlock.clusters.map((cluster, idx) => (
            <CollapsibleCluster key={idx} cluster={cluster} defaultExpanded={false} />
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
