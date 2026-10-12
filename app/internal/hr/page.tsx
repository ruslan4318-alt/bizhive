import { getInternalUser } from '@/lib/auth';
import { canAccessHR } from '@/lib/types/dashboard';
import { redirect } from 'next/navigation';

export default async function HRPage() {
  const user = await getInternalUser();

  if (!canAccessHR(user.role)) {
    redirect('/internal');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">SDM / HR</h1>
        <p className="text-slate-400 mt-1">Manajemen tim internal BIZHIVE</p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
        <div className="text-5xl mb-4">👥</div>
        <h2 className="text-white font-semibold text-lg mb-2">SDM / HR</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Database karyawan, presensi, dan task assignment tim akan tersedia di Phase 4.
        </p>
      </div>
    </div>
  );
}
