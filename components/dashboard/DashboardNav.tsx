'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { DashboardUser } from '@/lib/types/dashboard';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/types/dashboard';
import { Icons } from '@/components/ui/Icons';

interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof Icons;
  badge?: string;
}

const primaryNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { href: '/dashboard/projects', label: 'Projects', icon: 'Projects', badge: 'Shop Opt' },
  { href: '/dashboard/brands', label: 'Brands', icon: 'Brands' },
  { href: '/dashboard/reports', label: 'Reports', icon: 'Reports' },
  { href: '/dashboard/settings', label: 'Settings', icon: 'Settings' },
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
    router.push('/internal/login');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const roleLabel = ROLE_LABELS[user.role] || user.role;
  const roleColor = ROLE_COLORS[user.role] || 'text-slate-400 bg-slate-800 border-slate-700';

  return (
    <>
      {/* ─── Mobile Header ─── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#090D16] border-b border-slate-800/80 flex items-center justify-between px-4 z-50">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-slate-400 hover:text-white p-2 hover:bg-slate-800/60 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <div className="flex items-center gap-2.5">
          <Image src="/images/logo-bizhive.png" alt="BIZHIVE" width={24} height={24} className="w-6 h-6 object-contain" />
          <span className="text-white font-semibold text-xs tracking-tight">BIZHIVE</span>
        </div>
        <div className="w-8" />
      </header>

      {/* ─── Mobile Overlay ─── */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Minimalist Desktop Sidebar ─── */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-[#090D16] border-r border-slate-800/70 z-50 flex flex-col
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800/60 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Image src="/images/logo-bizhive.png" alt="BIZHIVE" width={22} height={22} className="w-5 h-5 object-contain" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-tight leading-none">BIZHIVE</h1>
            <p className="text-slate-400 text-[10px] font-medium tracking-wider uppercase mt-1">Management</p>
          </div>
        </div>

        {/* 5 Primary Navigation Items */}
        <div className="flex-1 px-3 py-5 space-y-1">
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Menu Utama
          </div>

          {primaryNavItems.map((item) => {
            const active = isActive(item.href);
            const IconComponent = Icons[item.icon];

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group
                  ${active
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/25 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`transition-colors ${active ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    <IconComponent size={16} />
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Account Section */}
        <div className="border-t border-slate-800/70 p-3 bg-slate-950/30 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-800/50 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 font-bold text-xs flex-shrink-0">
                {user.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 text-xs font-medium truncate leading-tight">{user.full_name}</p>
                <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded border mt-0.5 ${roleColor}`}>
                  {roleLabel}
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-[#0F172A] border border-slate-800 rounded-xl shadow-2xl py-1 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400 truncate">
                  {user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-slate-800/60 transition-colors flex items-center gap-2"
                >
                  <Icons.LogOut size={14} />
                  <span>Keluar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
