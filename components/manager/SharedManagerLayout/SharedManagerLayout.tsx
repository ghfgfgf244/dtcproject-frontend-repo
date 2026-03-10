import React from 'react';
import { ManagerSidebar } from '@/components/manager/ManagerSidebar/ManagerSidebar';
import { ManagerHeader } from '@/components/manager/ManagerHeader/ManagerHeader';
import styles from './SharedManagerLayout.module.css';

export default async function SharedManagerLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const currentRole = 'training_manager';

  return (
    <div className={`${styles.layoutWrapper} bg-[#f5f7f8] dark:bg-[#101922] font-display text-slate-900 dark:text-slate-100`}>
      
      {/* Sidebar nhận currentRole */}
      <ManagerSidebar role={currentRole} />

      <main className={styles.mainContent}>
        {/* Background Gradient (Trang trí bằng Tailwind) */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none"></div>

        <ManagerHeader />

        <div className={`${styles.contentArea} p-6 md:p-8`}>
          {children}
        </div>
      </main>
    </div>
  );
}