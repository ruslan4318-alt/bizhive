import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function InternalIndexPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/internal/login');
  }

  redirect('/internal/projects');
}
