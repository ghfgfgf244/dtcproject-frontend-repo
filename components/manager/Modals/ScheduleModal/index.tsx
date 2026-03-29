// src/components/manager/ScheduleManagement/ScheduleModal/index.tsx
"use client";

import React, { useState } from 'react';
import { X, ChevronDown, Info } from 'lucide-react';
import { ScheduleEvent } from '@/types/schedule';

export interface ScheduleFormData {
  courseId: string;
  instructorId: string;
  startTime: string;
  endTime: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: ScheduleEvent | null;
  onSubmit: (data: ScheduleFormData) => void;
  defaultDate?: number; // <-- 1. THÊM PROP NÀY
}

export default function ScheduleModal({ isOpen, onClose, initialData, onSubmit, defaultDate }: Props) {
  // Form States
  const [courseId, setCourseId] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // States để track thay đổi (Tránh lỗi cascading renders của useEffect)
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevInitialData, setPrevInitialData] = useState<ScheduleEvent | null>(null);
  const [prevDefaultDate, setPrevDefaultDate] = useState<number | undefined>(undefined);

  // 2. CẬP NHẬT LOGIC KHỞI TẠO STATE
  if (isOpen !== prevIsOpen || initialData !== prevInitialData || defaultDate !== prevDefaultDate) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);
    setPrevDefaultDate(defaultDate);
    
    if (isOpen) {
      if (initialData) {
        // Chế độ Edit: Điền data cũ
        setCourseId(initialData.courseId);
        setInstructorId(initialData.instructorName);
        setStartTime(`2023-10-${String(initialData.date).padStart(2, '0')}T${initialData.startTime}`);
        setEndTime(`2023-10-${String(initialData.date).padStart(2, '0')}T${initialData.endTime}`);
      } else {
        // Chế độ Create: Tự động lấy defaultDate gán vào, set mặc định là 08:00 đến 10:00
        setCourseId('');
        setInstructorId('');
        if (defaultDate) {
          const dayStr = String(defaultDate).padStart(2, '0');
          setStartTime(`2023-10-${dayStr}T08:00`);
          setEndTime(`2023-10-${dayStr}T10:00`);
        } else {
          setStartTime('');
          setEndTime('');
        }
      }
    }
  }

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ courseId, instructorId, startTime, endTime });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              {initialData ? 'Cập Nhật Lịch Học' : 'Tạo Lịch Học Mới'}
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Thiết lập thời gian và nhân sự đào tạo
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors active:scale-95">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-8 py-8 space-y-6">
            
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Chọn Lớp học</label>
              <div className="relative">
                <select 
                  required value={courseId} onChange={(e) => setCourseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm appearance-none focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all cursor-pointer font-medium"
                >
                  <option value="" disabled>-- Chọn lớp học --</option>
                  <option value="Lớp B2 - Khóa 45">Lớp B2 - Khóa 45</option>
                  <option value="Lớp B2 - Khóa 46">Lớp B2 - Khóa 46</option>
                  <option value="Lớp C - Khóa 12">Lớp C - Khóa 12</option>
                  <option value="Lớp B1 - Khóa 89">Lớp B1 - Khóa 89</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Chọn Giảng viên</label>
              <div className="relative">
                <select 
                  required value={instructorId} onChange={(e) => setInstructorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm appearance-none focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all cursor-pointer font-medium"
                >
                  <option value="" disabled>-- Chọn giảng viên --</option>
                  <option value="Nguyễn Văn An">Nguyễn Văn An</option>
                  <option value="Lê Thị Bình">Lê Thị Bình</option>
                  <option value="Phạm Hồng Thái">Phạm Hồng Thái</option>
                  <option value="Trần Minh Tâm">Trần Minh Tâm</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Bắt đầu</label>
                <input 
                  required type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kết thúc</label>
                <input 
                  required type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
              <Info className="text-blue-600 w-5 h-5 shrink-0" />
              <p className="text-[11px] font-medium text-blue-800 leading-relaxed">
                Hệ thống sẽ tự động kiểm tra xung đột lịch trình của giảng viên và phòng/sân tập trước khi lưu.
              </p>
            </div>

          </div>

          <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-200 transition-all active:scale-95 text-sm">
              Hủy bỏ
            </button>
            <button type="submit" className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all text-sm">
              Lưu lịch học
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}