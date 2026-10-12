import { redirect } from 'next/navigation';

export default function DashboardInternalLayout() {
  redirect('/dashboard/projects');
}
