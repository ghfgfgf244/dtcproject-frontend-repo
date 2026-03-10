import React from 'react';
import styles from './AdminDashboard.module.css';

export const FinancialChart = () => {
  return (
    <div className={`${styles.chartSection} bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Financial Overview</h3>
          <p className="text-sm text-slate-500">Revenue growth over the last 6 months</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-lg shrink-0">
          <button className="px-3 py-1 text-xs font-bold rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm">Monthly</button>
          <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">Quarterly</button>
        </div>
      </div>
      
      <div className="h-64 w-full relative">
        <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
          <defs>
            <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#258cf4" stopOpacity="0.2"></stop>
              <stop offset="100%" stopColor="#258cf4" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          {/* Grid Lines */}
          <line className="text-slate-100 dark:text-slate-800" stroke="currentColor" strokeDasharray="4" x1="0" x2="800" y1="40" y2="40"></line>
          <line className="text-slate-100 dark:text-slate-800" stroke="currentColor" strokeDasharray="4" x1="0" x2="800" y1="100" y2="100"></line>
          <line className="text-slate-100 dark:text-slate-800" stroke="currentColor" strokeDasharray="4" x1="0" x2="800" y1="160" y2="160"></line>
          <line className="text-slate-100 dark:text-slate-800" stroke="currentColor" strokeDasharray="4" x1="0" x2="800" y1="220" y2="220"></line>
          
          {/* Area Gradient */}
          <path d="M0,220 L0,180 C100,160 150,200 250,140 C350,80 450,120 550,60 C650,0 750,40 800,20 L800,220 Z" fill="url(#revenueGradient)"></path>
          
          {/* Main Trend Line (Sử dụng màu primary của dự án) */}
          <path d="M0,180 C100,160 150,200 250,140 C350,80 450,120 550,60 C650,0 750,40 800,20" fill="none" stroke="#258cf4" strokeLinecap="round" strokeWidth="4"></path>
          
          {/* Data Points */}
          <circle className="animate-pulse" cx="250" cy="140" fill="#258cf4" r="6"></circle>
          <circle cx="550" cy="60" fill="#258cf4" r="6"></circle>
          <circle cx="800" cy="20" fill="#258cf4" r="6"></circle>
        </svg>
        
        <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 uppercase tracking-tighter">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
        </div>
      </div>
    </div>
  );
};