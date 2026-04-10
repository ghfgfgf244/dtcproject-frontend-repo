// src/components/manager/LearningResource/ResourceStatsBento/index.tsx
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { ResourceStats } from '@/types/learning-resource';

interface Props {
  stats: ResourceStats;
}

export default function ResourceStatsBento({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Tổng tài liệu</span>
        <span className="text-2xl font-black text-slate-900">{stats.totalResources}</span>
        <div className="mt-2 flex items-center text-emerald-600 text-[10px] font-bold gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          {stats.growthPercentage} so với tháng trước
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Dung lượng đã dùng</span>
        <span className="text-2xl font-black text-slate-900">{stats.storageUsed}</span>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
          <div className="bg-blue-600 h-full" style={{ width: `${stats.storagePercentage}%` }}></div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Video bài giảng</span>
        <span className="text-2xl font-black text-slate-900">{stats.videoCount}</span>
        <span className="text-slate-400 text-[10px] mt-2 italic font-medium">
          {stats.videoOptimizedPercentage} đã được tối ưu
        </span>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase">Lượt tải về</span>
        <span className="text-2xl font-black text-slate-900">{stats.downloadCount}</span>
        <span className="text-slate-400 text-[10px] mt-2 italic font-medium">
          Trung bình {stats.avgDownloadsPerDay} lượt/ngày
        </span>
      </div>
    </div>
  );
}