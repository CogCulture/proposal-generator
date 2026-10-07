-- ============================================================
-- CogCulture Proposal Generator — Supabase Schema & Policies
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

-- 1. Ensure custom_users table is properly structured
CREATE TABLE IF NOT EXISTS public.custom_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Remove broken foreign key constraint on user_id if it exists
ALTER TABLE public.custom_users DROP CONSTRAINT IF EXISTS custom_users_user_id_fkey;
ALTER TABLE public.custom_users ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.custom_users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- 2. Ensure proposals table has collaboration columns
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT,
  brand_name TEXT,
  owner_email TEXT,
  access_level TEXT DEFAULT 'workspace',
  collaborators JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure all collaboration columns exist
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS owner_email TEXT;
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS access_level TEXT DEFAULT 'workspace';
ALTER TABLE public.proposals ADD COLUMN IF NOT EXISTS collaborators JSONB DEFAULT '[]'::jsonb;

-- 3. Ensure proposal_versions table has author and milestone columns
CREATE TABLE IF NOT EXISTS public.proposal_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES public.proposals(id) ON DELETE CASCADE,
  label TEXT,
  snapshot JSONB,
  version_number SERIAL,
  author_email TEXT,
  is_checkpoint BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure version columns exist
ALTER TABLE public.proposal_versions ADD COLUMN IF NOT EXISTS author_email TEXT;
ALTER TABLE public.proposal_versions ADD COLUMN IF NOT EXISTS is_checkpoint BOOLEAN DEFAULT false;
ALTER TABLE public.proposal_versions ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================================
-- 4. Permissions & RLS Setup (Allow seamless company collaboration)
-- ============================================================

ALTER TABLE public.custom_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposal_versions DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.custom_users TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.proposals TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.proposal_versions TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
