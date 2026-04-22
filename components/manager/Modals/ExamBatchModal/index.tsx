"use client";

import React from "react";
import { X, CalendarCheck, Info } from "lucide-react";
import styles from "@/components/manager/Modals/modal.module.css";
import { ExamBatch, ExamBatchScopeType } from "@/types/exam";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ExamBatch | null;
  onSubmit: (data: Partial<ExamBatch>) => void;
}

function toDateTimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (input: number) => input.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function ExamBatchModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  if (!isOpen) return null;

  const isEditing = Boolean(initialData?.id);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const batchData: Partial<ExamBatch> = {
      ...(isEditing && initialData?.id ? { id: initialData.id } : {}),
      scopeType: initialData?.scopeType ?? ExamBatchScopeType.Center,
      centerId: initialData?.centerId ?? undefined,
      centerName: initialData?.centerName ?? undefined,
      batchName: String(formData.get("batchName") || ""),
      status: Number(formData.get("status")) as ExamBatch["status"],
      registrationStartDate: String(formData.get("registrationStartDate") || ""),
      registrationEndDate: String(formData.get("registrationEndDate") || ""),
      examStartDate: String(formData.get("examStartDate") || ""),
      maxCandidates: Number(formData.get("maxCandidates")) || 0,
      currentCandidates: initialData?.currentCandidates || 0,
    };

    onSubmit(batchData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={`${styles.modalContainer} ${styles.modalMax2Xl}`}>
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-8 py-6">
          <div>
            <h3 className="text-lg font-black tracking-tight text-slate-900">
              {isEditing ? "Chỉnh sửa đợt thi" : "Tạo đợt thi mới"}
            </h3>
            <p className="text-xs text-slate-500">
              Thiết lập phạm vi tổ chức và thời gian đăng ký cho đợt thi.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className={styles.modalBody}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Tên đợt thi <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="batchName"
                    type="text"
                    defaultValue={initialData?.batchName}
                    className="w-full rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600"
                    placeholder="VD: Kỳ thi sát hạch tháng 06/2026"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Trạng thái ban đầu <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    name="status"
                    defaultValue={initialData?.status || 1}
                    className="w-full cursor-pointer rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value={1}>Chờ duyệt</option>
                    <option value={2}>Đang mở đăng ký</option>
                    <option value={3}>Đã đóng đăng ký</option>
                    <option value={4}>Đang diễn ra</option>
                    <option value={5}>Đã kết thúc</option>
                    <option value={6}>Đã hủy</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Số ứng viên tối đa <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="maxCandidates"
                    type="number"
                    min="1"
                    defaultValue={initialData?.maxCandidates || 100}
                    className="w-full rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="md:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  {initialData?.scopeType === ExamBatchScopeType.National ? (
                    <span>Phạm vi đợt thi: Quốc gia.</span>
                  ) : (
                    <span>
                      Phạm vi đợt thi:{" "}
                      {initialData?.centerName
                        ? `Trung tâm ${initialData.centerName}.`
                        : "Trung tâm hiện tại của tài khoản quản lý."}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <div className="rounded-lg border border-blue-100/50 bg-blue-50/50 p-4">
                  <h4 className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-blue-600">
                    <CalendarCheck className="h-4 w-4" /> Thời gian đăng ký
                  </h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-slate-500">
                        Ngày bắt đầu <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="registrationStartDate"
                        type="datetime-local"
                        defaultValue={toDateTimeLocal(initialData?.registrationStartDate)}
                        className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold text-slate-500">
                        Ngày kết thúc <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        name="registrationEndDate"
                        type="datetime-local"
                        defaultValue={toDateTimeLocal(initialData?.registrationEndDate)}
                        className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Thời gian thi dự kiến <span className="text-red-500">*</span>
                    </label>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                      Quy tắc xác thực bật
                    </span>
                  </div>
                  <input
                    required
                    name="examStartDate"
                    type="datetime-local"
                    defaultValue={toDateTimeLocal(initialData?.examStartDate)}
                    className="w-full rounded-lg bg-slate-100 px-4 py-3 text-sm font-medium outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="mt-2 flex items-center text-[11px] font-medium text-amber-600">
                    <Info className="mr-1 h-3.5 w-3.5" /> Ngày thi dự kiến phải sau ngày kết thúc đăng ký.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 rounded-b-xl border-t border-slate-100 bg-slate-50 px-8 py-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-6 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-10 py-2.5 text-sm font-black text-white shadow-lg transition-all hover:bg-blue-700 active:scale-95"
            >
              Lưu đợt thi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
