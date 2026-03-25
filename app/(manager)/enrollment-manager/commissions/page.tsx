// src/app/(manager)/enrollment-manager/commissions/page.tsx
import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index'; 
import CommissionClientView from '@/components/manager/CommissionManagement/CommissionClientView';
import { MOCK_COMMISSIONS } from '@/constants/commission-data';

export default function CommissionPage() {
  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/enrollment-manager/dashboard' },
    { label: 'Quản lý Hoa hồng', href: '/enrollment-manager/commissions' }
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>
      <div className="max-w-7xl mx-auto w-full">
        <CommissionClientView initialCommissions={MOCK_COMMISSIONS} />
      </div>
    </div>
  );
}