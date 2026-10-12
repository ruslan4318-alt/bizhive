import { getInternalUser } from '@/lib/auth';
import { canAccessProjects } from '@/lib/types/dashboard';
import { redirect } from 'next/navigation';

export default async function ProjectsPage() {
  const user = await getInternalUser();

  if (!canAccessProjects(user.role)) {
    redirect('/internal');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Project Overview</h1>
        <p className="text-slate-400 mt-1">Ringkasan semua project aktif</p>
      </div>

      {/* Placeholder — akan diisi di Phase 2 */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-white font-semibold text-lg mb-2">Project Tracker</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          Modul ini sedang dalam pengembangan. Kanban board, timeline, dan task management akan tersedia di Phase 2.
        </p>
      </div>
    </div>
  );
}
