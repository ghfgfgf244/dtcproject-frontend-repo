"use client";
import React from 'react';
import styles from '@/components/manager/Modals/modal.module.css';
import { X, CalendarCheck, Info } from 'lucide-react';
import { ExamBatch } from '@/types/exam';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ExamBatch | null; // Fix: Dùng chung type chuẩn
  onSubmit: (data: Partial<ExamBatch>) => void;
}

export default function ExamBatchModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  if (!isOpen) return null;

  const isEditing = !!initialData?.id;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      
      <div className={`${styles.modalContainer} ${styles.modalMax2Xl}`}>
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {isEditing ? 'Chỉnh sửa Đợt thi' : 'Tạo Đợt thi mới'}
            </h3>
            <p className="text-xs text-slate-500">Thiết lập thời gian đăng ký và lịch trình cho kỳ thi.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.modalBody}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Tên Đợt thi</label>
                <input type="text" defaultValue={initialData?.batchName} className="w-full bg-slate-100 border-none focus:ring-2 focus:ring-blue-600 px-4 py-3 text-sm rounded-lg font-medium text-slate-900 placeholder:text-slate-400 outline-none" placeholder="VD: Khóa thi Tháng 6/2026 - Hạng B2" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Khóa học áp dụng</label>
                <select defaultValue={initialData?.courseId} className="w-full bg-slate-100 border-none focus:ring-2 focus:ring-blue-600 px-4 py-3 text-sm rounded-lg font-medium text-slate-900 outline-none cursor-pointer">
                  <option value="">Chọn Khóa học</option>
                  <option value="B1">Hạng B1 - Số tự động</option>
                  <option value="B2">Hạng B2 - Số sàn</option>
                  <option value="C">Hạng C - Xe tải</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Trạng thái ban đầu</label>
                <select defaultValue={initialData?.status || 'Upcoming'} className="w-full bg-slate-100 border-none focus:ring-2 focus:ring-blue-600 px-4 py-3 text-sm rounded-lg font-medium text-slate-900 outline-none cursor-pointer">
                  <option value="Upcoming">Sắp diễn ra (Upcoming)</option>
                  <option value="Active">Đang diễn ra (Active)</option>
                  <option value="Completed">Đã kết thúc (Completed)</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="pt-4 space-y-6">
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100/50">
                <h4 className="text-[11px] font-black uppercase text-blue-600 mb-4 tracking-wider flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4" /> Thời gian đăng ký
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Ngày bắt đầu</label>
                    <input type="datetime-local" defaultValue={initialData?.registrationStartDate} className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-blue-600 px-3 py-2 text-xs rounded font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Ngày kết thúc</label>
                    <input type="datetime-local" defaultValue={initialData?.registrationEndDate} className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-blue-600 px-3 py-2 text-xs rounded font-medium outline-none" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Thời gian thi dự kiến</label>
                  <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Quy tắc xác thực bật</span>
                </div>
                <input type="datetime-local" defaultValue={initialData?.examStartDate} className="w-full bg-slate-100 border-none focus:ring-2 focus:ring-blue-600 px-4 py-3 text-sm rounded-lg font-medium ring-1 ring-slate-200 outline-none" />
                <p className="mt-2 flex items-center text-[11px] text-amber-600 font-medium">
                  <Info className="w-3.5 h-3.5 mr-1" /> Ngày thi dự kiến phải sau Ngày kết thúc đăng ký
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-3">
          <button onClick={onClose} className="px-6 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-lg transition-colors">
            Hủy bỏ
          </button>
          <button className="px-10 py-2.5 bg-blue-600 text-white font-black text-sm shadow-lg hover:bg-blue-700 active:scale-95 transition-all rounded-lg">
            Lưu Đợt thi
          </button>
        </div>
      </div>
    </div>
  );
}