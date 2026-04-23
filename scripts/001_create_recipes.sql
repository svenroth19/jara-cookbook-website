-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'main',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);

-- Since this is a public cookbook with no auth required,
-- we'll disable RLS to allow public read access
ALTER TABLE recipes DISABLE ROW LEVEL SECURITY;
