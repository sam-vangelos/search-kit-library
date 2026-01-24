import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { SearchKitRow } from './types';

// Lazy initialization to avoid build errors when env vars aren't set
let supabaseInstance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('Supabase not configured');
    return null;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

// Fetch all search kits
export async function getSearchKits(): Promise<SearchKitRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('search_kits')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching search kits:', error);
    throw error;
  }

  return data || [];
}

// Fetch a single search kit by ID
export async function getSearchKit(id: string): Promise<SearchKitRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('search_kits')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Error fetching search kit:', error);
    throw error;
  }

  return data;
}

// Fetch user favorites
export async function getUserFavorites(userId: string): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('user_favorites')
    .select('search_kit_id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }

  return data?.map((f) => f.search_kit_id) || [];
}

// Add a favorite
export async function addFavorite(userId: string, searchKitId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase
    .from('user_favorites')
    .insert({ user_id: userId, search_kit_id: searchKitId });

  if (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
}

// Remove a favorite
export async function removeFavorite(userId: string, searchKitId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('search_kit_id', searchKitId);

  if (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}

// Get or create user ID from localStorage
export function getUserId(): string {
  if (typeof window === 'undefined') return '';

  let userId = localStorage.getItem('search_kit_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('search_kit_user_id', userId);
  }
  return userId;
}
