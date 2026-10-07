import { getAuthUser } from '@/lib/auth';
import DashboardNav from '@/components/dashboard/DashboardNav';

export const metadata = {
  title: 'Dashboard - BIZHIVE Internal',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardNav user={user} />
      {/* Main Content Area */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
