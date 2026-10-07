import { Suspense } from 'react';
import UpdateDataClient from '@/components/dashboard/UpdateDataClient';

export default function UpdateDataPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="h-8 bg-slate-800 rounded w-1/3 animate-pulse" />
        <div className="h-40 bg-slate-800 rounded-xl animate-pulse" />
      </div>
    }>
      <UpdateDataClient />
    </Suspense>
  );
}
