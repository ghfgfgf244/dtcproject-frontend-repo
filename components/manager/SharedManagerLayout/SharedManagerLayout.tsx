import React from 'react';
import { ManagerSidebar } from '@/components/manager/ManagerSidebar/ManagerSidebar';
import { ManagerHeader } from '@/components/manager/ManagerHeader/ManagerHeader';
import styles from './SharedManagerLayout.module.css';

export default function SharedManagerLayout({ 
  children
}: { 
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.layoutWrapper} bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100`}>
      
      {/* 🚀 Sidebar tự lo việc check URL, không cần truyền prop */}
      <ManagerSidebar />

      <main className={styles.mainContent}>
        
        {/* 🚀 Header tự lo việc check URL, không cần truyền prop */}
        <ManagerHeader />

        <div className={`${styles.contentArea} p-8`}>
          {children}
        </div>
      </main>
    </div>
  );
}