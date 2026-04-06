"use client";

import React from "react";
import { Course } from "@/types/course";
import { Loader2, Eye, ToggleLeft, ToggleRight, Trash2, PenSquare } from "lucide-react";

interface CourseTableProps {
  data: Course[];
  loading: boolean;
  onToggleStatus: (c: Course) => void;
  onViewDetail: (c: Course) => void;
  onEdit: (c: Course) => void;
  onDelete: (c: Course) => void;
}

export default function CourseTable({ data, loading, onToggleStatus, onViewDetail, onEdit, onDelete }: CourseTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
        <p className="text-sm font-medium text-slate-500">Đang tải danh sách khóa học...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <p className="text-sm font-medium text-slate-500">Không tìm thấy khóa học nào.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[#fcfdfe] border-b border-slate-100">
          <tr>
            <th className="px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-400">STT</th>
            <th className="px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-400">Tên khóa đào tạo</th>
            <th className="px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-400">Hạng bằng</th>
            <th className="px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-400 text-right">Giá tiền (VND)</th>
            <th className="px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-400 text-center">Học viên tối đa</th>
            <th className="px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-400 text-center">Trạng thái</th>
            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-wider text-slate-400 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100/60">
          {data.map((course, idx) => (
            <tr key={course.id} className="hover:bg-blue-50/20 transition-all group">
              <td className="px-6 py-5 whitespace-nowrap text-sm font-bold text-slate-300">
                {String(idx + 1).padStart(2, "0")}
              </td>
              <td className="px-6 py-5">
                <span className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase leading-tight tracking-tight">
                  {course.courseName}
                </span>
              </td>
              <td className="px-6 py-5">
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black bg-slate-100 text-slate-600 uppercase border border-slate-200/50">
                  {course.licenseType}
                </span>
              </td>
              <td className="px-6 py-5 text-right">
                <span className="text-sm font-black text-slate-900 tabular-nums">
                  {course.price.toLocaleString("vi-VN")}
                </span>
              </td>
              <td className="px-6 py-5 text-center text-sm font-bold text-slate-600 tabular-nums">
                {course.maxStudents}
              </td>
              <td className="px-6 py-5 text-center">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  course.isActive 
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50" 
                  : "bg-amber-50 text-amber-600 border border-amber-100/50"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${course.isActive ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
                  {course.isActive ? "Hoạt động" : "Tạm dừng"}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button 
                    onClick={() => onViewDetail(course)}
                    className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    title="Chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onEdit(course)}
                    className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                    title="Chỉnh sửa"
                  >
                    <PenSquare className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onToggleStatus(course)}
                    className={`p-2 rounded-lg transition-all shadow-sm ${
                      course.isActive ? "bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white border border-amber-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100"
                    }`}
                    title={course.isActive ? "Tạm dừng" : "Kích hoạt"}
                  >
                    {course.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => onDelete(course)}
                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-600 hover:text-white border border-red-100 transition-all shadow-sm"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}