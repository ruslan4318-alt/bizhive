'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { DashboardUser } from '@/lib/types/dashboard';

interface NavGroup {
  title: string;
  items: {
    href: string;
    label: string;
    icon: string;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    title: 'UTAMA',
    items: [
      { href: '/dashboard', label: 'Executive Overview', icon: '📊' },
    ],
  },
  {
    title: 'SERVICES (AREA KERJA)',
    items: [
      { href: '/dashboard/projects', label: 'Shop Optimization', icon: '🛒', badge: 'Active' },
      { href: '/dashboard/services/live-streaming', label: 'Live Streaming', icon: '🎥' },
      { href: '/dashboard/services/content-production', label: 'Content Production', icon: '🎬' },
      { href: '/dashboard/services/affiliate-kol', label: 'KOL & Affiliate', icon: '🤝' },
    ],
  },
  {
    title: 'DATA & LAPORAN',
    items: [
      { href: '/dashboard/update', label: 'Input Data Harian', icon: '📥' },
      { href: '/dashboard/reports', label: 'Monthly Reports', icon: '📄' },
      { href: '/dashboard/settings/brands', label: 'Brand Directory', icon: '🏷️' },
    ],
  },
];

interface DashboardNavProps {
  user: DashboardUser;
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <Image src="/images/logo-bizhive.png" alt="BIZHIVE" width={28} height={28} className="w-7 h-7 object-contain" />
          <span className="text-white font-bold text-sm">BIZHIVE Operations</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800 flex-shrink-0">
          <Image src="/images/logo-bizhive.png" alt="BIZHIVE" width={32} height={32} className="w-8 h-8 object-contain" />
          <div>
            <h1 className="text-white font-bold text-sm tracking-tight">BIZHIVE</h1>
            <p className="text-amber-400 text-[10px] font-semibold tracking-wider uppercase">Internal Operations</p>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all
                        ${active
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile (Decoupled from CMS) */}
        <div className="border-t border-slate-800 p-3 bg-slate-950/40 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                {user.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{user.full_name}</p>
                <p className="text-slate-500 text-[10px] capitalize">{user.role.replace('_', ' ')}</p>
              </div>
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 15l7-7 7 7" />
              </svg>
            </button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
                <div className="px-3 py-2 border-b border-slate-700">
                  <p className="text-xs text-white font-medium">{user.email}</p>
                  <p className="text-[10px] text-slate-400">Bizhive Operations System</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-slate-700/80 transition-colors flex items-center gap-2"
                >
                  <span>🚪</span> Keluar (Logout)
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
