import { createClient } from '@/lib/supabase/server';
import ClientsPageClient from './ClientsPageClient';

export default async function ClientsPage() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, logo_url, platform')
    .eq('is_active', true)
    .order('name');

  return <ClientsPageClient brands={brands || []} />;
}
