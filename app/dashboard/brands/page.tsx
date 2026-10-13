import { getAuthUser } from '@/lib/auth';
import BrandsHubClient from '@/components/dashboard/BrandsHubClient';

export const metadata = {
  title: 'Brands - BIZHIVE Operations',
};

export default async function DashboardBrandsPage() {
  await getAuthUser();

  return (
    <div className="px-4 py-6 md:px-8 lg:px-10">
      <BrandsHubClient />
    </div>
  );
}
