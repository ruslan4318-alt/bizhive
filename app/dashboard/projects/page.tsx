import { getAuthUser } from '@/lib/auth';
import ShopOptimizationAnalytics from '@/components/dashboard/ShopOptimizationAnalytics';

export default async function DashboardProjectsPage() {
  await getAuthUser();

  return (
    <div>
      <ShopOptimizationAnalytics />
    </div>
  );
}
