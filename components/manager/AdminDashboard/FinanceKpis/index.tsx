// src/app/(admin)/admin/finance/_components/FinanceKpis/index.tsx
import React from 'react';
import { Wallet, Clock, UserPlus, TrendingUp, TrendingDown } from 'lucide-react';
import { FinanceKpi } from '@/types/finance';

export default function FinanceKpis({ data }: { data: FinanceKpi[] }) {
  const getIcon = (type: string) => {
    if (type === 'payments') return <Wallet className="w-6 h-6" />;
    if (type === 'pending') return <Clock className="w-6 h-6" />;
    return <UserPlus className="w-6 h-6" />;
  };

  const getColorClasses = (type: string) => {
    if (type === 'payments') return 'bg-blue-100 text-blue-600';
    if (type === 'pending') return 'bg-orange-100 text-orange-600';
    return 'bg-purple-100 text-purple-600';
  };

  const getChartColor = (type: string) => {
    if (type === 'payments') return 'text-blue-500';
    if (type === 'pending') return 'text-orange-500';
    return 'text-purple-500';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.map((kpi) => (
        <div key={kpi.id} className="flex flex-col gap-4 rounded-xl p-6 bg-white shadow-sm border border-slate-200 transition-transform hover:-translate-y-1 duration-300">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{kpi.title}</p>
              <p className="text-slate-900 text-3xl font-black tracking-tight">{kpi.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(kpi.icon)}`}>
              {getIcon(kpi.icon)}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${kpi.trendType === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {kpi.trendType === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {kpi.trendValue}
            </span>
            <span className="text-slate-400 text-sm font-medium">so với tháng trước</span>
          </div>
        </div>
      ))}
    </div>
  );
}