import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { DashboardUser } from '@/lib/types/dashboard';

/**
 * Get the current authenticated dashboard user.
 * Redirects to /admin if not authenticated.
 */
export async function getAuthUser(): Promise<DashboardUser> {
  const supabase = await createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/admin');
  }

  // Get user profile from admin_users table
  const { data: profile } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    // If no profile exists, create one with default role
    const { data: newProfile } = await supabase
      .from('admin_users')
      .insert({
        id: user.id,
        email: user.email!,
        full_name: user.email!.split('@')[0],
        role: 'regular',
      })
      .select()
      .single();

    return {
      id: user.id,
      email: user.email!,
      full_name: newProfile?.full_name || user.email!.split('@')[0],
      role: newProfile?.role || 'regular',
      is_active: true,
      created_at: newProfile?.created_at || new Date().toISOString(),
    };
  }

  return {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    role: profile.role || 'regular',
    avatar_url: profile.avatar_url,
    is_active: profile.is_active ?? true,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  };
}

/**
 * Check if user has admin role
 */
export function isAdmin(user: DashboardUser): boolean {
  return user.role === 'admin';
}

/**
 * Check if user has SPV role or above
 */
export function isSPVOrAbove(user: DashboardUser): boolean {
  return user.role === 'admin' || user.role === 'spv';
}
