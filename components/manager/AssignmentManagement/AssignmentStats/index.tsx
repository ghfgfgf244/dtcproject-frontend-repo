// src/app/(manager)/training-manager/assignments/_components/AssignmentStats/index.tsx
import React from 'react';
import { ClipboardList, UserCheck, AlertTriangle, PieChart } from 'lucide-react';
import { AssignmentStatsData } from '@/types/assignment';

export default function AssignmentStats({ data }: { data: AssignmentStatsData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-lg">
            <ClipboardList className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded">CẦN XỬ LÝ</span>
        </div>
        <p className="text-3xl font-black text-slate-900">{data.pendingCount}</p>
        <p className="text-sm font-medium text-slate-500 mt-1">Lớp chưa có giảng viên</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-purple-50 text-purple-600 flex items-center justify-center rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded">KHẢ DỤNG</span>
        </div>
        <p className="text-3xl font-black text-slate-900">{data.availableInstructors}</p>
        <p className="text-sm font-medium text-slate-500 mt-1">Giảng viên đang rảnh</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-red-50 text-red-600 flex items-center justify-center rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-1 rounded">ƯU TIÊN</span>
        </div>
        <p className="text-3xl font-black text-slate-900">{String(data.urgentChanges).padStart(2, '0')}</p>
        <p className="text-sm font-medium text-slate-500 mt-1">Yêu cầu thay đổi gấp</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 -z-10"></div>
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-lg">
            <PieChart className="w-5 h-5" />
          </div>
        </div>
        <p className="text-3xl font-black text-slate-900">{data.fillRate}%</p>
        <p className="text-sm font-medium text-slate-500 mt-1">Tỷ lệ lấp đầy lịch dạy</p>
      </div>
    </div>
  );
}