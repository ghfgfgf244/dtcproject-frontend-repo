"use client"; // Bắt buộc phải có vì sử dụng usePathname

import { UserButton, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Thêm hook này
// import { STUDENT_MENU } from "@/constants/navigation";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-light dark:bg-surface-dark border-r border-[#f0f2f5] dark:border-[#2a3b4c] flex-shrink-0 flex flex-col h-full z-20">
        <div className="p-6 pb-2">
          <div className="flex gap-3 items-center mb-8">
            <div className="bg-primary rounded-full size-10 flex items-center justify-center text-white">
              <span className="material-symbols-outlined">
                search_hands_free
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-tight">
                DriveSafe
              </h1>
              <p className="text-[#60758a] dark:text-gray-400 text-xs font-medium tracking-wider">
                Student Portal
              </p>
            </div>
          </div>

          {/* <nav className="flex flex-col gap-2">
            {STUDENT_MENU.map((item) => {
              // 1. Kiểm tra trạng thái Active dựa trên URL thực tế
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`
    group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
    ${
      isActive
        ? "bg-primary text-white !important" // Dùng !important nếu bị ghi đè
        : "text-slate-500 hover:bg-blue-50 hover:text-primary"
    }
  `}
                >
                  <span
                    className={`
    material-symbols-outlined
    ${isActive ? "text-white" : "text-slate-400 group-hover:text-primary"}
  `}
                  >
                    {item.icon}
                  </span>

                  <span
                    className={`
    text-sm font-medium
    ${isActive ? "text-white" : "group-hover:text-primary"}
  `}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav> */}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 bg-surface-light dark:bg-surface-dark border-b border-[#f0f2f5] dark:border-[#2a3b4c] flex-shrink-0">
          <h2 className="text-[#111418] dark:text-white text-lg font-bold">
            {/* Có thể thay đổi động dựa trên pathname nếu muốn */}
            Dashboard
          </h2>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

            <SignedIn>
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold leading-none">
                    Alex Morgan
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">ID: #8832</p>
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
