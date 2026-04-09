'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MANAGER_MENUS } from '@/constants/manager-nav';
import { AppRole, NavItem } from '@/types/nav';
import styles from './ManagerSidebar.module.css';

export const ManagerSidebar = () => {
  const pathname = usePathname();
  
  // 1. Tự động nhận diện Role từ URL
  let activeRole: AppRole = 'TrainingManager';
  let displayName = 'Alex Admin';
  let roleTitle = 'Training Admin';
  
  if (pathname.startsWith('/enrollment-manager')) {
    activeRole = 'EnrollmentManager';
    displayName = 'Alex Rivera';
    roleTitle = 'Enrollment Admin';
  } else if (pathname.startsWith('/admin')) {
    activeRole = 'Admin';
    displayName = 'System Root';
    roleTitle = 'Super Admin';
  }

  // 2. Lấy menu tương ứng từ file constants
  const config = MANAGER_MENUS[activeRole as keyof typeof MANAGER_MENUS];

  return (
    <aside className={`${styles.sidebar} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0`}>
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
          <span className="material-symbols-outlined">directions_car</span>
        </div>
        <div className="overflow-hidden">
          <h1 className="text-slate-900 dark:text-white font-bold text-lg leading-tight truncate">
            Drive Safe
          </h1>
          <p className="text-primary text-xs font-medium uppercase tracking-wider truncate">
            {config?.title}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`${styles.navContainer} px-4 py-4 space-y-1`}>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 mt-2">
          Main Menu
        </div>
        
        {config?.items.map((item: NavItem) => {
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
              <span className="text-sm truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};