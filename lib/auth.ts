import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Profile, UserRole } from '@/lib/types/dashboard';
import { getDefaultRedirect } from '@/lib/types/dashboard';

// Alias untuk backward compatibility
export type DashboardUser = Profile;

/**
 * Get the current authenticated user with their profile & role.
 * Redirects to /admin (login) if not authenticated.
 */
export async function getAuthUser(): Promise<Profile> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/internal/login');
  }

  // Try profiles table first (new role system)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile) {
    return profile as Profile;
  }

  // Fallback: try legacy admin_users table
  const { data: legacyProfile } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (legacyProfile) {
    // Map legacy roles to new roles
    const roleMap: Record<string, UserRole> = {
      admin: 'super_admin',
      spv: 'project_manager',
      regular: 'account_manager',
    };

    return {
      id: user.id,
      email: user.email!,
      full_name: legacyProfile.full_name || user.email!.split('@')[0],
      role: roleMap[legacyProfile.role] || 'account_manager',
      is_active: legacyProfile.is_active ?? true,
      created_at: legacyProfile.created_at || new Date().toISOString(),
      updated_at: legacyProfile.updated_at || new Date().toISOString(),
    };
  }

  // No profile at all — create one with super_admin role
  const newProfile: Profile = {
    id: user.id,
    email: user.email!,
    full_name: user.email!.split('@')[0],
    role: 'super_admin',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    await supabase.from('profiles').insert(newProfile);
  } catch {}

  return newProfile;
}

/**
 * Get auth user for /internal routes.
 * Redirects to /internal/login if not authenticated.
 */
export async function getInternalUser(): Promise<Profile> {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/internal/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return {
      id: user.id,
      email: user.email || 'admin@bizhiveid.com',
      full_name: user.email?.split('@')[0] || 'Admin',
      role: 'super_admin',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  if (!profile.is_active) {
    redirect('/internal/login?error=unauthorized');
  }

  return profile as Profile;
}

// ============================================
// Role Checks
// ============================================

export function isSuperAdmin(user: Profile): boolean {
  return user.role === 'super_admin';
}

export function isAdmin(user: Profile): boolean {
  return user.role === 'admin' || user.role === 'super_admin';
}

export function isProjectManager(user: Profile): boolean {
  return user.role === 'project_manager' || user.role === 'super_admin';
}

export function isHR(user: Profile): boolean {
  return user.role === 'hr' || user.role === 'super_admin';
}

// Legacy alias
export function isSPVOrAbove(user: Profile): boolean {
  return isProjectManager(user);
}

export { getDefaultRedirect };
