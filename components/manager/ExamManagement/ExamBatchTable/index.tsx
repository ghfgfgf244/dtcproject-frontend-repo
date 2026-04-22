import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import styles from "./table.module.css";
import { ExamBatch, ExamBatchScopeType } from "@/types/exam";

interface Props {
  batches: ExamBatch[];
  selectedId: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onSelect: (id: string) => void;
  onEditClick: (batch: ExamBatch) => void;
  onDeleteClick: (batch: ExamBatch) => void;
}

export default function ExamBatchTable({
  batches,
  selectedId,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onSelect,
  onEditClick,
  onDeleteClick,
}: Props) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={styles.tableWrapper}>
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <h3 className="font-bold text-slate-900">Danh sách đợt thi</h3>
      </div>

      <div className="overflow-x-auto">
        <table className={styles.tableLayout}>
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4 font-bold">Thông tin đợt thi</th>
              <th className="px-6 py-4 font-bold">Số lượng ứng viên</th>
              <th className="px-6 py-4 font-bold">Trạng thái</th>
              <th className="px-6 py-4 text-right font-bold">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {batches.map((batch) => (
              <tr
                key={batch.id}
                onClick={() => onSelect(batch.id)}
                className={`group cursor-pointer transition-colors ${
                  selectedId === batch.id ? "bg-blue-50" : "hover:bg-slate-50"
                }`}
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-slate-900">{batch.batchName}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        batch.scopeType === ExamBatchScopeType.National
                          ? "bg-violet-100 text-violet-700"
                          : "bg-sky-100 text-sky-700"
                      }`}
                    >
                      {batch.scopeType === ExamBatchScopeType.National ? "QUỐC GIA" : "TRUNG TÂM"}
                    </span>
                    <span className="text-xs text-slate-500">
                      {batch.scopeType === ExamBatchScopeType.National
                        ? "Áp dụng toàn hệ thống"
                        : batch.centerName || "Theo trung tâm hiện tại"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span className="text-blue-600">{batch.currentCandidates}</span>
                    <span className="text-slate-400">/ {batch.maxCandidates}</span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      batch.status === 2 || batch.status === 4
                        ? "bg-emerald-100 text-emerald-700"
                        : batch.status === 1
                          ? "bg-blue-100 text-blue-700"
                          : batch.status === 5
                            ? "bg-slate-100 text-slate-600"
                            : batch.status === 3
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                    }`}
                  >
                    {batch.status === 1
                      ? "CHỜ DUYỆT"
                      : batch.status === 2
                        ? "ĐANG MỞ ĐĂNG KÝ"
                        : batch.status === 3
                          ? "ĐÃ ĐÓNG ĐĂNG KÝ"
                          : batch.status === 4
                            ? "ĐANG DIỄN RA"
                            : batch.status === 5
                              ? "ĐÃ KẾT THÚC"
                              : batch.status === 6
                                ? "ĐÃ HỦY"
                                : batch.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  {batch.scopeType === ExamBatchScopeType.National ? (
                    <span className="text-xs font-semibold text-slate-400">Chỉ xem</span>
                  ) : (
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onEditClick(batch);
                        }}
                        className="rounded p-1.5 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
                        title="Chỉnh sửa đợt thi"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteClick(batch);
                        }}
                        className="rounded p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Xóa đợt thi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {batches.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">
                  Chưa có đợt thi nào được tạo.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
        <p className="text-xs font-medium text-slate-500">
          {totalItems === 0
            ? "Không có đợt thi nào"
            : `Hiển thị ${startItem}-${endItem} trên tổng ${totalItems} đợt thi`}
        </p>

        {totalPages > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trước
            </button>
            <div className="rounded-full bg-blue-600 px-4 py-2 text-xs font-black text-white">
              {currentPage}/{totalPages}
            </div>
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
