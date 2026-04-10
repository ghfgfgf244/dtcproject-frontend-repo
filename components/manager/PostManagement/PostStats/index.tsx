// src/app/(manager)/enrollment-manager/posts/_components/PostStats/index.tsx
import React from 'react';
import { Eye, UserCheck, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { PostKPIs } from '@/types/post';

export default function PostStats({ data }: { data: PostKPIs }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tổng bài đăng HĐ</p>
          <h3 className="text-2xl font-black text-slate-900">{data.totalActive}</h3>
          <p className="text-emerald-600 text-[11px] font-bold flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" /> {data.activeGrowth} so với tháng trước
          </p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          <Eye className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tổng lượt đăng ký</p>
          <h3 className="text-2xl font-black text-slate-900">{new Intl.NumberFormat('vi-VN').format(data.totalRegistrations)}</h3>
          <p className="text-emerald-600 text-[11px] font-bold flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" /> {data.regGrowth} so với tháng trước
          </p>
        </div>
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
          <UserCheck className="w-5 h-5" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tỷ lệ chuyển đổi TB</p>
          <h3 className="text-2xl font-black text-slate-900">{data.avgConversion}%</h3>
          <p className="text-red-500 text-[11px] font-bold flex items-center gap-1 mt-2">
            <TrendingDown className="w-3 h-3" /> {data.conversionGrowth} so với mục tiêu
          </p>
        </div>
        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
          <BarChart2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}