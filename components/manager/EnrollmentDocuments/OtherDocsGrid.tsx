import React from 'react';
import styles from './EnrollmentDocuments.module.css';

export const OtherDocsGrid = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">folder_open</span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Certifications & Materials</h3>
      </div>
      <div className={styles.cardsGrid}>
        
        {/* Document Card 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">campaign</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">Valid</span>
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">Digital_Marketing_Cert.pdf</h4>
          <div className="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400">
            <span>Uploaded: Sep 15, 2024</span>
            <span>Size: 1.2 MB</span>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">visibility</span> Preview
            </button>
            <button className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">download</span> Download
            </button>
          </div>
        </div>

        {/* Document Card 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/50 transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">menu_book</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider">Valid</span>
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">Sales_Guidelines_v3.pdf</h4>
          <div className="flex flex-col gap-1 text-sm text-slate-500 dark:text-slate-400">
            <span>Uploaded: Jan 05, 2026</span>
            <span>Size: 3.5 MB</span>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">visibility</span> Preview
            </button>
            <button className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">download</span> Download
            </button>
          </div>
        </div>

        {/* Upload Placeholder Card */}
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center p-8 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group">
          <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-3">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <p className="font-bold text-slate-400 group-hover:text-primary transition-colors">Upload Certification</p>
        </div>

      </div>
    </div>
  );
};