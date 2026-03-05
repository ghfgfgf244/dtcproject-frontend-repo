import { ClassScheduleDTO } from "@/types/schedule";

export function SessionCard({ session }: { session: ClassScheduleDTO }) {
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const styles = {
    Theory: {
      border: "border-primary",
      badge: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
      icon: "menu_book",
    },
    Practice: {
      border: "border-emerald-500",
      badge:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
      icon: "directions_car",
    },
    Simulator: {
      border: "border-amber-500",
      badge:
        "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
      icon: "monitor",
    },
    Exam: {
      border: "border-red-500",
      badge: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
      icon: "assignment",
    },
  }[session.category];

  return (
    <div
      className={`group bg-white dark:bg-slate-900 border-l-4 ${styles.border} rounded-xl p-5 shadow-sm border-y border-r border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-all hover:shadow-md`}
    >
      <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl p-3 min-w-[100px]">
        <span className="text-xs font-bold text-slate-400 uppercase">
          {formatTime(session.startTime)}
        </span>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 my-1"></div>
        <span className="text-xs font-bold text-slate-400 uppercase">
          {formatTime(session.endTime)}
        </span>
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <span
            className={`${styles.badge} text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider`}
          >
            {session.category}
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {session.className}
          </h3>
        </div>
        <div className="flex flex-wrap gap-4 text-slate-500 dark:text-slate-400 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">
              location_on
            </span>
            {session.location}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">
              {styles.icon}
            </span>
            {session.equipment || session.instructorName}
          </div>
        </div>
      </div>
      <button className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-sm font-bold rounded-lg hover:bg-primary hover:text-white transition-all">
        Details
      </button>
    </div>
  );
}
