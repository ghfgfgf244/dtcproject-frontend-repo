"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Users, X } from "lucide-react";
import { ExamBatch, ExamBatchScopeType } from "@/types/exam";
import { TermRecord } from "@/types/term";
import { TermRegistrationCandidate } from "@/types/registration";

interface Props {
  isOpen: boolean;
  batches: ExamBatch[];
  terms: TermRecord[];
  candidates: TermRegistrationCandidate[];
  loadingCandidates: boolean;
  defaultBatchId: string;
  onClose: () => void;
  onSelectionChange: (termId: string, examBatchId: string) => void;
  onSubmit: (studentIds: string[], examBatchId: string) => Promise<void>;
}

export default function BulkRegistrationModal({
  isOpen,
  batches,
  terms,
  candidates,
  loadingCandidates,
  defaultBatchId,
  onClose,
  onSelectionChange,
  onSubmit,
}: Props) {
  const [selectedBatchId, setSelectedBatchId] = useState(defaultBatchId);
  const [selectedTermId, setSelectedTermId] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedBatchId(defaultBatchId);
    setSelectedTermId("");
    setSelectedStudentIds([]);
  }, [defaultBatchId, isOpen]);

  useEffect(() => {
    if (!isOpen || !selectedBatchId || !selectedTermId) return;
    onSelectionChange(selectedTermId, selectedBatchId);
  }, [isOpen, onSelectionChange, selectedBatchId, selectedTermId]);

  const availableCandidates = useMemo(
    () => candidates.filter((candidate) => !candidate.alreadyRegistered),
    [candidates],
  );

  useEffect(() => {
    setSelectedStudentIds([]);
  }, [candidates]);

  if (!isOpen) return null;

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((current) =>
      current.includes(studentId)
        ? current.filter((id) => id !== studentId)
        : [...current, studentId],
    );
  };

  const toggleAll = () => {
    if (selectedStudentIds.length === availableCandidates.length) {
      setSelectedStudentIds([]);
      return;
    }

    setSelectedStudentIds(availableCandidates.map((candidate) => candidate.studentId));
  };

  const handleSubmit = async () => {
    if (!selectedBatchId || selectedStudentIds.length === 0) return;
    setSubmitting(true);
    try {
      await onSubmit(selectedStudentIds, selectedBatchId);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="flex max-h-[calc(100vh-48px)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Đăng ký hàng loạt</h2>
            <p className="mt-1 text-sm text-slate-500">
              Chọn đợt thi và một kỳ học để lấy danh sách học viên đăng ký thi hàng loạt.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Đợt thi
              </label>
              <select
                value={selectedBatchId}
                onChange={(event) => setSelectedBatchId(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-500"
              >
                <option value="">-- Chọn đợt thi --</option>
                {batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    [{batch.scopeType === ExamBatchScopeType.National ? "Quốc gia" : "Trung tâm"}]{" "}
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Kỳ học
              </label>
              <select
                value={selectedTermId}
                onChange={(event) => setSelectedTermId(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none transition focus:border-blue-500"
              >
                <option value="">-- Chọn kỳ học --</option>
                {terms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.name} - {term.courseName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Hệ thống sẽ tạo đăng ký ở trạng thái <strong>Chờ duyệt</strong> và mặc định{" "}
            <strong>chưa nộp lệ phí</strong>.
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[56px_1.2fr_1fr_120px_120px_120px] border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              <div>
                <input
                  type="checkbox"
                  checked={
                    availableCandidates.length > 0 &&
                    selectedStudentIds.length === availableCandidates.length
                  }
                  onChange={toggleAll}
                  className="h-4 w-4"
                />
              </div>
              <div>Học viên</div>
              <div>Liên hệ</div>
              <div className="text-center">Hiện diện</div>
              <div className="text-center">Tỷ lệ</div>
              <div className="text-center">Trạng thái</div>
            </div>
            <div className="max-h-[380px] overflow-y-auto">
              {loadingCandidates ? (
                <div className="flex items-center justify-center gap-3 px-4 py-16 text-sm text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang tải học viên theo kỳ...
                </div>
              ) : !selectedTermId || !selectedBatchId ? (
                <div className="px-4 py-16 text-center text-sm text-slate-500">
                  Chọn đợt thi và kỳ học để xem danh sách học viên.
                </div>
              ) : candidates.length === 0 ? (
                <div className="px-4 py-16 text-center text-sm text-slate-500">
                  Không có học viên nào trong kỳ học này.
                </div>
              ) : (
                candidates.map((candidate) => {
                  const disabled = candidate.alreadyRegistered;
                  return (
                    <label
                      key={candidate.studentId}
                      className={`grid grid-cols-[56px_1.2fr_1fr_120px_120px_120px] items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0 ${
                        disabled ? "bg-slate-50 text-slate-400" : "hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(candidate.studentId)}
                        onChange={() => toggleStudent(candidate.studentId)}
                        disabled={disabled}
                        className="h-4 w-4"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{candidate.studentName}</p>
                        <p className="text-xs text-slate-500">{candidate.courseName}</p>
                      </div>
                      <div className="text-slate-600">
                        <p>{candidate.email || "-"}</p>
                        <p className="text-xs">{candidate.phone || "-"}</p>
                      </div>
                      <div className="text-center text-slate-700">
                        {candidate.presentCount}/{candidate.totalSessions}
                      </div>
                      <div className="text-center font-semibold text-slate-800">
                        {candidate.attendanceRate.toFixed(0)}%
                      </div>
                      <div className="text-center">
                        {candidate.alreadyRegistered ? (
                          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                            Đã đăng ký
                          </span>
                        ) : candidate.isEligibleForApproval ? (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                            Đủ điều kiện
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                            Chưa đủ 80%
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users className="h-4 w-4" />
            Đã chọn {selectedStudentIds.length} học viên
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedBatchId || selectedStudentIds.length === 0 || submitting}
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? "Đang đăng ký..." : "Tạo đăng ký hàng loạt"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
