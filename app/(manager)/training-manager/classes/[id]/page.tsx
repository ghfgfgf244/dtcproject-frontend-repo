import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { MOCK_CLASS_DETAIL } from '@/constants/class-detail-data';
import ClassDetailClientView from '@/components/manager/ClassManagement/ClassDetailClientView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClassDetailPage({ params }: PageProps) {
  // 1. Giải nén params bằng await
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Thực tế sẽ fetch data từ DB dựa vào params.id
  // VD: const data = await fetchClassDetail(params.id);
  const data = MOCK_CLASS_DETAIL;

  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/training-manager/dashboard' },
    { label: 'Lớp học', href: '/training-manager/classes' },
    { label: 'Chi tiết lớp học' }
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        {/* Gọi Component Client và truyền dữ liệu */}
        <ClassDetailClientView initialData={data} />

      </div>
    </div>
  );
}