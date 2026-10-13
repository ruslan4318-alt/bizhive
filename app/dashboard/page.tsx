import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';
import DashboardOverviewClient from '@/components/dashboard/DashboardOverviewClient';

export const metadata = {
  title: 'Dashboard - BIZHIVE Management',
};

export default async function DashboardOverviewPage() {
  const user = await getAuthUser();
  const supabase = await createClient();

  // Fetch projects with brand info
  const { data: projects } = await supabase
    .from('projects')
    .select('*, brand:brands(*), divisions:project_divisions(*)')
    .order('updated_at', { ascending: false });

  // Fetch brands count
  const { count: brandsCount } = await supabase
    .from('brands')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Fetch brands list
  const { data: brandsList } = await supabase
    .from('brands')
    .select('id, name')
    .eq('is_active', true)
    .order('name');

  return (
    <DashboardOverviewClient
      user={user}
      projects={projects || []}
      brandsCount={brandsCount || 0}
      brandsList={brandsList || []}
    />
  );
}
