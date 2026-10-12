import { getInternalUser } from '@/lib/auth';
import { canAccessProjects } from '@/lib/types/dashboard';
import { redirect } from 'next/navigation';
import ShopOptimizationAnalytics from '@/components/dashboard/ShopOptimizationAnalytics';

export default async function InternalProjectsPage() {
  const user = await getInternalUser();

  if (!canAccessProjects(user.role)) {
    redirect('/internal');
  }

  return (
    <div>
      <ShopOptimizationAnalytics />
    </div>
  );
}
