// src/app/(manager)/training-manager/mock-exams/_components/MockExamStats/index.tsx
import React from 'react';
import { BookOpen, TrendingUp, Car, Truck } from 'lucide-react';
import { MockExamStats } from '@/types/mock-exam';

export default function MockExamStatsCards({ data }: { data: MockExamStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden relative group">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Tổng số bộ đề</span>
          <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-3xl font-black text-slate-900 tracking-tighter">{data.totalExams}</span>
          <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {data.growth} so với tháng trước
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Hạng B1 (Tự động)</span>
          <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center text-slate-600">
            {/* Sử dụng Car icon chung, có thể tìm icon cụ thể hơn nếu muốn */}
            <Car className="w-5 h-5 opacity-70" /> 
          </div>
        </div>
        <div>
          <span className="text-3xl font-black text-slate-900 tracking-tighter">{data.b1Count}</span>
          <p className="text-[11px] text-slate-400 font-medium mt-1">Đang hoạt động</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Hạng B2 (Chuyên nghiệp)</span>
          <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600">
            <Car className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-3xl font-black text-slate-900 tracking-tighter">{data.b2Count}</span>
          <p className="text-[11px] text-slate-400 font-medium mt-1">Nhu cầu cao nhất</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Hạng C (Xe tải)</span>
          <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center text-slate-600">
            <Truck className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-3xl font-black text-slate-900 tracking-tighter">{data.cCount}</span>
          <p className="text-[11px] text-slate-400 font-medium mt-1">Yêu cầu ôn luyện kỹ</p>
        </div>
      </div>
    </div>
  );
}