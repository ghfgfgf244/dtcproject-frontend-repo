// src/app/(manager)/training-manager/exams/_components/ExamCardList/index.tsx
import React from "react";
import styles from "./list.module.css";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { Exam } from "@/types/exam";

interface Props {
  batchName: string | undefined;
  exams: Exam[];
  onAddClick: () => void;
  onEditClick: (exam: Exam) => void;
  onDeleteClick: (exam: Exam) => void;
  selectedLicenseType: string;
  onLicenseFilterChange: (type: string) => void;
}

export default function ExamCardList({
  batchName,
  exams,
  onAddClick,
  onEditClick,
  onDeleteClick,
  selectedLicenseType,
  onLicenseFilterChange,
}: Props) {
  const licenseTypes = ['A1', 'A', 'B1', 'B2', 'C', 'D', 'E', 'F']; 

  return (
    <section className={styles.listWrapper}>
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          Bài thi của {batchName || "Đợt thi đã chọn"}
        </h3>
        <div className="flex items-center gap-4">
          <select 
            value={selectedLicenseType}
            onChange={(e) => onLicenseFilterChange(e.target.value)}
            className="text-[11px] font-bold bg-slate-100 border-none rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
          >
            <option value="all">TẤT CẢ HẠNG</option>
            {licenseTypes.map(lt => <option key={lt} value={lt}>HẠNG {lt}</option>)}
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
          <p className="text-sm text-slate-500 italic col-span-full">
            Chưa có kỳ thi nào được lên lịch cho đợt này.
          </p>
        ) : (
          exams.map((exam) => (
            <div
              key={exam.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-3 hover:shadow-sm transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">
                    ID: {exam.id}
                  </p>
                  <h4 className="text-sm font-bold text-slate-900">
                    {exam.examName}
                  </h4>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      exam.examType === 'Theory' ? 'bg-indigo-100 text-indigo-700' :
                      exam.examType === 'Practice' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {exam.examType === 'Theory' ? 'LÝ THUYẾT' :
                     exam.examType === 'Practice' ? 'THỰC HÀNH' :
                     exam.examType === 'Simulation' ? 'MÔ PHỎNG' : exam.examType}
                  </span>
                  {exam.licenseType && (
                    <span className="px-2 py-0.5 text-[10px] font-black rounded bg-slate-200 text-slate-700">
                      HẠNG {exam.licenseType}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />{" "}
                  {exam.examDate}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />{" "}
                  {exam.durationMinutes} Phút
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => onEditClick(exam)}
                  className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded shadow-sm hover:bg-slate-50 transition-colors"
                >
                  Chỉnh sửa
                </button>
                {/* <button className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded shadow-sm hover:bg-slate-50 transition-colors">
                  Đề thi
                </button> */}
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
    </section>
  );
}
