"use client";
import React from 'react';
import styles from '@/components/manager/Modals/modal.module.css';
import { X, CalendarCheck, Info } from 'lucide-react';
import { ExamBatch } from '@/types/exam';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ExamBatch | null; 
  onSubmit: (data: Partial<ExamBatch>) => void;
}

export default function ExamBatchModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  if (!isOpen) return null;

  const isEditing = !!initialData?.id;

  // HÀM XỬ LÝ SUBMIT
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Gom dữ liệu từ các input (dựa vào thuộc tính 'name')
    const batchData: Partial<ExamBatch> = {
      ...(isEditing ? { id: initialData.id } : {}), // Giữ lại ID nếu là Edit
      batchName: formData.get('batchName') as string,
      courseId: formData.get('courseId') as string,
      status: formData.get('status') as ExamBatch['status'],
      registrationStartDate: formData.get('registrationStartDate') as string,
      registrationEndDate: formData.get('registrationEndDate') as string,
      examStartDate: formData.get('examStartDate') as string,
    };

    onSubmit(batchData);
  };

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
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BỌC NỘI DUNG TRONG THẺ FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          {/* Modal Body */}
          <div className={styles.modalBody}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Tên Đợt thi <span className="text-red-500">*</span></label>
                  {/* Thêm name và required */}
                  <input required name="batchName" type="text" defaultValue={initialData?.batchName} className="w-full bg-slate-100 border-none focus:ring-2 focus:ring-blue-600 px-4 py-3 text-sm rounded-lg font-medium text-slate-900 placeholder:text-slate-400 outline-none" placeholder="VD: Khóa thi Tháng 6/2026 - Hạng B2" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Khóa học áp dụng <span className="text-red-500">*</span></label>
                  {/* Thêm name và required */}
                  <select required name="courseId" defaultValue={initialData?.courseId} className="w-full bg-slate-100 border-none focus:ring-2 focus:ring-blue-600 px-4 py-3 text-sm rounded-lg font-medium text-slate-900 outline-none cursor-pointer">
                    <option value="" disabled>Chọn Khóa học</option>
                    <option value="B1">Hạng B1 - Số tự động</option>
                    <option value="B2">Hạng B2 - Số sàn</option>
                    <option value="C">Hạng C - Xe tải</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Trạng thái ban đầu <span className="text-red-500">*</span></label>
                  {/* Thêm name và required */}
                  <select required name="status" defaultValue={initialData?.status || 'UPCOMING'} className="w-full bg-slate-100 border-none focus:ring-2 focus:ring-blue-600 px-4 py-3 text-sm rounded-lg font-medium text-slate-900 outline-none cursor-pointer">
                    <option value="UPCOMING">Sắp diễn ra (Upcoming)</option>
                    <option value="ACTIVE">Đang diễn ra (Active)</option>
                    <option value="COMPLETED">Đã kết thúc (Completed)</option>
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
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Ngày bắt đầu <span className="text-red-500">*</span></label>
                      {/* Thêm name và required */}
                      <input required name="registrationStartDate" type="datetime-local" defaultValue={initialData?.registrationStartDate} className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-blue-600 px-3 py-2 text-xs rounded font-medium outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Ngày kết thúc <span className="text-red-500">*</span></label>
                      {/* Thêm name và required */}
                      <input required name="registrationEndDate" type="datetime-local" defaultValue={initialData?.registrationEndDate} className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-blue-600 px-3 py-2 text-xs rounded font-medium outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Thời gian thi dự kiến <span className="text-red-500">*</span></label>
                    <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Quy tắc xác thực bật</span>
                  </div>
                  {/* Thêm name và required */}
                  <input required name="examStartDate" type="datetime-local" defaultValue={initialData?.examStartDate} className="w-full bg-slate-100 border-none focus:ring-2 focus:ring-blue-600 px-4 py-3 text-sm rounded-lg font-medium ring-1 ring-slate-200 outline-none" />
                  <p className="mt-2 flex items-center text-[11px] text-amber-600 font-medium">
                    <Info className="w-3.5 h-3.5 mr-1" /> Ngày thi dự kiến phải sau Ngày kết thúc đăng ký
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end items-center gap-3 rounded-b-xl">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-lg transition-colors">
              Hủy bỏ
            </button>
            {/* Đổi thành type submit */}
            <button type="submit" className="px-10 py-2.5 bg-blue-600 text-white font-black text-sm shadow-lg hover:bg-blue-700 active:scale-95 transition-all rounded-lg">
              Lưu Đợt thi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}