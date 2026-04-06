"use client";

import React from "react";
import { Layers, Zap, Ban } from "lucide-react";

interface CourseStatsData {
  total: number;
  active: number;
  suspended: number;
}

interface CourseStatsProps {
  stats: CourseStatsData;
  loading: boolean;
}

export default function CourseStats({ stats, loading }: CourseStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl border border-slate-200"></div>
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Tổng số khóa học",
      value: stats.total,
      icon: Layers,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Đang hoạt động",
      value: stats.active,
      icon: Zap,
      color: "emerald",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      label: "Tạm dừng",
      value: stats.suspended,
      icon: Ban,
      color: "red",
      bgColor: "bg-red-50",
      textColor: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">{item.label}</p>
            <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center ${item.textColor}`}>
              <item.icon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">{String(item.value).padStart(2, '0')}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
