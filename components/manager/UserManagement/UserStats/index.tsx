"use client";

import React from "react";
import { Users, ShieldCheck, GraduationCap, Handshake, UsersRound } from "lucide-react";
import { UserStats as UserStatsType } from "@/services/userService";

interface UserStatsProps {
  stats: UserStatsType | null;
  loading: boolean;
}

export default function UserStats({ stats, loading }: UserStatsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl border border-slate-200"></div>
        ))}
      </div>
    );
  }

  const items = [
    {
      label: "Tổng người dùng",
      value: stats.totalUsers,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Nhân viên (QL)",
      value: stats.staffCount,
      icon: ShieldCheck,
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Giáo viên",
      value: stats.instructorCount,
      icon: GraduationCap,
      color: "emerald",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      label: "Cộng tác viên",
      value: stats.collaboratorCount,
      icon: Handshake,
      color: "orange",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      label: "Học viên",
      value: stats.studentCount,
      icon: UsersRound,
      color: "indigo",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">{item.label}</p>
            <div className={`w-9 h-9 rounded-lg ${item.bgColor} flex items-center justify-center ${item.textColor}`}>
              <item.icon className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{item.value.toLocaleString()}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
