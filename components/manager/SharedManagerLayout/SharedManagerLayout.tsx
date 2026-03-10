import React from 'react';
import { ManagerSidebar } from '@/components/manager/ManagerSidebar/ManagerSidebar';
import { ManagerHeader } from '@/components/manager/ManagerHeader/ManagerHeader';
import styles from './SharedManagerLayout.module.css';
import { AppRole } from '@/types/nav';

export default function SharedManagerLayout({ 
  children,
  role 
}: { 
  children: React.ReactNode;
  role: AppRole; // Nhận role từ app/layout.tsx
}) {
  return (
    <div className={`${styles.layoutWrapper} bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100`}>
      <ManagerSidebar role={role} />
      <main className={styles.mainContent}>
        <ManagerHeader />
        <div className={`${styles.contentArea} p-8`}>
          {children}
        </div>
      </main>
    </div>
  );
}