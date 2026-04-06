// src/app/(manager)/enrollment-manager/terms/_components/TermClientView/index.tsx
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, Filter, CalendarCheck2, Loader2 } from 'lucide-react';
import { TermRecord } from '@/types/term';
import { termService } from '@/services/termService';
import { useAuth } from "@clerk/nextjs";
import { setAuthToken } from "@/lib/api";
import { toast } from 'react-hot-toast';

import TermTable from '../TermTable';
import TermModal from '../../Modals/TermModal';
import ConfirmModal from '@/components/ui/confirm-modal';

interface Props {
  initialTerms?: TermRecord[];
}

export default function TermClientView({ initialTerms = [] }: Props) {
  const { getToken } = useAuth();
  const [terms, setTerms] = useState<TermRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [courseFilter, setCourseFilter] = useState<string>('All');
  
  // 3. States cho Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<TermRecord | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [termToDelete, setTermToDelete] = useState<TermRecord | null>(null);

  const fetchTerms = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const data = await termService.getAllTerms();
      setTerms(data);
    } catch (err) {
      console.error("Error fetching terms:", err);
      toast.error("Không thể tải danh sách học kỳ.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  // 4. Lọc dữ liệu
  const filteredTerms = useMemo(() => {
    return terms.filter(term => {
      const matchCourse = courseFilter === 'All' || term.courseName.includes(courseFilter);
      return matchCourse;
    });
  }, [terms, courseFilter]);

  const activeCount = terms.filter(t => t.isActive).length;

  // --- HANDLERS ---
  const handleOpenDelete = (term: TermRecord) => {
    setTermToDelete(term);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (termToDelete) {
      try {
        const token = await getToken();
        setAuthToken(token);
        await termService.deleteTerm(termToDelete.id);
        toast.success("Đã xóa học kỳ thành công!");
        fetchTerms();
      } catch (err: any) {
        toast.error(err.message || "Lỗi khi xóa học kỳ.");
      } finally {
        setIsDeleteModalOpen(false);
        setTermToDelete(null);
      }
    }
  };

  // Handle Save (Create or Update)
  const handleSave = async (data: Partial<TermRecord>) => {
    try {
      const token = await getToken();
      setAuthToken(token);

      if (editingTerm) {
        // Update
        const updated = await termService.updateTerm(editingTerm.id, {
          termName: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          maxStudents: data.maxStudents,
          isActive: data.isActive
        });
        if (updated) {
          toast.success("Cập nhật học kỳ thành công!");
          fetchTerms();
        }
      } else {
        // Create
        const created = await termService.createTerm({
          courseId: data.courseId!,
          termName: data.name!,
          startDate: data.startDate!,
          endDate: data.endDate!,
          maxStudents: data.maxStudents!
        });
        if (created) {
          toast.success("Tạo học kỳ mới thành công!");
          fetchTerms();
        }
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving term:", err);
      toast.error(err.message || "Lỗi khi lưu thông tin học kỳ.");
    }
  };

  const handleToggleStatus = async (term: TermRecord) => {
    try {
      const token = await getToken();
      setAuthToken(token);
      
      const newStatus = !term.isActive;
      const updated = await termService.updateTerm(term.id, {
        isActive: newStatus
      });

      if (updated) {
        toast.success(`Đã ${newStatus ? 'kích hoạt' : 'tạm dừng'} học kỳ thành công!`);
        // Update local state for immediate feedback
        setTerms(prev => prev.map(t => t.id === term.id ? updated : t));
      }
    } catch (err: any) {
      toast.error("Không thể thay đổi trạng thái học kỳ.");
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

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Đang tải danh mục học kỳ...</p>
        </div>
      ) : (
        <TermTable 
          terms={filteredTerms} 
          onEdit={(term) => { setEditingTerm(term); setIsModalOpen(true); }}
          onDelete={handleOpenDelete} 
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Create/Edit Modal */}
      <TermModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingTerm}
        onSubmit={handleSave}
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