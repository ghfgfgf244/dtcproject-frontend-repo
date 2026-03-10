export const ConflictAlert = () => (
  <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border-l-4 border-amber-500 rounded-xl shadow-sm">
    <div className="flex items-start gap-4">
      <div className="size-10 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shrink-0">
        <span className="material-symbols-outlined">warning</span>
      </div>
      <div>
        <p className="font-bold text-slate-900 dark:text-slate-100">
          Schedule Conflict
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          There is a scheduling overlap in Room 302 for the upcoming 'Advanced
          Driving&apos; class.
        </p>
      </div>
    </div>
    <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors ml-14 sm:ml-0">
      Resolve Now
    </button>
  </div>
);
