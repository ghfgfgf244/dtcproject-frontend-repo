// src/app/(manager)/training-manager/mock-exams/_components/Modals/MockExamModal/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Lock, Key, Save, Edit3 } from "lucide-react";
import styles from "@/components/manager/Modals/modal.module.css";
import { MockExamRecord, ExamDifficulty } from "@/types/mock-exam";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: MockExamRecord | null;
  onSubmit: (data: Partial<MockExamRecord>) => void;
}

// Danh sách courseCode mô phỏng để chọn khi Tạo mới
const MOCK_COURSES = ["B1-2024-03", "B2-2024-01", "B2-2024-02", "C-2024-02"];

export default function MockExamModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: Props) {
  // Dùng state riêng cho thanh trượt (slider) để UI cập nhật realtime khi kéo
  const [sliderValue, setSliderValue] = useState<number>(
    initialData?.totalQuestions || 50,
  );

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  // Sync state khi modal mở/đóng hoặc đổi data
  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);

    // Nếu Modal vừa được mở ra, lập tức reset lại thanh trượt
    if (isOpen) {
      setSliderValue(initialData?.totalQuestions || 50);
    }
  }

  if (!isOpen) return null;

  const isEditing = !!initialData?.id;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const examData: Partial<MockExamRecord> = {
      ...(isEditing ? { id: initialData.id } : {}),
      courseCode: formData.get("courseCode") as string,
      examNumber: formData.get("examNumber") as string,
      difficulty: formData.get("difficulty") as ExamDifficulty,
      totalQuestions: Number(formData.get("totalQuestions")),
      currentQuestions: initialData?.currentQuestions || 0, // Giữ nguyên số câu hiện tại nếu edit
    };

    onSubmit(examData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />

      <div className={`${styles.modalContainer} max-w-lg flex flex-col mx-4`}>
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {isEditing ? "Cập nhật Đề thi mẫu" : "Tạo Đề thi mẫu mới"}
            </h2>
            <p className="text-[12px] font-medium text-slate-400 uppercase tracking-widest mt-1">
              Hệ thống quản trị Azure Executive
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-md hover:bg-slate-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="px-8 py-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar bg-white">
            {/* Course & Exam Info Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Khóa học (Course ID)
                </label>
                <div className="relative">
                  {isEditing ? (
                    // Trạng thái Edit: Không cho sửa Khóa học (Readonly)
                    <>
                      <input
                        type="text"
                        name="courseCode"
                        value={initialData.courseCode}
                        readOnly
                        className="w-full bg-slate-100 border-none text-slate-500 text-sm py-2.5 px-3 rounded-lg focus:ring-2 focus:ring-blue-600/20 transition-all font-mono outline-none"
                      />
                      <Lock className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                    </>
                  ) : (
                    // Trạng thái Tạo mới: Cho phép chọn Khóa học
                    <select
                      required
                      name="courseCode"
                      defaultValue=""
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm py-2.5 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition-all outline-none cursor-pointer font-medium"
                    >
                      <option value="" disabled>
                        Chọn Khóa học...
                      </option>
                      {MOCK_COURSES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Số thứ tự Đề (Exam No)
                </label>
                <input
                  required
                  type="number"
                  name="examNumber"
                  min="1"
                  defaultValue={initialData?.examNumber}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm py-2.5 px-3 rounded-lg focus:ring-2 focus:ring-blue-600 transition-all font-medium outline-none"
                  placeholder="VD: 1, 2, 3..."
                />
              </div>
            </div>

            {/* Difficulty Level Selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Mức độ (Level)
              </label>
              <div className="flex gap-3">
                {(["Dễ", "Trung bình", "Khó"] as ExamDifficulty[]).map(
                  (level) => {
                    const defaultLevel =
                      initialData?.difficulty || "Trung bình";
                    return (
                      <label
                        key={level}
                        className="flex-1 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="difficulty"
                          value={level}
                          defaultChecked={defaultLevel === level}
                          className="sr-only peer"
                        />
                        <div
                          className={`flex items-center justify-center py-2.5 px-4 rounded-lg border text-sm font-medium transition-all group-hover:bg-slate-50 select-none
                        ${level === "Dễ" ? "border-slate-200 text-slate-500 peer-checked:bg-emerald-50 peer-checked:border-emerald-200 peer-checked:text-emerald-600" : ""}
                        ${level === "Trung bình" ? "border-slate-200 text-slate-500 peer-checked:bg-blue-50 peer-checked:border-blue-200 peer-checked:text-blue-600" : ""}
                        ${level === "Khó" ? "border-slate-200 text-slate-500 peer-checked:bg-rose-50 peer-checked:border-rose-200 peer-checked:text-rose-600" : ""}
                      `}
                        >
                          {level}
                        </div>
                      </label>
                    );
                  },
                )}
              </div>
            </div>

            {/* Total Questions with Slider-like UI */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Tổng số câu hỏi (Total)
                </label>
                <span className="text-sm font-black text-blue-600 px-2.5 py-0.5 bg-blue-50 rounded-md border border-blue-100">
                  {sliderValue}
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-4">
                <Edit3 className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="range"
                  name="totalQuestions"
                  min="10"
                  max="200"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 outline-none"
                />
                <input
                  type="number"
                  value={sliderValue}
                  onChange={(e) => setSliderValue(Number(e.target.value))}
                  className="w-16 bg-white border border-slate-200 text-right text-xs py-1.5 px-2 rounded-lg font-bold text-slate-700 outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Technical ID (Show UUID if editing) */}
            {isEditing && (
              <div className="pt-4 flex items-center gap-2 border-t border-slate-50">
                <Key className="w-3.5 h-3.5 text-slate-300" />
                <span className="text-[10px] text-slate-400 font-mono tracking-tight">
                  UUID: {initialData.id}
                </span>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-8 py-5 bg-slate-50 flex items-center justify-end gap-3 border-t border-slate-100 rounded-b-xl shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-all rounded-lg active:scale-95 hover:bg-slate-200"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
