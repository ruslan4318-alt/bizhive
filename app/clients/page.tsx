import { createClient } from '@/lib/supabase/server';
import ClientsPageClient from './ClientsPageClient';

export default async function ClientsPage() {
  const supabase = await createClient();

  // Baca dari tabel 'clients' yang dikelola lewat /admin/clients
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name, logo_url, industry')
    .order('name');

  return <ClientsPageClient brands={clients || []} />;
}
