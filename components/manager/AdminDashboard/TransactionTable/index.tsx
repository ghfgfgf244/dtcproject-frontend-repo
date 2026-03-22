// src/app/(admin)/admin/finance/_components/TransactionTable/index.tsx
import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Transaction } from '@/types/finance';
import styles from './table.module.css'; // Nếu bạn muốn bọc table.module.css

interface Props {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: Props) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 marker-bg-emerald-500';
      case 'Pending': return 'bg-orange-100 text-orange-700 marker-bg-orange-500';
      case 'Refunded': return 'bg-red-100 text-red-700 marker-bg-red-500';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const translateStatus = (status: string) => {
    if (status === 'Completed') return 'Hoàn thành';
    if (status === 'Pending') return 'Đang chờ';
    if (status === 'Refunded') return 'Đã hoàn tiền';
    return status;
  };

  return (
    <div className="flex flex-col rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-slate-900 text-lg font-black leading-tight">Giao dịch gần đây</h3>
        <button className="text-blue-600 text-sm font-bold hover:underline">Xem tất cả</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Tên học viên</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Hạng bằng</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Ngày</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Số tiền</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">Trạng thái</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((txn) => {
              const style = getStatusStyle(txn.status);
              return (
                <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src={txn.avatar} alt={txn.studentName} className="h-8 w-8 rounded-full bg-slate-200" />
                      <span className="text-sm font-bold text-slate-900">{txn.studentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-600">{txn.licenseType}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-500">{txn.date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-black text-slate-900">
                      {txn.amount.toLocaleString('vi-VN')} ₫
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${style.split(' marker-')[0]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.split('marker-')[1]}`}></span>
                      {translateStatus(txn.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50 transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}