import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { STATUS_CONFIG } from '@/lib/types/dashboard';
import type { ProjectStatus } from '@/lib/types/dashboard';

export default async function ProjectsListPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('*, brand:brands(*), divisions:project_divisions(*)')
    .order('updated_at', { ascending: false });

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('name');

  const allProjects = projects || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 text-sm mt-1">Kelola semua project brand Anda</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/settings/brands"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm border border-slate-700"
          >
            Kelola Brand
          </Link>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
          >
            <span>+</span> Project Baru
          </Link>
        </div>
      </div>

      {/* Projects Table */}
      {allProjects.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-lg mb-2">Belum ada project</p>
          <p className="text-slate-500 text-sm mb-6">Mulai dengan menambahkan brand, lalu buat project pertama Anda</p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/dashboard/settings/brands"
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm border border-slate-700"
            >
              + Tambah Brand
            </Link>
            <Link
              href="/dashboard/projects/new"
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              + Project Baru
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">Project</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">Brand</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">Platform</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">Deadline</th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">PIC</th>
                </tr>
              </thead>
              <tbody>
                {allProjects.map((project) => {
                  const statusConfig = STATUS_CONFIG[project.status as ProjectStatus];
                  const picNames: string[] = [];
                  (project.divisions || []).forEach((d: { pic_name?: string }) => {
                    if (d.pic_name && !picNames.includes(d.pic_name)) {
                      picNames.push(d.pic_name);
                    }
                  });

                  return (
                    <tr key={project.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/projects/${project.id}`} className="text-white font-medium text-sm hover:text-amber-400 transition-colors">
                          {project.name}
                        </Link>
                        {project.notes && (
                          <p className="text-slate-500 text-xs mt-1 line-clamp-1 max-w-[200px]">{project.notes}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 text-sm">{project.brand?.name || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 text-sm capitalize">{project.platform}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {project.deadline ? (
                          <span className="text-slate-300 text-sm">{project.deadline}</span>
                        ) : (
                          <span className="text-slate-600 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {picNames.length > 0 ? picNames.map((pic) => (
                            <span key={pic} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                              {pic}
                            </span>
                          )) : (
                            <span className="text-slate-600 text-sm">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
