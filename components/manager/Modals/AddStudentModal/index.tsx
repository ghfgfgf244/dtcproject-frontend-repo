"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import styles from "@/components/manager/Modals/modal.module.css";
import { StudentOption } from "@/types/class-detail";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  availableStudents: StudentOption[];
  onSubmit: (selectedStudentIds: string[]) => void;
}

function getFallbackInitial(name: string) {
  return (name.trim()[0] || "U").toUpperCase();
}

export default function AddStudentModal({ isOpen, onClose, availableStudents, onSubmit }: Props) {
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
    if (filteredStudents.length > 0 && selectedIds.size === filteredStudents.length) {
      setSelectedIds(new Set());
      return;
    }

    setSelectedIds(new Set(filteredStudents.map((student) => student.id)));
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

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={handleCancel} />

      <div className={`${styles.modalContainer} max-w-3xl flex max-h-[85vh] flex-col`}>
        <div className="shrink-0 border-b border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight text-slate-900">Tim va them hoc vien</h3>
            <button
              onClick={handleCancel}
              className="flex h-8 w-8 items-center justify-center rounded text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="shrink-0 border-b border-slate-100 bg-slate-50 p-6">
          <div className="group relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              className="w-full rounded-lg border-none bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm outline-none ring-1 ring-slate-200 transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600"
              placeholder="Tim kiem theo ten, email hoac so dien thoai..."
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
                    checked={filteredStudents.length > 0 && selectedIds.size === filteredStudents.length}
                    onChange={handleToggleAll}
                  />
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Hoc vien</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Lien he</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Khoa hoc lien quan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const isSelected = selectedIds.has(student.id);

                return (
                  <tr
                    key={student.id}
                    onClick={() => handleToggleStudent(student.id)}
                    className={`cursor-pointer transition-colors ${isSelected ? "bg-blue-50/50" : "hover:bg-slate-50"}`}
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
                        <div className="text-sm font-bold leading-tight text-slate-900">{student.fullName}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[11px] font-medium text-slate-600">{student.email}</div>
                      <div className="text-[10px] text-slate-400">{student.phone || "N/A"}</div>
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
                          <span className="text-xs text-slate-400">Chua co thong tin khoa hoc</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sm text-slate-500">
                    Khong tim thay hoc vien nao phu hop.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-white px-6 py-5">
          <span className="text-xs font-medium text-slate-500">
            Da chon <span className="font-bold text-blue-600">{selectedIds.size}</span> hoc vien
          </span>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="rounded-lg px-5 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-100 active:scale-95"
            >
              Huy bo
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedIds.size === 0}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Them vao lop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
