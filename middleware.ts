import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // ─── /internal routes protection ───────────────────────────────────────
  if (pathname.startsWith('/internal') && !pathname.startsWith('/internal/login')) {
    if (!user) {
      return NextResponse.redirect(new URL('/internal/login', request.url));
    }

    // Check profile exists & is active
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.is_active) {
      return NextResponse.redirect(new URL('/internal/login?error=unauthorized', request.url));
    }

    // HR can only access /internal/hr
    if (profile.role === 'hr' && !pathname.startsWith('/internal/hr') && pathname !== '/internal') {
      return NextResponse.redirect(new URL('/internal/hr', request.url));
    }

    // Admin (CMS only) cannot access /internal routes — redirect to /admin
    if (profile.role === 'admin' && pathname.startsWith('/internal')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  // ─── /internal/login — redirect if already logged in ───────────────────
  if (pathname === '/internal/login' && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile) {
      const { getDefaultRedirect } = await import('@/lib/types/dashboard');
      return NextResponse.redirect(new URL(getDefaultRedirect(profile.role), request.url));
    }
  }

  // ─── /dashboard & /admin routes — legacy protection ────────────────────
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/internal/:path*',
    '/dashboard/:path*',
  ],
};
