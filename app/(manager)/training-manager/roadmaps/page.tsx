// src/app/(manager)/training-manager/roadmaps/page.tsx
import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { MOCK_ROADMAPS, MOCK_ROADMAP_STATS } from '@/constants/roadmap-data';
import RoadmapClientView from '@/components/manager/RoadmapManagement/RoadmapClientView';

export const metadata = {
  title: 'Lộ trình học tập | Quản lý Đào tạo',
  description: 'Quản lý và thiết kế các giai đoạn đào tạo lái xe chuyên nghiệp.',
};

export default function RoadmapsPage() {
  const breadcrumbsItems = [
    { label: 'Hệ thống', href: '/training-manager/dashboard' },
    { label: 'Quản lý Khóa học', href: '/training-manager/courses' },
    { label: 'Lộ trình học tập' }
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        <RoadmapClientView 
          initialRoadmaps={MOCK_ROADMAPS} 
          stats={MOCK_ROADMAP_STATS} 
        />
      </div>
    </div>
  );
}