import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';
import Link from 'next/link';
import { STATUS_CONFIG } from '@/lib/types/dashboard';
import type { ProjectStatus } from '@/lib/types/dashboard';

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

  const allProjects = projects || [];
  const statusCounts: Record<string, number> = {
    hold: 0, ongoing: 0, review: 0, revisi: 0, done: 0,
  };
  allProjects.forEach(p => {
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
  });

  // Upcoming deadlines (next 14 days)
  const now = new Date();
  const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const upcomingDeadlines = allProjects
    .filter(p => p.deadline && new Date(p.deadline) <= twoWeeks && p.status !== 'done')
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

  // Projects with issues (revisi or has notes with keywords)
  const alertProjects = allProjects.filter(p => 
    p.status === 'revisi' || p.status === 'hold'
  );

  // PIC workload
  const picWorkload: Record<string, { count: number; divisions: Set<string> }> = {};
  allProjects.forEach(p => {
    (p.divisions || []).forEach((d: { pic_name?: string; division: string }) => {
      if (d.pic_name) {
        if (!picWorkload[d.pic_name]) {
          picWorkload[d.pic_name] = { count: 0, divisions: new Set() };
        }
        picWorkload[d.pic_name].count++;
        picWorkload[d.pic_name].divisions.add(d.division);
      }
    });
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm mt-1">
            Selamat datang, <span className="text-amber-400">{user.full_name}</span>
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
        >
          <span>+</span> Project Baru
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Brand</p>
          <p className="text-3xl font-bold text-white mt-2">{brandsCount || 0}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Project</p>
          <p className="text-3xl font-bold text-white mt-2">{allProjects.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">On Going</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">{statusCounts.ongoing}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Perlu Perhatian</p>
          <p className="text-3xl font-bold text-orange-400 mt-2">{alertProjects.length}</p>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Status Project</h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <div key={status} className={`${config.bgColor} rounded-lg px-4 py-2 text-center min-w-[100px]`}>
              <p className={`text-2xl font-bold ${config.color}`}>{statusCounts[status]}</p>
              <p className={`text-xs font-medium ${config.color}`}>{config.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">⏰ Deadline Terdekat</h2>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-slate-500 text-sm">Tidak ada deadline dalam 14 hari ke depan</p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.slice(0, 5).map((p) => {
                const daysLeft = Math.ceil((new Date(p.deadline!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysLeft <= 3;
                return (
                  <Link key={p.id} href={`/dashboard/projects/${p.id}`} className="block">
                    <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      isUrgent 
                        ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40' 
                        : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                    }`}>
                      <div>
                        <p className="text-white text-sm font-medium">{p.name}</p>
                        <p className="text-slate-400 text-xs">{p.brand?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isUrgent ? 'text-red-400' : 'text-amber-400'}`}>
                          {daysLeft} hari
                        </p>
                        <p className="text-slate-500 text-xs">{p.deadline}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* PIC Workload */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">👤 Workload PIC</h2>
          {Object.keys(picWorkload).length === 0 ? (
            <p className="text-slate-500 text-sm">Belum ada data PIC</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(picWorkload)
                .sort(([,a], [,b]) => b.count - a.count)
                .map(([name, data]) => (
                  <div key={name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <p className="text-white text-sm font-medium">{name}</p>
                      <div className="flex gap-1 mt-1">
                        {Array.from(data.divisions).map(d => (
                          <span key={d} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-400 text-lg font-bold">{data.count}</p>
                      <p className="text-slate-500 text-xs">project</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Projects with Alerts */}
      {alertProjects.length > 0 && (
        <div className="bg-slate-900 border border-orange-500/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-orange-400 mb-4">⚠️ Project Perlu Perhatian</h2>
          <div className="space-y-3">
            {alertProjects.slice(0, 5).map((p) => {
              const statusConfig = STATUS_CONFIG[p.status as ProjectStatus];
              return (
                <Link key={p.id} href={`/dashboard/projects/${p.id}`} className="block">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-orange-500/30 transition-colors">
                    <div>
                      <p className="text-white text-sm font-medium">{p.name}</p>
                      <p className="text-slate-400 text-xs">{p.brand?.name}</p>
                      {p.notes && <p className="text-slate-500 text-xs mt-1 line-clamp-1">{p.notes}</p>}
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
