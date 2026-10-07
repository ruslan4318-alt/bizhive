-- BIZHIVE Dashboard Database Schema
-- Run this in Supabase SQL Editor
-- This adds internal dashboard tables to the existing schema

-- ============================================
-- 1. Update admin_users to support roles
-- ============================================
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'regular';
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- ============================================
-- 2. Brands table (for dashboard projects)
-- ============================================
CREATE TABLE IF NOT EXISTS brands (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    platform VARCHAR(50) DEFAULT 'shopee',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. Projects table
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    platform VARCHAR(50) DEFAULT 'shopee',
    status VARCHAR(50) DEFAULT 'ongoing' CHECK (status IN ('hold', 'ongoing', 'review', 'revisi', 'done')),
    start_date DATE,
    deadline DATE,
    notes TEXT,
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 4. Project Divisions table
-- ============================================
CREATE TABLE IF NOT EXISTS project_divisions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    division VARCHAR(50) NOT NULL CHECK (division IN ('ads', 'content_creator', 'affiliate', 'kol')),
    pic_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'ongoing' CHECK (status IN ('hold', 'ongoing', 'review', 'revisi', 'done')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. Shopee Daily Metrics table
-- ============================================
CREATE TABLE IF NOT EXISTS shopee_daily (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    ad_type VARCHAR(50) NOT NULL CHECK (ad_type IN ('product_ads', 'shop_ads')),
    expense DECIMAL(15,2) DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    products_sold INTEGER DEFAULT 0,
    direct_gmv DECIMAL(15,2) DEFAULT 0,
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, date, ad_type)
);

-- ============================================
-- 6. Shopee Monthly Summary table
-- ============================================
CREATE TABLE IF NOT EXISTS shopee_monthly (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    month_year VARCHAR(7) NOT NULL, -- Format: '2026-08'
    placed_order DECIMAL(15,2) DEFAULT 0,
    confirmed_order DECIMAL(15,2) DEFAULT 0,
    roi_target DECIMAL(10,2),
    campaign_target INTEGER DEFAULT 0,
    campaign_actual INTEGER DEFAULT 0,
    shop_deco_target INTEGER DEFAULT 0,
    shop_deco_actual INTEGER DEFAULT 0,
    flash_sale_target INTEGER DEFAULT 0,
    flash_sale_actual INTEGER DEFAULT 0,
    broadcast_target INTEGER DEFAULT 0,
    broadcast_actual INTEGER DEFAULT 0,
    voucher_target INTEGER DEFAULT 0,
    voucher_actual INTEGER DEFAULT 0,
    ads_keyword_spend DECIMAL(15,2) DEFAULT 0,
    health_status VARCHAR(50) DEFAULT 'sangat_baik' CHECK (health_status IN ('sangat_baik', 'baik', 'perlu_perbaikan')),
    penalty_points INTEGER DEFAULT 0,
    penalty_detail TEXT,
    failed_metrics INTEGER DEFAULT 0,
    summary_text TEXT,
    next_plan_text TEXT,
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, month_year)
);

-- ============================================
-- 7. TikTok Objectives table
-- ============================================
CREATE TABLE IF NOT EXISTS tiktok_objectives (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    objective VARCHAR(50) NOT NULL CHECK (objective IN ('reach', 'views', 'traffics', 'product_live')),
    budget_estimated DECIMAL(15,2) DEFAULT 0,
    actual_spend DECIMAL(15,2) DEFAULT 0,
    kpi_1_label VARCHAR(100),
    kpi_1_value DECIMAL(15,4),
    kpi_2_label VARCHAR(100),
    kpi_2_value DECIMAL(15,4),
    result DECIMAL(15,4),
    status VARCHAR(50) DEFAULT 'ongoing' CHECK (status IN ('hold', 'ongoing', 'review', 'revisi', 'done')),
    note TEXT,
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, date, objective)
);

-- ============================================
-- 8. Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_brand ON projects(brand_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_divisions_project ON project_divisions(project_id);
CREATE INDEX IF NOT EXISTS idx_shopee_daily_project_date ON shopee_daily(project_id, date);
CREATE INDEX IF NOT EXISTS idx_shopee_monthly_project ON shopee_monthly(project_id, month_year);
CREATE INDEX IF NOT EXISTS idx_tiktok_objectives_project ON tiktok_objectives(project_id, date);

-- ============================================
-- 9. RLS Policies
-- ============================================
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopee_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopee_monthly ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiktok_objectives ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read everything
CREATE POLICY "Auth read brands" ON brands FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth read projects" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth read project_divisions" ON project_divisions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth read shopee_daily" ON shopee_daily FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth read shopee_monthly" ON shopee_monthly FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth read tiktok_objectives" ON tiktok_objectives FOR SELECT TO authenticated USING (true);

-- All authenticated users can insert/update
CREATE POLICY "Auth insert brands" ON brands FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update brands" ON brands FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update projects" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth insert project_divisions" ON project_divisions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update project_divisions" ON project_divisions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth insert shopee_daily" ON shopee_daily FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update shopee_daily" ON shopee_daily FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth insert shopee_monthly" ON shopee_monthly FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update shopee_monthly" ON shopee_monthly FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth insert tiktok_objectives" ON tiktok_objectives FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update tiktok_objectives" ON tiktok_objectives FOR UPDATE TO authenticated USING (true);

-- Only admins can delete (we'll enforce this in the app layer too)
CREATE POLICY "Auth delete brands" ON brands FOR DELETE TO authenticated USING (true);
CREATE POLICY "Auth delete projects" ON projects FOR DELETE TO authenticated USING (true);
CREATE POLICY "Auth delete project_divisions" ON project_divisions FOR DELETE TO authenticated USING (true);
CREATE POLICY "Auth delete shopee_daily" ON shopee_daily FOR DELETE TO authenticated USING (true);
CREATE POLICY "Auth delete shopee_monthly" ON shopee_monthly FOR DELETE TO authenticated USING (true);
CREATE POLICY "Auth delete tiktok_objectives" ON tiktok_objectives FOR DELETE TO authenticated USING (true);

-- Admin users read policy
CREATE POLICY "Auth read admin_users" ON admin_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth update admin_users" ON admin_users FOR UPDATE TO authenticated USING (true);
