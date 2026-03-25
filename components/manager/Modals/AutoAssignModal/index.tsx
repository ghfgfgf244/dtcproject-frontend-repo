"use client";

import React, { useState } from 'react';
import { X, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import styles from '@/components/manager/Modals/modal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (term: string) => Promise<void>;
}

export default function AutoAssignModal({ isOpen, onClose, onConfirm }: Props) {
  const [selectedTerm, setSelectedTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRun = async () => {
    if (!selectedTerm) return;
    setIsLoading(true);
    await onConfirm(selectedTerm); // Đợi xử lý logic (fake API) từ ClientView
    setIsLoading(false);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={!isLoading ? onClose : undefined} />
      
      <div className={`${styles.modalContainer} max-w-md`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">Xếp lớp tự động</h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-900 font-medium leading-relaxed">
              Hệ thống sẽ dựa vào số lượng học viên đã đăng ký, danh sách giảng viên trống lịch và sức chứa của phòng để tự động tạo lớp học.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Chọn Học kỳ áp dụng <span className="text-red-500">*</span>
            </label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all text-slate-700"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              disabled={isLoading}
            >
              <option value="" disabled>-- Vui lòng chọn học kỳ --</option>
              <option value="Fall 2023">Học kỳ: Fall 2023</option>
              <option value="Spring 2024">Học kỳ: Spring 2024</option>
              <option value="Summer 2024">Học kỳ: Summer 2024</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={handleRun}
            disabled={!selectedTerm || isLoading}
            className="px-6 py-2.5 bg-blue-600 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Thực thi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}