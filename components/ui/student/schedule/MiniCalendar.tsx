export function MiniCalendar() {
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <h3 className="font-bold">October 2023</h3>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
      <div className="grid grid-cols-7 text-center mb-2">
        {days.map((d) => (
          <span
            key={d}
            className="text-[11px] font-bold text-slate-400 uppercase"
          >
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
          <div
            key={d}
            className={`aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors ${d === 24 ? "bg-primary text-white font-bold" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}
