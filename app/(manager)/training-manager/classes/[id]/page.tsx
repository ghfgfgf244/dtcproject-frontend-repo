// src/app/(manager)/training-manager/classes/[id]/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { MOCK_CLASS_DETAIL } from '@/constants/class-detail-data';

import ClassInfoBoard from '@/components/manager/ClassManagement/ClassDetail/ClassInfoCard';
import ClassSidebar from '@/components/manager/ClassManagement/ClassDetail/ClassSidebar';

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  // Thực tế sẽ fetch data từ DB: const data = await fetchClassDetail(params.id);
  const data = MOCK_CLASS_DETAIL;

  const breadcrumbsItems = [
    { label: 'Trang chủ', href: '/training-manager/dashboard' },
    { label: 'Lớp học', href: '/training-manager/classes' },
    { label: data.name }
  ];

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">{data.name}</h2>
            <p className="text-slate-500 text-sm">Tổng quan chi tiết và danh sách học viên ghi danh của lớp hiện tại.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
            <button 
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95"
            >
              <Edit3 className="w-4 h-4" /> Chỉnh sửa Lớp
            </button>
          </div>
        </div>

        {/* Main Layout: 2 Cột */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột Trái (Chiếm 2 phần) */}
          <ClassInfoBoard data={data} />
          
          {/* Cột Phải (Chiếm 1 phần) */}
          <ClassSidebar data={data} />
        </div>

      </div>
    </div>
  );
}