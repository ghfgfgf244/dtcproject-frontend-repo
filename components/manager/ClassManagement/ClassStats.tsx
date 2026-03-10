import React from 'react';
import styles from './ClassStats.module.css';

export const ClassStats = () => {
  return (
    <div className={styles.statsGrid}>
      {/* Total Classes */}
      <div className="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-2xl text-white shadow-xl shadow-primary/10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Active Classes</p>
            <h3 className="text-3xl font-bold mt-1">24</h3>
          </div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
            <span className="material-symbols-outlined">group_work</span>
          </div>
        </div>
        <p className="text-xs text-blue-100 mt-4 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          +3 since last month
        </p>
      </div>

      {/* Pending Starts */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Starts</p>
            <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">8</h3>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-600 dark:text-slate-400">
            <span className="material-symbols-outlined">calendar_today</span>
          </div>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-5">
          <div className="bg-primary h-1.5 rounded-full w-2/3"></div>
        </div>
      </div>

      {/* Average Completion */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Completion Rate</p>
            <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">92%</h3>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-600 dark:text-slate-400">
            <span className="material-symbols-outlined">verified</span>
          </div>
        </div>
        <p className="text-xs text-green-500 mt-4 flex items-center gap-1 font-semibold uppercase tracking-wider">
          Above Target
        </p>
      </div>
    </div>
  );
};