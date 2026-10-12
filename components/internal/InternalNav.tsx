'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types/dashboard';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/types/dashboard';

// ─── Menu definitions per module ──────────────────────────────────────────────

const MODULE_MENUS = {
  projects: [
    { href: '/internal/projects',          label: 'Overview',     icon: '📊' },
    { href: '/internal/projects/all',      label: 'All Projects', icon: '🗂️' },
    { href: '/internal/projects/new',      label: 'New Project',  icon: '➕' },
    { href: '/internal/projects/timeline', label: 'Timeline',     icon: '📅' },
    { href: '/internal/projects/my-tasks', label: 'My Tasks',     icon: '🔔' },
  ],
  brands: [
    { href: '/internal/brands',            label: 'Overview',     icon: '🏠' },
    { href: '/internal/brands/all',        label: 'All Brands',   icon: '🏷️' },
    { href: '/internal/brands/new',        label: 'Add Brand',    icon: '➕' },
    { href: '/internal/brands/export',     label: 'Export',       icon: '📤' },
  ],
  hr: [
    { href: '/internal/hr',                label: 'Overview',     icon: '🏠' },
    { href: '/internal/hr/team',           label: 'Team',         icon: '👤' },
    { href: '/internal/hr/attendance',     label: 'Attendance',   icon: '🗓️' },
    { href: '/internal/hr/tasks',          label: 'Task Board',   icon: '📝' },
    { href: '/internal/hr/settings',       label: 'Settings',     icon: '⚙️' },
  ],
  admin: [
    { href: '/admin/dashboard',            label: 'Dashboard',    icon: '🏠' },
    { href: '/admin/news',                 label: 'News',         icon: '📰' },
    { href: '/admin/clients',              label: 'Clients',      icon: '👥' },
    { href: '/admin/services',             label: 'Services',     icon: '🛠️' },
    { href: '/admin/case-studies',         label: 'Case Studies', icon: '🎯' },
  ],
  settings: [
    { href: '/internal/settings/users',   label: 'Users',        icon: '👤' },
    { href: '/internal/settings/roles',   label: 'Roles',        icon: '🔑' },
  ],
};

type ModuleKey = keyof typeof MODULE_MENUS;

function getActiveModule(pathname: string): ModuleKey {
  if (pathname.startsWith('/internal/brands')) return 'brands';
  if (pathname.startsWith('/internal/hr'))     return 'hr';
  if (pathname.startsWith('/internal/settings')) return 'settings';
  if (pathname.startsWith('/admin'))           return 'admin';
  return 'projects';
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
    if (href === '/internal/projects' || href === '/internal/brands' || href === '/internal/hr') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // Which top nav items to show based on role
  const topModules = [
    ...(user.role !== 'admin' && user.role !== 'hr'
      ? [{ key: 'projects', label: 'Projects', href: '/internal/projects' }]
      : []),
    ...(user.role !== 'admin' && user.role !== 'hr'
      ? [{ key: 'brands', label: 'Brands', href: '/internal/brands' }]
      : []),
    ...(user.role === 'hr' || user.role === 'super_admin'
      ? [{ key: 'hr', label: 'SDM / HR', href: '/internal/hr' }]
      : []),
    ...(user.role === 'super_admin' || user.role === 'admin'
      ? [{ key: 'admin', label: 'CMS', href: '/admin/dashboard' }]
      : []),
    ...(user.role === 'super_admin'
      ? [{ key: 'settings', label: 'Settings', href: '/internal/settings/users' }]
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
          <span className="text-white font-bold text-sm hidden sm:block">BIZHIVE</span>
        </Link>

        {/* Module tabs */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {topModules.map((mod) => (
            <Link
              key={mod.key}
              href={mod.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeModule === mod.key
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {mod.label}
            </Link>
          ))}
        </nav>

        {/* User menu */}
        <div className="ml-auto relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs flex-shrink-0">
              {user.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className="text-white text-xs font-medium leading-tight">{user.full_name}</p>
              <p className="text-slate-500 text-[10px]">{ROLE_LABELS[user.role]}</p>
            </div>
            <svg className="w-3.5 h-3.5 text-slate-500 hidden sm:block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50">
                {/* Role badge */}
                <div className="px-3 py-2 border-b border-slate-700 mb-1">
                  <p className="text-white text-sm font-medium">{user.full_name}</p>
                  <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleColor}`}>
                    {ROLE_LABELS[user.role]}
                  </span>
                </div>
                <a href="/" className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                  🌐 Website Publik
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors"
                >
                  Keluar
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
        <div className="px-4 py-3 border-b border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {activeModule === 'projects' && 'Project Tracker'}
            {activeModule === 'brands' && 'Brand Report'}
            {activeModule === 'hr' && 'SDM / HR'}
            {activeModule === 'admin' && 'CMS Website'}
            {activeModule === 'settings' && 'Settings'}
          </p>
        </div>

        {/* Nav items */}
        <nav className="px-2 py-3 space-y-0.5">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive(item.href)
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
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
        <div className="lg:hidden absolute bottom-0 left-0 right-0 border-t border-slate-800 p-2">
          <p className="text-[10px] text-slate-600 px-2 mb-1.5 font-semibold uppercase tracking-wider">Switch Module</p>
          <div className="space-y-0.5">
            {topModules.map((mod) => (
              <Link
                key={mod.key}
                href={mod.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  activeModule === mod.key
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-slate-500 hover:text-white hover:bg-slate-800'
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
