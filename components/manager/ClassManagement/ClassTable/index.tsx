// src/app/(manager)/training-manager/classes/_components/ClassTable/index.tsx
import React from 'react';
import { Eye, Edit, Trash2, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { ClassRecord, ClassTheme } from '@/types/class';

export interface ClassTableProps {
  classes: ClassRecord[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onView: (cls: ClassRecord) => void;
  onEdit: (cls: ClassRecord) => void;
  onDelete: (cls: ClassRecord) => void;
}

export default function ClassTable({ 
  classes, currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onView, onEdit, onDelete 
}: ClassTableProps) {

  const getThemeStyles = (theme: ClassTheme) => {
    switch (theme) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'emerald': return 'bg-emerald-100 text-emerald-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-200">
              <th className="px-6 py-4">Lớp học</th>
              <th className="px-6 py-4">Khóa học áp dụng</th>
              <th className="px-6 py-4">Khai giảng</th>
              <th className="px-6 py-4">Bế giảng</th>
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classes.map((cls) => (
              <tr key={cls.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${getThemeStyles(cls.theme)}`}>
                      {cls.code}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{cls.name}</p>
                      <p className="text-xs text-slate-500">{cls.studentCount} Học viên</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-600">{cls.courseName}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays className="w-4 h-4 text-slate-400" />
                    {cls.startDate}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays className="w-4 h-4 text-slate-400" />
                    {cls.endDate}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onView(cls)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Xem chi tiết">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button onClick={() => onEdit(cls)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors" title="Chỉnh sửa">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDelete(cls)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Xóa">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          {totalItems === 0 ? "Không có dữ liệu" : `Hiển thị ${startItem} đến ${endItem} trong ${totalItems} lớp`}
        </p>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {pageNumbers.map(num => (
              <button 
                key={num}
                onClick={() => onPageChange(num)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === num ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {num}
              </button>
            ))}

            <button 
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}