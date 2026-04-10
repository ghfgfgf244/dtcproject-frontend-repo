// src/app/(manager)/enrollment-manager/commissions/_components/CommissionTable/index.tsx
import React from 'react';
import { CommissionRecord } from '@/types/commission';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  data: CommissionRecord[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPay: (record: CommissionRecord) => void;
  onViewDetails: (record: CommissionRecord) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

// Hàm lấy chữ cái đầu của tên
const getInitials = (name: string) => {
  const parts = name.split(' ');
  return parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name[0].toUpperCase();
};

export default function CommissionTable({ data, currentPage, totalPages, totalItems, itemsPerPage, onPageChange, onPay, onViewDetails }: Props) {
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">ID CTV</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Tên Cộng tác viên</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Mã giới thiệu</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Số tiền</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Ngày ghi nhận</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Trạng thái</th>
            <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4 text-[13px] font-medium text-slate-500">#{item.collaboratorCode}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {getInitials(item.collaboratorName)}
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.collaboratorName}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <code className="px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-600">{item.referralCode}</code>
              </td>
              <td className="px-6 py-4 text-sm font-black text-slate-900">
                {formatCurrency(item.amount)} <span className="text-[10px] font-bold text-slate-500">VNĐ</span>
              </td>
              {/* Định dạng lại chuỗi ngày YYYY-MM-DD sang DD/MM/YYYY */}
              <td className="px-6 py-4 text-sm text-slate-500">{item.date.split('-').reverse().join('/')}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  item.status === 'Đã thanh toán' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.status === 'Chờ thanh toán' && (
                    <button 
                      onClick={() => onPay(item)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded shadow-sm hover:bg-blue-700 transition-colors"
                    >
                      Thanh toán
                    </button>
                  )}
                  <button 
                    onClick={() => onViewDetails(item)}
                    className="px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-100 transition-colors"
                  >
                    Chi tiết
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">Không tìm thấy dữ liệu hoa hồng phù hợp.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <span className="text-xs font-medium text-slate-500 italic">
          Hiển thị {totalItems === 0 ? 0 : startIndex} - {endIndex} trên {totalItems} kết quả
        </span>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-white transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white text-xs font-bold">
            {currentPage}
          </button>
          <button 
            onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages || totalPages === 0}
            className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 text-xs font-bold hover:bg-white transition-colors disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}