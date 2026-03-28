"use client";

import React, { useState } from 'react';
import styles from '@/components/manager/Modals/modal.module.css';
import { X, Archive, BellRing, CheckCircle } from 'lucide-react';
import { Exam, ExamType } from '@/types/exam';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  batchContext: { id: string; name: string }; 
  initialData?: Exam | null;
  onSubmit: (data: Partial<Exam>) => void;
}

export default function ExamModal({ isOpen, onClose, batchContext, initialData, onSubmit }: Props) {
  const [notify, setNotify] = useState(true);

  if (!isOpen) return null;

  // HÀM XỬ LÝ SUBMIT
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Gom dữ liệu
    const examData: Partial<Exam> = {
      ...(initialData?.id ? { id: initialData.id } : {}), // Giữ lại ID nếu là Edit
      examBatchId: batchContext.id, // Lấy từ props
      examName: formData.get('examName') as string,
      examType: formData.get('examType') as ExamType, 
      examDate: formData.get('examDate') as string,
      durationMinutes: Number(formData.get('durationMinutes')),
    };

    onSubmit(examData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      
      <div className={`${styles.modalContainer} ${styles.modalMaxLg}`}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              {initialData ? 'Cập nhật Bài thi' : 'Tạo Bài thi mới'}
            </h3>
            <p className="text-xs font-medium text-slate-500">Thêm vào Đợt thi: <span className="text-blue-600 font-bold">{batchContext.name}</span></p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BỌC NỘI DUNG TRONG THẺ FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          {/* Modal Body */}
          <div className={styles.modalBody}>
            <div className="space-y-6">
              
              {/* Context (Read Only) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mã tham chiếu Đợt thi</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                  <Archive className="text-slate-400 w-4 h-4" />
                  <span className="text-sm text-slate-600 font-medium">ID: {batchContext.id}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tên Bài thi <span className="text-red-500">*</span></label>
                {/* Thêm name và required */}
                <input required name="examName" type="text" defaultValue={initialData?.examName} className="w-full bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all text-sm py-2.5 px-4 font-medium outline-none" placeholder="VD: Thi sát hạch Lý thuyết" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hình thức thi <span className="text-red-500">*</span></label>
                  {/* Thêm name và required */}
                  <select required name="examType" defaultValue={initialData?.examType || 'Theory'} className="w-full bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all text-sm py-2.5 px-4 font-medium outline-none cursor-pointer">
                    <option value="Theory">Lý thuyết (Theory)</option>
                    <option value="Practice">Thực hành (Practice)</option>
                    <option value="Simulation">Mô phỏng (Simulation)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ngày thi <span className="text-red-500">*</span></label>
                  {/* Thêm name và required */}
                  <input required name="examDate" type="date" defaultValue={initialData?.examDate} className="w-full bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-blue-600 transition-all text-sm py-2 px-4 font-medium outline-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Thời lượng (Phút) <span className="text-red-500">*</span></label>
                <div className="flex items-center">
                  {/* Thêm name và required */}
                  <input required name="durationMinutes" type="number" defaultValue={initialData?.durationMinutes} min="1" placeholder="60" className="w-full bg-slate-100 border-none rounded-l-lg focus:ring-2 focus:ring-blue-600 transition-all text-sm py-2.5 px-4 font-medium outline-none" />
                  <div className="bg-slate-200 text-slate-500 px-4 py-2.5 text-xs font-bold rounded-r-lg">PHÚT</div>
                </div>
              </div>

              {/* Custom Tailwind Toggle */}
              <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <BellRing className="text-blue-600 w-5 h-5" />
                  <div>
                    <p className="text-[12px] font-bold text-blue-900">Thông báo Giảng viên</p>
                    <p className="text-[10px] text-blue-700">Gửi thông báo lịch thi tới email khi lưu</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notify} onChange={() => setNotify(!notify)} />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 mt-auto">
            <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors">Hủy bỏ</button>
            {/* Đổi thành type submit */}
            <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2">
              <span>Lưu Bài thi</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}