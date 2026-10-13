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
}

const primaryNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: 'Dashboard' },
  { href: '/dashboard/projects', label: 'Projects', icon: 'Projects' },
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

  return (
    <>
      {/* ─── Mobile Header ─── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-500 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <Image src="/images/logo-bizhive.png" alt="BIZHIVE" width={24} height={24} className="w-6 h-6 object-contain" />
          <span className="text-gray-900 font-bold text-sm tracking-tight">BIZHIVE</span>
        </div>
        <div className="w-8" />
      </header>

      {/* ─── Mobile Overlay ─── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-50 flex flex-col
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
            <Image src="/images/logo-bizhive.png" alt="BIZHIVE" width={22} height={22} className="w-5 h-5 object-contain" />
          </div>
          <div>
            <h1 className="text-gray-900 font-bold text-sm tracking-tight leading-none">BIZHIVE</h1>
            <p className="text-gray-400 text-[10px] font-medium tracking-wider uppercase mt-1">Operations</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-0.5">
          <p className="px-3 mb-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Menu Utama</p>

          {primaryNavItems.map((item) => {
            const active = isActive(item.href);
            const IconComponent = Icons[item.icon];

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${active
                    ? 'bg-amber-50 text-amber-700 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <span className={`transition-colors ${active ? 'text-amber-600' : 'text-gray-400'}`}>
                  <IconComponent size={16} />
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Section */}
        <div className="border-t border-gray-100 p-3">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs flex-shrink-0">
                {user.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-xs font-semibold truncate leading-tight">{user.full_name}</p>
                <p className="text-gray-400 text-[10px] truncate">{roleLabel}</p>
              </div>
            </button>

            {/* Dropdown */}
            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                <div className="px-3 py-2 border-b border-gray-100 text-[11px] text-gray-400 truncate">
                  {user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
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
