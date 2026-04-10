import React from "react";
import styles from "./table.module.css";
import { Edit, Ban, CheckCircle, Trash2 } from "lucide-react";
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
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Giảng viên</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Liên hệ</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Vai trò</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Trạng thái</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {instructors.map((ins) => (
              <tr key={ins.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-blue-50 text-blue-700 flex items-center justify-center font-black">
                      {ins.avatar ? <img src={ins.avatar} alt={ins.name} className="w-full h-full object-cover" /> : ins.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{ins.name}</div>
                      <div className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">Mã GV: {ins.code}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">{ins.email}</div>
                  <div className="text-xs text-slate-400">{ins.phone || "-"}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                    Giảng viên
                  </span>
                </td>
                <td className="px-6 py-4">
                  {ins.status === "Active" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Tạm nghỉ
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditClick(ins)}
                      className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-md transition-colors"
                      title="Chỉnh sửa hồ sơ"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

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
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  Không tìm thấy giảng viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Hiển thị {instructors.length} giảng viên</p>
      </div>
    </div>
  );
}
