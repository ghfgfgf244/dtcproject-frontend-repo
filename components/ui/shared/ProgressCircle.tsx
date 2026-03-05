interface ProgressCircleProps {
  percentage: number;
  label: string;
  subLabel: string;
  colorClass?: string;
}

export function ProgressCircle({
  percentage,
  label,
  subLabel,
  colorClass = "text-primary",
}: ProgressCircleProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative size-24">
        <svg
          className="size-full -rotate-90"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="text-gray-100 dark:text-gray-700"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className={colorClass}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeDasharray={`${percentage}, 100`}
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-sm font-bold text-[#111418] dark:text-white block">
            {label}
          </span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {subLabel}
      </p>
    </div>
  );
}
