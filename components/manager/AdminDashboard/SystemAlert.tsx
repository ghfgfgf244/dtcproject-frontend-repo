import React from 'react';

export const SystemAlerts = () => {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">System Alerts</h3>
        <button className="text-xs font-bold text-primary hover:underline">View All</button>
      </div>
      
      <div className="space-y-6 flex-1">
        <div className="flex gap-4">
          <div className="size-10 shrink-0 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <span className="material-symbols-outlined text-xl">warning</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Role Update Pending</p>
            <p className="text-xs text-slate-500 mt-0.5">Manager #402 requires access approval for Finance module.</p>
            <p className="text-[10px] mt-1.5 font-bold text-slate-400 uppercase">2 mins ago</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="size-10 shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <span className="material-symbols-outlined text-xl">backup</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">Cloud Sync Success</p>
            <p className="text-xs text-slate-500 mt-0.5">Global system backup completed successfully.</p>
            <p className="text-[10px] mt-1.5 font-bold text-slate-400 uppercase">45 mins ago</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="size-10 shrink-0 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <span className="material-symbols-outlined text-xl">person_add</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">New Admin Registered</p>
            <p className="text-xs text-slate-500 mt-0.5">Sarah Jenkins assigned to North Center hub.</p>
            <p className="text-[10px] mt-1.5 font-bold text-slate-400 uppercase">2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};