'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { UserButton } from "@clerk/nextjs";
import styles from './ManagerHeader.module.css';

export const ManagerHeader = () => {
  const pathname = usePathname();
  
  // Xử lý Route Navigation (Tạo title từ URL)
  const segments = pathname.split('/').filter(Boolean);
  const currentSegment = segments[segments.length - 1] || 'Dashboard';
  const pageTitle = currentSegment.charAt(0).toUpperCase() + currentSegment.slice(1).replace('-', ' ');

  return (
    <header className={`${styles.header} px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800`}>
      
      {/* 1. Route Navigation */}
      <div className="flex items-center gap-2 flex-1">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize">
          {pageTitle}
        </h2>
      </div>
      
      {/* 2. Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        {/* Settings Icon */}
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors tooltip-trigger" title="Settings">
          <span className="material-symbols-outlined text-[22px]">settings</span>
        </button>

        {/* Notification Bell */}
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 relative transition-colors tooltip-trigger" title="Notifications">
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
        </button>
        
        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
        
        {/* Clerk User Profile */}
        <div className="flex items-center justify-center hover:scale-105 transition-transform">
          <UserButton afterSignOutUrl="/" />
        </div>
        
      </div>
    </header>
  );
};