import React from "react";
import { Check, ChevronLeft, ChevronRight, Wallet, X } from "lucide-react";
import { RegistrationRecord } from "@/types/registration";

interface Props {
  data: RegistrationRecord[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onTogglePayment: (record: RegistrationRecord) => void;
}

const getApprovalBadge = (status: RegistrationRecord["approvalStatus"]) => {
  switch (status) {
    case "Đã duyệt":
      return "bg-emerald-100 text-emerald-700";
    case "Từ chối":
      return "bg-red-100 text-red-700";
    case "Đã hủy":
      return "bg-slate-200 text-slate-600";
    default:
      return "bg-amber-100 text-amber-700";
  }
};

export default function RegistrationTable({
  data,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onApprove,
  onReject,
  onTogglePayment,
}: Props) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Học viên
              </th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Đợt thi
              </th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Kỳ học
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Tỷ lệ học
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Lệ phí
              </th>
              <th className="px-6 py-4 text-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((record) => {
              const canReview = record.status === 1;
              return (
                <tr key={record.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-black ${record.avatarColor}`}
                      >
                        {record.avatarInitials}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{record.studentName}</p>
                        <p className="text-xs text-slate-500">
                          {record.email || "-"} {record.phone ? `• ${record.phone}` : ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">{record.examBatch}</p>
                    <p className="text-xs text-slate-500">{record.registrationDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">{record.termName || "-"}</p>
                    <p className="text-xs text-slate-500">
                      {record.courseName || "-"}
                      {record.licenseType ? ` • ${record.licenseType}` : ""}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-black text-slate-900">
                      {(record.attendanceRate ?? 0).toFixed(0)}%
                    </p>
                    <p className="text-xs text-slate-500">
                      {record.presentCount ?? 0}/{record.totalSessions ?? 0} buổi
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={() => onTogglePayment(record)}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black transition ${
                        record.isPaid
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      <Wallet className="h-3.5 w-3.5" />
                      {record.paymentStatus}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getApprovalBadge(
                          record.approvalStatus,
                        )}`}
                      >
                        {record.approvalStatus}
                      </span>
                      <p
                        className={`text-xs font-semibold ${
                          record.isEligibleForApproval ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {record.isEligibleForApproval ? "Đủ điều kiện duyệt" : "Chưa đủ điều kiện"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {canReview ? (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onApprove(record.id)}
                          disabled={!record.isEligibleForApproval}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                          title="Duyệt đăng ký"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(record.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
                          title="Từ chối đăng ký"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-right text-xs font-bold text-slate-500">
                        {record.approvalStatus}
                      </p>
                    )}
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                  Chưa có đăng ký nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
        <p className="text-xs font-medium text-slate-500">
          {totalItems === 0
            ? "Không có dữ liệu đăng ký"
            : `Hiển thị ${startItem}-${endItem} trên tổng số ${totalItems} đăng ký`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
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
            disabled={currentPage >= totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
