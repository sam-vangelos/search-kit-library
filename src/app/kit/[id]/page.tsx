'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FavoriteButton, ArchetypeAccordion, BlockSection } from '@/components';
import { SearchKitRow, SearchKit } from '@/lib/types';
import { getSearchKit } from '@/lib/supabase';

// Import seed data as fallback
import seedData from '../../../../seed-data/frontier-data-lead-rl.json';

// Fallback mock data
const MOCK_KIT: SearchKitRow = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  role_title: seedData.role_title,
  company: seedData.company,
  created_at: new Date().toISOString(),
  created_by: seedData.created_by,
  input_jd: seedData.input_jd,
  input_intake: seedData.input_intake,
  kit_data: seedData.kit_data as unknown as SearchKit,
};

export default function KitDetailPage() {
  const params = useParams();
  const kitId = params.id as string;

  const [kit, setKit] = useState<SearchKitRow | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadKit() {
      try {
        // Check if this is the mock kit ID
        if (kitId === '550e8400-e29b-41d4-a716-446655440000') {
          setKit(MOCK_KIT);
          setIsLoading(false);
          return;
        }

        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          setError('Supabase not configured');
          setIsLoading(false);
          return;
        }

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

    // Load favorite status
    const savedFavorites = localStorage.getItem('search_kit_favorites');
    if (savedFavorites) {
      const favorites = JSON.parse(savedFavorites);
      setIsFavorited(favorites.includes(kitId));
    }
  }, [kitId]);

  const toggleFavorite = () => {
    const savedFavorites = localStorage.getItem('search_kit_favorites');
    const favorites: string[] = savedFavorites ? JSON.parse(savedFavorites) : [];

    const newFavorites = isFavorited
      ? favorites.filter((id) => id !== kitId)
      : [...favorites, kitId];

    localStorage.setItem('search_kit_favorites', JSON.stringify(newFavorites));
    setIsFavorited(!isFavorited);
  };

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
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-bg-primary border-b border-border-primary">
        <div className="max-w-4xl mx-auto px-6 py-4">
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
            <FavoriteButton isFavorited={isFavorited} onClick={toggleFavorite} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8 pb-6 border-b border-border-primary">
          <h1 className="text-3xl font-bold text-text-primary mb-3 bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text">
            {kit.role_title}
          </h1>
          <p className="text-[15px] text-text-secondary max-w-2xl">
            {kit_data.role_summary}
          </p>
          <p className="text-xs text-text-muted mt-3">
            Generated {createdDate} · Template v{kit_data.version} · {kit.company}
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
