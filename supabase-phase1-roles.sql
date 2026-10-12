-- ============================================================
-- BIZHIVE Internal System — Phase 1: Role & Auth Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Create profiles table (baru, extend dari auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL DEFAULT '',
  email         TEXT NOT NULL DEFAULT '',
  role          TEXT NOT NULL DEFAULT 'account_manager'
                CHECK (role IN ('super_admin', 'admin', 'project_manager', 'account_manager', 'hr')),
  department    TEXT,
  avatar_url    TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: RLS Policies
-- User bisa SELECT & UPDATE profil sendiri
CREATE POLICY "users_select_own_profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Super admin bisa lihat & kelola semua profil
CREATE POLICY "super_admin_all_profiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- Step 4: Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Step 5: Auto-create profile saat user baru register
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- PENTING: Jalankan bagian ini SETELAH membuat akun
-- admin@bizhiveid.com di Supabase Auth > Users
-- ============================================================
-- Ganti <USER_ID> dengan UUID user admin@bizhiveid.com dari Supabase dashboard

-- INSERT INTO public.profiles (id, email, full_name, role)
-- VALUES (
--   '<USER_ID>',                    -- UUID dari Supabase Auth
--   'admin@bizhiveid.com',
--   'Super Admin',
--   'super_admin'
-- )
-- ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
