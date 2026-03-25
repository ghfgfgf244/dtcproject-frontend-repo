// src/app/(manager)/training-manager/terms/_components/Modals/TermModal.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { X, FileText, ChevronDown, Info, Save } from 'lucide-react';
import { TermRecord } from '@/types/term';
import styles from '@/components/manager/Modals/modal.module.css'; // Import CSS Module

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: TermRecord | null;
  onSubmit: (data: Partial<TermRecord>) => void;
}

export default function TermModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  // State quản lý form
  const [formData, setFormData] = useState({
    name: '',
    courseName: '', // Thực tế DB lưu courseId, ở đây dùng courseName theo type hiện tại
    startDate: '',
    endDate: ''
  });

  // Nạp dữ liệu khi mở Modal (Edit vs Create)
  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: initialData.name || '',
        courseName: initialData.courseName || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || ''
      });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: '',
        courseName: '',
        startDate: '',
        endDate: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...initialData,
      ...formData
    });
  };

  return (
    <div className={styles.overlay}>
      {/* Background overlay click to close */}
      <div className={styles.backdrop} onClick={onClose} />
      
      {/* Modal Content Container */}
      <div className={`${styles.modalContainer} ${styles.modalMax2Xl}`}>
        
        {/* Modal Header */}
        <div className="bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                {initialData ? 'Cập nhật Học kỳ' : 'Thêm mới Học kỳ'}
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Hệ thống Quản lý Đào tạo</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form id="termForm" onSubmit={handleSubmit} className={`${styles.modalBody} space-y-6`}>
          
          {/* Term Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Tên Học kỳ <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                required
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder:text-slate-400 transition-all outline-none" 
                placeholder="VD: Học kỳ 3 - 2024" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          {/* Course Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Chọn Khóa học <span className="text-red-500">*</span></label>
            <div className="relative">
              <select 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 appearance-none transition-all outline-none cursor-pointer text-slate-700"
                value={formData.courseName}
                onChange={(e) => setFormData({...formData, courseName: e.target.value})}
              >
                <option disabled value="">Chọn khóa học phù hợp</option>
                <option value="Khóa B2 - K24">Khóa B2 - K24</option>
                <option value="Khóa B1 - K24">Khóa B1 - K24</option>
                <option value="Khóa C - K24">Khóa C - K24</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Date Range Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Ngày Bắt đầu <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  required
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all outline-none" 
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Ngày Kết thúc <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  required
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all outline-none" 
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Validation Note */}
          <div className="flex gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
            <Info className="text-indigo-600 shrink-0 w-5 h-5" />
            <p className="text-xs text-indigo-900 leading-relaxed font-medium">
              <span className="font-bold">Lưu ý:</span> Ngày kết thúc phải sau ngày bắt đầu ít nhất 3 tháng đối với các khóa hạng B2 và C.
            </p>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors active:scale-95"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit"
            form="termForm"
            className="px-8 py-2.5 rounded-lg text-sm font-black bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
          >
            Lưu thông tin
            <Save className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}