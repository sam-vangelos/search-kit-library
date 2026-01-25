'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FavoriteButton, ArchetypeAccordion, BlockSection, EmailPromptModal, EvaluateLeadsButton } from '@/components';
import { SearchKitRow } from '@/lib/types';
import {
  getSearchKit,
  getUserFavorites,
  addFavorite,
  removeFavorite,
  getUserEmail,
  setUserEmail,
} from '@/lib/supabase';

export default function KitDetailPage() {
  const params = useParams();
  const kitId = params.id as string;

  const [kit, setKit] = useState<SearchKitRow | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [userEmail, setUserEmailState] = useState<string | null>(null);

  // Check for user email on mount
  useEffect(() => {
    const email = getUserEmail();
    if (email) {
      setUserEmailState(email);
    }
  }, []);

  useEffect(() => {
    async function loadKit() {
      try {
        const fetchedKit = await getSearchKit(kitId);
        if (fetchedKit) {
          setKit(fetchedKit);
        } else {
          setError('This Search Kit doesn\'t exist or was removed.');
        }
      } catch (err) {
        console.error('Error loading kit:', err);
        setError('Failed to load kit');
      } finally {
        setIsLoading(false);
      }
    }

    loadKit();
  }, [kitId]);

  // Load favorite status from Supabase
  useEffect(() => {
    async function loadFavoriteStatus() {
      if (!userEmail) return;

      try {
        const favorites = await getUserFavorites(userEmail);
        setIsFavorited(favorites.includes(kitId));
      } catch (err) {
        console.error('Error loading favorite status:', err);
      }
    }

    loadFavoriteStatus();
  }, [userEmail, kitId]);

  // Handle email submission
  const handleEmailSubmit = useCallback((email: string) => {
    setUserEmail(email);
    setUserEmailState(email);
    setShowEmailPrompt(false);
  }, []);

  const toggleFavorite = useCallback(async () => {
    if (!userEmail) {
      setShowEmailPrompt(true);
      return;
    }

    // Optimistic update
    const wasFavorited = isFavorited;
    setIsFavorited(!wasFavorited);

    try {
      if (wasFavorited) {
        await removeFavorite(userEmail, kitId);
      } else {
        await addFavorite(userEmail, kitId);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Revert on error
      setIsFavorited(wasFavorited);
    }
  }, [userEmail, kitId, isFavorited]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  if (error || !kit) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center">
        <svg
          className="w-16 h-16 mb-4 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Kit Not Found</h2>
        <p className="text-text-secondary mb-4">{error}</p>
        <Link
          href="/"
          className="text-accent-blue hover:underline"
        >
          ← Back to Library
        </Link>
      </div>
    );
  }

  const { kit_data } = kit;
  const createdDate = new Date(kit.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Email Prompt Modal */}
      {showEmailPrompt && (
        <EmailPromptModal onSubmit={handleEmailSubmit} />
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-bg-primary border-b border-border-primary">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-text-primary">{kit.role_title}</h1>
                <p className="text-xs text-text-muted">
                  {kit.company && `${kit.company} · `}Generated {createdDate} by {kit.created_by}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <EvaluateLeadsButton kit={kit} />
              <FavoriteButton isFavorited={isFavorited} onClick={toggleFavorite} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-6">
        {/* Role Summary - no duplicate title */}
        <div className="mb-6 pb-5 border-b border-border-primary">
          <p className="text-[15px] text-text-secondary leading-relaxed">
            {kit_data.role_summary}
          </p>
        </div>

        {/* Role Summary Section */}
        {kit_data.role_details && (
          <section className="mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 bg-bg-tertiary border border-border-primary rounded-md font-mono text-xs font-semibold text-accent-blue">
                0
              </span>
              <h2 className="text-lg font-semibold text-text-primary">Role Summary</h2>
            </div>
            <div className="ref-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {kit_data.role_details.core_function && (
                  <div className="ref-card-item">
                    <div className="ref-card-item-title">Core Function</div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {kit_data.role_details.core_function}
                    </p>
                  </div>
                )}
                {kit_data.role_details.technical_domain && (
                  <div className="ref-card-item">
                    <div className="ref-card-item-title">Technical Domain</div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {kit_data.role_details.technical_domain}
                    </p>
                  </div>
                )}
                {kit_data.role_details.key_deliverables && (
                  <div className="ref-card-item">
                    <div className="ref-card-item-title">Key Deliverables</div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {kit_data.role_details.key_deliverables}
                    </p>
                  </div>
                )}
                {kit_data.role_details.stakeholders && (
                  <div className="ref-card-item">
                    <div className="ref-card-item-title">Stakeholders</div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {kit_data.role_details.stakeholders}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Archetypes Section */}
        {kit_data.archetypes && kit_data.archetypes.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 bg-bg-tertiary border border-border-primary rounded-md font-mono text-xs font-semibold text-accent-blue">
                1
              </span>
              <h2 className="text-lg font-semibold text-text-primary">Archetypes</h2>
            </div>
            <div>
              {kit_data.archetypes.map((archetype, idx) => (
                <ArchetypeAccordion key={idx} archetype={archetype} />
              ))}
            </div>
          </section>
        )}

        {/* Search Library Section */}
        {kit_data.blocks && kit_data.blocks.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="flex items-center justify-center w-7 h-7 bg-bg-tertiary border border-border-primary rounded-md font-mono text-xs font-semibold text-accent-blue">
                2
              </span>
              <h2 className="text-lg font-semibold text-text-primary">Search Library</h2>
            </div>
            <div>
              {kit_data.blocks.map((block, idx) => (
                <BlockSection key={idx} block={block} />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-5 border-t border-border-primary text-center text-xs text-text-muted">
          <p>Built with Boolean Construction Template v{kit_data.version}</p>
          <p>{kit.role_title} · {kit.company} · {createdDate}</p>
        </footer>
      </main>
    </div>
  );
}
