import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: ReactNode;
  chartColor: string;
}

export const StatCard = ({ title, value, change, isPositive, icon, chartColor }: StatCardProps) => (
  <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-[#1a2632] shadow-sm border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1">
    <div className="flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <p className="text-slate-500 text-sm font-medium uppercase">{title}</p>
        <p className="text-slate-900 dark:text-white text-3xl font-bold">{value}</p>
      </div>
      <div className={`size-10 rounded-full flex items-center justify-center ${chartColor}`}>
        {icon}
      </div>
    </div>
    <div className="flex items-center gap-2 mt-2">
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
        {change}
      </span>
      <span className="text-slate-400 text-sm">vs last month</span>
    </div>
  </div>
);