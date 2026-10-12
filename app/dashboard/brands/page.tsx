import { getAuthUser } from '@/lib/auth';
import BrandsManagementClient from '@/components/dashboard/BrandsManagementClient';

export const metadata = {
  title: 'Brands - BIZHIVE Management',
};

export default async function DashboardBrandsPage() {
  await getAuthUser();

  return (
    <div>
      <BrandsManagementClient />
    </div>
  );
}
