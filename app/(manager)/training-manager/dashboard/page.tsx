// src/app/(manager)/training-manager/dashboard/page.tsx
import React from 'react';
import { MOCK_DASHBOARD_DATA } from '@/constants/dashboard-data';
import DashboardClientView from '@/components/manager/TrainingDashboard/DashboardClientView';

export default function TrainingDashboardPage() {
  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        <DashboardClientView data={MOCK_DASHBOARD_DATA} />
      </div>
    </div>
  );
}