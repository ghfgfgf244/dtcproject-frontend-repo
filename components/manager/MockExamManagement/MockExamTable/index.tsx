// src/app/(manager)/training-manager/mock-exams/_components/MockExamTable/index.tsx
import React from 'react';
import { ChevronRight, ChevronLeft, Trash2, BookOpen } from 'lucide-react';
import { MockExamRecord } from '@/types/mock-exam';

interface Props {
  data: MockExamRecord[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onViewDetails: (id: string) => void;
  onDeleteClick: (id: string, examCode: string) => void;
}

export default function MockExamTable({ 
  data, currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onViewDetails, onDeleteClick 
}: Props) {

  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case 'Dễ': return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">{level}</span>;
      case 'Trung bình': return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">{level}</span>;
      case 'Khó': return <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 uppercase tracking-wider">{level}</span>;
      default: return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Bộ đề</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Khóa học</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Đề số</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Độ khó</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Số câu hỏi</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((exam) => {
            const progressPercent = Math.min(100, Math.max(0, (exam.currentQuestions / exam.totalQuestions) * 100));
            
            return (
              <tr key={exam.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => onViewDetails(exam.id)}>
                <td className="px-6 py-4">
                  <span className="text-xs font-mono font-bold text-blue-600">{exam.examId}</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{exam.createdAt}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-900">{exam.courseCode}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="w-8 h-8 rounded-full bg-slate-100 inline-flex items-center justify-center text-xs font-black text-slate-700">
                    {exam.examNumber}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getDifficultyBadge(exam.difficulty)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-500" 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-600 tracking-tight">
                      {exam.currentQuestions}/{exam.totalQuestions}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onViewDetails(exam.id); }}
                      className="text-xs font-black hover:text-blue-600 hover:underline flex items-center gap-1 group-hover:-translate-x-1 transition-transform opacity-0 group-hover:opacity-100"
                      title="Xem chi tiết"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDeleteClick(exam.id, exam.examId); }}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      title="Xóa bộ đề"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {data.length === 0 && (
            <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Chưa có bộ đề nào.</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-6 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="text-xs text-slate-500 font-medium tracking-tight">
          Hiển thị {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} trên tổng số {totalItems} bộ đề
        </span>
        
        <div className="flex items-center gap-2">
          {/* Nút Previous */}
          <button 
            onClick={() => onPageChange(currentPage - 1)} 
            disabled={currentPage === 1 || totalPages === 0}
            className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Generate các nút số trang động */}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button 
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-colors ${
                currentPage === page 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Nút Next */}
          <button 
            onClick={() => onPageChange(currentPage + 1)} 
            disabled={currentPage >= totalPages || totalPages === 0}
            className="w-8 h-8 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}