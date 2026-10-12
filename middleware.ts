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
          response.cookies.set({ name, value, ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname, searchParams } = request.nextUrl;

  // ─── 1. Allow login page unconditionally ───────────────────────────────
  if (pathname === '/internal/login') {
    // Only redirect away from login if already authenticated AND no error param
    if (user && !searchParams.has('error')) {
      return NextResponse.redirect(new URL('/internal/projects', request.url));
    }
    return response;
  }

  // ─── 2. Protect all other /internal routes ──────────────────────────────
  if (pathname.startsWith('/internal')) {
    if (!user) {
      return NextResponse.redirect(new URL('/internal/login', request.url));
    }
  }

  // ─── 3. Legacy /dashboard protection ───────────────────────────────────
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
