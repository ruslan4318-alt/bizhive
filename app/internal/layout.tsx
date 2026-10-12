import { getInternalUser } from '@/lib/auth';
import InternalNav from '@/components/internal/InternalNav';

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getInternalUser();

  return (
    <div className="min-h-screen bg-slate-950">
      <InternalNav user={user} />
      {/* Main content — offset for top nav (h-14) + sidebar (w-60) */}
      <main className="pt-14 lg:pl-60 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
