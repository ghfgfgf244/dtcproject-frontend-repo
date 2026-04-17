import React from "react";
import styles from "./list.module.css";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";
import { Exam, ExamStatus, ExamType } from "@/types/exam";
import { EXAM_LEVEL_LABEL_BY_VALUE, EXAM_LEVEL_OPTIONS } from "@/constants/exam-levels";

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
}: Props) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = totalItems === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <section className={styles.listWrapper}>
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">Bài thi của {batchName || "đợt thi đã chọn"}</h3>
        <div className="flex items-center gap-4">
          <select
            value={selectedLicenseType}
            onChange={(e) => onLicenseFilterChange(e.target.value)}
            className="text-[11px] font-bold bg-slate-100 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
          >
            <option value="all">TẤT CẢ HẠNG</option>
            {EXAM_LEVEL_OPTIONS.map((lt) => (
              <option key={lt.value} value={lt.value}>
                HẠNG {lt.label}
              </option>
            ))}
          </select>
          <button
            onClick={onAddClick}
            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Thêm bài thi
          </button>
        </div>
      </div>

      <div className={styles.gridContainer}>
        {exams.length === 0 ? (
          <p className="text-sm text-slate-500 italic col-span-full">Chưa có kỳ thi nào được lên lịch cho đợt này.</p>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-3 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">ID: {exam.id}</p>
                  <h4 className="text-sm font-bold text-slate-900">{exam.examName}</h4>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      exam.examType === ExamType.Theory
                        ? "bg-indigo-100 text-indigo-700"
                        : exam.examType === ExamType.Practice
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {exam.examType === ExamType.Theory ? "Lý thuyết" : exam.examType === ExamType.Practice ? "Thực hành" : "Mô phỏng"}
                  </span>
                  {exam.licenseType && (
                    <span className="px-2 py-0.5 text-[10px] font-black rounded bg-slate-200 text-slate-700">
                      HẠNG {EXAM_LEVEL_LABEL_BY_VALUE[exam.licenseType]}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {exam.examDate}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {exam.durationMinutes} phút
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {exam.addressName || "Chưa có địa điểm"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                  <div className="text-slate-400 uppercase font-bold">Tổng điểm</div>
                  <div className="font-black text-slate-900">{exam.totalScore}</div>
                </div>
                <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                  <div className="text-slate-400 uppercase font-bold">Điểm đạt</div>
                  <div className="font-black text-slate-900">{exam.passScore}</div>
                </div>
                <div className="rounded-lg bg-white border border-slate-200 px-3 py-2">
                  <div className="text-slate-400 uppercase font-bold">Trạng thái</div>
                  <div className="font-black text-slate-900">{statusLabel[exam.status]}</div>
                </div>
              </div>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => onEditClick(exam)}
                  className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded shadow-sm hover:bg-slate-50 transition-colors"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => onDeleteClick(exam)}
                  className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded shadow-sm hover:bg-slate-50 transition-colors"
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
