"use client";

import React, { useState } from 'react';
import { Search, CalendarDays, Download } from 'lucide-react';
import { FinanceKpi, Transaction } from '@/types/finance';

import FinanceKpis from '../FinanceKpis';
import TransactionTable from '../TransactionTable';

interface Props {
  kpis: FinanceKpi[];
  transactions: Transaction[];
}

export default function FinanceClientView({ kpis, transactions }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col gap-8">
      
      {/* Search & Actions Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 text-3xl font-black leading-tight tracking-tight">Tổng quan tài chính</h1>
          <p className="text-slate-500 text-sm font-medium">Theo dõi doanh thu, các khoản thanh toán đang chờ và lịch sử giao dịch.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Tìm kiếm giao dịch..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none shadow-sm"
            />
          </div>
          <button className="hidden sm:flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
            <CalendarDays className="w-4 h-4" /> Tháng này
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-colors shrink-0">
            <Download className="w-4 h-4" /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* KPIs */}
      <FinanceKpis data={kpis} />

      {/* Revenue Chart (SVG nhúng trực tiếp) */}
      <div className="flex flex-col rounded-xl bg-white shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h3 className="text-slate-900 text-xl font-black leading-tight">Doanh thu theo hạng bằng</h3>
            <p className="text-slate-500 text-sm mt-1 font-medium">So sánh hiệu suất giữa các hạng B1, B2 và C</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span><span className="text-xs font-bold text-slate-600">Hạng B1</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500"></span><span className="text-xs font-bold text-slate-600">Hạng B2</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span><span className="text-xs font-bold text-slate-600">Hạng C</span></div>
          </div>
        </div>
        
        <div className="w-full aspect-[21/9] min-h-[300px] relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[1,2,3,4,5].map(i => <div key={i} className="border-b border-dashed border-slate-200 w-full h-px"></div>)}
          </div>
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 400">
            <path className="drop-shadow-sm" d="M0 300 C 150 280, 250 150, 400 180 S 600 250, 750 120 S 900 80, 1000 50" fill="none" stroke="#258cf4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
            <circle cx="400" cy="180" fill="#258cf4" r="6" stroke="white" strokeWidth="2"></circle>
            <circle cx="750" cy="120" fill="#258cf4" r="6" stroke="white" strokeWidth="2"></circle>
            <path className="drop-shadow-sm" d="M0 350 C 150 320, 250 250, 400 280 S 600 180, 750 220 S 900 150, 1000 100" fill="none" stroke="#a855f7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" opacity="0.7"></path>
            <path className="drop-shadow-sm" d="M0 380 C 150 360, 250 350, 400 320 S 600 350, 750 300 S 900 250, 1000 280" fill="none" stroke="#10b981" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" opacity="0.6"></path>
          </svg>
        </div>
        <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>Thg 1</span><span>Thg 2</span><span>Thg 3</span><span>Thg 4</span><span>Thg 5</span><span>Thg 6</span>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionTable transactions={transactions} />

    </div>
  );
}