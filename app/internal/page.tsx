import { redirect } from 'next/navigation';
import { getInternalUser } from '@/lib/auth';
import { getDefaultRedirect } from '@/lib/types/dashboard';

// /internal → redirect ke modul default berdasarkan role
export default async function InternalIndexPage() {
  const user = await getInternalUser();
  redirect(getDefaultRedirect(user.role));
}
