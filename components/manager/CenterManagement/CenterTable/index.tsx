// src/app/(admin)/centers/_components/CenterTable/index.tsx
import React from 'react';
import { Edit, EyeOff, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { CenterRecord } from '@/types/center';

interface Props {
  data: CenterRecord[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (center: CenterRecord) => void;
  onToggleStatus: (center: CenterRecord) => void;
}

export default function CenterTable({ data, currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onEdit, onToggleStatus }: Props) {
  const getInitials = (name: string) => {
    // Lấy chữ cái đầu tiên của từ cuối cùng (VD: An Nhiên -> N)
    const parts = name.split(' ');
    return parts[parts.length - 1][0].toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Tên Trung Tâm</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Địa Chỉ</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Số Điện Thoại</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Trạng Thái</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((center) => (
              <tr key={center.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${center.status === 'Hoạt động' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                      {getInitials(center.name)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{center.name}</p>
                      <p className="text-[10px] text-slate-400">ID: {center.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">{center.address}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600">{center.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                    center.status === 'Hoạt động' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {center.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(center)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-md" title="Chỉnh sửa">
                      <Edit className="w-4 h-4" />
                    </button>
                    {center.status === 'Hoạt động' ? (
                      <button onClick={() => onToggleStatus(center)} className="p-2 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-md" title="Tạm dừng">
                        <EyeOff className="w-4 h-4" />
                      </button>
                    ) : (
                      <button onClick={() => onToggleStatus(center)} className="p-2 text-blue-600 hover:text-blue-800 transition-colors hover:bg-blue-50 rounded-md" title="Kích hoạt">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">Không tìm thấy trung tâm nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} trên {totalItems} trung tâm
        </p>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 rounded-md bg-blue-600 text-white text-xs font-bold">{currentPage}</button>
          <button 
            onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages || totalPages === 0}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}