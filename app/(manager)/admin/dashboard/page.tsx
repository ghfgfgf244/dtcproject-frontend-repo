import React from 'react';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { AdminKPICards } from '@/components/manager/AdminDashboard/AdminKPICards';
import { FinancialChart } from '@/components/manager/AdminDashboard/FinancialChart';
import { SystemAlerts } from '@/components/manager/AdminDashboard/SystemAlert';
import { AdminActivityTable } from '@/components/manager/AdminDashboard/AdminActivityTable';
import styles from '@/components/manager/AdminDashboard/AdminDashboard.module.css';

export default function AdminDashboardPage() {
  const breadcrumbs = [
    { label: 'System Admin' },
    { label: 'Dashboard' }
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Page Title & Breadcrumbs */}
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-3xl font-extrabold tracking-tight mt-[-10px] text-slate-900 dark:text-white">
          System Overview
        </h1>
        <p className="text-slate-500 mt-1">
          Monitor global operations, system health, and administrative actions.
        </p>
      </div>

      {/* KPIs */}
      <AdminKPICards />

      {/* Middle Content */}
      <div className={styles.middleGrid}>
        <FinancialChart />
        <SystemAlerts />
      </div>

      {/* Bottom Table */}
      <AdminActivityTable />
    </div>
  );
}