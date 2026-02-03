import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for the news table
export interface NewsArticle {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    image_url: string | null;
    published_at: string;
    created_at: string;
}
