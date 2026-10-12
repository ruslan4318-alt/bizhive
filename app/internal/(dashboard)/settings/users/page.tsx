import { getInternalUser } from '@/lib/auth';
import { canManageUsers, ROLE_LABELS, ROLE_COLORS } from '@/lib/types/dashboard';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types/dashboard';

export default async function UsersSettingsPage() {
  const user = await getInternalUser();

  if (!canManageUsers(user.role)) {
    redirect('/internal');
  }

  const supabase = await createClient();
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 mt-1">Kelola akun dan role pengguna internal</p>
        </div>
        <button className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
          + Tambah User
        </button>
      </div>

      {/* Users table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-semibold text-sm">
            {users?.length ?? 0} Pengguna Terdaftar
          </h2>
        </div>

        <div className="divide-y divide-slate-800">
          {users && users.length > 0 ? (
            users.map((u: Profile) => (
              <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-800/50 transition-colors">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
                  {u.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{u.full_name}</p>
                  <p className="text-slate-500 text-xs">{u.email}</p>
                </div>

                {/* Role badge */}
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ROLE_COLORS[u.role] ?? 'text-slate-400 bg-slate-700 border-slate-600'}`}>
                  {ROLE_LABELS[u.role] ?? u.role}
                </span>

                {/* Status */}
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  u.is_active
                    ? 'text-green-400 bg-green-500/10'
                    : 'text-slate-500 bg-slate-700'
                }`}>
                  {u.is_active ? 'Aktif' : 'Nonaktif'}
                </span>

                {/* Actions */}
                <button className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-slate-500 text-sm">Belum ada user terdaftar.</p>
              <p className="text-slate-600 text-xs mt-1">Jalankan SQL migration di Supabase terlebih dahulu.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
