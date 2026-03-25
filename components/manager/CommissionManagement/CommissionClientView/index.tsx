// src/app/(manager)/enrollment-manager/commissions/_components/CommissionClientView/index.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { CommissionRecord } from '@/types/commission';
import { MOCK_COMMISSION_STATS } from '@/constants/commission-data';

import CommissionStats from '@/components/manager/CommissionManagement/CommissionStats';
import CommissionTable from '@/components/manager/CommissionManagement/CommissionTable';

interface Props {
  initialCommissions: CommissionRecord[];
}

const ITEMS_PER_PAGE = 5;

export default function CommissionClientView({ initialCommissions }: Props) {
  // States cho Filter
  const [statusFilter, setStatusFilter] = useState('Tất cả trạng thái');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Logic Lọc dữ liệu
  const filteredData = useMemo(() => {
    return initialCommissions.filter(item => {
      // Lọc theo Trạng thái
      const matchStatus = statusFilter === 'Tất cả trạng thái' || item.status === statusFilter;
      
      // Lọc theo Search (Tên hoặc Mã CTV/Referral)
      const q = searchQuery.toLowerCase();
      const matchSearch = item.collaboratorName.toLowerCase().includes(q) || 
                          item.collaboratorCode.toLowerCase().includes(q) ||
                          item.referralCode.toLowerCase().includes(q);
      
      // Lọc theo Ngày (Nâng cao)
      let matchDate = true;
      if (startDate && endDate) {
        matchDate = item.date >= startDate && item.date <= endDate;
      } else if (startDate) {
        matchDate = item.date >= startDate;
      } else if (endDate) {
        matchDate = item.date <= endDate;
      }

      return matchStatus && matchSearch && matchDate;
    });
  }, [initialCommissions, statusFilter, searchQuery, startDate, endDate]);

  // Phân trang
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleExport = () => {
    alert("Tính năng Xuất Excel đang được xây dựng.");
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Quản lý Hoa hồng Cộng tác viên</h1>
          <p className="text-slate-500 text-sm max-w-2xl font-medium">Theo dõi và quyết toán hoa hồng cho mạng lưới cộng tác viên trên hệ thống Enrollment Manager.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-50 active:scale-95 transition-all text-sm"
        >
          <Download className="w-4 h-4" />
          Xuất báo cáo Excel
        </button>
      </div>

      {/* KPI Grid */}
      <CommissionStats data={MOCK_COMMISSION_STATS} />

      {/* Filters & Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Filter Bar */}
        <div className="p-5 bg-slate-50/50 border-b border-slate-200 flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Trạng thái</label>
              <select 
                className="w-full bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 px-3 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="Tất cả trạng thái">Tất cả trạng thái</option>
                <option value="Chờ thanh toán">Chờ thanh toán</option>
                <option value="Đã thanh toán">Đã thanh toán</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tên hoặc Mã CTV</label>
              <input 
                type="text"
                className="w-full bg-white border border-slate-200 rounded-lg text-sm font-medium px-3 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-slate-400" 
                placeholder="Nhập tên hoặc mã CTV..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Khoảng thời gian</label>
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  className="flex-1 bg-white border border-slate-200 rounded-lg text-sm font-medium px-2 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none text-slate-600"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                />
                <span className="text-slate-400">-</span>
                <input 
                  type="date" 
                  className="flex-1 bg-white border border-slate-200 rounded-lg text-sm font-medium px-2 py-2.5 focus:ring-2 focus:ring-blue-600 outline-none text-slate-600"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <CommissionTable 
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
          onPay={(record) => alert(`Tiến hành thanh toán cho ${record.collaboratorName}`)}
          onViewDetails={(record) => console.log('Xem chi tiết', record.id)}
        />
      </div>
    </div>
  );
}