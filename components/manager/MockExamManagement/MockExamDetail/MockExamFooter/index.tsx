// src/app/(manager)/training-manager/mock-exams/[id]/_components/MockExamFooter/index.tsx
import React from 'react';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

interface Props {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onSave: () => void;
}

export default function MockExamFooter({ 
  currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onSave 
}: Props) {
  
  // Tính toán số lượng đang hiển thị
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <>
      {/* 1. Thanh Phân trang (Pagination) */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500 font-medium italic">
          Đang hiển thị {startItem} - {endItem} trên tổng số {totalItems} câu hỏi
        </p>
        
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => onPageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-bold text-xs shadow-sm">
            {currentPage}
          </button>
          
          <button 
            onClick={() => onPageChange(currentPage + 1)} 
            disabled={currentPage >= totalPages || totalPages === 0}
            className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Nút Lưu Floating (FAB) */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={onSave}
          className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-600/30 flex items-center justify-center hover:scale-105 transition-transform active:scale-95 group relative"
        >
          <Save className="w-6 h-6" />
          {/* Tooltip */}
          <span className="absolute right-16 bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-widest pointer-events-none">
            Lưu cấu trúc bộ đề
          </span>
        </button>
      </div>
    </>
  );
}