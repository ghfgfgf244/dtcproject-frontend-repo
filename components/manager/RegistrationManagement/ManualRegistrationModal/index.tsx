"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { ExamBatch } from "@/types/exam";
import { UserListItem } from "@/services/userService";

interface Props {
  isOpen: boolean;
  batches: ExamBatch[];
  students: UserListItem[];
  loadingStudents: boolean;
  defaultBatchId: string;
  onClose: () => void;
  onSubmit: (studentId: string, examBatchId: string) => Promise<void>;
}

export default function ManualRegistrationModal({
  isOpen,
  batches,
  students,
  loadingStudents,
  defaultBatchId,
  onClose,
  onSubmit,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState(defaultBatchId);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedBatchId(defaultBatchId);
    setSelectedStudentId("");
    setSearch("");
  }, [defaultBatchId, isOpen]);

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return students;
    return students.filter((student) =>
      [student.fullName, student.email, student.phone]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword)),
    );
  }, [search, students]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedStudentId || !selectedBatchId) return;
    setSubmitting(true);
    try {
      await onSubmit(selectedStudentId, selectedBatchId);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl max-h-[calc(100vh-48px)] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Đăng ký thủ công</h2>
            <p className="mt-1 text-sm text-slate-500">
              Tìm học viên trong hệ thống và gán vào một đợt thi. Mặc định trạng thái sẽ là chờ duyệt.
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
                    {batch.batchName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Tìm học viên
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Nhập tên, email hoặc số điện thoại..."
                  className="w-full border-none bg-transparent text-sm outline-none"
                />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[56px_1.4fr_1fr_1fr] border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              <div>Chọn</div>
              <div>Học viên</div>
              <div>Email</div>
              <div>Số điện thoại</div>
            </div>
            <div className="max-h-[360px] overflow-y-auto">
              {loadingStudents ? (
                <div className="flex items-center justify-center gap-3 px-4 py-16 text-sm text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang tải danh sách học viên...
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="px-4 py-16 text-center text-sm text-slate-500">
                  Không tìm thấy học viên phù hợp.
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <label
                    key={student.id}
                    className="grid cursor-pointer grid-cols-[56px_1.4fr_1fr_1fr] items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0 hover:bg-slate-50"
                  >
                    <input
                      type="radio"
                      name="manual-registration-student"
                      checked={selectedStudentId === student.id}
                      onChange={() => setSelectedStudentId(student.id)}
                      className="h-4 w-4"
                    />
                    <div className="font-semibold text-slate-900">{student.fullName}</div>
                    <div className="text-slate-600">{student.email || "-"}</div>
                    <div className="text-slate-600">{student.phone || "-"}</div>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
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
            disabled={!selectedStudentId || !selectedBatchId || submitting}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? "Đang tạo..." : "Đăng ký"}
          </button>
        </div>
      </div>
    </div>
  );
}
