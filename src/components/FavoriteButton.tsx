'use client';

import { FavoriteButtonProps } from '@/lib/types';

export function FavoriteButton({ isFavorited, onClick, disabled = false }: FavoriteButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!disabled) onClick();
      }}
      disabled={disabled}
      className={`p-2 rounded-md transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-bg-tertiary'
      }`}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className={`w-5 h-5 transition-colors ${
          isFavorited ? 'fill-accent-orange text-accent-orange' : 'text-text-muted hover:text-accent-orange'
        }`}
        fill={isFavorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
