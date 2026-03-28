import React from "react";
import styles from "./table.module.css";
import {
  Calendar,
  Edit,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { Instructor } from "@/types/instructor";

interface Props {
  instructors: Instructor[];
  onEditClick: (instructor: Instructor) => void;
  onDeleteClick: (ins: Instructor) => void;
  onToggleStatusClick: (ins: Instructor) => void;
}

export default function InstructorTable({ instructors, onEditClick, onDeleteClick, onToggleStatusClick }: Props) {
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
                Hạng bằng
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Lớp học
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {instructors.map((ins) => (
              <tr
                key={ins.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <img
                        src={ins.avatar}
                        alt={ins.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{ins.name}</div>
                      <div className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">
                        Mã GV: {ins.code}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">{ins.email}</div>
                  <div className="text-xs text-slate-400">{ins.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {ins.licenses.map((lic) => (
                      <span
                        key={lic}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full border border-blue-100"
                      >
                        {lic}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-700">
                    {ins.classesWeekly} Lớp/Tuần
                  </div>
                </td>
                <td className="px-6 py-4">
                  {ins.status === "Active" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>{" "}
                      Tạm nghỉ
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
                      title="Xem lịch dạy"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onEditClick(ins)}
                      className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-md transition-colors"
                      title="Chỉnh sửa hồ sơ"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* LOGIC ĐỔI TRẠNG THÁI */}
                    {ins.status === "Active" ? (
                      <button
                        onClick={() => onToggleStatusClick(ins)}
                        className="p-1.5 hover:bg-orange-50 text-orange-500 rounded-md transition-colors"
                        title="Vô hiệu hóa"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleStatusClick(ins)}
                        className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-md transition-colors"
                        title="Kích hoạt"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}

                    {/* NÚT XÓA MỚI THÊM */}
                    <button
                      onClick={() => onDeleteClick(ins)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                      title="Xóa giảng viên"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {instructors.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-sm text-slate-500"
                >
                  Không tìm thấy giảng viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          Hiển thị {instructors.length} Giảng viên
        </p>
        <div className="flex gap-2">
          <button className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-500 hover:bg-slate-50 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white border border-blue-600 rounded font-bold text-xs">
            1
          </button>
          <button className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-500 hover:bg-slate-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
