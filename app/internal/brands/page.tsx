import { getInternalUser } from '@/lib/auth';
import { canAccessBrands } from '@/lib/types/dashboard';
import { redirect } from 'next/navigation';

export default async function BrandsPage() {
  const user = await getInternalUser();

  if (!canAccessBrands(user.role)) {
    redirect('/internal');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Brand Report</h1>
        <p className="text-slate-400 mt-1">Overview performa semua brand</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-white font-semibold text-lg mb-2">Brand Report</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Dashboard performa brand, input data Shopee & TikTok, serta export laporan akan tersedia di Phase 3.
        </p>
      </div>
    </div>
  );
}
