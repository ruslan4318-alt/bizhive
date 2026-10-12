import Link from 'next/link';
import { getAuthUser } from '@/lib/auth';
import { isSystemAdmin, isManagerOrAbove, ROLE_LABELS, ROLE_COLORS } from '@/lib/types/dashboard';
import { Icons } from '@/components/ui/Icons';

export const metadata = {
  title: 'Settings - BIZHIVE Management',
};

export default async function SettingsPage() {
  const user = await getAuthUser();
  const isAdmin = isSystemAdmin(user.role);
  const isManager = isManagerOrAbove(user.role);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Pengaturan akun, role, dan konfigurasi operasional</p>
      </div>

      {/* Profil Akun Pengguna */}
      <div className="bg-[#0D131F] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-sm">
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">{user.full_name}</h2>
              <p className="text-slate-400 text-xs font-mono">{user.email}</p>
            </div>
          </div>
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded border ${ROLE_COLORS[user.role] || 'text-slate-300 bg-slate-800 border-slate-700'}`}>
            {ROLE_LABELS[user.role] || user.role}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block mb-1">Status Akun</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Aktif
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 block mb-1">Otoritas Akses</span>
            <span className="text-slate-300 font-medium">
              {isAdmin ? 'Akses Penuh (Admin)' : isManager ? 'Akses Tim Operasional (Manajer)' : 'Akses Operasional Mandiri (Member)'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Menu Konfigurasi */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Brand Master Shortcut */}
        <Link
          href="/dashboard/brands"
          className="bg-[#0D131F] border border-slate-800 hover:border-amber-500/40 rounded-xl p-5 transition-all group"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
            <Icons.Brands size={18} />
          </div>
          <h3 className="text-white font-semibold text-sm group-hover:text-amber-400 transition-colors">
            Master Data Brand & Layanan
          </h3>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            Daftar database brand klien yang dikelola, platform aktif (Shopee / TikTok), dan status operasional.
          </p>
        </Link>

        {/* Workflow & Routine Setting */}
        <div className="bg-[#0D131F] border border-slate-800 rounded-xl p-5">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
            <Icons.Projects size={18} />
          </div>
          <h3 className="text-white font-semibold text-sm">
            Template & Rutinitas Bulanan
          </h3>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            Standar format pekerjaan operasional dan trigger rutinitas bulanan untuk PIC tim.
          </p>
          <span className="inline-block mt-3 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            Dikelola oleh Manajer / Admin
          </span>
        </div>

        {/* User Management (Admin Only) */}
        {isAdmin && (
          <div className="bg-[#0D131F] border border-slate-800 rounded-xl p-5 md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Icons.Users size={18} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  Manajemen Pengguna & Hak Akses (3 Role)
                </h3>
                <p className="text-slate-400 text-xs">
                  Atur staf pelaksana (Member), koordinator tim (Manajer), dan Super Admin.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              Hak akses backend diproteksi via Supabase Row-Level Security (RLS) dan validasi peran server-side.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
