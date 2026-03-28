// src/app/(manager)/training-manager/registrations/_components/RegistrationTable/index.tsx
import React from 'react';
import { Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { RegistrationRecord } from '@/types/registration';

interface Props {
  data: RegistrationRecord[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function RegistrationTable({ 
  data, currentPage, totalPages, totalItems, itemsPerPage, 
  onPageChange, onApprove, onReject 
}: Props) {

  // UI Helpers
  const getPaymentBadge = (status: string) => {
    return status === 'Đã đóng' 
      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">{status}</span>
      : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">{status}</span>;
  };

  const getConditionBadge = (status: string) => {
    return status === 'Đủ giờ học'
      ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">{status}</span>
      : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 uppercase tracking-wider">{status}</span>;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">Học viên</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">Đợt thi</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500">Ngày đăng ký</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">Thanh toán</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 text-center">Điều kiện</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((record) => {
              // Logic: Chỉ cho phép duyệt nếu đủ cả 2 điều kiện
              const isEligible = record.paymentStatus === 'Đã đóng' && record.conditionStatus === 'Đủ giờ học';
              
              return (
                <tr key={record.id} className={`hover:bg-slate-50 transition-colors group ${record.approvalStatus !== 'Đang chờ duyệt' ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs ${record.avatarColor}`}>
                        {record.avatarInitials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-tight">{record.studentName}</p>
                        <p className="text-[11px] text-slate-500">MSHV: {record.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{record.examBatch}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{record.registrationDate}</td>
                  <td className="px-6 py-4 text-center">{getPaymentBadge(record.paymentStatus)}</td>
                  <td className="px-6 py-4 text-center">{getConditionBadge(record.conditionStatus)}</td>
                  
                  <td className="px-6 py-4 text-right">
                    {record.approvalStatus === 'Đang chờ duyệt' ? (
                      <div className="flex justify-end gap-2">
                        {/* Nút Approve */}
                        <button 
                          onClick={() => onApprove(record.id)}
                          disabled={!isEligible}
                          title={!isEligible ? "Học viên chưa đủ điều kiện để duyệt" : "Duyệt đơn"}
                          className={`w-8 h-8 flex items-center justify-center rounded transition-all ${
                            isEligible 
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' 
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        
                        {/* Nút Reject */}
                        <button 
                          onClick={() => onReject(record.id)}
                          title="Từ chối đơn"
                          className="w-8 h-8 flex items-center justify-center rounded bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-500">{record.approvalStatus}</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Không có đơn đăng ký nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
        <p className="text-xs text-slate-500 font-medium">
          Hiển thị {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số {totalItems} bản ghi
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