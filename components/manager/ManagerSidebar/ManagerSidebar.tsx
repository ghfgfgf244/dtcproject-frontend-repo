'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { MANAGER_MENUS, ManagerRole, NavItem } from '@/constants/manager-nav';
import styles from './ManagerSidebar.module.css';

interface SidebarProps {
  role: ManagerRole;
}

export const ManagerSidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  // Fallback an toàn nếu role truyền vào không khớp
  const config = MANAGER_MENUS[role] || MANAGER_MENUS['training_manager']; 

  return (
    <aside className={`${styles.sidebar} bg-white border-r border-primary/10`}>
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined">directions_car</span>
        </div>
        <div>
          <h1 className="text-slate-900 font-bold text-lg leading-tight">
            {role === 'training_manager' ? 'Training Manager' : 'Manager'}
          </h1>
          <p className="text-primary text-xs font-medium uppercase tracking-wider">
            {config?.title}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`${styles.navContainer} px-4 py-4 space-y-1`}>
        {config?.items.map((item: NavItem) => {
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-primary/5 hover:text-primary"
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
    </aside>
  );
};