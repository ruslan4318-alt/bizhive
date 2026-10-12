import { getInternalUser } from '@/lib/auth';
import InternalNav from '@/components/internal/InternalNav';

export default async function DashboardInternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getInternalUser();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <InternalNav user={user} />
      <main className="pt-14 lg:pl-60 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
