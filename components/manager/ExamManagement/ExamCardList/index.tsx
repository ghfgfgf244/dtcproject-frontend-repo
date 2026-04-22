import React from "react";
import styles from "./list.module.css";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";
import { Exam, ExamStatus, ExamType } from "@/types/exam";
import {
  EXAM_LEVEL_LABEL_BY_VALUE,
  EXAM_LEVEL_OPTIONS,
} from "@/constants/exam-levels";

interface Props {
  batchName: string | undefined;
  exams: Exam[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onAddClick: () => void;
  onEditClick: (exam: Exam) => void;
  onDeleteClick: (exam: Exam) => void;
  selectedLicenseType: string;
  onLicenseFilterChange: (type: string) => void;
  canManageExams: boolean;
  readOnlyReason?: string;
}

const statusLabel: Record<ExamStatus, string> = {
  [ExamStatus.Draft]: "Bản nháp",
  [ExamStatus.Scheduled]: "Đã lên lịch",
  [ExamStatus.Finished]: "Đã kết thúc",
  [ExamStatus.Cancelled]: "Đã hủy",
};

export default function ExamCardList({
  batchName,
  exams,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onAddClick,
  onEditClick,
  onDeleteClick,
  selectedLicenseType,
  onLicenseFilterChange,
  canManageExams,
  readOnlyReason,
}: Props) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <section className={styles.listWrapper}>
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <h3 className="flex items-center gap-2 font-bold text-slate-900">
          Bài thi của {batchName || "đợt thi đã chọn"}
        </h3>
        <div className="flex items-center gap-4">
          <select
            value={selectedLicenseType}
            onChange={(event) => onLicenseFilterChange(event.target.value)}
            className="cursor-pointer rounded-lg border-none bg-slate-100 px-3 py-1.5 text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">TẤT CẢ HẠNG</option>
            {EXAM_LEVEL_OPTIONS.map((licenseType) => (
              <option key={licenseType.value} value={licenseType.value}>
                HẠNG {licenseType.label}
              </option>
            ))}
          </select>
          <button
            onClick={onAddClick}
            disabled={!canManageExams}
            className="flex items-center gap-1 rounded-lg border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300"
          >
            <Plus className="h-4 w-4" />
            Thêm bài thi
          </button>
        </div>
      </div>

      {!canManageExams && readOnlyReason ? (
        <div className="mx-6 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
          {readOnlyReason}
        </div>
      ) : null}

      <div className={styles.gridContainer}>
        {exams.length === 0 ? (
          <p className="col-span-full text-sm italic text-slate-500">
            Chưa có bài thi nào được lên lịch cho đợt này.
          </p>
        ) : (
          exams.map((exam) => (
            <div
              key={exam.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-500">ID: {exam.id}</p>
                  <h4 className="text-sm font-bold text-slate-900">{exam.examName}</h4>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      exam.examType === ExamType.Theory
                        ? "bg-indigo-100 text-indigo-700"
                        : exam.examType === ExamType.Practice
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {exam.examType === ExamType.Theory
                      ? "Lý thuyết"
                      : exam.examType === ExamType.Practice
                        ? "Thực hành"
                        : "Mô phỏng"}
                  </span>
                  {exam.licenseType ? (
                    <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-700">
                      HẠNG {EXAM_LEVEL_LABEL_BY_VALUE[exam.licenseType]}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {exam.examDate}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {exam.durationMinutes} phút
                </div>
                <div className="col-span-2 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {exam.addressName || "Chưa có địa điểm"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <div className="font-bold uppercase text-slate-400">Tổng điểm</div>
                  <div className="font-black text-slate-900">{exam.totalScore}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <div className="font-bold uppercase text-slate-400">Điểm đạt</div>
                  <div className="font-black text-slate-900">{exam.passScore}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <div className="font-bold uppercase text-slate-400">Trạng thái</div>
                  <div className="font-black text-slate-900">{statusLabel[exam.status]}</div>
                </div>
              </div>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => onEditClick(exam)}
                  disabled={!canManageExams}
                  className="flex-1 rounded border border-slate-200 bg-white py-1.5 text-[10px] font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => onDeleteClick(exam)}
                  disabled={!canManageExams}
                  className="flex-1 rounded border border-slate-200 bg-white py-1.5 text-[10px] font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
        <p className="text-xs font-medium text-slate-500">
          {totalItems === 0
            ? "Không có bài thi nào"
            : `Hiển thị ${startItem}-${endItem} trên tổng ${totalItems} bài thi`}
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
    </section>
  );
}
