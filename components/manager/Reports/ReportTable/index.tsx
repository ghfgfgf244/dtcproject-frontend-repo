// src/app/(manager)/enrollment-manager/reports/_components/ReportTables/index.tsx
import React from 'react';
import { ExternalLink, MoreHorizontal } from 'lucide-react';
import { CollaboratorLeaderboard } from '@/types/report';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
};

export function LeaderboardTable({ data }: { data: CollaboratorLeaderboard[] }) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-amber-100 text-amber-700';
      case 2: return 'bg-slate-200 text-slate-600';
      case 3: return 'bg-orange-100 text-orange-700';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h4 className="text-lg font-bold text-slate-900">Bảng xếp hạng Cộng tác viên</h4>
          <p className="text-xs text-slate-500 italic">Top CTV có hiệu suất cao nhất tháng này</p>
        </div>
        <button className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline">
          Xem tất cả <ExternalLink className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hạng</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tên Cộng tác viên</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Số học viên</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Doanh thu</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hoa hồng dự kiến</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${getRankColor(item.rank)}`}>
                    {item.rank}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded object-cover bg-slate-100" />
                    <span className="text-sm font-bold text-slate-900">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-black text-slate-700">{item.students}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-600">{formatCurrency(item.revenue)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-black text-blue-600">{formatCurrency(item.estimatedCommission)}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded hover:bg-slate-100">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}