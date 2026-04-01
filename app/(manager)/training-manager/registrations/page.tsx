// src/app/(manager)/training-manager/registrations/page.tsx
import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';
import RegistrationClientView from '@/components/manager/RegistrationManagement/RegistrationClientView';

export default function ExamRegistrationPage() {
  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/training-manager/dashboard' },
    { label: 'Quản lý Kỳ thi', href: '/training-manager/exams' },
    { label: 'Duyệt đăng ký' }
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>
      <div className="max-w-7xl mx-auto w-full">
        <RegistrationClientView />
      </div>
    </div>
  );
}