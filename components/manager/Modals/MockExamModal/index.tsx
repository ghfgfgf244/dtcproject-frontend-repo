"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Course } from "@/types/course";
import { CreateMockExamRequest } from "@/services/mockExamService";
import { EXAM_LEVEL_VALUE_BY_LABEL } from "@/constants/exam-levels";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSubmit: (data: CreateMockExamRequest) => Promise<void> | void;
}

function mapLicenseTypeToLevel(licenseType?: string): number {
  return EXAM_LEVEL_VALUE_BY_LABEL[(licenseType || "").toUpperCase()] || 4;
}

export default function MockExamModal({ isOpen, onClose, courses, onSubmit }: Props) {
  const [courseId, setCourseId] = useState("");
  const [examNo, setExamNo] = useState(1);
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [passingScore, setPassingScore] = useState(32);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCourseId("");
    setExamNo(1);
    setDurationMinutes(25);
    setPassingScore(32);
    setSubmitting(false);
  }, [isOpen]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === courseId) || null,
    [courseId, courses]
  );

  if (!isOpen) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!courseId) return;

    setSubmitting(true);
    try {
      await onSubmit({
        courseId,
        examNo,
        durationMinutes,
        passingScore,
        level: mapLicenseTypeToLevel(selectedCourse?.licenseType),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">Tạo đề thi thử mới</h2>
            <p className="mt-1 text-sm text-slate-500">
              Chọn khóa học, số đề, thời lượng và điểm đạt để tạo đề thi thử.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Khóa học</label>
            <select
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Chọn khóa học</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName} ({course.licenseType})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Số đề</label>
              <input
                type="number"
                min={1}
                value={examNo}
                onChange={(event) => setExamNo(Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Thời lượng (phút)</label>
              <input
                type="number"
                min={5}
                value={durationMinutes}
                onChange={(event) => setDurationMinutes(Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Điểm đạt</label>
              <input
                type="number"
                min={1}
                value={passingScore}
                onChange={(event) => setPassingScore(Number(event.target.value))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {selectedCourse && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm text-blue-700">
              Đề thi sẽ gắn với khóa <strong>{selectedCourse.courseName}</strong> và lấy cấp độ từ hạng bằng{" "}
              <strong>{selectedCourse.licenseType}</strong>.
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Đang tạo..." : "Tạo đề thi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
