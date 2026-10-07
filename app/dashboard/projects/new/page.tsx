import { createClient } from '@/lib/supabase/server';
import { getAuthUser } from '@/lib/auth';
import NewProjectForm from '@/components/dashboard/NewProjectForm';
import Link from 'next/link';

export default async function NewProjectPage() {
  await getAuthUser();
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from('brands')
    .select('id, name')
    .eq('is_active', true)
    .order('name');

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/projects"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Project Baru</h1>
          <p className="text-slate-400 text-sm mt-1">Buat project baru untuk brand Anda</p>
        </div>
      </div>

      {brands && brands.length === 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm">
          ⚠️ Belum ada brand. <Link href="/dashboard/settings/brands" className="underline font-medium">Tambah brand dulu</Link> sebelum membuat project.
        </div>
      )}

      <NewProjectForm brands={brands || []} />
    </div>
  );
}
