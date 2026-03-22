import React from 'react';
import styles from './stats.module.css';
import { Users, CalendarCheck, Star, ShieldAlert } from 'lucide-react';
import { InstructorStatsData } from '@/types/instructor';

interface Props {
  data: InstructorStatsData;
}

export default function InstructorStats({ data }: Props) {
  return (
    <div className={styles.statsGrid}>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tổng số Giảng viên</span>
          <Users className="text-blue-500 w-5 h-5" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">{data.total}</span>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+{data.newThisMonth} tháng này</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hoạt động Hôm nay</span>
          <CalendarCheck className="text-emerald-500 w-5 h-5" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">{data.activeToday}</span>
          <span className="text-xs font-medium text-slate-500">{data.capacityPercent}% công suất</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đánh giá TB</span>
          <Star className="text-amber-500 w-5 h-5" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">{data.avgRating}</span>
          <span className="text-xs font-medium text-slate-500">/ thang 5.0</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chứng chỉ chờ duyệt</span>
          <ShieldAlert className="text-red-500 w-5 h-5" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">{data.pendingCerts}</span>
          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Cần xử lý</span>
        </div>
      </div>
    </div>
  );
}