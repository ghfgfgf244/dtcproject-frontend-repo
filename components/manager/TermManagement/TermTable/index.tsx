// src/app/(manager)/enrollment-manager/terms/_components/TermTable/index.tsx
import React from 'react';
import { PenSquare, Trash2, CalendarCheck, CalendarClock, History, Power, PowerOff } from 'lucide-react';
import { TermRecord } from '@/types/term';

interface Props {
  terms: TermRecord[];
  onEdit: (term: TermRecord) => void;
  onDelete: (term: TermRecord) => void;
  onToggleStatus: (term: TermRecord) => void;
}

export default function TermTable({ terms, onEdit, onDelete, onToggleStatus }: Props) {
  
  const getCourseIcon = (isActive: boolean) => {
    return isActive ? <CalendarCheck className="w-4 h-4" /> : <History className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Thông tin học kỳ</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Khóa học áp dụng</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Tuyển sinh</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Trạng thái</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {terms.map((term) => {
              const enrollmentPercent = term.maxStudents > 0 
                ? Math.min(100, Math.round((term.currentStudents / term.maxStudents) * 100)) 
                : 0;

              return (
                <tr key={term.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{term.name}</span>
                      <div className="flex items-center gap-2 mt-1 text-slate-400">
                        <span className="text-[10px] font-bold uppercase tracking-wider">{term.startDate}</span>
                        <span className="text-slate-200 text-[10px]">|</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{term.endDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        {getCourseIcon(term.isActive)}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{term.courseName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                        <span>{term.currentStudents}</span>
                        <span className="text-slate-300 font-medium">/</span>
                        <span className="text-slate-400">{term.maxStudents}</span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                        <div 
                          className={`h-full transition-all duration-500 ${enrollmentPercent >= 90 ? 'bg-amber-500' : 'bg-blue-600'}`}
                          style={{ width: `${enrollmentPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {term.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-700 border-emerald-200">
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-red-50 text-red-600 border-red-100">
                        Đã tạm dừng
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onToggleStatus(term)} 
                        title={term.isActive ? "Tạm dừng" : "Kích hoạt"}
                        className={`p-1.5 rounded transition-colors ${term.isActive ? "text-amber-500 hover:bg-amber-50" : "text-emerald-500 hover:bg-emerald-50"}`}
                      >
                        {term.isActive ? <PowerOff className="w-5 h-5" /> : <Power className="w-5 h-5" />}
                      </button>
                      <button onClick={() => onEdit(term)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                        <PenSquare className="w-5 h-5" />
                      </button>
                      <button onClick={() => onDelete(term)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Hiển thị {terms.length} học kỳ</p>
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 rounded border border-blue-600 bg-blue-600 text-white text-[11px] font-bold shadow-sm">1</button>
        </div>
      </div>
    </div>
  );
}