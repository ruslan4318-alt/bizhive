'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types/dashboard';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/types/dashboard';

// ─── Menu definitions per module (Service-Based) ──────────────────────────────

const MODULE_MENUS = {
  shop_opt: [
    { href: '/internal/projects',                  label: 'Analytics & ROAS',   icon: '📈' },
    { href: '/dashboard/update',                   label: 'Input Data Harian',  icon: '📥' },
    { href: '/dashboard/reports',                  label: 'Monthly Reports',    icon: '📄' },
    { href: '/internal/brands',                    label: 'Brand Directory',    icon: '🏷️' },
  ],
  live_streaming: [
    { href: '/internal/services/live-streaming',   label: 'Live Operations',    icon: '🎥' },
    { href: '/internal/services/live-streaming',   label: 'Host Leaderboard',   icon: '🏆' },
    { href: '/internal/services/live-streaming',   label: 'Shift & Studio',     icon: '🕒' },
  ],
  content: [
    { href: '/internal/services/content-production', label: 'Content Pipeline', icon: '🎬' },
    { href: '/internal/services/content-production', label: 'Video Outputs',    icon: '📹' },
    { href: '/internal/services/content-production', label: 'Engagement Stats', icon: '📊' },
  ],
  kol: [
    { href: '/internal/services/affiliate-kol',    label: 'Creator Network',    icon: '🤝' },
    { href: '/internal/services/affiliate-kol',    label: 'Affiliate Sales',    icon: '🛍️' },
    { href: '/internal/services/affiliate-kol',    label: 'Sample Tracking',    icon: '📦' },
  ],
  brands: [
    { href: '/internal/brands',                    label: 'Overview',           icon: '🏠' },
    { href: '/dashboard/settings/brands',          label: 'Kelola Brand',       icon: '🏷️' },
  ],
  hr: [
    { href: '/internal/hr',                        label: 'Overview SDM',       icon: '🏠' },
    { href: '/internal/hr/team',                   label: 'Daftar Karyawan',    icon: '👤' },
    { href: '/internal/hr/attendance',             label: 'Presensi & Shift',   icon: '🗓️' },
    { href: '/internal/hr/tasks',                  label: 'Penugasan Staf',     icon: '📝' },
  ],
  settings: [
    { href: '/internal/settings/users',           label: 'User Management',    icon: '👤' },
  ],
};

type ModuleKey = keyof typeof MODULE_MENUS;

function getActiveModule(pathname: string): ModuleKey {
  if (pathname.startsWith('/internal/services/live-streaming')) return 'live_streaming';
  if (pathname.startsWith('/internal/services/content-production')) return 'content';
  if (pathname.startsWith('/internal/services/affiliate-kol')) return 'kol';
  if (pathname.startsWith('/internal/brands')) return 'brands';
  if (pathname.startsWith('/internal/hr')) return 'hr';
  if (pathname.startsWith('/internal/settings')) return 'settings';
  return 'shop_opt';
}

interface InternalNavProps {
  user: Profile;
}

export default function InternalNav({ user }: InternalNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const activeModule = getActiveModule(pathname);
  const sidebarItems = MODULE_MENUS[activeModule] ?? [];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/internal/login');
    router.refresh();
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  // Top navigation service switcher (Decoupled completely from CMS)
  const topModules = [
    { key: 'shop_opt', label: '🛒 Shop Optimization', href: '/internal/projects' },
    { key: 'live_streaming', label: '🎥 Live Streaming', href: '/internal/services/live-streaming' },
    { key: 'content', label: '🎬 Content', href: '/internal/services/content-production' },
    { key: 'kol', label: '🤝 KOL & Affiliate', href: '/internal/services/affiliate-kol' },
    { key: 'brands', label: '🏷️ Brands', href: '/internal/brands' },
    ...(user.role === 'hr' || user.role === 'super_admin'
      ? [{ key: 'hr', label: '👥 SDM / HR', href: '/internal/hr' }]
      : []),
    ...(user.role === 'super_admin'
      ? [{ key: 'settings', label: '⚙️ Settings', href: '/internal/settings/users' }]
      : []),
  ];

  const roleColor = ROLE_COLORS[user.role] || 'text-slate-400 bg-slate-500/10';

  return (
    <>
      {/* ─── Top Navigation Bar ─────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-slate-900 border-b border-slate-800 z-50 flex items-center px-4 gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 10h14M3 5h14M3 15h14" />
          </svg>
        </button>

        {/* Logo */}
        <Link href="/internal/projects" className="flex items-center gap-2.5 mr-2">
          <Image src="/images/logo-bizhive.png" alt="BIZHIVE" width={28} height={28} className="w-7 h-7 object-contain" />
          <div className="hidden sm:block">
            <span className="text-white font-bold text-sm block leading-tight">BIZHIVE</span>
            <span className="text-[9px] text-amber-400 font-semibold tracking-wider uppercase block">Operations Hub</span>
          </div>
        </Link>

        {/* Module / Service Tabs */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto py-1">
          {topModules.map((mod) => (
            <Link
              key={mod.key}
              href={mod.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeModule === mod.key
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {mod.label}
            </Link>
          ))}
        </nav>

        {/* User profile dropdown (NO CMS LINK) */}
        <div className="ml-auto relative flex-shrink-0">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs flex-shrink-0">
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-white text-xs font-semibold leading-tight">{user.full_name}</p>
              <p className="text-slate-500 text-[10px]">{ROLE_LABELS[user.role]}</p>
            </div>
            <svg className="w-3.5 h-3.5 text-slate-500 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50">
                <div className="px-3 py-2 border-b border-slate-700 mb-1">
                  <p className="text-white text-xs font-semibold">{user.full_name}</p>
                  <p className="text-slate-400 text-[10px] truncate">{user.email}</p>
                  <span className={`inline-block mt-1 text-[9px] font-semibold px-2 py-0.5 rounded-full border ${roleColor}`}>
                    {ROLE_LABELS[user.role]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <span>🚪</span> Keluar (Logout)
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ─── Mobile Sidebar Overlay ─────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ────────────────────────────────────────────────────── */}
      <aside className={`
        fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-slate-900 border-r border-slate-800 z-40
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Module label */}
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/30">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {activeModule === 'shop_opt' && '🛒 Shop Optimization'}
            {activeModule === 'live_streaming' && '🎥 Live Streaming'}
            {activeModule === 'content' && '🎬 Content Production'}
            {activeModule === 'kol' && '🤝 KOL & Affiliate'}
            {activeModule === 'brands' && '🏷️ Brand Directory'}
            {activeModule === 'hr' && '👥 SDM / HR Management'}
            {activeModule === 'settings' && '⚙️ Settings'}
          </p>
        </div>

        {/* Nav items */}
        <nav className="px-2 py-3 space-y-0.5">
          {sidebarItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all
                ${isActive(item.href)
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }
              `}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile: module switcher at bottom */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 border-t border-slate-800 p-2 bg-slate-950">
          <p className="text-[10px] text-slate-500 px-2 mb-1.5 font-bold uppercase tracking-wider">Pilih Servis</p>
          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {topModules.map((mod) => (
              <Link
                key={mod.key}
                href={mod.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                  activeModule === mod.key
                    ? 'bg-amber-500/15 text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {mod.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
