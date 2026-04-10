// src/app/(manager)/training-manager/exam-results/_components/ResultClientView/index.tsx
"use client";

import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { StudentResult } from '@/types/exam-result';
import { FILTER_CONFIG } from '@/constants/exam-result-data';
import ResultTable from '../ResultTable';

interface Props {
  initialResults: StudentResult[];
}

export default function ResultClientView({ initialResults }: Props) {
  // State quản lý Filters
  const [batch, setBatch] = useState(FILTER_CONFIG.batches[0]);
  const [status, setStatus] = useState(FILTER_CONFIG.statuses[0]);

  // Logic lọc dữ liệu giả lập (Thực tế sẽ gọi API khi nhấn Apply Filters)
  const filteredResults = initialResults.filter(item => {
    // Chú ý: Đảm bảo các chuỗi này khớp với mảng statuses trong file FILTER_CONFIG của bạn
    if (status === 'Chỉ hiển thị Đạt' && !item.isPassed) return false;
    if (status === 'Chỉ hiển thị Trượt' && item.isPassed) return false;
    return true;
  });

  return (
    <div>
      {/* 1. Filter Section */}
      <div className="bg-slate-50 p-6 rounded-xl mb-6 border border-slate-200 flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Đợt thi</label>
          <select 
            className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-600/20 outline-none"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
          >
            {FILTER_CONFIG.batches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Trạng thái</label>
          <select 
            className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-600/20 outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {FILTER_CONFIG.statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <button className="px-6 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 h-[42px]">
          <Filter className="w-4 h-4" /> Áp dụng bộ lọc
        </button>
      </div>

      {/* 2. Table Section */}
      <ResultTable results={filteredResults} />
    </div>
  );
}