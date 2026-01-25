'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { SearchBar, KitCard, EmailPromptModal, InfoModal } from '@/components';
import { SearchKitRow } from '@/lib/types';
import {
  getSearchKits,
  getUserFavorites,
  addFavorite,
  removeFavorite,
  getUserEmail,
  setUserEmail,
} from '@/lib/supabase';

type FilterTab = 'all' | 'favorites';

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [kits, setKits] = useState<SearchKitRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [userEmail, setUserEmailState] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Check for user email on mount
  useEffect(() => {
    const email = getUserEmail();
    if (email) {
      setUserEmailState(email);
    } else {
      setShowEmailPrompt(true);
    }
  }, []);

  // Load kits from Supabase
  useEffect(() => {
    async function loadKits() {
      try {
        const fetchedKits = await getSearchKits();
        setKits(fetchedKits);
      } catch (error) {
        console.error('Error loading kits:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadKits();
  }, []);

  // Load favorites from Supabase when user email is set
  useEffect(() => {
    async function loadFavorites() {
      if (!userEmail) return;

      try {
        const userFavorites = await getUserFavorites(userEmail);
        setFavorites(userFavorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }

    loadFavorites();
  }, [userEmail]);

  // Handle email submission
  const handleEmailSubmit = useCallback((email: string) => {
    setUserEmail(email);
    setUserEmailState(email);
    setShowEmailPrompt(false);
  }, []);

  // Toggle favorite using Supabase
  const toggleFavorite = useCallback(async (kitId: string) => {
    if (!userEmail) {
      setShowEmailPrompt(true);
      return;
    }

    const isFavorited = favorites.includes(kitId);

    // Optimistic update
    setFavorites((prev) =>
      isFavorited ? prev.filter((id) => id !== kitId) : [...prev, kitId]
    );

    try {
      if (isFavorited) {
        await removeFavorite(userEmail, kitId);
      } else {
        await addFavorite(userEmail, kitId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      setFavorites((prev) =>
        isFavorited ? [...prev, kitId] : prev.filter((id) => id !== kitId)
      );
    }
  }, [userEmail, favorites]);

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
      {/* Email Prompt Modal */}
      {showEmailPrompt && (
        <EmailPromptModal onSubmit={handleEmailSubmit} />
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <InfoModal onClose={() => setShowInfoModal(false)} />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-primary border-b border-border-primary">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-text-primary">Search Kit Library</h1>
              <p className="text-sm text-text-secondary">Browse and favorite role-specific boolean sourcing kits</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfoModal(true)}
                className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary border border-border-primary rounded-md hover:border-text-muted transition-colors"
                title="About Search Kit Library"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <Link
                href="/generate"
                className="px-4 py-2 bg-accent-blue text-bg-primary font-semibold text-sm rounded-md hover:opacity-90 transition-opacity"
              >
                Generate New Kit
              </Link>
            </div>
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
