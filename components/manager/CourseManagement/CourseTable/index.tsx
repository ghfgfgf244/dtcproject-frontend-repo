"use client";

import React from "react";
import { Eye, Loader2, PenSquare, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { Course } from "@/types/course";

interface CourseTableProps {
  data: Course[];
  loading: boolean;
  startIndex?: number;
  onToggleStatus: (course: Course) => void;
  onViewDetail: (course: Course) => void;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export default function CourseTable({
  data,
  loading,
  startIndex = 0,
  onToggleStatus,
  onViewDetail,
  onEdit,
  onDelete,
}: CourseTableProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20">
        <Loader2 className="mb-3 h-10 w-10 animate-spin text-blue-500" />
        <p className="text-sm font-medium text-slate-500">Đang tải danh sách khóa học...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-20">
        <p className="text-sm font-medium text-slate-500">Không tìm thấy khóa học nào.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead className="border-b border-slate-100 bg-[#fcfdfe]">
          <tr>
            <th className="px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-400">
              STT
            </th>
            <th className="px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-400">
              Tên khóa đào tạo
            </th>
            <th className="px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-400">
              Cơ sở
            </th>
            <th className="px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-400">
              Hạng bằng
            </th>
            <th className="px-6 py-5 text-right text-[11px] font-black uppercase tracking-wider text-slate-400">
              Giá tiền (VND)
            </th>
            <th className="px-6 py-5 text-center text-[11px] font-black uppercase tracking-wider text-slate-400">
              Học viên tối đa
            </th>
            <th className="px-6 py-5 text-center text-[11px] font-black uppercase tracking-wider text-slate-400">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-wider text-slate-400">
              Thao tác
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100/60">
          {data.map((course, index) => (
            <tr key={course.id} className="group transition-all hover:bg-blue-50/20">
              <td className="whitespace-nowrap px-6 py-5 text-sm font-bold text-slate-300">
                {String(startIndex + index + 1).padStart(2, "0")}
              </td>

              <td className="px-6 py-5">
                <span className="text-sm font-black uppercase leading-tight tracking-tight text-slate-800 transition-colors group-hover:text-blue-600">
                  {course.courseName}
                </span>
              </td>

              <td className="px-6 py-5">
                <span className="text-xs font-bold text-slate-500">
                  {course.centerName || "Chưa xác định"}
                </span>
              </td>

              <td className="px-6 py-5">
                <span className="inline-flex items-center rounded-lg border border-slate-200/50 bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-600">
                  {course.licenseType}
                </span>
              </td>

              <td className="px-6 py-5 text-right">
                <span className="tabular-nums text-sm font-black text-slate-900">
                  {course.price.toLocaleString("vi-VN")}
                </span>
              </td>

              <td className="px-6 py-5 text-center text-sm font-bold tabular-nums text-slate-600">
                {course.maxStudents}
              </td>

              <td className="px-6 py-5 text-center">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                    course.isActive
                      ? "border-emerald-100/50 bg-emerald-50 text-emerald-600"
                      : "border-amber-100/50 bg-amber-50 text-amber-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      course.isActive ? "bg-emerald-500" : "bg-amber-500"
                    } animate-pulse`}
                  />
                  {course.isActive ? "Hoạt động" : "Tạm dừng"}
                </div>
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onViewDetail(course)}
                    className="rounded-lg bg-slate-100 p-2 text-slate-500 shadow-sm transition-all hover:bg-blue-600 hover:text-white"
                    title="Chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onEdit(course)}
                    className="rounded-lg bg-slate-100 p-2 text-slate-500 shadow-sm transition-all hover:bg-indigo-600 hover:text-white"
                    title="Chỉnh sửa"
                  >
                    <PenSquare className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onToggleStatus(course)}
                    className={`rounded-lg border p-2 shadow-sm transition-all ${
                      course.isActive
                        ? "border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white"
                        : "border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                    }`}
                    title={course.isActive ? "Tạm dừng" : "Kích hoạt"}
                  >
                    {course.isActive ? (
                      <ToggleRight className="h-4 w-4" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onDelete(course)}
                    className="rounded-lg border border-red-100 bg-red-50 p-2 text-red-500 shadow-sm transition-all hover:bg-red-600 hover:text-white"
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
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
