import React from "react";
import styles from "./table.module.css";
import { Edit, Ban, CheckCircle, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Instructor } from "@/types/instructor";

interface Props {
  instructors: Instructor[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEditClick: (instructor: Instructor) => void;
  onDeleteClick: (ins: Instructor) => void;
  onToggleStatusClick: (ins: Instructor) => void;
}

export default function InstructorTable({
  instructors,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEditClick,
  onDeleteClick,
  onToggleStatusClick,
}: Props) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={styles.tableWrapper}>
      <div className="overflow-x-auto">
        <table className={styles.tableLayout}>
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Giảng viên
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Liên hệ
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Vai trò
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {instructors.map((ins) => (
              <tr key={ins.id} className="group transition-colors hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-blue-50 font-black text-blue-700">
                      {ins.avatar ? (
                        <img src={ins.avatar} alt={ins.name} className="h-full w-full object-cover" />
                      ) : (
                        ins.name.slice(0, 1).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{ins.name}</div>
                      <div className="text-[11px] font-medium uppercase tracking-tighter text-slate-400">
                        Mã GV: {ins.code}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">{ins.email}</div>
                  <div className="text-xs text-slate-400">{ins.phone || "-"}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                    Giảng viên
                  </span>
                </td>
                <td className="px-6 py-4">
                  {ins.status === "Active" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Tạm nghỉ
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => onEditClick(ins)}
                      className="rounded-md p-1.5 text-amber-600 transition-colors hover:bg-amber-50"
                      title="Chỉnh sửa hồ sơ"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    {ins.status === "Active" ? (
                      <button
                        onClick={() => onToggleStatusClick(ins)}
                        className="rounded-md p-1.5 text-orange-500 transition-colors hover:bg-orange-50"
                        title="Vô hiệu hóa"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleStatusClick(ins)}
                        className="rounded-md p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50"
                        title="Kích hoạt"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteClick(ins)}
                      className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Xóa giảng viên"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {instructors.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  Không tìm thấy giảng viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          {totalItems === 0
            ? "Không có dữ liệu"
            : `Hiển thị ${startItem} - ${endItem} trên tổng ${totalItems} giảng viên`}
        </p>

        {totalPages > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white">
              {currentPage}/{totalPages}
            </div>
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
