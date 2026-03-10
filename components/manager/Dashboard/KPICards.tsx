import React from 'react';

export const KPICards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <span className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg material-symbols-outlined">auto_stories</span>
          <span className="text-xs font-bold text-emerald-500 flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+2.4%</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Courses</p>
        <h3 className="text-2xl font-bold mt-1">24</h3>
      </div>
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <span className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg material-symbols-outlined">class</span>
          <span className="text-xs font-bold text-emerald-500 flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+12%</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Classes</p>
        <h3 className="text-2xl font-bold mt-1">12</h3>
      </div>
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <span className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg material-symbols-outlined">person</span>
          <span className="text-xs font-bold text-emerald-500 flex items-center bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">+18%</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Students</p>
        <h3 className="text-2xl font-bold mt-1">485</h3>
      </div>
      
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <span className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg material-symbols-outlined">verified</span>
          <span className="text-xs font-bold text-red-500 flex items-center bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">-0.5%</span>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg Pass Rate</p>
        <h3 className="text-2xl font-bold mt-1">88.4%</h3>
      </div>
    </div>
  );
};