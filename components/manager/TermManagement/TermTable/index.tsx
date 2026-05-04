import React from "react";
import {
  CalendarCheck,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  History,
  PenSquare,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";
import { TermRecord } from "@/types/term";

interface Props {
  terms: TermRecord[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (term: TermRecord) => void;
  onDelete: (term: TermRecord) => void;
  onToggleStatus: (term: TermRecord) => void;
}

export default function TermTable({
  terms,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
}: Props) {
  const getCourseIcon = (isActive: boolean) =>
    isActive ? <CalendarCheck className="h-4 w-4" /> : <History className="h-4 w-4" />;

  if (terms.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <CalendarClock className="mb-4 h-10 w-10 text-slate-300" />
          <h3 className="text-base font-black text-slate-700">Không có khóa học phù hợp</h3>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Không tìm thấy học kỳ nào theo hệ đào tạo bạn đã chọn.
          </p>
        </div>
      </div>
    );
  }

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Thông tin học kỳ
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Khóa học áp dụng
              </th>
              <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                Tuyển sinh
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {terms.map((term) => {
              const enrollmentPercent =
                term.maxStudents > 0
                  ? Math.min(100, Math.round((term.currentStudents / term.maxStudents) * 100))
                  : 0;

              return (
                <tr key={term.id} className="group transition-colors hover:bg-slate-50">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{term.name}</span>
                      <div className="mt-1 flex items-center gap-2 text-slate-400">
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {term.startDate}
                        </span>
                        <span className="text-[10px] text-slate-200">|</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          {term.endDate}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        {getCourseIcon(term.isActive)}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{term.courseName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                        <span>{term.currentStudents}</span>
                        <span className="font-medium text-slate-300">/</span>
                        <span className="text-slate-400">{term.maxStudents}</span>
                      </div>
                      <div className="h-1.5 w-24 overflow-hidden rounded-full border border-slate-200/50 bg-slate-100">
                        <div
                          className={`h-full transition-all duration-500 ${
                            enrollmentPercent >= 90 ? "bg-amber-500" : "bg-blue-600"
                          }`}
                          style={{ width: `${enrollmentPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {term.isActive ? (
                      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Đang hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600">
                        Đã tạm dừng
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => onToggleStatus(term)}
                        title={term.isActive ? "Tạm dừng" : "Kích hoạt"}
                        className={`rounded p-1.5 transition-colors ${
                          term.isActive
                            ? "text-amber-500 hover:bg-amber-50"
                            : "text-emerald-500 hover:bg-emerald-50"
                        }`}
                      >
                        {term.isActive ? (
                          <PowerOff className="h-5 w-5" />
                        ) : (
                          <Power className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => onEdit(term)}
                        className="rounded p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        <PenSquare className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(term)}
                        className="rounded p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
          Hiển thị {startItem}-{endItem} trên tổng số {totalItems} học kỳ
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="rounded border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            {currentPage}/{Math.max(totalPages, 1)}
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages || 1, currentPage + 1))}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
