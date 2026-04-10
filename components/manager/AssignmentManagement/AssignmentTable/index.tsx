// src/app/(manager)/training-manager/assignments/_components/AssignmentTable/index.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PendingClass, InstructorOption } from '@/types/assignment';

interface Props {
  classes: PendingClass[];
  instructors: InstructorOption[];
  onAssignInstructor: (classId: string, instructorId: string) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function AssignmentTable({ classes, instructors, onAssignInstructor, currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: Props) {
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Trống': 
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-600"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Trống</span>;
      case 'Cần đổi': 
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Cần đổi</span>;
      case 'Đã phân công':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Đã phân công</span>;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-900">Danh sách lớp học cần điều phối</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên Lớp</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Khóa Học</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Học Kỳ</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Sĩ Số</th>
              {/* ĐÃ ĐẢO VỊ TRÍ 2 CỘT */}
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Trạng thái</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Chỉ định Giảng viên</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classes.map(cls => (
              <tr key={cls.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900">{cls.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">ID: {cls.code}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-700">{cls.course}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md text-xs font-bold">{cls.term}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm font-bold text-slate-900">{cls.currentStudents}</span>
                    <span className="text-xs text-slate-400">/ {cls.maxStudents}</span>
                  </div>
                </td>
                
                {/* Cột Trạng thái */}
                <td className="px-6 py-4 text-center">
                  {getStatusBadge(cls.status)}
                </td>

                {/* Cột Chỉ định Giảng viên */}
                <td className="px-6 py-4">
                  <select 
                    className={`w-full border-none rounded-lg text-sm py-2.5 px-3 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer transition-colors ${
                      cls.assignedInstructorId ? 'bg-blue-50 text-blue-700 font-bold' : 'bg-slate-100 text-slate-600 font-medium'
                    }`}
                    value={cls.assignedInstructorId || ""}
                    onChange={(e) => onAssignInstructor(cls.id, e.target.value)}
                  >
                    <option value="" disabled>-- Chọn giảng viên rảnh --</option>
                    {instructors.map(ins => (
                      <option key={ins.id} value={ins.id}>
                        {ins.isRecommended ? `⭐ ` : ''}{ins.fullName} ({ins.expertise})
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {classes.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Tất cả các lớp đã được phân công.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-6 bg-slate-50 flex justify-between items-center border-t border-slate-100">
        <p className="text-xs font-medium text-slate-500">
          Hiển thị {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} trong số {totalItems} lớp học cần điều phối
        </p>
        <div className="flex gap-1.5">
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded bg-blue-600 text-white text-xs font-bold">{currentPage}</button>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages || totalPages === 0} className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}