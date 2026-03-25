// src/app/(manager)/enrollment-manager/commissions/_components/CommissionStats/index.tsx
import React from 'react';
import { TrendingUp, Clock, Users } from 'lucide-react';
import { CommissionStatsData } from '@/types/commission';

const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

export default function CommissionStats({ data }: { data: CommissionStatsData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Tổng hoa hồng */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full transition-transform group-hover:scale-110"></div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 relative z-10">Tổng hoa hồng</p>
        <h3 className="text-2xl font-black text-slate-900 relative z-10">{formatVND(data.totalAmount)} <span className="text-sm font-medium">VNĐ</span></h3>
        <div className="mt-4 flex items-center text-xs text-emerald-600 font-bold relative z-10">
          <TrendingUp className="w-4 h-4 mr-1" /> +12% so với tháng trước
        </div>
      </div>

      {/* Đã thanh toán */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full transition-transform group-hover:scale-110"></div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 relative z-10">Đã thanh toán</p>
        <h3 className="text-2xl font-black text-slate-900 relative z-10">{formatVND(data.paidAmount)} <span className="text-sm font-medium">VNĐ</span></h3>
        <div className="mt-4 flex items-center text-xs text-slate-500 relative z-10">
          67.6% tổng ngân sách
        </div>
      </div>

      {/* Chờ thanh toán */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group border-l-4 border-l-blue-600">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full transition-transform group-hover:scale-110"></div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 relative z-10">Chờ thanh toán</p>
        <h3 className="text-2xl font-black text-blue-600 relative z-10">{formatVND(data.pendingAmount)} <span className="text-sm font-medium">VNĐ</span></h3>
        <div className="mt-4 flex items-center text-xs text-blue-600 font-bold relative z-10">
          <Clock className="w-4 h-4 mr-1" /> 42 lệnh đang chờ xử lý
        </div>
      </div>

      {/* Số CTV hoạt động */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full transition-transform group-hover:scale-110"></div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 relative z-10">Số CTV hoạt động</p>
        <h3 className="text-2xl font-black text-slate-900 relative z-10">{new Intl.NumberFormat('vi-VN').format(data.activeCollaborators)}</h3>
        <div className="mt-4 flex items-center text-xs text-amber-600 font-bold relative z-10">
          <Users className="w-4 h-4 mr-1" /> 85 CTV mới trong tuần
        </div>
      </div>
    </div>
  );
}