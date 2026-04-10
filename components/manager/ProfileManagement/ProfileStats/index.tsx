// src/app/(manager)/enrollment-manager/profiles/_components/ProfileStats/index.tsx
import React from 'react';
import { GraduationCap, Handshake, Clock, Banknote } from 'lucide-react';
import { ProfileStatsData } from '@/types/profile';

export default function ProfileStats({ data }: { data: ProfileStatsData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><GraduationCap className="w-6 h-6" /></div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Tổng Học viên</p>
          <h3 className="text-2xl font-black text-slate-900">{new Intl.NumberFormat('vi-VN').format(data.totalStudents)}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Handshake className="w-6 h-6" /></div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+5%</span>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Cộng tác viên</p>
          <h3 className="text-2xl font-black text-slate-900">{data.totalCollaborators}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Clock className="w-6 h-6" /></div>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Đang Chờ duyệt</p>
          <h3 className="text-2xl font-black text-slate-900">{data.pendingApprovals}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Banknote className="w-6 h-6" /></div>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Hoa hồng tháng</p>
          <h3 className="text-2xl font-black text-slate-900">{data.monthlyCommission}</h3>
        </div>
      </div>
    </div>
  );
}