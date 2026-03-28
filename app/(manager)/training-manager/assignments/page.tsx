// src/app/(manager)/training-manager/assignments/page.tsx
import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';
import { MOCK_PENDING_CLASSES, MOCK_AVAILABLE_INSTRUCTORS } from '@/constants/assignment-data';
import AssignmentClientView from '@/components/manager/AssignmentManagement/AssignmentClientView';

export default function AssignmentsPage() {
  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/training-manager/dashboard' },
    { label: 'Điều phối Giảng viên', href: '/training-manager/assignments' }
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>
      <div className="max-w-7xl mx-auto w-full">
        <AssignmentClientView 
          initialClasses={MOCK_PENDING_CLASSES} 
          instructors={MOCK_AVAILABLE_INSTRUCTORS} 
        />
      </div>
    </div>
  );
}