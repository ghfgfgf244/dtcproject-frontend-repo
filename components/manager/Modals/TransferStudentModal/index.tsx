"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, X } from "lucide-react";
import styles from "@/components/manager/Modals/modal.module.css";
import { ClassDto, ClassStudent } from "@/services/classService";

interface Props {
  isOpen: boolean;
  student: ClassStudent | null;
  targetClasses: ClassDto[];
  currentClassName?: string;
  classTypeLabel?: string;
  onClose: () => void;
  onSubmit: (targetClassId: string) => Promise<void> | void;
}

function getClassTypeLabel(classType?: string) {
  if (classType === "Theory") return "Lý thuyết";
  if (classType === "Practice") return "Thực hành";
  return classType || "N/A";
}

export default function TransferStudentModal({
  isOpen,
  student,
  targetClasses,
  currentClassName,
  classTypeLabel,
  onClose,
  onSubmit,
}: Props) {
  const [targetClassId, setTargetClassId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTargetClassId("");
      setIsSubmitting(false);
      return;
    }

    setTargetClassId(targetClasses[0]?.id ?? "");
  }, [isOpen, targetClasses]);

  const selectedClass = useMemo(
    () => targetClasses.find((item) => item.id === targetClassId) ?? null,
    [targetClassId, targetClasses],
  );

  if (!isOpen || !student) return null;

  const handleSubmit = async () => {
    if (!targetClassId) return;

    setIsSubmitting(true);
    try {
      await onSubmit(targetClassId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />

      <div
        className={`${styles.modalContainer} flex max-h-[85vh] max-w-2xl flex-col`}
      >
        <div className="shrink-0 border-b border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900">
                Chuyển học viên sang lớp khác
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Chỉ chuyển trong cùng khóa học, cùng kỳ học và cùng loại lớp{" "}
                {classTypeLabel?.toLowerCase() || ""}.
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-5 overflow-y-auto bg-white px-6 py-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Học viên
            </div>
            <div className="mt-2 text-base font-bold text-slate-900">
              {student.fullName}
            </div>
            <div className="mt-1 text-sm text-slate-500">
              {student.email} · {student.phone || "N/A"}
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            <div className="font-bold">Lớp hiện tại</div>
            <div className="mt-1">
              {currentClassName || "N/A"} / {classTypeLabel || "Cùng loại"}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Lớp đích
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              value={targetClassId}
              onChange={(event) => setTargetClassId(event.target.value)}
            >
              {targetClasses.length === 0 ? (
                <option value="">Không có lớp cùng loại phù hợp để chuyển</option>
              ) : (
                targetClasses.map((targetClass) => (
                  <option key={targetClass.id} value={targetClass.id}>
                    {targetClass.className} · {targetClass.currentStudents}/
                    {targetClass.maxStudents} học viên
                  </option>
                ))
              )}
            </select>
          </div>

          {selectedClass ? (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700">
              <div className="flex items-center gap-2 font-bold text-blue-700">
                <ArrowRightLeft className="h-4 w-4" />
                Thông tin lớp đích
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div>
                  <span className="text-slate-400">Khóa học:</span>{" "}
                  {selectedClass.courseName || "N/A"}
                </div>
                <div>
                  <span className="text-slate-400">Kỳ học:</span>{" "}
                  {selectedClass.termName || "N/A"}
                </div>
                <div>
                  <span className="text-slate-400">Loại lớp:</span>{" "}
                  {getClassTypeLabel(selectedClass.classType)}
                </div>
                <div>
                  <span className="text-slate-400">Giáo viên:</span>{" "}
                  {selectedClass.instructorName || "Chưa phân công"}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
              Hiện tại không có lớp đích nào cùng loại để chuyển. Hãy tạo thêm
              lớp {classTypeLabel?.toLowerCase() || ""} hoặc kiểm tra lại trạng
              thái lớp trong cùng kỳ học.
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-white px-6 py-5">
          <button
            onClick={onClose}
            className="rounded-lg px-5 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-100 active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={!targetClassId || targetClasses.length === 0 || isSubmitting}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Đang chuyển..." : "Xác nhận chuyển lớp"}
          </button>
        </div>
      </div>
    </div>
  );
}
