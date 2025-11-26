-- ============================================
-- TenniTrack Team Management System Migration
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role text,
  created_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin','member')),
  status text NOT NULL CHECK (status IN ('pending','approved','rejected')),
  created_at timestamptz DEFAULT now()
);

-- Create unique index to enforce one team per user
CREATE UNIQUE INDEX IF NOT EXISTS team_members_one_team_per_user 
ON public.team_members(user_id)
WHERE status IN ('pending','approved');

-- Add team_id to players table
ALTER TABLE public.players 
ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES public.teams(id);

-- Add team_id to matches table
ALTER TABLE public.matches 
ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES public.teams(id);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on new tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams
CREATE POLICY "Users can view teams they are members of"
ON public.teams FOR SELECT
USING (
  id IN (
    SELECT team_id FROM public.team_members
    WHERE user_id = auth.uid() AND status = 'approved'
  )
);

CREATE POLICY "Users can insert teams"
ON public.teams FOR INSERT
WITH CHECK (created_by = auth.uid());

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid());

-- RLS Policies for team_members
CREATE POLICY "Users can view team members of their team"
ON public.team_members FOR SELECT
USING (
  team_id IN (
    SELECT team_id FROM public.team_members
    WHERE user_id = auth.uid() AND status = 'approved'
  )
);

CREATE POLICY "Users can insert team membership requests"
ON public.team_members FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Team admins can update team members"
ON public.team_members FOR UPDATE
USING (
  team_id IN (
    SELECT team_id FROM public.team_members
    WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
  )
);

-- ============================================
-- Update RLS for existing tables (players)
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view players in their team" ON public.players;
DROP POLICY IF EXISTS "Users can insert players in their team" ON public.players;
DROP POLICY IF EXISTS "Users can update players in their team" ON public.players;
DROP POLICY IF EXISTS "Users can delete players in their team" ON public.players;

-- Create new team-scoped policies for players
CREATE POLICY "Users can view players in their team"
ON public.players FOR SELECT
USING (
  team_id IN (
    SELECT team_id FROM public.team_members
    WHERE user_id = auth.uid() AND status = 'approved'
  )
);

CREATE POLICY "Users can insert players in their team"
ON public.players FOR INSERT
WITH CHECK (
  team_id IN (
    SELECT team_id FROM public.team_members
    WHERE user_id = auth.uid() AND status = 'approved'
  )
);

CREATE POLICY "Users can update players in their team"
ON public.players FOR UPDATE
USING (
  team_id IN (
    SELECT team_id FROM public.team_members
    WHERE user_id = auth.uid() AND status = 'approved'
  )
);

CREATE POLICY "Users can delete players in their team"
ON public.players FOR DELETE
USING (
  team_id IN (
    SELECT team_id FROM public.team_members
    WHERE user_id = auth.uid() AND status = 'approved'
  )
);

-- ============================================
-- Update RLS for existing tables (matches)
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view matches in their team" ON public.matches;
DROP POLICY IF EXISTS "Users can insert matches in their team" ON public.matches;
DROP POLICY IF EXISTS "Users can update matches in their team" ON public.matches;
DROP POLICY IF EXISTS "Users can delete matches in their team" ON public.matches;

-- Create new team-scoped policies for matches
CREATE POLICY "Users can view matches in their team"
ON public.matches FOR SELECT
USING (
  team_id IN (
    SELECT team_id FROM public.team_members
    WHERE user_id = auth.uid() AND status = 'approved'
  )
);

CREATE POLICY "Users can insert matches in their team"
ON public.matches FOR INSERT
WITH CHECK (
  team_id IN (
    SELECT team_id FROM public.team_members
    WHERE user_id = auth.uid() AND status = 'approved'
  )
);

CREATE POLICY "Users can update matches in their team"
ON public.matches FOR UPDATE
USING (
  team_id IN (
    SELECT team_id FROM public.team_members
    WHERE user_id = auth.uid() AND status = 'approved'
  )
);

CREATE POLICY "Users can delete matches in their team"
ON public.matches FOR DELETE
USING (
  team_id IN (
    SELECT team_id FROM public.team_members
    WHERE user_id = auth.uid() AND status = 'approved'
  )
);

-- ============================================
-- Migration Complete
-- ============================================
-- Next steps:
-- 1. Enable email authentication in Supabase Auth settings
-- 2. Configure email templates for confirmation emails
-- 3. Test the authentication flow in your app
-- ============================================
