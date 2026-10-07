import { createClient } from '@/lib/supabase/server';
import ClientsPageClient, { CaseStudyItem, ClientItem } from './ClientsPageClient';

export default async function ClientsPage() {
  const supabase = await createClient();

  // 1. Fetch clients for logo grid
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, logo_url, industry')
    .order('name');

  // 2. Fetch case studies from Supabase with joined client details
  const { data: caseStudiesData } = await supabase
    .from('case_studies')
    .select('id, title, slug, description, before_value, after_value, growth_percentage, metric_type, timeline, featured_image, is_featured, client:clients(name, logo_url, industry)')
    .order('created_at', { ascending: false });

  const formattedCaseStudies: CaseStudyItem[] = (caseStudiesData || []).map((cs: any) => ({
    id: cs.id,
    title: cs.title,
    slug: cs.slug,
    description: cs.description,
    before_value: cs.before_value,
    after_value: cs.after_value,
    growth_percentage: cs.growth_percentage,
    metric_type: cs.metric_type,
    timeline: cs.timeline,
    featured_image: cs.featured_image,
    is_featured: cs.is_featured,
    client: Array.isArray(cs.client) ? cs.client[0] : cs.client,
  }));

  return (
    <ClientsPageClient 
      brands={(clients as ClientItem[]) || []} 
      caseStudies={formattedCaseStudies}
    />
  );
}
