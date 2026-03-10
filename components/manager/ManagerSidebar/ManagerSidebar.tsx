'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MANAGER_MENUS } from '@/constants/manager-nav';
import { AppRole, NavItem } from '@/types/nav'; // Import từ types/nav.ts
import styles from './ManagerSidebar.module.css';

interface SidebarProps {
  role: AppRole; // Đã đổi sang dùng AppRole thay cho ManagerRole cũ
}

export const ManagerSidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  
  // Ép kiểu an toàn (để tránh lỗi nếu ai đó truyền nhầm role 'Student' vào)
  const config = MANAGER_MENUS[role as keyof typeof MANAGER_MENUS] || MANAGER_MENUS['TrainingManager']; 

  return (
    <aside className={`${styles.sidebar} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800`}>
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined">directions_car</span>
        </div>
        <div>
          <h1 className="text-slate-900 dark:text-white font-bold text-lg leading-tight">
            {/* Logic hiển thị tên linh hoạt theo role */}
            {role === 'TrainingManager' ? 'Training Manager' : 
             role === 'EnrollmentManager' ? 'Enrollment Manager' : 
             role === 'Admin' ? 'System Admin' : 'Manager'}
          </h1>
          <p className="text-primary text-xs font-medium uppercase tracking-wider">
            {config?.title}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`${styles.navContainer} px-4 py-4 space-y-1`}>
        {config?.items.map((item: NavItem) => {
          // Kiểm tra xem URL hiện tại có trùng với href của menu item không
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 dark:text-slate-400 hover:bg-primary/5 hover:text-primary dark:hover:bg-slate-800 dark:hover:text-primary"
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 🚀 Mock User Profile Profile ở đáy Sidebar (Thêm vào cho giống bản thiết kế mới) */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <div className="size-10 rounded-full bg-slate-300 overflow-hidden shrink-0">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Alex Admin</p>
            <p className="text-xs text-slate-500 truncate">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};