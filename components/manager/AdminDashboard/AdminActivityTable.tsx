import React from 'react';
import styles from './AdminDashboard.module.css';

export const AdminActivityTable = () => {
  return (
    <div className={`${styles.tableWrapper} bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800`}>
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Administrative Activity</h3>
          <p className="text-sm text-slate-500">Tracking latest manager and system actions</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-bold text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <span className="material-symbols-outlined text-lg">filter_list</span>
          Filter Logs
        </button>
      </div>
      
      <div className={styles.scrollArea}>
        <table className={`${styles.mainTable} text-left`}>
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Center</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Time</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
              <td className="px-8 py-4 flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">JD</div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">John Doe</p>
                  <p className="text-xs text-slate-400">Manager</p>
                </div>
              </td>
              <td className="px-8 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">Updated Course Pricing</td>
              <td className="px-8 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">East Hub Central</td>
              <td className="px-8 py-4 text-sm text-slate-500">10:45 AM</td>
              <td className="px-8 py-4 text-right">
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">Completed</span>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
              <td className="px-8 py-4 flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">MK</div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Marcus King</p>
                  <p className="text-xs text-slate-400">Senior Admin</p>
                </div>
              </td>
              <td className="px-8 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">Revoked Access Role</td>
              <td className="px-8 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">Corporate Office</td>
              <td className="px-8 py-4 text-sm text-slate-500">09:12 AM</td>
              <td className="px-8 py-4 text-right">
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">Completed</span>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
              <td className="px-8 py-4 flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">LL</div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Linda Liao</p>
                  <p className="text-xs text-slate-400">Financial Lead</p>
                </div>
              </td>
              <td className="px-8 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">Processed Monthly Rebates</td>
              <td className="px-8 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">West Lake Center</td>
              <td className="px-8 py-4 text-sm text-slate-500">Yesterday</td>
              <td className="px-8 py-4 text-right">
                <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-xs font-bold">Pending</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};