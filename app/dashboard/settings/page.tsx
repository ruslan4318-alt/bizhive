import Link from 'next/link';
import { getAuthUser, isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const user = await getAuthUser();
  
  if (!isAdmin(user)) {
    redirect('/dashboard');
  }

  const settingsItems = [
    {
      href: '/dashboard/settings/brands',
      icon: '🏢',
      title: 'Kelola Brand',
      description: 'Tambah, edit, dan kelola brand klien',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Pengaturan sistem dashboard</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {settingsItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-amber-500/30 transition-all group"
          >
            <span className="text-3xl">{item.icon}</span>
            <h2 className="text-white font-semibold mt-3 group-hover:text-amber-400 transition-colors">{item.title}</h2>
            <p className="text-slate-400 text-sm mt-1">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
