import React from 'react';
import styles from './TrainingDocuments.module.css';

export const IdentityTable = () => {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">badge</span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Identity & Certifications</h3>
      </div>
      <div className={`${styles.tableWrapper} bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm`}>
        <div className={styles.scrollArea}>
          <table className={`${styles.mainTable} text-left`}>
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">File Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Document Type</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Upload Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">File Size</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Instructor_License_2024.pdf</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">Teaching License</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">Oct 12, 2023</td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">2.4 MB</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                    <span className="size-1.5 rounded-full bg-green-500"></span>
                    Verified
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary hover:text-primary/80 font-bold text-sm">View/Download</button>
                </td>
              </tr>
              {/* ... (Các dòng khác trong HTML tương tự) ... */}
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Advanced_Driving_Degree.pdf</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">Degree</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">Jan 20, 2024</td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">3.8 MB</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary hover:text-primary/80 font-bold text-sm">View/Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};