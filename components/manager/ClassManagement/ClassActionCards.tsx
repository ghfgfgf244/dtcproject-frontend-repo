import React from 'react';
import styles from './ClassActionCards.module.css';

export const ClassActionCards = () => {
  return (
    <div className={styles.actionGrid}>
      <div className="relative overflow-hidden p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group transition-all hover:border-primary/50 shadow-sm cursor-pointer">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors"></div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">file_download</span>
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white">Export Class Reports</h4>
            <p className="text-sm text-slate-500 mt-1">Generate comprehensive PDF or CSV reports for all active classes including attendance and performance.</p>
            <span className="mt-4 text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
              Download Now <span className="material-symbols-outlined text-base">arrow_forward</span>
            </span>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 group transition-all hover:border-primary/50 shadow-sm cursor-pointer">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors"></div>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">auto_stories</span>
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white">Course Library</h4>
            <p className="text-sm text-slate-500 mt-1">Browse and assign curriculum from the central repository to new or existing training batches.</p>
            <span className="mt-4 text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
              Browse Library <span className="material-symbols-outlined text-base">arrow_forward</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};