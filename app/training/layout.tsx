// app/(training)/layout.tsx
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Lexend } from "next/font/google";

// Sử dụng font Lexend theo thiết kế của bạn
const lexend = Lexend({ subsets: ["latin"], display: "swap" });

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { icon: "dashboard", label: "Dashboard", href: "/training" },
    {
      icon: "menu_book",
      label: "Course Management",
      href: "/training/courses",
      active: true,
    },
    {
      icon: "calendar_month",
      label: "Class & Schedule",
      href: "/training/classes",
    },
    { icon: "assignment", label: "Exam Management", href: "/training/exams" },
    {
      icon: "group",
      label: "Instructor Management",
      href: "/training/instructors",
    },
  ];

  return (
    <div
      className={`flex h-screen overflow-hidden bg-background-light dark:bg-slate-950 antialiased text-slate-900 dark:text-slate-100 ${lexend.className}`}
    >
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined">search_hands_free</span>
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">DriveSafe</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Training Manager Portal
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span
                className={`text-sm ${item.active ? "font-semibold" : "font-medium"}`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Alex Thompson</p>
              <p className="text-xs text-slate-500 truncate">Senior Admin</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">
              settings
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none z-0"></div>

        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-10 shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold hidden md:block">
              Course Management
            </h2>
            <div className="relative w-full max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                search
              </span>
              <input
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                placeholder="Search courses..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            </button>
            <button className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-lg">add</span>
              <span className="hidden sm:inline">Create New Course</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 z-0">{children}</div>
      </main>
    </div>
  );
}
