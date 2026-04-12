// src/app/(manager)/training-manager/exam-results/page.tsx
import React from 'react';
import { Printer, Share } from 'lucide-react';
import { MOCK_RESULTS } from '@/constants/exam-result-data';
import ResultStats from '@/components/manager/ExamManagement/ResultStats';
import ResultClientView from '@/components/manager/ExamManagement/ResultClientView';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs/index';


export default async function ExamResultsPage() {
  // Thực tế: Lấy dữ liệu thống kê và danh sách từ DB tại đây
  // const results = await getExamResults();
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/training-manager/dashboard' },
    { label: 'Quản lý Kỳ thi', href: '/training-manager/exams' }, // Link ngược về trang quản lý đợt thi
    { label: 'Kết quả thi' } // Trang hiện tại
  ];
  return (
    <div className="p-8">
      <Breadcrumbs items={breadcrumbItems} />
      {/* 1. Header & Actions */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[30px] font-black tracking-tighter text-slate-900 uppercase">Quản lý Kết quả Kỳ thi</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Theo dõi điểm số và kết quả các kỳ thi</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-lg transition-colors">
            <Printer className="w-4 h-4" /> In báo cáo
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-bold text-sm rounded-lg shadow-sm active:scale-95 transition-all">
            <Share className="w-4 h-4" /> Xuất dữ liệu
          </button>
        </div>
      </div>

      {/* 2. Tổng quan Thống kê (Server Rendered) */}
      <ResultStats />

      {/* 3. Lọc & Bảng dữ liệu (Client Rendered) */}
      <ResultClientView initialResults={MOCK_RESULTS} />
    </div>
  );
}