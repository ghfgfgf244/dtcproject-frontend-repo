import { ProgressCircle } from "@/components/ui/shared/ProgressCircle";

export default function StudentDashboard() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Headline */}
      <div>
        <h2 className="text-[#111418] dark:text-white tracking-tight text-3xl font-bold leading-tight">
          Welcome back, Alex! 👋
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          You are making great progress. Only 4 more lessons until your final
          exam.
        </p>
      </div>

      {/* Next Class Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer Widget */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2a3b4c] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10 h-full">
            <div className="flex flex-col justify-between h-full w-full">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary text-xs font-bold uppercase tracking-wide mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Up Next
                </div>
                <h3 className="text-2xl font-bold text-[#111418] dark:text-white mb-1">
                  Parallel Parking & Highway Merging
                </h3>
                <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-[18px]">
                    location_on
                  </span>
                  Training Ground B, Zone 4
                </p>
              </div>
              <div className="mt-8">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider text-center md:text-left">
                  Starts In
                </p>
                <div className="flex gap-3 md:gap-4 justify-center md:justify-start">
                  <TimeBox value="02" label="Days" />
                  <TimeBox value="14" label="Hours" />
                  <div className="text-2xl font-bold text-gray-300 dark:text-gray-600 mt-4">
                    :
                  </div>
                  <TimeBox value="30" label="Mins" />
                </div>
              </div>
            </div>
            {/* Map Action */}
            <div className="hidden md:flex flex-col gap-3 min-w-[200px]">
              <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden relative shadow-md">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400")',
                  }}
                ></div>
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="bg-white dark:bg-[#1a2632] p-2 rounded-full shadow-lg text-primary">
                    <span className="material-symbols-outlined">near_me</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-2.5 px-4 bg-primary hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">
                  directions
                </span>
                Get Directions
              </button>
            </div>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2a3b4c] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#111418] dark:text-white">
              Progress
            </h3>
            <button className="text-primary text-sm font-medium hover:underline">
              Details
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 h-full">
            <ProgressCircle
              percentage={85}
              label="85%"
              subLabel="Theory"
              colorClass="text-primary"
            />
            <ProgressCircle
              percentage={60}
              label="12/20"
              subLabel="Hours"
              colorClass="text-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Study Path & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Study Path */}
        <div className="lg:col-span-3 bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#2a3b4c]">
          <h3 className="text-lg font-bold text-[#111418] dark:text-white mb-6">
            Study Path
          </h3>
          <div className="relative">
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 dark:bg-gray-700 -z-10 rounded-full"></div>
            <div className="absolute top-5 left-0 w-1/2 h-1 bg-gradient-to-r from-emerald-500 to-primary -z-10 rounded-full"></div>
            <div className="flex justify-between items-start w-full">
              <PathStep
                icon="check"
                label="Orientation"
                status="Completed"
                state="completed"
              />
              <PathStep
                icon="check"
                label="Theory Exam"
                status="Passed"
                state="completed"
              />
              <PathStep
                icon="directions_car"
                label="Practical"
                status="In Progress"
                state="current"
              />
              <PathStep
                icon="lock"
                label="Mock Test"
                status="Locked"
                state="locked"
              />
              <PathStep
                icon="flag"
                label="Final Exam"
                status="Locked"
                state="locked"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 shadow-lg text-white flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[100px]">
                assignment
              </span>
            </div>
            <div className="flex justify-between items-start z-10">
              <span className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <span className="material-symbols-outlined text-white">
                  quiz
                </span>
              </span>
            </div>
            <div className="z-10 mt-4">
              <h4 className="font-bold text-lg leading-tight">Mock Exam</h4>
              <p className="text-xs text-white/80 mt-1">Test your knowledge</p>
            </div>
          </div>
          <div className="flex-1 bg-surface-light dark:bg-surface-dark border border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-5 flex flex-col justify-center items-center text-center cursor-pointer hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group">
            <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">
                confirmation_number
              </span>
            </div>
            <h4 className="font-bold text-[#111418] dark:text-white text-sm">
              Referral Code
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Invite friends & earn
            </p>
          </div>
        </div>
      </div>

      <footer className="max-w-6xl mx-auto mt-12 py-6 border-t border-gray-100 dark:border-gray-800 text-center">
        <p className="text-sm text-gray-400 dark:text-gray-600">
          © 2024 DriveSafe Academy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// Sub-components nội bộ cho trang Dashboard giúp code gọn hơn
function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-[#f0f2f5] dark:bg-[#253341] text-[#111418] dark:text-white text-2xl md:text-3xl font-bold shadow-inner">
        {value}
      </div>
      <span className="text-xs font-medium text-gray-500">{label}</span>
    </div>
  );
}

function PathStep({
  icon,
  label,
  status,
  state,
}: {
  icon: string;
  label: string;
  status: string;
  state: "completed" | "current" | "locked";
}) {
  const styles = {
    completed: {
      bg: "bg-emerald-500 text-white",
      text: "text-[#111418] dark:text-white",
      sub: "text-emerald-500",
      shadow: "",
      iconClass: "",
    },
    current: {
      bg: "bg-primary text-white shadow-blue-500/30 shadow-lg",
      text: "text-primary",
      sub: "text-primary",
      iconClass: "animate-spin-slow",
    },
    locked: {
      bg: "bg-gray-200 dark:bg-gray-700 text-gray-500",
      text: "text-[#111418] dark:text-white",
      sub: "text-gray-400",
      wrapper: "opacity-50",
    },
  }[state];

  return (
    <div
      className={`flex flex-col items-center gap-2 group cursor-pointer ${state === "locked" ? "opacity-50" : ""}`}
    >
      <div
        className={`size-10 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-[#1a2632] ${styles.bg}`}
      >
        <span
          className={`material-symbols-outlined text-[20px] ${styles.iconClass || ""}`}
        >
          {icon}
        </span>
      </div>
      <p className={`text-sm font-bold ${styles.text}`}>{label}</p>
      <p className={`text-xs font-medium ${styles.sub}`}>{status}</p>
    </div>
  );
}
