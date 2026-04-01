// src/app/(manager)/enrollment-manager/terms/_components/TermClientView/index.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Plus, Filter, CalendarCheck2 } from 'lucide-react';
import { TermRecord, TermStatus } from '@/types/term';

import TermTable from '../TermTable';
import TermModal from '../../Modals/TermModal';
import ConfirmModal from '@/components/ui/confirm-modal'; // Giả sử đây là đường dẫn dùng chung của dự án

interface Props {
  initialTerms: TermRecord[];
}

export default function TermClientView({ initialTerms }: Props) {
  // 1. Quản lý dữ liệu chính (để cập nhật UI khi xóa)
  const [terms, setTerms] = useState<TermRecord[]>(initialTerms);

  // 2. States cho Filter
  const [statusFilter, setStatusFilter] = useState<TermStatus | 'All'>('All');
  const [courseFilter, setCourseFilter] = useState<string>('All');
  
  // 3. States cho Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<TermRecord | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [termToDelete, setTermToDelete] = useState<TermRecord | null>(null);
  
  // 4. Lọc dữ liệu
  const filteredTerms = useMemo(() => {
    return terms.filter(term => {
      const matchStatus = statusFilter === 'All' || term.status === statusFilter;
      const matchCourse = courseFilter === 'All' || term.courseName.includes(courseFilter);
      return matchStatus && matchCourse;
    });
  }, [terms, statusFilter, courseFilter]);

  const activeCount = terms.filter(t => t.status === 'Active').length;

  // --- HANDLERS ---
  const handleOpenDelete = (term: TermRecord) => {
    setTermToDelete(term);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (termToDelete) {
      // Thực tế sẽ gọi API ở đây: await termService.delete(termToDelete.id)
      setTerms(prev => prev.filter(t => t.id !== termToDelete.id));
      setIsDeleteModalOpen(false);
      setTermToDelete(null);
    }
  };

  return (
    <div className="space-y-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Bộ lọc */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Trạng thái</label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {(['All', 'Active', 'Expired'] as const).map(status => (
                <button 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${statusFilter === status ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {status === 'All' ? 'Tất cả' : status === 'Active' ? 'Đang mở' : 'Đã đóng'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Hệ đào tạo</label>
            <select 
              className="bg-slate-100 border-none rounded-lg py-2 px-4 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 min-w-[180px] cursor-pointer"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="All">Tất cả hạng bằng</option>
              <option value="B1">Hạng B1 (Số tự động)</option>
              <option value="B2">Hạng B2 (Số sàn)</option>
              <option value="C">Hạng C (Xe tải)</option>
            </select>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-6 rounded-xl shadow-lg flex flex-col justify-between text-white relative overflow-hidden">
          <CalendarCheck2 className="absolute -right-4 -top-4 w-32 h-32 opacity-10" strokeWidth={1} />
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Học kỳ đang mở</p>
            <h3 className="text-3xl font-black">{activeCount} <span className="text-sm font-medium opacity-70">Học kỳ</span></h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <TermTable 
        terms={filteredTerms} 
        onEdit={(term) => { setEditingTerm(term); setIsModalOpen(true); }}
        onDelete={handleOpenDelete} 
      />

      {/* Create/Edit Modal */}
      <TermModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingTerm}
        onSubmit={(data) => { console.log('Save Term', data); setIsModalOpen(false); }}
      /> 

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Xác nhận xóa học kỳ"
        message={`Bạn có chắc chắn muốn xóa học kỳ "${termToDelete?.name}"? Hành động này sẽ gỡ bỏ học kỳ khỏi danh sách tuyển sinh và không thể hoàn tác.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setIsDeleteModalOpen(false); setTermToDelete(null); }}
      />
    </div>
  );
}