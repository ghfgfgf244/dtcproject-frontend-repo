// src/app/(manager)/training-manager/mock-exams/page.tsx
import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';
import { MOCK_EXAMS, MOCK_EXAM_STATS } from '@/constants/mock-exam-data';
import MockExamClientView from '@/components/manager/MockExamManagement/MockExamClientView';

export default function MockExamsPage() {
  const breadcrumbsItems = [
    { label: 'Hệ thống', href: '/training-manager/dashboard' },
    { label: 'Quản lý Thi thử', href: '/training-manager/mock-exams' },
    { label: 'Danh sách Bộ đề' }
  ];

  return (
    <div className="p-6 md:p-8 min-h-screen">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbsItems} />
      </div>
      <div className="max-w-7xl mx-auto w-full">
        <MockExamClientView initialData={MOCK_EXAMS} statsData={MOCK_EXAM_STATS} />
      </div>
    </div>
  );
}