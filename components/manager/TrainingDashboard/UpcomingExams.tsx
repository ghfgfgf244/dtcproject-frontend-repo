import React from "react";
import Link from "next/link";

export const UpcomingExams = () => {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h4 className="mb-6 text-lg font-bold">Các kỳ thi sắp tới</h4>

      <div className="flex-1 space-y-4">
        <div className="flex cursor-pointer items-center gap-4 rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800">
          <div className="min-w-[50px] rounded-lg bg-primary/10 p-2 text-center text-primary">
            <span className="block text-xs font-bold uppercase">Thg 10</span>
            <span className="block text-lg font-black">24</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Thi cuối kỳ lý thuyết</p>
            <p className="text-xs text-slate-500">18 thí sinh • 09:00</p>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </div>

        <div className="flex cursor-pointer items-center gap-4 rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800">
          <div className="min-w-[50px] rounded-lg bg-blue-100 p-2 text-center text-blue-600 dark:bg-blue-900/30">
            <span className="block text-xs font-bold uppercase">Thg 10</span>
            <span className="block text-lg font-black">26</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Thi thực hành lái xe</p>
            <p className="text-xs text-slate-500">12 thí sinh • 08:30</p>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </div>

        <div className="flex cursor-pointer items-center gap-4 rounded-xl bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800">
          <div className="min-w-[50px] rounded-lg bg-emerald-100 p-2 text-center text-emerald-600 dark:bg-emerald-900/30">
            <span className="block text-xs font-bold uppercase">Thg 10</span>
            <span className="block text-lg font-black">28</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Thi thực hành hạng B1</p>
            <p className="text-xs text-slate-500">5 thí sinh • 11:00</p>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </div>
      </div>

      <Link
        href="/training/exams"
        className="mt-6 block w-full rounded-lg border border-primary/20 py-2.5 text-center text-sm font-bold text-primary transition-colors hover:bg-primary/5"
      >
        Xem tất cả kỳ thi
      </Link>
    </div>
  );
};
