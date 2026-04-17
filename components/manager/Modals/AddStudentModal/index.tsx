"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import styles from "@/components/manager/Modals/modal.module.css";
import { StudentOption } from "@/types/class-detail";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  availableStudents: StudentOption[];
  classTypeLabel?: string;
  courseName?: string;
  termName?: string;
  onSubmit: (selectedStudentIds: string[]) => void;
}

function getFallbackInitial(name: string) {
  return (name.trim()[0] || "U").toUpperCase();
}

export default function AddStudentModal({
  isOpen,
  onClose,
  availableStudents,
  classTypeLabel,
  courseName,
  termName,
  onSubmit,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedIds(new Set());
    }
  }, [isOpen]);

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return availableStudents.filter((student) => {
      if (!query) return true;

      return (
        student.fullName.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        (student.phone || "").toLowerCase().includes(query)
      );
    });
  }, [availableStudents, searchQuery]);

  if (!isOpen) return null;

  const handleToggleStudent = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }

    setSelectedIds(next);
  };

  const handleToggleAll = () => {
    const allFilteredSelected =
      filteredStudents.length > 0 &&
      filteredStudents.every((student) => selectedIds.has(student.id));

    if (allFilteredSelected) {
      const next = new Set(selectedIds);
      filteredStudents.forEach((student) => next.delete(student.id));
      setSelectedIds(next);
      return;
    }

    const next = new Set(selectedIds);
    filteredStudents.forEach((student) => next.add(student.id));
    setSelectedIds(next);
  };

  const handleSubmit = () => {
    onSubmit(Array.from(selectedIds));
    setSearchQuery("");
    setSelectedIds(new Set());
  };

  const handleCancel = () => {
    setSearchQuery("");
    setSelectedIds(new Set());
    onClose();
  };

  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((student) => selectedIds.has(student.id));

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={handleCancel} />

      <div
        className={`${styles.modalContainer} flex max-h-[85vh] max-w-3xl flex-col`}
      >
        <div className="shrink-0 border-b border-slate-100 bg-white px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900">
                Tìm và thêm học viên
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Chỉ hiển thị học viên chưa có lớp{" "}
                {classTypeLabel?.toLowerCase() || "cùng loại"} trong cùng kỳ học.
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="flex h-8 w-8 items-center justify-center rounded text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="shrink-0 border-b border-slate-100 bg-slate-50 p-6">
          <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs font-medium text-blue-800">
            {(courseName || "Khóa học") +
              " / " +
              (termName || "Kỳ học") +
              " / " +
              (classTypeLabel || "Lớp hiện tại")}
          </div>

          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              className="w-full rounded-lg border-none bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm outline-none ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600"
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
              <tr>
                <th className="w-12 py-3 pl-6 pr-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded-sm border-slate-300 text-blue-600 focus:ring-blue-600"
                    checked={allFilteredSelected}
                    onChange={handleToggleAll}
                  />
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Học viên
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Liên hệ
                </th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Khóa học liên quan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const isSelected = selectedIds.has(student.id);

                return (
                  <tr
                    key={student.id}
                    onClick={() => handleToggleStudent(student.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-blue-50/50" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="py-3 pl-6 pr-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer rounded-sm border-slate-300 text-blue-600 focus:ring-blue-600"
                        checked={isSelected}
                        onChange={() => handleToggleStudent(student.id)}
                        onClick={(event) => event.stopPropagation()}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={student.fullName}
                            className="h-9 w-9 rounded-full bg-slate-100 object-cover ring-1 ring-slate-200"
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                            {getFallbackInitial(student.fullName)}
                          </div>
                        )}
                        <div className="text-sm font-bold leading-tight text-slate-900">
                          {student.fullName}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[11px] font-medium text-slate-600">
                        {student.email}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {student.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-wrap gap-1">
                        {student.enrolledCourses.length > 0 ? (
                          student.enrolledCourses.map((course) => (
                            <span
                              key={`${student.id}-${course}`}
                              className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"
                            >
                              {course}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">
                            Chưa có thông tin khóa học
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sm text-slate-500">
                    {availableStudents.length === 0
                      ? `Không còn học viên phù hợp để thêm vào lớp ${
                          classTypeLabel?.toLowerCase() || ""
                        } này.`
                      : "Không tìm thấy học viên nào phù hợp với từ khóa tìm kiếm."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-white px-6 py-5">
          <span className="text-xs font-medium text-slate-500">
            Đã chọn <span className="font-bold text-blue-600">{selectedIds.size}</span>{" "}
            học viên
          </span>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="rounded-lg px-5 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-100 active:scale-95"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedIds.size === 0}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Thêm vào lớp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
