-- BIZHIVE Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    description TEXT,
    industry VARCHAR(100),
    website VARCHAR(255),
    is_featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News/Articles table
CREATE TABLE IF NOT EXISTS news (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image TEXT,
    category VARCHAR(100),
    author VARCHAR(255) DEFAULT 'BIZHIVE Team',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Case Studies table
CREATE TABLE IF NOT EXISTS case_studies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    description TEXT,
    before_value VARCHAR(100),
    after_value VARCHAR(100),
    growth_percentage VARCHAR(50),
    metric_type VARCHAR(100),
    timeline VARCHAR(100),
    featured_image TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    icon VARCHAR(50),
    features JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table (for additional admin metadata)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_slug ON clients(slug);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

-- Row Level Security (RLS) policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Public read published news" ON news FOR SELECT USING (is_published = true);
CREATE POLICY "Public read case_studies" ON case_studies FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (is_active = true);

-- Admin write access (authenticated users can write)
CREATE POLICY "Admin insert clients" ON clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update clients" ON clients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete clients" ON clients FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert news" ON news FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update news" ON news FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete news" ON news FOR DELETE TO authenticated USING (true);
CREATE POLICY "Admin read all news" ON news FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin insert case_studies" ON case_studies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update case_studies" ON case_studies FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete case_studies" ON case_studies FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin insert services" ON services FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin update services" ON services FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin delete services" ON services FOR DELETE TO authenticated USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for images
CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Admin upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');
CREATE POLICY "Admin delete images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'images');
