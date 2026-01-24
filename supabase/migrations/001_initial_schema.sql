-- Search Kit Library Schema
-- Phase 1: search_kits and user_favorites tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- search_kits table: stores all generated Search Kits
CREATE TABLE search_kits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_title TEXT NOT NULL,
  company TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT NOT NULL,
  input_jd TEXT NOT NULL,
  input_intake TEXT,
  kit_data JSONB NOT NULL
);

-- Create index for faster text search on role_title and company
CREATE INDEX idx_search_kits_role_title ON search_kits USING gin(to_tsvector('english', role_title));
CREATE INDEX idx_search_kits_company ON search_kits USING gin(to_tsvector('english', COALESCE(company, '')));
CREATE INDEX idx_search_kits_created_at ON search_kits (created_at DESC);

-- user_favorites table: stores user favorites (localStorage UUID based)
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  search_kit_id UUID NOT NULL REFERENCES search_kits(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, search_kit_id)
);

-- Create index for faster lookups by user
CREATE INDEX idx_user_favorites_user_id ON user_favorites (user_id);

-- Enable Row Level Security (optional for future use)
ALTER TABLE search_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (no auth)
CREATE POLICY "Allow all operations on search_kits" ON search_kits FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_favorites" ON user_favorites FOR ALL USING (true);
