// src/app/(manager)/enrollment-manager/terms/_components/TermClientView/index.tsx
"use client";

import React, { useState } from 'react';
import { Plus, Filter, CalendarCheck2 } from 'lucide-react';
import { TermRecord, TermStatus } from '@/types/term';

import TermTable from '../TermTable';
// import TermModal from '../Modals/TermModal'; 
// import ConfirmModal from '@/components/ui/ConfirmModal';

interface Props {
  initialTerms: TermRecord[];
}

export default function TermClientView({ initialTerms }: Props) {
  // 1. States cho Filter
  const [statusFilter, setStatusFilter] = useState<TermStatus | 'All'>('All');
  
  // 2. States cho Modal (Sẽ dùng ở bước sau)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<TermRecord | null>(null);
  
  // 3. Lọc dữ liệu
  const filteredTerms = initialTerms.filter(term => {
    return statusFilter === 'All' || term.status === statusFilter;
  });

  // Tính số lượng học kỳ đang hoạt động
  const activeCount = initialTerms.filter(t => t.status === 'Active').length;

  return (
    <div className="space-y-8">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            <span>Học thuật</span>
            <span>/</span>
            <span className="text-blue-600">Quản lý Học kỳ</span>
          </nav>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Danh mục Học kỳ</h2>
        </div>
        <button 
          onClick={() => { setEditingTerm(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg font-bold text-sm shadow-lg hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> Tạo học kỳ mới
        </button>
      </div>

      {/* Filter Row (Bento Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Bộ lọc chính */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-6">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Trạng thái</label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setStatusFilter('All')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${statusFilter === 'All' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Tất cả
              </button>
              <button 
                onClick={() => setStatusFilter('Active')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${statusFilter === 'Active' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Đang mở
              </button>
              <button 
                onClick={() => setStatusFilter('Expired')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${statusFilter === 'Expired' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Đã đóng
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Hệ đào tạo</label>
            <select className="bg-slate-100 border-none rounded-lg py-2 px-4 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 min-w-[180px] cursor-pointer">
              <option>Tất cả hạng bằng</option>
              <option>Hạng B1 (Số tự động)</option>
              <option>Hạng B2 (Số sàn)</option>
              <option>Hạng C (Xe tải)</option>
            </select>
          </div>

          <div className="ml-auto">
            <button className="p-2.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thẻ Thống kê Mini */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-6 rounded-xl shadow-lg flex flex-col justify-between text-white relative overflow-hidden">
          <CalendarCheck2 className="absolute -right-4 -top-4 w-32 h-32 opacity-10" strokeWidth={1} />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <CalendarCheck2 className="w-8 h-8 opacity-70 mb-4" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Học kỳ đang mở</p>
              <h3 className="text-3xl font-black">{activeCount} <span className="text-sm font-medium opacity-70">Học kỳ</span></h3>
            </div>
          </div>
        </div>

      </div>

      {/* Table Component */}
      <TermTable 
        terms={filteredTerms} 
        onEdit={(term) => { setEditingTerm(term); setIsModalOpen(true); }}
        onDelete={(term) => console.log('Delete', term.id)} 
      />

      {/* Modals (Placeholder cho công việc tiếp theo) */}
      {/* <TermModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingTerm}
        onSubmit={(data) => { console.log('Save Term', data); setIsModalOpen(false); }}
      /> 
      */}
      
    </div>
  );
}