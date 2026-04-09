"use client";

import { useMemo, useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";
import styles from "@/components/manager/Modals/modal.module.css";
import { TermRecord } from "@/types/term";
import { ClassType } from "@/types/class";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  terms: TermRecord[];
  onConfirm: (payload: { termId: string; classType: ClassType }) => Promise<void>;
}

export default function AutoAssignModal({ isOpen, onClose, terms, onConfirm }: Props) {
  const [selectedTerm, setSelectedTerm] = useState("");
  const [classType, setClassType] = useState<ClassType>("Theory");
  const [isLoading, setIsLoading] = useState(false);

  const activeTerms = useMemo(() => terms.filter((term) => term.isActive), [terms]);

  if (!isOpen) return null;

  const handleRun = async () => {
    if (!selectedTerm) return;
    setIsLoading(true);

    try {
      await onConfirm({ termId: selectedTerm, classType });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={!isLoading ? onClose : undefined} />

      <div className={`${styles.modalContainer} max-w-md`}>
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-base font-black text-slate-900">Xep lop tu dong</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <p className="text-sm leading-relaxed text-slate-600">
            He thong se lay hoc vien da duoc duyet trong ky hoc da chon, chia lop theo suc chua trung tam va tu dong them hoc vien vao tung lop.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">Ky hoc</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600"
              value={selectedTerm}
              onChange={(event) => setSelectedTerm(event.target.value)}
              disabled={isLoading}
            >
              <option value="">Chon ky hoc</option>
              {activeTerms.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.name} - {term.courseName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">Loai lop hoc</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-600"
              value={classType}
              onChange={(event) => setClassType(event.target.value as ClassType)}
              disabled={isLoading}
            >
              <option value="Theory">Ly thuyet</option>
              <option value="Practice">Thuc hanh</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 disabled:opacity-50"
          >
            Huy bo
          </button>
          <button
            onClick={handleRun}
            disabled={!selectedTerm || isLoading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Dang xu ly
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Chay xep lop
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
