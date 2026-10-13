import { getAuthUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import ProjectsHubClient from '@/components/dashboard/ProjectsHubClient';
import type { TaskItem, TaskPriority, TaskStatus, ServiceType } from '@/components/dashboard/ProjectsHubClient';

export const metadata = {
  title: 'Projects & Tasks - BIZHIVE Management',
};

export default async function DashboardProjectsPage() {
  const user = await getAuthUser();
  const supabase = await createClient();

  // Fetch projects from database
  const { data: dbProjects } = await supabase
    .from('projects')
    .select('*, brand:brands(name), divisions:project_divisions(pic_name, division)')
    .order('created_at', { ascending: false });

  // Fetch brands list for task creation dropdown
  const { data: brands } = await supabase
    .from('brands')
    .select('id, name')
    .eq('is_active', true)
    .order('name');

  // Transform dbProjects if any
  const initialTasks: TaskItem[] = (dbProjects || []).map((p: any) => {
    // Infer service type from name or division
    let service_type: ServiceType = 'shop_opt';
    const firstDiv = p.divisions?.[0]?.division;
    if (firstDiv === 'content_creator') service_type = 'content';
    else if (firstDiv === 'kol' || firstDiv === 'affiliate') service_type = 'kol';

    const pic_name = p.divisions?.[0]?.pic_name || user.full_name;

    return {
      id: p.id,
      title: p.name,
      brand_name: p.brand?.name || 'Brand Klien',
      service_type,
      pic_name,
      created_by: p.created_by,
      deadline: p.deadline || new Date().toISOString().split('T')[0],
      priority: (p.priority || 'normal') as TaskPriority,
      status: (p.status || 'ongoing') as TaskStatus,
      notes: p.notes,
    };
  });

  return (
    <ProjectsHubClient
      user={user}
      initialTasks={initialTasks}
      brandsList={brands || []}
    />
  );
}
