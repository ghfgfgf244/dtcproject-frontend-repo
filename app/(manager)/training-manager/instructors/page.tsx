// src/app/(manager)/training-manager/instructors/page.tsx
import React from 'react';
import { Download, Plus } from 'lucide-react';
import { MOCK_INSTRUCTORS, MOCK_INSTRUCTOR_STATS } from '@/constants/instructor-data';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';
import InstructorStats from '@/components/manager/InstructorManagement/InstructorStats';
import InstructorClientView from '@/components/manager/InstructorManagement/InstructorClientView';


export default async function InstructorDirectoryPage() {
  // Thực tế: Lấy dữ liệu API tại đây
  // const stats = await getInstructorStats();
  // const instructors = await getInstructors();

  // Rule: Cấu hình Breadcrumbs
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/training-manager/dashboard' },
    { label: 'Quản lý giảng viên' } // Trang hiện tại
  ];

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 bg-slate-50 min-h-screen">
      
      {/* 1. Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* 2. Client View (Search, Filters, Table) */}
      <InstructorClientView initialData={MOCK_INSTRUCTORS} />

    </div>
  );
}