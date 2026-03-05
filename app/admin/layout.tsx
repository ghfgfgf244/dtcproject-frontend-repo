import { ADM_MENU } from "@/constants/navigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-screen bg-background-light dark:bg-background-dark overflow-hidden font-display">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white dark:bg-[#1a2632] border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 z-20 hidden lg:flex">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="size-8 text-primary shrink-0">
            <span className="material-symbols-outlined text-3xl">
              search_hands_free
            </span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">
            DriveRight
          </h2>
        </div>

        <nav className="flex flex-col gap-1 p-4 overflow-y-auto flex-1">
          {ADM_MENU.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary dark:bg-primary/20"
                  : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${item.active ? "fill-1" : ""}`}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}

          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 dark:text-slate-400 mt-auto"
          >
            <span className="material-symbols-outlined text-[20px]">
              settings
            </span>
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <UserButton afterSignOutUrl="/" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                Admin User
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                admin@driveright.com
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-900">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-[#1a2632] border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <button className="material-symbols-outlined text-slate-500">
            menu
          </button>
          <h2 className="text-lg font-bold dark:text-white">DriveRight</h2>
          <UserButton />
        </header>

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#e0f2fe] to-slate-100 dark:from-slate-900 dark:to-[#101922]">
          {children}
        </main>
      </div>
    </div>
  );
}
