export const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    Active: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-transparent",
    Draft: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    Inactive: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-transparent",
  };

  const dots: Record<string, string> = {
    Active: "bg-emerald-500",
    Draft: "bg-slate-400",
    Inactive: "bg-rose-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      <span className={`size-1.5 rounded-full ${dots[status]}`}></span>
      {status}
    </span>
  );
};