import React from 'react';
import styles from './AdminDashboard.module.css';

export const AdminKPICards = () => {
  return (
    <div className={styles.kpiGrid}>
      {/* Total Centers */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-shadow hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            <span className="material-symbols-outlined">location_on</span>
          </div>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">+2%</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Centers</p>
        <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">12</h3>
      </div>

      {/* Active Admins */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-shadow hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined">admin_panel_settings</span>
          </div>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">+5%</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Admins</p>
        <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">45</h3>
      </div>

      {/* Monthly Revenue */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-shadow hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </div>
          <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">+12%</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Monthly Revenue</p>
        <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">$84,200</h3>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col transition-shadow hover:shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
            <span className="material-symbols-outlined">verified_user</span>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">Stable</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">System Status</p>
        <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">Healthy</h3>
      </div>
    </div>
  );
};