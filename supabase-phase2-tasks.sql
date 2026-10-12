-- ============================================================
-- BIZHIVE Phase 2 — Tasks & Project Board Migration
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Ensure brands table exists
CREATE TABLE IF NOT EXISTS public.brands (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  logo_url    TEXT,
  platform    TEXT DEFAULT 'shopee',
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create tasks table for Shop Optimization & Project Board
CREATE TABLE IF NOT EXISTS public.tasks (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  brand_id      UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  brand_name    TEXT NOT NULL,
  platform      TEXT NOT NULL DEFAULT 'shopee'
                CHECK (platform IN ('shopee', 'tiktok', 'tokopedia', 'lazada', 'instagram', 'other')),
  pillar        TEXT NOT NULL DEFAULT 'listing'
                CHECK (pillar IN ('listing', 'ads', 'promo', 'other')),
  status        TEXT NOT NULL DEFAULT 'backlog'
                CHECK (status IN ('backlog', 'in_progress', 'review', 'revision', 'done')),
  priority      TEXT NOT NULL DEFAULT 'normal'
                CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_name TEXT,
  deadline      DATE,
  has_issue     BOOLEAN DEFAULT false,
  issue_notes   TEXT,
  external_link TEXT,
  created_by    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view & manage tasks
CREATE POLICY "authenticated_select_brands" ON public.brands FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_all_brands" ON public.brands FOR ALL TO authenticated USING (true);

CREATE POLICY "authenticated_select_tasks" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_all_tasks" ON public.tasks FOR ALL TO authenticated USING (true);

-- Step 4: Sample initial data for testing
INSERT INTO public.brands (id, name, platform) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Somethinc Official', 'shopee'),
  ('22222222-2222-2222-2222-222222222222', 'Buttonscarves Beauty', 'tiktok'),
  ('33333333-3333-3333-3333-333333333333', 'Cosmax Store', 'tokopedia')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (title, brand_name, platform, pillar, status, priority, assigned_name, deadline, has_issue, issue_notes, external_link) VALUES
  ('Revamp Foto Etalase & Copywriting 10 Hero Skincare', 'Somethinc Official', 'shopee', 'listing', 'in_progress', 'high', 'Sarah (Designer)', CURRENT_DATE + INTERVAL '2 days', true, 'Menunggu foto resolusi tinggi botol baru dari klien', 'https://drive.google.com'),
  ('Optimasi Bid Kata Kunci & Target ROAS 6.0', 'Somethinc Official', 'shopee', 'ads', 'in_progress', 'urgent', 'Rian (Ads Spec)', CURRENT_DATE + INTERVAL '1 day', false, null, null),
  ('Setup Voucher Payday 10% & Combo Hemat Bundling', 'Buttonscarves Beauty', 'tiktok', 'promo', 'backlog', 'normal', 'Dina (Store Ops)', CURRENT_DATE + INTERVAL '5 days', false, null, null),
  ('Audit Listing & Spesifikasi Produk Banned/Warning', 'Cosmax Store', 'tokopedia', 'listing', 'review', 'normal', 'Budi (Ops)', CURRENT_DATE + INTERVAL '3 days', false, null, null),
  ('Daftar Mega Campaign 11.11 Flash Sale Toko', 'Buttonscarves Beauty', 'tiktok', 'promo', 'done', 'high', 'Dina (Store Ops)', CURRENT_DATE - INTERVAL '1 day', false, null, null)
ON CONFLICT DO NOTHING;
