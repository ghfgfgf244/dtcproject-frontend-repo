// src/app/(manager)/training-manager/dashboard/_components/DashboardClientView/index.tsx
"use client";

import React from 'react';
import { BookOpen, Users, GraduationCap, Verified, TrendingUp, TrendingDown, ChevronRight, Star, MoreVertical } from 'lucide-react';
import { DashboardData } from '@/types/dashboard';

interface Props {
  data: DashboardData;
}

export default function DashboardClientView({ data }: Props) {


  // Hàm render Icon cho thẻ KPI
  const renderKpiIcon = (iconType: string) => {
    switch (iconType) {
      case 'courses': return <BookOpen className="w-6 h-6" />;
      case 'classes': return <Users className="w-6 h-6" />;
      case 'students': return <GraduationCap className="w-6 h-6" />;
      case 'passRate': return <Verified className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const getKpiColor = (iconType: string) => {
    switch (iconType) {
      case 'courses': return 'bg-blue-100 text-blue-600';
      case 'classes': return 'bg-amber-100 text-amber-600';
      case 'students': return 'bg-purple-100 text-purple-600';
      case 'passRate': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Rảnh rỗi': return 'bg-emerald-100 text-emerald-700';
      case 'Đang dạy': return 'bg-blue-100 text-blue-700';
      case 'Nghỉ phép': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Tổng quan Đào tạo</h2>
          <p className="text-slate-500 mt-1">Theo dõi các chỉ số quan trọng, lịch thi và trạng thái giảng viên.</p>
        </div>
      </div>

      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.kpis.map((kpi, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${getKpiColor(kpi.icon)}`}>
                {renderKpiIcon(kpi.icon)}
              </div>
              <div className={`text-xs font-bold flex items-center gap-1 px-2.5 py-1 rounded-full ${kpi.trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {kpi.trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{kpi.title}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* 2. Middle Row: Chart & Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Biểu đồ Ghi danh */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-black text-lg text-slate-900">Xu hướng Ghi danh</h4>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer">
              <option>6 Tháng qua</option>
              <option>Từ đầu năm</option>
            </select>
          </div>
          <div className="h-64 flex flex-col gap-4">
            <div className="flex-1 w-full relative">
              {/* SVG Chart Placeholder - Chuyển sang màu Xanh Dương đồng bộ */}
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 150">
                <path d="M0,130 C50,120 80,140 120,80 C160,20 200,60 250,40 C300,20 350,70 400,50 L400,150 L0,150 Z" fill="rgba(37, 99, 235, 0.1)"></path>
                <path d="M0,130 C50,120 80,140 120,80 C160,20 200,60 250,40 C300,20 350,70 400,50" fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="3"></path>
              </svg>
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-bold px-2 uppercase tracking-widest">
              <span>T1</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span>
            </div>
          </div>
        </div>

        {/* Lịch thi sắp tới */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h4 className="font-black text-lg text-slate-900 mb-6">Lịch thi sắp tới</h4>
          <div className="space-y-4 flex-1">
            {data.upcomingExams.map(exam => (
              <div key={exam.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-xl text-center min-w-[55px] shrink-0">
                  <span className="block text-[10px] uppercase font-bold tracking-widest">{exam.month}</span>
                  <span className="block text-xl font-black leading-none mt-1">{exam.date}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{exam.title}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-1">{exam.candidatesCount} Thí sinh • {exam.time}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-sm font-bold text-blue-600 py-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
            Xem toàn bộ Lịch thi
          </button>
        </div>
      </div>

      {/* 3. Bottom Row: Instructor Status (Mở rộng tràn màn hình) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100">
          <h4 className="font-black text-lg text-slate-900">Trạng thái Giảng viên hiện tại</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 md:px-8 py-4">Giảng viên</th>
                <th className="px-6 md:px-8 py-4">Trạng thái</th>
                <th className="px-6 md:px-8 py-4">Khối lượng công việc</th>
                <th className="px-6 md:px-8 py-4">Đánh giá</th>
                <th className="px-6 md:px-8 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.instructors.map(ins => (
                <tr key={ins.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 md:px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <img className="w-full h-full object-cover" src={ins.avatarUrl} alt={ins.name} />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{ins.name}</span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(ins.status)}`}>
                      {ins.status}
                    </span>
                  </td>
                  <td className="px-6 md:px-8 py-4">
                    <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${ins.currentLoad}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-1.5 block uppercase tracking-widest">Hiệu suất {ins.currentLoad}%</span>
                  </td>
                  <td className="px-6 md:px-8 py-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-bold text-slate-900">{ins.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 md:px-8 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}