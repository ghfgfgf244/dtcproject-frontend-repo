import React from 'react';
import { ClassDetailData } from '@/types/class';

interface ClassInfoCardProps {
  data: ClassDetailData;
}

export const ClassInfoCard = ({ data }: ClassInfoCardProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">info</span>
        Class Information
      </h3>
      <div className="grid grid-cols-2 gap-y-8 gap-x-12">
        <div>
          <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Course Name</p>
          <p className="text-slate-900 dark:text-white font-medium">{data.courseName} (Grade {data.licenseType})</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Status</p>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Active
          </span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Start Date</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-lg">calendar_today</span>
            <p className="text-slate-900 dark:text-white font-medium">{formatDate(data.startDate)}</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">End Date</p>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400 text-lg">event_available</span>
            <p className="text-slate-900 dark:text-white font-medium">{formatDate(data.endDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};