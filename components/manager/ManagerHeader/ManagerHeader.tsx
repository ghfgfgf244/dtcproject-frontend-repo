'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { NotificationBell } from '@/components/manager/Notification/NotificationBell';
import styles from './ManagerHeader.module.css';

export const ManagerHeader = () => {
  const pathname = usePathname();
  
  // 1. Tạo Title tự động từ URL (VD: /enrollment/collaborators -> Collaborators)
  const segments = pathname.split('/').filter(Boolean);
  const currentSegment = segments[segments.length - 1] || 'Dashboard';
  const pageTitle = currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1).replace(/-/g, ' ');

  // 2. Tự động nhận diện Role để hiển thị Avatar giả lập cho đúng
  let activeRole = 'TrainingManager';
  let displayName = 'Alex Admin';
  let roleTitle = 'Training Admin';
  
  if (pathname.startsWith('/enrollment')) {
    activeRole = 'EnrollmentManager';
    displayName = 'Alex Rivera';
    roleTitle = 'Enrollment Admin';
  } else if (pathname.startsWith('/admin')) {
    activeRole = 'Admin';
    displayName = 'System Root';
    roleTitle = 'Super Admin';
  }

  return (
    <header className={`${styles.header} bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 sticky top-0 z-40`}>
      
      {/* Cột trái: Dynamic Title */}
      <div className="flex items-center gap-4 flex-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
          {pageTitle}
        </h2>
      </div>
      
      {/* Cột phải: Actions & Mock Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        {/* Nút Settings */}
        <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <span className="material-symbols-outlined text-[22px]">settings</span>
        </button>

        {/* 🚀 Tích hợp Component Notification Bell vào đây */}
        <NotificationBell />
        
        {/* Vách ngăn */}
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>
        
        {/* Mock User Profile (Không dùng Clerk) */}
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-none text-slate-900 dark:text-white">{displayName}</p>
            <p className="text-xs text-slate-500 mt-1">{roleTitle}</p>
          </div>
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden border-2 border-primary/20 shrink-0">
            {/* Ảnh Avatar tự động đổi theo Role */}
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeRole}Profile`} 
              alt="Profile" 
              className="w-full h-full object-cover bg-white" 
            />
          </div>
        </div>
        
      </div>
    </header>
  );
};