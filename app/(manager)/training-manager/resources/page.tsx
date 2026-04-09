// src/app/(manager)/training-manager/resources/page.tsx
import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import ResourceClientView from '@/components/manager/LearningResourceManagement/ResourceClientView';

export const metadata = {
  title: 'Tài nguyên học tập | Quản lý Đào tạo',
  description: 'Quản lý kho tài liệu đào tạo cho học viên',
};

export default function LearningResourcesPage() {
  const breadcrumbsItems = [
    { label: 'Hệ thống', href: '/training-manager/dashboard' },
    { label: 'Quản lý Khóa học', href: '/training-manager/courses' },
    { label: 'Tài nguyên học tập' }
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        {/* Client View fetches its own data */}
        <ResourceClientView />
      </div>
    </div>
  );
}