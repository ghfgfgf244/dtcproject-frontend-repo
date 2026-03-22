import React from 'react';
import styles from './table.module.css';
import { Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { StudentResult } from '@/types/exam-result';

interface Props {
  results: StudentResult[];
}

export default function ResultTable({ results }: Props) {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Mã / Tên Học viên</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Tên Bài thi</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Điểm số</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Ngày thi</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                      {item.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.studentName}</p>
                      <p className="text-[10px] text-slate-400 font-medium">ID: {item.studentId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-700">{item.examName}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.isPassed ? 'bg-emerald-500' : 'bg-red-500'}`} 
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-black text-slate-900">{item.score}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {item.isPassed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">Đạt</span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">Trượt</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 font-medium">{item.examDate}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-200">
        <p className="text-xs font-bold text-slate-500">HIỂN THỊ {results.length} TRONG 1,284 KẾT QUẢ</p>
        <div className="flex gap-2">
          <button className="p-1.5 border border-slate-200 rounded bg-white disabled:opacity-50" disabled>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded">1</button>
          <button className="px-3 py-1 text-slate-600 font-bold text-xs rounded hover:bg-slate-200">2</button>
          <button className="p-1.5 border border-slate-200 rounded bg-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}