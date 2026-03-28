// src/app/(admin)/centers/_components/CenterClientView/index.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { PlusCircle, Search, ListFilter, Download } from 'lucide-react';
import { CenterRecord } from '@/types/center';
import { MOCK_CENTER_STATS } from '@/constants/center-data';

import CenterStats from '../CenterStats';
import CenterTable from '../CenterTable';

interface Props {
  initialCenters: CenterRecord[];
}

const ITEMS_PER_PAGE = 5;

export default function CenterClientView({ initialCenters }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Logic Lọc theo Search
  const filteredCenters = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return initialCenters.filter(center => 
      center.name.toLowerCase().includes(q) || 
      center.address.toLowerCase().includes(q) ||
      center.code.toLowerCase().includes(q)
    );
  }, [initialCenters, searchQuery]);

  // Logic Phân trang
  const totalItems = filteredCenters.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedCenters = filteredCenters.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-[30px] font-black tracking-tight text-slate-900 leading-none">Quản lý Trung tâm</h2>
          <p className="text-slate-500 text-sm mt-2">Theo dõi và vận hành các trung tâm đào tạo lái xe trên toàn quốc.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-lg shadow-lg hover:bg-blue-700 transition-all active:scale-95">
          <PlusCircle className="w-5 h-5" />
          Thêm trung tâm mới
        </button>
      </div>

      {/* KPI Grid */}
      <CenterStats data={MOCK_CENTER_STATS} />

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filter Bar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-600 transition-all outline-none" 
              placeholder="Tìm tên trung tâm, địa chỉ, mã..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 text-slate-600 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-all active:scale-95">
              <ListFilter className="w-4 h-4" /> Lọc kết quả
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-slate-600 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-all active:scale-95">
              <Download className="w-4 h-4" /> Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Table Component */}
        <CenterTable 
          data={paginatedCenters}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onEdit={(center) => console.log('Sửa trung tâm', center.id)}
          onToggleStatus={(center) => console.log('Đổi trạng thái trung tâm', center.id)}
        />
      </div>

      {/* Dashboard Analytics Preview (Banner dưới cùng) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-blue-600 rounded-xl p-8 relative overflow-hidden shadow-lg min-h-[240px] flex flex-col justify-end">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <h4 className="text-white text-2xl font-black mb-2">Tăng trưởng hạ tầng năm 2024</h4>
            <p className="text-blue-100 text-sm max-w-md mb-6">Mục tiêu mở rộng thêm 15 trung tâm tại khu vực Tây Nguyên và Miền Tây để đáp ứng nhu cầu học lái xe hạng B2 và C đang tăng cao.</p>
            <button className="px-5 py-2.5 bg-white text-blue-600 font-bold text-xs rounded-lg shadow-sm hover:shadow-xl transition-all active:scale-95">
              Xem chiến lược mở rộng
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-20 h-20 rounded-full border-4 border-slate-100 flex items-center justify-center mb-4 relative">
            <svg className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeWidth="4" className="text-blue-500" strokeDasharray="226.2" strokeDashoffset="45.2"></circle>
            </svg>
            <span className="absolute text-lg font-black text-slate-900">80%</span>
          </div>
          <h5 className="text-sm font-bold text-slate-900">Công suất trung bình</h5>
          <p className="text-xs text-slate-500 mt-1 px-4">Độ phủ của các học viên trên toàn hệ thống trung tâm</p>
        </div>
      </div>

    </div>
  );
}   