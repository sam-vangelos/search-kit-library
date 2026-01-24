'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { SearchBar, KitCard } from '@/components';
import { SearchKitRow, SearchKit } from '@/lib/types';
import { getSearchKits } from '@/lib/supabase';

// Import seed data as fallback
import seedData from '../../seed-data/frontier-data-lead-rl.json';

// Fallback mock data when Supabase isn't configured
const MOCK_KITS: SearchKitRow[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    role_title: seedData.role_title,
    company: seedData.company,
    created_at: new Date().toISOString(),
    created_by: seedData.created_by,
    input_jd: seedData.input_jd,
    input_intake: seedData.input_intake,
    kit_data: seedData.kit_data as unknown as SearchKit,
  },
];

type FilterTab = 'all' | 'favorites';

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [kits, setKits] = useState<SearchKitRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

  // Load kits from Supabase or fallback to mock data
  useEffect(() => {
    async function loadKits() {
      try {
        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          console.log('Supabase not configured, using mock data');
          setKits(MOCK_KITS);
          setUsingMockData(true);
          setIsLoading(false);
          return;
        }

        const fetchedKits = await getSearchKits();
        if (fetchedKits.length === 0) {
          // No kits in database, use mock data
          setKits(MOCK_KITS);
          setUsingMockData(true);
        } else {
          setKits(fetchedKits);
          setUsingMockData(false);
        }
      } catch (error) {
        console.error('Error loading kits:', error);
        // Fallback to mock data on error
        setKits(MOCK_KITS);
        setUsingMockData(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadKits();
  }, []);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('search_kit_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (kitId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(kitId)
        ? prev.filter((id) => id !== kitId)
        : [...prev, kitId];
      localStorage.setItem('search_kit_favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // Filter kits based on search query and active tab
  const filteredKits = useMemo(() => {
    let result = kits;

    // Filter by favorites if on favorites tab
    if (activeTab === 'favorites') {
      result = result.filter((kit) => favorites.includes(kit.id));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((kit) => {
        const searchableText = [
          kit.role_title,
          kit.company,
          kit.created_by,
          kit.kit_data.role_summary,
          ...kit.kit_data.blocks.map((b) => b.title),
          ...kit.kit_data.archetypes.map((a) => a.name),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return searchableText.includes(query);
      });
    }

    return result;
  }, [kits, searchQuery, activeTab, favorites]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-primary border-b border-border-primary">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-text-primary">Search Kit Library</h1>
              <p className="text-sm text-text-secondary">Browse and favorite role-specific boolean sourcing kits</p>
            </div>
            <Link
              href="/generate"
              className="px-4 py-2 bg-accent-blue text-bg-primary font-semibold text-sm rounded-md hover:opacity-90 transition-opacity"
            >
              Generate New Kit
            </Link>
          </div>

          {/* Search Bar */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Filter Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
            >
              All Kits ({kits.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`filter-tab ${activeTab === 'favorites' ? 'active' : ''}`}
            >
              My Favorites ({favorites.length})
            </button>
          </div>

          {/* Mock data notice */}
          {usingMockData && (
            <div className="mt-4 text-xs text-text-muted bg-bg-secondary border border-border-primary rounded px-3 py-2">
              Using sample data. Configure Supabase to enable persistence and generation.
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {filteredKits.length === 0 ? (
          <div className="text-center py-16">
            {activeTab === 'favorites' && favorites.length === 0 ? (
              <>
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-text-primary mb-2">No favorites yet</h3>
                <p className="text-text-secondary mb-4">
                  Click the heart icon on any kit to add it to your favorites.
                </p>
                <button
                  onClick={() => setActiveTab('all')}
                  className="text-accent-blue hover:underline"
                >
                  Browse all kits
                </button>
              </>
            ) : searchQuery ? (
              <>
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-text-primary mb-2">No results found</h3>
                <p className="text-text-secondary mb-4">
                  No kits match "{searchQuery}". Try a different search term.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-accent-blue hover:underline"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-text-primary mb-2">No Search Kits yet</h3>
                <p className="text-text-secondary mb-4">
                  Be the first to create one!
                </p>
                <Link
                  href="/generate"
                  className="inline-block px-4 py-2 bg-accent-blue text-bg-primary font-semibold text-sm rounded-md hover:opacity-90 transition-opacity"
                >
                  Generate New Kit
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKits.map((kit) => (
              <KitCard
                key={kit.id}
                kit={kit}
                isFavorited={favorites.includes(kit.id)}
                onFavoriteToggle={() => toggleFavorite(kit.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
