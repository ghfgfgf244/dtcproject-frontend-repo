// src/app/(manager)/enrollment-manager/reports/page.tsx
import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';
import { MOCK_REPORT_KPIS, MOCK_LEADERBOARD } from '@/constants/report-data';
import ReportClientView from '@/components/manager/Reports/ReportClientView';

export default function ReportsPage() {
  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/enrollment-manager/dashboard' },
    { label: 'Thống kê & Báo cáo', href: '/enrollment-manager/reports' }
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>
      <div className="max-w-7xl mx-auto w-full">
        <ReportClientView 
          kpis={MOCK_REPORT_KPIS}
          leaderboard={MOCK_LEADERBOARD}
        />
      </div>
    </div>
  );
}