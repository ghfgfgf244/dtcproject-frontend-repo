// src/app/(manager)/enrollment-manager/terms/_components/TermTable/index.tsx
import React from 'react';
import { PenSquare, Trash2, CalendarCheck, CalendarClock, History } from 'lucide-react';
import { TermRecord, TermStatus } from '@/types/term';

interface Props {
  terms: TermRecord[];
  onEdit: (term: TermRecord) => void;
  onDelete: (term: TermRecord) => void;
}

export default function TermTable({ terms, onEdit, onDelete }: Props) {
  
  const getStatusConfig = (status: TermStatus) => {
    switch (status) {
      case 'Active': return { label: 'Đang hoạt động', style: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      case 'Scheduled': return { label: 'Sắp diễn ra', style: 'bg-blue-100 text-blue-700 border-blue-200' };
      case 'Expired': return { label: 'Đã kết thúc', style: 'bg-slate-100 text-slate-500 border-slate-200' };
    }
  };

  const getCourseIcon = (status: TermStatus) => {
    switch (status) {
      case 'Active': return <CalendarCheck className="w-4 h-4" />;
      case 'Scheduled': return <CalendarClock className="w-4 h-4" />;
      default: return <History className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Thông tin học kỳ</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Khóa học áp dụng</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Thời gian diễn ra</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Trạng thái</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {terms.map((term) => {
              const statusConfig = getStatusConfig(term.status);
              return (
                <tr key={term.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{term.name}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{term.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        {getCourseIcon(term.status)}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{term.courseName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4 text-slate-600">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase opacity-60">Bắt đầu</span>
                        <span className="text-xs font-bold">{term.startDate}</span>
                      </div>
                      <span className="text-slate-300 font-bold">→</span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase opacity-60">Kết thúc</span>
                        <span className="text-xs font-bold">{term.endDate}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusConfig.style}`}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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