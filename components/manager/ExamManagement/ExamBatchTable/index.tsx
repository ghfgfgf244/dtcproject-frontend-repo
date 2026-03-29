// src/app/(manager)/training-manager/exams/_components/ExamBatchTable/index.tsx
import React from 'react';
import { Edit2, Trash2, Settings2 } from 'lucide-react'; // Import icons
import styles from './table.module.css';
import { ExamBatch } from '@/types/exam';

interface Props {
  batches: ExamBatch[];
  selectedId: string;
  onSelect: (id: string) => void;
  onEditClick: (batch: ExamBatch) => void;   // Added explicit Edit handler
  onDeleteClick: (batch: ExamBatch) => void; // Added Delete handler
}

export default function ExamBatchTable({ 
  batches, 
  selectedId, 
  onSelect, 
  onEditClick, 
  onDeleteClick 
}: Props) {
  return (
    <div className={styles.tableWrapper}>
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-900">Danh sách Đợt thi</h3>
      </div>
      <div className="overflow-x-auto">
        <table className={styles.tableLayout}>
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">Thông tin Đợt thi</th>
              <th className="px-6 py-4 font-bold">Số lượng ứng viên</th>
              <th className="px-6 py-4 font-bold">Trạng thái</th>
              <th className="px-6 py-4 font-bold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {batches.map((batch) => (
              <tr 
                key={batch.id} 
                onClick={() => onSelect(batch.id)}
                className={`cursor-pointer transition-colors group ${selectedId === batch.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900">{batch.batchName}</p>
                  <p className="text-xs text-slate-400">ID: {batch.id}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span className="text-blue-600">{batch.currentCandidates}</span>
                    <span className="text-slate-400">/ {batch.maxCandidates}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    batch.status === 'OpenForRegistration' || batch.status === 'InProgress' ? 'bg-emerald-100 text-emerald-700' : 
                    batch.status === 'Pending' ? 'bg-blue-100 text-blue-700' : 
                    batch.status === 'Completed' ? 'bg-slate-100 text-slate-600' : 
                    batch.status === 'ClosedForRegistration' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {batch.status === 'Pending' ? 'CHƯA MỞ ĐĂNG KÝ' :
                     batch.status === 'OpenForRegistration' ? 'ĐANG MỞ ĐĂNG KÝ' :
                     batch.status === 'ClosedForRegistration' ? 'ĐÃ ĐÓNG ĐĂNG KÝ' :
                     batch.status === 'InProgress' ? 'ĐANG DIỄN RA KỲ THI' :
                     batch.status === 'Completed' ? 'ĐÃ KẾT THÚC' : 
                     batch.status === 'Cancelled' ? 'ĐÃ HỦY' : batch.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {/* Action Buttons Group */}
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(batch);
                      }}
                      className="p-1.5 text-slate-400 hover:text-amber-600 transition-colors rounded hover:bg-amber-50"
                      title="Chỉnh sửa đợt thi"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(batch);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                      title="Xóa đợt thi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {batches.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                  Chưa có đợt thi nào được tạo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}