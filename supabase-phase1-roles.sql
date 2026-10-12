-- ============================================================
-- BIZHIVE Phase 1 — SQL Migration
-- Jalankan di Supabase SQL Editor
-- CARA: Copy salah satu bagian, paste, klik Run, lanjut bagian berikutnya
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- BAGIAN 1 — Buat tabel + RLS
-- Copy dari sini sampai tanda AKHIR BAGIAN 1, lalu Run
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'account_manager'
              CHECK (role IN ('super_admin', 'admin', 'project_manager', 'account_manager', 'hr')),
  department  TEXT,
  avatar_url  TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "super_admin_all_profiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- ════ AKHIR BAGIAN 1 ════


-- ════════════════════════════════════════════════════════════
-- BAGIAN 2 — Function auto-update updated_at
-- Copy dari sini sampai tanda AKHIR BAGIAN 2, lalu Run
-- ════════════════════════════════════════════════════════════

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

-- ════ AKHIR BAGIAN 2 ════


-- ════════════════════════════════════════════════════════════
-- BAGIAN 3 — Function auto-create profile saat user register
-- Copy dari sini sampai tanda AKHIR BAGIAN 3, lalu Run
-- ════════════════════════════════════════════════════════════

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

-- ════ AKHIR BAGIAN 3 ════


-- ════════════════════════════════════════════════════════════
-- BAGIAN 4 — Set Super Admin (jalankan SETELAH buat user di Auth)
--
-- Langkah:
-- 1. Buka Authentication > Users > Add User
-- 2. Email: admin@bizhiveid.com, isi password
-- 3. Copy UUID yang muncul
-- 4. Ganti <PASTE_UUID_DISINI> di bawah dengan UUID tersebut
-- 5. Run bagian ini
-- ════════════════════════════════════════════════════════════

-- INSERT INTO public.profiles (id, email, full_name, role)
-- VALUES (
--   '<PASTE_UUID_DISINI>',
--   'admin@bizhiveid.com',
--   'Super Admin',
--   'super_admin'
-- )
-- ON CONFLICT (id) DO UPDATE SET role = 'super_admin';

-- ════ AKHIR BAGIAN 4 ════
