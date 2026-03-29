import React from 'react';
import styles from './stats.module.css';

interface Props {
  batchName: string | undefined;
  examCount: number;
}

export default function BatchStats({ batchName, examCount }: Props) {
  if (!batchName) return null;

  return (
    <section className={styles.statsWrapper}>
      <div>
        <h3 className="font-bold text-sm mb-2 text-slate-900">Thống kê Đợt thi</h3>
        <p className="text-xs text-slate-500">Chỉ số tổng quan của <span className="text-blue-600 font-bold">{batchName}</span></p>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-600">Tổng số đăng ký</span>
          <span className="text-sm font-bold text-slate-900">142 Học viên</span> {/* Mocked cho UI */}
        </div>
        
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-[85%] rounded-full"></div>
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