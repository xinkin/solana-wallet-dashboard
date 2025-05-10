import { Suspense } from 'react';
import DashboardClient from '../dashboard/dashboard-client';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading dashboard...</div>}>
      <DashboardClient />
    </Suspense>
  );
}
