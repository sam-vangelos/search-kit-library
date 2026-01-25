'use client';

import Link from 'next/link';
import { KitCardProps } from '@/lib/types';
import { FavoriteButton } from './FavoriteButton';

export function KitCard({ kit, isFavorited, onFavoriteToggle }: KitCardProps) {
  const createdDate = new Date(kit.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const blockCount = kit.kit_data.blocks?.length || 0;
  const archetypeCount = kit.kit_data.archetypes?.length || 0;

  return (
    <Link href={`/kit/${kit.id}`}>
      <div className="kit-card bg-bg-secondary border border-border-primary rounded-md p-3 cursor-pointer relative h-[120px] flex flex-col">
        <div className="absolute top-2.5 right-2.5">
          <FavoriteButton isFavorited={isFavorited} onClick={onFavoriteToggle} />
        </div>

        <h3 className="text-sm font-semibold text-text-primary pr-8 mb-0.5 line-clamp-2">
          {kit.role_title}
        </h3>

        {kit.company && (
          <p className="text-xs text-text-secondary truncate">{kit.company}</p>
        )}

        <div className="mt-auto">
          <p className="text-xs text-text-muted mb-1.5 truncate">
            {createdDate} · {kit.created_by}
          </p>

          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1 text-text-secondary">
              <svg className="w-3 h-3 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {blockCount} blocks
            </span>
            <span className="flex items-center gap-1 text-text-secondary">
              <svg className="w-3 h-3 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {archetypeCount} archetypes
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
