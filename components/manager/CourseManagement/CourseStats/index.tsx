"use client";

import React from "react";
import { Ban, Layers, Zap } from "lucide-react";

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
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Tổng số khóa học",
      value: stats.total,
      icon: Layers,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Đang hoạt động",
      value: stats.active,
      icon: Zap,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      label: "Tạm dừng",
      value: stats.suspended,
      icon: Ban,
      bgColor: "bg-red-50",
      textColor: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-2 flex items-start justify-between">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              {item.label}
            </p>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bgColor} ${item.textColor}`}
            >
              <item.icon className="h-5 w-5" />
            </div>
          </div>

          <h3 className="text-3xl font-black text-slate-900">
            {String(item.value).padStart(2, "0")}
          </h3>
        </div>
      ))}
    </div>
  );
}
