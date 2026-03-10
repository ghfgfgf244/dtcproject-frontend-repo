import React from 'react';
import styles from './EnrollmentDashboard.module.css';

export const KPICards = () => {
  return (
    <div className={styles.kpiGrid}>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">person_add</span>
          <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+12.5%</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Enrollment</p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">1,284</h3>
      </div>
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <span className="material-symbols-outlined text-blue-500 bg-blue-500/10 p-2 rounded-lg">payments</span>
          <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+8.2%</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Monthly Revenue</p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">$45,200</h3>
      </div>
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <span className="material-symbols-outlined text-purple-500 bg-purple-500/10 p-2 rounded-lg">badge</span>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">Stable</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Collaborators</p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">42</h3>
      </div>
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <span className="material-symbols-outlined text-orange-500 bg-orange-500/10 p-2 rounded-lg">query_stats</span>
          <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+5.1%</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Conversion Rate</p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">18.5%</h3>
      </div>
    </div>
  );
};