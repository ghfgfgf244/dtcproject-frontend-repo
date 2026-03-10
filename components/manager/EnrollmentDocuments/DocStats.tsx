import React from 'react';
import styles from './EnrollmentDocuments.module.css';

export const DocStats = () => {
  return (
    <div className={styles.statsGrid}>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg material-symbols-outlined">verified</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Verified Compliance</p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">08</h3>
      </div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg material-symbols-outlined">draw</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Awaiting Signature</p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">01</h3>
      </div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <span className="p-2 bg-primary/10 text-primary rounded-lg material-symbols-outlined">update</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Updates Required</p>
        <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">00</h3>
      </div>
    </div>
  );
};