// src/app/(manager)/enrollment-manager/reports/_components/KPIStats/index.tsx
import React from 'react';
import { UserPlus, Award } from 'lucide-react';
import { ReportKPIs } from '@/types/report';

const formatVNDShort = (amount: number) => {
  return (amount / 1000000).toFixed(0) + 'M';
};

export default function KPIStats({ data }: { data: ReportKPIs }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* KPI 1 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <UserPlus className="w-10 h-10 text-blue-600" />
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tổng học viên mới</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-900">{new Intl.NumberFormat('vi-VN').format(data.totalNewStudents)}</h3>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{data.studentGrowth}</span>
        </div>
        <div className="mt-4 h-8 flex items-end gap-1">
          <div className="flex-1 bg-blue-100 rounded-t-sm h-[40%]"></div>
          <div className="flex-1 bg-blue-100 rounded-t-sm h-[60%]"></div>
          <div className="flex-1 bg-blue-100 rounded-t-sm h-[45%]"></div>
          <div className="flex-1 bg-blue-200 rounded-t-sm h-[80%]"></div>
          <div className="flex-1 bg-blue-600 rounded-t-sm h-[100%]"></div>
        </div>
        <p className="mt-3 text-[10px] text-slate-400 font-medium">So với cùng kỳ: <span className="text-emerald-600">+25% YoY</span></p>
      </div>

      {/* KPI 2 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tỷ lệ Rút/Bảo lưu</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-900">{data.churnRate}%</h3>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Ổn định</span>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-slate-600">
            <span>Chuyển công tác</span>
            <span>65%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full w-[65%]"></div>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-slate-400 font-medium italic">Lý do chính: Cá nhân/Gia đình</p>
      </div>

      {/* KPI 3 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tổng Hoa hồng</p>
        <h3 className="text-2xl font-black text-slate-900">{formatVNDShort(data.totalCommission)} <span className="text-sm font-bold text-slate-500">VNĐ</span></h3>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="bg-emerald-50 p-2 rounded-lg">
            <p className="text-[9px] font-bold text-emerald-700 uppercase">Đã duyệt</p>
            <p className="text-xs font-black text-emerald-800">{formatVNDShort(data.approvedCommission)}</p>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg">
            <p className="text-[9px] font-bold text-slate-500 uppercase">Chờ xử lý</p>
            <p className="text-xs font-black text-slate-700">{formatVNDShort(data.pendingCommission)}</p>
          </div>
        </div>
      </div>

      {/* KPI 4 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Top CTV tháng</p>
        <div className="flex items-center gap-3 mt-2">
          <img src={data.topCollaborator.avatar} alt={data.topCollaborator.name} className="w-12 h-12 rounded-lg object-cover border-2 border-blue-600/20" />
          <div>
            <p className="text-sm font-black text-slate-900">{data.topCollaborator.name}</p>
            <div className="flex items-center gap-1 text-blue-600 mt-0.5">
              <Award className="w-4 h-4" />
              <span className="text-xs font-bold">{data.topCollaborator.studentsCount} học viên</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Hiệu suất:</span>
          <span className="text-xs font-black text-blue-600">{data.topCollaborator.performanceGrowth} so tháng trước</span>
        </div>
      </div>
    </div>
  );
}