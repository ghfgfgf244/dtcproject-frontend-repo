// src/app/(manager)/enrollment-manager/reports/_components/ReportClientView/index.tsx
"use client";

import React, { useState } from 'react';
import { Calendar, SlidersHorizontal, Download } from 'lucide-react';
import { ReportKPIs, CollaboratorLeaderboard } from '@/types/report';

import KPIStats from '../KPIStats';
import { LeaderboardTable } from '../ReportTable';

interface Props {
  kpis: ReportKPIs;
  leaderboard: CollaboratorLeaderboard[];
}

export default function ReportClientView({ kpis, leaderboard}: Props) {
  // Demo State cho filter thời gian
  const [dateRange, setDateRange] = useState('01/01/2024 - 30/06/2024');

  return (
    <div className="space-y-8 relative pb-20">
      
      {/* Header & Date Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Thống kê & Báo cáo</h1>
          <p className="text-slate-500 font-medium text-sm mt-2">Tổng hợp dữ liệu tuyển sinh và hiệu suất cộng tác viên.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 px-4 rounded-xl shadow-sm">
          <Calendar className="text-slate-400 w-5 h-5" />
          <span className="text-sm font-medium text-slate-600">{dateRange}</span>
          <button className="ml-2 text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 1: KPI Cards */}
      <KPIStats data={kpis} />

      {/* Row 2: Charts (MOCKUP SVGs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h4 className="text-lg font-bold text-slate-900">So sánh đăng ký mới</h4>
              <p className="text-xs text-slate-500">Thống kê theo từng tháng năm 2024 vs 2023</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-600 rounded-full"></span><span className="text-xs font-medium">2024</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-slate-200 rounded-full"></span><span className="text-xs font-medium">2023</span></div>
            </div>
          </div>
          {/* React Chuẩn hóa SVG */}
          <div className="w-full h-64 flex items-end justify-between px-2">
            <svg className="w-full h-full" viewBox="0 0 800 200">
              <polyline fill="none" points="0,180 80,160 160,170 240,140 320,150 400,120 480,130 560,100 640,110 720,80 800,90" stroke="#e2e8f0" strokeWidth="2" />
              <polyline fill="none" points="0,160 80,140 160,120 240,90 320,70 400,100 480,60 560,40 640,50 720,20 800,30" stroke="#258cf4" strokeWidth="4" />
              <g className="text-[10px] font-bold fill-slate-400">
                <text x="0" y="200">Tháng 1</text><text x="160" y="200">Tháng 2</text>
                <text x="320" y="200">Tháng 3</text><text x="480" y="200">Tháng 4</text>
                <text x="640" y="200">Tháng 5</text><text x="750" y="200">Tháng 6</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-between">
          <div className="w-full text-left mb-6">
            <h4 className="text-lg font-bold text-slate-900">Lý do Rút/Bảo lưu</h4>
            <p className="text-xs text-slate-500">Phân tích hồ sơ không hoàn thành</p>
          </div>
          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#f1f5f9" strokeWidth="4" />
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#258cf4" strokeDasharray="65 100" strokeDashoffset="0" strokeWidth="4" />
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#7c3aed" strokeDasharray="25 100" strokeDashoffset="-65" strokeWidth="4" />
              <circle cx="18" cy="18" fill="transparent" r="16" stroke="#ef4444" strokeDasharray="10 100" strokeDashoffset="-90" strokeWidth="4" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900">100%</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">Tổng lượng</span>
            </div>
          </div>
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-600 rounded-full"></span><span className="text-xs font-medium text-slate-600">Chuyển công tác</span></div>
              <span className="text-xs font-bold text-slate-900">65%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-purple-600 rounded-full"></span><span className="text-xs font-medium text-slate-600">Cá nhân/Gia đình</span></div>
              <span className="text-xs font-bold text-slate-900">25%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span><span className="text-xs font-medium text-slate-600">Lý do khác</span></div>
              <span className="text-xs font-bold text-slate-900">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Tables */}
      <div className="grid grid-cols-1 gap-8">
        <LeaderboardTable data={leaderboard} />
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => alert("Đang xuất báo cáo...")}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-600/30 flex items-center justify-center hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all z-50"
      >
        <Download className="w-6 h-6" />
      </button>

    </div>
  );
}