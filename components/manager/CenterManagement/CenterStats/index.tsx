// src/app/(admin)/centers/_components/CenterStats/index.tsx
import React from 'react';
import { Building2, Zap, Ban, TrendingUp, CheckCircle, Info } from 'lucide-react';
import { CenterStatsData } from '@/types/center';

export default function CenterStats({ data }: { data: CenterStatsData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* KPI 1 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">Tổng số trung tâm</p>
          <h3 className="text-3xl font-black text-slate-900">{data.total}</h3>
          <div className="flex items-center mt-2 text-emerald-600 text-[10px] font-bold">
            <TrendingUp className="w-3 h-3 mr-1" /> +12% tháng này
          </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <Building2 className="w-6 h-6" />
        </div>
      </div>
      
      {/* KPI 2 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">Đang hoạt động</p>
          <h3 className="text-3xl font-black text-slate-900">{data.active}</h3>
          <div className="flex items-center mt-2 text-slate-400 text-[10px] font-bold">
            <CheckCircle className="w-3 h-3 mr-1" /> 90.4% hiệu suất
          </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
          <Zap className="w-6 h-6" />
        </div>
      </div>
      
      {/* KPI 3 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-1">Tạm dừng</p>
          <h3 className="text-3xl font-black text-slate-900">{String(data.suspended).padStart(2, '0')}</h3>
          <div className="flex items-center mt-2 text-red-500 text-[10px] font-bold">
            <Info className="w-3 h-3 mr-1" /> Cần kiểm tra lại
          </div>
        </div>
        <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
          <Ban className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}