import React from "react";
import { Edit, EyeOff, Eye, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Center } from "@/services/centerService";

interface Props {
  data: Center[];
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (center: Center) => void;
  onToggleStatus: (center: Center) => void;
}

export default function CenterTable({
  data,
  loading,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEdit,
  onToggleStatus,
}: Props) {
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    return parts[parts.length - 1][0]?.toUpperCase() ?? "?";
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70">
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Tên Trung Tâm</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Địa Chỉ</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Liên Hệ</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Trạng Thái</th>
              <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Đang tải...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
                  Không tìm thấy trung tâm nào.
                </td>
              </tr>
            ) : (
              data.map((center) => (
                <tr key={center.id} className="hover:bg-slate-50/70 transition-colors group">
                  {/* Name + ID */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          center.isActive ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {getInitials(center.centerName)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{center.centerName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {center.createdAt
                            ? `Tạo lúc: ${new Date(center.createdAt).toLocaleDateString("vi-VN")}`
                            : `ID: ${center.id.slice(0, 8)}...`}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Address */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 max-w-[220px] line-clamp-2">{center.address}</p>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700 font-medium">{center.phone}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{center.email}</p>
                  </td>

                  {/* Status badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                        center.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {center.isActive ? "Hoạt động" : "Tạm dừng"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(center)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleStatus(center)}
                        className={`p-2 rounded-md transition-colors ${
                          center.isActive
                            ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                            : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={center.isActive ? "Tạm dừng" : "Kích hoạt"}
                      >
                        {center.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          {totalItems === 0 ? "Không có kết quả" : `Hiển thị ${startItem}–${endItem} / ${totalItems} trung tâm`}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
              if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "..." ? (
                <span key={`dot-${idx}`} className="px-1 text-slate-400 text-xs">…</span>
              ) : (
                <button
                  key={item}
                  onClick={() => onPageChange(item as number)}
                  className={`w-8 h-8 rounded-md text-xs font-bold transition-colors ${
                    currentPage === item
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {item}
                </button>
              )
            )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}