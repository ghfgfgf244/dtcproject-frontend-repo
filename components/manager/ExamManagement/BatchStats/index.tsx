import React from 'react';
import styles from './stats.module.css';

interface Props {
  batchName: string | undefined;
  examCount: number;
  currentCandidates?: number;
  maxCandidates?: number;
}

export default function BatchStats({ 
  batchName, 
  examCount, 
  currentCandidates = 0, 
  maxCandidates = 1 
}: Props) {
  if (!batchName) return null;

  const progress = Math.min(100, (currentCandidates / (maxCandidates || 1)) * 100);

  return (
    <section className={styles.statsWrapper}>
      <div>
        <h3 className="font-bold text-sm mb-2 text-slate-900">Thống kê Đợt thi</h3>
        <p className="text-xs text-slate-500">
          Chỉ số tổng quan của <span className="text-blue-600 font-bold">{batchName}</span>
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-600">Tổng số đăng ký</span>
          <span className="text-sm font-bold text-slate-900">
            {currentCandidates} / {maxCandidates} ứng viên
          </span>
        </div>
        
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="pt-4 border-t border-blue-200/50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span className="text-xs text-slate-700">{examCount} kỳ thi đã xếp lịch</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            <span className="text-xs text-slate-700">Sắp đóng cổng đăng ký</span>
          </div>
        </div>
      </div>
    </section>
  );
}