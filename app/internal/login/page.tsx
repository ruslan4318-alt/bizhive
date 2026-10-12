'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function InternalLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError('Email atau password salah.');
        return;
      }

      if (!data.user) {
        setError('Login gagal. Coba lagi.');
        return;
      }

      // Check profile & role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_active')
        .eq('id', data.user.id)
        .single();

      if (!profile || !profile.is_active) {
        await supabase.auth.signOut();
        setError('Akun tidak aktif. Hubungi Super Admin.');
        return;
      }

      // Redirect by role
      const redirectMap: Record<string, string> = {
        super_admin: '/internal/projects',
        project_manager: '/internal/projects',
        account_manager: '/internal/projects',
        admin: '/admin/dashboard',
        hr: '/internal/hr',
      };

      router.push(redirectMap[profile.role] ?? '/internal');
      router.refresh();
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Image
                  src="/images/logo-bizhive.png"
                  alt="BIZHIVE"
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">BIZHIVE Internal</h1>
            <p className="text-slate-400 text-sm mt-1.5">Masuk untuk mengakses sistem internal</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
              </svg>
              {error}
            </div>
          )}

          {/* Unauthorized message */}
          {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('error') === 'unauthorized' && !error && (
            <div className="mb-5 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 text-sm">
              Akun tidak memiliki akses. Hubungi Super Admin.
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-white placeholder:text-slate-500 text-sm"
                placeholder="email@bizhiveid.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-white placeholder:text-slate-500 text-sm"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 disabled:cursor-not-allowed text-slate-900 font-bold py-3 px-4 rounded-xl transition-all text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Masuk...
                </span>
              ) : 'Masuk'}
            </button>
          </form>

          {/* Back to site */}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-slate-500 hover:text-amber-400 transition-colors">
              ← Kembali ke Website
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-5">
          BIZHIVE Internal System · Akses Terbatas
        </p>
      </div>
    </div>
  );
}
