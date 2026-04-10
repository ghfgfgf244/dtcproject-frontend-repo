import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';
import FinanceClientView from '@/components/manager/AdminDashboard/FinanceClientView';
import { FINANCE_KPIS, RECENT_TRANSACTIONS } from '@/constants/finance-data';

export default function AdminDashboardPage() {
  const breadcrumbItems = [
    { label: 'Admin Dashboard', href: '/admin' },
    { label: 'Tài chính' }
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col min-h-screen bg-slate-50">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <FinanceClientView 
        kpis={FINANCE_KPIS} 
        transactions={RECENT_TRANSACTIONS} 
      />
    </div>
  );
}