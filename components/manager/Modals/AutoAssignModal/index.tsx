"use client";

import { useMemo, useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";
import styles from "@/components/manager/Modals/modal.module.css";
import { TermRecord } from "@/types/term";
import { ClassType } from "@/types/class";
import { AutoAssignExplainResponse } from "@/services/classService";

interface AutoAssignPayload {
  termId: string;
  classType: ClassType;
  preferredClassSize?: number;
  tolerancePercent?: number;
  preferredShift?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  terms: TermRecord[];
  onPreview: (payload: AutoAssignPayload) => Promise<AutoAssignExplainResponse>;
  onConfirm: (payload: AutoAssignPayload) => Promise<void>;
}

export default function AutoAssignModal({ isOpen, onClose, terms, onPreview, onConfirm }: Props) {
  const [selectedTerm, setSelectedTerm] = useState("");
  const [classType, setClassType] = useState<ClassType>("Theory");
  const [preferredClassSize, setPreferredClassSize] = useState("");
  const [tolerancePercent, setTolerancePercent] = useState("10");
  const [preferredShift, setPreferredShift] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [preview, setPreview] = useState<AutoAssignExplainResponse | null>(null);

  const activeTerms = useMemo(() => terms.filter((term) => term.isActive), [terms]);

  if (!isOpen) return null;

  const buildPayload = (): AutoAssignPayload => ({
    termId: selectedTerm,
    classType,
    preferredClassSize: preferredClassSize ? Number(preferredClassSize) : undefined,
    tolerancePercent: tolerancePercent ? Number(tolerancePercent) : undefined,
    preferredShift: preferredShift || undefined,
  });

  const handlePreview = async () => {
    if (!selectedTerm) return;
    setIsPreviewLoading(true);

    try {
      const response = await onPreview(buildPayload());
      setPreview(response);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleRun = async () => {
    if (!selectedTerm) return;
    setIsLoading(true);

    try {
      await onConfirm(buildPayload());
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={!isLoading ? onClose : undefined} />

      <div className={`${styles.modalContainer} max-w-2xl`}>
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-base font-black text-slate-900">Xếp lớp tự động thông minh</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(100vh-120px)] space-y-5 overflow-y-auto p-6">
          <p className="text-sm leading-relaxed text-slate-600">
            Hệ thống sẽ lấy học viên đã được duyệt trong kỳ học đã chọn, cân bằng sĩ số quanh mức mục tiêu, sau đó gợi ý phương án chia lớp và giảng viên trước khi bạn chạy thật.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
                Kỳ học
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600"
                value={selectedTerm}
                onChange={(event) => {
                  setSelectedTerm(event.target.value);
                  setPreview(null);
                }}
                disabled={isLoading || isPreviewLoading}
              >
                <option value="">Chọn kỳ học</option>
                {activeTerms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.name} - {term.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
                Loại lớp
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600"
                value={classType}
                onChange={(event) => {
                  setClassType(event.target.value as ClassType);
                  setPreview(null);
                }}
                disabled={isLoading || isPreviewLoading}
              >
                <option value="Theory">Lý thuyết</option>
                <option value="Practice">Thực hành</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
                Sĩ số mục tiêu
              </label>
              <input
                type="number"
                min={1}
                value={preferredClassSize}
                onChange={(event) => {
                  setPreferredClassSize(event.target.value);
                  setPreview(null);
                }}
                disabled={isLoading || isPreviewLoading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600"
                placeholder="Mặc định theo trung tâm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
                Dung sai (%)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={tolerancePercent}
                onChange={(event) => {
                  setTolerancePercent(event.target.value);
                  setPreview(null);
                }}
                disabled={isLoading || isPreviewLoading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
              Ca học ưu tiên
            </label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600"
              value={preferredShift}
              onChange={(event) => {
                setPreferredShift(event.target.value);
                setPreview(null);
              }}
              disabled={isLoading || isPreviewLoading}
            >
              <option value="">Không bắt buộc</option>
              <option value="Sáng">Sáng</option>
              <option value="Chiều">Chiều</option>
              <option value="Tối">Tối</option>
            </select>
          </div>

          {preview ? (
            <div className="space-y-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700">
                  {preview.plannedClassCount} lớp dự kiến
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">
                  {preview.eligibleStudents} học viên
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">
                  {preview.minSuggestedSize}-{preview.maxSuggestedSize} HV/lớp
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                  {preview.model || "Phân tích nội bộ"}
                </span>
              </div>

              <p className="text-sm leading-6 text-slate-700">{preview.explanation}</p>

              {preview.notes.length > 0 ? (
                <div className="space-y-1">
                  {preview.notes.map((note) => (
                    <p key={note} className="text-xs text-slate-600">
                      • {note}
                    </p>
                  ))}
                </div>
              ) : null}

              {preview.classes.length > 0 ? (
                <div className="grid gap-3">
                  {preview.classes.map((item) => (
                    <div
                      key={`${item.className}-${item.instructorId}`}
                      className="rounded-xl border border-white/70 bg-white px-4 py-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <strong className="text-sm text-slate-900">{item.className}</strong>
                        <span className="text-xs font-bold text-indigo-700">
                          {item.studentCount}/{item.suggestedMaxStudents} học viên
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        {item.classType === "Theory" ? "Lý thuyết" : "Thực hành"} · GV dự kiến:{" "}
                        {item.instructorName}
                      </p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isLoading || isPreviewLoading}
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handlePreview}
            disabled={!selectedTerm || isLoading || isPreviewLoading}
            className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-5 py-2.5 text-sm font-black text-indigo-700 transition-all hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPreviewLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Đang xem trước
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Xem trước phương án
              </>
            )}
          </button>
          <button
            onClick={handleRun}
            disabled={!selectedTerm || isLoading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Đang xử lý
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Chạy xếp lớp
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
